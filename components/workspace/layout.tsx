"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { ChatPanel } from "./chat-panel"
import { DocumentViewer } from "./document-viewer"
import { FileTree } from "./file-tree"
import { SettingsPanel } from "./settings-panel"
import { LocalModeNotice } from "./local-mode-notice"
import { Button } from "@/components/ui/button"
import { Settings, Code, MessageSquare, FolderTree, Menu, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { isSupabaseConfigured } from "@/lib/supabase/client"

interface WorkspaceLayoutProps {
  workspaceId: string
}

type ViewMode = 'code' | 'chat' | 'settings' | 'files'

export function WorkspaceLayout({ workspaceId }: WorkspaceLayoutProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null)
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('code')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const isSupabaseAvailable = isSupabaseConfigured()

  const handleSelectFile = (fileId: string, path: string) => {
    setSelectedDocumentId(fileId)
    setSelectedFilePath(path)
    setViewMode('code')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Left Sidebar - Projects */}
      <div
        className={cn(
          "border-r border-slate-200 transition-all duration-300 bg-white shadow-sm",
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

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header with Gradient */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 px-6 bg-gradient-to-r from-white via-purple-50/30 to-white backdrop-blur-sm">
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
                <span className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-md">
                  {selectedFilePath}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'files' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('files')}
              title="File Explorer"
              className={cn(
                "transition-all",
                viewMode === 'files'
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md hover:shadow-lg"
                  : "hover:bg-purple-100/50"
              )}
            >
              <FolderTree className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'code' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('code')}
              title="Code Editor"
              className={cn(
                "transition-all",
                viewMode === 'code'
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md hover:shadow-lg"
                  : "hover:bg-purple-100/50"
              )}
            >
              <Code className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'chat' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('chat')}
              title="AI Chat"
              className={cn(
                "transition-all",
                viewMode === 'chat'
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md hover:shadow-lg"
                  : "hover:bg-purple-100/50"
              )}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'settings' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('settings')}
              title="Settings"
              className={cn(
                "transition-all",
                viewMode === 'settings'
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md hover:shadow-lg"
                  : "hover:bg-purple-100/50"
              )}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Main Content with Local Mode Notice */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Local Mode Notice */}
          {!isSupabaseAvailable && (
            <div className="p-4 border-b border-slate-200">
              <LocalModeNotice />
            </div>
          )}

          <div className="flex flex-1 overflow-hidden">
            {/* File Tree Panel (left side) */}
            {viewMode === 'files' || viewMode === 'code' ? (
              <div className="w-80 border-r border-slate-200 bg-white shadow-sm">
                <FileTree
                  projectId={selectedProjectId}
                  onSelectFile={handleSelectFile}
                  selectedFileId={selectedDocumentId}
                />
              </div>
            ) : null}

            {/* Center Content */}
            <div className="flex-1 overflow-hidden bg-gradient-to-br from-slate-50 to-white">
              {viewMode === 'code' && (
                <DocumentViewer
                  documentId={selectedDocumentId}
                  projectId={selectedProjectId}
                />
              )}
              {viewMode === 'chat' && (
                <ChatPanel
                  projectId={selectedProjectId}
                  workspaceId={workspaceId}
                />
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
            {viewMode === 'code' && (
              <div className="w-96 border-l border-slate-200 bg-white shadow-sm">
                <ChatPanel
                  projectId={selectedProjectId}
                  workspaceId={workspaceId}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
