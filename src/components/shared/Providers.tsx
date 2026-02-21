'use client'

import { SessionProvider } from 'next-auth/react'
import { Provider as JotaiProvider } from 'jotai'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './ThemeProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <JotaiProvider>
        <ThemeProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1f2937',
                color: '#f9fafb',
                borderRadius: '12px',
              },
            }}
          />
        </ThemeProvider>
      </JotaiProvider>
    </SessionProvider>
  )
}
