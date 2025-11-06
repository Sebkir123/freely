import { WorkspaceLayout } from '@/components/workspace/layout'

export default async function WorkspacePage() {
  // Single workspace for personal use
  const workspaceId = 'default-workspace'

  return <WorkspaceLayout workspaceId={workspaceId} />
}
