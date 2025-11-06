"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import { Plus, Trash2, Star } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface AIAgent {
  id: string
  name: string
  description: string
  system_prompt: string
  model_provider: string
  model_name: string
  is_default: boolean
  config: any
}

export function AgentsSettings({ workspaceId }: { workspaceId: string }) {
  const [agents, setAgents] = useState<AIAgent[]>([])
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)

  // New agent form
  const [newAgent, setNewAgent] = useState({
    name: "",
    description: "",
    system_prompt: "",
    model_provider: "openai",
    model_name: "gpt-4-turbo-preview",
  })

  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    loadAgents()
  }, [workspaceId])

  const loadAgents = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('ai_agents')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setAgents(data || [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load AI agents",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAgent = async () => {
    if (!newAgent.name || !newAgent.system_prompt) {
      toast({
        title: "Error",
        description: "Please fill in required fields",
        variant: "destructive",
      })
      return
    }

    setCreating(true)
    try {
      const { error } = await supabase
        .from('ai_agents')
        .insert({
          workspace_id: workspaceId,
          name: newAgent.name,
          description: newAgent.description,
          system_prompt: newAgent.system_prompt,
          model_provider: newAgent.model_provider,
          model_name: newAgent.model_name,
          is_default: agents.length === 0, // First agent is default
        })

      if (error) throw error

      toast({
        title: "Success",
        description: "AI agent created successfully",
      })

      setNewAgent({
        name: "",
        description: "",
        system_prompt: "",
        model_provider: "openai",
        model_name: "gpt-4-turbo-preview",
      })
      loadAgents()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create AI agent",
        variant: "destructive",
      })
    } finally {
      setCreating(false)
    }
  }

  const handleSetDefault = async (agentId: string) => {
    try {
      // Unset all defaults
      await supabase
        .from('ai_agents')
        .update({ is_default: false })
        .eq('workspace_id', workspaceId)

      // Set new default
      const { error } = await supabase
        .from('ai_agents')
        .update({ is_default: true })
        .eq('id', agentId)

      if (error) throw error

      toast({
        title: "Success",
        description: "Default agent updated",
      })

      loadAgents()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to set default agent",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAgent = async (agentId: string) => {
    if (!confirm("Are you sure you want to delete this agent?")) return

    try {
      const { error } = await supabase
        .from('ai_agents')
        .delete()
        .eq('id', agentId)

      if (error) throw error

      toast({
        title: "Success",
        description: "AI agent deleted successfully",
      })

      loadAgents()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete AI agent",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create AI Agent</CardTitle>
          <CardDescription>
            Create custom AI agents with specific personalities and behaviors
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Code Reviewer, Documentation Writer"
              value={newAgent.name}
              onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Brief description of this agent's purpose"
              value={newAgent.description}
              onChange={(e) => setNewAgent({ ...newAgent, description: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="system_prompt">System Prompt *</Label>
            <Textarea
              id="system_prompt"
              placeholder="You are an expert code reviewer who provides constructive feedback..."
              value={newAgent.system_prompt}
              onChange={(e) => setNewAgent({ ...newAgent, system_prompt: e.target.value })}
              className="min-h-[150px] font-mono text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="provider">Provider</Label>
              <select
                id="provider"
                value={newAgent.model_provider}
                onChange={(e) => setNewAgent({ ...newAgent, model_provider: e.target.value })}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic</option>
                <option value="local">Local LLM</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                placeholder="gpt-4-turbo-preview"
                value={newAgent.model_name}
                onChange={(e) => setNewAgent({ ...newAgent, model_name: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={handleCreateAgent} disabled={creating}>
            <Plus className="mr-2 h-4 w-4" />
            {creating ? "Creating..." : "Create Agent"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your AI Agents</CardTitle>
          <CardDescription>
            Manage your workspace AI agents. Set one as default to use it in conversations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center text-muted-foreground py-8">Loading...</div>
          ) : agents.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No AI agents created yet. Create one above to get started.
            </div>
          ) : (
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {agents.map((agent) => (
                  <div
                    key={agent.id}
                    className="p-4 border rounded-lg space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{agent.name}</h3>
                          {agent.is_default && (
                            <span className="flex items-center gap-1 text-xs bg-yellow-500/20 text-yellow-600 px-2 py-0.5 rounded">
                              <Star className="h-3 w-3 fill-current" />
                              Default
                            </span>
                          )}
                        </div>
                        {agent.description && (
                          <p className="text-sm text-muted-foreground">
                            {agent.description}
                          </p>
                        )}
                        <div className="text-xs text-muted-foreground">
                          {agent.model_provider} / {agent.model_name}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!agent.is_default && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSetDefault(agent.id)}
                          >
                            <Star className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteAgent(agent.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-xs bg-muted p-2 rounded font-mono">
                      {agent.system_prompt.slice(0, 150)}
                      {agent.system_prompt.length > 150 && "..."}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
