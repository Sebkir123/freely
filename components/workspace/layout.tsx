"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { ChatPanel } from "./chat-panel"
import { DocumentViewer } from "./document-viewer"
import { FileTree } from "./file-tree"
import { SettingsPanel } from "./settings-panel"
import { LocalModeNotice } from "./local-mode-notice"
import { Button } from "@/components/ui/button"
import { Settings, Code, MessageSquare, FolderTree, Menu } from "lucide-react"
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
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Left Sidebar - Projects */}
      <div
        className={cn(
          "border-r transition-all duration-300",
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
        {/* Top Header */}
        <header className="flex h-14 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <Menu className="h-4 w-4" />
            </Button>
            <h1 className="text-lg font-semibold">Freely</h1>
            {selectedFilePath && (
              <span className="text-sm text-muted-foreground">
                {selectedFilePath}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'files' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('files')}
              title="File Explorer"
            >
              <FolderTree className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'code' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('code')}
              title="Code Editor"
            >
              <Code className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'chat' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('chat')}
              title="AI Chat"
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'settings' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('settings')}
              title="Settings"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Main Content with Local Mode Notice */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Local Mode Notice */}
          {!isSupabaseAvailable && (
            <div className="p-4 border-b">
              <LocalModeNotice />
            </div>
          )}

          <div className="flex flex-1 overflow-hidden">
            {/* File Tree Panel (left side) */}
            {viewMode === 'files' || viewMode === 'code' ? (
              <div className="w-80 border-r">
                <FileTree
                  projectId={selectedProjectId}
                  onSelectFile={handleSelectFile}
                  selectedFileId={selectedDocumentId}
                />
              </div>
            ) : null}

            {/* Center Content */}
            <div className="flex-1 overflow-hidden">
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
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  Select a file from the tree to view its contents
                </div>
              )}
            </div>

            {/* Right Panel - AI Chat (when in code mode) */}
            {viewMode === 'code' && (
              <div className="w-96 border-l">
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
