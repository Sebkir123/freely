'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Search, FileText, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchResult {
  fileId: string
  fileName: string
  line: number
  content: string
  matchStart: number
  matchEnd: number
}

interface GlobalSearchProps {
  files: Array<{ id: string; name: string; content: string }>
  onResultClick?: (fileId: string, line: number) => void
}

export function GlobalSearch({ files, onResultClick }: GlobalSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Search through files
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const searchResults: SearchResult[] = []
    const searchTerm = query.toLowerCase()

    files.forEach(file => {
      const lines = file.content.split('\n')
      lines.forEach((line, lineIndex) => {
        const lowerLine = line.toLowerCase()
        let matchIndex = lowerLine.indexOf(searchTerm)

        while (matchIndex !== -1) {
          searchResults.push({
            fileId: file.id,
            fileName: file.name,
            line: lineIndex + 1,
            content: line.trim(),
            matchStart: matchIndex,
            matchEnd: matchIndex + searchTerm.length
          })

          // Look for next occurrence in same line
          matchIndex = lowerLine.indexOf(searchTerm, matchIndex + 1)
        }
      })
    })

    setResults(searchResults)
    setSelectedIndex(0)
  }, [query, files])

  // Keyboard handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+Shift+F or Ctrl+Shift+F to open
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'f') {
        e.preventDefault()
        setIsOpen(prev => !prev)
        return
      }

      if (!isOpen) return

      if (e.key === 'Escape') {
        setIsOpen(false)
        setQuery('')
        return
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1))
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => Math.max(prev - 1, 0))
      }

      if (e.key === 'Enter' && results[selectedIndex]) {
        e.preventDefault()
        const result = results[selectedIndex]
        onResultClick?.(result.fileId, result.line)
        setIsOpen(false)
        setQuery('')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, results, selectedIndex, onResultClick])

  const highlightMatch = (text: string, start: number, end: number) => {
    return (
      <>
        {text.substring(0, start)}
        <span className="bg-yellow-200 text-slate-900 font-semibold">
          {text.substring(start, end)}
        </span>
        {text.substring(end)}
      </>
    )
  }

  // Group results by file
  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.fileName]) {
      acc[result.fileName] = []
    }
    acc[result.fileName].push(result)
    return acc
  }, {} as Record<string, SearchResult[]>)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-3xl p-0 gap-0 overflow-hidden max-h-[80vh]">
        <div className="flex items-center gap-3 px-4 py-3 border-b bg-gradient-to-r from-purple-50 to-pink-50">
          <Search className="h-4 w-4 text-slate-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search in all files..."
            className="border-0 focus-visible:ring-0 shadow-none bg-transparent"
            autoFocus
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-mono bg-white border rounded">
            ⌘⇧F
          </kbd>
        </div>

        <div className="max-h-[500px] overflow-y-auto p-2">
          {!query.trim() ? (
            <div className="py-12 text-center">
              <Search className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500">
                Search across all files in your project
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Press ⌘⇧F to open search anytime
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-slate-500">No results found</p>
              <p className="text-xs text-slate-400 mt-1">
                Try a different search term
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedResults).map(([fileName, fileResults]) => (
                <div key={fileName} className="space-y-1">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg sticky top-0">
                    <FileText className="h-3 w-3 text-slate-500" />
                    <span className="text-xs font-semibold text-slate-700">
                      {fileName}
                    </span>
                    <span className="text-xs text-slate-500">
                      ({fileResults.length} result{fileResults.length !== 1 ? 's' : ''})
                    </span>
                  </div>

                  <div className="space-y-1">
                    {fileResults.map((result, idx) => {
                      const globalIndex = results.indexOf(result)
                      const isSelected = globalIndex === selectedIndex

                      return (
                        <button
                          key={`${result.fileId}-${result.line}-${idx}`}
                          onClick={() => {
                            onResultClick?.(result.fileId, result.line)
                            setIsOpen(false)
                            setQuery('')
                          }}
                          onMouseEnter={() => setSelectedIndex(globalIndex)}
                          className={cn(
                            "w-full flex items-start gap-3 px-3 py-2 rounded-lg text-left transition-all",
                            isSelected
                              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                              : "hover:bg-slate-100"
                          )}
                        >
                          <div className={cn(
                            "flex items-center gap-1 flex-shrink-0 mt-0.5",
                            isSelected ? "text-white/70" : "text-slate-500"
                          )}>
                            <span className="text-xs font-mono">
                              {result.line}
                            </span>
                            <ChevronRight className="h-3 w-3" />
                          </div>

                          <code className={cn(
                            "flex-1 text-xs font-mono break-all",
                            isSelected ? "text-white" : "text-slate-700"
                          )}>
                            {isSelected ? (
                              result.content
                            ) : (
                              highlightMatch(
                                result.content,
                                result.matchStart,
                                result.matchEnd
                              )
                            )}
                          </code>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-4 py-2 border-t bg-slate-50 text-xs text-slate-500 flex items-center justify-between">
          <div className="flex gap-4">
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border rounded text-[10px]">↑↓</kbd>
              <span>Navigate</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border rounded text-[10px]">↵</kbd>
              <span>Open</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border rounded text-[10px]">Esc</kbd>
              <span>Close</span>
            </div>
          </div>
          <div className="text-[10px]">
            {results.length} result{results.length !== 1 ? 's' : ''} in {Object.keys(groupedResults).length} file{Object.keys(groupedResults).length !== 1 ? 's' : ''}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
