"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createSupabaseClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface SettingsPanelProps {
  workspaceId: string
}

export function SettingsPanel({ workspaceId }: SettingsPanelProps) {
  const [apiKeys, setApiKeys] = useState<any[]>([])
  const [agents, setAgents] = useState<any[]>([])
  const [newKey, setNewKey] = useState({ provider: 'openai', name: '', key: '' })
  const { toast } = useToast()
  const supabase = createSupabaseClient()

  useEffect(() => {
    loadApiKeys()
    loadAgents()
  }, [workspaceId])

  const loadApiKeys = async () => {
    const { data } = await supabase
      .from('user_api_keys')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (data) {
      setApiKeys(data)
    }
  }

  const loadAgents = async () => {
    const { data } = await supabase
      .from('ai_agents')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false })

    if (data) {
      setAgents(data)
    }
  }

  const addApiKey = async () => {
    if (!newKey.key.trim()) {
      toast({
        title: "Error",
        description: "Please enter an API key",
        variant: "destructive",
      })
      return
    }

    // In production, encrypt the key before storing
    const { error } = await supabase
      .from('user_api_keys')
      .insert({
        user_id: '00000000-0000-0000-0000-000000000000', // Single user
        provider: newKey.provider,
        encrypted_key: newKey.key, // TODO: Encrypt this
        name: newKey.name || `${newKey.provider} API Key`,
      })

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "API key added successfully",
      })
      setNewKey({ provider: 'openai', name: '', key: '' })
      loadApiKeys()
    }
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Settings</h1>
      <Tabs defaultValue="api-keys" className="w-full">
        <TabsList>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="agents">AI Agents</TabsTrigger>
        </TabsList>
        <TabsContent value="api-keys" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add API Key</CardTitle>
              <CardDescription>
                Add your API keys for different AI providers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Provider</label>
                <select
                  value={newKey.provider}
                  onChange={(e) => setNewKey({ ...newKey, provider: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="openai">OpenAI</option>
                  <option value="anthropic">Anthropic</option>
                  <option value="local">Local</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Name (optional)</label>
                <Input
                  value={newKey.name}
                  onChange={(e) => setNewKey({ ...newKey, name: e.target.value })}
                  placeholder="My API Key"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">API Key</label>
                <Input
                  type="password"
                  value={newKey.key}
                  onChange={(e) => setNewKey({ ...newKey, key: e.target.value })}
                  placeholder="sk-..."
                />
              </div>
              <Button onClick={addApiKey}>Add Key</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Your API Keys</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {apiKeys.map((key) => (
                  <div
                    key={key.id}
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <div>
                      <p className="font-medium">{key.name || key.provider}</p>
                      <p className="text-sm text-muted-foreground">{key.provider}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {key.is_active && (
                        <span className="text-xs text-green-600">Active</span>
                      )}
                    </div>
                  </div>
                ))}
                {apiKeys.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No API keys added yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="agents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Agents</CardTitle>
              <CardDescription>
                Configure AI agents for this workspace
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {agents.map((agent) => (
                  <div
                    key={agent.id}
                    className="rounded-md border p-3"
                  >
                    <p className="font-medium">{agent.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {agent.model_provider} / {agent.model_name}
                    </p>
                    {agent.is_default && (
                      <span className="text-xs text-blue-600">Default</span>
                    )}
                  </div>
                ))}
                {agents.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No agents configured. Create one in workspace settings.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

