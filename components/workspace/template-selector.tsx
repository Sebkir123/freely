'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { projectTemplates, ProjectTemplate } from '@/lib/templates'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface TemplateSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelectTemplate: (template: ProjectTemplate, projectName: string) => void
}

export function TemplateSelector({
  isOpen,
  onClose,
  onSelectTemplate
}: TemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [projectName, setProjectName] = useState('')

  const handleCreate = () => {
    const template = projectTemplates.find(t => t.id === selectedTemplate)
    if (template && projectName.trim()) {
      onSelectTemplate(template, projectName.trim())
      setSelectedTemplate(null)
      setProjectName('')
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b bg-gradient-to-r from-purple-50 to-pink-50">
          <DialogTitle className="text-xl">Create New Project</DialogTitle>
          <p className="text-sm text-slate-600 mt-1">
            Choose a template to get started quickly
          </p>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Project Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Project Name
            </label>
            <Input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="my-awesome-project"
              className="font-mono"
            />
          </div>

          {/* Templates Grid */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Choose Template
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {projectTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={cn(
                    "relative p-6 rounded-lg border-2 text-left transition-all",
                    selectedTemplate === template.id
                      ? "border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-md"
                      : "border-slate-200 hover:border-purple-300 hover:bg-slate-50"
                  )}
                >
                  {selectedTemplate === template.id && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}

                  <div className="text-4xl mb-3">{template.icon}</div>
                  <h3 className="font-semibold text-slate-900 mb-1">
                    {template.name}
                  </h3>
                  <p className="text-xs text-slate-600">
                    {template.description}
                  </p>

                  {template.files && (
                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <p className="text-[10px] text-slate-500">
                        {template.files.length} file{template.files.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t bg-slate-50 flex items-center justify-between">
          <Button
            onClick={onClose}
            variant="ghost"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!selectedTemplate || !projectName.trim()}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90"
          >
            Create Project
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
