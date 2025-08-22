require('dotenv').config({ path: '.env.local' });

const { Resend } = require('resend');

// Configuração do Resend em modo desenvolvedor
const resend = new Resend(process.env.RESEND_API_KEY || 're_JA8LHWRb_6dGf4LANihdZQMguBhSaWHbe');

const EMAIL_BOAS_VINDAS_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TubeMine - Bem-vindo!</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body { 
      font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
      background: linear-gradient(135deg, #dc2626 0%, #991b1b 50%, #7f1d1d 100%);
      min-height: 100vh;
      color: #333;
    }
    
    .email-wrapper {
      padding: 20px;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .container {
      max-width: 600px;
      width: 100%;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 25px;
      box-shadow: 0 25px 70px rgba(0, 0, 0, 0.2);
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }
    
    .header {
      background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
      color: white;
      padding: 50px 40px;
      text-align: center;
      position: relative;
    }
    
    /* LOGO - MESMO DESIGN DO MODELO 6 */
    .logo-container {
      width: 150px;
      height: 150px;
      background: white;
      border-radius: 50%;
      margin: 0 auto 25px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid rgba(255, 255, 255, 0.3);
      position: relative;
      z-index: 9999;
      overflow: visible;
    }
    
    .logo-image {
      width: 120px;
      height: 120px;
      object-fit: contain;
      position: relative;
      z-index: 10000;
      display: block;
      border: none;
      outline: none;
      max-width: 100%;
      height: auto;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    }
    
    .header h1 {
      font-size: 36px;
      font-weight: 800;
      margin-bottom: 12px;
      position: relative;
      z-index: 1;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    }
    
    .header p {
      font-size: 18px;
      opacity: 0.9;
      position: relative;
      z-index: 1;
      font-weight: 500;
    }
    
    .content {
      padding: 50px 40px;
      background: white;
    }
    
    .greeting {
      font-size: 28px;
      font-weight: 700;
      color: #dc2626;
      margin-bottom: 25px;
      text-align: center;
      background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .intro-text {
      color: #666;
      font-size: 16px;
      line-height: 1.7;
      text-align: center;
      margin-bottom: 40px;
    }
    
    .features-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin: 30px 0;
    }
    
         .feature-item {
       background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
       padding: 20px;
       border-radius: 15px;
       text-align: left;
       border: 2px solid #e2e8f0;
       transition: all 0.3s ease;
       display: flex;
       align-items: flex-start;
       gap: 25px;
     }
     
     .feature-item:hover {
       transform: translateY(-5px);
       box-shadow: 0 10px 25px rgba(0,0,0,0.1);
       border-color: #dc2626;
     }
     
     .feature-emoji {
       font-size: 32px;
       flex-shrink: 0;
       margin-top: 2px;
     }
     
     .feature-content {
       flex: 1;
     }
     
     .feature-title {
       font-weight: bold;
       color: #dc2626;
       margin-bottom: 8px;
       font-size: 16px;
     }
     
     .feature-desc {
       font-size: 14px;
       color: #666;
       line-height: 1.4;
     }
    
    .next-steps {
      background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
      border: 2px solid #fecaca;
      border-radius: 15px;
      padding: 25px;
      margin: 30px 0;
    }
    
    .next-steps h3 {
      color: #dc2626;
      margin-bottom: 15px;
      font-size: 20px;
    }
    
    .steps-list {
      list-style: none;
      text-align: left;
    }
    
    .steps-list li {
      margin-bottom: 10px;
      padding-left: 25px;
      position: relative;
      color: #666;
    }
    
    .steps-list li::before {
      content: '✅';
      position: absolute;
      left: 0;
      color: #10b981;
    }
    
    .bonus-section {
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      border: 2px solid #bbf7d0;
      border-radius: 15px;
      padding: 25px;
      margin: 30px 0;
    }
    
    .bonus-section h3 {
      color: #16a34a;
      margin-bottom: 15px;
      font-size: 20px;
    }
    
    .btn {
      display: inline-block;
      background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
      color: white !important;
      padding: 18px 40px;
      text-decoration: none;
      font-weight: 700;
      font-size: 16px;
      border-radius: 50px;
      box-shadow: 0 10px 30px rgba(220, 38, 38, 0.4);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }
    
    .footer {
      background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
      padding: 30px 40px;
      text-align: center;
      color: white;
    }
    
    .brand-name {
      font-size: 26px;
      font-weight: 800;
      margin-bottom: 8px;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }
    
    .brand-tagline {
      opacity: 0.9;
      font-size: 14px;
      margin-bottom: 8px;
    }
    
    .copyright {
      opacity: 0.8;
      font-size: 12px;
    }
    
    .boas-vindas-badge {
      background: #10b981;
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 20px;
      display: inline-block;
    }
    
    @media (max-width: 600px) {
      .features-grid {
        grid-template-columns: 1fr;
      }
      
      .header h1 {
        font-size: 28px;
      }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="container">
      <div class="header">
        <div class="logo-container">
          <!-- LOGO - EXATAMENTE IGUAL AO EMAIL PRO QUE FUNCIONA -->
          <img src="https://i.postimg.cc/7htj7BtY/logo-tubeminer.png" 
               alt="TubeMine" 
               class="logo-image"
               style="width: 120px; height: 120px; object-fit: contain; display: block; border: none; outline: none; max-width: 100%; height: auto;"
               onerror="this.style.display='none'; document.getElementById('logo2').style.display='block';">
          
          <img id="logo2"
               src="https://i.postimg.cc/7htj7BtY/logo-tubeminer.png?t=${Date.now()}&v=1" 
               alt="TubeMine" 
               class="logo-image"
               style="width: 120px; height: 120px; object-fit: contain; display: none; border: none; outline: none; max-width: 100%; height: auto;"
               onerror="this.style.display='none'; document.getElementById('logo3').style.display='block';">
          
          <img id="logo3"
               src="https://i.postimg.cc/7htj7BtY/logo-tubeminer.png?email=true&logo=true" 
               alt="TubeMine" 
               class="logo-image"
               style="width: 120px; height: 120px; object-fit: contain; display: none; border: none; outline: none; max-width: 100%; height: auto;"
               onerror="this.style.display='none'; document.getElementById('logo4').style.display='block';">
          
          <img id="logo4"
               src="https://i.postimg.cc/7htj7BtY/logo-tubeminer.png?ref=tubemine&type=logo" 
               alt="TubeMine" 
               class="logo-image"
               style="width: 120px; height: 120px; object-fit: contain; display: none; border: none; outline: none; max-width: 100%; height: auto;"
               onerror="this.style.display='none'; document.getElementById('logo5').style.display='block';">
          
          <img id="logo5"
               src="https://i.postimg.cc/7htj7BtY/logo-tubeminer.png?final=true&logo=tubemine&email=pro" 
               alt="TubeMine" 
               class="logo-image"
               style="width: 120px; height: 120px; object-fit: contain; display: none; border: none; outline: none; max-width: 100%; height: auto;"
               onerror="this.style.display='none'; document.getElementById('logo-fallback').style.display='block';">
          
          <div id="logo-fallback" class="logo-fallback" style="display: none; font-size: 32px; font-weight: 900; color: #dc2626; text-align: center; line-height: 1; position: relative; z-index: 10000; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1); letter-spacing: -1px;">TM</div>
        </div>
        <h1>Bem-vindo ao TubeMine!</h1>
        <p>Sua jornada para o sucesso no YouTube começa agora</p>
      </div>
      <div class="content">
        <div style="text-align: center; margin-bottom: 20px;">
          <div class="boas-vindas-badge">🎉 BEM-VINDO AO TUBEMINE!</div>
        </div>
        
        <div class="greeting">Olá, Vinicius! 🚀</div>
        
        <p class="intro-text">
          Parabéns por se juntar à nossa plataforma! Você agora tem acesso a todas as ferramentas 
          necessárias para otimizar seus vídeos e crescer no YouTube.
        </p>
        
                 <div class="features-grid">
           <div class="feature-item">
             <span class="feature-emoji">🎯</span>
             <div class="feature-content">
               <div class="feature-title">Análise Inteligente</div>
               <div class="feature-desc">Descubra as melhores palavras-chave e tendências</div>
             </div>
           </div>
           
           <div class="feature-item">
             <span class="feature-emoji">⚡</span>
             <div class="feature-content">
               <div class="feature-title">Otimização Rápida</div>
               <div class="feature-desc">Melhore seus vídeos em minutos, não em horas</div>
             </div>
           </div>
           
           <div class="feature-item">
             <span class="feature-emoji">📈</span>
             <div class="feature-content">
               <div class="feature-title">Crescimento Garantido</div>
               <div class="feature-desc">Estratégias comprovadas para aumentar views</div>
             </div>
           </div>
           
           <div class="feature-item">
             <span class="feature-emoji">🛡️</span>
             <div class="feature-content">
               <div class="feature-title">Suporte Premium</div>
               <div class="feature-desc">Nossa equipe está sempre pronta para ajudar</div>
             </div>
           </div>
         </div>
        
                 <div class="next-steps">
           <h3>🎯 Próximos Passos</h3>
           <ul class="steps-list">
             <li>Faça sua primeira análise de vídeo</li>
             <li>Entre em contato se precisar de ajuda</li>
           </ul>
         </div>
        
                 <div class="bonus-section">
           <h3>🎁 Bônus de Boas-vindas</h3>
           <p>Como presente especial, você tem direito a 1 busca grátis por dia em todos os recursos premium!</p>
         </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="#" class="btn">Começar Agora →</a>
        </div>
      </div>
      <div class="footer">
        <div class="brand-name">TubeMine</div>
        <div class="brand-tagline">Analytics Premium do YouTube</div>
        <div class="copyright">© 2024 TubeMine Analytics. Todos os direitos reservados.</div>
      </div>
    </div>
  </div>
</body>
</html>
`;

async function enviarEmailBoasVindas() {
  try {
    console.log('📧 ENVIANDO EMAIL DE BOAS-VINDAS FINAL...');
    
    const { data, error } = await resend.emails.send({
      from: 'TubeMine <onboarding@resend.dev>',
      to: ['viniciushideki2050@gmail.com'],
             subject: '[DEV] TubeMine - Bem-vindo! 🎉 (2 PRÓXIMOS PASSOS)',
      html: EMAIL_BOAS_VINDAS_HTML,
    });

    if (error) {
      console.error('❌ Erro ao enviar email:', error);
      return;
    }

    console.log('✅ Email de boas-vindas enviado com sucesso!');
    console.log('📧 ID:', data.id);
    console.log('📧 Assunto: [DEV] TubeMine - Bem-vindo! 🎉 (ESTRUTURA CORRIGIDA)');
    console.log('📧 Badge: 🎉 BEM-VINDO AO TUBEMINE!');
    console.log('📧 Modo: Desenvolvimento (não consome limite)');
    
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

enviarEmailBoasVindas();
