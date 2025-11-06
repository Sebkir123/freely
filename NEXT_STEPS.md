# Next Steps - Getting Freely Running

Follow these steps to get your Freely instance up and running:

## 🚀 Immediate Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Supabase

#### Option A: Supabase Cloud (Easiest)
1. Go to https://supabase.com and create a free account
2. Create a new project
3. Wait for provisioning (2-3 minutes)
4. Go to **Settings > API** and copy:
   - Project URL
   - `anon` `public` key
   - `service_role` `secret` key (keep this secure!)

#### Option B: Self-Hosted Supabase
1. Follow the [Supabase self-hosting guide](https://supabase.com/docs/guides/self-hosting)
2. Set up your local instance
3. Get your project URL and keys

### 3. Run Database Migration

**Using Supabase Dashboard (Recommended):**
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
5. Paste and click **Run**
6. Verify tables were created in **Table Editor**

**Using Supabase CLI:**
```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

### 4. Configure Environment Variables

Create `.env.local` file:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional: Local LLM
LOCAL_LLM_BASE_URL=http://localhost:11434
DEFAULT_AI_PROVIDER=openai

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Start Development Server
```bash
npm run dev
```

### 6. Open Browser
Navigate to http://localhost:3000

### 7. Run Single-User Migration (Optional)
If you want to simplify the database for single-user use:
```bash
# Copy the SQL from supabase/migrations/002_simplify_for_single_user.sql
# and run it in Supabase SQL Editor
```

### 8. Add API Key (Required for AI Features)

**Option A: OpenAI**
1. Get API key from https://platform.openai.com/api-keys
2. In Freely, go to Settings (or workspace settings)
3. Add your OpenAI API key
4. Select OpenAI as provider

**Option B: Anthropic**
1. Get API key from https://console.anthropic.com/
2. Add to Freely settings
3. Select Anthropic as provider

**Option C: Local LLM (Ollama)**
```bash
# Install Ollama
brew install ollama  # macOS
# or download from https://ollama.ai

# Pull a model
ollama pull llama2
# or for coding
ollama pull codellama

# Update .env.local
LOCAL_LLM_BASE_URL=http://localhost:11434
DEFAULT_AI_PROVIDER=local
```

## ✅ Verification Checklist

- [ ] Dependencies installed (`npm install` completed)
- [ ] Supabase project created
- [ ] Database migration run successfully
- [ ] `.env.local` configured with Supabase credentials
- [ ] Development server starts without errors
- [ ] Can sign up/login
- [ ] Workspace loads after login
- [ ] Can create a project
- [ ] Can add files/documents
- [ ] API key added (OpenAI/Anthropic/Local)
- [ ] AI chat works

## 🔧 Troubleshooting

### Database Connection Issues
- Verify Supabase URL and keys are correct
- Check Supabase project is active (not paused)
- Ensure RLS policies are enabled

### AI Not Responding
- Verify API key is correct
- Check API rate limits
- For local LLM, ensure service is running
- Check browser console for errors

### Real-time Not Working
- Verify Supabase Realtime is enabled in project settings
- Check WebSocket connections aren't blocked
- Review browser console for connection errors

### Build Errors
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run dev
```

## 🎯 After Setup - What to Try

1. **Create a Project**
   - Click "New Project"
   - Name it "Test Project"

2. **Add a File**
   - Click "New File"
   - Name it `app.tsx`
   - Add some code

3. **Chat with AI**
   - Type: "Create a React component for a todo list"
   - Watch the AI generate code

4. **Test Real-time**
   - Open in two browsers
   - Edit a document in one
   - See it update in the other

5. **Configure AI Agent**
   - Go to Workspace Settings
   - Create a custom AI agent
   - Set custom system prompt

## 📚 Additional Resources

- **Full Documentation**: See `README.md`
- **Detailed Setup**: See `SETUP.md`
- **Quick Start**: See `QUICKSTART.md`
- **Contributing**: See `CONTRIBUTING.md`

## 🚀 Production Deployment

When ready to deploy:

1. **Build for Production**
   ```bash
   npm run build
   ```

2. **Deploy Options:**
   - **Vercel** (Recommended): Connect GitHub repo, add env vars, deploy
   - **Self-hosted**: Set up Node.js server, configure env vars, run `npm start`
   - **Docker**: Create Dockerfile (can add if needed)

3. **Environment Variables**
   - Add all `.env.local` vars to your hosting platform
   - Never commit `.env.local` to git

4. **Supabase Edge Functions**
   ```bash
   supabase functions deploy process-ai-task
   ```

## 💡 Next Enhancements (Optional)

- [ ] Add file tree navigation
- [ ] Enhance code editor (Monaco Editor)
- [ ] Add Git integration
- [ ] Implement code execution
- [ ] Add more AI providers
- [ ] Create plugin marketplace
- [ ] Add mobile responsive improvements

---

**Need Help?** Check the troubleshooting section or open an issue on GitHub.

