'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Notification from '@/components/Notification'
import '@/styles/login.css'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'error' as 'success' | 'error' | 'warning' | 'info'
  })

  const showNotification = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    setNotification({ show: true, message, type })
  }

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, show: false }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        showNotification(data.message || 'Se o email estiver cadastrado, você receberá um link de recuperação', 'success')
        setEmail('')
      } else {
        showNotification(data.error || 'Erro ao enviar email de recuperação', 'error')
      }
    } catch (error: any) {
      showNotification('Erro interno do servidor', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container">
      {/* Notification */}
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.show}
        onClose={hideNotification}
        duration={notification.type === 'success' ? 5000 : 5000}
      />

      {/* COLUNA ESQUERDA - RECUPERAÇÃO */}
      <div className="login-section">
        {/* Logo */}
        <div className="logo">
          <img src="/logo-tubeminer.png" alt="TubeMine" />
          <div className="logo-text">
            <h1>TubeMine</h1>
            <p>Video Analytics Platform</p>
          </div>
        </div>
        
        {/* Card de Recuperação */}
        <div className="login-card">
          <div className="login-header">
            <h2>Recuperar Senha</h2>
            <p>Digite seu email para receber um link de recuperação</p>
          </div>
          
          {/* Badges */}
          <div className="badges">
            <div className="badge">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
              </svg>
              <span>Seguro</span>
            </div>
            <div className="badge">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01 1l-4.7 6.28c-.37.5-.58 1.11-.58 1.73V20c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2z"/>
              </svg>
              <span>+10k usuários</span>
            </div>
            <div className="badge">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
              </svg>
              <span>Analytics</span>
            </div>
          </div>
          
          {/* Formulário */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                <span>Email</span>
              </label>
              <input 
                type="email" 
                id="email" 
                className="form-input" 
                placeholder="seu@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            
            <button 
              type="submit" 
              className="login-btn" 
              disabled={isLoading}
            >
              {isLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}
            </button>
          </form>
          
          {/* Links */}
          <div className="links">
            <p>
              <a href="/login">Voltar ao Login</a>
            </p>
            <p>
              Não tem uma conta? 
              <a href="/registro">Criar conta</a>
            </p>
          </div>
        </div>
      </div>

      {/* COLUNA DIREITA - FEATURES */}
      <div className="features-section">
        <div className="features-header">
          <h2>Recuperação Segura</h2>
          <p>Sistema completo de recuperação de senha</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
              </svg>
            </div>
            <div className="feature-content">
              <h3>Segurança Total</h3>
              <p>Tokens únicos e seguros</p>
            </div>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <div className="feature-content">
              <h3>Processo Rápido</h3>
              <p>Recuperação em poucos minutos</p>
            </div>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <div className="feature-content">
              <h3>Fácil de Usar</h3>
              <p>Interface intuitiva e amigável</p>
            </div>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <div className="feature-content">
              <h3>100% Funcional</h3>
              <p>Sistema completo e ativo</p>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="footer">
        <div className="footer-links">
          <a href="#">Termos de Uso</a>
          <a href="#">Política de Privacidade</a>
          <a href="#">Suporte Técnico</a>
          <a href="#">API Docs</a>
        </div>
        <div className="footer-copyright">
          © 2025 TubeMine Platform. Todos os direitos reservados.
        </div>
      </div>
    </div>
  )
}
