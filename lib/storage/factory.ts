// Storage factory - returns Supabase adapter OR local storage adapter
import { LocalStorageAdapter } from './local'
import type { StorageAdapter } from './types'

let storageAdapter: StorageAdapter | null = null

export function getStorage(): StorageAdapter {
  if (storageAdapter) return storageAdapter

  // Check if Supabase is configured
  const hasSupabase = 
    typeof window !== 'undefined' &&
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (hasSupabase) {
    // Lazy load Supabase adapter
    const { SupabaseStorageAdapter } = require('./supabase')
    storageAdapter = new SupabaseStorageAdapter()
  } else {
    // Use local storage (IndexedDB)
    storageAdapter = new LocalStorageAdapter()
  }

  if (!storageAdapter) {
    throw new Error('Failed to initialize storage adapter')
  }
  return storageAdapter
}

// Force local storage mode
export function useLocalStorage() {
  storageAdapter = new LocalStorageAdapter()
  return storageAdapter
}

