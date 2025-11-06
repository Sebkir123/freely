-- Seed data for Freely platform
-- This creates example workspace, project, and documents for testing

-- Note: For single-user mode, use a default UUID
-- For multi-user, this will need actual user IDs from auth.users

-- Create default workspace (for single-user mode)
INSERT INTO workspaces (id, name, slug, description, owner_id) VALUES
  ('00000000-0000-0000-0000-000000000001', 'My Workspace', 'my-workspace', 'Personal coding workspace', '00000000-0000-0000-0000-000000000000')
ON CONFLICT (id) DO NOTHING;

-- Create example project
INSERT INTO projects (id, workspace_id, name, description, config) VALUES
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000001', 'Example React App', 'A simple React application example', '{"framework": "react", "language": "typescript"}')
ON CONFLICT (id) DO NOTHING;

-- Create example documents
INSERT INTO documents (project_id, name, path, content, language) VALUES
  (
    '00000000-0000-0000-0000-000000000010',
    'App.tsx',
    '/src/App.tsx',
    'import React from ''react'';

function App() {
  return (
    <div className="App">
      <h1>Welcome to Freely!</h1>
      <p>Your AI-powered coding platform</p>
    </div>
  );
}

export default App;',
    'typescript'
  ),
  (
    '00000000-0000-0000-0000-000000000010',
    'index.tsx',
    '/src/index.tsx',
    'import React from ''react'';
import ReactDOM from ''react-dom/client'';
import App from ''./App'';
import ''./index.css'';

ReactDOM.createRoot(document.getElementById(''root'')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);',
    'typescript'
  ),
  (
    '00000000-0000-0000-0000-000000000010',
    'index.css',
    '/src/index.css',
    'body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, ''Segoe UI'', ''Roboto'', ''Oxygen'',
    ''Ubuntu'', ''Cantarell'', ''Fira Sans'', ''Droid Sans'', ''Helvetica Neue'',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, ''Courier New'',
    monospace;
}

.App {
  text-align: center;
  padding: 2rem;
}',
    'css'
  ),
  (
    '00000000-0000-0000-0000-000000000010',
    'README.md',
    '/README.md',
    '# Example React App

This is an example React application created with Freely.

## Features

- React with TypeScript
- AI-powered code assistance
- Real-time collaboration
- Monaco code editor

## Getting Started

1. Explore the file tree on the left
2. Click on files to edit them
3. Use the AI chat to get coding assistance
4. Configure your AI provider in Settings

## AI Assistance

Try asking the AI to:
- Add new features
- Review your code
- Generate components
- Write tests
- Explain code

Enjoy coding with Freely!',
    'markdown'
  ),
  (
    '00000000-0000-0000-0000-000000000010',
    'package.json',
    '/package.json',
    '{
  "name": "example-react-app",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}',
    'json'
  )
ON CONFLICT (project_id, path) DO NOTHING;

-- Create default AI agents
INSERT INTO ai_agents (workspace_id, name, description, system_prompt, model_provider, model_name, is_default) VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    'Code Assistant',
    'General purpose coding assistant',
    'You are an expert software engineer and coding assistant. You help developers write clean, efficient, and well-documented code. You provide clear explanations, follow best practices, and suggest improvements when appropriate.',
    'openai',
    'gpt-4-turbo-preview',
    true
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    'Code Reviewer',
    'Reviews code for quality and best practices',
    'You are a senior code reviewer with expertise in software architecture and best practices. You provide constructive feedback on code quality, performance, security, and maintainability. You identify potential issues and suggest improvements.',
    'openai',
    'gpt-4-turbo-preview',
    false
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    'Documentation Writer',
    'Generates and improves documentation',
    'You are a technical writer who excels at creating clear, comprehensive documentation. You write detailed README files, API documentation, code comments, and user guides. You make complex topics easy to understand.',
    'openai',
    'gpt-3.5-turbo',
    false
  )
ON CONFLICT DO NOTHING;

-- Create example team memory entries
INSERT INTO team_memory (workspace_id, project_id, key, value, metadata) VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000010',
    'coding_style',
    'Use TypeScript for all files. Follow functional programming patterns. Use arrow functions and const/let. Prefer composition over inheritance.',
    '{"category": "conventions"}'
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000010',
    'project_structure',
    'Components go in /src/components. Utilities in /src/utils. Types in /src/types. Follow feature-based folder structure.',
    '{"category": "structure"}'
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    NULL,
    'workspace_goal',
    'Build production-ready, scalable applications with modern best practices.',
    '{"category": "goals"}'
  )
ON CONFLICT (workspace_id, project_id, key) DO NOTHING;
