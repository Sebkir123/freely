"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { ChatPanel } from "./chat-panel"
import { DocumentViewer } from "./document-viewer"

interface WorkspaceLayoutProps {
  workspaceId: string
}

export function WorkspaceLayout({ workspaceId }: WorkspaceLayoutProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null)

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        workspaceId={workspaceId}
        selectedProjectId={selectedProjectId}
        onSelectProject={setSelectedProjectId}
        onSelectDocument={setSelectedDocumentId}
      />
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b px-4">
          <h1 className="text-lg font-semibold">Freely</h1>
        </header>
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-auto">
            <DocumentViewer
              documentId={selectedDocumentId}
              projectId={selectedProjectId}
            />
          </div>
          <div className="w-96 border-l">
            <ChatPanel
              projectId={selectedProjectId}
              workspaceId={workspaceId}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
