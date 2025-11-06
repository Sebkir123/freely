// Supabase storage adapter (when Supabase is configured)
import { createClient as createSupabaseClient } from '@/lib/supabase/client'
import type { StorageAdapter } from './types'

export class SupabaseStorageAdapter implements StorageAdapter {
  private supabase = createSupabaseClient()

  async getProjects(workspaceId: string): Promise<any[]> {
    const { data } = await this.supabase
      .from('projects')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('updated_at', { ascending: false })
    return data || []
  }

  async createProject(workspaceId: string, data: any): Promise<any> {
    const { data: project } = await this.supabase
      .from('projects')
      .insert({ workspace_id: workspaceId, ...data })
      .select()
      .single()
    return project
  }

  async updateProject(id: string, data: any): Promise<any> {
    const { data: project } = await this.supabase
      .from('projects')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    return project
  }

  async deleteProject(id: string): Promise<void> {
    await this.supabase.from('projects').delete().eq('id', id)
  }

  async getDocuments(projectId: string): Promise<any[]> {
    const { data } = await this.supabase
      .from('documents')
      .select('*')
      .eq('project_id', projectId)
      .order('updated_at', { ascending: false })
    return data || []
  }

  async getDocument(id: string): Promise<any> {
    const { data } = await this.supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .single()
    return data
  }

  async createDocument(projectId: string, data: any): Promise<any> {
    const { data: doc } = await this.supabase
      .from('documents')
      .insert({ project_id: projectId, ...data })
      .select()
      .single()
    return doc
  }

  async updateDocument(id: string, data: any): Promise<any> {
    const { data: doc } = await this.supabase
      .from('documents')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    return doc
  }

  async deleteDocument(id: string): Promise<void> {
    await this.supabase.from('documents').delete().eq('id', id)
  }

  async getConversations(projectId: string): Promise<any[]> {
    const { data } = await this.supabase
      .from('conversations')
      .select('*')
      .eq('project_id', projectId)
      .order('updated_at', { ascending: false })
    return data || []
  }

  async createConversation(projectId: string, data: any): Promise<any> {
    const { data: conv } = await this.supabase
      .from('conversations')
      .insert({ project_id: projectId, ...data })
      .select()
      .single()
    return conv
  }

  async getMessages(conversationId: string): Promise<any[]> {
    const { data } = await this.supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
    return data || []
  }

  async createMessage(conversationId: string, data: any): Promise<any> {
    const { data: msg } = await this.supabase
      .from('messages')
      .insert({ conversation_id: conversationId, ...data })
      .select()
      .single()
    return msg
  }

  async updateMessage(id: string, data: any): Promise<any> {
    const { data: msg } = await this.supabase
      .from('messages')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    return msg
  }

  async getAgents(workspaceId: string): Promise<any[]> {
    const { data } = await this.supabase
      .from('ai_agents')
      .select('*')
      .eq('workspace_id', workspaceId)
    return data || []
  }

  async createAgent(workspaceId: string, data: any): Promise<any> {
    const { data: agent } = await this.supabase
      .from('ai_agents')
      .insert({ workspace_id: workspaceId, ...data })
      .select()
      .single()
    return agent
  }

  async getApiKeys(): Promise<any[]> {
    const { data } = await this.supabase
      .from('user_api_keys')
      .select('*')
      .eq('is_active', true)
    return data || []
  }

  async createApiKey(data: any): Promise<any> {
    const { data: key } = await this.supabase
      .from('user_api_keys')
      .insert(data)
      .select()
      .single()
    return key
  }

  async getMemory(workspaceId: string, projectId?: string): Promise<any[]> {
    const query = this.supabase
      .from('team_memory')
      .select('*')
      .eq('workspace_id', workspaceId)

    if (projectId) {
      query.or(`project_id.is.null,project_id.eq.${projectId}`)
    } else {
      query.is('project_id', null)
    }

    const { data } = await query
    return data || []
  }

  async setMemory(workspaceId: string, key: string, value: string, projectId?: string): Promise<void> {
    await this.supabase
      .from('team_memory')
      .upsert({
        workspace_id: workspaceId,
        project_id: projectId || null,
        key,
        value,
      }, {
        onConflict: 'workspace_id,project_id,key',
      })
  }

  subscribe(channel: string, callback: (payload: any) => void): () => void {
    const supabaseChannel = this.supabase
      .channel(channel)
      .on('postgres_changes', { event: '*', schema: 'public', table: channel.split(':')[0] }, callback)
      .subscribe()

    return () => {
      this.supabase.removeChannel(supabaseChannel)
    }
  }
}

