'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Code, Zap, Lock, Puzzle, Brain, Users, ArrowRight, Sparkles, Github } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-20">
          {/* Header */}
          <div className="flex justify-between items-center mb-20">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                <Code className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">Freely</span>
            </div>
            <div className="flex gap-4">
              <Link href="/auth/login">
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  Sign In
                </Button>
              </Link>
              <Link href="https://github.com" target="_blank">
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  <Github className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Content */}
          <div className="text-center space-y-8 max-w-5xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-purple-200 border border-purple-300/20">
              <Sparkles className="h-4 w-4" />
              <span>Open Source AI Coding Platform</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-white">
              Build with AI,
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
                Own Your Data
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              A beautiful, private, and extensible AI coding platform.
              Powered by OpenAI, Anthropic, or your local LLMs.
              No vendor lock-in, complete control.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link href="/workspace">
                <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg shadow-purple-500/50 transition-all hover:shadow-xl hover:shadow-purple-500/60 hover:scale-105">
                  Start Building
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20 transition-all hover:scale-105">
                  Create Account
                </Button>
              </Link>
            </div>

            <p className="text-sm text-gray-400">
              No credit card required • Works offline • 100% open source
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <Code className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">Professional Code Editor</CardTitle>
                <CardDescription className="text-gray-300">
                  Monaco Editor with IntelliSense, syntax highlighting, and multi-language support
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">Multi-Provider AI</CardTitle>
                <CardDescription className="text-gray-300">
                  OpenAI, Anthropic, or local LLMs. Switch providers seamlessly.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center mb-4">
                  <Lock className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">100% Private</CardTitle>
                <CardDescription className="text-gray-300">
                  Self-hostable, local storage, encrypted keys. Your code stays yours.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">Real-time Collaboration</CardTitle>
                <CardDescription className="text-gray-300">
                  Multi-user workspaces with live editing and shared context.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">Custom AI Agents</CardTitle>
                <CardDescription className="text-gray-300">
                  Create specialized agents for code review, docs, and more.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-lg flex items-center justify-center mb-4">
                  <Puzzle className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">Extensible Platform</CardTitle>
                <CardDescription className="text-gray-300">
                  Plugin API, custom integrations. Built for developers.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center space-y-6 py-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Ready to build something amazing?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Join developers building with AI. No credit card, no strings attached.
            </p>
            <Link href="/workspace">
              <Button size="lg" className="text-lg px-12 py-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg shadow-purple-500/50 transition-all hover:shadow-xl hover:shadow-purple-500/60 hover:scale-105">
                Launch Workspace
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Footer */}
          <footer className="pt-12 border-t border-white/10 text-center">
            <div className="space-y-4">
              <p className="text-gray-400">
                Built with Next.js, Supabase, and Monaco Editor
              </p>
              <div className="flex gap-6 justify-center text-sm">
                <a href="https://github.com" className="text-gray-400 hover:text-white transition-colors">
                  GitHub
                </a>
                <a href="/README.md" className="text-gray-400 hover:text-white transition-colors">
                  Documentation
                </a>
                <a href="/SETUP.md" className="text-gray-400 hover:text-white transition-colors">
                  Setup Guide
                </a>
              </div>
              <p className="text-xs text-gray-500">
                Open source and self-hostable
              </p>
            </div>
          </footer>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}
