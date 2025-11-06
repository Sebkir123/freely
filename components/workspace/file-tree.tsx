"use client"

import { useState, useEffect } from "react"
import { ChevronRight, ChevronDown, File, Folder, FolderOpen, Plus, Trash2, FileCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface FileNode {
  id: string
  name: string
  type: 'file' | 'folder'
  path: string
  children?: FileNode[]
  language?: string
}

interface FileTreeProps {
  projectId: string | null
  onSelectFile: (fileId: string, path: string) => void
  selectedFileId: string | null
  onCreateFile?: (name: string, path: string, type: 'file' | 'folder') => Promise<void>
  onDeleteFile?: (fileId: string) => Promise<void>
}

export function FileTree({
  projectId,
  onSelectFile,
  selectedFileId,
  onCreateFile,
  onDeleteFile,
}: FileTreeProps) {
  const [files, setFiles] = useState<FileNode[]>([])
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [creatingFile, setCreatingFile] = useState<{ parentPath: string; type: 'file' | 'folder' } | null>(null)
  const [newFileName, setNewFileName] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    if (projectId) {
      loadFiles()
    }
  }, [projectId])

  const loadFiles = async () => {
    // Mock data - replace with actual API call
    const mockFiles: FileNode[] = [
      {
        id: '1',
        name: 'src',
        type: 'folder',
        path: '/src',
        children: [
          {
            id: '2',
            name: 'components',
            type: 'folder',
            path: '/src/components',
            children: [
              { id: '3', name: 'Button.tsx', type: 'file', path: '/src/components/Button.tsx', language: 'typescript' },
              { id: '4', name: 'Card.tsx', type: 'file', path: '/src/components/Card.tsx', language: 'typescript' },
            ]
          },
          { id: '5', name: 'App.tsx', type: 'file', path: '/src/App.tsx', language: 'typescript' },
          { id: '6', name: 'index.tsx', type: 'file', path: '/src/index.tsx', language: 'typescript' },
        ]
      },
      {
        id: '7',
        name: 'public',
        type: 'folder',
        path: '/public',
        children: [
          { id: '8', name: 'index.html', type: 'file', path: '/public/index.html', language: 'html' },
          { id: '9', name: 'styles.css', type: 'file', path: '/public/styles.css', language: 'css' },
        ]
      },
      { id: '10', name: 'package.json', type: 'file', path: '/package.json', language: 'json' },
      { id: '11', name: 'README.md', type: 'file', path: '/README.md', language: 'markdown' },
    ]
    setFiles(mockFiles)
  }

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev)
      if (next.has(path)) {
        next.delete(path)
      } else {
        next.add(path)
      }
      return next
    })
  }

  const handleCreateFile = async () => {
    if (!creatingFile || !newFileName) return

    try {
      const fullPath = `${creatingFile.parentPath}/${newFileName}`
      await onCreateFile?.(newFileName, fullPath, creatingFile.type)

      toast({
        title: "Success",
        description: `${creatingFile.type === 'file' ? 'File' : 'Folder'} created successfully`,
      })

      setCreatingFile(null)
      setNewFileName("")
      loadFiles()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create file",
        variant: "destructive",
      })
    }
  }

  const handleDeleteFile = async (fileId: string, fileName: string) => {
    if (!confirm(`Are you sure you want to delete ${fileName}?`)) return

    try {
      await onDeleteFile?.(fileId)
      toast({
        title: "Success",
        description: "File deleted successfully",
      })
      loadFiles()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete file",
        variant: "destructive",
      })
    }
  }

  const getFileIcon = (name: string, type: string) => {
    if (type === 'folder') {
      return expandedFolders.has(name) ? (
        <FolderOpen className="h-4 w-4 text-blue-500" />
      ) : (
        <Folder className="h-4 w-4 text-blue-500" />
      )
    }

    const ext = name.split('.').pop()?.toLowerCase()
    const iconClass = "h-4 w-4"

    switch (ext) {
      case 'tsx':
      case 'ts':
      case 'jsx':
      case 'js':
        return <FileCode className={cn(iconClass, "text-blue-400")} />
      case 'css':
      case 'scss':
        return <FileCode className={cn(iconClass, "text-purple-400")} />
      case 'html':
        return <FileCode className={cn(iconClass, "text-orange-400")} />
      case 'json':
        return <FileCode className={cn(iconClass, "text-yellow-400")} />
      case 'md':
        return <File className={cn(iconClass, "text-gray-400")} />
      default:
        return <File className={iconClass} />
    }
  }

  const renderNode = (node: FileNode, depth: number = 0) => {
    const isExpanded = expandedFolders.has(node.path)
    const isSelected = selectedFileId === node.id

    return (
      <div key={node.id}>
        <div
          className={cn(
            "flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-accent group",
            isSelected && "bg-accent"
          )}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => {
            if (node.type === 'folder') {
              toggleFolder(node.path)
            } else {
              onSelectFile(node.id, node.path)
            }
          }}
        >
          {node.type === 'folder' && (
            <span className="flex-shrink-0">
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </span>
          )}
          {getFileIcon(node.name, node.type)}
          <span className="text-sm flex-1 truncate">{node.name}</span>
          {node.type === 'file' && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation()
                handleDeleteFile(node.id, node.name)
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
        {node.type === 'folder' && isExpanded && node.children && (
          <div>
            {node.children.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  if (!projectId) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
        Select a project to view files
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-2 border-b">
        <span className="text-sm font-medium">Files</span>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => setCreatingFile({ parentPath: '/', type: 'file' })}
            title="New File"
          >
            <Plus className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => setCreatingFile({ parentPath: '/', type: 'folder' })}
            title="New Folder"
          >
            <Folder className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {creatingFile && (
        <div className="p-2 border-b">
          <div className="flex gap-2">
            <Input
              placeholder={`New ${creatingFile.type} name`}
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateFile()
                if (e.key === 'Escape') {
                  setCreatingFile(null)
                  setNewFileName("")
                }
              }}
              className="h-7 text-sm"
              autoFocus
            />
            <Button size="sm" className="h-7" onClick={handleCreateFile}>
              Create
            </Button>
          </div>
        </div>
      )}

      <ScrollArea className="flex-1">
        <div className="p-2">
          {files.map(node => renderNode(node))}
        </div>
      </ScrollArea>
    </div>
  )
}
