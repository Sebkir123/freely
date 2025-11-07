export interface ProjectTemplate {
  id: string
  name: string
  description: string
  icon: string
  files: Array<{
    name: string
    content: string
    type: string
  }>
  dependencies?: Record<string, string>
}

export const projectTemplates: ProjectTemplate[] = [
  {
    id: 'html-css-js',
    name: 'HTML + CSS + JS',
    description: 'Basic HTML, CSS, and JavaScript starter',
    icon: '🌐',
    files: [
      {
        name: 'index.html',
        type: 'text/html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Project</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
    <h1>Welcome to Your Project!</h1>
    <p>Start building something amazing.</p>
    <button id="actionBtn">Click Me</button>
  </div>
  <script src="script.js"></script>
</body>
</html>`
      },
      {
        name: 'styles.css',
        type: 'text/css',
        content: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  text-align: center;
  padding: 2rem;
}

h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  animation: fadeIn 1s ease-in;
}

p {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

button {
  background: white;
  color: #667eea;
  border: none;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 50px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

button:active {
  transform: translateY(0);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}`
      },
      {
        name: 'script.js',
        type: 'application/javascript',
        content: `// Get the button element
const button = document.getElementById('actionBtn');

// Add click event listener
button.addEventListener('click', () => {
  alert('Hello from Freely! 🚀');
  console.log('Button clicked!');
});

// Log when page loads
console.log('Page loaded successfully! ✨');`
      }
    ]
  },
  {
    id: 'react-app',
    name: 'React App',
    description: 'React application with modern setup',
    icon: '⚛️',
    files: [
      {
        name: 'index.html',
        type: 'text/html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>React App</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>`
      },
      {
        name: 'src/main.jsx',
        type: 'text/javascript',
        content: `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)`
      },
      {
        name: 'src/App.jsx',
        type: 'text/javascript',
        content: `import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <h1>Welcome to React!</h1>
      <div className="card">
        <button onClick={() => setCount(count + 1)}>
          Count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the React logo to learn more
      </p>
    </div>
  )
}

export default App`
      },
      {
        name: 'src/App.css',
        type: 'text/css',
        content: `#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.App {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

h1 {
  font-size: 3.2em;
  line-height: 1.1;
  background: linear-gradient(to right, #61dafb, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.card {
  padding: 2em;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #8b5cf6;
  color: white;
  cursor: pointer;
  transition: all 0.25s;
}

button:hover {
  background-color: #7c3aed;
  border-color: #8b5cf6;
}

button:focus,
button:focus-visible {
  outline: 4px auto #8b5cf6;
}`
      },
      {
        name: 'src/index.css',
        type: 'text/css',
        content: `:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}

h1 {
  font-size: 3.2em;
  line-height: 1.1;
}`
      },
      {
        name: 'package.json',
        type: 'application/json',
        content: `{
  "name": "react-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.66",
    "@types/react-dom": "^18.2.22",
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.2.0"
  }
}`
      }
    ],
    dependencies: {
      'react': '^18.2.0',
      'react-dom': '^18.2.0'
    }
  },
  {
    id: 'nextjs-app',
    name: 'Next.js App',
    description: 'Next.js 14 with App Router',
    icon: '▲',
    files: [
      {
        name: 'app/page.tsx',
        type: 'text/typescript',
        content: `export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to <span className="text-purple-600">Next.js!</span>
        </h1>
        <p className="text-center text-lg mb-4">
          Get started by editing{' '}
          <code className="font-mono font-bold">app/page.tsx</code>
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <Card
            href="https://nextjs.org/docs"
            title="Docs"
            description="Find in-depth information about Next.js features and API."
          />
          <Card
            href="https://nextjs.org/learn"
            title="Learn"
            description="Learn about Next.js in an interactive course with quizzes!"
          />
        </div>
      </div>
    </main>
  )
}

function Card({
  href,
  title,
  description,
}: {
  href: string
  title: string
  description: string
}) {
  return (
    <a
      href={href}
      className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-purple-300 hover:bg-purple-50"
      target="_blank"
      rel="noopener noreferrer"
    >
      <h2 className="mb-3 text-2xl font-semibold">
        {title}{' '}
        <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
          →
        </span>
      </h2>
      <p className="m-0 max-w-[30ch] text-sm opacity-80">
        {description}
      </p>
    </a>
  )
}`
      },
      {
        name: 'app/layout.tsx',
        type: 'text/typescript',
        content: `import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Next.js App',
  description: 'Created with Freely',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}`
      },
      {
        name: 'app/globals.css',
        type: 'text/css',
        content: `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 214, 219, 220;
  --background-end-rgb: 255, 255, 255;
}

@media (prefers-color-scheme: dark) {
  :root {
    --foreground-rgb: 255, 255, 255;
    --background-start-rgb: 0, 0, 0;
    --background-end-rgb: 0, 0, 0;
  }
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--background-end-rgb))
    )
    rgb(var(--background-start-rgb));
}`
      },
      {
        name: 'package.json',
        type: 'application/json',
        content: `{
  "name": "nextjs-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.2.0",
    "react": "^18",
    "react-dom": "^18"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "tailwindcss": "^3.4.1",
    "eslint": "^8",
    "eslint-config-next": "14.2.0"
  }
}`
      }
    ]
  },
  {
    id: 'express-api',
    name: 'Express API',
    description: 'RESTful API with Express.js',
    icon: '🚂',
    files: [
      {
        name: 'server.js',
        type: 'application/javascript',
        content: `const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Sample data
let items = [
  { id: 1, name: 'Item 1', description: 'First item' },
  { id: 2, name: 'Item 2', description: 'Second item' },
  { id: 3, name: 'Item 3', description: 'Third item' }
];

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Express API!' });
});

app.get('/api/items', (req, res) => {
  res.json(items);
});

app.get('/api/items/:id', (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id));
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  res.json(item);
});

app.post('/api/items', (req, res) => {
  const newItem = {
    id: items.length + 1,
    name: req.body.name,
    description: req.body.description
  };
  items.push(newItem);
  res.status(201).json(newItem);
});

app.put('/api/items/:id', (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id));
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  item.name = req.body.name || item.name;
  item.description = req.body.description || item.description;
  res.json(item);
});

app.delete('/api/items/:id', (req, res) => {
  const index = items.findIndex(i => i.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }
  items.splice(index, 1);
  res.status(204).send();
});

// Start server
app.listen(PORT, () => {
  console.log(\`✅ Server running on http://localhost:\${PORT}\`);
});`
      },
      {
        name: 'package.json',
        type: 'application/json',
        content: `{
  "name": "express-api",
  "version": "1.0.0",
  "description": "Simple Express.js REST API",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}`
      },
      {
        name: 'README.md',
        type: 'text/markdown',
        content: `# Express API

A simple RESTful API built with Express.js.

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

## Endpoints

- \`GET /\` - Welcome message
- \`GET /api/items\` - Get all items
- \`GET /api/items/:id\` - Get item by ID
- \`POST /api/items\` - Create new item
- \`PUT /api/items/:id\` - Update item
- \`DELETE /api/items/:id\` - Delete item

## Example Request

\`\`\`bash
curl http://localhost:3000/api/items
\`\`\`
`
      }
    ]
  },
  {
    id: 'chrome-extension',
    name: 'Chrome Extension',
    description: 'Chrome extension boilerplate',
    icon: '🔌',
    files: [
      {
        name: 'manifest.json',
        type: 'application/json',
        content: `{
  "manifest_version": 3,
  "name": "My Extension",
  "version": "1.0.0",
  "description": "A simple Chrome extension",
  "permissions": [
    "activeTab",
    "storage"
  ],
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icon.png",
      "48": "icon.png",
      "128": "icon.png"
    }
  },
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"]
    }
  ]
}`
      },
      {
        name: 'popup.html',
        type: 'text/html',
        content: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      width: 300px;
      padding: 20px;
      font-family: Arial, sans-serif;
    }
    h1 {
      font-size: 18px;
      margin-bottom: 15px;
      color: #8b5cf6;
    }
    button {
      width: 100%;
      padding: 10px;
      background: linear-gradient(to right, #8b5cf6, #ec4899);
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
    }
    button:hover {
      opacity: 0.9;
    }
    #output {
      margin-top: 15px;
      padding: 10px;
      background: #f3f4f6;
      border-radius: 5px;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <h1>My Extension</h1>
  <button id="actionBtn">Click Me!</button>
  <div id="output"></div>
  <script src="popup.js"></script>
</body>
</html>`
      },
      {
        name: 'popup.js',
        type: 'application/javascript',
        content: `document.getElementById('actionBtn').addEventListener('click', async () => {
  const output = document.getElementById('output');

  // Get current tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  output.textContent = \`Current URL: \${tab.url}\`;

  // Send message to content script
  chrome.tabs.sendMessage(tab.id, { action: 'highlight' });
});

// Listen for messages from background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received in popup:', request);
});`
      },
      {
        name: 'background.js',
        type: 'application/javascript',
        content: `// Background service worker
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed!');
});

// Listen for messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received in background:', request);
  sendResponse({ status: 'ok' });
});

// Handle tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    console.log('Tab loaded:', tab.url);
  }
});`
      },
      {
        name: 'content.js',
        type: 'application/javascript',
        content: `// Content script - runs in the context of web pages
console.log('Content script loaded!');

// Listen for messages from popup or background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'highlight') {
    // Highlight all links on the page
    const links = document.querySelectorAll('a');
    links.forEach(link => {
      link.style.background = 'yellow';
      link.style.padding = '2px 5px';
      link.style.borderRadius = '3px';
    });

    setTimeout(() => {
      links.forEach(link => {
        link.style.background = '';
        link.style.padding = '';
        link.style.borderRadius = '';
      });
    }, 2000);
  }

  sendResponse({ status: 'done' });
});`
      }
    ]
  },
  {
    id: 'blank',
    name: 'Blank Project',
    description: 'Start from scratch',
    icon: '📄',
    files: [
      {
        name: 'index.html',
        type: 'text/html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Project</title>
</head>
<body>
  <h1>Hello World!</h1>
</body>
</html>`
      }
    ]
  }
];

export function getTemplateById(id: string): ProjectTemplate | undefined {
  return projectTemplates.find(t => t.id === id);
}
