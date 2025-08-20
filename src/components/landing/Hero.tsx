'use client'

import React from 'react'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

interface HeroProps {
  router: AppRouterInstance
}

const Hero: React.FC<HeroProps> = ({ router }) => {
  // CTA Button Handler
  const handleExperimenteGratis = () => {
    // Scroll to pricing section
    const planosSection = document.getElementById('planos')
    if (planosSection) {
      planosSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section 
      id="inicio"
      className="hero-section"
      style={{
        background: 'radial-gradient(ellipse at center, #1a1a1a 0%, #0a0a0a 70%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Modern Background Effects */}
      <div 
        style={{
          position: 'absolute',
          top: '10%',
          right: '-20%',
          width: '800px',
          height: '800px',
          background: 'radial-gradient(circle, rgba(255, 68, 68, 0.15) 0%, transparent 60%)',
          borderRadius: '50%',
          filter: 'blur(150px)',
          animation: 'pulse 4s infinite'
        }}
      />
      <div 
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '-20%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(255, 108, 108, 0.1) 0%, transparent 60%)',
          borderRadius: '50%',
          filter: 'blur(120px)',
          animation: 'pulse 6s infinite reverse'
        }}
      />
      
      {/* Floating particles effect - Enhanced with more particles */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(2px 2px at 20px 30px, rgba(255, 68, 68, 0.6), transparent),
            radial-gradient(2px 2px at 40px 70px, rgba(255, 108, 108, 0.5), transparent),
            radial-gradient(1px 1px at 90px 40px, rgba(255, 68, 68, 0.7), transparent),
            radial-gradient(1px 1px at 130px 80px, rgba(255, 108, 108, 0.6), transparent),
            radial-gradient(1.5px 1.5px at 160px 120px, rgba(255, 68, 68, 0.5), transparent),
            radial-gradient(1px 1px at 200px 60px, rgba(255, 108, 108, 0.6), transparent),
            radial-gradient(2px 2px at 240px 100px, rgba(255, 68, 68, 0.5), transparent),
            radial-gradient(1.5px 1.5px at 280px 80px, rgba(255, 108, 108, 0.7), transparent),
            radial-gradient(1px 1px at 320px 140px, rgba(255, 68, 68, 0.6), transparent),
            radial-gradient(2px 2px at 360px 40px, rgba(255, 108, 108, 0.5), transparent),
            radial-gradient(1px 1px at 400px 160px, rgba(255, 68, 68, 0.6), transparent),
            radial-gradient(1.5px 1.5px at 440px 200px, rgba(255, 108, 108, 0.5), transparent),
            radial-gradient(2px 2px at 480px 240px, rgba(255, 68, 68, 0.7), transparent),
            radial-gradient(1px 1px at 520px 280px, rgba(255, 108, 108, 0.6), transparent),
            radial-gradient(1.5px 1.5px at 560px 320px, rgba(255, 68, 68, 0.5), transparent),
            radial-gradient(1px 1px at 600px 360px, rgba(255, 108, 108, 0.6), transparent),
            radial-gradient(2px 2px at 640px 400px, rgba(255, 68, 68, 0.5), transparent),
            radial-gradient(1.5px 1.5px at 680px 440px, rgba(255, 108, 108, 0.7), transparent),
            radial-gradient(1px 1px at 720px 480px, rgba(255, 68, 68, 0.6), transparent),
            radial-gradient(2px 2px at 760px 520px, rgba(255, 108, 108, 0.5), transparent)
          `,
          backgroundSize: '800px 800px',
          animation: 'float 25s infinite linear'
        }}
      />
      
      {/* Second layer of particles for more depth - Enhanced */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(1px 1px at 50px 150px, rgba(255, 68, 68, 0.5), transparent),
            radial-gradient(1.5px 1.5px at 100px 200px, rgba(255, 108, 108, 0.6), transparent),
            radial-gradient(1px 1px at 150px 250px, rgba(255, 68, 68, 0.7), transparent),
            radial-gradient(2px 2px at 200px 300px, rgba(255, 108, 108, 0.5), transparent),
            radial-gradient(1px 1px at 250px 350px, rgba(255, 68, 68, 0.6), transparent),
            radial-gradient(1.5px 1.5px at 300px 400px, rgba(255, 108, 108, 0.5), transparent),
            radial-gradient(1px 1px at 350px 450px, rgba(255, 68, 68, 0.7), transparent),
            radial-gradient(2px 2px at 400px 500px, rgba(255, 108, 108, 0.6), transparent),
            radial-gradient(1px 1px at 450px 550px, rgba(255, 68, 68, 0.5), transparent),
            radial-gradient(1.5px 1.5px at 500px 600px, rgba(255, 108, 108, 0.6), transparent),
            radial-gradient(1px 1px at 550px 650px, rgba(255, 68, 68, 0.5), transparent),
            radial-gradient(2px 2px at 600px 700px, rgba(255, 108, 108, 0.7), transparent),
            radial-gradient(1px 1px at 650px 750px, rgba(255, 68, 68, 0.6), transparent),
            radial-gradient(1.5px 1.5px at 700px 800px, rgba(255, 108, 108, 0.5), transparent),
            radial-gradient(1px 1px at 750px 850px, rgba(255, 68, 68, 0.6), transparent)
          `,
          backgroundSize: '800px 800px',
          animation: 'drift 18s infinite linear reverse'
        }}
      />
      
      {/* Third layer for twinkling effect - Enhanced */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(1px 1px at 80px 180px, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 120px 220px, rgba(255, 255, 255, 0.7), transparent),
            radial-gradient(1px 1px at 160px 260px, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(1px 1px at 200px 300px, rgba(255, 255, 255, 0.6), transparent),
            radial-gradient(1px 1px at 240px 340px, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 280px 380px, rgba(255, 255, 255, 0.7), transparent),
            radial-gradient(1px 1px at 320px 420px, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(1px 1px at 360px 460px, rgba(255, 255, 255, 0.6), transparent),
            radial-gradient(1px 1px at 400px 500px, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 440px 540px, rgba(255, 255, 255, 0.7), transparent),
            radial-gradient(1px 1px at 480px 580px, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(1px 1px at 520px 620px, rgba(255, 255, 255, 0.6), transparent),
            radial-gradient(1px 1px at 560px 660px, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 600px 700px, rgba(255, 255, 255, 0.7), transparent),
            radial-gradient(1px 1px at 640px 740px, rgba(255, 255, 255, 0.9), transparent)
          `,
          backgroundSize: '700px 700px',
          animation: 'twinkle 4s infinite ease-in-out'
        }}
      />
      
      {/* Fourth layer - Fast moving particles */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(1px 1px at 30px 90px, rgba(255, 68, 68, 0.8), transparent),
            radial-gradient(1px 1px at 70px 130px, rgba(255, 108, 108, 0.7), transparent),
            radial-gradient(1px 1px at 110px 170px, rgba(255, 68, 68, 0.9), transparent),
            radial-gradient(1px 1px at 150px 210px, rgba(255, 108, 108, 0.6), transparent),
            radial-gradient(1px 1px at 190px 250px, rgba(255, 68, 68, 0.8), transparent),
            radial-gradient(1px 1px at 230px 290px, rgba(255, 108, 108, 0.7), transparent),
            radial-gradient(1px 1px at 270px 330px, rgba(255, 68, 68, 0.9), transparent),
            radial-gradient(1px 1px at 310px 370px, rgba(255, 108, 108, 0.6), transparent),
            radial-gradient(1px 1px at 350px 410px, rgba(255, 68, 68, 0.8), transparent),
            radial-gradient(1px 1px at 390px 450px, rgba(255, 108, 108, 0.7), transparent),
            radial-gradient(1px 1px at 430px 490px, rgba(255, 68, 68, 0.9), transparent),
            radial-gradient(1px 1px at 470px 530px, rgba(255, 108, 108, 0.6), transparent),
            radial-gradient(1px 1px at 510px 570px, rgba(255, 68, 68, 0.8), transparent),
            radial-gradient(1px 1px at 550px 610px, rgba(255, 108, 108, 0.7), transparent),
            radial-gradient(1px 1px at 590px 650px, rgba(255, 68, 68, 0.9), transparent)
          `,
          backgroundSize: '650px 650px',
          animation: 'pulse-float 12s infinite ease-in-out'
        }}
      />
      
      {/* Fifth layer - Ultra fast twinkling stars */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(1px 1px at 60px 120px, rgba(255, 255, 255, 1), transparent),
            radial-gradient(1px 1px at 100px 160px, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(1px 1px at 140px 200px, rgba(255, 255, 255, 1), transparent),
            radial-gradient(1px 1px at 180px 240px, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 220px 280px, rgba(255, 255, 255, 1), transparent),
            radial-gradient(1px 1px at 260px 320px, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(1px 1px at 300px 360px, rgba(255, 255, 255, 1), transparent),
            radial-gradient(1px 1px at 340px 400px, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 380px 440px, rgba(255, 255, 255, 1), transparent),
            radial-gradient(1px 1px at 420px 480px, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(1px 1px at 460px 520px, rgba(255, 255, 255, 1), transparent),
            radial-gradient(1px 1px at 500px 560px, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 540px 600px, rgba(255, 255, 255, 1), transparent),
            radial-gradient(1px 1px at 580px 640px, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(1px 1px at 620px 680px, rgba(255, 255, 255, 1), transparent)
          `,
          backgroundSize: '700px 700px',
          animation: 'twinkle 3s infinite ease-in-out'
        }}
      />

      <div className="container">
        <div 
          className="hero-content text-center animate-fade-in-up"
          style={{
            maxWidth: '800px',
            margin: '0 auto',
            paddingTop: '120px', // Increased from 80px to give more space from top
            paddingBottom: 'var(--spacing-2xl)' // Added bottom padding for better balance
          }}
        >
          {/* Hero Title */}
          <h1 
            className="heading-xl mb-lg"
            style={{
              color: 'var(--accent-red)',
              textShadow: '0 0 30px rgba(255, 68, 68, 0.5)',
              fontWeight: 900,
              marginBottom: 'var(--spacing-xl)' // Increased margin for better spacing
            }}
          >
            Descubra o Poder do{' '}
            <span style={{ 
              color: 'var(--text-primary)',
              textShadow: 'none'
            }}>
              TubeMine
            </span>
          </h1>

          {/* Hero Subtitle */}
          <p 
            className="text-lg text-secondary mb-2xl"
            style={{
              maxWidth: '600px',
              margin: '0 auto var(--spacing-2xl) auto',
              lineHeight: 1.6
            }}
          >
            A ferramenta definitiva para minerar vídeos no YouTube com filtros avançados. 
            Descubra canais, criadores e conteúdos relevantes de forma inteligente e automatizada.
          </p>

          {/* CTA Buttons */}
          <div 
            className="hero-actions flex items-center justify-center gap-md mb-2xl"
            style={{
              flexWrap: 'wrap',
              marginBottom: 'var(--spacing-3xl)' // Increased margin for better separation
            }}
          >
            {/* Primary CTA */}
            <button 
              className="btn-primary btn-lg animate-pulse"
              onClick={handleExperimenteGratis}
              style={{
                minWidth: '200px',
                animation: 'pulse 2s infinite'
              }}
            >
              ✨ Experimente Grátis
            </button>

            {/* Secondary CTA */}
            <button 
              className="btn-secondary btn-lg"
              onClick={() => {
                const funcionalidadesSection = document.getElementById('funcionalidades')
                if (funcionalidadesSection) {
                  funcionalidadesSection.scrollIntoView({ behavior: 'smooth' })
                }
              }}
            >
              🚀 Ver Funcionalidades
            </button>
          </div>

          {/* Hero Feature Highlights */}
          <div 
            className="hero-features"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'var(--spacing-xl)',
              maxWidth: '700px',
              margin: '0 auto',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <div 
              className="hero-feature text-center animate-fade-in"
              style={{ animationDelay: '0.2s' }}
            >
              <div 
                className="feature-icon mb-sm"
                style={{
                  width: '60px',
                  height: '60px',
                  background: 'var(--gradient-red)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--spacing-sm) auto',
                  fontSize: '1.5rem',
                  lineHeight: 1,
                  position: 'relative'
                }}
              >
                <span style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%'
                }}>
                  🎯
                </span>
              </div>
              <h3 className="heading-sm text-primary mb-sm">Filtros Avançados</h3>
              <p className="text-sm text-secondary">
                Busque com precisão usando múltiplos critérios
              </p>
            </div>

            <div 
              className="hero-feature text-center animate-fade-in"
              style={{ animationDelay: '0.4s' }}
            >
              <div 
                className="feature-icon mb-sm"
                style={{
                  width: '60px',
                  height: '60px',
                  background: 'var(--gradient-red)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--spacing-sm) auto',
                  fontSize: '1.5rem',
                  lineHeight: 1,
                  position: 'relative'
                }}
              >
                <span style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%'
                }}>
                  ⚡
                </span>
              </div>
              <h3 className="heading-sm text-primary mb-sm">Resultados Rápidos</h3>
              <p className="text-sm text-secondary">
                Encontre o que procura em segundos
              </p>
            </div>

            <div 
              className="hero-feature text-center animate-fade-in"
              style={{ animationDelay: '0.6s' }}
            >
              <div 
                className="feature-icon mb-sm"
                style={{
                  width: '60px',
                  height: '60px',
                  background: 'var(--gradient-red)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--spacing-sm) auto',
                  fontSize: '1.5rem',
                  lineHeight: 1,
                  position: 'relative'
                }}
              >
                <span style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%',
                  transform: 'translateY(-1px)' // Fine-tune alignment for the magnifying glass
                }}>
                  🔍
                </span>
              </div>
              <h3 className="heading-sm text-primary mb-sm">Busca Inteligente</h3>
              <p className="text-sm text-secondary">
                Algoritmos avançados para resultados precisos
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
