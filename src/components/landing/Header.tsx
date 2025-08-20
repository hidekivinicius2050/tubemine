'use client'

import React, { useState, useEffect } from 'react'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

interface HeaderProps {
  router: AppRouterInstance
}

const Header: React.FC<HeaderProps> = ({ router }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('inicio')

  // Handle scroll effect for header background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
      
      // Update active section based on scroll position
      const sections = ['inicio', 'funcionalidades', 'planos', 'sobre', 'contato']
      const currentSection = sections.find(section => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })
      if (currentSection) {
        setActiveSection(currentSection)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMobileMenuOpen(false) // Close mobile menu after click
      setActiveSection(sectionId)
    }
  }

  // Auth button handlers
  const handleLogin = () => {
    router.push('/login')
  }

  const handleRegister = () => {
    router.push('/registro')
  }

  return (
    <header 
      className={`header ${isScrolled ? 'header-scrolled' : ''}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: isScrolled 
          ? 'rgba(10, 10, 10, 0.95)' 
          : 'transparent',
        backdropFilter: isScrolled ? 'blur(10px)' : 'none',
        borderBottom: isScrolled ? '1px solid var(--border-primary)' : 'none',
        transition: 'all var(--transition-normal)',
        padding: 'var(--spacing-md) 0'
      }}
    >
      <div className="container">
        <nav 
          className="flex items-center justify-between"
          style={{ minHeight: '70px' }}
        >
          {/* Logo Section */}
          <div 
            className="logo-section flex items-center gap-md"
            style={{ cursor: 'pointer' }}
            onClick={() => scrollToSection('inicio')}
          >
            {/* Logo */}
            <img 
              src="/logo-tubeminer.png"
              alt="TubeMine Logo"
              style={{
                width: '45px',
                height: '45px',
                borderRadius: '12px',
                objectFit: 'contain'
              }}
            />
            <span 
              className="text-primary heading-sm" 
              style={{ 
                fontWeight: 700,
                fontSize: '1.5rem',
                letterSpacing: '-0.02em'
              }}
            >
              TubeMine
            </span>
          </div>

          {/* Desktop Navigation Menu */}
          <div 
            className="desktop-nav"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-md)',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: '50px',
              padding: 'var(--spacing-xs)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              marginLeft: 'var(--spacing-xl)',
              marginRight: 'var(--spacing-xl)'
            }}
          >
            {[
              { id: 'inicio', label: 'Início', icon: '🏠' },
              { id: 'funcionalidades', label: 'Funcionalidades', icon: '⚡' },
              { id: 'planos', label: 'Planos', icon: '💎' },
              { id: 'sobre', label: 'Sobre', icon: 'ℹ️' },
              { id: 'contato', label: 'Contato', icon: '📞' }
            ].map((item) => (
              <button 
                key={item.id}
                className="nav-btn"
                onClick={() => scrollToSection(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-xs)',
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  borderRadius: '25px',
                  background: activeSection === item.id 
                    ? 'var(--gradient-red)' 
                    : 'transparent',
                  border: 'none',
                  color: activeSection === item.id 
                    ? 'white' 
                    : 'var(--text-secondary)',
                  fontWeight: activeSection === item.id ? 600 : 500,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all var(--transition-normal)',
                  whiteSpace: 'nowrap',
                  boxShadow: activeSection === item.id 
                    ? 'var(--shadow-red)' 
                    : 'none',
                  transform: activeSection === item.id ? 'scale(1.05)' : 'scale(1)'
                }}
                onMouseEnter={(e) => {
                  if (activeSection !== item.id) {
                    e.currentTarget.style.background = 'rgba(255, 68, 68, 0.1)'
                    e.currentTarget.style.color = 'var(--accent-red-light)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSection !== item.id) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = 'var(--text-secondary)'
                  }
                }}
              >
                <span style={{ fontSize: '1rem' }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Auth Buttons */}
          <div 
            className="auth-buttons"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-md)'
            }}
          >
            <button 
              className="btn-ghost btn-sm"
              onClick={handleLogin}
              style={{ 
                color: 'var(--text-secondary)',
                fontWeight: 600,
                padding: 'var(--spacing-sm) var(--spacing-xl)',
                borderRadius: '50px',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                transition: 'all var(--transition-normal)',
                fontSize: '0.95rem',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 68, 68, 0.15) 0%, rgba(255, 68, 68, 0.05) 100%)'
                e.currentTarget.style.color = 'var(--accent-red-light)'
                e.currentTarget.style.borderColor = 'rgba(255, 68, 68, 0.3)'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 68, 68, 0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)'
                e.currentTarget.style.color = 'var(--text-secondary)'
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)'
              }}
            >
              <span style={{ position: 'relative', zIndex: 2 }}>Login</span>
            </button>
            
            <button 
              className="btn-primary btn-sm"
              onClick={handleRegister}
              style={{
                padding: 'var(--spacing-sm) var(--spacing-2xl)',
                borderRadius: '50px',
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ff4444 50%, #ee3333 100%)',
                border: 'none',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'all var(--transition-normal)',
                boxShadow: '0 8px 32px rgba(255, 68, 68, 0.4), 0 4px 16px rgba(255, 68, 68, 0.3)',
                transform: 'scale(1)',
                position: 'relative',
                overflow: 'hidden',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)'
                e.currentTarget.style.boxShadow = '0 16px 48px rgba(255, 68, 68, 0.5), 0 8px 24px rgba(255, 68, 68, 0.4)'
                e.currentTarget.style.background = 'linear-gradient(135deg, #ff7b7b 0%, #ff5555 50%, #ff3333 100%)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)'
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(255, 68, 68, 0.4), 0 4px 16px rgba(255, 68, 68, 0.3)'
                e.currentTarget.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ff4444 50%, #ee3333 100%)'
              }}
            >
              <span style={{ 
                position: 'relative', 
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)'
              }}>
                <span style={{ fontSize: '1.1rem' }}>🚀</span>
                Registrar
              </span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              display: 'none',
              flexDirection: 'column',
              gap: '4px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 'var(--spacing-xs)'
            }}
          >
            <span style={{
              width: '24px',
              height: '2px',
              background: 'var(--text-primary)',
              transition: 'all var(--transition-normal)',
              transform: isMobileMenuOpen ? 'rotate(45deg) translate(6px, 6px)' : 'none'
            }} />
            <span style={{
              width: '24px',
              height: '2px',
              background: 'var(--text-primary)',
              transition: 'all var(--transition-normal)',
              opacity: isMobileMenuOpen ? 0 : 1
            }} />
            <span style={{
              width: '24px',
              height: '2px',
              background: 'var(--text-primary)',
              transition: 'all var(--transition-normal)',
              transform: isMobileMenuOpen ? 'rotate(-45deg) translate(6px, -6px)' : 'none'
            }} />
          </button>
        </nav>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div 
            className="mobile-menu animate-fade-in-up"
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: 'rgba(10, 10, 10, 0.98)',
              backdropFilter: 'blur(20px)',
              border: '1px solid var(--border-primary)',
              borderTop: 'none',
              borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
              padding: 'var(--spacing-lg)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-sm)'
            }}
          >
            {/* Navigation Links */}
            {[
              { id: 'inicio', label: 'Início', icon: '🏠' },
              { id: 'funcionalidades', label: 'Funcionalidades', icon: '⚡' },
              { id: 'planos', label: 'Planos', icon: '💎' },
              { id: 'sobre', label: 'Sobre', icon: 'ℹ️' },
              { id: 'contato', label: 'Contato', icon: '📞' }
            ].map((item) => (
              <button 
                key={item.id}
                className="btn-ghost text-left"
                onClick={() => scrollToSection(item.id)}
                style={{ 
                  justifyContent: 'flex-start',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-sm)',
                  padding: 'var(--spacing-md)',
                  borderRadius: 'var(--radius-md)',
                  background: activeSection === item.id 
                    ? 'rgba(255, 68, 68, 0.1)' 
                    : 'transparent',
                  color: activeSection === item.id 
                    ? 'var(--accent-red)' 
                    : 'var(--text-secondary)',
                  fontWeight: activeSection === item.id ? 600 : 500
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}

            {/* Mobile Auth Buttons */}
            <div 
              style={{ 
                display: 'flex', 
                gap: 'var(--spacing-sm)', 
                marginTop: 'var(--spacing-md)' 
              }}
            >
              <button 
                className="btn-secondary btn-sm"
                onClick={handleLogin}
                style={{ 
                  flex: 1,
                  padding: 'var(--spacing-md)',
                  borderRadius: '50px',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                  transition: 'all var(--transition-normal)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 68, 68, 0.15) 0%, rgba(255, 68, 68, 0.05) 100%)'
                  e.currentTarget.style.color = 'var(--accent-red-light)'
                  e.currentTarget.style.borderColor = 'rgba(255, 68, 68, 0.3)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)'
                  e.currentTarget.style.color = 'var(--text-secondary)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                Login
              </button>
              <button 
                className="btn-primary btn-sm"
                onClick={handleRegister}
                style={{ 
                  flex: 1,
                  padding: 'var(--spacing-md)',
                  borderRadius: '50px',
                  background: 'linear-gradient(135deg, #ff6b6b 0%, #ff4444 50%, #ee3333 100%)',
                  border: 'none',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  boxShadow: '0 8px 32px rgba(255, 68, 68, 0.4)',
                  transition: 'all var(--transition-normal)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--spacing-xs)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(255, 68, 68, 0.5)'
                  e.currentTarget.style.background = 'linear-gradient(135deg, #ff7b7b 0%, #ff5555 50%, #ff3333 100%)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)'
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(255, 68, 68, 0.4)'
                  e.currentTarget.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ff4444 50%, #ee3333 100%)'
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>🚀</span>
                Registrar
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
