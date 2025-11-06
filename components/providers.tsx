"use client"

import { createContext } from "react"

// No auth needed for single-user setup
export function Providers({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
