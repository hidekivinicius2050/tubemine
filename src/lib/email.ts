import { Resend } from 'resend'

// Configuração do Resend
const resend = new Resend(process.env.RESEND_API_KEY || 're_JA8LHWRb_6dGf4LANihdZQMguBhSaWHbe')

// Configurações de e-mail
const EMAIL_CONFIG = {
  FROM_EMAIL: 'noreply@tubemine.com.br',
  FROM_NAME: 'TubeMine',
  REPLY_TO: 'contact@tubemine.com.br'
}

// Tipos de e-mail
export type EmailType = 
  | 'welcome'
  | 'subscription_confirmation'
  | 'support_request'
  | 'thank_you_pro'
  | 'password_reset'

// Interface para dados do e-mail
export interface EmailData {
  to: string
  toName?: string
  type: EmailType
  data?: Record<string, any>
}

// CSS compartilhado para todos os templates
const SHARED_CSS = `
  body { 
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
    line-height: 1.6; 
    color: #f5f5f7; 
    background: linear-gradient(135deg, #1d1d1f 0%, #2c2c2e 100%);
    margin: 0;
    padding: 0;
  }
  .container { 
    max-width: 600px; 
    margin: 0 auto; 
    background: linear-gradient(135deg, #2c2c2e 0%, #3a3a3c 100%);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  }
  .header { 
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); 
    color: white; 
    padding: 40px 30px; 
    text-align: center; 
    position: relative;
  }
  .header h1 {
    margin: 0;
    font-size: 28px;
    font-weight: 700;
    color: #ffffff;
  }
  .header p {
    margin: 8px 0 0 0;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.9);
  }
  .content { 
    background: linear-gradient(135deg, #2c2c2e 0%, #3a3a3c 100%); 
    padding: 40px 30px; 
    color: #f5f5f7;
  }
  .btn { 
    display: inline-block; 
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); 
    color: white; 
    padding: 16px 32px; 
    text-decoration: none; 
    border-radius: 12px; 
    margin: 24px 0; 
    font-weight: 600;
    font-size: 16px;
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    transition: all 0.2s ease;
  }
  .btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
  }
  .footer { 
    text-align: center; 
    margin-top: 40px; 
    color: #86868b; 
    font-size: 14px; 
    padding: 20px 30px;
    border-top: 1px solid #4a4a4c;
  }
  .logo {
    width: 100px;
    height: 100px;
    margin: 0 auto 20px;
    background: white;
    border-radius: 16px;
    padding: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    border: 2px solid #ef4444;
  }
  .logo img {
    width: 100px;
    height: 100px;
    object-fit: contain;
  }
  .feature-list {
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.2);
    border-radius: 12px;
    padding: 20px;
    margin: 24px 0;
  }
  .feature-item {
    display: flex;
    align-items: center;
    margin: 12px 0;
    color: #f5f5f7;
  }
  .feature-icon {
    color: #ef4444;
    margin-right: 12px;
    font-size: 18px;
  }
`

// Templates de e-mail
const EMAIL_TEMPLATES = {
  welcome: {
    subject: 'Bem-vindo ao TubeMine! 🚀',
    html: (data: any) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bem-vindo ao TubeMine</title>
        <style>${SHARED_CSS}</style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">
              <img src="https://i.postimg.cc/XJgbDGZ2/logo-tubeminer.png" alt="TubeMine Logo" style="width: 100px; height: 100px;">
            </div>
            <h1>Bem-vindo ao TubeMine!</h1>
            <p>Seu buscador de vídeos virais está pronto</p>
          </div>
          <div class="content">
            <h2>Olá ${data.name}!</h2>
            <p>Parabéns! Sua conta no TubeMine foi criada com sucesso. Agora você pode começar a descobrir vídeos virais e tendências do YouTube.</p>
            
            <div class="feature-list">
              <h3>🎯 O que você pode fazer:</h3>
              <div class="feature-item">
                <span class="feature-icon">✓</span>
                <span>Buscar vídeos por palavras-chave</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">✓</span>
                <span>Filtrar por país, idioma e data</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">✓</span>
                <span>Analisar métricas de engajamento</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">✓</span>
                <span>Descobrir tendências virais</span>
              </div>
            </div>
            
            <a href="https://www.tubemine.com.br/buscador" class="btn">Começar a Buscar</a>
            
            <p><strong>Dica:</strong> Faça upgrade para o plano PRO e tenha buscas ilimitadas!</p>
          </div>
          <div class="footer">
            <p>© 2025 TubeMine. Todos os direitos reservados.</p>
            <p>Se você não criou esta conta, ignore este e-mail.</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  subscription_confirmation: {
    subject: 'Assinatura PRO Confirmada! 🎉',
    html: (data: any) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Assinatura PRO Confirmada</title>
        <style>${SHARED_CSS}</style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">
              <img src="https://i.postimg.cc/XJgbDGZ2/logo-tubeminer.png" alt="TubeMine Logo" style="width: 100px; height: 100px;">
            </div>
            <h1>Assinatura PRO Confirmada!</h1>
            <p>Bem-vindo ao clube exclusivo</p>
          </div>
          <div class="content">
            <h2>Parabéns ${data.name}!</h2>
            <p>Sua assinatura PRO foi ativada com sucesso. Agora você tem acesso completo a todas as funcionalidades do TubeMine.</p>
            
            <div class="feature-list">
              <h3>🚀 Benefícios do Plano PRO:</h3>
              <div class="feature-item">
                <span class="feature-icon">✓</span>
                <span>Buscas ilimitadas</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">✓</span>
                <span>Todos os filtros avançados</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">✓</span>
                <span>Resultados completos</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">✓</span>
                <span>Suporte prioritário</span>
              </div>
            </div>
            
            <a href="https://www.tubemine.com.br/buscador" class="btn">Começar a Minerar</a>
            
            <p><strong>Valor:</strong> R$ 19,90/mês</p>
            <p><strong>Próxima cobrança:</strong> ${data.nextBillingDate}</p>
          </div>
          <div class="footer">
            <p>© 2025 TubeMine. Todos os direitos reservados.</p>
            <p>Cancelamento a qualquer momento em sua conta.</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  support_request: {
    subject: 'Solicitação de Suporte Recebida 📧',
    html: (data: any) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Solicitação de Suporte</title>
        <style>${SHARED_CSS}</style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">
              <img src="https://i.postimg.cc/XJgbDGZ2/logo-tubeminer.png" alt="TubeMine Logo" style="width: 100px; height: 100px;">
            </div>
            <h1>Solicitação de Suporte</h1>
            <p>Recebemos sua mensagem</p>
          </div>
          <div class="content">
            <h2>Olá ${data.name}!</h2>
            <p>Recebemos sua solicitação de suporte e nossa equipe está trabalhando para responder o mais rápido possível.</p>
            
            <div class="feature-list">
              <h3>📋 Detalhes da Solicitação:</h3>
              <div class="feature-item">
                <span class="feature-icon">📧</span>
                <span><strong>Assunto:</strong> ${data.subject}</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">📝</span>
                <span><strong>Mensagem:</strong> ${data.message}</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">🆔</span>
                <span><strong>Ticket:</strong> #${data.ticketId}</span>
              </div>
            </div>
            
            <p><strong>Tempo de resposta:</strong> Geralmente respondemos em até 24 horas.</p>
            <p><strong>Status:</strong> Em análise</p>
          </div>
          <div class="footer">
            <p>© 2025 TubeMine. Todos os direitos reservados.</p>
            <p>Para urgências, responda diretamente a este e-mail.</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  thank_you_pro: {
    subject: 'Obrigado por Escolher o Plano PRO! 💎',
    html: (data: any) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Obrigado pelo Plano PRO</title>
        <style>${SHARED_CSS}</style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">
              <img src="https://i.postimg.cc/XJgbDGZ2/logo-tubeminer.png" alt="TubeMine Logo" style="width: 100px; height: 100px;">
            </div>
            <h1>Obrigado pelo Plano PRO!</h1>
            <p>Você faz parte do nosso clube exclusivo</p>
          </div>
          <div class="content">
            <h2>Olá ${data.name}!</h2>
            <p>Queremos agradecer por escolher o plano PRO do TubeMine. Sua confiança em nossa plataforma significa muito para nós.</p>
            
            <div class="feature-list">
              <h3>💎 O que você tem agora:</h3>
              <div class="feature-item">
                <span class="feature-icon">✓</span>
                <span>Acesso ilimitado a todas as buscas</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">✓</span>
                <span>Filtros avançados exclusivos</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">✓</span>
                <span>Suporte prioritário 24/7</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">✓</span>
                <span>Atualizações exclusivas</span>
              </div>
            </div>
            
            <a href="https://www.tubemine.com.br/buscador" class="btn">Explorar Recursos</a>
            
            <p><strong>Dica:</strong> Use os filtros de data para encontrar tendências específicas!</p>
          </div>
          <div class="footer">
            <p>© 2025 TubeMine. Todos os direitos reservados.</p>
            <p>Estamos aqui para ajudar você a descobrir os melhores vídeos!</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  password_reset: {
    subject: 'Redefinição de Senha - TubeMine 🔐',
    html: (data: any) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Redefinição de Senha</title>
        <style>${SHARED_CSS}</style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">
              <img src="https://i.postimg.cc/XJgbDGZ2/logo-tubeminer.png" alt="TubeMine Logo" style="width: 100px; height: 100px;">
            </div>
            <h1>Redefinição de Senha</h1>
            <p>Segurança em primeiro lugar</p>
          </div>
          <div class="content">
            <h2>Olá ${data.name}!</h2>
            <p>Recebemos uma solicitação para redefinir sua senha no TubeMine.</p>
            
            <p>Se você não fez essa solicitação, pode ignorar este e-mail.</p>
            
            <a href="${data.resetUrl}" class="btn">Redefinir Senha</a>
            
            <p><strong>Este link expira em 1 hora.</strong></p>
            
            <p>Por segurança, não compartilhe este link com ninguém.</p>
          </div>
          <div class="footer">
            <p>© 2025 TubeMine. Todos os direitos reservados.</p>
            <p>Se você não solicitou esta redefinição, ignore este e-mail.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }
}

// Função principal para enviar e-mail
export async function sendEmail(emailData: EmailData): Promise<boolean> {
  try {
    const template = EMAIL_TEMPLATES[emailData.type]
    if (!template) {
      throw new Error(`Template de e-mail não encontrado para o tipo: ${emailData.type}`)
    }

    const { data, error } = await resend.emails.send({
      from: `${EMAIL_CONFIG.FROM_NAME} <${EMAIL_CONFIG.FROM_EMAIL}>`,
      to: [emailData.to],
      replyTo: EMAIL_CONFIG.REPLY_TO,
      subject: template.subject,
      html: template.html({ ...emailData.data, name: emailData.toName || emailData.to.split('@')[0] })
    })

    if (error) {
      console.error('❌ Erro ao enviar e-mail:', error)
      return false
    }

    console.log('✅ E-mail enviado com sucesso:', data)
    return true
  } catch (error) {
    console.error('❌ Erro ao enviar e-mail:', error)
    return false
  }
}

// Verificar se o e-mail está configurado
export function isEmailConfigured(): boolean {
  // Em desenvolvimento, sempre retorna true se temos a chave do Resend
  return !!(process.env.RESEND_API_KEY || 're_JA8LHWRb_6dGf4LANihdZQMguBhSaWHbe')
}
