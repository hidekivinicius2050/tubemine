'use client'

import React from 'react'

const VideoSection: React.FC = () => {
  return (
    <section 
      id="video-demo"
      style={{
        padding: 'var(--spacing-3xl) 0',
        background: 'var(--bg-primary)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Effects */}
      <div 
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at center, rgba(255, 68, 68, 0.1) 0%, transparent 70%)',
          filter: 'blur(100px)',
          pointerEvents: 'none'
        }}
      />
      
      <div className="container">
        <div className="text-center mb-2xl">
          <h2 className="heading-lg mb-md">
            Veja o <span style={{ color: 'var(--accent-red)' }}>TubeMine</span> em Ação
          </h2>
          <p className="text-lg text-secondary">
            Descubra como nossa plataforma revoluciona a busca de vídeos no YouTube
          </p>
        </div>
        
        {/* Video Container */}
        <div 
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            position: 'relative',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 20px 80px rgba(0, 0, 0, 0.5)',
            background: 'var(--bg-secondary)',
            border: '1px solid rgba(255, 68, 68, 0.2)'
          }}
        >
          {/* Placeholder for Video */}
          <div 
            style={{
              width: '100%',
              height: '500px',
              background: 'linear-gradient(135deg, rgba(255, 68, 68, 0.1), rgba(255, 68, 68, 0.05))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 68, 68, 0.15), rgba(255, 68, 68, 0.08))'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 68, 68, 0.1), rgba(255, 68, 68, 0.05))'
            }}
          >
            {/* Play Button */}
            <div 
              style={{
                width: '80px',
                height: '80px',
                background: 'var(--gradient-red)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                color: 'white',
                boxShadow: '0 8px 32px rgba(255, 68, 68, 0.4)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)'
                e.currentTarget.style.boxShadow = '0 12px 48px rgba(255, 68, 68, 0.6)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(255, 68, 68, 0.4)'
              }}
            >
              ▶️
            </div>
            
            {/* Video Overlay Text */}
            <div 
              style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                right: '20px',
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(10px)',
                padding: 'var(--spacing-md)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 68, 68, 0.3)'
              }}
            >
              <p style={{ 
                color: 'white', 
                fontSize: '1.1rem', 
                fontWeight: 600,
                margin: 0 
              }}>
                Clique para assistir a demonstração completa do TubeMine
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default VideoSection
