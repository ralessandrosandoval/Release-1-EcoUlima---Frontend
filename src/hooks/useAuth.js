import { useCallback, useState } from 'react'
import { clearToken } from '../lib/api'

const STORAGE_KEY = 'ecoulima_user'

export default function useAuth() {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  })

  const saveSession = useCallback((userData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
    setUser(userData)
  }, [])

  const clearSession = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    clearToken()
    setUser(null)
  }, [])

  return { user, saveSession, clearSession }
}
