'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import '@/styles/modal.css'

interface SupportModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SupportModal({ isOpen, onClose }: SupportModalProps) {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('')

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'email':
        window.open('mailto:suporte@tubemine.com?subject=Suporte TubeMine', '_blank')
        break
      case 'whatsapp':
        const whatsappMessage = encodeURIComponent(`Olá! Preciso de suporte com o TubeMine.\n\nUsuário: ${user?.name || 'N/A'}\nEmail: ${user?.email || 'N/A'}`)
        window.open(`https://wa.me/5511999999999?text=${whatsappMessage}`, '_blank')
        break
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content support-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            <span className="modal-icon">💬</span>
            Central de Suporte
          </h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="support-content">
          {message && (
            <div className={`modal-message ${messageType}`}>
              {message}
            </div>
          )}

          <div className="quick-actions">
            <h3>Contato Direto</h3>
            <div className="quick-actions-grid">
              <button
                className="quick-action-btn"
                onClick={() => handleQuickAction('email')}
              >
                <div className="quick-action-title">📧 Email</div>
                <div className="quick-action-desc">Envie um email direto para nossa equipe</div>
              </button>

              <button
                className="quick-action-btn"
                onClick={() => handleQuickAction('whatsapp')}
              >
                <div className="quick-action-title">📱 WhatsApp</div>
                <div className="quick-action-desc">Fale conosco via WhatsApp</div>
              </button>
            </div>
          </div>

          <div className="support-info">
            <h3>Informações de Contato</h3>
            <div className="info-grid">
              <div className="info-item">
                <strong>Email:</strong> suporte@tubemine.com
              </div>
              <div className="info-item">
                <strong>WhatsApp:</strong> (11) 99999-9999
              </div>
              <div className="info-item">
                <strong>Horário:</strong> Segunda a Sexta, 9h às 18h
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
