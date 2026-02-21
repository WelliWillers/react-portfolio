'use client'

import { useEffect } from 'react'
import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const themeAtom = atomWithStorage<'light' | 'dark'>('theme', 'dark')

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme] = useAtom(themeAtom)

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }, [theme])

  return <>{children}</>
}
