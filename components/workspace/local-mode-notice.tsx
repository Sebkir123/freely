"use client"

import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Info, X } from "lucide-react"

export function LocalModeNotice() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <Alert className="mb-4 bg-blue-50 border-blue-200">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertTitle className="text-blue-900">Running in Local Mode</AlertTitle>
      <AlertDescription className="text-blue-800">
        <div className="space-y-2">
          <p>
            Your data is stored locally in your browser. To enable cloud sync and collaboration:
          </p>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Create a Supabase project at supabase.com</li>
            <li>Run the database migrations</li>
            <li>Add credentials to .env.local</li>
            <li>Restart the app</li>
          </ol>
          <div className="flex gap-2 mt-3">
            <Button size="sm" variant="outline" asChild>
              <a href="https://supabase.com" target="_blank" rel="noopener noreferrer">
                Get Supabase
              </a>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setDismissed(true)}
            >
              <X className="h-3 w-3 mr-1" />
              Dismiss
            </Button>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  )
}
