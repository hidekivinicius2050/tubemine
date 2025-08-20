'use client'

import React from 'react'

const About: React.FC = () => {
  return (
    <section 
      id="sobre"
      style={{
        padding: 'var(--spacing-3xl) 0',
        background: 'var(--bg-secondary)'
      }}
    >
      <div className="container">
        <div className="text-center mb-2xl">
          <h2 className="heading-lg mb-md">
            Sobre a <span style={{ color: 'var(--accent-red)' }}>TubeMine</span>
          </h2>
          <p className="text-lg text-secondary">
            Revolucionando a forma como criadores descobrem e analisam conteúdo no YouTube
          </p>
        </div>
        
        <div className="card">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 'var(--spacing-xl)'
          }}>
            <div className="text-center">
              <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>🎯</div>
              <h3 className="heading-sm mb-md">Missão</h3>
              <p className="text-secondary">
                Democratizar o acesso a dados avançados do YouTube para criadores de conteúdo
              </p>
            </div>
            <div className="text-center">
              <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>🚀</div>
              <h3 className="heading-sm mb-md">Visão</h3>
              <p className="text-secondary">
                Ser a plataforma líder em análise e descoberta de conteúdo no YouTube
              </p>
            </div>
            <div className="text-center">
              <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>💎</div>
              <h3 className="heading-sm mb-md">Valores</h3>
              <p className="text-secondary">
                Transparência, inovação e suporte aos criadores de conteúdo
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
