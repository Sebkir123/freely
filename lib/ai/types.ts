export type AIProvider = 'openai' | 'anthropic' | 'local' | 'custom'

export interface AIModelConfig {
  provider: AIProvider
  model: string
  temperature?: number
  maxTokens?: number
  topP?: number
  frequencyPenalty?: number
  presencePenalty?: number
}

export interface AIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface AIStreamChunk {
  content: string
  done: boolean
  error?: string
}

export interface AIResponse {
  content: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

export interface AIAgent {
  id: string
  name: string
  description?: string
  systemPrompt: string
  modelConfig: AIModelConfig
  config?: Record<string, any>
}

