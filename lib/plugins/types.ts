export interface Plugin {
  id: string
  name: string
  description?: string
  code: string
  config?: Record<string, any>
  isActive: boolean
}

export interface PluginContext {
  workspaceId: string
  projectId?: string
  userId: string
  supabase: any
}

export interface PluginResult {
  success: boolean
  data?: any
  error?: string
}

export type PluginHandler = (context: PluginContext, input: any) => Promise<PluginResult>

