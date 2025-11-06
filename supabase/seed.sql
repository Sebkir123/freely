-- Seed data for development/testing
-- Run this after initial migration

-- Insert a default AI agent (requires a workspace_id, so this is just an example)
-- You'll need to replace the workspace_id with an actual one from your database

-- Example: Create a default workspace and agent
DO $$
DECLARE
  v_workspace_id UUID;
  v_user_id UUID;
BEGIN
  -- Get the first user (or create one manually)
  SELECT id INTO v_user_id FROM auth.users LIMIT 1;
  
  IF v_user_id IS NOT NULL THEN
    -- Create a default workspace
    INSERT INTO workspaces (name, slug, description, owner_id)
    VALUES (
      'Default Workspace',
      'default-workspace',
      'My default workspace',
      v_user_id
    )
    RETURNING id INTO v_workspace_id;
    
    -- Create a default project
    INSERT INTO projects (workspace_id, name, description, config)
    VALUES (
      v_workspace_id,
      'Getting Started',
      'A sample project to get started',
      '{}'::jsonb
    );
    
    -- Create a default AI agent
    INSERT INTO ai_agents (
      workspace_id,
      name,
      description,
      system_prompt,
      model_provider,
      model_name,
      config,
      is_default
    )
    VALUES (
      v_workspace_id,
      'Default Assistant',
      'The default AI coding assistant',
      'You are a helpful AI coding assistant. You help developers write, debug, and understand code. You provide clear explanations and suggest best practices.',
      'openai',
      'gpt-4',
      '{"temperature": 0.7, "maxTokens": 2000}'::jsonb,
      true
    );
    
    -- Add some team memory
    INSERT INTO team_memory (workspace_id, key, value, metadata)
    VALUES
      (v_workspace_id, 'coding_style', 'We prefer TypeScript with strict mode enabled', '{}'::jsonb),
      (v_workspace_id, 'architecture', 'We use Next.js App Router for frontend and Supabase for backend', '{}'::jsonb);
  END IF;
END $$;

-- Create a sample document (requires a project_id)
-- This will be created when you create your first project through the UI

