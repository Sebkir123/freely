"use client"

import { useState, useEffect, useRef } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User } from "lucide-react"
import { createClientSafe, isSupabaseConfigured } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface ChatPanelProps {
  projectId: string | null
  workspaceId: string
}

export function ChatPanel({ projectId, workspaceId }: ChatPanelProps) {
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const hasSupabase = isSupabaseConfigured()

  useEffect(() => {
    if (projectId && hasSupabase) {
      loadOrCreateConversation()
    }
  }, [projectId, hasSupabase])

  useEffect(() => {
    if (conversationId && hasSupabase) {
      loadMessages()
      const unsubscribe = subscribeToMessages()
      return unsubscribe
    }
  }, [conversationId, hasSupabase])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadOrCreateConversation = async () => {
    if (!projectId || !hasSupabase) return

    try {
      const supabase = createClientSafe()
      if (!supabase) return

      // Try to get existing conversation
      const { data: existing } = await supabase
        .from('conversations')
        .select('id')
        .eq('project_id', projectId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single()

      if (existing) {
        setConversationId(existing.id)
      } else {
        // Create new conversation
        const { data: newConv } = await supabase
          .from('conversations')
          .insert({
            project_id: projectId,
            title: 'New Conversation',
            created_by: '00000000-0000-0000-0000-000000000000', // Single user
          })
          .select()
          .single()

        if (newConv) {
          setConversationId(newConv.id)
        }
      }
    } catch (error) {
      console.error('Error loading conversation:', error)
    }
  }

  const loadMessages = async () => {
    if (!conversationId || !hasSupabase) return

    try {
      const supabase = createClientSafe()
      if (!supabase) return

      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (data) {
        setMessages(data)
      }
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  const subscribeToMessages = () => {
    if (!conversationId || !hasSupabase) return () => {}

    try {
      const supabase = createClientSafe()
      if (!supabase) return () => {}

      const channel = supabase
        .channel(`messages:${conversationId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${conversationId}`,
          },
          (payload) => {
            setMessages((prev) => [...prev, payload.new as any])
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    } catch (error) {
      console.error('Error subscribing to messages:', error)
      return () => {}
    }
  }

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput("")
    setLoading(true)

    // Add user message locally
    const localUserMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      created_at: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, localUserMsg])

    // If Supabase is configured, save to database
    if (conversationId && hasSupabase) {
      try {
        const supabase = createClientSafe()
        if (supabase) {
          await supabase
            .from('messages')
            .insert({
              conversation_id: conversationId,
              role: 'user',
              content: userMessage,
              created_by: '00000000-0000-0000-0000-000000000000',
            })
        }
      } catch (error) {
        console.error('Error saving message:', error)
      }
    }

    // Call AI API
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          projectId,
          workspaceId,
          message: userMessage,
          history: messages.map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantContent = ''

      // Create placeholder assistant message
      const placeholderId = Date.now().toString()
      const placeholderMsg = {
        id: placeholderId,
        role: 'assistant',
        content: '',
        created_at: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, placeholderMsg])

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split('\n').filter(line => line.trim())

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') continue

              try {
                const parsed = JSON.parse(data)
                if (parsed.content) {
                  assistantContent += parsed.content
                  // Update message in real-time
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === placeholderId
                        ? { ...msg, content: assistantContent }
                        : msg
                    )
                  )
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      }

      // Save assistant message if Supabase is configured
      if (conversationId && hasSupabase && assistantContent) {
        try {
          const supabase = createClientSafe()
          if (supabase) {
            await supabase
              .from('messages')
              .insert({
                conversation_id: conversationId,
                role: 'assistant',
                content: assistantContent,
              })
          }
        } catch (error) {
          console.error('Error saving assistant message:', error)
        }
      }
    } catch (error: any) {
      console.error('Error calling AI:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to get AI response. Please check your API keys and try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  if (!projectId) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-center text-muted-foreground">
        Select a project to start chatting
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4">
        <h2 className="text-sm font-semibold">AI Chat</h2>
        {!hasSupabase && (
          <p className="text-xs text-muted-foreground mt-1">
            Running in local mode
          </p>
        )}
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  "max-w-[80%] rounded-lg px-4 py-2",
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                )}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
              {message.role === 'user' && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="rounded-lg bg-muted px-4 py-2">
                <p className="text-sm text-muted-foreground">Thinking...</p>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="flex gap-2"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="min-h-[60px] resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
          />
          <Button type="submit" disabled={loading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
