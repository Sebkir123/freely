import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Code, Zap, Lock, Puzzle, Brain, Users } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold tracking-tight text-slate-900">
            Your Own <span className="text-blue-600">AI Coding Platform</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Build, collaborate, and ship faster with your private, extensible AI coding assistant.
            Powered by OpenAI, Anthropic, or your local LLMs.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link href="/workspace">
              <Button size="lg" className="text-lg px-8">
                Get Started - No Login Required
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Sign Up for Cloud Sync
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-20">
          <Card>
            <CardHeader>
              <Code className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Professional Code Editor</CardTitle>
              <CardDescription>
                Monaco Editor with syntax highlighting, IntelliSense, and multi-file editing
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Brain className="h-10 w-10 text-purple-600 mb-2" />
              <CardTitle>Multi-Provider AI</CardTitle>
              <CardDescription>
                OpenAI GPT-4, Anthropic Claude, or run local LLMs with Ollama/LM Studio
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Lock className="h-10 w-10 text-green-600 mb-2" />
              <CardTitle>100% Private</CardTitle>
              <CardDescription>
                Self-hostable, local storage mode, encrypted API keys. Your code stays yours.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-10 w-10 text-orange-600 mb-2" />
              <CardTitle>Real-time Collaboration</CardTitle>
              <CardDescription>
                Multi-user workspaces with live document editing and shared AI context
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 text-yellow-600 mb-2" />
              <CardTitle>Custom AI Agents</CardTitle>
              <CardDescription>
                Create specialized AI personalities for code review, documentation, and more
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Puzzle className="h-10 w-10 text-red-600 mb-2" />
              <CardTitle>Extensible Platform</CardTitle>
              <CardDescription>
                Plugin API, team memory, custom integrations. Built for developers.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center space-y-4">
          <h2 className="text-3xl font-bold text-slate-900">
            Ready to build something amazing?
          </h2>
          <p className="text-lg text-slate-600">
            Start coding with AI in seconds. No credit card required.
          </p>
          <div className="pt-4">
            <Link href="/workspace">
              <Button size="lg" className="text-lg px-12">
                Launch Workspace
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t text-center text-sm text-slate-600">
          <div className="space-y-2">
            <p>
              Built with Next.js, Supabase, and Monaco Editor. Open source and self-hostable.
            </p>
            <div className="flex gap-6 justify-center">
              <a href="https://github.com" className="hover:text-blue-600">GitHub</a>
              <a href="/README.md" className="hover:text-blue-600">Documentation</a>
              <a href="/SETUP.md" className="hover:text-blue-600">Setup Guide</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
