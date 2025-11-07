'use client'

import { useState, useEffect } from 'react'
import {
  GitBranch,
  AlertCircle,
  CheckCircle2,
  Zap,
  Clock,
  FileText,
  Code2,
  Wifi,
  WifiOff
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatusBarProps {
  currentFile?: {
    name: string
    language: string
    lines: number
    size: number
  }
  gitStatus?: {
    branch: string
    ahead: number
    behind: number
    modified: number
  }
  buildStatus?: 'idle' | 'building' | 'success' | 'error'
  aiStatus?: 'ready' | 'thinking' | 'offline'
  isOnline?: boolean
}

export function StatusBar({
  currentFile,
  gitStatus,
  buildStatus = 'idle',
  aiStatus = 'ready',
  isOnline = true
}: StatusBarProps) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
  }

  const getBuildStatusIcon = () => {
    switch (buildStatus) {
      case 'building':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
      case 'success':
        return <CheckCircle2 className="h-3 w-3 text-green-500" />
      case 'error':
        return <AlertCircle className="h-3 w-3 text-red-500" />
      default:
        return null
    }
  }

  const getAIStatusIcon = () => {
    switch (aiStatus) {
      case 'thinking':
        return (
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        )
      case 'ready':
        return (
          <div className="flex items-center gap-1.5">
            <Zap className="h-3 w-3 text-purple-500" />
            <span className="text-xs">AI Ready</span>
          </div>
        )
      case 'offline':
        return (
          <div className="flex items-center gap-1.5">
            <Zap className="h-3 w-3 text-slate-400" />
            <span className="text-xs text-slate-400">AI Offline</span>
          </div>
        )
    }
  }

  return (
    <div className="h-7 flex items-center justify-between px-4 bg-gradient-to-r from-slate-100 via-purple-50/30 to-slate-100 border-t text-xs">
      {/* Left side */}
      <div className="flex items-center gap-4">
        {/* Git status */}
        {gitStatus && (
          <div className="flex items-center gap-1.5 text-slate-600 hover:text-purple-600 cursor-pointer transition-colors">
            <GitBranch className="h-3 w-3" />
            <span className="font-medium">{gitStatus.branch}</span>
            {(gitStatus.ahead > 0 || gitStatus.behind > 0 || gitStatus.modified > 0) && (
              <div className="flex items-center gap-1">
                {gitStatus.ahead > 0 && (
                  <span className="text-green-600">↑{gitStatus.ahead}</span>
                )}
                {gitStatus.behind > 0 && (
                  <span className="text-blue-600">↓{gitStatus.behind}</span>
                )}
                {gitStatus.modified > 0 && (
                  <span className="text-orange-600">✎{gitStatus.modified}</span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Build status */}
        {buildStatus !== 'idle' && (
          <div className="flex items-center gap-1.5 text-slate-600">
            {getBuildStatusIcon()}
            <span>
              {buildStatus === 'building' && 'Building...'}
              {buildStatus === 'success' && 'Build successful'}
              {buildStatus === 'error' && 'Build failed'}
            </span>
          </div>
        )}

        {/* Connection status */}
        <div className={cn(
          "flex items-center gap-1.5",
          isOnline ? "text-slate-600" : "text-red-500"
        )}>
          {isOnline ? (
            <Wifi className="h-3 w-3" />
          ) : (
            <WifiOff className="h-3 w-3" />
          )}
          <span>{isOnline ? 'Online' : 'Offline'}</span>
        </div>
      </div>

      {/* Center - Current file info */}
      {currentFile && (
        <div className="flex items-center gap-4 text-slate-600">
          <div className="flex items-center gap-1.5">
            <FileText className="h-3 w-3" />
            <span className="font-medium">{currentFile.name}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Code2 className="h-3 w-3" />
            <span>{currentFile.language}</span>
          </div>

          <div className="flex items-center gap-3">
            <span>{currentFile.lines} lines</span>
            <span>{formatFileSize(currentFile.size)}</span>
          </div>
        </div>
      )}

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* AI Status */}
        <div className="text-slate-600">
          {getAIStatusIcon()}
        </div>

        {/* Time */}
        <div className="flex items-center gap-1.5 text-slate-500">
          <Clock className="h-3 w-3" />
          <span>{time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
    </div>
  )
}
