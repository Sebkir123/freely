# Quick Start - Zero Setup!

Get your personal AI coding platform running in 2 minutes - **NO DATABASE SETUP NEEDED!**

## Steps

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Add AI API key** (optional - can add in app later)
   ```bash
   # Create .env.local
   echo "OPENAI_API_KEY=your-key-here" > .env.local
   ```
   Or leave it empty and add keys in the app settings.

3. **Run the app**
   ```bash
   npm run dev
   ```

4. **Open browser**
   Navigate to http://localhost:3000
   
   **Done!** Everything is stored locally in your browser. No Supabase, no database, no setup!

## That's It!

- ✅ **No database setup** - Uses IndexedDB (browser storage)
- ✅ **No login** - Just for you
- ✅ **No Supabase** - Works completely offline
- ✅ **Just code** - Create projects, chat with AI, build apps

## Want Cloud Storage?

If you want your data synced across devices:

1. Create Supabase project (free)
2. Run migration SQL
3. Add Supabase URL/key to `.env.local`
4. Restart app - automatically switches to cloud storage

But you don't need it! Local storage works perfectly for personal use.

## Using Local LLM

```bash
# Install Ollama
brew install ollama
ollama pull llama2

# Update .env.local
LOCAL_LLM_BASE_URL=http://localhost:11434
DEFAULT_AI_PROVIDER=local
```
