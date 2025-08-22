'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import Notification from '@/components/Notification'
import '@/styles/login.css'

export default function LoginPage() {
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'error' as 'success' | 'error' | 'warning' | 'info'
  })

  const togglePassword = () => {
    setShowPassword(!showPassword)
  }

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
      await login(email, password)
      showNotification('Login realizado com sucesso! Redirecionando...', 'success')
      // Redirecionar para buscador após um breve delay
      setTimeout(() => {
        window.location.href = '/buscador'
      }, 1500)
    } catch (error: any) {
      showNotification(error.message, 'error')
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
        duration={notification.type === 'success' ? 2000 : 5000}
      />

      {/* COLUNA ESQUERDA - LOGIN */}
      <div className="login-section">
        {/* Logo */}
        <div className="logo">
          <img src="/logo-tubeminer.png" alt="TubeMine" />
          <div className="logo-text">
            <h1>TubeMine</h1>
            <p>Video Analytics Platform</p>
          </div>
        </div>
        
        {/* Card de Login */}
        <div className="login-card">
          <div className="login-header">
            <h2>Login</h2>
            <p>Entre com suas credenciais para acessar a plataforma</p>
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
            
            <div className="form-group">
              <label className="form-label" htmlFor="password">
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                </svg>
                <span>Senha</span>
              </label>
              <div className="password-container">
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="password" 
                  className="form-input" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
                <button 
                  type="button" 
                  className="password-toggle" 
                  onClick={togglePassword}
                >
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    {showPassword ? (
                      <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                    ) : (
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    )}
                  </svg>
                </button>
              </div>
            </div>
            
            <button 
              type="submit" 
              className="login-btn" 
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar na Plataforma'}
            </button>
          </form>
          
          {/* Links */}
          <div className="links">
            <p>
              Não tem uma conta? 
              <a href="/registro">Criar conta</a>
            </p>
            <p>
              Esqueceu a senha? 
              <a href="/forgot-password">Recuperar senha</a>
            </p>
          </div>
        </div>
      </div>

      {/* COLUNA DIREITA - FEATURES */}
      <div className="features-section">
        <div className="features-header">
          <h2>Plataforma Profissional</h2>
          <p>Ferramenta completa para análise e mineração de dados do YouTube</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
              </svg>
            </div>
            <div className="feature-content">
              <h3>Mineração Avançada</h3>
              <p>Análise completa de vídeos do YouTube com IA</p>
            </div>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
              </svg>
            </div>
            <div className="feature-content">
              <h3>Analytics em Tempo Real</h3>
              <p>Dashboards interativos e métricas detalhadas</p>
            </div>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
            </div>
            <div className="feature-content">
              <h3>Big Data</h3>
              <p>Processamento de milhões de vídeos diariamente</p>
            </div>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
              </svg>
            </div>
            <div className="feature-content">
              <h3>Segurança Total</h3>
              <p>Criptografia e proteção de dados corporativos</p>
            </div>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"/>
              </svg>
            </div>
            <div className="feature-content">
              <h3>Insights Inteligentes</h3>
              <p>Identifica tendências e oportunidades</p>
            </div>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <div className="feature-content">
              <h3>Performance</h3>
              <p>Processamento otimizado e resultados rápidos</p>
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
