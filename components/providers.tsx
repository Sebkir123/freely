"use client"

import { ThemeProvider } from "./providers/theme-provider"
import { ToastProvider } from "./providers/toast-provider"
import { AuthProvider } from "./providers/auth-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ToastProvider />
        {children}
      </ThemeProvider>
    </AuthProvider>
  )
}
