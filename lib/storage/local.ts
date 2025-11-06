// Local storage adapter using IndexedDB
import type { StorageAdapter } from './types'

const DB_NAME = 'freely-db'
const DB_VERSION = 1

interface DB {
  projects: IDBObjectStore
  documents: IDBObjectStore
  conversations: IDBObjectStore
  messages: IDBObjectStore
  agents: IDBObjectStore
  apiKeys: IDBObjectStore
  memory: IDBObjectStore
}

let dbPromise: Promise<IDBDatabase> | null = null

function getDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result

      // Projects store
      if (!db.objectStoreNames.contains('projects')) {
        const store = db.createObjectStore('projects', { keyPath: 'id' })
        store.createIndex('workspaceId', 'workspace_id', { unique: false })
      }

      // Documents store
      if (!db.objectStoreNames.contains('documents')) {
        const store = db.createObjectStore('documents', { keyPath: 'id' })
        store.createIndex('projectId', 'project_id', { unique: false })
      }

      // Conversations store
      if (!db.objectStoreNames.contains('conversations')) {
        const store = db.createObjectStore('conversations', { keyPath: 'id' })
        store.createIndex('projectId', 'project_id', { unique: false })
      }

      // Messages store
      if (!db.objectStoreNames.contains('messages')) {
        const store = db.createObjectStore('messages', { keyPath: 'id' })
        store.createIndex('conversationId', 'conversation_id', { unique: false })
      }

      // Agents store
      if (!db.objectStoreNames.contains('agents')) {
        const store = db.createObjectStore('agents', { keyPath: 'id' })
        store.createIndex('workspaceId', 'workspace_id', { unique: false })
      }

      // API Keys store
      if (!db.objectStoreNames.contains('apiKeys')) {
        db.createObjectStore('apiKeys', { keyPath: 'id' })
      }

      // Memory store
      if (!db.objectStoreNames.contains('memory')) {
        const store = db.createObjectStore('memory', { keyPath: 'id' })
        store.createIndex('workspaceId', 'workspace_id', { unique: false })
        store.createIndex('projectId', 'project_id', { unique: false })
      }
    }
  })

  return dbPromise
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export class LocalStorageAdapter implements StorageAdapter {
  async getProjects(workspaceId: string): Promise<any[]> {
    const db = await getDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction('projects', 'readonly')
      const store = tx.objectStore('projects')
      const index = store.index('workspaceId')
      const request = index.getAll(workspaceId)
      
      request.onsuccess = () => resolve(request.result || [])
      request.onerror = () => reject(request.error)
    })
  }

  async createProject(workspaceId: string, data: any): Promise<any> {
    const db = await getDB()
    const project = {
      id: generateId(),
      workspace_id: workspaceId,
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    return new Promise((resolve, reject) => {
      const tx = db.transaction('projects', 'readwrite')
      const store = tx.objectStore('projects')
      const request = store.add(project)
      
      request.onsuccess = () => resolve(project)
      request.onerror = () => reject(request.error)
    })
  }

  async updateProject(id: string, data: any): Promise<any> {
    const db = await getDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction('projects', 'readwrite')
      const store = tx.objectStore('projects')
      const getRequest = store.get(id)
      
      getRequest.onsuccess = () => {
        const project = { ...getRequest.result, ...data, updated_at: new Date().toISOString() }
        const putRequest = store.put(project)
        putRequest.onsuccess = () => resolve(project)
        putRequest.onerror = () => reject(putRequest.error)
      }
      getRequest.onerror = () => reject(getRequest.error)
    })
  }

  async deleteProject(id: string): Promise<void> {
    const db = await getDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction('projects', 'readwrite')
      const store = tx.objectStore('projects')
      const request = store.delete(id)
      
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getDocuments(projectId: string): Promise<any[]> {
    const db = await getDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction('documents', 'readonly')
      const store = tx.objectStore('documents')
      const index = store.index('projectId')
      const request = index.getAll(projectId)
      
      request.onsuccess = () => resolve(request.result || [])
      request.onerror = () => reject(request.error)
    })
  }

  async getDocument(id: string): Promise<any> {
    const db = await getDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction('documents', 'readonly')
      const store = tx.objectStore('documents')
      const request = store.get(id)
      
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async createDocument(projectId: string, data: any): Promise<any> {
    const db = await getDB()
    const document = {
      id: generateId(),
      project_id: projectId,
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    return new Promise((resolve, reject) => {
      const tx = db.transaction('documents', 'readwrite')
      const store = tx.objectStore('documents')
      const request = store.add(document)
      
      request.onsuccess = () => resolve(document)
      request.onerror = () => reject(request.error)
    })
  }

  async updateDocument(id: string, data: any): Promise<any> {
    const db = await getDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction('documents', 'readwrite')
      const store = tx.objectStore('documents')
      const getRequest = store.get(id)
      
      getRequest.onsuccess = () => {
        const doc = { ...getRequest.result, ...data, updated_at: new Date().toISOString() }
        const putRequest = store.put(doc)
        putRequest.onsuccess = () => resolve(doc)
        putRequest.onerror = () => reject(putRequest.error)
      }
      getRequest.onerror = () => reject(getRequest.error)
    })
  }

  async deleteDocument(id: string): Promise<void> {
    const db = await getDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction('documents', 'readwrite')
      const store = tx.objectStore('documents')
      const request = store.delete(id)
      
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getConversations(projectId: string): Promise<any[]> {
    const db = await getDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction('conversations', 'readonly')
      const store = tx.objectStore('conversations')
      const index = store.index('projectId')
      const request = index.getAll(projectId)
      
      request.onsuccess = () => resolve(request.result || [])
      request.onerror = () => reject(request.error)
    })
  }

  async createConversation(projectId: string, data: any): Promise<any> {
    const db = await getDB()
    const conversation = {
      id: generateId(),
      project_id: projectId,
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    return new Promise((resolve, reject) => {
      const tx = db.transaction('conversations', 'readwrite')
      const store = tx.objectStore('conversations')
      const request = store.add(conversation)
      
      request.onsuccess = () => resolve(conversation)
      request.onerror = () => reject(request.error)
    })
  }

  async getMessages(conversationId: string): Promise<any[]> {
    const db = await getDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction('messages', 'readonly')
      const store = tx.objectStore('messages')
      const index = store.index('conversationId')
      const request = index.getAll(conversationId)
      
      request.onsuccess = () => resolve((request.result || []).sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      ))
      request.onerror = () => reject(request.error)
    })
  }

  async createMessage(conversationId: string, data: any): Promise<any> {
    const db = await getDB()
    const message = {
      id: generateId(),
      conversation_id: conversationId,
      ...data,
      created_at: new Date().toISOString(),
    }

    return new Promise((resolve, reject) => {
      const tx = db.transaction('messages', 'readwrite')
      const store = tx.objectStore('messages')
      const request = store.add(message)
      
      request.onsuccess = () => resolve(message)
      request.onerror = () => reject(request.error)
    })
  }

  async updateMessage(id: string, data: any): Promise<any> {
    const db = await getDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction('messages', 'readwrite')
      const store = tx.objectStore('messages')
      const getRequest = store.get(id)
      
      getRequest.onsuccess = () => {
        const msg = { ...getRequest.result, ...data }
        const putRequest = store.put(msg)
        putRequest.onsuccess = () => resolve(msg)
        putRequest.onerror = () => reject(putRequest.error)
      }
      getRequest.onerror = () => reject(getRequest.error)
    })
  }

  async getAgents(workspaceId: string): Promise<any[]> {
    const db = await getDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction('agents', 'readonly')
      const store = tx.objectStore('agents')
      const index = store.index('workspaceId')
      const request = index.getAll(workspaceId)
      
      request.onsuccess = () => resolve(request.result || [])
      request.onerror = () => reject(request.error)
    })
  }

  async createAgent(workspaceId: string, data: any): Promise<any> {
    const db = await getDB()
    const agent = {
      id: generateId(),
      workspace_id: workspaceId,
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    return new Promise((resolve, reject) => {
      const tx = db.transaction('agents', 'readwrite')
      const store = tx.objectStore('agents')
      const request = store.add(agent)
      
      request.onsuccess = () => resolve(agent)
      request.onerror = () => reject(request.error)
    })
  }

  async getApiKeys(): Promise<any[]> {
    const db = await getDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction('apiKeys', 'readonly')
      const store = tx.objectStore('apiKeys')
      const request = store.getAll()
      
      request.onsuccess = () => resolve(request.result || [])
      request.onerror = () => reject(request.error)
    })
  }

  async createApiKey(data: any): Promise<any> {
    const db = await getDB()
    const key = {
      id: generateId(),
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    return new Promise((resolve, reject) => {
      const tx = db.transaction('apiKeys', 'readwrite')
      const store = tx.objectStore('apiKeys')
      const request = store.add(key)
      
      request.onsuccess = () => resolve(key)
      request.onerror = () => reject(request.error)
    })
  }

  async getMemory(workspaceId: string, projectId?: string): Promise<any[]> {
    const db = await getDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction('memory', 'readonly')
      const store = tx.objectStore('memory')
      const index = store.index('workspaceId')
      const request = index.getAll(workspaceId)
      
      request.onsuccess = () => {
        const all = request.result || []
        const filtered = projectId 
          ? all.filter(m => !m.project_id || m.project_id === projectId)
          : all.filter(m => !m.project_id)
        resolve(filtered)
      }
      request.onerror = () => reject(request.error)
    })
  }

  async setMemory(workspaceId: string, key: string, value: string, projectId?: string): Promise<void> {
    const db = await getDB()
    const memory = {
      id: `${workspaceId}-${projectId || 'global'}-${key}`,
      workspace_id: workspaceId,
      project_id: projectId || null,
      key,
      value,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    return new Promise((resolve, reject) => {
      const tx = db.transaction('memory', 'readwrite')
      const store = tx.objectStore('memory')
      const request = store.put(memory)
      
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }
}

