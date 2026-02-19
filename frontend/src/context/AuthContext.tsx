import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Usuario } from '../types'

interface AuthContextType {
  user: Usuario | null
  login: (user: Usuario) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')
    
    if (storedUser && storedToken) {
      const userData = JSON.parse(storedUser)
      setUser({ ...userData, token: storedToken })
    }
  }, [])

  const login = (userData: Usuario) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    if (userData.token) {
      localStorage.setItem('token', userData.token)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
