'use client'

import { useEffect, useState, useCallback } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Search,
  FileText,
  MessageSquare,
  Settings,
  Upload,
  Download,
  Terminal,
  Zap,
  Moon,
  Sun,
  Play,
  GitBranch,
  Sparkles,
  Eye,
  Code2
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Command {
  id: string
  label: string
  icon: React.ReactNode
  action: () => void
  category: 'file' | 'view' | 'ai' | 'action' | 'theme'
  keywords?: string[]
}

interface CommandPaletteProps {
  files?: Array<{ id: string; name: string; type: string }>
  onFileSelect?: (fileId: string) => void
  onViewChange?: (view: string) => void
  onAIAction?: (action: string) => void
  currentTheme?: 'light' | 'dark'
  onThemeToggle?: () => void
}

export function CommandPalette({
  files = [],
  onFileSelect,
  onViewChange,
  onAIAction,
  currentTheme = 'light',
  onThemeToggle
}: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Build command list
  const commands: Command[] = [
    // View commands
    {
      id: 'view-code',
      label: 'Open Code Editor',
      icon: <Code2 className="h-4 w-4" />,
      action: () => onViewChange?.('code'),
      category: 'view',
      keywords: ['editor', 'code', 'file']
    },
    {
      id: 'view-chat',
      label: 'Open AI Chat',
      icon: <MessageSquare className="h-4 w-4" />,
      action: () => onViewChange?.('chat'),
      category: 'view',
      keywords: ['chat', 'ai', 'assistant']
    },
    {
      id: 'view-preview',
      label: 'Open Live Preview',
      icon: <Eye className="h-4 w-4" />,
      action: () => onViewChange?.('preview'),
      category: 'view',
      keywords: ['preview', 'browser', 'live']
    },
    {
      id: 'view-terminal',
      label: 'Open Terminal',
      icon: <Terminal className="h-4 w-4" />,
      action: () => onViewChange?.('terminal'),
      category: 'view',
      keywords: ['terminal', 'console', 'shell']
    },
    {
      id: 'view-settings',
      label: 'Open Settings',
      icon: <Settings className="h-4 w-4" />,
      action: () => onViewChange?.('settings'),
      category: 'view',
      keywords: ['settings', 'config', 'preferences']
    },

    // AI commands
    {
      id: 'ai-fix-bugs',
      label: 'AI: Fix Bugs in Current File',
      icon: <Sparkles className="h-4 w-4" />,
      action: () => {
        onAIAction?.('fix-bugs')
        onViewChange?.('chat')
      },
      category: 'ai',
      keywords: ['debug', 'fix', 'bug', 'error']
    },
    {
      id: 'ai-refactor',
      label: 'AI: Refactor Current File',
      icon: <Sparkles className="h-4 w-4" />,
      action: () => {
        onAIAction?.('refactor')
        onViewChange?.('chat')
      },
      category: 'ai',
      keywords: ['refactor', 'improve', 'optimize']
    },
    {
      id: 'ai-explain',
      label: 'AI: Explain Current File',
      icon: <Sparkles className="h-4 w-4" />,
      action: () => {
        onAIAction?.('explain')
        onViewChange?.('chat')
      },
      category: 'ai',
      keywords: ['explain', 'documentation', 'understand']
    },
    {
      id: 'ai-tests',
      label: 'AI: Write Tests for Current File',
      icon: <Sparkles className="h-4 w-4" />,
      action: () => {
        onAIAction?.('write-tests')
        onViewChange?.('chat')
      },
      category: 'ai',
      keywords: ['test', 'testing', 'unit test']
    },
    {
      id: 'ai-document',
      label: 'AI: Add Documentation',
      icon: <Sparkles className="h-4 w-4" />,
      action: () => {
        onAIAction?.('document')
        onViewChange?.('chat')
      },
      category: 'ai',
      keywords: ['document', 'comments', 'jsdoc']
    },

    // Action commands
    {
      id: 'upload-file',
      label: 'Upload File',
      icon: <Upload className="h-4 w-4" />,
      action: () => {
        // Trigger file upload
        const input = document.createElement('input')
        input.type = 'file'
        input.multiple = true
        input.onchange = (e) => {
          const files = (e.target as HTMLInputElement).files
          // Handle file upload
          console.log('Files to upload:', files)
        }
        input.click()
      },
      category: 'action',
      keywords: ['upload', 'import', 'add file']
    },
    {
      id: 'download-project',
      label: 'Download Project',
      icon: <Download className="h-4 w-4" />,
      action: () => {
        // Trigger project download
        console.log('Download project')
      },
      category: 'action',
      keywords: ['download', 'export', 'save']
    },
    {
      id: 'run-build',
      label: 'Run Build',
      icon: <Play className="h-4 w-4" />,
      action: () => {
        onViewChange?.('terminal')
        // Trigger build command
      },
      category: 'action',
      keywords: ['build', 'compile', 'run']
    },
    {
      id: 'deploy',
      label: 'Deploy Project',
      icon: <Zap className="h-4 w-4" />,
      action: () => {
        // Trigger deploy
        console.log('Deploy project')
      },
      category: 'action',
      keywords: ['deploy', 'publish', 'ship']
    },
    {
      id: 'git-status',
      label: 'Git Status',
      icon: <GitBranch className="h-4 w-4" />,
      action: () => {
        onViewChange?.('terminal')
        // Run git status
      },
      category: 'action',
      keywords: ['git', 'status', 'version control']
    },

    // Theme commands
    {
      id: 'toggle-theme',
      label: `Switch to ${currentTheme === 'light' ? 'Dark' : 'Light'} Mode`,
      icon: currentTheme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />,
      action: () => onThemeToggle?.(),
      category: 'theme',
      keywords: ['theme', 'dark', 'light', 'mode']
    },

    // File commands (from files prop)
    ...files.map(file => ({
      id: `file-${file.id}`,
      label: `Open: ${file.name}`,
      icon: <FileText className="h-4 w-4" />,
      action: () => onFileSelect?.(file.id),
      category: 'file' as const,
      keywords: [file.name, 'file', 'open']
    }))
  ]

  // Filter commands based on query
  const filteredCommands = commands.filter(cmd => {
    const searchStr = query.toLowerCase()
    return (
      cmd.label.toLowerCase().includes(searchStr) ||
      cmd.keywords?.some(k => k.toLowerCase().includes(searchStr))
    )
  })

  // Keyboard handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Cmd+K or Ctrl+K to open
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      setIsOpen(prev => !prev)
      return
    }

    if (!isOpen) return

    // Escape to close
    if (e.key === 'Escape') {
      setIsOpen(false)
      setQuery('')
      setSelectedIndex(0)
      return
    }

    // Arrow navigation
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev =>
        Math.min(prev + 1, filteredCommands.length - 1)
      )
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, 0))
    }

    // Enter to execute
    if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
      e.preventDefault()
      filteredCommands[selectedIndex].action()
      setIsOpen(false)
      setQuery('')
      setSelectedIndex(0)
    }
  }, [isOpen, filteredCommands, selectedIndex])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'file': return 'Files'
      case 'view': return 'Views'
      case 'ai': return 'AI Actions'
      case 'action': return 'Actions'
      case 'theme': return 'Appearance'
      default: return 'Other'
    }
  }

  // Group commands by category
  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) {
      acc[cmd.category] = []
    }
    acc[cmd.category].push(cmd)
    return acc
  }, {} as Record<string, Command[]>)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b bg-gradient-to-r from-purple-50 to-pink-50">
          <Search className="h-4 w-4 text-slate-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search..."
            className="border-0 focus-visible:ring-0 shadow-none bg-transparent"
            autoFocus
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-mono bg-white border rounded">
            ⌘K
          </kbd>
        </div>

        <div className="max-h-[400px] overflow-y-auto p-2">
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-400">
              No commands found
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(groupedCommands).map(([category, cmds]) => (
                <div key={category}>
                  <div className="px-3 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {getCategoryLabel(category)}
                  </div>
                  <div className="space-y-1">
                    {cmds.map((cmd, idx) => {
                      const globalIndex = filteredCommands.indexOf(cmd)
                      const isSelected = globalIndex === selectedIndex

                      return (
                        <button
                          key={cmd.id}
                          onClick={() => {
                            cmd.action()
                            setIsOpen(false)
                            setQuery('')
                            setSelectedIndex(0)
                          }}
                          onMouseEnter={() => setSelectedIndex(globalIndex)}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all",
                            isSelected
                              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                              : "hover:bg-slate-100 text-slate-700"
                          )}
                        >
                          <div className={cn(
                            "flex-shrink-0",
                            isSelected ? "text-white" : "text-slate-400"
                          )}>
                            {cmd.icon}
                          </div>
                          <span className="flex-1 text-left">{cmd.label}</span>
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
              <span>Select</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border rounded text-[10px]">Esc</kbd>
              <span>Close</span>
            </div>
          </div>
          <div className="text-[10px]">
            {filteredCommands.length} results
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
