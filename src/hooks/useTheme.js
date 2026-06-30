import { useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { LS_KEYS } from '../data/models'

export function useTheme() {
  const [theme, setTheme] = useLocalStorage(LS_KEYS.THEME, 'light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggle = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark')

  return { theme, toggle, isDark: theme === 'dark' }
}
