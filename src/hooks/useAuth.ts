'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: number
  name: string
  email: string
  role: string
}

interface Subscription {
  plan: 'free' | 'pro'
  canSearch: boolean
  message: string
  todaySearches: number
  limit: number
  remaining: number
  subscription?: {
    status: string
    planType: string
    validUntil: string
    createdAt: string
    updatedAt: string
  }
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState<string | null>(null)
  const router = useRouter()

  // Verificar token no localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken')
    if (storedToken) {
      setToken(storedToken)
      verifyToken(storedToken)
    } else {
      setLoading(false)
    }
  }, [])

  const verifyToken = useCallback(async (authToken: string) => {
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: authToken }),
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        await checkSubscription(authToken)
      } else {
        localStorage.removeItem('authToken')
        setToken(null)
        setUser(null)
        setSubscription(null)
      }
    } catch (error) {
      console.error('Erro ao verificar token:', error)
      localStorage.removeItem('authToken')
      setToken(null)
      setUser(null)
      setSubscription(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const checkSubscription = useCallback(async (authToken: string) => {
    try {
      const response = await fetch('/api/me/subscription', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setSubscription(data)
      }
    } catch (error) {
      console.error('Erro ao verificar assinatura:', error)
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('authToken', data.token)
        setToken(data.token)
        setUser(data.user)
        await checkSubscription(data.token)
        
        // Redirecionar baseado no role do usuário
        if (data.user.role === 'admin') {
          router.push('/admin')
        } else {
          router.push('/buscador')
        }
        
        return { success: true }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error('Erro no login:', error)
      return { success: false, error: 'Erro interno do servidor' }
    }
  }, [router, checkSubscription])

  const logout = useCallback(async () => {
    try {
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        })
      }
    } catch (error) {
      console.error('Erro no logout:', error)
    } finally {
      localStorage.removeItem('authToken')
      setToken(null)
      setUser(null)
      setSubscription(null)
      router.push('/')
    }
  }, [token, router])

  const authenticatedFetch = useCallback(async (url: string, options: RequestInit = {}) => {
    if (!token) {
      throw new Error('Token não disponível')
    }

    const method = (options.method || 'GET').toString().toUpperCase()
    try {
      console.log('🌐 authenticatedFetch →', method, url)
    } catch {}

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    try {
      console.log('🌐 authenticatedFetch ←', method, url, response.status)
    } catch {}

    return response
  }, [token])

  const createCheckoutSession = useCallback(async () => {
    try {
      const response = await authenticatedFetch('/api/stripe/create-checkout-session', {
        method: 'POST',
      })

      if (response.ok) {
        const data = await response.json()
        return { success: true, url: data.url }
      } else {
        const error = await response.json()
        return { success: false, error: error.error }
      }
    } catch (error) {
      console.error('Erro ao criar sessão de checkout:', error)
      return { success: false, error: 'Erro interno do servidor' }
    }
  }, [authenticatedFetch])

  const logSearch = useCallback(async (searchQuery: string, resultsCount: number = 0) => {
    try {
      const response = await authenticatedFetch('/api/search/log', {
        method: 'POST',
        body: JSON.stringify({ searchQuery, resultsCount }),
      })

      if (response.ok) {
        // Atualizar status da assinatura após registrar busca
        await checkSubscription(token!)
        return { success: true }
      } else {
        const error = await response.json()
        return { success: false, error: error.error }
      }
    } catch (error) {
      console.error('Erro ao registrar busca:', error)
      return { success: false, error: 'Erro interno do servidor' }
    }
  }, [authenticatedFetch, checkSubscription, token])

  const refreshSubscription = useCallback(async () => {
    if (token) {
      await checkSubscription(token)
    }
  }, [token, checkSubscription])

  return {
    user,
    subscription,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    logout,
    authenticatedFetch,
    createCheckoutSession,
    logSearch,
    refreshSubscription,
  }
}
