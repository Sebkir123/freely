"use client"

import { useState, useEffect, useRef } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User, Sparkles } from "lucide-react"
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
        const { data: newConv } = await supabase
          .from('conversations')
          .insert({
            project_id: projectId,
            title: 'New Conversation',
            created_by: '00000000-0000-0000-0000-000000000000',
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

    const localUserMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      created_at: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, localUserMsg])

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
      <div className="flex h-full items-center justify-center p-8 text-center bg-gradient-to-b from-white to-slate-50">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto">
            <Sparkles className="h-8 w-8 text-purple-600" />
          </div>
          <div>
            <p className="text-lg font-medium text-slate-700">AI Assistant Ready</p>
            <p className="text-sm text-slate-500">Select a project to start chatting</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-white to-slate-50">
      <div className="border-b border-slate-200 p-4 bg-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-700">AI Assistant</h2>
            {!hasSupabase && (
              <p className="text-xs text-slate-500">Local mode</p>
            )}
          </div>
        </div>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300",
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {message.role === 'assistant' && (
                <Avatar className="h-8 w-8 border-2 border-purple-100">
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500">
                    <Bot className="h-4 w-4 text-white" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-3 shadow-sm transition-all hover:shadow-md",
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-white border border-slate-200'
                )}
              >
                <p className={cn(
                  "text-sm whitespace-pre-wrap leading-relaxed",
                  message.role === 'assistant' && "text-slate-700"
                )}>
                  {message.content || <span className="text-slate-400">Thinking...</span>}
                </p>
              </div>
              {message.role === 'user' && (
                <Avatar className="h-8 w-8 border-2 border-purple-100">
                  <AvatarFallback className="bg-gradient-to-r from-slate-500 to-slate-600">
                    <User className="h-4 w-4 text-white" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-2">
              <Avatar className="h-8 w-8 border-2 border-purple-100">
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500">
                  <Bot className="h-4 w-4 text-white animate-pulse" />
                </AvatarFallback>
              </Avatar>
              <div className="rounded-2xl bg-white border border-slate-200 px-4 py-3 shadow-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>
      <div className="border-t border-slate-200 p-4 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="flex gap-3"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className="min-h-[60px] resize-none border-slate-200 focus:border-purple-400 focus:ring-purple-400 rounded-xl"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
          />
          <Button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-sm hover:shadow-md transition-all self-end"
            size="lg"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
