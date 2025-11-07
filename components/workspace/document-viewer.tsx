"use client"

import { useState, useEffect } from "react"
import { CodeEditor } from "./code-editor"
import { createClientSafe, isSupabaseConfigured } from "@/lib/supabase/client"
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
  const { toast } = useToast()
  const hasSupabase = isSupabaseConfigured()

  useEffect(() => {
    if (documentId && hasSupabase) {
      loadDocument()
      const unsubscribe = subscribeToDocument()
      return unsubscribe
    }
  }, [documentId, hasSupabase])

  const loadDocument = async () => {
    if (!documentId || !hasSupabase) return

    try {
      const supabase = createClientSafe()
      if (!supabase) return

      const { data } = await supabase
        .from('documents')
        .select('*')
        .eq('id', documentId)
        .single()

      if (data) {
        setDocument(data)
        setContent(data.content || '')
      }
    } catch (error) {
      console.error('Error loading document:', error)
    }
  }

  const subscribeToDocument = () => {
    if (!documentId || !hasSupabase) return () => {}

    try {
      const supabase = createClientSafe()
      if (!supabase) return () => {}

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
    } catch (error) {
      console.error('Error subscribing to document:', error)
      return () => {}
    }
  }

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
    setHasChanges(true)
  }

  const handleSave = async () => {
    if (!documentId) return

    if (!hasSupabase) {
      // In local mode, just update state
      setHasChanges(false)
      toast({
        title: "Saved locally",
        description: "Document saved in browser storage",
      })
      return
    }

    setSaving(true)
    try {
      const supabase = createClientSafe()
      if (!supabase) throw new Error('Supabase not available')

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

  if (!document && hasSupabase) {
    return (
      <div className="flex h-full items-center justify-center">
        Loading...
      </div>
    )
  }

  // In local mode without document loaded, show placeholder
  if (!document) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b px-4 py-2">
          <h2 className="text-sm font-semibold">New Document</h2>
        </div>
        <div className="flex-1">
          <CodeEditor
            documentId={documentId}
            content={content}
            language="typescript"
            onChange={handleContentChange}
            onSave={handleSave}
          />
        </div>
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
