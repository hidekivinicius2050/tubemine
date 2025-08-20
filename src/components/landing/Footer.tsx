'use client'

import React from 'react'

const Footer: React.FC = () => {
  // Link handlers
  const handlePrivacyPolicy = () => {
    window.open('/privacy-policy', '_blank')
  }

  const handleTermsOfService = () => {
    window.open('/terms-of-service', '_blank')
  }

  const handleSocialLink = (platform: string) => {
    const socialLinks = {
      twitter: 'https://twitter.com/tubemine',
      linkedin: 'https://linkedin.com/company/tubemine',
      youtube: 'https://youtube.com/tubemine',
      instagram: 'https://instagram.com/tubemine'
    }
    
    const url = socialLinks[platform as keyof typeof socialLinks]
    if (url) {
      window.open(url, '_blank')
    }
  }

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer 
      className="footer-section"
      style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-primary)',
        paddingTop: 'var(--spacing-2xl)',
        paddingBottom: 'var(--spacing-xl)'
      }}
    >
      <div className="container">
        {/* Main Footer Content */}
        <div 
          className="footer-content"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 'var(--spacing-2xl)',
            marginBottom: 'var(--spacing-2xl)'
          }}
        >
          {/* Company Info */}
          <div className="footer-brand">
            <div 
              className="brand-section flex items-center gap-md mb-lg"
            >
              {/* Logo */}
              <img 
                src="/logo-tubeminer.png"
                alt="TubeMine Logo"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  objectFit: 'contain'
                }}
              />
              <span 
                className="text-primary heading-sm" 
                style={{ fontWeight: 700 }}
              >
                TubeMine
              </span>
            </div>
            
            <p className="text-md text-secondary mb-lg" style={{ lineHeight: 1.6 }}>
              A ferramenta definitiva para minerar vídeos no YouTube com filtros avançados. 
              Descubra oportunidades ocultas e acelere seu crescimento.
            </p>

            {/* Social Links */}
            <div 
              className="social-links flex items-center gap-sm"
            >
              <button
                className="social-btn"
                onClick={() => handleSocialLink('twitter')}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all var(--transition-normal)',
                  fontSize: '1.2rem'
                }}
              >
                🐦
              </button>
              <button
                className="social-btn"
                onClick={() => handleSocialLink('linkedin')}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all var(--transition-normal)',
                  fontSize: '1.2rem'
                }}
              >
                💼
              </button>
              <button
                className="social-btn"
                onClick={() => handleSocialLink('youtube')}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all var(--transition-normal)',
                  fontSize: '1.2rem'
                }}
              >
                📺
              </button>
              <button
                className="social-btn"
                onClick={() => handleSocialLink('instagram')}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all var(--transition-normal)',
                  fontSize: '1.2rem'
                }}
              >
                📷
              </button>
            </div>
          </div>

          {/* Product Links */}
          <div className="footer-section">
            <h4 
              className="text-primary heading-sm mb-lg"
              style={{ fontWeight: 700 }}
            >
              Produto
            </h4>
            <ul style={{ listStyle: 'none' }}>
              <li style={{ marginBottom: 'var(--spacing-sm)' }}>
                <button 
                  className="footer-link"
                  onClick={() => scrollToSection('funcionalidades')}
                  style={{
                    color: 'var(--text-secondary)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    transition: 'color var(--transition-normal)'
                  }}
                >
                  Funcionalidades
                </button>
              </li>
              <li style={{ marginBottom: 'var(--spacing-sm)' }}>
                <button 
                  className="footer-link"
                  onClick={() => scrollToSection('planos')}
                  style={{
                    color: 'var(--text-secondary)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    transition: 'color var(--transition-normal)'
                  }}
                >
                  Planos
                </button>
              </li>
              <li style={{ marginBottom: 'var(--spacing-sm)' }}>
                <button 
                  className="footer-link"
                  onClick={() => scrollToSection('sobre')}
                  style={{
                    color: 'var(--text-secondary)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    transition: 'color var(--transition-normal)'
                  }}
                >
                  Sobre
                </button>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="footer-section">
            <h4 
              className="text-primary heading-sm mb-lg"
              style={{ fontWeight: 700 }}
            >
              Suporte
            </h4>
            <ul style={{ listStyle: 'none' }}>
              <li style={{ marginBottom: 'var(--spacing-sm)' }}>
                <button 
                  className="footer-link"
                  onClick={() => scrollToSection('contato')}
                  style={{
                    color: 'var(--text-secondary)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    transition: 'color var(--transition-normal)'
                  }}
                >
                  Contato
                </button>
              </li>
              <li style={{ marginBottom: 'var(--spacing-sm)' }}>
                <button 
                  className="footer-link"
                  onClick={handlePrivacyPolicy}
                  style={{
                    color: 'var(--text-secondary)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    transition: 'color var(--transition-normal)'
                  }}
                >
                  Política de Privacidade
                </button>
              </li>
              <li style={{ marginBottom: 'var(--spacing-sm)' }}>
                <button 
                  className="footer-link"
                  onClick={handleTermsOfService}
                  style={{
                    color: 'var(--text-secondary)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    transition: 'color var(--transition-normal)'
                  }}
                >
                  Termos de Uso
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div 
          className="footer-bottom"
          style={{
            borderTop: '1px solid var(--border-primary)',
            paddingTop: 'var(--spacing-lg)',
            textAlign: 'center'
          }}
        >
          <p className="text-sm text-secondary">
            &copy; 2024 TubeMine. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
