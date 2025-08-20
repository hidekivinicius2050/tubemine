'use client'

import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, loading, isAuthenticated, isAdmin } = useAuth()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = '/'
    }
  }, [loading, isAuthenticated])

  useEffect(() => {
    if (!loading && isAuthenticated && requireAdmin && !isAdmin) {
      window.location.href = '/buscador'
    }
  }, [loading, isAuthenticated, requireAdmin, isAdmin])

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px'
      }}>
        Carregando...
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (requireAdmin && !isAdmin) {
    return null
  }

  return <>{children}</>
}
