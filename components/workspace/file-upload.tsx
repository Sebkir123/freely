'use client'

import { useCallback, useState } from 'react'
import { Upload, FileText, X, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface FileUploadProps {
  projectId?: string
  onFilesUploaded?: (files: Array<{ name: string; content: string; type: string }>) => void
}

interface UploadedFile {
  name: string
  size: number
  status: 'uploading' | 'success' | 'error'
  error?: string
}

export function FileUpload({ projectId, onFilesUploaded }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsText(file)
    })
  }

  const processFiles = async (fileList: FileList) => {
    const files = Array.from(fileList)
    const allowedExtensions = ['.html', '.css', '.js', '.jsx', '.ts', '.tsx', '.json', '.md', '.txt']

    // Filter allowed files
    const validFiles = files.filter(file => {
      const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
      return allowedExtensions.includes(ext)
    })

    if (validFiles.length === 0) {
      toast.error('No valid files selected', {
        description: 'Only HTML, CSS, JS, TS, JSON, and text files are allowed'
      })
      return
    }

    if (validFiles.length !== files.length) {
      toast.warning('Some files were skipped', {
        description: 'Only supported file types were uploaded'
      })
    }

    // Add to upload queue
    const newUploads: UploadedFile[] = validFiles.map(f => ({
      name: f.name,
      size: f.size,
      status: 'uploading'
    }))
    setUploadedFiles(prev => [...prev, ...newUploads])

    // Process each file
    const processedFiles = []

    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i]
      try {
        const content = await readFileContent(file)

        processedFiles.push({
          name: file.name,
          content,
          type: file.type || 'text/plain'
        })

        // Update status
        setUploadedFiles(prev =>
          prev.map(f =>
            f.name === file.name ? { ...f, status: 'success' } : f
          )
        )
      } catch (error) {
        setUploadedFiles(prev =>
          prev.map(f =>
            f.name === file.name
              ? {
                  ...f,
                  status: 'error',
                  error: error instanceof Error ? error.message : 'Upload failed'
                }
              : f
          )
        )
      }
    }

    if (processedFiles.length > 0) {
      onFilesUploaded?.(processedFiles)
      toast.success(`${processedFiles.length} file(s) uploaded successfully!`)
    }

    // Clear upload queue after 3 seconds
    setTimeout(() => {
      setUploadedFiles([])
    }, 3000)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files?.length) {
      processFiles(e.dataTransfer.files)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      processFiles(e.target.files)
    }
  }

  const triggerFileInput = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.accept = '.html,.css,.js,.jsx,.ts,.tsx,.json,.md,.txt'
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement
      if (target.files) {
        processFiles(target.files)
      }
    }
    input.click()
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
  }

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 transition-all cursor-pointer",
          isDragging
            ? "border-purple-500 bg-purple-50"
            : "border-slate-300 hover:border-purple-400 hover:bg-slate-50"
        )}
        onClick={triggerFileInput}
      >
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
            isDragging
              ? "bg-purple-500 text-white"
              : "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-500"
          )}>
            <Upload className="h-6 w-6" />
          </div>

          <div>
            <p className="text-sm font-medium text-slate-700">
              {isDragging ? 'Drop files here' : 'Drag & drop files or click to browse'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Supports HTML, CSS, JS, TS, JSON, and text files
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={(e) => {
              e.stopPropagation()
              triggerFileInput()
            }}
          >
            Select Files
          </Button>
        </div>
      </div>

      {/* Upload Progress */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-600">Uploading files...</p>
          <div className="space-y-2">
            {uploadedFiles.map((file, idx) => (
              <div
                key={`${file.name}-${idx}`}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border transition-all",
                  file.status === 'success' && "bg-green-50 border-green-200",
                  file.status === 'error' && "bg-red-50 border-red-200",
                  file.status === 'uploading' && "bg-slate-50 border-slate-200"
                )}
              >
                <FileText className="h-4 w-4 text-slate-400 flex-shrink-0" />

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>

                {file.status === 'uploading' && (
                  <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                )}

                {file.status === 'success' && (
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                )}

                {file.status === 'error' && (
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
