'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Notification from '@/components/Notification'
import '@/styles/login.css'

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'error' as 'success' | 'error' | 'warning' | 'info'
  })
  const [isValidToken, setIsValidToken] = useState(false)

  const showNotification = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    setNotification({ show: true, message, type })
  }

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, show: false }))
  }

  useEffect(() => {
    if (!token) {
      showNotification('Token de reset não encontrado. Solicite um novo link de reset.', 'error')
      return
    }
    setIsValidToken(true)
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.newPassword !== formData.confirmPassword) {
      showNotification('As senhas não coincidem', 'error')
      return
    }

    if (formData.newPassword.length < 6) {
      showNotification('A senha deve ter pelo menos 6 caracteres', 'error')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token,
          newPassword: formData.newPassword
        })
      })

      const data = await response.json()

      if (response.ok) {
        showNotification('Senha alterada com sucesso! Redirecionando para o login...', 'success')
        setTimeout(() => {
          router.push('/')
        }, 2000)
      } else {
        showNotification(data.error || 'Erro ao redefinir senha', 'error')
      }
    } catch (error) {
      showNotification('Erro interno do servidor', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isValidToken) {
    return (
      <div className="container">
        {/* Notification */}
        <Notification
          message={notification.message}
          type={notification.type}
          isVisible={notification.show}
          onClose={hideNotification}
          duration={notification.type === 'success' ? 3000 : 5000}
        />

        {/* COLUNA ESQUERDA - ERRO */}
        <div className="login-section">
          {/* Logo */}
          <div className="logo">
            <img src="/logo-tubeminer.png" alt="TubeMine" />
            <div className="logo-text">
              <h1>TubeMine</h1>
              <p>Video Analytics Platform</p>
            </div>
          </div>
          
          {/* Card de Erro */}
          <div className="login-card">
            <div className="login-header">
              <h2>Token Inválido</h2>
              <p>O link de recuperação não é válido</p>
            </div>
            
            <div className="error-message" style={{ textAlign: 'center', margin: '20px 0' }}>
              {notification.message}
            </div>
            
            <button 
              className="login-btn" 
              onClick={() => router.push('/')}
              style={{ marginTop: '20px' }}
            >
              Voltar ao Login
            </button>
          </div>
        </div>

        {/* COLUNA DIREITA - FEATURES */}
        <div className="features-section">
          <div className="features-header">
            <h2>Recuperação de Senha</h2>
            <p>Processo seguro para redefinir sua senha</p>
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
                <p>Tokens criptografados e seguros</p>
              </div>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div className="feature-content">
                <h3>Processo Simples</h3>
                <p>Redefina sua senha em poucos passos</p>
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

  return (
    <div className="container">
      {/* COLUNA ESQUERDA - FUNCIONALIDADE DESABILITADA */}
      <div className="login-section">
        {/* Logo */}
        <div className="logo">
          <img src="/logo-tubeminer.png" alt="TubeMine" />
          <div className="logo-text">
            <h1>TubeMine</h1>
            <p>Video Analytics Platform</p>
          </div>
        </div>
        
        {/* Card de Funcionalidade Desabilitada */}
        <div className="login-card">
          <div className="login-header">
            <h2>Funcionalidade Temporariamente Indisponível</h2>
            <p>A recuperação de senha por e-mail está temporariamente desabilitada</p>
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
          
          {/* Mensagem de Indisponibilidade */}
          <div style={{ 
            textAlign: 'center', 
            padding: '30px 20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            margin: '20px 0',
            border: '1px solid #e9ecef'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>🔧</div>
            <h3 style={{ color: '#6c757d', marginBottom: '10px' }}>Em Manutenção</h3>
            <p style={{ color: '#6c757d', lineHeight: '1.6' }}>
              Estamos trabalhando para implementar um novo sistema de recuperação de senha.
              <br />
              <strong>Em breve estará disponível novamente!</strong>
            </p>
          </div>
          
          {/* Links */}
          <div className="links">
            <p>
              <a href="/">Voltar ao Login</a>
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
          <h2>Em Breve</h2>
          <p>Nova funcionalidade de recuperação de senha</p>
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
              <p>Novo sistema de recuperação seguro</p>
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
              <p>Recuperação instantânea de senha</p>
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
              <h3>Disponível em Breve</h3>
              <p>Estamos trabalhando para você</p>
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
