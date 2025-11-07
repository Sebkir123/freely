'use client'

import { useState, useEffect } from "react"
import { Sidebar } from "./sidebar"
import { ChatPanel } from "./chat-panel"
import { DocumentViewer } from "./document-viewer"
import { FileTree } from "./file-tree"
import { SettingsPanel } from "./settings-panel"
import { LocalModeNotice } from "./local-mode-notice"
import { CommandPalette } from "./command-palette"
import { GlobalSearch } from "./global-search"
import { LivePreview } from "./live-preview"
import { Terminal } from "./terminal"
import { StatusBar } from "./status-bar"
import { FileUpload } from "./file-upload"
import { TemplateSelector } from "./template-selector"
import { DeployDialog } from "./deploy-dialog"
import { PomodoroTimer, AmbientSoundPlayer, FocusModeToggle } from "./focus-mode"
import { VoiceCommandOverlay } from "./voice-input"
import { useCelebration, MilestoneReached } from "./celebrations"
import { Button } from "@/components/ui/button"
import {
  Settings,
  Code,
  MessageSquare,
  FolderTree,
  Menu,
  Sparkles,
  Eye,
  Terminal as TerminalIcon,
  Upload,
  Zap,
  Maximize2,
  Sun,
  Moon,
  Clock
} from "lucide-react"
import { cn } from "@/lib/utils"
import { isSupabaseConfigured } from "@/lib/supabase/client"
import { useTheme } from "@/components/providers/theme-provider"
import { toast } from 'sonner'

interface EnhancedWorkspaceLayoutProps {
  workspaceId: string
}

type ViewMode = 'code' | 'chat' | 'settings' | 'files' | 'preview' | 'terminal'

export function EnhancedWorkspaceLayout({ workspaceId }: EnhancedWorkspaceLayoutProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null)
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('code')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isFocusMode, setIsFocusMode] = useState(false)
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [showTemplateDialog, setShowTemplateDialog] = useState(false)
  const [showDeployDialog, setShowDeployDialog] = useState(false)
  const [showPomodoroPanel, setShowPomodoroPanel] = useState(false)
  const [showAmbientPanel, setShowAmbientPanel] = useState(false)
  const [showVoiceCommand, setShowVoiceCommand] = useState(false)
  const [showMilestone, setShowMilestone] = useState(false)
  const [milestoneText, setMilestoneText] = useState('')
  const [files, setFiles] = useState<any[]>([])

  const isSupabaseAvailable = isSupabaseConfigured()
  const { theme, setTheme, effectiveTheme } = useTheme()
  const { celebrate } = useCelebration()

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Voice command: Cmd+J
      if ((e.metaKey || e.ctrlKey) && e.key === 'j') {
        e.preventDefault()
        setShowVoiceCommand(true)
      }

      // Focus mode: Cmd+Shift+F
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'f' && !e.altKey) {
        e.preventDefault()
        setIsFocusMode(prev => !prev)
      }

      // Quick view switching
      if ((e.metaKey || e.ctrlKey) && e.key >= '1' && e.key <= '6') {
        e.preventDefault()
        const modes: ViewMode[] = ['code', 'preview', 'chat', 'terminal', 'files', 'settings']
        setViewMode(modes[parseInt(e.key) - 1])
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSelectFile = (fileId: string, path: string) => {
    setSelectedDocumentId(fileId)
    setSelectedFilePath(path)
    setViewMode('code')
  }

  const handleViewChange = (view: string) => {
    setViewMode(view as ViewMode)
  }

  const handleAIAction = (action: string) => {
    // Handle AI actions from command palette
    let prompt = ''
    switch (action) {
      case 'fix-bugs':
        prompt = 'Please analyze this file and fix any bugs you find.'
        break
      case 'refactor':
        prompt = 'Please refactor this code to make it more maintainable and efficient.'
        break
      case 'explain':
        prompt = 'Please explain what this code does in detail.'
        break
      case 'write-tests':
        prompt = 'Please write comprehensive unit tests for this code.'
        break
      case 'document':
        prompt = 'Please add documentation and comments to this code.'
        break
    }

    if (prompt) {
      toast.success('AI task started', {
        description: 'Check the chat panel for results'
      })
    }
  }

  const handleFilesUploaded = (uploadedFiles: any[]) => {
    setFiles(prev => [...prev, ...uploadedFiles])
    celebrate('milestone')
    toast.success('Files uploaded successfully!')
  }

  const handleTemplateSelected = (template: any, projectName: string) => {
    setFiles(template.files)
    celebrate('first-project')
    toast.success(`Project "${projectName}" created!`, {
      description: `Created with ${template.files.length} files`
    })
    setMilestoneText('Created your first project! 🎉')
    setShowMilestone(true)
  }

  const toggleTheme = () => {
    setTheme(effectiveTheme === 'light' ? 'dark' : 'light')
  }

  const showInFocusMode = !isFocusMode || viewMode === 'code' || viewMode === 'preview'

  return (
    <>
      <div className={cn(
        "flex h-screen overflow-hidden transition-all duration-300",
        effectiveTheme === 'dark'
          ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
          : "bg-gradient-to-br from-slate-50 via-white to-slate-50"
      )}>
        {/* Left Sidebar - Projects */}
        {showInFocusMode && (
          <div
            className={cn(
              "border-r transition-all duration-300 shadow-sm",
              effectiveTheme === 'dark'
                ? "border-slate-700 bg-slate-900"
                : "border-slate-200 bg-white",
              sidebarCollapsed ? "w-0 overflow-hidden" : "w-64"
            )}
          >
            <Sidebar
              workspaceId={workspaceId}
              selectedProjectId={selectedProjectId}
              onSelectProject={setSelectedProjectId}
              onSelectDocument={setSelectedDocumentId}
            />
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Top Header with Gradient */}
          {showInFocusMode && (
            <header className={cn(
              "flex h-16 items-center justify-between border-b px-6 backdrop-blur-sm",
              effectiveTheme === 'dark'
                ? "border-slate-700 bg-gradient-to-r from-slate-900 via-purple-900/30 to-slate-900"
                : "border-slate-200 bg-gradient-to-r from-white via-purple-50/30 to-white"
            )}>
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="hover:bg-purple-100/50 transition-colors"
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-1.5 rounded-lg shadow-sm">
                    <Code className="h-5 w-5 text-white" />
                  </div>
                  <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                    Freely
                  </h1>
                </div>
                {selectedFilePath && (
                  <div className="flex items-center gap-2 ml-4">
                    <span className="text-slate-400">/</span>
                    <span className={cn(
                      "text-sm font-medium px-3 py-1 rounded-md",
                      effectiveTheme === 'dark'
                        ? "text-slate-300 bg-slate-800"
                        : "text-slate-600 bg-slate-100"
                    )}>
                      {selectedFilePath}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* View mode buttons */}
                <Button
                  variant={viewMode === 'files' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('files')}
                  title="File Explorer (⌘1)"
                  className={cn(
                    "transition-all",
                    viewMode === 'files'
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                      : "hover:bg-purple-100/50"
                  )}
                >
                  <FolderTree className="h-4 w-4" />
                </Button>

                <Button
                  variant={viewMode === 'code' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('code')}
                  title="Code Editor (⌘2)"
                  className={cn(
                    "transition-all",
                    viewMode === 'code'
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                      : "hover:bg-purple-100/50"
                  )}
                >
                  <Code className="h-4 w-4" />
                </Button>

                <Button
                  variant={viewMode === 'preview' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('preview')}
                  title="Live Preview (⌘3)"
                  className={cn(
                    "transition-all",
                    viewMode === 'preview'
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                      : "hover:bg-purple-100/50"
                  )}
                >
                  <Eye className="h-4 w-4" />
                </Button>

                <Button
                  variant={viewMode === 'chat' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('chat')}
                  title="AI Chat (⌘4)"
                  className={cn(
                    "transition-all",
                    viewMode === 'chat'
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                      : "hover:bg-purple-100/50"
                  )}
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>

                <Button
                  variant={viewMode === 'terminal' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('terminal')}
                  title="Terminal (⌘5)"
                  className={cn(
                    "transition-all",
                    viewMode === 'terminal'
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                      : "hover:bg-purple-100/50"
                  )}
                >
                  <TerminalIcon className="h-4 w-4" />
                </Button>

                <Button
                  variant={viewMode === 'settings' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('settings')}
                  title="Settings (⌘6)"
                  className={cn(
                    "transition-all",
                    viewMode === 'settings'
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                      : "hover:bg-purple-100/50"
                  )}
                >
                  <Settings className="h-4 w-4" />
                </Button>

                <div className="w-px h-6 bg-slate-300" />

                {/* Action buttons */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTemplateDialog(true)}
                  title="New Project"
                >
                  <Sparkles className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUploadDialog(true)}
                  title="Upload Files"
                >
                  <Upload className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDeployDialog(true)}
                  title="Deploy Project"
                >
                  <Zap className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPomodoroPanel(!showPomodoroPanel)}
                  title="Pomodoro Timer"
                >
                  <Clock className="h-4 w-4" />
                </Button>

                <div className="w-px h-6 bg-slate-300" />

                <FocusModeToggle
                  isFocused={isFocusMode}
                  onToggle={() => setIsFocusMode(!isFocusMode)}
                />

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  title="Toggle Theme"
                >
                  {effectiveTheme === 'light' ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Sun className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </header>
          )}

          {/* Main Content with Local Mode Notice */}
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Local Mode Notice */}
            {!isSupabaseAvailable && !isFocusMode && (
              <div className="p-4 border-b border-slate-200">
                <LocalModeNotice />
              </div>
            )}

            <div className="flex flex-1 overflow-hidden">
              {/* File Tree Panel (left side) */}
              {showInFocusMode && (viewMode === 'files' || viewMode === 'code') && (
                <div className={cn(
                  "w-80 border-r shadow-sm",
                  effectiveTheme === 'dark'
                    ? "border-slate-700 bg-slate-900"
                    : "border-slate-200 bg-white"
                )}>
                  <FileTree
                    projectId={selectedProjectId}
                    onSelectFile={handleSelectFile}
                    selectedFileId={selectedDocumentId}
                  />
                </div>
              )}

              {/* Center Content */}
              <div className={cn(
                "flex-1 overflow-hidden",
                effectiveTheme === 'dark'
                  ? "bg-gradient-to-br from-slate-900 to-slate-800"
                  : "bg-gradient-to-br from-slate-50 to-white"
              )}>
                {viewMode === 'code' && (
                  <DocumentViewer
                    documentId={selectedDocumentId}
                    projectId={selectedProjectId}
                  />
                )}
                {viewMode === 'preview' && (
                  <LivePreview files={files} />
                )}
                {viewMode === 'chat' && (
                  <ChatPanel
                    projectId={selectedProjectId}
                    workspaceId={workspaceId}
                  />
                )}
                {viewMode === 'terminal' && (
                  <Terminal projectId={selectedProjectId || undefined} />
                )}
                {viewMode === 'settings' && (
                  <SettingsPanel workspaceId={workspaceId} />
                )}
                {viewMode === 'files' && !selectedDocumentId && (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto">
                        <Sparkles className="h-8 w-8 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-slate-700">Select a file to view</p>
                        <p className="text-sm text-slate-500">Choose a file from the tree to start editing</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Panel - AI Chat (when in code mode) */}
              {showInFocusMode && viewMode === 'code' && (
                <div className={cn(
                  "w-96 border-l shadow-sm",
                  effectiveTheme === 'dark'
                    ? "border-slate-700 bg-slate-900"
                    : "border-slate-200 bg-white"
                )}>
                  <ChatPanel
                    projectId={selectedProjectId}
                    workspaceId={workspaceId}
                  />
                </div>
              )}

              {/* Pomodoro Side Panel */}
              {showPomodoroPanel && (
                <div className={cn(
                  "w-80 border-l shadow-lg p-4",
                  effectiveTheme === 'dark'
                    ? "border-slate-700 bg-slate-900"
                    : "border-slate-200 bg-white"
                )}>
                  <PomodoroTimer />
                  <div className="mt-4">
                    <AmbientSoundPlayer />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status Bar */}
          {showInFocusMode && (
            <StatusBar
              currentFile={
                selectedFilePath
                  ? {
                      name: selectedFilePath,
                      language: 'typescript',
                      lines: 150,
                      size: 4096
                    }
                  : undefined
              }
              gitStatus={{
                branch: 'main',
                ahead: 0,
                behind: 0,
                modified: 0
              }}
              buildStatus="idle"
              aiStatus="ready"
              isOnline={true}
            />
          )}
        </div>
      </div>

      {/* Global Components */}
      <CommandPalette
        files={files}
        onFileSelect={(id) => console.log('Select file:', id)}
        onViewChange={handleViewChange}
        onAIAction={handleAIAction}
        currentTheme={effectiveTheme}
        onThemeToggle={toggleTheme}
      />

      <GlobalSearch
        files={files}
        onResultClick={(fileId, line) => {
          console.log('Jump to:', fileId, line)
        }}
      />

      {showUploadDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Upload Files</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUploadDialog(false)}
              >
                ✕
              </Button>
            </div>
            <FileUpload
              projectId={selectedProjectId || undefined}
              onFilesUploaded={(files) => {
                handleFilesUploaded(files)
                setShowUploadDialog(false)
              }}
            />
          </div>
        </div>
      )}

      <TemplateSelector
        isOpen={showTemplateDialog}
        onClose={() => setShowTemplateDialog(false)}
        onSelectTemplate={handleTemplateSelected}
      />

      <DeployDialog
        isOpen={showDeployDialog}
        onClose={() => setShowDeployDialog(false)}
        projectName={selectedProjectId || 'my-project'}
      />

      <VoiceCommandOverlay
        isActive={showVoiceCommand}
        onClose={() => setShowVoiceCommand(false)}
        onCommand={(cmd) => {
          toast.success('Voice command received', {
            description: cmd
          })
        }}
      />

      {showMilestone && (
        <MilestoneReached
          milestone={milestoneText}
          onClose={() => setShowMilestone(false)}
        />
      )}
    </>
  )
}
