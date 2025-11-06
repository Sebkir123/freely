// Storage abstraction - works with Supabase OR local storage
export interface StorageAdapter {
  // Projects
  getProjects(workspaceId: string): Promise<any[]>
  createProject(workspaceId: string, data: any): Promise<any>
  updateProject(id: string, data: any): Promise<any>
  deleteProject(id: string): Promise<void>

  // Documents
  getDocuments(projectId: string): Promise<any[]>
  getDocument(id: string): Promise<any>
  createDocument(projectId: string, data: any): Promise<any>
  updateDocument(id: string, data: any): Promise<any>
  deleteDocument(id: string): Promise<void>

  // Conversations
  getConversations(projectId: string): Promise<any[]>
  createConversation(projectId: string, data: any): Promise<any>

  // Messages
  getMessages(conversationId: string): Promise<any[]>
  createMessage(conversationId: string, data: any): Promise<any>
  updateMessage(id: string, data: any): Promise<any>

  // AI Agents
  getAgents(workspaceId: string): Promise<any[]>
  createAgent(workspaceId: string, data: any): Promise<any>

  // API Keys
  getApiKeys(): Promise<any[]>
  createApiKey(data: any): Promise<any>

  // Memory
  getMemory(workspaceId: string, projectId?: string): Promise<any[]>
  setMemory(workspaceId: string, key: string, value: string, projectId?: string): Promise<void>

  // Realtime subscriptions (optional)
  subscribe?(channel: string, callback: (payload: any) => void): () => void
}

