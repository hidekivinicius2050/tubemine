'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import '@/styles/modal.css'

interface SubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'welcome' | 'limit-reached'
}

export default function SubscriptionModal({ isOpen, onClose, type }: SubscriptionModalProps) {
  const { createCheckoutSession, subscription, refreshSubscription } = useAuth()
  const [loading, setLoading] = useState(false)

  // Atualizar dados da subscription quando o modal é aberto
  useEffect(() => {
    if (isOpen && type === 'limit-reached') {
      refreshSubscription()
    }
  }, [isOpen, type, refreshSubscription])

  // Adicionar listener para tecla Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        console.log('🔧 Tecla Escape pressionada, fechando modal...')
        handleClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevenir scroll do body
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleClose = () => {
    console.log('🔧 Tentando fechar modal...')
    onClose()
    // Forçar fechamento após um pequeno delay para garantir
    setTimeout(() => {
      console.log('🔧 Forçando fechamento do modal...')
      onClose()
    }, 50)
  }

  const handleUpgrade = async () => {
    setLoading(true)
    try {
      const result = await createCheckoutSession()
      if (result.success && result.url) {
        window.location.href = result.url
      } else {
        alert('Erro ao criar sessão de pagamento. Tente novamente.')
      }
    } catch (error) {
      console.error('Erro ao fazer upgrade:', error)
      alert('Erro ao processar pagamento. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const getTitle = () => {
    if (type === 'welcome') {
      return 'Bem-vindo ao TubeMine!'
    }
    return 'Limite Atingido!'
  }

  const getMessage = () => {
    if (type === 'welcome') {
      return 'Escolha seu plano e comece a minerar vídeos virais:'
    }
    return 'Você atingiu o limite de buscas gratuitas. Faça upgrade para PRO e continue minerando:'
  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content subscription-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{getTitle()}</h2>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        <div className="modal-body">
          <p className="subscription-intro">{getMessage()}</p>

          <div className="plans-container">
            {/* Plano Grátis */}
            <div className="plan-card free-plan">
              <div className="plan-header">
                <h3>Plano Grátis</h3>
                <div className="plan-price">
                  <span className="price">R$ 0</span>
                  <span className="period">/mês</span>
                </div>
              </div>
              <div className="plan-features">
                <div className="feature">
                  <span className="feature-icon">✓</span>
                  <span>1 busca por dia</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">✓</span>
                  <span>Acesso básico aos filtros</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">✓</span>
                  <span>Resultados limitados</span>
                </div>
              </div>
              <div className="plan-status">
                {subscription?.plan === 'free' ? (
                  <span className="current-plan">Plano Atual</span>
                ) : (
                  <span className="plan-info">Plano Básico</span>
                )}
              </div>
            </div>

            {/* Plano PRO */}
            <div className="plan-card pro-plan">
              <div className="plan-badge">RECOMENDADO</div>
              <div className="plan-header">
                <h3>Plano PRO</h3>
                <div className="plan-price">
                  <span className="price">R$ 19,90</span>
                  <span className="period">/mês</span>
                </div>
              </div>
              <div className="plan-features">
                <div className="feature">
                  <span className="feature-icon">✓</span>
                  <span>Buscas ilimitadas</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">✓</span>
                  <span>Todos os filtros avançados</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">✓</span>
                  <span>Resultados completos</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">✓</span>
                  <span>Suporte prioritário</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">✓</span>
                  <span>Cancelamento a qualquer momento</span>
                </div>
              </div>
              <button 
                className="upgrade-btn"
                onClick={handleUpgrade}
                disabled={loading}
              >
                {loading ? 'Processando...' : 'Assinar PRO'}
              </button>
            </div>
          </div>

          {type === 'limit-reached' && (
            <div className="limit-info">
              <p>
                <strong>Buscas restantes:</strong> {Math.max(0, (subscription?.limit || 1) - (subscription?.todaySearches || 0))} / {subscription?.limit || 1}
              </p>
                              <p>
                  <strong>Status:</strong> {(() => {
                    const remainingSearches = Math.max(0, (subscription?.limit || 1) - (subscription?.todaySearches || 0))
                    return remainingSearches === 0 ? 'Limite diário atingido. Faça upgrade para PRO!' : `Você tem ${remainingSearches} busca(s) restante(s) hoje`
                  })()}
                </p>
            </div>
          )}

          <div className="subscription-footer">
            <p className="security-note">
              🔒 Pagamento seguro via Stripe • Cancelamento a qualquer momento
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
