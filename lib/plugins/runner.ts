import type { Plugin, PluginContext, PluginResult, PluginHandler } from './types'

export class PluginRunner {
  private plugins: Map<string, PluginHandler> = new Map()

  async registerPlugin(plugin: Plugin): Promise<void> {
    try {
      // Create a sandboxed function from plugin code
      // In production, you'd want more security here
      const handler = new Function(
        'context',
        'input',
        `
        ${plugin.code}
        return pluginHandler(context, input);
        `
      ) as PluginHandler

      this.plugins.set(plugin.id, handler)
    } catch (error: any) {
      throw new Error(`Failed to register plugin ${plugin.name}: ${error.message}`)
    }
  }

  async runPlugin(
    pluginId: string,
    context: PluginContext,
    input: any
  ): Promise<PluginResult> {
    const handler = this.plugins.get(pluginId)

    if (!handler) {
      return {
        success: false,
        error: `Plugin ${pluginId} not found`,
      }
    }

    try {
      const result = await handler(context, input)
      return result
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Plugin execution failed',
      }
    }
  }

  unregisterPlugin(pluginId: string): void {
    this.plugins.delete(pluginId)
  }

  listPlugins(): string[] {
    return Array.from(this.plugins.keys())
  }
}

