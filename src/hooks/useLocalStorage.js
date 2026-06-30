import { useState, useEffect, useCallback } from 'react'

export function useLocalStorage(key, initialValue) {
  const [stored, setStored] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback((value) => {
    try {
      const v = value instanceof Function ? value(stored) : value
      setStored(v)
      window.localStorage.setItem(key, JSON.stringify(v))
    } catch (e) {
      console.error(e)
    }
  }, [key, stored])

  const remove = useCallback(() => {
    setStored(initialValue)
    window.localStorage.removeItem(key)
  }, [key, initialValue])

  return [stored, setValue, remove]
}
