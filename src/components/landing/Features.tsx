'use client'

import React from 'react'

const Features: React.FC = () => {
  return (
    <section 
      id="funcionalidades"
      style={{
        padding: 'var(--spacing-3xl) 0',
        background: 'var(--bg-secondary)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Effects */}
      <div 
        style={{
          position: 'absolute',
          top: '10%',
          right: '-10%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(255, 68, 68, 0.08) 0%, transparent 60%)',
          borderRadius: '50%',
          filter: 'blur(120px)',
          animation: 'pulse 8s infinite'
        }}
      />
      
      <div className="container">
        <div className="text-center mb-2xl">
          <h2 className="heading-lg mb-md">
            Funcionalidades <span style={{ color: 'var(--accent-red)' }}>Poderosas</span>
          </h2>
          <p className="text-lg text-secondary">
            Tudo que você precisa para dominar o YouTube em uma única plataforma
          </p>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'var(--spacing-xl)',
          position: 'relative',
          zIndex: 2
        }}>
          {[
            { 
              icon: "🔍", 
              title: "Busca Inteligente", 
              description: "Encontre vídeos e canais com precisão cirúrgica usando algoritmos avançados de IA",
              features: ["Filtros por data", "Busca por palavras-chave", "Análise de tendências"]
            },
            { 
              icon: "📊", 
              title: "Análise Detalhada", 
              description: "Estatísticas completas de visualizações, engajamento e crescimento de canais",
              features: ["Métricas em tempo real", "Relatórios personalizados", "Comparação de canais"]
            },
            { 
              icon: "🎯", 
              title: "Filtros Avançados", 
              description: "Filtre por data, idioma, país, duração e muito mais para resultados precisos",
              features: ["Filtros geográficos", "Filtros temporais", "Filtros de conteúdo"]
            }
          ].map((feature, index) => (
            <div 
              key={index} 
              className="card"
              style={{
                transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)'
                e.currentTarget.style.boxShadow = '0 20px 80px rgba(0, 0, 0, 0.6)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)'
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4)'
              }}
            >
              {/* Feature Icon */}
              <div 
                style={{ 
                  fontSize: '3.5rem', 
                  marginBottom: 'var(--spacing-lg)',
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                {feature.icon}
              </div>
              
              {/* Feature Title */}
              <h3 
                className="heading-sm mb-md"
                style={{ 
                  textAlign: 'center',
                  color: 'var(--text-primary)'
                }}
              >
                {feature.title}
              </h3>
              
              {/* Feature Description */}
              <p 
                className="text-secondary mb-lg"
                style={{ 
                  textAlign: 'center',
                  lineHeight: 1.6
                }}
              >
                {feature.description}
              </p>
              
              {/* Feature List */}
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {feature.features.map((item, itemIndex) => (
                  <li 
                    key={itemIndex}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: 'var(--spacing-sm)',
                      color: 'var(--text-secondary)',
                      fontSize: '0.95rem'
                    }}
                  >
                    <span 
                      style={{
                        color: 'var(--accent-red)',
                        marginRight: 'var(--spacing-sm)',
                        fontSize: '1.2rem'
                      }}
                    >
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Call to Action */}
        <div 
          style={{
            textAlign: 'center',
            marginTop: 'var(--spacing-3xl)',
            padding: 'var(--spacing-2xl)',
            background: 'rgba(255, 68, 68, 0.05)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 68, 68, 0.2)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <h3 
            className="heading-md mb-md"
            style={{ color: 'var(--text-primary)' }}
          >
            Pronto para começar?
          </h3>
          <p 
            className="text-lg text-secondary mb-lg"
            style={{ maxWidth: '600px', margin: '0 auto' }}
          >
            Experimente todas essas funcionalidades gratuitamente e descubra o poder do TubeMine
          </p>
          <button 
            className="btn-primary btn-lg"
            onClick={() => {
              const planosSection = document.getElementById('planos')
              if (planosSection) {
                planosSection.scrollIntoView({ behavior: 'smooth' })
              }
            }}
            style={{
              minWidth: '200px',
              animation: 'pulse 2s infinite'
            }}
          >
            🚀 Começar Agora
          </button>
        </div>
      </div>
    </section>
  )
}

export default Features
