"use client"

import { useState, useEffect } from "react"
import { CodeEditor } from "./code-editor"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"

interface DocumentViewerProps {
  documentId: string | null
  projectId: string | null
}

export function DocumentViewer({ documentId, projectId }: DocumentViewerProps) {
  const [document, setDocument] = useState<any>(null)
  const [content, setContent] = useState("")
  const [hasChanges, setHasChanges] = useState(false)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()
  const { toast } = useToast()

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

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
    setHasChanges(true)
  }

  const handleSave = async () => {
    if (!documentId) return

    setSaving(true)
    try {
      await supabase
        .from('documents')
        .update({ content })
        .eq('id', documentId)

      setHasChanges(false)
      toast({
        title: "Saved",
        description: "Document saved successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save document",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  // Auto-save after 2 seconds of no changes
  useEffect(() => {
    if (!hasChanges) return

    const timer = setTimeout(() => {
      handleSave()
    }, 2000)

    return () => clearTimeout(timer)
  }, [content, hasChanges])

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
      <div className="flex items-center justify-between border-b px-4 py-2">
        <h2 className="text-sm font-semibold">{document.name}</h2>
        {hasChanges && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={saving}
          >
            <Save className="mr-2 h-3 w-3" />
            {saving ? "Saving..." : "Save"}
          </Button>
        )}
      </div>
      <div className="flex-1">
        <CodeEditor
          documentId={documentId}
          content={content}
          language={document.language || "plaintext"}
          onChange={handleContentChange}
          onSave={handleSave}
        />
      </div>
    </div>
  )
}
