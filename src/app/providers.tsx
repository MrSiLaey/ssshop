'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import { ReactNode, useEffect } from 'react'
import { useNotificationStore, Notification } from '@/stores'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'

interface ProvidersProps {
  children: ReactNode
}

// Notification Toast Component
function NotificationToast({ notification }: { notification: Notification }) {
  const { removeNotification } = useNotificationStore()

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  }

  const colors = {
    success: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400',
    error: 'bg-red-500/20 border-red-500/50 text-red-400',
    warning: 'bg-amber-500/20 border-amber-500/50 text-amber-400',
    info: 'bg-blue-500/20 border-blue-500/50 text-blue-400',
  }

  const Icon = icons[notification.type]

  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border backdrop-blur-sm ${colors[notification.type]} animate-in slide-in-from-right`}>
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-white">{notification.title}</p>
        {notification.message && (
          <p className="text-sm opacity-80 mt-1">{notification.message}</p>
        )}
      </div>
      <button
        onClick={() => removeNotification(notification.id)}
        className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

function NotificationContainer() {
  const { notifications } = useNotificationStore()

  if (notifications.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full">
      {notifications.map((notification) => (
        <NotificationToast key={notification.id} notification={notification} />
      ))}
    </div>
  )
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ThemeProvider 
        attribute="class" 
        defaultTheme="light" 
        enableSystem={false}
        storageKey="ssshop-theme"
        disableTransitionOnChange
      >
        {children}
        <NotificationContainer />
      </ThemeProvider>
    </SessionProvider>
  )
}
