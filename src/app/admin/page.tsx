'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import ProtectedRoute from '@/components/ProtectedRoute'
import '@/styles/admin.css'

interface User {
  id: number
  name: string
  email: string
  role: string
  created_at: string
  updated_at: string
  subscription?: {
    plan_type: string
    status: string
    valid_until?: string
  }
  search_count?: number
}

interface SearchLog {
  id: number
  user_id: number
  search_query: string
  results_count: number
  created_at: string
  user_name: string
}

interface Stats {
  totalUsers: number
  activeUsers: number
  premiumUsers: number
  totalSearches: number
  todaySearches: number
  monthlyRevenue: number
}

export default function AdminPage() {
  const { user, login, logout, isAuthenticated, isAdmin } = useAuth()
  const [adminData, setAdminData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Dados do painel
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activeUsers: 0,
    premiumUsers: 0,
    totalSearches: 0,
    todaySearches: 0,
    monthlyRevenue: 0
  })
  const [users, setUsers] = useState<User[]>([])
  const [searchLogs, setSearchLogs] = useState<SearchLog[]>([])
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loadingData, setLoadingData] = useState(false)
  const [showNotificationModal, setShowNotificationModal] = useState(false)
  const [notificationData, setNotificationData] = useState({
    title: '',
    message: '',
    adminEmail: ''
  })
  
  // Estados para alterar senha
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      const result = await login(adminData.email, adminData.password)
      
      if (result.success) {
        // O login foi bem-sucedido, o redirecionamento será feito automaticamente
        // baseado no role do usuário no useAuth
      } else {
        setError(result.error || 'Erro no login')
      }
    } catch (error: any) {
      setError(error.message || 'Erro interno')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    setAdminData({ email: '', password: '' })
  }

  // Carregar dados do painel
  const loadDashboardData = async () => {
    if (!isAuthenticated || !isAdmin) return
    
    setLoadingData(true)
    try {
      // Carregar estatísticas
      const statsResponse = await fetch('/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      })
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }

      // Carregar usuários
      const usersResponse = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      })
      if (usersResponse.ok) {
        const usersData = await usersResponse.json()
        setUsers(usersData.users)
      }

      // Carregar logs de busca
      const logsResponse = await fetch('/api/admin/search-logs', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      })
      if (logsResponse.ok) {
        const logsData = await logsResponse.json()
        setSearchLogs(logsData.logs)
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoadingData(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      loadDashboardData()
    }
  }, [isAuthenticated, isAdmin])

  // Formatar data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  // Formatar número
  const formatNumber = (num: number) => {
    return num.toLocaleString('pt-BR')
  }

  // Formatar moeda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount)
  }

  // Ações do usuário
  const handleUserAction = async (userId: number, action: string) => {
    // Confirmação especial para remover plano PRO
    if (action === 'remove-pro') {
      const confirmed = confirm('⚠️ ATENÇÃO!\n\nTem certeza que deseja remover o plano PRO deste usuário?\n\nEsta ação irá:\n• Cancelar a assinatura no Stripe\n• Remover acesso a buscas ilimitadas\n• Rebaixar para plano gratuito\n\nEsta ação não pode ser desfeita facilmente.')
      
      if (!confirmed) {
        return
      }
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}/${action}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        
        // Mostrar mensagem de sucesso
        if (action === 'remove-pro') {
          alert(`✅ ${data.message}`)
        }
        
        loadDashboardData() // Recarregar dados
      } else {
        const errorData = await response.json()
        alert(`❌ Erro: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Erro na ação:', error)
      alert('❌ Erro ao executar ação')
    }
  }

  // Função de notificação desabilitada para economizar créditos
  // const handleSendNotification = async (e: React.FormEvent) => {
  //   e.preventDefault()
  //   
  //   try {
  //     const response = await fetch('/api/admin/notifications', {
  //       method: 'POST',
  //       headers: { 
  //         'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify(notificationData)
  //     })
  //   
  //     const result = await response.json()
  //   
  //     if (response.ok) {
  //       alert('✅ Notificação enviada com sucesso!')
  //       setShowNotificationModal(false)
  //       setNotificationData({ title: '', message: '', adminEmail: '' })
  //     } else {
  //       alert(`❌ Erro: ${result.error}`)
  //     }
  //   } catch (error) {
  //     console.error('Erro ao enviar notificação:', error)
  //     alert('❌ Erro ao enviar notificação')
  //   }
  // }

  // Função para abrir modal de alterar senha
  const openPasswordModal = (user: User) => {
    setSelectedUser(user)
    setNewPassword('')
    setConfirmPassword('')
    setPasswordError('')
    setPasswordSuccess('')
    setShowPasswordModal(true)
  }

  // Função para alterar senha do usuário
  const handleChangePassword = async () => {
    if (!selectedUser) return

    // Validações
    if (!newPassword || newPassword.length < 6) {
      setPasswordError('A senha deve ter pelo menos 6 caracteres')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('As senhas não coincidem')
      return
    }

    setChangingPassword(true)
    setPasswordError('')

    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ newPassword })
      })

      const data = await response.json()

      if (response.ok) {
        setPasswordSuccess('Senha alterada com sucesso! O usuário precisará fazer login novamente.')
        setNewPassword('')
        setConfirmPassword('')
        
        // Fechar modal após 2 segundos
        setTimeout(() => {
          setShowPasswordModal(false)
          setPasswordSuccess('')
        }, 2000)
      } else {
        setPasswordError(data.error || 'Erro ao alterar senha')
      }
    } catch (error) {
      setPasswordError('Erro interno do servidor')
    } finally {
      setChangingPassword(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <div className="login-container">
          <div className="login-header">
            <div className="logo">TM</div>
            <h1>TubeMine Admin</h1>
          </div>
          
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={adminData.email}
                onChange={(e) => setAdminData({...adminData, email: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Senha</label>
              <input
                type="password"
                value={adminData.password}
                onChange={(e) => setAdminData({...adminData, password: e.target.value})}
                required
              />
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="admin-container">
        {/* Header */}
        <div className="header">
          <div className="header-left">
            <div className="logo">TM</div>
            <h1>TubeMine Admin</h1>
          </div>
          <div className="header-right">
            <div className="admin-info">
              <span>Admin</span>
              <span>{user?.email}</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              Sair
            </button>
          </div>
        </div>

                 {/* Navigation */}
         <div className="nav-tabs">
           <button 
             className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
             onClick={() => setActiveTab('dashboard')}
           >
             Dashboard
           </button>
           <button 
             className={`nav-tab ${activeTab === 'users' ? 'active' : ''}`}
             onClick={() => setActiveTab('users')}
           >
             Usuários
           </button>
           <button 
             className={`nav-tab ${activeTab === 'logs' ? 'active' : ''}`}
             onClick={() => setActiveTab('logs')}
           >
             Logs de Busca
           </button>
                     <button 
            className="btn-secondary"
            onClick={() => setShowNotificationModal(true)}
            style={{ marginLeft: 'auto' }}
          >
            📧 Enviar Notificação
          </button>
         </div>

        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="dashboard">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01 1l-4.7 6.28c-.37.5-.58 1.11-.58 1.73V20c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2z"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <h3>Total de Usuários</h3>
                  <p className="stat-number">{formatNumber(stats.totalUsers)}</p>
                  <span className="stat-change positive">+{stats.activeUsers} ativos</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <h3>Usuários Premium</h3>
                  <p className="stat-number">{formatNumber(stats.premiumUsers)}</p>
                  <span className="stat-change positive">{stats.premiumUsers > 0 ? `${Math.round((stats.premiumUsers / stats.totalUsers) * 100)}%` : '0%'} do total</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <h3>Receita Mensal</h3>
                  <p className="stat-number">{formatCurrency(stats.monthlyRevenue)}</p>
                  <span className="stat-change positive">+{stats.premiumUsers * 19.90} este mês</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <h3>Buscas Realizadas</h3>
                  <p className="stat-number">{formatNumber(stats.totalSearches)}</p>
                  <span className="stat-change positive">+{stats.todaySearches} hoje</span>
                </div>
              </div>
            </div>

            {/* Usuários Recentes */}
            <div className="recent-section">
              <div className="section-header">
                <h2>Usuários Recentes</h2>
                <button className="btn-secondary" onClick={() => setActiveTab('users')}>
                  Ver Todos
                </button>
              </div>
              
              <div className="table-container">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Email</th>
                      <th>Plano</th>
                      <th>Status</th>
                      <th>Data de Criação</th>
                      <th>Buscas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.slice(0, 5).map((user) => (
                      <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`badge ${user.subscription?.plan_type === 'pro' && user.subscription?.status === 'active' ? 'premium' : 'free'}`}>
                            {user.subscription?.plan_type === 'pro' && user.subscription?.status === 'active' ? 'Premium' : 'Gratuito'}
                          </span>
                        </td>
                        <td>
                          <span className={`status ${user.subscription?.status === 'active' ? 'active' : 'inactive'}`}>
                            {user.subscription?.status === 'active' ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td>{formatDate(user.created_at)}</td>
                        <td>{user.search_count || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Usuários */}
        {activeTab === 'users' && (
          <div className="users-section">
            <div className="section-header">
              <h2>Gerenciar Usuários</h2>
              <button className="btn-secondary" onClick={loadDashboardData}>
                Atualizar
              </button>
            </div>
            
            <div className="table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Plano</th>
                    <th>Status</th>
                    <th>Data de Criação</th>
                    <th>Buscas</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`badge ${user.subscription?.plan_type === 'pro' && user.subscription?.status === 'active' ? 'premium' : 'free'}`}>
                          {user.subscription?.plan_type === 'pro' && user.subscription?.status === 'active' ? 'Premium' : 'Gratuito'}
                        </span>
                      </td>
                      <td>
                        <span className={`status ${user.subscription?.status === 'active' ? 'active' : 'inactive'}`}>
                          {user.subscription?.status === 'active' ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td>{formatDate(user.created_at)}</td>
                      <td>{user.search_count || 0}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn-small"
                            onClick={() => handleUserAction(user.id, 'upgrade')}
                            disabled={user.subscription?.plan_type === 'pro' && user.subscription?.status === 'active'}
                          >
                            {user.subscription?.plan_type === 'pro' && user.subscription?.status === 'active' ? 'Premium' : 'Upgrade'}
                          </button>
                          {user.subscription?.plan_type === 'pro' && user.subscription?.status === 'active' && (
                            <button 
                              className="btn-small btn-danger"
                              onClick={() => handleUserAction(user.id, 'remove-pro')}
                              title="Remover plano PRO"
                            >
                              ❌ Remover PRO
                            </button>
                          )}
                          <button 
                            className="btn-small btn-warning"
                            onClick={() => openPasswordModal(user)}
                          >
                            🔑 Senha
                          </button>
                          <button 
                            className="btn-small btn-danger"
                            onClick={() => handleUserAction(user.id, 'suspend')}
                          >
                            Suspender
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Logs de Busca */}
        {activeTab === 'logs' && (
          <div className="logs-section">
            <div className="section-header">
              <h2>Logs de Busca</h2>
              <button className="btn-secondary" onClick={loadDashboardData}>
                Atualizar
              </button>
            </div>
            
            <div className="table-container">
              <table className="logs-table">
                <thead>
                  <tr>
                    <th>Usuário</th>
                    <th>Busca</th>
                    <th>Resultados</th>
                    <th>Data/Hora</th>
                  </tr>
                </thead>
                <tbody>
                  {searchLogs.map((log) => (
                    <tr key={log.id}>
                      <td>{log.user_name}</td>
                      <td className="search-query">{log.search_query}</td>
                      <td>{log.results_count}</td>
                      <td>{formatDate(log.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

                 {loadingData && (
           <div className="loading-overlay">
             <div className="loading-spinner">Carregando...</div>
           </div>
         )}

         {/* Modal de Notificação */}
         {showNotificationModal && (
           <div className="modal-overlay">
             <div className="modal-content">
               <div className="modal-header">
                 <h2>📧 Enviar Notificação</h2>
                 <button 
                   className="modal-close"
                   onClick={() => setShowNotificationModal(false)}
                 >
                   ×
                 </button>
               </div>
               
               <form onSubmit={handleSendNotification}>
                 <div className="form-group">
                   <label>E-mail do Destinatário:</label>
                   <input
                     type="email"
                     value={notificationData.adminEmail}
                     onChange={(e) => setNotificationData({
                       ...notificationData,
                       adminEmail: e.target.value
                     })}
                     required
                     placeholder="admin@exemplo.com"
                   />
                 </div>
                 
                 <div className="form-group">
                   <label>Título:</label>
                   <input
                     type="text"
                     value={notificationData.title}
                     onChange={(e) => setNotificationData({
                       ...notificationData,
                       title: e.target.value
                     })}
                     required
                     placeholder="Título da notificação"
                   />
                 </div>
                 
                 <div className="form-group">
                   <label>Mensagem:</label>
                   <textarea
                     value={notificationData.message}
                     onChange={(e) => setNotificationData({
                       ...notificationData,
                       message: e.target.value
                     })}
                     required
                     placeholder="Conteúdo da notificação..."
                     rows={4}
                   />
                 </div>
                 
                 <div className="modal-actions">
                   <button 
                     type="button" 
                     className="btn-secondary"
                     onClick={() => setShowNotificationModal(false)}
                   >
                     Cancelar
                   </button>
                   <button type="submit" className="btn-primary">
                     Enviar Notificação
                   </button>
                 </div>
               </form>
             </div>
           </div>
         )}

         {/* Modal de Alterar Senha */}
         {showPasswordModal && selectedUser && (
           <div className="modal-overlay">
             <div className="modal-content">
               <div className="modal-header">
                 <h3>Alterar Senha do Usuário</h3>
                 <button 
                   className="modal-close"
                   onClick={() => setShowPasswordModal(false)}
                 >
                   ×
                 </button>
               </div>
               
               <div className="modal-body">
                 <div className="user-info">
                   <p><strong>Usuário:</strong> {selectedUser.name}</p>
                   <p><strong>Email:</strong> {selectedUser.email}</p>
                 </div>
                 
                 <div className="form-group">
                   <label>Nova Senha</label>
                   <input
                     type="password"
                     value={newPassword}
                     onChange={(e) => setNewPassword(e.target.value)}
                     placeholder="Digite a nova senha"
                     minLength={6}
                   />
                 </div>
                 
                 <div className="form-group">
                   <label>Confirmar Nova Senha</label>
                   <input
                     type="password"
                     value={confirmPassword}
                     onChange={(e) => setConfirmPassword(e.target.value)}
                     placeholder="Confirme a nova senha"
                     minLength={6}
                   />
                 </div>
                 
                 {passwordError && (
                   <div className="error-message">{passwordError}</div>
                 )}
                 
                 {passwordSuccess && (
                   <div className="success-message">{passwordSuccess}</div>
                 )}
               </div>
               
               <div className="modal-actions">
                 <button 
                   className="btn-secondary"
                   onClick={() => setShowPasswordModal(false)}
                   disabled={changingPassword}
                 >
                   Cancelar
                 </button>
                 <button 
                   className="btn-primary"
                   onClick={handleChangePassword}
                   disabled={changingPassword || !newPassword || !confirmPassword}
                 >
                   {changingPassword ? 'Alterando...' : 'Alterar Senha'}
                 </button>
               </div>
             </div>
           </div>
         )}
       </div>
     </ProtectedRoute>
   )
 }

