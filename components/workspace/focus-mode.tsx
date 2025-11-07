'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Maximize2,
  Minimize2,
  Play,
  Pause,
  RotateCcw,
  Music,
  Volume2,
  VolumeX
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface FocusModeProps {
  isFocused: boolean
  onToggle: () => void
}

export function FocusModeToggle({ isFocused, onToggle }: FocusModeProps) {
  return (
    <Button
      onClick={onToggle}
      variant="ghost"
      size="sm"
      title={isFocused ? 'Exit focus mode' : 'Enter focus mode'}
    >
      {isFocused ? (
        <Minimize2 className="h-4 w-4" />
      ) : (
        <Maximize2 className="h-4 w-4" />
      )}
    </Button>
  )
}

// Pomodoro Timer
export function PomodoroTimer() {
  const [minutes, setMinutes] = useState(25)
  const [seconds, setSeconds] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [mode, setMode] = useState<'work' | 'break'>('work')
  const [sessions, setSessions] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Timer finished
            handleTimerComplete()
          } else {
            setMinutes(minutes - 1)
            setSeconds(59)
          }
        } else {
          setSeconds(seconds - 1)
        }
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, minutes, seconds])

  const handleTimerComplete = () => {
    setIsActive(false)

    if (mode === 'work') {
      const newSessions = sessions + 1
      setSessions(newSessions)

      // Play notification sound
      playNotificationSound()

      toast.success('Work session complete! 🎉', {
        description: 'Time for a break'
      })

      // Start break
      if (newSessions % 4 === 0) {
        // Long break every 4 sessions
        setMode('break')
        setMinutes(15)
      } else {
        // Short break
        setMode('break')
        setMinutes(5)
      }
    } else {
      playNotificationSound()
      toast.success('Break complete! 💪', {
        description: 'Ready to focus again?'
      })

      setMode('work')
      setMinutes(25)
    }

    setSeconds(0)
  }

  const playNotificationSound = () => {
    // Create a simple beep using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = 800
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
  }

  const toggle = () => {
    setIsActive(!isActive)
  }

  const reset = () => {
    setIsActive(false)
    setMode('work')
    setMinutes(25)
    setSeconds(0)
  }

  const formatTime = (mins: number, secs: number) => {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progress = ((25 * 60 - (minutes * 60 + seconds)) / (25 * 60)) * 100

  return (
    <div className="p-4 bg-white rounded-lg border shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">Pomodoro Timer</h3>
        <div className="flex items-center gap-2">
          <span className={cn(
            "px-2 py-1 rounded text-xs font-medium",
            mode === 'work'
              ? "bg-purple-100 text-purple-700"
              : "bg-green-100 text-green-700"
          )}>
            {mode === 'work' ? '🎯 Focus' : '☕ Break'}
          </span>
          <span className="text-xs text-slate-500">
            {sessions} sessions
          </span>
        </div>
      </div>

      {/* Timer Display */}
      <div className="relative">
        <div className="text-center py-8">
          <div className="text-5xl font-mono font-bold text-slate-900">
            {formatTime(minutes, seconds)}
          </div>
        </div>

        {/* Progress ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="4"
          />
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="4"
            strokeDasharray={`${2 * Math.PI * 45} ${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2">
        <Button
          onClick={toggle}
          size="sm"
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
        >
          {isActive ? (
            <>
              <Pause className="h-4 w-4 mr-1" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-1" />
              Start
            </>
          )}
        </Button>

        <Button onClick={reset} variant="outline" size="sm">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Quick presets */}
      <div className="flex gap-2">
        <button
          onClick={() => {
            setMinutes(25)
            setSeconds(0)
            setMode('work')
          }}
          className="flex-1 px-3 py-2 text-xs border rounded hover:bg-slate-50 transition-colors"
        >
          25 min
        </button>
        <button
          onClick={() => {
            setMinutes(15)
            setSeconds(0)
            setMode('work')
          }}
          className="flex-1 px-3 py-2 text-xs border rounded hover:bg-slate-50 transition-colors"
        >
          15 min
        </button>
        <button
          onClick={() => {
            setMinutes(5)
            setSeconds(0)
            setMode('break')
          }}
          className="flex-1 px-3 py-2 text-xs border rounded hover:bg-slate-50 transition-colors"
        >
          5 min
        </button>
      </div>
    </div>
  )
}

// Ambient Sound Player
export function AmbientSoundPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(50)
  const [currentSound, setCurrentSound] = useState('lofi')

  const sounds = [
    { id: 'lofi', name: 'Lo-fi Beats', emoji: '🎵' },
    { id: 'rain', name: 'Rain', emoji: '🌧️' },
    { id: 'cafe', name: 'Café', emoji: '☕' },
    { id: 'nature', name: 'Nature', emoji: '🌲' },
    { id: 'white-noise', name: 'White Noise', emoji: '📻' }
  ]

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
    if (!isPlaying) {
      toast.info('Ambient sound playing', {
        description: 'Focus mode activated',
        duration: 2000
      })
    }
  }

  return (
    <div className="p-4 bg-white rounded-lg border shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">Ambient Sounds</h3>
        <Button
          onClick={togglePlay}
          variant="ghost"
          size="sm"
        >
          {isPlaying ? (
            <Volume2 className="h-4 w-4 text-purple-500" />
          ) : (
            <VolumeX className="h-4 w-4 text-slate-400" />
          )}
        </Button>
      </div>

      {/* Sound selection */}
      <div className="grid grid-cols-2 gap-2">
        {sounds.map(sound => (
          <button
            key={sound.id}
            onClick={() => setCurrentSound(sound.id)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all",
              currentSound === sound.id
                ? "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-300"
                : "hover:bg-slate-50"
            )}
          >
            <span className="text-lg">{sound.emoji}</span>
            <span className="text-xs font-medium">{sound.name}</span>
          </button>
        ))}
      </div>

      {/* Volume control */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-700">Volume</label>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(parseInt(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
        />
        <div className="text-xs text-slate-500 text-right">{volume}%</div>
      </div>

      {isPlaying && (
        <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
          <Music className="h-4 w-4 text-purple-500 animate-pulse" />
          <span className="text-sm text-purple-700">
            Now playing: {sounds.find(s => s.id === currentSound)?.name}
          </span>
        </div>
      )}
    </div>
  )
}
