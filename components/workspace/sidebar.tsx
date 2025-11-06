"use client"

import { useState, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Plus, FileCode } from "lucide-react"
import { getStorage } from "@/lib/storage/factory"
import { cn } from "@/lib/utils"

interface SidebarProps {
  workspaceId: string
  selectedProjectId: string | null
  onSelectProject: (projectId: string) => void
  onSelectDocument: (documentId: string) => void
}

export function Sidebar({
  workspaceId,
  selectedProjectId,
  onSelectProject,
  onSelectDocument,
}: SidebarProps) {
  const [projects, setProjects] = useState<any[]>([])
  const [documents, setDocuments] = useState<any[]>([])
  const storage = getStorage()

  useEffect(() => {
    loadProjects()
  }, [workspaceId])

  useEffect(() => {
    if (selectedProjectId) {
      loadDocuments(selectedProjectId)
    }
  }, [selectedProjectId])

  const loadProjects = async () => {
    const data = await storage.getProjects(workspaceId)
    setProjects(data)
    if (data.length > 0 && !selectedProjectId) {
      onSelectProject(data[0].id)
    }
  }

  const loadDocuments = async (projectId: string) => {
    const data = await storage.getDocuments(projectId)
    setDocuments(data)
  }

  const createProject = async () => {
    const project = await storage.createProject(workspaceId, {
      name: 'New Project',
      description: '',
      config: {},
    })
    if (project) {
      setProjects([project, ...projects])
      onSelectProject(project.id)
    }
  }

  const createDocument = async () => {
    if (!selectedProjectId) return

    const doc = await storage.createDocument(selectedProjectId, {
      name: 'new-file.ts',
      path: 'new-file.ts',
      content: '',
      language: 'typescript',
    })

    if (doc) {
      setDocuments([doc, ...documents])
      onSelectDocument(doc.id)
    }
  }

  return (
    <div className="flex w-64 flex-col border-r bg-muted/10">
      <div className="border-b p-4">
        <h2 className="mb-2 text-sm font-semibold">Projects</h2>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={createProject}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {projects.map((project) => (
            <div key={project.id} className="mb-2">
              <button
                onClick={() => onSelectProject(project.id)}
                className={cn(
                  "w-full rounded-md px-3 py-2 text-left text-sm transition-colors",
                  selectedProjectId === project.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                {project.name}
              </button>
              {selectedProjectId === project.id && (
                <div className="mt-1 space-y-1 pl-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={createDocument}
                  >
                    <Plus className="mr-2 h-3 w-3" />
                    New File
                  </Button>
                  {documents.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => onSelectDocument(doc.id)}
                      className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-xs hover:bg-muted"
                    >
                      <FileCode className="h-3 w-3" />
                      {doc.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
