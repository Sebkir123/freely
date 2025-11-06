import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAIProvider } from '@/lib/ai/factory'
import type { AIModelConfig, AIMessage } from '@/lib/ai/types'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()
    const { conversationId, projectId, workspaceId, message, history } = body

    // Get workspace AI agent configuration
    const { data: agent } = await supabase
      .from('ai_agents')
      .select('*')
      .eq('workspace_id', workspaceId)
      .eq('is_default', true)
      .single()

    // Get workspace API keys (not user-specific)
    const { data: apiKeys } = await supabase
      .from('user_api_keys')
      .select('*')
      .eq('is_active', true)
      .limit(10) // Get any active keys

    // Get team memory for context
    const { data: memory } = await supabase
      .from('team_memory')
      .select('*')
      .eq('workspace_id', workspaceId)
      .or(`project_id.is.null,project_id.eq.${projectId}`)

    // Build context from memory
    const memoryContext = memory
      ?.map((m) => `${m.key}: ${m.value}`)
      .join('\n') || ''

    // Determine AI provider and config
    const provider = agent?.model_provider || process.env.DEFAULT_AI_PROVIDER || 'openai'
    const modelName = agent?.model_name || 'gpt-4'
    
    // Try to get API key from workspace keys, or use env var
    let apiKey = apiKeys?.find(k => k.provider === provider)?.encrypted_key
    
    // Fallback to environment variables
    if (!apiKey && provider === 'openai') {
      apiKey = process.env.OPENAI_API_KEY
    }
    if (!apiKey && provider === 'anthropic') {
      apiKey = process.env.ANTHROPIC_API_KEY
    }
    
    if (!apiKey && provider !== 'local') {
      return new Response(
        JSON.stringify({ error: `No API key found for provider: ${provider}. Add one in settings or set ${provider.toUpperCase()}_API_KEY in .env.local` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const modelConfig: AIModelConfig = {
      provider: provider as any,
      model: modelName,
      temperature: agent?.config?.temperature ?? 0.7,
      maxTokens: agent?.config?.maxTokens ?? 2000,
    }

    // Build messages with system prompt and context
    const systemPrompt = agent?.system_prompt || 'You are a helpful AI coding assistant.'
    const contextPrompt = memoryContext
      ? `\n\nProject Context:\n${memoryContext}`
      : ''

    const messages: AIMessage[] = [
      {
        role: 'system',
        content: systemPrompt + contextPrompt,
      },
      ...(history || []),
      {
        role: 'user',
        content: message,
      },
    ]

    // Create AI provider
    const aiProvider = createAIProvider(
      modelConfig,
      apiKey,
      process.env.LOCAL_LLM_BASE_URL || 'http://localhost:11434'
    )

    // Stream response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of aiProvider.streamChat(messages)) {
            if (chunk.error) {
              controller.error(new Error(chunk.error))
              return
            }

            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ content: chunk.content })}\n\n`)
            )

            if (chunk.done) {
              controller.enqueue(encoder.encode('data: [DONE]\n\n'))
              controller.close()
            }
          }
        } catch (error: any) {
          controller.error(error)
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error: any) {
    console.error('AI chat error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
