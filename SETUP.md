# Setup Guide

This guide will help you set up Freely from scratch.

## Step 1: Prerequisites

- Node.js 18+ installed
- npm, yarn, or pnpm
- A Supabase account (free tier works) or self-hosted Supabase
- (Optional) Local LLM setup (Ollama or LM Studio)

## Step 2: Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd Freely

# Install dependencies
npm install
```

## Step 3: Set Up Supabase

### Option A: Using Supabase Cloud

1. Go to https://supabase.com and create a new project
2. Wait for the project to be provisioned
3. Go to Project Settings > API
4. Copy your:
   - Project URL
   - `anon` `public` key
   - `service_role` `secret` key (keep this secure!)

### Option B: Self-Hosted Supabase

1. Follow the [Supabase self-hosting guide](https://supabase.com/docs/guides/self-hosting)
2. Set up your local Supabase instance
3. Get your project URL and keys

## Step 4: Run Database Migrations

### Using Supabase CLI (Recommended)

```bash
# Install Supabase CLI if you haven't
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

### Manual Method

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
4. Run the SQL

## Step 5: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` with your values:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

   # Local LLM (optional)
   LOCAL_LLM_BASE_URL=http://localhost:11434
   DEFAULT_AI_PROVIDER=openai
   ```

## Step 6: Set Up Local LLM (Optional)

### Using Ollama

1. Install Ollama from https://ollama.ai
2. Pull a model:
   ```bash
   ollama pull llama2
   # or for coding
   ollama pull codellama
   ```
3. Verify it's running:
   ```bash
   curl http://localhost:11434/api/tags
   ```
4. Update `.env.local`:
   ```env
   LOCAL_LLM_BASE_URL=http://localhost:11434
   DEFAULT_AI_PROVIDER=local
   ```

### Using LM Studio

1. Install LM Studio from https://lmstudio.ai
2. Download a model (e.g., Llama 2, CodeLlama)
3. Load the model in LM Studio
4. Start the local server (usually runs on port 1234)
5. Update `.env.local`:
   ```env
   LOCAL_LLM_BASE_URL=http://localhost:1234
   DEFAULT_AI_PROVIDER=local
   ```

## Step 7: Run the Application

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Step 8: Create Your First Account

1. Click "Sign Up" on the login page
2. Enter your email and password
3. Check your email for the confirmation link (if email confirmation is enabled)
4. Sign in with your credentials

## Step 9: Configure AI Provider

### Using OpenAI

1. Go to Settings > API Keys
2. Add your OpenAI API key
3. Select OpenAI as your provider
4. Choose a model (e.g., gpt-4, gpt-3.5-turbo)

### Using Anthropic

1. Go to Settings > API Keys
2. Add your Anthropic API key
3. Select Anthropic as your provider
4. Choose a model (e.g., claude-3-opus, claude-3-sonnet)

### Using Local LLM

1. Make sure your local LLM is running
2. Go to Workspace Settings > AI Agents
3. Create or edit an agent
4. Set provider to "local"
5. Set model name (e.g., "llama2", "codellama")
6. Set base URL if different from default

## Step 10: Create Your First Project

1. After logging in, you'll see your workspace
2. Click "New Project"
3. Give it a name and description
4. Click "Create"
5. Add files to your project
6. Start chatting with the AI!

## Troubleshooting

### Database Connection Issues

- Verify your Supabase URL and keys are correct
- Check that your Supabase project is active
- Ensure RLS policies are set up correctly

### AI Provider Issues

- Verify your API keys are correct
- Check API rate limits
- For local LLMs, ensure the service is running

### Real-time Not Working

- Check Supabase Realtime is enabled in your project
- Verify WebSocket connections aren't blocked
- Check browser console for errors

### Build Errors

- Run `npm install` again
- Clear `.next` folder: `rm -rf .next`
- Check Node.js version: `node --version` (should be 18+)

## Next Steps

- Read the [README.md](./README.md) for more information
- Explore the codebase structure
- Customize AI agents for your needs
- Set up team memory for your projects
- Create custom plugins

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review the error messages in the browser console
3. Check Supabase logs in your dashboard
4. Open an issue on GitHub

