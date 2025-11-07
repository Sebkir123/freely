'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import {
  Smartphone,
  Tablet,
  Monitor,
  RotateCw,
  ExternalLink,
  Globe,
  AlertCircle,
  Play,
  Terminal
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface LivePreviewProps {
  projectId?: string
  files?: Array<{ name: string; content: string; type: string }>
  onRefresh?: () => void
}

type DeviceMode = 'mobile' | 'tablet' | 'desktop'

export function LivePreview({ projectId, files = [], onRefresh }: LivePreviewProps) {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop')
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [consoleOutput, setConsoleOutput] = useState<Array<{ type: string; message: string }>>([])
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Device dimensions
  const deviceDimensions = {
    mobile: { width: '375px', height: '667px' },
    tablet: { width: '768px', height: '1024px' },
    desktop: { width: '100%', height: '100%' }
  }

  // Generate preview from files
  useEffect(() => {
    if (files.length === 0) return

    const htmlFile = files.find(f => f.name.endsWith('.html'))
    const jsFiles = files.filter(f => f.name.endsWith('.js') || f.name.endsWith('.jsx'))
    const cssFiles = files.filter(f => f.name.endsWith('.css'))

    let htmlContent = htmlFile?.content || `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Live Preview</title>
      </head>
      <body>
        <div id="root"></div>
      </body>
      </html>
    `

    // Inject CSS
    if (cssFiles.length > 0) {
      const cssContent = cssFiles.map(f => f.content).join('\n')
      htmlContent = htmlContent.replace(
        '</head>',
        `<style>${cssContent}</style></head>`
      )
    }

    // Inject JS
    if (jsFiles.length > 0) {
      const jsContent = jsFiles.map(f => f.content).join('\n')

      // Wrap in error handling and console capture
      const wrappedJs = `
        <script>
          // Capture console output
          const originalConsole = {
            log: console.log,
            error: console.error,
            warn: console.warn,
            info: console.info
          };

          ['log', 'error', 'warn', 'info'].forEach(method => {
            console[method] = function(...args) {
              originalConsole[method].apply(console, args);
              window.parent.postMessage({
                type: 'console',
                level: method,
                message: args.map(a =>
                  typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)
                ).join(' ')
              }, '*');
            };
          });

          // Capture errors
          window.addEventListener('error', (e) => {
            window.parent.postMessage({
              type: 'console',
              level: 'error',
              message: e.message + ' at ' + e.filename + ':' + e.lineno
            }, '*');
          });

          // User code
          try {
            ${jsContent}
          } catch (error) {
            console.error('Runtime error:', error.message);
          }
        </script>
      `

      htmlContent = htmlContent.replace(
        '</body>',
        `${wrappedJs}</body>`
      )
    }

    // Create blob URL for preview
    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    setPreviewUrl(url)

    return () => {
      if (url) URL.revokeObjectURL(url)
    }
  }, [files])

  // Listen for console messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'console') {
        setConsoleOutput(prev => [
          ...prev,
          { type: event.data.level, message: event.data.message }
        ])
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  const handleRefresh = () => {
    setIsLoading(true)
    setConsoleOutput([])
    setError('')

    if (iframeRef.current) {
      iframeRef.current.src = previewUrl
    }

    onRefresh?.()
    setTimeout(() => setIsLoading(false), 500)
  }

  const handleOpenInNewTab = () => {
    if (previewUrl) {
      window.open(previewUrl, '_blank')
    }
  }

  const getDeviceIcon = (mode: DeviceMode) => {
    switch (mode) {
      case 'mobile': return <Smartphone className="h-4 w-4" />
      case 'tablet': return <Tablet className="h-4 w-4" />
      case 'desktop': return <Monitor className="h-4 w-4" />
    }
  }

  const clearConsole = () => {
    setConsoleOutput([])
  }

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-purple-500" />
          <span className="text-sm font-medium">Live Preview</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Device modes */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {(['mobile', 'tablet', 'desktop'] as DeviceMode[]).map(mode => (
              <Button
                key={mode}
                onClick={() => setDeviceMode(mode)}
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 w-8 p-0",
                  deviceMode === mode && "bg-white shadow-sm"
                )}
              >
                {getDeviceIcon(mode)}
              </Button>
            ))}
          </div>

          <div className="w-px h-6 bg-slate-200" />

          {/* Actions */}
          <Button
            onClick={handleRefresh}
            variant="ghost"
            size="sm"
            disabled={isLoading}
          >
            <RotateCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          </Button>

          <Button
            onClick={handleOpenInNewTab}
            variant="ghost"
            size="sm"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Preview Container */}
      <div className="flex-1 overflow-hidden p-4">
        {!previewUrl ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-400">
            <Play className="h-12 w-12" />
            <div className="text-center">
              <p className="text-sm font-medium">No preview available</p>
              <p className="text-xs mt-1">Create HTML, CSS, or JS files to see live preview</p>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div
              className={cn(
                "bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300",
                deviceMode !== 'desktop' && "border-8 border-slate-900"
              )}
              style={{
                width: deviceDimensions[deviceMode].width,
                height: deviceDimensions[deviceMode].height,
                maxWidth: '100%',
                maxHeight: '100%'
              }}
            >
              {error ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 p-6 text-red-500">
                  <AlertCircle className="h-10 w-10" />
                  <p className="text-sm text-center">{error}</p>
                </div>
              ) : (
                <iframe
                  ref={iframeRef}
                  src={previewUrl}
                  className="w-full h-full"
                  sandbox="allow-scripts allow-same-origin allow-forms"
                  title="Live Preview"
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Console Output */}
      {consoleOutput.length > 0 && (
        <div className="border-t bg-slate-900 text-white">
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <Terminal className="h-3 w-3" />
              <span className="text-xs font-medium">Console</span>
            </div>
            <Button
              onClick={clearConsole}
              variant="ghost"
              size="sm"
              className="h-6 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </Button>
          </div>
          <div className="max-h-32 overflow-y-auto p-2 font-mono text-xs space-y-1">
            {consoleOutput.map((log, idx) => (
              <div
                key={idx}
                className={cn(
                  "px-2 py-1 rounded",
                  log.type === 'error' && "text-red-400 bg-red-950/30",
                  log.type === 'warn' && "text-yellow-400 bg-yellow-950/30",
                  log.type === 'info' && "text-blue-400 bg-blue-950/30",
                  log.type === 'log' && "text-slate-300"
                )}
              >
                <span className="text-slate-500 mr-2">[{log.type}]</span>
                {log.message}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
