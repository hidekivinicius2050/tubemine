'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()
  const [loadingProgress, setLoadingProgress] = useState(0)

  useEffect(() => {
    // Simular progresso de carregamento
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 100)

    // Redirecionamento após 2 segundos
    const redirectTimer = setTimeout(() => {
      setLoadingProgress(100)
      setTimeout(() => {
        router.replace('/landing')
      }, 200)
    }, 2000)

    return () => {
      clearInterval(progressInterval)
      clearTimeout(redirectTimer)
    }
  }, [router])

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      color: '#ffffff',
      fontFamily: 'Inter, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Effects */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '-20%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(255, 68, 68, 0.1) 0%, transparent 60%)',
        borderRadius: '50%',
        filter: 'blur(100px)',
        animation: 'pulse 3s infinite'
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '-20%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(255, 108, 108, 0.08) 0%, transparent 60%)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        animation: 'pulse 4s infinite reverse'
      }} />

      <div style={{
        textAlign: 'center',
        padding: '2rem',
        position: 'relative',
        zIndex: 2
      }}>
        <img 
          src="/logo-tubeminer.png" 
          alt="TubeMine" 
          style={{
            width: '120px',
            height: 'auto',
            marginBottom: '1.5rem',
            animation: 'fadeInUp 0.8s ease-out'
          }}
        />
        <h1 style={{
          fontSize: '2.5rem',
          marginBottom: '0.5rem',
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontWeight: 'bold',
          animation: 'fadeInUp 0.8s ease-out 0.2s both'
        }}>
          TubeMine
        </h1>
        <p style={{
          fontSize: '1.2rem',
          color: '#a1a1aa',
          marginBottom: '2rem',
          animation: 'fadeInUp 0.8s ease-out 0.4s both'
        }}>
          Carregando plataforma...
        </p>
        
        {/* Progress Bar */}
        <div style={{
          width: '300px',
          height: '4px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '2px',
          margin: '0 auto 1rem',
          overflow: 'hidden',
          animation: 'fadeInUp 0.8s ease-out 0.6s both'
        }}>
          <div style={{
            width: `${loadingProgress}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #ef4444 0%, #ff6b6b 100%)',
            borderRadius: '2px',
            transition: 'width 0.3s ease',
            boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)'
          }} />
        </div>
        
        <p style={{
          fontSize: '0.9rem',
          color: '#86868b',
          animation: 'fadeInUp 0.8s ease-out 0.8s both'
        }}>
          {loadingProgress}% concluído
        </p>

        <style jsx>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.5; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.05); }
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </div>
  )
}

