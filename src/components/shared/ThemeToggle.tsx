'use client'

import { useAtom } from 'jotai'
import { Sun, Moon } from 'lucide-react'
import { themeAtom } from './ThemeProvider'
import { motion } from 'framer-motion'

export function ThemeToggle() {
  const [theme, setTheme] = useAtom(themeAtom)

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </motion.button>
  )
}
