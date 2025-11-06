"use client"

import { useEffect, useRef, useState } from "react"
import Editor, { OnMount } from "@monaco-editor/react"
import type { editor } from "monaco-editor"
import { Button } from "@/components/ui/button"
import { Save, Copy, Download, Play } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CodeEditorProps {
  documentId: string | null
  content: string
  language: string
  onChange: (value: string) => void
  onSave?: () => void
  readOnly?: boolean
}

export function CodeEditor({
  documentId,
  content,
  language,
  onChange,
  onSave,
  readOnly = false,
}: CodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const [theme, setTheme] = useState<"vs-dark" | "light">("vs-dark")
  const { toast } = useToast()

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor

    // Configure editor
    editor.updateOptions({
      fontSize: 14,
      fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
      fontLigatures: true,
      minimap: { enabled: true },
      lineNumbers: "on",
      renderWhitespace: "selection",
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      wordWrap: "on",
      formatOnPaste: true,
      formatOnType: true,
    })

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      onSave?.()
    })

    // Add custom themes
    monaco.editor.defineTheme("freely-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#0d1117",
        "editor.foreground": "#c9d1d9",
        "editor.lineHighlightBackground": "#161b22",
        "editorCursor.foreground": "#58a6ff",
        "editor.selectionBackground": "#264f78",
      },
    })

    monaco.editor.setTheme("freely-dark")
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      toast({
        title: "Copied!",
        description: "Code copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `code-${documentId || "untitled"}.${getFileExtension(language)}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Downloaded!",
      description: "File downloaded successfully",
    })
  }

  const getFileExtension = (lang: string): string => {
    const extensions: Record<string, string> = {
      typescript: "ts",
      javascript: "js",
      python: "py",
      java: "java",
      go: "go",
      rust: "rs",
      cpp: "cpp",
      c: "c",
      csharp: "cs",
      html: "html",
      css: "css",
      json: "json",
      markdown: "md",
      yaml: "yaml",
      xml: "xml",
      sql: "sql",
    }
    return extensions[lang] || "txt"
  }

  const getLanguageForMonaco = (lang: string): string => {
    // Map common language names to Monaco language IDs
    const languageMap: Record<string, string> = {
      typescript: "typescript",
      javascript: "javascript",
      tsx: "typescript",
      jsx: "javascript",
      python: "python",
      java: "java",
      go: "go",
      rust: "rust",
      cpp: "cpp",
      c: "c",
      csharp: "csharp",
      html: "html",
      css: "css",
      scss: "scss",
      json: "json",
      markdown: "markdown",
      yaml: "yaml",
      xml: "xml",
      sql: "sql",
      shell: "shell",
      bash: "shell",
      dockerfile: "dockerfile",
    }
    return languageMap[lang.toLowerCase()] || "plaintext"
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {language.toUpperCase()}
          </span>
        </div>
        <div className="flex gap-1">
          {onSave && !readOnly && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8"
              onClick={onSave}
              title="Save (Ctrl+S)"
            >
              <Save className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-8"
            onClick={handleCopy}
            title="Copy to clipboard"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8"
            onClick={handleDownload}
            title="Download file"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1">
        <Editor
          height="100%"
          defaultLanguage={getLanguageForMonaco(language)}
          language={getLanguageForMonaco(language)}
          value={content}
          onChange={(value) => onChange(value || "")}
          onMount={handleEditorDidMount}
          options={{
            readOnly,
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
          }}
          theme="freely-dark"
        />
      </div>
    </div>
  )
}
