import { AIProviderBase } from '../base'
import type { AIModelConfig, AIMessage, AIResponse, AIStreamChunk } from '../types'

export class LocalLLMProvider extends AIProviderBase {
  private baseUrl: string

  constructor(config: AIModelConfig, baseUrl: string = 'http://localhost:11434') {
    super(config)
    this.baseUrl = baseUrl
  }

  async chat(messages: AIMessage[]): Promise<AIResponse> {
    // Support both Ollama and LM Studio compatible APIs
    const isOllama = this.baseUrl.includes('localhost:11434') || this.baseUrl.includes('ollama')
    
    if (isOllama) {
      return this.chatOllama(messages)
    } else {
      return this.chatLMStudio(messages)
    }
  }

  private async chatOllama(messages: AIMessage[]): Promise<AIResponse> {
    const systemMessage = messages.find(m => m.role === 'system')
    const conversationMessages = messages.filter(m => m.role !== 'system')
    
    const lastUserMessage = conversationMessages.filter(m => m.role === 'user').pop()
    const context = conversationMessages.slice(0, -1)

    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.config.model,
        prompt: lastUserMessage?.content || '',
        system: systemMessage?.content,
        context: context.length > 0 ? context.map(m => m.content).join('\n') : undefined,
        stream: false,
        options: {
          temperature: this.config.temperature ?? 0.7,
          num_predict: this.config.maxTokens,
        },
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Ollama API error: ${error}`)
    }

    const data = await response.json()
    
    return {
      content: data.response || '',
    }
  }

  private async chatLMStudio(messages: AIMessage[]): Promise<AIResponse> {
    const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: this.formatMessages(messages),
        temperature: this.config.temperature ?? 0.7,
        max_tokens: this.config.maxTokens,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`LM Studio API error: ${error}`)
    }

    const data = await response.json()
    
    return {
      content: data.choices[0]?.message?.content || '',
      usage: data.usage ? {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens,
      } : undefined,
    }
  }

  async *streamChat(messages: AIMessage[]): AsyncGenerator<AIStreamChunk, void, unknown> {
    const isOllama = this.baseUrl.includes('localhost:11434') || this.baseUrl.includes('ollama')
    
    if (isOllama) {
      yield* this.streamOllama(messages)
    } else {
      yield* this.streamLMStudio(messages)
    }
  }

  private async *streamOllama(messages: AIMessage[]): AsyncGenerator<AIStreamChunk, void, unknown> {
    const systemMessage = messages.find(m => m.role === 'system')
    const conversationMessages = messages.filter(m => m.role !== 'system')
    const lastUserMessage = conversationMessages.filter(m => m.role === 'user').pop()

    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.config.model,
        prompt: lastUserMessage?.content || '',
        system: systemMessage?.content,
        stream: true,
        options: {
          temperature: this.config.temperature ?? 0.7,
          num_predict: this.config.maxTokens,
        },
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Ollama API error: ${error}`)
    }

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    if (!reader) {
      throw new Error('No response body')
    }

    try {
      while (true) {
        const { done, value } = await reader.read()
        
        if (done) {
          yield { content: '', done: true }
          break
        }

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n').filter(line => line.trim())

        for (const line of lines) {
          try {
            const parsed = JSON.parse(line)
            const content = parsed.response || ''
            if (content) {
              yield { content, done: false }
            }
            if (parsed.done) {
              yield { content: '', done: true }
              return
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    } finally {
      reader.releaseLock()
    }
  }

  private async *streamLMStudio(messages: AIMessage[]): AsyncGenerator<AIStreamChunk, void, unknown> {
    const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: this.formatMessages(messages),
        temperature: this.config.temperature ?? 0.7,
        max_tokens: this.config.maxTokens,
        stream: true,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`LM Studio API error: ${error}`)
    }

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    if (!reader) {
      throw new Error('No response body')
    }

    let buffer = ''

    try {
      while (true) {
        const { done, value } = await reader.read()
        
        if (done) {
          yield { content: '', done: true }
          break
        }

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') {
              yield { content: '', done: true }
              return
            }

            try {
              const parsed = JSON.parse(data)
              const content = parsed.choices?.[0]?.delta?.content || ''
              if (content) {
                yield { content, done: false }
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } finally {
      reader.releaseLock()
    }
  }
}

