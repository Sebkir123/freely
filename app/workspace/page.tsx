'use client'

import { ProtectedRoute } from '@/components/providers/auth-provider'
import { EnhancedWorkspaceLayout } from '@/components/workspace/enhanced-layout'
import { useAuth } from '@/components/providers/auth-provider'

export default function WorkspacePage() {
  const { user } = useAuth()

  // User-specific workspace
  const workspaceId = user?.id || 'default-workspace'

  return (
    <ProtectedRoute>
      <EnhancedWorkspaceLayout workspaceId={workspaceId} />
    </ProtectedRoute>
  )
}
