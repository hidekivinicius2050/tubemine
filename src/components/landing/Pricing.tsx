'use client'

import React from 'react'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

interface PricingProps {
  router: AppRouterInstance
}

const Pricing: React.FC<PricingProps> = ({ router }) => {
  return (
    <section 
      id="planos"
      style={{
        padding: 'var(--spacing-3xl) 0',
        background: 'var(--bg-primary)'
      }}
    >
      <div className="container">
        <div className="text-center mb-2xl">
          <h2 className="heading-lg mb-md">
            Planos <span style={{ color: 'var(--accent-red)' }}>Simples</span>
          </h2>
          <p className="text-lg text-secondary">
            Escolha o plano ideal para suas necessidades
          </p>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--spacing-xl)',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          {/* Free Plan */}
          <div className="card">
            <div className="text-center mb-lg">
              <h3 className="heading-sm mb-md">Plano Gratuito</h3>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--accent-red)', marginBottom: 'var(--spacing-xs)' }}>
                R$ 0
              </div>
              <p className="text-secondary">Para começar</p>
            </div>
            <ul style={{ marginBottom: 'var(--spacing-xl)' }}>
              <li style={{ marginBottom: 'var(--spacing-sm)' }}>✓ 1 busca por dia</li>
              <li style={{ marginBottom: 'var(--spacing-sm)' }}>✓ Filtros básicos</li>
              <li style={{ marginBottom: 'var(--spacing-sm)' }}>✓ Resultados limitados</li>
            </ul>
            <button 
              onClick={() => router.push('/registro')}
              className="btn btn-secondary"
              style={{ width: '100%' }}
            >
              Começar Grátis
            </button>
          </div>

          {/* PRO Plan */}
          <div className="card card-featured">
            <div className="text-center mb-lg">
              <h3 className="heading-sm mb-md">Plano PRO</h3>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--accent-red)', marginBottom: 'var(--spacing-xs)' }}>
                R$ 19,90
              </div>
              <p className="text-secondary">por mês</p>
            </div>
            <ul style={{ marginBottom: 'var(--spacing-xl)' }}>
              <li style={{ marginBottom: 'var(--spacing-sm)' }}>✓ Buscas ilimitadas</li>
              <li style={{ marginBottom: 'var(--spacing-sm)' }}>✓ Todos os filtros avançados</li>
              <li style={{ marginBottom: 'var(--spacing-sm)' }}>✓ Análises detalhadas</li>
              <li style={{ marginBottom: 'var(--spacing-sm)' }}>✓ Exportação de dados</li>
              <li style={{ marginBottom: 'var(--spacing-sm)' }}>✓ Suporte prioritário</li>
            </ul>
            <button 
              onClick={() => router.push('/registro')}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              Começar PRO
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Pricing
