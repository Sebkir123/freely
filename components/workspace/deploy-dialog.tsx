'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Zap, ExternalLink, CheckCircle2, Loader2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface DeployDialogProps {
  isOpen: boolean
  onClose: () => void
  projectName: string
  onDeploy?: (platform: DeployPlatform, config: DeployConfig) => Promise<string>
}

type DeployPlatform = 'vercel' | 'netlify' | 'cloudflare'

interface DeployConfig {
  siteName: string
  buildCommand?: string
  outputDirectory?: string
}

const platforms = [
  {
    id: 'vercel' as DeployPlatform,
    name: 'Vercel',
    icon: '▲',
    description: 'Optimal for Next.js & React',
    color: 'from-black to-slate-800'
  },
  {
    id: 'netlify' as DeployPlatform,
    name: 'Netlify',
    icon: '◆',
    description: 'Great for static sites',
    color: 'from-teal-500 to-cyan-600'
  },
  {
    id: 'cloudflare' as DeployPlatform,
    name: 'Cloudflare Pages',
    icon: '☁️',
    description: 'Fast global CDN',
    color: 'from-orange-500 to-yellow-500'
  }
]

export function DeployDialog({ isOpen, onClose, projectName, onDeploy }: DeployDialogProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<DeployPlatform | null>(null)
  const [siteName, setSiteName] = useState(projectName.toLowerCase().replace(/\s+/g, '-'))
  const [buildCommand, setBuildCommand] = useState('npm run build')
  const [outputDirectory, setOutputDirectory] = useState('dist')
  const [isDeploying, setIsDeploying] = useState(false)
  const [deployStatus, setDeployStatus] = useState<'idle' | 'deploying' | 'success' | 'error'>('idle')
  const [deployUrl, setDeployUrl] = useState('')
  const [error, setError] = useState('')

  const handleDeploy = async () => {
    if (!selectedPlatform || !siteName.trim()) return

    setIsDeploying(true)
    setDeployStatus('deploying')
    setError('')

    try {
      const config: DeployConfig = {
        siteName: siteName.trim(),
        buildCommand,
        outputDirectory
      }

      if (onDeploy) {
        const url = await onDeploy(selectedPlatform, config)
        setDeployUrl(url)
      } else {
        // Simulate deploy
        await new Promise(resolve => setTimeout(resolve, 3000))
        const mockUrl = `https://${siteName}.${selectedPlatform === 'vercel' ? 'vercel.app' : selectedPlatform === 'netlify' ? 'netlify.app' : 'pages.dev'}`
        setDeployUrl(mockUrl)
      }

      setDeployStatus('success')
      toast.success('Deployment successful! 🚀', {
        description: 'Your site is now live'
      })

      // Fire confetti
      if (typeof window !== 'undefined') {
        const confetti = require('canvas-confetti')
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        })
      }
    } catch (err) {
      setDeployStatus('error')
      setError(err instanceof Error ? err.message : 'Deploy failed')
      toast.error('Deployment failed', {
        description: error || 'Please try again'
      })
    } finally {
      setIsDeploying(false)
    }
  }

  const resetDialog = () => {
    setSelectedPlatform(null)
    setSiteName(projectName.toLowerCase().replace(/\s+/g, '-'))
    setDeployStatus('idle')
    setDeployUrl('')
    setError('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={resetDialog}>
      <DialogContent className="max-w-2xl p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b bg-gradient-to-r from-purple-50 to-pink-50">
          <DialogTitle className="text-xl flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-500" />
            Deploy Project
          </DialogTitle>
          <p className="text-sm text-slate-600 mt-1">
            Deploy your project to production in seconds
          </p>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {deployStatus === 'success' ? (
            // Success view
            <div className="py-8 space-y-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Deployment Complete!</h3>
                  <p className="text-slate-600 mt-1">Your site is now live</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border">
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm text-purple-600 font-mono">
                    {deployUrl}
                  </code>
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(deployUrl)
                      toast.success('URL copied to clipboard')
                    }}
                    variant="ghost"
                    size="sm"
                  >
                    Copy
                  </Button>
                  <Button
                    onClick={() => window.open(deployUrl, '_blank')}
                    variant="ghost"
                    size="sm"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => window.open(deployUrl, '_blank')}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                >
                  Visit Site
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
                <Button onClick={resetDialog} variant="outline" className="flex-1">
                  Close
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Platform selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-700">
                  Choose Platform
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {platforms.map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => setSelectedPlatform(platform.id)}
                      disabled={isDeploying}
                      className={cn(
                        "p-4 rounded-lg border-2 text-left transition-all",
                        selectedPlatform === platform.id
                          ? "border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-md"
                          : "border-slate-200 hover:border-purple-300 hover:bg-slate-50"
                      )}
                    >
                      <div className="text-3xl mb-2">{platform.icon}</div>
                      <h3 className="font-semibold text-slate-900 text-sm">
                        {platform.name}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1">
                        {platform.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Configuration */}
              {selectedPlatform && (
                <div className="space-y-4 animate-in slide-in-from-bottom duration-300">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Site Name
                    </label>
                    <Input
                      value={siteName}
                      onChange={(e) => setSiteName(e.target.value)}
                      placeholder="my-awesome-site"
                      className="font-mono"
                      disabled={isDeploying}
                    />
                    <p className="text-xs text-slate-500">
                      Your site will be available at: {siteName}.{selectedPlatform === 'vercel' ? 'vercel.app' : selectedPlatform === 'netlify' ? 'netlify.app' : 'pages.dev'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">
                        Build Command
                      </label>
                      <Input
                        value={buildCommand}
                        onChange={(e) => setBuildCommand(e.target.value)}
                        placeholder="npm run build"
                        className="font-mono text-sm"
                        disabled={isDeploying}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">
                        Output Directory
                      </label>
                      <Input
                        value={outputDirectory}
                        onChange={(e) => setOutputDirectory(e.target.value)}
                        placeholder="dist"
                        className="font-mono text-sm"
                        disabled={isDeploying}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-900">Deployment Failed</p>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              )}

              {/* Deploy status */}
              {isDeploying && (
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-5 w-5 text-purple-500 animate-spin" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-purple-900">Deploying...</p>
                      <p className="text-xs text-purple-700 mt-0.5">
                        Building and deploying your project
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {deployStatus !== 'success' && (
          <div className="px-6 py-4 border-t bg-slate-50 flex items-center justify-between">
            <Button onClick={resetDialog} variant="ghost" disabled={isDeploying}>
              Cancel
            </Button>
            <Button
              onClick={handleDeploy}
              disabled={!selectedPlatform || !siteName.trim() || isDeploying}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90"
            >
              {isDeploying ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deploying...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Deploy Now
                </>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
