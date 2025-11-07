'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Mic, MicOff, Radio } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface VoiceInputProps {
  onTranscript: (text: string) => void
  onStart?: () => void
  onEnd?: () => void
}

export function VoiceInput({ onTranscript, onStart, onEnd }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isSupported, setIsSupported] = useState(false)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (SpeechRecognition) {
      setIsSupported(true)
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onstart = () => {
        setIsListening(true)
        onStart?.()
        toast.success('Listening...', {
          description: 'Speak your command',
          duration: 2000
        })
      }

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = ''
        let finalTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' '
          } else {
            interimTranscript += transcript
          }
        }

        setTranscript(interimTranscript || finalTranscript)

        if (finalTranscript) {
          onTranscript(finalTranscript.trim())
        }
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        onEnd?.()

        if (event.error === 'not-allowed') {
          toast.error('Microphone access denied', {
            description: 'Please allow microphone access to use voice input'
          })
        } else {
          toast.error('Voice recognition error', {
            description: event.error
          })
        }
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
        setTranscript('')
        onEnd?.()
      }
    } else {
      setIsSupported(false)
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [onTranscript, onStart, onEnd])

  const toggleListening = () => {
    if (!recognitionRef.current) return

    if (isListening) {
      recognitionRef.current.stop()
      toast.info('Stopped listening')
    } else {
      setTranscript('')
      recognitionRef.current.start()
    }
  }

  if (!isSupported) {
    return (
      <Button
        variant="ghost"
        size="sm"
        disabled
        title="Voice input not supported in this browser"
      >
        <MicOff className="h-4 w-4 text-slate-300" />
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={toggleListening}
        variant="ghost"
        size="sm"
        className={cn(
          "relative",
          isListening && "text-red-500 hover:text-red-600"
        )}
        title={isListening ? 'Stop listening' : 'Start voice input'}
      >
        {isListening ? (
          <>
            <Radio className="h-4 w-4 animate-pulse" />
            {/* Pulsing indicator */}
            <span className="absolute top-1 right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          </>
        ) : (
          <Mic className="h-4 w-4" />
        )}
      </Button>

      {isListening && transcript && (
        <div className="flex-1 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-lg">
          <p className="text-sm text-slate-600 italic">{transcript}</p>
        </div>
      )}
    </div>
  )
}

// Full-screen voice command overlay
export function VoiceCommandOverlay({
  isActive,
  onClose,
  onCommand
}: {
  isActive: boolean
  onClose: () => void
  onCommand: (command: string) => void
}) {
  const [transcript, setTranscript] = useState('')

  const handleTranscript = (text: string) => {
    setTranscript(text)
    // Auto-send command after a pause
    setTimeout(() => {
      if (text) {
        onCommand(text)
        onClose()
      }
    }, 1500)
  }

  if (!isActive) return null

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900/95 to-pink-900/95 backdrop-blur-md z-50 flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/60 hover:text-white text-sm"
      >
        Press ESC to cancel
      </button>

      <div className="text-center space-y-8">
        {/* Animated microphone */}
        <div className="relative mx-auto w-32 h-32">
          <div className="absolute inset-0 bg-white/20 rounded-full animate-ping" />
          <div className="absolute inset-0 bg-white/10 rounded-full animate-pulse" />
          <div className="relative w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl">
            <Mic className="h-16 w-16 text-white" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-white">Listening...</h2>
          <p className="text-white/80">Speak your command</p>
        </div>

        {transcript && (
          <div className="max-w-2xl mx-auto px-6 py-4 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
            <p className="text-xl text-white">{transcript}</p>
          </div>
        )}

        <VoiceInput
          onTranscript={handleTranscript}
          onEnd={onClose}
        />
      </div>
    </div>
  )
}
