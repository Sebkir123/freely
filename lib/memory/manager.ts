import { createClient as createSupabaseClient } from '@/lib/supabase/client'

export interface MemoryEntry {
  key: string
  value: string
  metadata?: Record<string, any>
}

export class MemoryManager {
  private supabase = createSupabaseClient()

  async getMemory(workspaceId: string, projectId?: string): Promise<MemoryEntry[]> {
    const query = this.supabase
      .from('team_memory')
      .select('*')
      .eq('workspace_id', workspaceId)

    if (projectId) {
      query.or(`project_id.is.null,project_id.eq.${projectId}`)
    } else {
      query.is('project_id', null)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to fetch memory: ${error.message}`)
    }

    return (data || []).map((entry) => ({
      key: entry.key,
      value: entry.value,
      metadata: entry.metadata || {},
    }))
  }

  async setMemory(
    workspaceId: string,
    key: string,
    value: string,
    projectId?: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    const { error } = await this.supabase
      .from('team_memory')
      .upsert({
        workspace_id: workspaceId,
        project_id: projectId || null,
        key,
        value,
        metadata: metadata || {},
      }, {
        onConflict: 'workspace_id,project_id,key',
      })

    if (error) {
      throw new Error(`Failed to save memory: ${error.message}`)
    }
  }

  async deleteMemory(workspaceId: string, key: string, projectId?: string): Promise<void> {
    const query = this.supabase
      .from('team_memory')
      .delete()
      .eq('workspace_id', workspaceId)
      .eq('key', key)

    if (projectId) {
      query.eq('project_id', projectId)
    } else {
      query.is('project_id', null)
    }

    const { error } = await query

    if (error) {
      throw new Error(`Failed to delete memory: ${error.message}`)
    }
  }

  formatMemoryForContext(memory: MemoryEntry[]): string {
    if (memory.length === 0) {
      return ''
    }

    return memory
      .map((entry) => `**${entry.key}**: ${entry.value}`)
      .join('\n\n')
  }
}

