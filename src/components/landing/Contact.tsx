'use client'

import React from 'react'

const Contact: React.FC = () => {
  return (
    <section 
      id="contato"
      style={{
        padding: 'var(--spacing-3xl) 0',
        background: 'var(--bg-primary)'
      }}
    >
      <div className="container">
        <div className="text-center mb-2xl">
          <h2 className="heading-lg mb-md">
            Entre em <span style={{ color: 'var(--accent-red)' }}>Contato</span>
          </h2>
          <p className="text-lg text-secondary">
            Tem alguma dúvida? Estamos aqui para ajudar!
          </p>
        </div>
        
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--spacing-xl)',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>📧</div>
              <h3 className="heading-sm mb-sm">Email</h3>
              <p className="text-secondary">contato@tubemine.com</p>
            </div>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>💬</div>
              <h3 className="heading-sm mb-sm">Suporte</h3>
              <p className="text-secondary">Horário comercial</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
