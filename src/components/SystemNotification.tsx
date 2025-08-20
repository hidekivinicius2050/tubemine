import { useState, useEffect } from 'react'
import '@/styles/system-notification.css'

interface SystemNotificationProps {
  type: 'alert' | 'confirm'
  title: string
  message: string
  isVisible: boolean
  onConfirm?: () => void
  onCancel?: () => void
  onClose?: () => void
}

export default function SystemNotification({
  type,
  title,
  message,
  isVisible,
  onConfirm,
  onCancel,
  onClose
}: SystemNotificationProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true)
    }
  }, [isVisible])

  const handleConfirm = () => {
    setIsAnimating(false)
    setTimeout(() => {
      onConfirm?.()
    }, 200)
  }

  const handleCancel = () => {
    setIsAnimating(false)
    setTimeout(() => {
      onCancel?.()
    }, 200)
  }

  const handleClose = () => {
    setIsAnimating(false)
    setTimeout(() => {
      onClose?.()
    }, 200)
  }

  if (!isVisible && !isAnimating) return null

  const getIcon = () => {
    switch (type) {
      case 'alert':
        return (
          <svg className="notification-icon alert" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      case 'confirm':
        return (
          <svg className="notification-icon confirm" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <div className={`system-notification-overlay ${isAnimating ? 'visible' : ''}`}>
      <div className={`system-notification ${type} ${isAnimating ? 'visible' : ''}`}>
        <div className="notification-header">
          {getIcon()}
          <h3 className="notification-title">{title}</h3>
          <button className="close-button" onClick={handleClose}>
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div className="notification-content">
          <p className="notification-message">{message}</p>
        </div>

        <div className="notification-actions">
          {type === 'confirm' ? (
            <>
              <button className="action-button cancel" onClick={handleCancel}>
                Cancelar
              </button>
              <button className="action-button confirm" onClick={handleConfirm}>
                Confirmar
              </button>
            </>
          ) : (
            <button className="action-button confirm" onClick={handleConfirm}>
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// Funções globais para substituir alert() e confirm()
declare global {
  interface Window {
    showAlert: (title: string, message: string) => Promise<void>
    showConfirm: (title: string, message: string) => Promise<boolean>
  }
}

// Sistema de notificações global
let notificationQueue: Array<{
  id: string
  type: 'alert' | 'confirm'
  title: string
  message: string
  resolve: (value: any) => void
}> = []

let isProcessing = false

export const showAlert = (title: string, message: string): Promise<void> => {
  return new Promise((resolve) => {
    const id = Date.now().toString()
    notificationQueue.push({ id, type: 'alert', title, message, resolve })
    processQueue()
  })
}

export const showConfirm = (title: string, message: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const id = Date.now().toString()
    notificationQueue.push({ id, type: 'confirm', title, message, resolve })
    processQueue()
  })
}

const processQueue = () => {
  if (isProcessing || notificationQueue.length === 0) return
  
  isProcessing = true
  const notification = notificationQueue.shift()!
  
  // Criar elemento DOM para a notificação
  const overlay = document.createElement('div')
  overlay.className = 'system-notification-overlay'
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    opacity: 0;
    transition: opacity 0.3s ease;
  `

  const modal = document.createElement('div')
  modal.className = `system-notification ${notification.type}`
  modal.style.cssText = `
    background: #2c2c2e;
    border-radius: 16px;
    padding: 24px;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    border: 1px solid #3a3a3c;
    transform: scale(0.8);
    transition: transform 0.3s ease;
  `

  const icon = notification.type === 'alert' ? '⚠️' : '❓'
  
  modal.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 24px;">${icon}</span>
        <h3 style="margin: 0; color: #f5f5f7; font-size: 18px; font-weight: 600;">${notification.title}</h3>
      </div>
      <button class="close-btn" style="background: none; border: none; color: #86868b; cursor: pointer; font-size: 20px;">×</button>
    </div>
    <p style="margin: 0 0 24px 0; color: #f5f5f7; line-height: 1.5;">${notification.message}</p>
    <div style="display: flex; gap: 12px; justify-content: flex-end;">
      ${notification.type === 'confirm' ? 
        `<button class="cancel-btn" style="background: #3a3a3c; color: #f5f5f7; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; transition: background 0.2s;">Cancelar</button>` : 
        ''
      }
      <button class="confirm-btn" style="background: #ef4444; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; transition: background 0.2s;">${notification.type === 'confirm' ? 'Confirmar' : 'OK'}</button>
    </div>
  `

  overlay.appendChild(modal)
  document.body.appendChild(overlay)

  // Animar entrada
  setTimeout(() => {
    overlay.style.opacity = '1'
    modal.style.transform = 'scale(1)'
  }, 10)

  // Event listeners
  const closeBtn = modal.querySelector('.close-btn')
  const cancelBtn = modal.querySelector('.cancel-btn')
  const confirmBtn = modal.querySelector('.confirm-btn')

  const closeModal = (result?: any) => {
    overlay.style.opacity = '0'
    modal.style.transform = 'scale(0.8)'
    setTimeout(() => {
      document.body.removeChild(overlay)
      isProcessing = false
      notification.resolve(result)
      processQueue()
    }, 300)
  }

  closeBtn?.addEventListener('click', () => closeModal())
  cancelBtn?.addEventListener('click', () => closeModal(false))
  confirmBtn?.addEventListener('click', () => closeModal(notification.type === 'confirm' ? true : undefined))

  // Fechar com ESC
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeModal()
      document.removeEventListener('keydown', handleKeyDown)
    }
  }
  document.addEventListener('keydown', handleKeyDown)
}

// Expor funções globalmente
if (typeof window !== 'undefined') {
  window.showAlert = showAlert
  window.showConfirm = showConfirm
}
