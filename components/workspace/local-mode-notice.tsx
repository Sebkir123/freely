"use client"

import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Info, X, Sparkles, ExternalLink } from "lucide-react"

export function LocalModeNotice() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <Alert className="border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 border-purple-200 shadow-sm">
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
        </div>
        <div className="flex-1">
          <AlertTitle className="text-purple-900 font-semibold text-base mb-2">
            Running in Local Mode
          </AlertTitle>
          <AlertDescription className="text-purple-800">
            <div className="space-y-3">
              <p className="text-sm">
                Your data is stored locally in your browser. To enable cloud sync and collaboration:
              </p>
              <div className="bg-white/50 rounded-lg p-3 space-y-2">
                <div className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  <p className="text-sm text-purple-900">Create a Supabase project at supabase.com</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  <p className="text-sm text-purple-900">Run the database migrations from /supabase/migrations</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                  <p className="text-sm text-purple-900">Add credentials to .env.local and restart</p>
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white hover:bg-purple-50 border-purple-300 text-purple-700 hover:text-purple-900 transition-colors"
                  asChild
                >
                  <a href="https://supabase.com" target="_blank" rel="noopener noreferrer">
                    Get Supabase
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </a>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setDismissed(true)}
                  className="hover:bg-white/50 text-purple-700"
                >
                  <X className="h-3 w-3 mr-1" />
                  Dismiss
                </Button>
              </div>
            </div>
          </AlertDescription>
        </div>
      </div>
    </Alert>
  )
}
