-- Simplify schema for single-user setup
-- Make user_id fields nullable or use dummy UUID

-- Update workspaces to not require owner_id
ALTER TABLE workspaces ALTER COLUMN owner_id DROP NOT NULL;

-- Update conversations to not require created_by
ALTER TABLE conversations ALTER COLUMN created_by DROP NOT NULL;

-- Update messages to not require created_by
ALTER TABLE messages ALTER COLUMN created_by DROP NOT NULL;

-- Update user_api_keys to not require user_id (workspace-level keys)
ALTER TABLE user_api_keys ALTER COLUMN user_id DROP NOT NULL;

-- Disable RLS for single-user setup (optional - you can keep it if you want)
-- ALTER TABLE workspaces DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE documents DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE conversations DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE ai_agents DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE team_memory DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE user_api_keys DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE plugins DISABLE ROW LEVEL SECURITY;

-- Or update RLS policies to allow all for single user
-- This is safer than disabling RLS entirely

-- Update workspace policies to allow all
DROP POLICY IF EXISTS "Users can view workspaces they belong to" ON workspaces;
CREATE POLICY "Allow all for single user" ON workspaces FOR ALL USING (true);

DROP POLICY IF EXISTS "Users can create workspaces" ON workspaces;
DROP POLICY IF EXISTS "Owners can update their workspaces" ON workspaces;

-- Update project policies
DROP POLICY IF EXISTS "Workspace members can view projects" ON projects;
DROP POLICY IF EXISTS "Workspace members can create projects" ON projects;
DROP POLICY IF EXISTS "Workspace members can update projects" ON projects;
CREATE POLICY "Allow all for single user" ON projects FOR ALL USING (true);

-- Update document policies
DROP POLICY IF EXISTS "Project members can view documents" ON documents;
DROP POLICY IF EXISTS "Project members can manage documents" ON documents;
CREATE POLICY "Allow all for single user" ON documents FOR ALL USING (true);

-- Update conversation policies
DROP POLICY IF EXISTS "Project members can view conversations" ON conversations;
DROP POLICY IF EXISTS "Project members can create conversations" ON conversations;
CREATE POLICY "Allow all for single user" ON conversations FOR ALL USING (true);

-- Update message policies
DROP POLICY IF EXISTS "Conversation members can view messages" ON messages;
DROP POLICY IF EXISTS "Conversation members can create messages" ON messages;
CREATE POLICY "Allow all for single user" ON messages FOR ALL USING (true);

-- Update AI agent policies
DROP POLICY IF EXISTS "Workspace members can view agents" ON ai_agents;
DROP POLICY IF EXISTS "Workspace admins can manage agents" ON ai_agents;
CREATE POLICY "Allow all for single user" ON ai_agents FOR ALL USING (true);

-- Update team memory policies
DROP POLICY IF EXISTS "Workspace members can view memory" ON team_memory;
DROP POLICY IF EXISTS "Workspace members can manage memory" ON team_memory;
CREATE POLICY "Allow all for single user" ON team_memory FOR ALL USING (true);

-- Update API key policies
DROP POLICY IF EXISTS "Users can view their own API keys" ON user_api_keys;
DROP POLICY IF EXISTS "Users can manage their own API keys" ON user_api_keys;
CREATE POLICY "Allow all for single user" ON user_api_keys FOR ALL USING (true);

-- Update plugin policies
DROP POLICY IF EXISTS "Workspace members can view plugins" ON plugins;
DROP POLICY IF EXISTS "Workspace admins can manage plugins" ON plugins;
CREATE POLICY "Allow all for single user" ON plugins FOR ALL USING (true);

