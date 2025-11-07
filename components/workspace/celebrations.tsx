'use client'

import { useEffect } from 'react'
import confetti from 'canvas-confetti'

export type CelebrationType =
  | 'first-project'
  | 'first-deploy'
  | 'build-success'
  | 'milestone'
  | 'streak'

interface CelebrationProps {
  type: CelebrationType
  trigger?: boolean
}

export function useCelebration() {
  const celebrate = (type: CelebrationType) => {
    switch (type) {
      case 'first-project':
        fireConfetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        })
        break

      case 'first-deploy':
        // Fireworks!
        const duration = 3 * 1000
        const animationEnd = Date.now() + duration
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

        const randomInRange = (min: number, max: number) => {
          return Math.random() * (max - min) + min
        }

        const interval = setInterval(() => {
          const timeLeft = animationEnd - Date.now()

          if (timeLeft <= 0) {
            return clearInterval(interval)
          }

          const particleCount = 50 * (timeLeft / duration)
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
          })
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
          })
        }, 250)
        break

      case 'build-success':
        fireConfetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 }
        })
        fireConfetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 }
        })
        break

      case 'milestone':
        // Big celebration
        fireConfetti({
          particleCount: 200,
          spread: 120,
          origin: { y: 0.5 }
        })
        setTimeout(() => {
          fireConfetti({
            particleCount: 100,
            angle: 60,
            spread: 100,
            origin: { x: 0, y: 0.6 }
          })
        }, 250)
        setTimeout(() => {
          fireConfetti({
            particleCount: 100,
            angle: 120,
            spread: 100,
            origin: { x: 1, y: 0.6 }
          })
        }, 500)
        break

      case 'streak':
        // Continuous stream
        fireConfetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#8b5cf6', '#ec4899', '#3b82f6']
        })
        fireConfetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#8b5cf6', '#ec4899', '#3b82f6']
        })
        break
    }
  }

  return { celebrate }
}

function fireConfetti(options: confetti.Options) {
  confetti({
    ...options,
    colors: ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b']
  })
}

// Achievement badge component
export function AchievementBadge({
  title,
  description,
  icon,
  isNew = false
}: {
  title: string
  description: string
  icon: string
  isNew?: boolean
}) {
  return (
    <div className="relative p-4 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200">
      {isNew && (
        <div className="absolute -top-2 -right-2 px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full animate-bounce">
          NEW!
        </div>
      )}
      <div className="flex items-start gap-3">
        <div className="text-3xl">{icon}</div>
        <div className="flex-1">
          <h4 className="font-semibold text-slate-900">{title}</h4>
          <p className="text-sm text-slate-600 mt-0.5">{description}</p>
        </div>
      </div>
    </div>
  )
}

// Streak counter
export function StreakCounter({ days }: { days: number }) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-100 to-red-100 border border-orange-300">
      <span className="text-2xl">🔥</span>
      <div>
        <div className="text-sm font-bold text-orange-900">{days} Day Streak!</div>
        <div className="text-xs text-orange-700">Keep it going!</div>
      </div>
    </div>
  )
}

// Milestone reached
export function MilestoneReached({
  milestone,
  onClose
}: {
  milestone: string
  onClose: () => void
}) {
  const { celebrate } = useCelebration()

  useEffect(() => {
    celebrate('milestone')
  }, [])

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl animate-in zoom-in duration-300">
        <div className="text-center space-y-4">
          <div className="text-6xl">🎉</div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            Milestone Reached!
          </h2>
          <p className="text-lg text-slate-700">{milestone}</p>
          <button
            onClick={onClose}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
          >
            Awesome! 🚀
          </button>
        </div>
      </div>
    </div>
  )
}
