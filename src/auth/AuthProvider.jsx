import { useEffect, useState } from 'react'
import { getProfile } from '../api/user'
import { clearToken, getToken, setToken } from './token'
import { AuthContext } from './AuthContext'

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => getToken())
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const refreshProfile = async () => {
    const currentToken = getToken()
    if (!currentToken) {
      setUser(null)
      return
    }

    try {
      const profile = await getProfile()
      setUser(profile)
    } catch (err) {
      // Helps debug backend auth issues during development.
      console.warn('Failed to load profile:', err?.response?.data || err?.message || err)
      // Token is invalid/expired: clear and let the UI recover.
      clearToken()
      setTokenState(null)
      setUser(null)
    }
  }

  useEffect(() => {
    const run = async () => {
      await refreshProfile()
      setLoading(false)
    }
    run()
  }, [])

  const loginWithToken = async (nextToken) => {
    setToken(nextToken)
    setTokenState(nextToken)
    await refreshProfile()
  }

  const logout = () => {
    clearToken()
    setTokenState(null)
    setUser(null)
  }

  const value = {
    token,
    user,
    loading,
    loginWithToken,
    logout,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

