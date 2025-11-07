'use client'

import { Toaster } from 'sonner'

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        classNames: {
          toast: 'bg-white border-slate-200 shadow-lg',
          title: 'text-slate-900',
          description: 'text-slate-600',
          actionButton: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
          cancelButton: 'bg-slate-100 text-slate-600',
          error: 'border-red-200 bg-red-50',
          success: 'border-green-200 bg-green-50',
          warning: 'border-yellow-200 bg-yellow-50',
          info: 'border-blue-200 bg-blue-50',
        },
      }}
      richColors
    />
  )
}
