import { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../api/authApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem('user')
      }
    }

    const hydrateFromServer = async () => {
      try {
        const me = await authApi.getMe()
        const freshUser = me?.data?.user
        if (freshUser) {
          setUser(freshUser)
          localStorage.setItem('user', JSON.stringify(freshUser))
        } else {
          setUser(null)
          localStorage.removeItem('user')
        }
      } catch {
        // Not logged in / session expired
        setUser(null)
        localStorage.removeItem('user')
      } finally {
        setLoading(false)
      }
    }

    hydrateFromServer()
  }, [])

  const login = async (email, password) => {
    const data = await authApi.login({ email, password })
    localStorage.setItem('user', JSON.stringify(data.data.user))
    setUser(data.data.user)
    return data
  }

  const register = async (userData) => {
    const data = await authApi.register(userData)
    localStorage.setItem('user', JSON.stringify(data.data.user))
    setUser(data.data.user)
    return data
  }

  const logout = async () => {
    await authApi.logout()
    setUser(null)
  }

  const updateUser = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider')
  }
  return context
}
