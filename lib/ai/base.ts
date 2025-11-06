import type { AIModelConfig, AIMessage, AIResponse, AIStreamChunk } from './types'

export abstract class AIProviderBase {
  protected config: AIModelConfig

  constructor(config: AIModelConfig) {
    this.config = config
  }

  abstract chat(messages: AIMessage[]): Promise<AIResponse>
  abstract streamChat(messages: AIMessage[]): AsyncGenerator<AIStreamChunk, void, unknown>
  
  protected formatMessages(messages: AIMessage[]): any[] {
    return messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    }))
  }
}

