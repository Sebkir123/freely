import { AIProviderBase } from './base'
import { OpenAIProvider } from './providers/openai'
import { AnthropicProvider } from './providers/anthropic'
import { LocalLLMProvider } from './providers/local'
import type { AIProvider, AIModelConfig } from './types'

export function createAIProvider(
  config: AIModelConfig,
  apiKey?: string,
  baseUrl?: string
): AIProviderBase {
  switch (config.provider) {
    case 'openai':
      if (!apiKey) {
        throw new Error('OpenAI API key is required')
      }
      return new OpenAIProvider(config, apiKey)
    
    case 'anthropic':
      if (!apiKey) {
        throw new Error('Anthropic API key is required')
      }
      return new AnthropicProvider(config, apiKey)
    
    case 'local':
      return new LocalLLMProvider(config, baseUrl)
    
    default:
      throw new Error(`Unsupported AI provider: ${config.provider}`)
  }
}

