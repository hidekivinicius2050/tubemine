'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      color: '#ffffff',
      fontFamily: 'Inter, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Effects */}
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '-30%',
        width: '800px',
        height: '800px',
        background: 'radial-gradient(circle, rgba(255, 68, 68, 0.08) 0%, transparent 60%)',
        borderRadius: '50%',
        filter: 'blur(120px)',
        animation: 'pulse 4s infinite'
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '-30%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(255, 108, 108, 0.06) 0%, transparent 60%)',
        borderRadius: '50%',
        filter: 'blur(100px)',
        animation: 'pulse 5s infinite reverse'
      }} />

      <div style={{
        textAlign: 'center',
        padding: '2rem',
        position: 'relative',
        zIndex: 2,
        maxWidth: '600px'
      }}>
        {/* Logo */}
        <img 
          src="/logo-tubeminer.png" 
          alt="TubeMine" 
          style={{
            width: '80px',
            height: 'auto',
            marginBottom: '2rem',
            animation: 'fadeInUp 0.8s ease-out'
          }}
        />
        
        {/* 404 Number */}
        <h1 style={{
          fontSize: '8rem',
          margin: '0',
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontWeight: 'bold',
          lineHeight: 1,
          animation: 'fadeInUp 0.8s ease-out 0.2s both'
        }}>
          404
        </h1>
        
        {/* Title */}
        <h2 style={{
          fontSize: '2.5rem',
          margin: '1rem 0',
          color: '#ffffff',
          fontWeight: 'bold',
          animation: 'fadeInUp 0.8s ease-out 0.4s both'
        }}>
          Página não encontrada
        </h2>
        
        {/* Description */}
        <p style={{
          fontSize: '1.2rem',
          color: '#a1a1aa',
          marginBottom: '3rem',
          lineHeight: 1.6,
          animation: 'fadeInUp 0.8s ease-out 0.6s both'
        }}>
          A página que você está procurando não existe ou foi movida.
          <br />
          Verifique o URL ou navegue para uma das páginas abaixo.
        </p>
        
        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
          animation: 'fadeInUp 0.8s ease-out 0.8s both'
        }}>
          <Link href="/landing" style={{
            padding: '1rem 2rem',
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '50px',
            fontWeight: 'bold',
            fontSize: '1rem',
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 32px rgba(239, 68, 68, 0.4)',
            display: 'inline-block'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)'
            e.currentTarget.style.boxShadow = '0 16px 48px rgba(239, 68, 68, 0.5)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(239, 68, 68, 0.4)'
          }}>
            🏠 Voltar ao Início
          </Link>
          
          <Link href="/login" style={{
            padding: '1rem 2rem',
            background: 'rgba(255, 255, 255, 0.1)',
            color: '#ffffff',
            textDecoration: 'none',
            borderRadius: '50px',
            fontWeight: 'bold',
            fontSize: '1rem',
            transition: 'all 0.3s ease',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            display: 'inline-block'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
            e.currentTarget.style.transform = 'translateY(0)'
          }}>
            🔐 Fazer Login
          </Link>
        </div>
        
        {/* Help Text */}
        <p style={{
          fontSize: '0.9rem',
          color: '#86868b',
          marginTop: '3rem',
          animation: 'fadeInUp 0.8s ease-out 1s both'
        }}>
          Se você acredita que isso é um erro, entre em contato conosco.
        </p>

        <style jsx>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.05); }
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
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
