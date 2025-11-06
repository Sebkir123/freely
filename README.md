# Freely - Personal AI Coding Platform

Your own personal AI coding platform - private, extensible, and completely under your control. Inspired by Lovable but built for solo developers who want the best coding experience.

## Features

- 🤖 **AI Chat** - Chat with AI assistants that understand your project context
- 📝 **Code Editor** - Edit code files with syntax highlighting
- 🧠 **Project Memory** - Persistent project context and conversation history
- 🔌 **Pluggable AI Providers** - Support for OpenAI, Anthropic, and local LLMs (Ollama, LM Studio)
- 🔐 **100% Private** - Your data, your control - self-hostable with local options
- 🎨 **Custom AI Agents** - Create custom AI personalities for different tasks
- 🔧 **Extensible** - Plugin API for extending functionality
- ⚡ **No Login Required** - Just for you, no authentication needed

## Architecture

- **Frontend**: Next.js 14 (App Router) with TypeScript, Tailwind CSS, and ShadCN UI
- **Backend**: Supabase (Database, Realtime, Edge Functions)
- **AI Engine**: Pluggable architecture supporting multiple providers
- **Real-time**: Supabase Realtime for collaboration and document sync

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- (Optional) Supabase account - only if you want cloud storage
- (Optional) Local LLM setup (Ollama or LM Studio)

### Installation - Zero Setup Mode (Local Storage)

1. **Clone and install**
   ```bash
   git clone <your-repo-url>
   cd Freely
   npm install
   ```

2. **Configure AI API key** (optional - can add in app)
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local`:
   ```env
   # Leave Supabase empty - uses local storage automatically!
   OPENAI_API_KEY=your-key-here
   # or
   ANTHROPIC_API_KEY=your-key-here
   ```

3. **Run the app**
   ```bash
   npm run dev
   ```

4. **Open browser**
   Navigate to http://localhost:3000
   
   **That's it!** Everything is stored locally in your browser (IndexedDB). No database setup needed!

### Optional: Cloud Storage with Supabase

If you want cloud storage instead of local:

1. Create a Supabase project at https://supabase.com
2. Run the migration: `supabase/migrations/001_initial_schema.sql`
3. Add to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```
4. Restart the app - it will automatically use Supabase instead of local storage

## Local LLM Setup

### Option 1: Ollama

1. Install Ollama from https://ollama.ai
2. Pull a model:
   ```bash
   ollama pull llama2
   # or
   ollama pull codellama
   ```
3. Set in `.env.local`:
   ```env
   LOCAL_LLM_BASE_URL=http://localhost:11434
   DEFAULT_AI_PROVIDER=local
   ```

### Option 2: LM Studio

1. Install LM Studio from https://lmstudio.ai
2. Download and load a model
3. Start the local server in LM Studio
4. Set in `.env.local`:
   ```env
   LOCAL_LLM_BASE_URL=http://localhost:1234
   DEFAULT_AI_PROVIDER=local
   ```

## Project Structure

```
Freely/
├── app/                    # Next.js app directory
│   ├── api/                # API routes
│   ├── auth/               # Authentication routes
│   ├── workspace/         # Workspace pages
│   └── layout.tsx          # Root layout
├── components/             # React components
│   ├── ui/                 # ShadCN UI components
│   ├── workspace/          # Workspace-specific components
│   └── auth/               # Authentication components
├── lib/                    # Utility libraries
│   ├── ai/                 # AI provider implementations
│   │   ├── providers/     # OpenAI, Anthropic, Local providers
│   │   ├── factory.ts      # Provider factory
│   │   └── types.ts        # Type definitions
│   └── supabase/           # Supabase client utilities
├── supabase/
│   ├── functions/          # Edge Functions
│   └── migrations/         # Database migrations
└── public/                 # Static assets
```

## Database Schema

The application uses the following main tables:

- `workspaces` - User workspaces
- `workspace_members` - Workspace membership and roles
- `projects` - Projects within workspaces
- `documents` - Code files and documents
- `conversations` - Chat conversations
- `messages` - Chat messages
- `ai_agents` - Custom AI agent configurations
- `team_memory` - Shared project context
- `user_api_keys` - Encrypted user API keys
- `plugins` - Custom plugins/extensions

See `supabase/migrations/001_initial_schema.sql` for the complete schema.

## API Keys Management

Users can add their own API keys in the settings. Keys are encrypted and stored securely. Each user's keys are isolated and never shared.

To add an API key:
1. Go to Settings
2. Navigate to API Keys
3. Add your OpenAI, Anthropic, or custom API key
4. Select it as active

## Custom AI Agents

Create custom AI personalities for your workspace:

1. Go to Workspace Settings
2. Navigate to AI Agents
3. Create a new agent with:
   - Name and description
   - System prompt
   - Model provider and model name
   - Temperature and other parameters

## Team Memory

Team memory stores shared project context that all AI conversations can access:

- Project-specific context
- Code patterns and conventions
- Architecture decisions
- Common solutions

Access team memory from the workspace settings.

## Real-time Collaboration

The platform uses Supabase Realtime for:
- Live document editing
- Real-time chat messages
- Collaborative code changes
- Presence indicators

## Security

- Row Level Security (RLS) enabled on all tables
- User API keys are encrypted
- Self-hostable architecture
- No vendor lock-in
- Local data storage option

## Development

### Running Tests

```bash
npm run test
```

### Type Checking

```bash
npm run type-check
```

### Building for Production

```bash
npm run build
npm start
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Self-Hosted

1. Set up a server with Node.js
2. Configure environment variables
3. Build and run:
   ```bash
   npm run build
   npm start
   ```

### Supabase Edge Functions

Deploy edge functions:

```bash
supabase functions deploy process-ai-task
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please open an issue on GitHub.

## Roadmap

- [ ] Enhanced code editor with syntax highlighting
- [ ] File tree navigation
- [ ] Git integration
- [ ] Code execution environment
- [ ] More AI provider integrations
- [ ] Plugin marketplace
- [ ] Advanced memory management
- [ ] Export/import projects
- [ ] Mobile app

