'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import ChangePasswordModal from './ChangePasswordModal'
import SupportModal from './SupportModal'
import '@/styles/navigation.css'

export default function Navigation() {
  const { user, logout, isAdmin } = useAuth()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
  const [isSupportOpen, setIsSupportOpen] = useState(false)

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  const handleChangePassword = () => {
    setIsChangePasswordOpen(true)
    setIsProfileOpen(false)
  }

  const handleSupport = () => {
    setIsSupportOpen(true)
    setIsProfileOpen(false)
  }

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen)
  }

  return (
    <>
      <nav className="navigation">
        <div className="nav-content">
          <div className="nav-left">
            <div className="nav-logo-container">
              <img 
                src="https://i.postimg.cc/7htj7BtY/logo-tubeminer.png" 
                alt="TubeMine Logo" 
                className="nav-logo"
              />
              <div className="nav-text-container">
                <h2 className="nav-title">TubeMine</h2>
              </div>
            </div>
          </div>
          
          <div className="nav-right">
            {isAdmin && (
              <a href="/admin" className="nav-admin-btn">
                Admin
              </a>
            )}
            
            <div className="profile-container">
              <button 
                className="profile-button" 
                onClick={toggleProfile}
                aria-expanded={isProfileOpen}
              >
                <div className="profile-avatar">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="profile-name">{user?.name}</span>
                <span className="profile-arrow">▼</span>
              </button>
              
              {isProfileOpen && (
                <div className="profile-dropdown">
                  <div className="profile-header">
                    <div className="profile-avatar-large">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="profile-info">
                      <div className="profile-full-name">{user?.name}</div>
                      <div className="profile-email">{user?.email}</div>
                    </div>
                  </div>
                  
                  <div className="profile-menu">
                    <button 
                      className="profile-menu-item"
                      onClick={handleChangePassword}
                    >
                      <span className="menu-icon">🔒</span>
                      Mudar Senha
                    </button>
                    
                    <button 
                      className="profile-menu-item"
                      onClick={handleSupport}
                    >
                      <span className="menu-icon">💬</span>
                      Suporte
                    </button>
                    
                    <div className="profile-divider"></div>
                    
                    <button 
                      className="profile-menu-item logout"
                      onClick={handleLogout}
                    >
                      <span className="menu-icon">🚪</span>
                      Sair
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Overlay para fechar o menu quando clicar fora */}
        {isProfileOpen && (
          <div 
            className="profile-overlay" 
            onClick={() => setIsProfileOpen(false)}
          />
        )}
      </nav>

      {/* Modais */}
      <ChangePasswordModal 
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
      
      <SupportModal 
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
      />
    </>
  )
}
