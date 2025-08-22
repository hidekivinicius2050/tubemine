const { Resend } = require('resend')

// Configuração do Resend
const resend = new Resend('re_JA8LHWRb_6dGf4LANihdZQMguBhSaWHbe')

// Configurações de e-mail
const EMAIL_CONFIG = {
  FROM_EMAIL: 'onboarding@resend.dev', // Domínio verificado do Resend
  FROM_NAME: 'TubeMine',
  REPLY_TO: 'viniciushideki2050@gmail.com' // Email verificado
}

// CSS compartilhado
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
    padding: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    border: 2px solid #ef4444;
  }
  .logo img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`

// Template de email de boas-vindas
const welcomeEmailHTML = (data) => `
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
        <p>Plataforma de análise de vídeos do YouTube</p>
      </div>
      <div class="content">
        <h2>Olá ${data.name}!</h2>
        <p>Seja bem-vindo ao TubeMine! Sua conta foi criada com sucesso.</p>
        
        <p>Com o TubeMine, você pode:</p>
        <ul>
          <li>🔍 Buscar vídeos do YouTube com filtros avançados</li>
          <li>📊 Analisar tendências e métricas</li>
          <li>🎯 Encontrar conteúdo relevante para seu nicho</li>
          <li>📈 Acompanhar o desempenho de vídeos</li>
        </ul>
        
        <a href="https://www.tubemine.com.br/buscador" class="btn">Começar a Buscar</a>
        
        <p><strong>Plano Gratuito:</strong> 1 busca por dia</p>
        <p><strong>Plano PRO:</strong> Buscas ilimitadas + recursos avançados</p>
      </div>
      <div class="footer">
        <p>© 2025 TubeMine. Todos os direitos reservados.</p>
        <p>Estamos aqui para ajudar você a descobrir os melhores vídeos!</p>
      </div>
    </div>
  </body>
  </html>
`

async function testEmailSystem() {
  console.log('🧪 Testando sistema de emails...')
  
  try {
    // Teste 1: Email de boas-vindas
    console.log('\n📧 Testando email de boas-vindas...')
    
    const { data, error } = await resend.emails.send({
      from: `${EMAIL_CONFIG.FROM_NAME} <${EMAIL_CONFIG.FROM_EMAIL}>`,
      to: ['viniciushideki2050@gmail.com'], // Email verificado
      replyTo: EMAIL_CONFIG.REPLY_TO,
      subject: 'Teste - Bem-vindo ao TubeMine! 🎉',
      html: welcomeEmailHTML({ name: 'Usuário Teste' })
    })

    if (error) {
      console.error('❌ Erro ao enviar email:', error)
      return
    }

    console.log('✅ Email enviado com sucesso!')
    console.log('📧 ID do email:', data?.id)
    console.log('📧 Status:', data?.status)
    
    // Teste 2: Verificar configuração
    console.log('\n🔧 Verificando configuração...')
    console.log('📧 FROM_EMAIL:', EMAIL_CONFIG.FROM_EMAIL)
    console.log('📧 FROM_NAME:', EMAIL_CONFIG.FROM_NAME)
    console.log('📧 REPLY_TO:', EMAIL_CONFIG.REPLY_TO)
    console.log('🔑 RESEND_API_KEY:', 're_JA8LHWRb_6dGf4LANihdZQMguBhSaWHbe' ? '✅ Configurado' : '❌ Não configurado')
    
  } catch (error) {
    console.error('❌ Erro no teste:', error)
  }
}

// Executar teste
testEmailSystem()
