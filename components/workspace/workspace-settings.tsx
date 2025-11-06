"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import { Save } from "lucide-react"

export function WorkspaceSettings({ workspaceId }: { workspaceId: string }) {
  const [workspace, setWorkspace] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    loadWorkspace()
  }, [workspaceId])

  const loadWorkspace = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('workspaces')
        .select('*')
        .eq('id', workspaceId)
        .single()

      if (error) throw error
      setWorkspace(data)
    } catch (error: any) {
      // Workspace may not exist in database for default workspace
      setWorkspace({
        id: workspaceId,
        name: 'My Workspace',
        description: '',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('workspaces')
        .upsert({
          id: workspaceId,
          name: workspace.name,
          description: workspace.description,
        })

      if (error) throw error

      toast({
        title: "Success",
        description: "Workspace settings saved successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save workspace settings",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-center text-muted-foreground py-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Workspace Information</CardTitle>
          <CardDescription>
            Configure your workspace name and description
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Workspace Name</Label>
            <Input
              id="name"
              value={workspace?.name || ''}
              onChange={(e) => setWorkspace({ ...workspace, name: e.target.value })}
              placeholder="My Awesome Workspace"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={workspace?.description || ''}
              onChange={(e) => setWorkspace({ ...workspace, description: e.target.value })}
              placeholder="A brief description of this workspace..."
              className="min-h-[100px]"
            />
          </div>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team Memory</CardTitle>
          <CardDescription>
            Shared context and knowledge for this workspace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Team memory allows you to store important context, coding conventions,
            and project-specific information that AI assistants can reference.
          </p>
          <Button variant="outline">Manage Team Memory</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Collaboration</CardTitle>
          <CardDescription>
            Invite team members to this workspace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Share your workspace with team members for real-time collaboration.
          </p>
          <Button variant="outline">Invite Members</Button>
        </CardContent>
      </Card>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible actions for this workspace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive">Delete Workspace</Button>
        </CardContent>
      </Card>
    </div>
  )
}
