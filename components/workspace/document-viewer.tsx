"use client"

import { useState, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { createSupabaseClient } from "@/lib/supabase/client"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism"

interface DocumentViewerProps {
  documentId: string | null
  projectId: string | null
}

export function DocumentViewer({ documentId, projectId }: DocumentViewerProps) {
  const [document, setDocument] = useState<any>(null)
  const [content, setContent] = useState("")
  const supabase = createSupabaseClient()

  useEffect(() => {
    if (documentId) {
      loadDocument()
      subscribeToDocument()
    }
  }, [documentId])

  const loadDocument = async () => {
    if (!documentId) return

    const { data } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single()

    if (data) {
      setDocument(data)
      setContent(data.content || '')
    }
  }

  const subscribeToDocument = () => {
    if (!documentId) return

    const channel = supabase
      .channel(`document:${documentId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'documents',
          filter: `id=eq.${documentId}`,
        },
        (payload) => {
          const updated = payload.new as any
          setDocument(updated)
          setContent(updated.content || '')
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const handleContentChange = async (newContent: string) => {
    setContent(newContent)

    // Debounce save
    if (!documentId) return

    // Save to database
    await supabase
      .from('documents')
      .update({ content: newContent })
      .eq('id', documentId)
  }

  if (!documentId) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Select a document to view
      </div>
    )
  }

  if (!document) {
    return (
      <div className="flex h-full items-center justify-center">
        Loading...
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4">
        <h2 className="text-sm font-semibold">{document.name}</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4">
          {document.language ? (
            <SyntaxHighlighter
              language={document.language}
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                borderRadius: '0.5rem',
                padding: '1rem',
              }}
            >
              {content}
            </SyntaxHighlighter>
          ) : (
            <textarea
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              className="min-h-full w-full resize-none border-0 bg-transparent p-4 font-mono text-sm focus:outline-none"
              placeholder="Start typing..."
            />
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

