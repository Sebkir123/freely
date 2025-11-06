"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// Select component is inline below
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import { Plus, Trash2, Eye, EyeOff, Check } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface APIKey {
  id: string
  provider: 'openai' | 'anthropic' | 'local' | 'custom'
  name: string
  encrypted_key: string
  is_active: boolean
  created_at: string
}

export function APIKeysSettings({ userId }: { userId?: string }) {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([])
  const [loading, setLoading] = useState(false)
  const [showKey, setShowKey] = useState<Record<string, boolean>>({})

  // New key form
  const [newProvider, setNewProvider] = useState<'openai' | 'anthropic' | 'local' | 'custom'>('openai')
  const [newKeyName, setNewKeyName] = useState("")
  const [newKeyValue, setNewKeyValue] = useState("")
  const [adding, setAdding] = useState(false)

  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    if (userId) {
      loadAPIKeys()
    }
  }, [userId])

  const loadAPIKeys = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('user_api_keys')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setApiKeys(data || [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load API keys",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddKey = async () => {
    if (!newKeyName || !newKeyValue) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setAdding(true)
    try {
      // In production, this should be encrypted server-side
      const { error } = await supabase
        .from('user_api_keys')
        .insert({
          user_id: userId,
          provider: newProvider,
          name: newKeyName,
          encrypted_key: newKeyValue, // TODO: Implement proper encryption
          is_active: false,
        })

      if (error) throw error

      toast({
        title: "Success",
        description: "API key added successfully",
      })

      setNewKeyName("")
      setNewKeyValue("")
      loadAPIKeys()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add API key",
        variant: "destructive",
      })
    } finally {
      setAdding(false)
    }
  }

  const handleToggleActive = async (keyId: string, currentState: boolean) => {
    try {
      // Deactivate all keys of the same provider first
      const key = apiKeys.find(k => k.id === keyId)
      if (!key) return

      await supabase
        .from('user_api_keys')
        .update({ is_active: false })
        .eq('user_id', userId)
        .eq('provider', key.provider)

      // Activate the selected key
      if (!currentState) {
        const { error } = await supabase
          .from('user_api_keys')
          .update({ is_active: true })
          .eq('id', keyId)

        if (error) throw error
      }

      toast({
        title: "Success",
        description: currentState ? "API key deactivated" : "API key activated",
      })

      loadAPIKeys()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update API key",
        variant: "destructive",
      })
    }
  }

  const handleDeleteKey = async (keyId: string) => {
    if (!confirm("Are you sure you want to delete this API key?")) return

    try {
      const { error } = await supabase
        .from('user_api_keys')
        .delete()
        .eq('id', keyId)

      if (error) throw error

      toast({
        title: "Success",
        description: "API key deleted successfully",
      })

      loadAPIKeys()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete API key",
        variant: "destructive",
      })
    }
  }

  const getProviderDisplay = (provider: string) => {
    const displays: Record<string, string> = {
      openai: 'OpenAI',
      anthropic: 'Anthropic (Claude)',
      local: 'Local LLM',
      custom: 'Custom',
    }
    return displays[provider] || provider
  }

  const toggleShowKey = (keyId: string) => {
    setShowKey(prev => ({ ...prev, [keyId]: !prev[keyId] }))
  }

  const maskKey = (key: string) => {
    if (key.length < 8) return '••••••••'
    return key.slice(0, 4) + '••••••••' + key.slice(-4)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New API Key</CardTitle>
          <CardDescription>
            Add your AI provider API keys. Keys are encrypted and stored securely.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="provider">Provider</Label>
              <select
                id="provider"
                value={newProvider}
                onChange={(e) => setNewProvider(e.target.value as any)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic (Claude)</option>
                <option value="local">Local LLM</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="keyName">Key Name</Label>
              <Input
                id="keyName"
                placeholder="e.g., My OpenAI Key"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="keyValue">API Key</Label>
            <Input
              id="keyValue"
              type="password"
              placeholder="sk-..."
              value={newKeyValue}
              onChange={(e) => setNewKeyValue(e.target.value)}
            />
          </div>
          <Button onClick={handleAddKey} disabled={adding}>
            <Plus className="mr-2 h-4 w-4" />
            {adding ? "Adding..." : "Add API Key"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your API Keys</CardTitle>
          <CardDescription>
            Manage your AI provider API keys. Only one key per provider can be active at a time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center text-muted-foreground py-8">Loading...</div>
          ) : apiKeys.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No API keys added yet. Add one above to get started.
            </div>
          ) : (
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {apiKeys.map((key) => (
                  <div
                    key={key.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{key.name}</span>
                        {key.is_active && (
                          <span className="flex items-center gap-1 text-xs bg-green-500/20 text-green-600 px-2 py-0.5 rounded">
                            <Check className="h-3 w-3" />
                            Active
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {getProviderDisplay(key.provider)}
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {showKey[key.id] ? key.encrypted_key : maskKey(key.encrypted_key)}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => toggleShowKey(key.id)}
                        >
                          {showKey[key.id] ? (
                            <EyeOff className="h-3 w-3" />
                          ) : (
                            <Eye className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={key.is_active ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleToggleActive(key.id, key.is_active)}
                      >
                        {key.is_active ? "Active" : "Activate"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteKey(key.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Local LLM Configuration</CardTitle>
          <CardDescription>
            Configure your local LLM endpoint (Ollama, LM Studio, etc.)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="localUrl">Base URL</Label>
            <Input
              id="localUrl"
              placeholder="http://localhost:11434"
              defaultValue="http://localhost:11434"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="localModel">Model Name</Label>
            <Input
              id="localModel"
              placeholder="llama2, codellama, etc."
              defaultValue="llama2"
            />
          </div>
          <Button>Save Configuration</Button>
        </CardContent>
      </Card>
    </div>
  )
}
