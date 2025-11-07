'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Terminal as TerminalIcon,
  Plus,
  X,
  Trash2,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface TerminalSession {
  id: string
  name: string
  history: Array<{ type: 'input' | 'output' | 'error'; content: string }>
  currentDirectory: string
}

interface TerminalProps {
  projectId?: string
  onCommand?: (command: string) => Promise<string>
}

export function Terminal({ projectId, onCommand }: TerminalProps) {
  const [sessions, setSessions] = useState<TerminalSession[]>([
    {
      id: '1',
      name: 'Terminal 1',
      history: [
        { type: 'output', content: 'Welcome to Freely Terminal! 🚀' },
        { type: 'output', content: 'Type "help" for available commands.\n' }
      ],
      currentDirectory: '~'
    }
  ])
  const [activeSessionId, setActiveSessionId] = useState('1')
  const [input, setInput] = useState('')
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const outputRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const activeSession = sessions.find(s => s.id === activeSessionId)

  // Auto-scroll to bottom when history changes
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [activeSession?.history])

  // Built-in commands
  const builtInCommands: Record<string, (args: string[]) => string> = {
    help: () => `
Available commands:
  help              Show this help message
  clear             Clear terminal
  echo <message>    Print a message
  pwd               Print working directory
  ls                List files
  cd <dir>          Change directory
  npm install       Install dependencies
  npm run dev       Start development server
  npm run build     Build project
  git status        Show git status
  git add .         Stage all changes
  git commit -m     Commit changes

Type any command to execute it.`,

    clear: () => {
      setSessions(prev =>
        prev.map(s =>
          s.id === activeSessionId ? { ...s, history: [] } : s
        )
      )
      return ''
    },

    echo: (args) => args.join(' '),

    pwd: () => activeSession?.currentDirectory || '~',

    ls: () => `
index.html
styles.css
script.js
package.json
README.md`,

    cd: (args) => {
      const dir = args[0] || '~'
      setSessions(prev =>
        prev.map(s =>
          s.id === activeSessionId
            ? { ...s, currentDirectory: dir }
            : s
        )
      )
      return ''
    }
  }

  const executeCommand = async (cmd: string) => {
    const trimmed = cmd.trim()
    if (!trimmed) return

    // Add to history
    setCommandHistory(prev => [...prev, trimmed])
    setHistoryIndex(-1)

    // Add input to session history
    setSessions(prev =>
      prev.map(s =>
        s.id === activeSessionId
          ? {
              ...s,
              history: [
                ...s.history,
                { type: 'input', content: `${s.currentDirectory} $ ${trimmed}` }
              ]
            }
          : s
      )
    )

    // Parse command
    const parts = trimmed.split(' ')
    const command = parts[0]
    const args = parts.slice(1)

    let output = ''
    let isError = false

    try {
      // Check built-in commands
      if (builtInCommands[command]) {
        output = builtInCommands[command](args)
      } else if (onCommand) {
        // Execute via prop handler
        output = await onCommand(trimmed)
      } else {
        // Simulate some common commands
        if (command === 'npm' && args[0] === 'install') {
          output = 'Installing dependencies...\n✓ Dependencies installed successfully!'
        } else if (command === 'npm' && args[0] === 'run') {
          if (args[1] === 'dev') {
            output = '> freely@1.0.0 dev\n> next dev\n\n✓ Ready on http://localhost:3000'
          } else if (args[1] === 'build') {
            output = '> freely@1.0.0 build\n> next build\n\n✓ Compiled successfully!'
          } else {
            output = `Script "${args[1]}" not found`
            isError = true
          }
        } else if (command === 'git') {
          if (args[0] === 'status') {
            output = `On branch main\nYour branch is up to date with 'origin/main'.\n\nnothing to commit, working tree clean`
          } else if (args[0] === 'add') {
            output = '✓ Changes staged'
          } else if (args[0] === 'commit') {
            output = '✓ Commit created successfully'
          } else {
            output = `git: '${args[0]}' is not a git command. See 'git --help'.`
            isError = true
          }
        } else {
          output = `Command not found: ${command}\nType "help" for available commands.`
          isError = true
        }
      }
    } catch (error) {
      output = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      isError = true
    }

    // Add output to session history
    if (output) {
      setSessions(prev =>
        prev.map(s =>
          s.id === activeSessionId
            ? {
                ...s,
                history: [
                  ...s.history,
                  { type: isError ? 'error' : 'output', content: output }
                ]
              }
            : s
        )
      )
    }

    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(input)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1
          ? commandHistory.length - 1
          : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setInput(commandHistory[newIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1)
          setInput('')
        } else {
          setHistoryIndex(newIndex)
          setInput(commandHistory[newIndex])
        }
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault()
      builtInCommands.clear([])
    }
  }

  const createNewSession = () => {
    const newId = String(sessions.length + 1)
    setSessions([
      ...sessions,
      {
        id: newId,
        name: `Terminal ${newId}`,
        history: [
          { type: 'output', content: `Welcome to Terminal ${newId}! 🚀\n` }
        ],
        currentDirectory: '~'
      }
    ])
    setActiveSessionId(newId)
  }

  const closeSession = (id: string) => {
    if (sessions.length === 1) return // Keep at least one session

    const newSessions = sessions.filter(s => s.id !== id)
    setSessions(newSessions)

    if (activeSessionId === id) {
      setActiveSessionId(newSessions[0].id)
    }
  }

  return (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Tabs */}
      <div className="flex items-center gap-1 px-2 py-1 bg-slate-800 border-b border-slate-700">
        {sessions.map(session => (
          <div
            key={session.id}
            className={cn(
              "group flex items-center gap-2 px-3 py-1.5 rounded-t-lg cursor-pointer transition-colors",
              activeSessionId === session.id
                ? "bg-slate-900 text-white"
                : "bg-slate-800 text-slate-400 hover:bg-slate-750"
            )}
            onClick={() => setActiveSessionId(session.id)}
          >
            <TerminalIcon className="h-3 w-3" />
            <span className="text-xs">{session.name}</span>
            {sessions.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  closeSession(session.id)
                }}
                className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        ))}

        <Button
          onClick={createNewSession}
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-slate-400 hover:text-white hover:bg-slate-700"
        >
          <Plus className="h-4 w-4" />
        </Button>

        <div className="flex-1" />

        <Button
          onClick={() => builtInCommands.clear([])}
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs text-slate-400 hover:text-white hover:bg-slate-700"
        >
          <Trash2 className="h-3 w-3 mr-1" />
          Clear
        </Button>
      </div>

      {/* Terminal Output */}
      <div
        ref={outputRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-sm text-slate-100 space-y-1"
        onClick={() => inputRef.current?.focus()}
      >
        {activeSession?.history.map((entry, idx) => (
          <div key={idx} className="whitespace-pre-wrap break-words">
            {entry.type === 'input' ? (
              <div className="text-green-400">{entry.content}</div>
            ) : entry.type === 'error' ? (
              <div className="text-red-400">{entry.content}</div>
            ) : (
              <div className="text-slate-300">{entry.content}</div>
            )}
          </div>
        ))}

        {/* Input line */}
        <div className="flex items-center gap-2">
          <span className="text-purple-400">
            {activeSession?.currentDirectory || '~'}
          </span>
          <ChevronRight className="h-3 w-3 text-slate-400" />
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-0 p-0 text-slate-100 focus-visible:ring-0 shadow-none font-mono text-sm"
            placeholder="Type a command..."
            autoFocus
          />
        </div>
      </div>

      {/* Footer hints */}
      <div className="px-4 py-2 bg-slate-800 border-t border-slate-700 text-xs text-slate-400 flex items-center gap-4">
        <span>↑↓ History</span>
        <span>Ctrl+L Clear</span>
        <span>Tab Complete</span>
        <div className="flex-1" />
        <span className="text-slate-500">Session: {activeSession?.name}</span>
      </div>
    </div>
  )
}
