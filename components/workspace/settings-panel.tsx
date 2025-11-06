"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { APIKeysSettings } from "./api-keys-settings"
import { WorkspaceSettings } from "./workspace-settings"
import { AgentsSettings } from "./agents-settings"
import { ScrollArea } from "@/components/ui/scroll-area"

interface SettingsPanelProps {
  workspaceId: string
  userId?: string
}

export function SettingsPanel({ workspaceId, userId }: SettingsPanelProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4">
        <h1 className="text-lg font-semibold">Settings</h1>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-6">
          <Tabs defaultValue="api-keys" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="api-keys">API Keys</TabsTrigger>
              <TabsTrigger value="agents">AI Agents</TabsTrigger>
              <TabsTrigger value="workspace">Workspace</TabsTrigger>
            </TabsList>
            <TabsContent value="api-keys" className="space-y-4">
              <APIKeysSettings userId={userId} />
            </TabsContent>
            <TabsContent value="agents" className="space-y-4">
              <AgentsSettings workspaceId={workspaceId} />
            </TabsContent>
            <TabsContent value="workspace" className="space-y-4">
              <WorkspaceSettings workspaceId={workspaceId} />
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  )
}
