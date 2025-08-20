'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import ProtectedRoute from '@/components/ProtectedRoute'
import Navigation from '@/components/Navigation'
import SubscriptionModal from '@/components/SubscriptionModal'
import '@/styles/buscador.css'
import '@/styles/system-notification.css'

// Declarações de tipo para funções globais
declare global {
  interface Window {
    debounce: (func: any, wait: number) => (...args: any[]) => void
    validateForm: () => Promise<boolean>
    resetForm: () => void
    formatDuration: (isoDuration: string) => string
    parseDuration: (isoDuration: string) => number
    fetchData: () => Promise<void>
    renderInline: (data: any[]) => void
    downloadThumbnail: (urlOrId: string) => Promise<void>
    toggleSort: (key: string) => void
    updateSortArrows: () => void
    currentPage: number
    videosPerPage: number
    allVideos: any[]
    currentSortKey: string
    currentSortDirection: 'asc' | 'desc'
    changePage: (page: number) => void
    updatePagination: () => void
         showAlert: (title: string, message: string) => Promise<void>
     showConfirm: (title: string, message: string) => Promise<boolean>
     showHelpModal: () => void
  }
}

export default function BuscadorPage() {
  const { user, subscription, logSearch, refreshSubscription } = useAuth()
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  const [showLimitModal, setShowLimitModal] = useState(false)
  const [hasShownWelcome, setHasShownWelcome] = useState(false)

  useEffect(() => {
    // Forçar tema dark
    document.documentElement.classList.add('dark')
    document.body.style.backgroundColor = '#1d1d1f'
    
    // Verificar se deve mostrar modal de boas-vindas para usuários free
    if (subscription?.plan === 'free') {
      setShowWelcomeModal(true)
      setHasShownWelcome(true)
    }

    // Carregar script do buscador apenas uma vez
    if (!window.fetchData) {
      loadBuscadorScript()
    }
  }, [subscription])

  const loadBuscadorScript = () => {
    console.log('🚀 Carregando script do buscador...')

         // Configurar chaves API automaticamente (sistema de fallback)
     const YOUTUBE_API_KEYS = [
       'AIzaSyBGEnUD6qKYwsBtuvOi6L_9RoeHnQNS6xk',
       'AIzaSyCQdT32hZls0S4CdnDoliiSBhMkDMzTyuE',
       'AIzaSyD8C2voCz1ugaE_G6jwqOvG8LbPLnM6WIg',
       'AIzaSyB8i6CS9XHgSpxDf_Am6BZNvcwOUV3Os44',
       'AIzaSyC9XL3ZjWddOhMdjdAt7sqsqERED_bF_Mw'
     ]
     let currentApiKeyIndex = 0
     const GEMINI_API_KEY = 'AIzaSyCQdT32hZls0S4CdnDoliiSBhMkDMzTyuE'

    // Sistema de notificações global
    let notificationQueue: Array<{
      id: string
      type: 'alert' | 'confirm'
      title: string
      message: string
      resolve: (value: any) => void
    }> = []

    let isProcessing = false

    const showAlert = (title: string, message: string): Promise<void> => {
      return new Promise((resolve) => {
        const id = Date.now().toString()
        notificationQueue.push({ id, type: 'alert', title, message, resolve })
        processQueue()
      })
    }

    const showConfirm = (title: string, message: string): Promise<boolean> => {
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
        backdrop-filter: blur(8px);
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
        background: linear-gradient(135deg, #2c2c2e 0%, #1d1d1f 100%);
        border-radius: 20px;
        padding: 32px;
        max-width: 450px;
        width: 90%;
        box-shadow: 0 25px 80px rgba(0, 0, 0, 0.6);
        border: 1px solid #3a3a3c;
        transform: scale(0.8) translateY(20px);
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        position: relative;
        overflow: hidden;
      `

      const icon = notification.type === 'alert' ? '⚠️' : '❓'
      
      modal.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 24px;">${icon}</span>
            <h3 style="margin: 0; color: #f5f5f7; font-size: 20px; font-weight: 700;">${notification.title}</h3>
          </div>
          <button class="close-btn" style="background: none; border: none; color: #86868b; cursor: pointer; font-size: 20px; padding: 8px; border-radius: 8px; transition: all 0.2s ease;">×</button>
        </div>
        <p style="margin: 0 0 24px 0; color: #f5f5f7; line-height: 1.6; opacity: 0.9; font-size: 16px;">${notification.message}</p>
        <div style="display: flex; gap: 12px; justify-content: flex-end;">
          ${notification.type === 'confirm' ? 
            `<button class="cancel-btn" style="background: linear-gradient(135deg, #3a3a3c 0%, #2c2c2e 100%); color: #f5f5f7; border: 1px solid #4a4a4c; padding: 12px 24px; border-radius: 12px; cursor: pointer; transition: all 0.2s ease; font-size: 14px; font-weight: 600; min-width: 100px;">Cancelar</button>` : 
            ''
          }
          <button class="confirm-btn" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; border: 1px solid #ef4444; padding: 12px 24px; border-radius: 12px; cursor: pointer; transition: all 0.2s ease; font-size: 14px; font-weight: 600; min-width: 100px;">${notification.type === 'confirm' ? 'Confirmar' : 'OK'}</button>
        </div>
      `

      overlay.appendChild(modal)
      document.body.appendChild(overlay)

      // Animar entrada
      setTimeout(() => {
        overlay.style.opacity = '1'
        modal.style.transform = 'scale(1) translateY(0)'
      }, 10)

      // Event listeners
      const closeBtn = modal.querySelector('.close-btn')
      const cancelBtn = modal.querySelector('.cancel-btn')
      const confirmBtn = modal.querySelector('.confirm-btn')

             const closeModal = (result?: any) => {
         overlay.style.opacity = '0'
         modal.style.transform = 'scale(0.8) translateY(20px)'
         setTimeout(() => {
           // Verificar se o elemento ainda existe antes de remover
           if (document.body.contains(overlay)) {
             document.body.removeChild(overlay)
           }
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

         // Funções de loading
     const showLoading = (message = 'Buscando Vídeos...') => {
       const loadingOverlay = document.createElement('div')
       loadingOverlay.id = 'loadingOverlay'
       loadingOverlay.style.cssText = `
         position: fixed;
         top: 0;
         left: 0;
         width: 100%;
         height: 100%;
         background: rgba(0, 0, 0, 0.8);
         backdrop-filter: blur(8px);
         display: flex;
         align-items: center;
         justify-content: center;
         z-index: 10000;
         opacity: 0;
         transition: opacity 0.3s ease;
       `
       
       const loadingSpinner = document.createElement('div')
       loadingSpinner.style.cssText = `
         background: linear-gradient(135deg, #2c2c2e 0%, #1d1d1f 100%);
         border-radius: 20px;
         padding: 40px;
         box-shadow: 0 25px 80px rgba(0, 0, 0, 0.6);
         border: 1px solid #3a3a3c;
         text-align: center;
         transform: scale(0.8);
         transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
       `
       
       loadingSpinner.innerHTML = `
         <div style="margin-bottom: 20px;">
           <div style="
             width: 60px;
             height: 60px;
             border: 4px solid #3a3a3c;
             border-top: 4px solid #ef4444;
             border-radius: 50%;
             animation: spin 1s linear infinite;
             margin: 0 auto;
           "></div>
         </div>
         <h3 style="margin: 0 0 12px 0; color: #f5f5f7; font-size: 18px; font-weight: 700;">${message}</h3>
         <p style="margin: 0; color: #86868b; font-size: 14px; line-height: 1.5;">Estamos procurando pelos melhores vídeos para você</p>
         <style>
           @keyframes spin {
             0% { transform: rotate(0deg); }
             100% { transform: rotate(360deg); }
           }
         </style>
       `
       
       loadingOverlay.appendChild(loadingSpinner)
       document.body.appendChild(loadingOverlay)
       
       // Animar entrada
       setTimeout(() => {
         loadingOverlay.style.opacity = '1'
         loadingSpinner.style.transform = 'scale(1)'
       }, 10)
     }
     
     const hideLoading = () => {
       const loadingOverlay = document.getElementById('loadingOverlay')
       if (loadingOverlay) {
         loadingOverlay.style.opacity = '0'
         const spinner = loadingOverlay.querySelector('div')
         if (spinner) {
           spinner.style.transform = 'scale(0.8)'
         }
         
         setTimeout(() => {
           if (document.body.contains(loadingOverlay)) {
             document.body.removeChild(loadingOverlay)
           }
         }, 300)
       }
     }
     
     const updateLoadingMessage = (message: string) => {
       const loadingOverlay = document.getElementById('loadingOverlay')
       if (loadingOverlay) {
         const title = loadingOverlay.querySelector('h3')
         if (title) {
           title.textContent = message
         }
       }
     }
     
     window.showHelpModal = function() {
       const helpContent = `
         <div style="max-height: 400px; overflow-y: auto; padding-right: 10px;">
           <h3 style="color: #f5f5f7; margin-bottom: 16px;">🔧 Guia de Solução de Problemas</h3>
           
           <div style="margin-bottom: 20px;">
             <h4 style="color: #ef4444; margin-bottom: 8px;">❌ API não habilitada</h4>
             <p style="color: #86868b; font-size: 14px; line-height: 1.5;">
               Acesse: <a href="https://console.cloud.google.com/apis/library/youtube.googleapis.com" target="_blank" style="color: #3b82f6;">Google Cloud Console</a><br>
               Habilite a "YouTube Data API v3"
             </p>
           </div>
           
           <div style="margin-bottom: 20px;">
             <h4 style="color: #ef4444; margin-bottom: 8px;">❌ Limite atingido</h4>
             <p style="color: #86868b; font-size: 14px; line-height: 1.5;">
               Aguarde 24h ou use uma chave diferente<br>
               Limite gratuito: 10.000 requisições/dia
             </p>
           </div>
           
           <div style="margin-bottom: 20px;">
             <h4 style="color: #ef4444; margin-bottom: 8px;">❌ Acesso negado</h4>
             <p style="color: #86868b; font-size: 14px; line-height: 1.5;">
               Verifique se a chave está correta<br>
               Crie uma nova chave se necessário
             </p>
           </div>
           
           <div style="margin-bottom: 20px;">
             <h4 style="color: #ef4444; margin-bottom: 8px;">❌ Parâmetros inválidos</h4>
             <p style="color: #86868b; font-size: 14px; line-height: 1.5;">
               Limpe os filtros e tente novamente<br>
               Verifique datas e números
             </p>
           </div>
           
           <div style="background: rgba(59, 130, 246, 0.1); padding: 12px; border-radius: 8px; border-left: 4px solid #3b82f6;">
             <p style="color: #3b82f6; font-size: 14px; margin: 0; font-weight: 600;">
               💡 Dica: Sempre teste com uma busca simples antes de usar filtros complexos!
             </p>
           </div>
         </div>
       `
       
       const overlay = document.createElement('div')
       overlay.style.cssText = `
         position: fixed;
         top: 0;
         left: 0;
         width: 100%;
         height: 100%;
         background: rgba(0, 0, 0, 0.8);
         backdrop-filter: blur(8px);
         display: flex;
         align-items: center;
         justify-content: center;
         z-index: 10000;
         opacity: 0;
         transition: opacity 0.3s ease;
       `
       
       const modal = document.createElement('div')
       modal.style.cssText = `
         background: linear-gradient(135deg, #2c2c2e 0%, #1d1d1f 100%);
         border-radius: 20px;
         padding: 32px;
         max-width: 500px;
         width: 90%;
         box-shadow: 0 25px 80px rgba(0, 0, 0, 0.6);
         border: 1px solid #3a3a3c;
         transform: scale(0.8) translateY(20px);
         transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
         position: relative;
       `
       
       modal.innerHTML = `
         <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
           <h2 style="margin: 0; color: #f5f5f7; font-size: 24px; font-weight: 700;">🔧 Ajuda</h2>
           <button class="close-btn" style="background: none; border: none; color: #86868b; cursor: pointer; font-size: 24px; padding: 8px; border-radius: 8px; transition: all 0.2s ease;">×</button>
         </div>
         ${helpContent}
         <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px;">
           <button class="close-btn" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; border: 1px solid #ef4444; padding: 12px 24px; border-radius: 12px; cursor: pointer; transition: all 0.2s ease; font-size: 14px; font-weight: 600;">Fechar</button>
         </div>
       `
       
       overlay.appendChild(modal)
       document.body.appendChild(overlay)
       
       // Animar entrada
       setTimeout(() => {
         overlay.style.opacity = '1'
         modal.style.transform = 'scale(1) translateY(0)'
       }, 10)
       
       // Event listeners
       const closeBtn = modal.querySelector('.close-btn')
       const closeModal = () => {
         overlay.style.opacity = '0'
         modal.style.transform = 'scale(0.8) translateY(20px)'
         setTimeout(() => {
           if (document.body.contains(overlay)) {
             document.body.removeChild(overlay)
           }
         }, 300)
       }
       
       closeBtn?.addEventListener('click', closeModal)
       
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
     window.showAlert = showAlert
     window.showConfirm = showConfirm

    // Inicializar variáveis apenas se não existirem
    if (typeof window.currentPage === 'undefined') {
      window.currentPage = 1
    }
    if (typeof window.videosPerPage === 'undefined') {
      window.videosPerPage = 20 // Limite fixo de 20 vídeos por página
    }
    if (typeof window.allVideos === 'undefined') {
      window.allVideos = []
    }

    // Função debounce
    window.debounce = function(this: any, func: any, wait: number) {
      let timeout: NodeJS.Timeout
      return function executedFunction(...args: any[]) {
        const later = () => {
          clearTimeout(timeout)
          func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
      }
    }

         // Função de validação
     window.validateForm = async function() {
       try {
         console.log('🔍 Validando formulário...')
         const apiKey = (document.getElementById('youtubeApiKey') as HTMLInputElement)?.value || ''
         const keywords = (document.getElementById('keywords') as HTMLInputElement)?.value || ''
         
         if (!apiKey.trim()) {
           await window.showAlert('Chave da API Obrigatória', 'Por favor, insira sua chave da API do YouTube. Você pode obter uma chave gratuita no Google Cloud Console.')
           return false
         }
         
         if (!keywords.trim()) {
           await window.showAlert('Campo Obrigatório', 'Por favor, insira palavras-chave para a busca.')
           return false
         }
         
         const confirmed = await window.showConfirm('Confirmar Busca', `Deseja buscar por: "${keywords}" usando sua chave da API?`)
         if (!confirmed) return false
         
         console.log('✅ Validação aprovada')
         return true
       } catch (error) {
         console.error('❌ Erro na validação:', error)
         return false
       }
     }

    // Função de reset
    window.resetForm = async function() {
      try {
        const confirmed = await window.showConfirm('Limpar Formulário', 'Deseja limpar todos os campos e resultados?')
        if (!confirmed) return
        
                 const form = document.getElementById('filterForm') as HTMLFormElement
         if (form) form.reset()
         
         // Resetar paginação
         window.currentPage = 1
        
        const tbody = document.querySelector('#resultsTable tbody')
        if (tbody) {
          tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px; color: #86868b;">Digite palavras-chave e clique em "Buscar" para começar</td></tr>'
        }
        
        const errorMsg = document.getElementById('errorMsg')
        if (errorMsg) errorMsg.style.display = 'none'
        
        // Resetar paginação
        window.currentPage = 1
        window.allVideos = []
        const paginationContainer = document.getElementById('pagination')
        if (paginationContainer) paginationContainer.innerHTML = ''
        
        console.log('🔄 Formulário resetado')
        await window.showAlert('Sucesso', '✅ Formulário limpo com sucesso!')
      } catch (error) {
        console.error('❌ Erro ao resetar formulário:', error)
        await window.showAlert('Erro', '❌ Erro ao limpar formulário. Tente novamente.')
      }
    }

    // Função de formatação de duração
    window.formatDuration = function(isoDuration: string) {
      try {
        console.log('🕐 Formatando duração:', isoDuration)
        
        if (!isoDuration || isoDuration === 'PT0S') {
          return '0:00'
        }
        
        const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
        if (!match) {
          console.log('❌ Formato de duração não reconhecido:', isoDuration)
          return '0:00'
        }
        
        const hours = parseInt(match[1]) || 0
        const minutes = parseInt(match[2]) || 0
        const seconds = parseInt(match[3]) || 0
        
        let result = ''
        if (hours > 0) {
          result += hours + ':' + minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0')
        } else {
          result += minutes + ':' + seconds.toString().padStart(2, '0')
        }
        
        console.log('✅ Duração formatada:', result)
        return result
      } catch (error) {
        console.error('❌ Erro ao formatar duração:', error)
        return '0:00'
      }
    }

                   // Função principal de busca
      window.fetchData = async function() {
        try {
          console.log('🔍 Iniciando busca de vídeos...')
          console.log('🔍 Função fetchData chamada com sucesso!')
          
          // Mostrar loading
          showLoading('Iniciando busca...')
         
         // Resetar variáveis para nova busca
         window.allVideos = []
         window.currentPage = 1
         window.videosPerPage = 20 // Garantir que videosPerPage está definido para nova busca
         
         if (!(await window.validateForm())) {
           console.log('❌ Validação falhou')
           return
         }

         // Verificar se pode fazer busca — consultar status atual no servidor
         try {
           const token = localStorage.getItem('authToken')
           if (!token) {
             console.log('❌ Sem token de autenticação, bloqueando busca')
             await window.showAlert('Sessão expirada', 'Faça login novamente para continuar.')
             hideLoading()
             return
           }

           const subResp = await fetch('/api/me/subscription', {
             method: 'GET',
             headers: { 'Authorization': `Bearer ${token}` }
           })
           if (!subResp.ok) {
             await window.showAlert('Erro', 'Não foi possível verificar sua assinatura. Tente novamente.')
             hideLoading()
             return
           }
           const subData = await subResp.json()

           if (!subData.canSearch) {
             setShowLimitModal(true)
             hideLoading()
             return
           }
         } catch (e) {
           console.error('❌ Erro ao verificar assinatura no servidor:', e)
           await window.showAlert('Erro', 'Erro ao verificar assinatura. Tente novamente.')
           hideLoading()
           return
         }

                   const apiKey = (document.getElementById('youtubeApiKey') as HTMLInputElement)?.value || ''
          const keywords = (document.getElementById('keywords') as HTMLInputElement)?.value || ''
          const language = (document.getElementById('language') as HTMLSelectElement)?.value || ''
          const country = (document.getElementById('country') as HTMLSelectElement)?.value || ''
          const dateFrom = (document.getElementById('dateFrom') as HTMLInputElement)?.value || ''
          const dateTo = (document.getElementById('dateTo') as HTMLInputElement)?.value || ''
                    const minViews = (document.getElementById('minViews') as HTMLInputElement)?.value || ''
           const minLikes = (document.getElementById('minLikes') as HTMLInputElement)?.value || ''
           const minSubscribers = (document.getElementById('minSubscribers') as HTMLInputElement)?.value || ''
           const maxSubscribers = (document.getElementById('maxSubscribers') as HTMLInputElement)?.value || ''

           // Validar se a chave da API foi fornecida
           if (!apiKey.trim()) {
             await window.showAlert('Chave da API Obrigatória', 'Por favor, insira sua chave da API do YouTube.')
             return
           }



         // Buscar múltiplas páginas para obter o máximo de resultados possível
         let allVideos: any[] = []
         let nextPageToken = null
         let currentPage = 0
         const maxPages = 10 // Buscar até 10 páginas (500 vídeos máximo)

                   updateLoadingMessage('Buscando vídeos na API do YouTube...')

                                       do {
             currentPage++

             try {
               const params = new URLSearchParams({
                 part: 'snippet',
                 q: keywords,
                 type: 'video',
                 maxResults: '50', // Máximo permitido pela API
                 key: apiKey,
                 order: 'relevance',
                 videoDuration: 'any'
               })

               // Adicionar token da próxima página se existir
               if (nextPageToken) {
                 params.append('pageToken', nextPageToken)
               }

               // Adicionar parâmetros opcionais apenas se foram fornecidos
               if (language) {
                 params.append('relevanceLanguage', language)
               }
               
               if (country) {
                 params.append('regionCode', country)
               }

               // Adicionar datas apenas se foram fornecidas e com formato correto
               if (dateFrom) {
                 const fromDate = new Date(dateFrom + 'T00:00:00Z')
                 params.append('publishedAfter', fromDate.toISOString())
               }
               
               if (dateTo) {
                 const toDate = new Date(dateTo + 'T23:59:59Z')
                 params.append('publishedBefore', toDate.toISOString())
               }


               
               const response = await fetch(`https://www.googleapis.com/youtube/v3/search?${params}`)
               const data = await response.json()



                               if (data.error) {
                  console.error('❌ Erro na busca:', data.error)
                  
                  // Tratamento específico de erros da API do YouTube
                  if (data.error.code === 403) {
                    if (data.error.message.includes('has not been used') || data.error.message.includes('disabled')) {
                      throw new Error('API do YouTube não está habilitada. Acesse o Google Cloud Console e habilite a YouTube Data API v3.')
                    } else if (data.error.message.includes('quota')) {
                      throw new Error('Limite de requisições da API atingido. Tente novamente mais tarde ou use uma chave diferente.')
                    } else {
                      throw new Error('Acesso negado à API. Verifique se sua chave da API está correta e tem as permissões necessárias.')
                    }
                  } else if (data.error.code === 400) {
                    throw new Error('Parâmetros inválidos na requisição. Verifique os filtros aplicados.')
                  } else {
                    throw new Error(data.error.message || 'Erro na busca')
                  }
                }

               if (!data.items || data.items.length === 0) {
  
                 break
               }


               allVideos = allVideos.concat(data.items)
               nextPageToken = data.nextPageToken

               // Aguardar um pouco entre as requisições para não sobrecarregar a API
               if (nextPageToken && currentPage < maxPages) {
                 await new Promise(resolve => setTimeout(resolve, 200))
               }

                          } catch (error) {
               console.error('❌ Erro na requisição:', error)
               throw new Error('Erro ao buscar vídeos. Verifique sua chave da API e tente novamente.')
             }

           } while (nextPageToken && currentPage < maxPages)

                     updateLoadingMessage(`Encontrados ${allVideos.length} vídeos. Buscando estatísticas...`)

         if (allVideos.length === 0) {
           window.renderInline([])
           return
         }

                  updateLoadingMessage('Buscando estatísticas dos vídeos...')

                   // Buscar estatísticas detalhadas em lotes (API tem limite de 50 IDs por requisição)
          const videoIds = allVideos.map((item: any) => item.id.videoId)
          const statsData: any[] = []
          
                     // Função para fazer requisição com a chave do usuário
                       const makeApiRequest = async (url: string, description: string) => {
              try {
                const response = await fetch(url.replace(/key=[^&]+/, `key=${apiKey}`))
                const data = await response.json()
                
                if (data.error) {
                  // Tratamento específico de erros da API do YouTube
                  if (data.error.code === 403) {
                    if (data.error.message.includes('has not been used') || data.error.message.includes('disabled')) {
                      throw new Error('API do YouTube não está habilitada. Acesse o Google Cloud Console e habilite a YouTube Data API v3.')
                    } else if (data.error.message.includes('quota')) {
                      throw new Error('Limite de requisições da API atingido. Tente novamente mais tarde ou use uma chave diferente.')
                    } else {
                      throw new Error('Acesso negado à API. Verifique se sua chave da API está correta e tem as permissões necessárias.')
                    }
                  } else if (data.error.code === 400) {
                    throw new Error('Parâmetros inválidos na requisição. Verifique os filtros aplicados.')
                  } else {
                    throw new Error(data.error.message || `Erro em ${description}`)
                  }
                }
                
                return data
              } catch (error) {
                console.error(`❌ Erro em ${description}:`, error)
                throw error // Re-throw para manter a mensagem original
              }
            }
          
          // Dividir em lotes de 50
          for (let i = 0; i < videoIds.length; i += 50) {
            const batch = videoIds.slice(i, i + 50)
            console.log(`📊 Buscando estatísticas do lote ${Math.floor(i/50) + 1} (${batch.length} vídeos)...`)
            
            try {
              const batchStats = await makeApiRequest(
                `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails,snippet&id=${batch.join(',')}&key=${apiKey}`,
                `estatísticas do lote ${Math.floor(i/50) + 1}`
              )
              
              if (batchStats.items) {
                statsData.push(...batchStats.items)
              }
            } catch (error) {
              console.error(`❌ Erro ao buscar estatísticas do lote ${Math.floor(i/50) + 1}:`, error)
              // Continuar com os próximos lotes mesmo se um falhar
            }
            
            // Aguardar entre as requisições
            if (i + 50 < videoIds.length) {
              await new Promise(resolve => setTimeout(resolve, 100))
            }
          }
         
         console.log(`📊 Total de estatísticas obtidas: ${statsData.length}`)

                   // Buscar dados de canais em lotes
          console.log('📺 Buscando dados de canais...')
          updateLoadingMessage('Buscando dados dos canais...')
          const channelPromises = allVideos.map(async (item: any) => {
            try {
              // Buscar dados do canal
              const channelData = await makeApiRequest(
                `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${item.snippet.channelId}&key=${apiKey}`,
                `dados do canal ${item.snippet.channelId}`
              )
              
              return {
                videoId: item.id.videoId,
                channelCreatedAt: channelData.items?.[0]?.snippet?.publishedAt || null,
                subscriberCount: channelData.items?.[0]?.statistics?.subscriberCount || '0'
              }
            } catch (error) {
              console.log(`⚠️ Erro ao buscar dados do canal para ${item.id.videoId}:`, error)
              return {
                videoId: item.id.videoId,
                channelCreatedAt: null
              }
            }
          })

         const channelResults = await Promise.all(channelPromises)
         console.log('📺 Dados de canais obtidos:', channelResults)

         // Combinar dados
         const videos = allVideos.map((item: any) => {
           const stats = statsData.find((stat: any) => stat.id === item.id.videoId)
           const channelData = channelResults.find((channel: any) => channel.videoId === item.id.videoId)
           
           // Log para debug
           console.log('📊 Dados do vídeo:', {
             id: item.id.videoId,
             title: item.snippet.title,
             duration: stats?.contentDetails?.duration || 'PT0S',
             publishedAt: item.snippet.publishedAt,
             viewCount: stats?.statistics?.viewCount || '0',
             likeCount: stats?.statistics?.likeCount || '0',
             commentCount: stats?.statistics?.commentCount || '0',
             channelCreatedAt: channelData?.channelCreatedAt || null
           })
           
           return {
             id: item.id.videoId,
             title: item.snippet.title,
             description: item.snippet.description,
             thumbnail: item.snippet.thumbnails.high.url,
             channelTitle: item.snippet.channelTitle,
             channelId: item.snippet.channelId,
             publishedAt: item.snippet.publishedAt,
             viewCount: stats?.statistics?.viewCount || '0',
             likeCount: stats?.statistics?.likeCount || '0',
             commentCount: stats?.statistics?.commentCount || '0',
             channelCreatedAt: channelData?.channelCreatedAt || null,
             subscriberCount: channelData?.subscriberCount || '0',
             duration: stats?.contentDetails?.duration || 'PT0S',
             tags: stats?.snippet?.tags || []
           }
         })

        // Aplicar filtros
        let filteredVideos = videos
        if (minViews) {
          filteredVideos = filteredVideos.filter((video: any) => 
            parseInt(video.viewCount) >= parseInt(minViews)
          )
        }
        if (minLikes) {
          filteredVideos = filteredVideos.filter((video: any) => 
            parseInt(video.likeCount) >= parseInt(minLikes)
          )
        }
        if (minSubscribers) {
          filteredVideos = filteredVideos.filter((video: any) => 
            parseInt(video.subscriberCount) >= parseInt(minSubscribers)
          )
        }
        if (maxSubscribers) {
          filteredVideos = filteredVideos.filter((video: any) => 
            parseInt(video.subscriberCount) <= parseInt(maxSubscribers)
          )
        }

                 console.log(`🎯 Vídeos após filtros: ${filteredVideos.length}`)
         updateLoadingMessage(`Processando ${filteredVideos.length} vídeos...`)

        // Registrar busca no sistema
        if (user) {
          try {
            console.log('📝 Registrando busca no sistema...')
            console.log('📝 Dados da busca:', { keywords, resultsCount: filteredVideos.length, userId: user.id })
            
            // Verificar se logSearch está definido
            if (typeof logSearch === 'function') {
              console.log('✅ logSearch é uma função válida')
              const logResult = await logSearch(keywords, filteredVideos.length)
              console.log('📝 Resultado do log:', logResult)
            } else {
              console.error('❌ logSearch não é uma função:', typeof logSearch)
            }
            
            // Atualizar status da assinatura após registrar busca
            console.log('🔄 Atualizando status da assinatura...')
            await refreshSubscription()
            console.log('✅ Busca registrada e assinatura atualizada')
          } catch (error) {
            console.error('❌ Erro ao registrar busca:', error)
          }
        } else {
          console.log('⚠️ Usuário não autenticado ou não carregado. Tentando registrar via token diretamente...')
          try {
            const token = localStorage.getItem('authToken')
            if (token) {
              const resp = await fetch('/api/search/log', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ searchQuery: keywords, resultsCount: filteredVideos.length })
              })
              console.log('🌐 POST /api/search/log (fallback) →', resp.status)
              if (resp.ok) {
                console.log('✅ Busca registrada via fallback')
              } else {
                const err = await resp.json().catch(() => ({}))
                console.log('❌ Falha no log via fallback:', resp.status, err)
              }
            } else {
              console.log('❌ Sem token no localStorage, não é possível registrar via fallback')
            }
          } catch (e) {
            console.error('❌ Erro no fallback de log:', e)
          }
        }

                 window.allVideos = filteredVideos
         window.currentPage = 1
         console.log('📊 Vídeos carregados:', {
           totalVideos: filteredVideos.length,
           allVideosLength: window.allVideos.length
         })
         window.renderInline(filteredVideos)
        
        // Resetar ordenação
        window.currentSortKey = ''
        window.currentSortDirection = 'desc'
        window.updateSortArrows()

             } catch (error) {
         console.error('❌ Erro na busca:', error)
         
         const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar vídeos. Tente novamente.'
         let finalMessage = errorMessage
         
         // Adicionar link para o Google Cloud Console se for erro de API não habilitada
         if (errorMessage.includes('API do YouTube não está habilitada')) {
           finalMessage += '\n\n🔗 Clique aqui para acessar o Google Cloud Console:\nhttps://console.cloud.google.com/apis/library/youtube.googleapis.com'
         }
         
         await window.showAlert('Erro na Busca', finalMessage)
       } finally {
         // Esconder loading
         hideLoading()
       }
     }

         // Função de renderização
     window.renderInline = function(data: any[]) {
       try {
         console.log('🎨 Renderizando resultados...')
         const tbody = document.querySelector('#resultsTable tbody')
         if (!tbody) {
           console.error('❌ Tbody não encontrado')
           return
         }

         // Calcular vídeos para a página atual
         const startIndex = (window.currentPage - 1) * window.videosPerPage
         const endIndex = startIndex + window.videosPerPage
         const pageVideos = data.slice(startIndex, endIndex)

         console.log('📄 Dados da página:', {
           totalVideos: data.length,
           currentPage: window.currentPage,
           videosPerPage: window.videosPerPage,
           startIndex,
           endIndex,
           pageVideosCount: pageVideos.length
         })

         if (pageVideos.length === 0) {
           tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px; color: #86868b;">Nenhum vídeo encontrado</td></tr>'
           window.updatePagination()
           return
         }

                 const html = pageVideos.map((video: any) => `
           <tr>
             <td class="thumbnail-cell" style="width: 280px; vertical-align: top; padding: 16px;">
               <div class="thumbnail-container" onclick="window.downloadThumbnail('${video.thumbnail}')" style="position: relative; cursor: pointer;">
                 <img src="${video.thumbnail}" alt="${video.title}" style="width: 100%; height: auto; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);" />
                 <div class="download-overlay" style="position: absolute; top: 12px; right: 12px; background: rgba(0,0,0,0.8); border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease;">
                   <span class="download-icon" style="color: white; font-size: 16px;">⬇️</span>
                 </div>
               </div>
             </td>
             <td class="info-cell" style="vertical-align: top; padding: 16px;">
               <div style="margin-bottom: 20px;">
                 <h3 style="margin: 0 0 12px 0; color: #f5f5f7; font-size: 20px; font-weight: 700; line-height: 1.3;">${video.title}</h3>
                 <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                   <a href="https://www.youtube.com/watch?v=${video.id}" target="_blank" class="link-btn" style="color: #3b82f6; text-decoration: none; font-weight: 600; font-size: 15px; padding: 6px 12px; border-radius: 6px; background: rgba(59, 130, 246, 0.1); transition: all 0.2s ease;" onclick="return window.showConfirm('Abrir Vídeo', 'Deseja abrir este vídeo no YouTube?').then(result => result)">Abrir</a>
                   <span style="color: #86868b; font-size: 14px;">|</span>
                   <span style="color: #86868b; font-size: 15px; font-weight: 500;">Canal: ${video.channelTitle}</span>
                 </div>
               </div>
               
               <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 15px;">
                 <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #2a2a2c;">
                   <span style="color: #86868b; font-weight: 500;">Duração:</span>
                   <span style="color: #f5f5f7; font-weight: 600;">${window.formatDuration(video.duration)}</span>
                 </div>
                 <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #2a2a2c;">
                   <span style="color: #86868b; font-weight: 500;">Publicado:</span>
                   <span style="color: #f5f5f7; font-weight: 600;">${new Date(video.publishedAt).toLocaleDateString('pt-BR')}</span>
                 </div>
                 <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #2a2a2c;">
                   <span style="color: #86868b; font-weight: 500;">Views:</span>
                   <span style="color: #f5f5f7; font-weight: 600;">${parseInt(video.viewCount).toLocaleString('pt-BR')}</span>
                 </div>
                 <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #2a2a2c;">
                   <span style="color: #86868b; font-weight: 500;">Likes:</span>
                   <span style="color: #f5f5f7; font-weight: 600;">${parseInt(video.likeCount).toLocaleString('pt-BR')}</span>
                 </div>
                 <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #2a2a2c;">
                   <span style="color: #86868b; font-weight: 500;">Comentários:</span>
                   <span style="color: #f5f5f7; font-weight: 600;">${parseInt(video.commentCount || 0).toLocaleString('pt-BR')}</span>
                 </div>
                 <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #2a2a2c;">
                   <span style="color: #86868b; font-weight: 500;">Inscritos:</span>
                   <span style="color: #f5f5f7; font-weight: 600;">${parseInt(video.subscriberCount || 0).toLocaleString('pt-BR')}</span>
                 </div>
                 <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #2a2a2c;">
                   <span style="color: #86868b; font-weight: 500;">Canal Criado:</span>
                   <span style="color: #f5f5f7; font-weight: 600;">${video.channelCreatedAt ? new Date(video.channelCreatedAt).toLocaleDateString('pt-BR') : '-'}</span>
                 </div>
               </div>
             </td>
           </tr>
         `).join('')

        tbody.innerHTML = html
        window.updatePagination()
        console.log('✅ Resultados renderizados')

      } catch (error) {
        console.error('❌ Erro ao renderizar resultados:', error)
      }
    }

    // Função de download de thumbnail
    window.downloadThumbnail = async function(urlOrId: string) {
      try {
        const confirmed = await window.showConfirm('Download Thumbnail', 'Deseja baixar esta thumbnail?')
        if (!confirmed) return
        
        console.log('⬇️ Baixando thumbnail:', urlOrId)
        
        const link = document.createElement('a')
        link.href = urlOrId
        link.download = `thumbnail_${Date.now()}.jpg`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        // Mostrar notificação de sucesso
        setTimeout(async () => {
          await window.showAlert('Download Concluído', '✅ Thumbnail baixada com sucesso!')
        }, 500)
        
      } catch (error) {
        console.error('❌ Erro ao baixar thumbnail:', error)
        await window.showAlert('Erro no Download', '❌ Erro ao baixar thumbnail. Tente novamente.')
      }
    }

    // Variáveis para controlar ordenação
    window.currentSortKey = ''
    window.currentSortDirection = 'desc' // 'asc' ou 'desc'

    // Função de ordenação
    window.toggleSort = function(key: string) {
      try {
        console.log(`🔄 Ordenando por: ${key}`)
        console.log('📊 Estado atual:', {
          allVideosLength: window.allVideos?.length || 0,
          currentSortKey: window.currentSortKey,
          currentSortDirection: window.currentSortDirection
        })
        
                 // Verificar se há vídeos na tabela atual
         const tbody = document.querySelector('#resultsTable tbody')
         const videoRows = tbody?.querySelectorAll('tr')
         
         console.log('🔍 Verificando vídeos na tela:', {
           tbodyExists: !!tbody,
           videoRowsLength: videoRows?.length || 0,
           hasColspan: videoRows?.length === 1 && videoRows[0]?.querySelector('td[colspan]')
         })
         
         // Verificar se há vídeos válidos (não apenas mensagem de "Digite palavras-chave...")
         const hasValidVideos = videoRows && videoRows.length > 0 && 
           !(videoRows.length === 1 && videoRows[0].querySelector('td[colspan]')) &&
           !videoRows[0]?.textContent?.includes('Digite palavras-chave')
         
         if (!hasValidVideos) {
           window.showAlert('Nenhum Vídeo', 'Nenhum vídeo para ordenar. Faça uma busca primeiro.')
           return
         }
        
                 // Se não temos allVideos mas temos vídeos na tela, vamos recriar o array
         if (!window.allVideos || window.allVideos.length === 0) {
           console.log('⚠️ allVideos vazio, recriando a partir dos dados da tela...')
           // Tentar recriar o array a partir dos dados visíveis
           const visibleVideos = Array.from(videoRows).map(row => {
             const cells = row.querySelectorAll('td')
             if (cells.length < 2) return null // Novo layout tem apenas 2 células
             
             // Extrair título da célula de informações
             const infoCell = cells[1]
             const title = infoCell.querySelector('h3')?.textContent || ''
             
             // Extrair nome do canal
             const canalSpan = infoCell.querySelector('span:last-child')
             const channelTitle = canalSpan?.textContent?.replace('Canal: ', '') || ''
             
             // Extrair dados das estatísticas do grid
             const statsGrid = infoCell?.querySelector('div[style*="grid"]')
             const statItems = statsGrid?.querySelectorAll('div[style*="justify-content: space-between"]')
             
             let viewCount = '0'
             let likeCount = '0'
             let commentCount = '0'
             let duration = '0:00'
             let publishedDate = ''
             let channelCreatedAt = null
             
             if (statItems) {
               statItems.forEach((item) => {
                 const spans = item.querySelectorAll('span')
                 if (spans.length >= 2) {
                   const label = spans[0]?.textContent?.trim()
                   const value = spans[1]?.textContent?.trim()
                   
                   if (label === 'Views:') viewCount = value?.replace(/\./g, '') || '0'
                   else if (label === 'Likes:') likeCount = value?.replace(/\./g, '') || '0'
                   else if (label === 'Comentários:') commentCount = value?.replace(/\./g, '') || '0'
                   else if (label === 'Duração:') duration = value || '0:00'
                   else if (label === 'Publicado:') publishedDate = value || ''
                   else if (label === 'Canal Criado:') channelCreatedAt = value !== '-' ? value : null
                 }
               })
             }
             
             // Tentar recuperar a thumbnail da imagem
             const thumbnailImg = cells[0]?.querySelector('img')
             const thumbnail = thumbnailImg?.getAttribute('src') || ''
             
             return {
               id: '', // Não temos o ID, mas não é necessário para ordenação
               title,
               channelTitle,
               channelId: '',
               viewCount,
               likeCount,
               commentCount,
               duration,
               publishedAt: publishedDate,
               channelCreatedAt,
               thumbnail: thumbnail
             }
           }).filter(video => video !== null)
           
           if (visibleVideos.length > 0) {
             window.allVideos = visibleVideos
             console.log(`✅ Recriados ${visibleVideos.length} vídeos para ordenação`)
           } else {
             window.showAlert('Nenhum Vídeo', 'Nenhum vídeo para ordenar. Faça uma busca primeiro.')
             return
           }
         }
        
        // Se clicou no mesmo filtro, alternar direção
        if (window.currentSortKey === key) {
          window.currentSortDirection = window.currentSortDirection === 'asc' ? 'desc' : 'asc'
        } else {
          window.currentSortKey = key
          window.currentSortDirection = 'desc'
        }
        
        // NÃO desmarcar checkboxes - manter todos marcados por padrão
        // Apenas atualizar a setinha para mostrar a direção da ordenação
        
        // Atualizar setinhas
        window.updateSortArrows()
        
        let sortedVideos = [...window.allVideos]
        const direction = window.currentSortDirection === 'asc' ? 1 : -1
        
        switch (key) {
          case 'views':
            sortedVideos.sort((a, b) => (parseInt(b.viewCount) - parseInt(a.viewCount)) * direction)
            break
          case 'likes':
            sortedVideos.sort((a, b) => (parseInt(b.likeCount) - parseInt(a.likeCount)) * direction)
            break
          case 'date':
            sortedVideos.sort((a, b) => (new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()) * direction)
            break
          case 'duration':
            sortedVideos.sort((a, b) => {
              const durationA = window.parseDuration(a.duration)
              const durationB = window.parseDuration(b.duration)
              return (durationA - durationB) * direction
            })
            break
          case 'upload':
            sortedVideos.sort((a, b) => (new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()) * direction)
            break
                     case 'comments':
             sortedVideos.sort((a, b) => (parseInt(b.commentCount || 0) - parseInt(a.commentCount || 0)) * direction)
             break
                     case 'subscribers':
             sortedVideos.sort((a, b) => (parseInt(b.subscriberCount || 0) - parseInt(a.subscriberCount || 0)) * direction)
             break
                     case 'channel':
             sortedVideos.sort((a, b) => {
               // Ordenar por data de criação do canal
               const dateA = a.channelCreatedAt ? new Date(a.channelCreatedAt).getTime() : 0
               const dateB = b.channelCreatedAt ? new Date(b.channelCreatedAt).getTime() : 0
               return (dateB - dateA) * direction
             })
             break
          default:
            console.log('❌ Tipo de ordenação não reconhecido:', key)
            return
        }
        
        window.allVideos = sortedVideos
        window.currentPage = 1
        window.renderInline(sortedVideos)
        
        console.log(`✅ Vídeos ordenados por: ${key} (${window.currentSortDirection})`)
      } catch (error) {
        console.error('❌ Erro ao ordenar:', error)
        window.showAlert('Erro na Ordenação', 'Erro ao ordenar vídeos. Tente novamente.')
      }
    }

    // Função para atualizar setinhas
    window.updateSortArrows = function() {
      const arrows = document.querySelectorAll('.sort-arrows')
      arrows.forEach((arrow, index) => {
        const keys = ['duration', 'upload', 'views', 'likes', 'comments', 'subscribers', 'channel']
        const key = keys[index]
        
        if (window.currentSortKey === key) {
          arrow.textContent = window.currentSortDirection === 'asc' ? '↑' : '↓'
        } else {
          arrow.textContent = '↕'
        }
      })
    }
    
    // Função para converter duração ISO para segundos
    window.parseDuration = function(isoDuration: string) {
      try {
        const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
        if (!match) return 0
        
        const hours = parseInt((match[1] || '').replace('H', '')) || 0
        const minutes = parseInt((match[2] || '').replace('M', '')) || 0
        const seconds = parseInt((match[3] || '').replace('S', '')) || 0
        
        return hours * 3600 + minutes * 60 + seconds
      } catch (error) {
        console.error('❌ Erro ao parsear duração:', error)
        return 0
      }
    }

                   // Funções de paginação
             window.changePage = function(page: number) {
         try {
           console.log(`🔄 Mudando para página ${page}...`)
           console.log('📊 Estado atual:', {
             allVideosExists: !!window.allVideos,
             allVideosLength: window.allVideos?.length || 0,
             currentPage: window.currentPage,
             videosPerPage: window.videosPerPage
           })
           
           // Validar se temos vídeos
           if (!window.allVideos || window.allVideos.length === 0) {
             console.log('❌ Nenhum vídeo para paginar')
             console.log('🔍 Tentando recriar allVideos da tela...')
             
             // Tentar recriar allVideos da tela atual
             const tbody = document.querySelector('#resultsTable tbody')
             const videoRows = tbody?.querySelectorAll('tr')
             
             if (videoRows && videoRows.length > 0) {
               const visibleVideos = Array.from(videoRows).map(row => {
                 const cells = row.querySelectorAll('td')
                 if (cells.length < 2) return null
                 
                 const infoCell = cells[1]
                 const title = infoCell.querySelector('h3')?.textContent || ''
                 const thumbnailImg = cells[0]?.querySelector('img')
                 const thumbnail = thumbnailImg?.getAttribute('src') || ''
                 
                 return {
                   id: '',
                   title,
                   thumbnail,
                   viewCount: '0',
                   likeCount: '0',
                   commentCount: '0',
                   duration: '0:00',
                   publishedAt: new Date().toISOString(),
                   channelCreatedAt: null,
                   channelTitle: ''
                 }
               }).filter(video => video !== null)
               
               if (visibleVideos.length > 0) {
                 window.allVideos = visibleVideos
                 console.log(`✅ Recriados ${visibleVideos.length} vídeos da tela`)
               } else {
                 console.log('❌ Não foi possível recriar vídeos da tela')
                 return
               }
             } else {
               console.log('❌ Nenhuma linha de vídeo encontrada na tela')
               return
             }
           }
          
                     const totalPages = Math.ceil(window.allVideos.length / window.videosPerPage)
           
           console.log('📊 Validação da página:', {
             requestedPage: page,
             totalPages,
             currentPage: window.currentPage,
             totalVideos: window.allVideos.length,
             videosPerPage: window.videosPerPage,
             calculation: `${window.allVideos.length} / ${window.videosPerPage} = ${totalPages}`
           })
           
           if (page < 1 || page > totalPages) {
             console.log('❌ Página inválida:', page, `(máximo: ${totalPages})`)
             return
           }
          
          // Atualizar página atual
          window.currentPage = page
          console.log(`✅ Página alterada para ${page}`)
          
          // Calcular índices dos vídeos para esta página
          const startIndex = (page - 1) * window.videosPerPage
          const endIndex = startIndex + window.videosPerPage
          const pageVideos = window.allVideos.slice(startIndex, endIndex)
          
          console.log('📄 Vídeos da página:', {
            startIndex,
            endIndex,
            pageVideosCount: pageVideos.length,
            pageVideos: pageVideos.map(v => v.title)
          })
          
          // Renderizar os vídeos da nova página
          window.renderInline(window.allVideos)
          
          // Atualizar a paginação
          window.updatePagination()
          
          // Scroll para o topo dos resultados
          const resultsContainer = document.querySelector('.results-container')
          if (resultsContainer) {
            resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
          
          console.log(`✅ Mudança para página ${page} concluída`)
          
        } catch (error) {
          console.error('❌ Erro ao mudar página:', error)
        }
      }

                   window.updatePagination = function() {
        try {
          console.log('📄 Atualizando paginação...')
          const totalPages = Math.ceil(window.allVideos.length / window.videosPerPage)
          const paginationContainer = document.getElementById('pagination')
          
          console.log('📊 Dados da paginação:', {
            totalVideos: window.allVideos.length,
            videosPerPage: window.videosPerPage,
            totalPages,
            currentPage: window.currentPage
          })
          
          if (!paginationContainer) {
            console.error('❌ Container de paginação não encontrado')
            return
          }
          
                     console.log('📊 Calculando paginação:', {
             totalVideos: window.allVideos.length,
             videosPerPage: window.videosPerPage,
             totalPages,
             currentPage: window.currentPage
           })
           
           if (totalPages <= 1) {
             paginationContainer.innerHTML = ''
             console.log('📄 Apenas uma página, removendo paginação')
             return
           }

          let paginationHTML = '<div class="pagination-controls">'
          
          // Botão anterior
          if (window.currentPage > 1) {
            paginationHTML += `<button type="button" data-page="${window.currentPage - 1}" class="pagination-btn pagination-btn-prev">← Anterior</button>`
          }
          
          // Números das páginas
          const startPage = Math.max(1, window.currentPage - 2)
          const endPage = Math.min(totalPages, window.currentPage + 2)
          
          for (let i = startPage; i <= endPage; i++) {
            if (i === window.currentPage) {
              paginationHTML += `<span class="pagination-current">${i}</span>`
            } else {
              paginationHTML += `<button type="button" data-page="${i}" class="pagination-btn pagination-btn-number">${i}</button>`
            }
          }
          
          // Botão próximo
          if (window.currentPage < totalPages) {
            paginationHTML += `<button type="button" data-page="${window.currentPage + 1}" class="pagination-btn pagination-btn-next">Próximo →</button>`
          }
          
          paginationHTML += '</div>'
          
          // Informações da página
          const startIndex = (window.currentPage - 1) * window.videosPerPage + 1
          const endIndex = Math.min(window.currentPage * window.videosPerPage, window.allVideos.length)
          
          paginationHTML += `<div class="pagination-info">Mostrando ${startIndex}-${endIndex} de ${window.allVideos.length} vídeos</div>`
          
          paginationContainer.innerHTML = paginationHTML
          
          // Adicionar event listeners aos botões
          const paginationButtons = paginationContainer.querySelectorAll('.pagination-btn')
          paginationButtons.forEach(button => {
            button.addEventListener('click', (e) => {
              e.preventDefault()
              const page = parseInt(button.getAttribute('data-page') || '1')
              console.log(`🖱️ Clique no botão de paginação: página ${page}`)
              window.changePage(page)
            })
          })
          
          console.log('✅ Paginação atualizada com event listeners')
        } catch (error) {
          console.error('❌ Erro ao atualizar paginação:', error)
        }
      }

         // Configurar event listeners com delay maior e verificação repetida
     const setupEventListeners = () => {
       console.log('🔗 Configurando event listeners...')
       
       // Botão de busca
       const searchButton = document.getElementById('searchBtn')
       if (searchButton) {
         const newButton = searchButton.cloneNode(true)
         searchButton.parentNode?.replaceChild(newButton, searchButton)
         newButton.addEventListener('click', async (e) => {
           e.preventDefault()
           console.log('🖱️ Botão de busca clicado!')
           try {
             await window.fetchData()
           } catch (error) {
             console.error('❌ Erro ao executar fetchData:', error)
           }
         })
         console.log('✅ Event listener do botão de busca configurado')
       } else {
         console.error('❌ Botão de busca não encontrado! Tentando novamente em 500ms...')
         setTimeout(setupEventListeners, 500)
         return
       }
       
       // Botão de limpar
       const resetButton = document.getElementById('resetBtn')
       if (resetButton) {
         const newResetButton = resetButton.cloneNode(true)
         resetButton.parentNode?.replaceChild(newResetButton, resetButton)
         newResetButton.addEventListener('click', async () => {
           await window.resetForm()
         })
         console.log('✅ Event listener do botão de limpar configurado')
       }
       
       // Botões de ordenação
       const sortDuration = document.getElementById('sortDuration')
       if (sortDuration) {
         sortDuration.addEventListener('change', () => {
           window.toggleSort('duration')
         })
       }
       
       const sortUpload = document.getElementById('sortUpload')
       if (sortUpload) {
         sortUpload.addEventListener('change', () => {
           window.toggleSort('upload')
         })
       }
       
       const sortViews = document.getElementById('sortViews')
       if (sortViews) {
         sortViews.addEventListener('change', () => {
           window.toggleSort('views')
         })
       }
       
       const sortLikes = document.getElementById('sortLikes')
       if (sortLikes) {
         sortLikes.addEventListener('change', () => {
           window.toggleSort('likes')
         })
       }
       
       const sortComments = document.getElementById('sortComments')
       if (sortComments) {
         sortComments.addEventListener('change', () => {
           window.toggleSort('comments')
         })
       }
       
       const sortChannel = document.getElementById('sortChannel')
       if (sortChannel) {
         sortChannel.addEventListener('change', () => {
           window.toggleSort('channel')
         })
       }
       
       const sortSubscribers = document.getElementById('sortSubscribers')
       if (sortSubscribers) {
         sortSubscribers.addEventListener('change', () => {
           window.toggleSort('subscribers')
         })
       }
       
       // Event listeners para as setinhas
       const arrows = document.querySelectorAll('.sort-arrows')
       arrows.forEach((arrow, index) => {
         const keys = ['duration', 'upload', 'views', 'likes', 'comments', 'subscribers', 'channel']
         const key = keys[index]
         
         arrow.addEventListener('click', () => {
           window.toggleSort(key)
         })
       })
       
       console.log('✅ Todos os event listeners configurados')
     }
     
          // Iniciar configuração dos event listeners com delay
     setTimeout(setupEventListeners, 200)

    console.log('✅ Script do buscador carregado com sucesso!')
  }

  const handleCloseWelcomeModal = () => {
    setShowWelcomeModal(false)
  }

  const handleCloseLimitModal = () => {
    setShowLimitModal(false)
  }

  return (
    <ProtectedRoute>
      <div className="buscador-container">
        <Navigation />
        <div className="buscador-content">
          <header>
            <div className="header-logo">
              <h1>Minerador de Vídeos Virais</h1>
              <p className="subtitle">Descubra os vídeos mais populares do YouTube</p>
            </div>
          </header>

          <main>
                         <form id="filterForm">
               <div className="api-key-section">
                 <input
                   type="text"
                   id="youtubeApiKey"
                   placeholder="Sua chave da API do YouTube (obrigatório)"
                   required
                   className="api-key-input"
                 />
                                   <div className="api-key-help">
                    <span className="help-icon">ℹ️</span>
                    <span className="help-text">
                      Obtenha sua chave gratuita em: 
                      <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer">
                        Google Cloud Console
                      </a>
                    </span>
                    
                  </div>
               </div>
               
               <input
                 type="text"
                 id="keywords"
                 placeholder="Palavras-chave..."
                 required
               />
               <select id="language">
                 <option value="">Todos os idiomas</option>
                 <option value="pt">Português</option>
                 <option value="en">Inglês</option>
                 <option value="es">Espanhol</option>
               </select>
                              <select id="country">
                  <option value="">Todos os países</option>
                  <option value="BR">Brasil</option>
                  <option value="US">Estados Unidos</option>
                  <option value="MX">México</option>
                </select>
               <input
                 type="date"
                 id="dateFrom"
                 placeholder="Data inicial"
               />
               <input
                 type="date"
                 id="dateTo"
                 placeholder="Data final"
               />
               <input
                 type="number"
                 id="minViews"
                 placeholder="Visualizações mínimas"
               />
               <input
                 type="number"
                 id="minLikes"
                 placeholder="Likes mínimos"
               />
                               <input
                  type="number"
                  id="minSubscribers"
                  placeholder="Inscritos mínimos"
                />
                <input
                  type="number"
                  id="maxSubscribers"
                  placeholder="Inscritos máximos"
                />
               <button type="button" id="searchBtn" className="primary">
                 Buscar
               </button>
               <button type="button" id="resetBtn" className="secondary">
                 Limpar
               </button>
             </form>

            <div id="errorMsg" className="error" style={{ display: 'none' }}>
              Erro na busca. Tente novamente.
            </div>

                         <div className="results-inline">
                                                             <div className="filters-container-flex">
                   <div className="filter-item">
                     <label>
                       <input type="checkbox" id="sortDuration" defaultChecked />
                       Duração
                     </label>
                     <span className="sort-arrows">↕</span>
                   </div>
                   <div className="filter-item">
                     <label>
                       <input type="checkbox" id="sortUpload" defaultChecked />
                       Upload
                     </label>
                     <span className="sort-arrows">↕</span>
                   </div>
                   <div className="filter-item">
                     <label>
                       <input type="checkbox" id="sortViews" defaultChecked />
                       Views
                     </label>
                     <span className="sort-arrows">↕</span>
                   </div>
                   <div className="filter-item">
                     <label>
                       <input type="checkbox" id="sortLikes" defaultChecked />
                       Likes
                     </label>
                     <span className="sort-arrows">↕</span>
                   </div>
                   <div className="filter-item">
                     <label>
                       <input type="checkbox" id="sortComments" defaultChecked />
                       Comentários
                     </label>
                     <span className="sort-arrows">↕</span>
                   </div>
                   <div className="filter-item">
                     <label>
                       <input type="checkbox" id="sortSubscribers" defaultChecked />
                       Inscritos
                     </label>
                     <span className="sort-arrows">↕</span>
                   </div>
                   <div className="filter-item">
                     <label>
                       <input type="checkbox" id="sortChannel" defaultChecked />
                       Canal Criado
                     </label>
                     <span className="sort-arrows">↕</span>
                   </div>
                 </div>

              <div className="results-container">
                                 <table id="resultsTable">
                   <thead>
                     <tr>
                       <th className="thumbnail-header">Thumbnail</th>
                       <th>Informações do Vídeo</th>
                     </tr>
                   </thead>
                  <tbody>
                                         <tr>
                       <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#86868b' }}>
                         Digite palavras-chave e clique em "Buscar" para começar
                       </td>
                     </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div id="pagination" className="pagination-container"></div>
          </main>
        </div>

        {/* Modais de assinatura */}
        <SubscriptionModal
          isOpen={showWelcomeModal}
          onClose={handleCloseWelcomeModal}
          type="welcome"
        />
        
        <SubscriptionModal
          isOpen={showLimitModal}
          onClose={handleCloseLimitModal}
          type="limit-reached"
        />
      </div>
    </ProtectedRoute>
  )
}

