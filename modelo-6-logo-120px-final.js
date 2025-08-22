require('dotenv').config({ path: '.env.local' });

const { Resend } = require('resend');

// Configuração do Resend em modo desenvolvedor
const resend = new Resend(process.env.RESEND_API_KEY || 're_JA8LHWRb_6dGf4LANihdZQMguBhSaWHbe');

const MODELO_6_LOGO_120PX_FINAL_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TubeMine PRO - Logo 120px Final</title>
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
    
    /* LOGO 120PX FINAL - FUNCIONANDO! */
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
    
    .features-container {
      background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
      border-radius: 20px;
      padding: 35px;
      margin: 30px 0;
      border: 1px solid rgba(220, 38, 38, 0.1);
    }
    
    .features-title {
      font-size: 22px;
      font-weight: 700;
      color: #333;
      text-align: center;
      margin-bottom: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }
    
    .benefits-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin: 25px 0;
    }
    
    .benefit-item {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 15px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(220, 38, 38, 0.1);
      transition: all 0.3s ease;
    }
    
    .benefit-icon {
      width: 45px;
      height: 45px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      flex-shrink: 0;
      text-align: center;
      line-height: 1;
    }
    
    .benefit-text {
      flex: 1;
    }
    
    .benefit-text h4 {
      font-size: 14px;
      font-weight: 600;
      color: #333;
      margin-bottom: 3px;
    }
    
    .benefit-text p {
      font-size: 12px;
      color: #666;
      line-height: 1.4;
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
    
    .logo-final-badge {
      background: #10b981;
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 20px;
      display: inline-block;
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="container">
      <div class="header">
        <div class="logo-container">
          <!-- LOGO 120PX FINAL - FUNCIONANDO! -->
          <img src="https://i.postimg.cc/7htj7BtY/logo-tubeminer.png" 
               alt="TubeMine" 
               class="logo-image"
               style="width: 120px; height: 120px; object-fit: contain; display: block; border: none; outline: none; max-width: 100%; height: auto;">
        </div>
        <h1>PRO Desbloqueado!</h1>
        <p>Sua jornada premium começa agora</p>
      </div>
      <div class="content">
        <div style="text-align: center; margin-bottom: 20px;">
          <div class="logo-final-badge">✅ LOGO 120PX - VERSÃO FINAL!</div>
        </div>
        
        <div class="greeting">Fantástico, Vinicius! 🚀</div>
        
        <p class="intro-text">
          Seja bem-vindo ao clube exclusivo TubeMine PRO! Agora você faz parte de um grupo seleto 
          que tem acesso às ferramentas mais avançadas de analytics do YouTube do mercado.
        </p>
        
        <div class="features-container">
          <div class="features-title">
            ⭐ Seus Novos Superpoderes
          </div>
          
          <div class="benefits-grid">
            <div class="benefit-item">
              <div class="benefit-icon">🔍</div>
              <div class="benefit-text">
                <h4>Pesquisas Ilimitadas</h4>
                <p>Zero limitações em suas buscas</p>
              </div>
            </div>
            
            <div class="benefit-item">
              <div class="benefit-icon">🎛️</div>
              <div class="benefit-text">
                <h4>Filtros Exclusivos</h4>
                <p>Acesso a filtros premium únicos</p>
              </div>
            </div>
            
            <div class="benefit-item">
              <div class="benefit-icon">📊</div>
              <div class="benefit-text">
                <h4>Analytics Avançados</h4>
                <p>Métricas detalhadas e insights</p>
              </div>
            </div>
            
            <div class="benefit-item">
              <div class="benefit-icon">🎧</div>
              <div class="benefit-text">
                <h4>Suporte VIP</h4>
                <p>Atendimento prioritário 24/7</p>
              </div>
            </div>
            
            <div class="benefit-item">
              <div class="benefit-icon">🎯</div>
              <div class="benefit-text">
                <h4>Insights Precisos</h4>
                <p>Análises profundas de performance</p>
              </div>
            </div>
            
            <div class="benefit-item">
              <div class="benefit-icon">⚡</div>
              <div class="benefit-text">
                <h4>Velocidade Turbo</h4>
                <p>Processamento ultra-rápido</p>
              </div>
            </div>
          </div>
        </div>
        
        <div style="text-align: center; margin: 40px 0;">
          <a href="https://www.tubemine.com.br/buscador" class="btn">
            Explorar Recursos PRO
          </a>
        </div>
        
        <div style="background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border-radius: 15px; padding: 25px; margin: 30px 0; text-align: center;">
          <p style="color: #dc2626; font-weight: 600; margin: 0; font-size: 15px;">
            🎉 <strong>Bônus Especial:</strong> Como membro PRO, você também tem acesso antecipado a todas as novas funcionalidades que lançamos!
          </p>
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

async function enviarModelo6Logo120pxFinal() {
  console.log('✅ ENVIANDO MODELO 6 - LOGO 120PX FINAL...');
  
  try {
    // Configurar modo desenvolvedor
    process.env.NODE_ENV = 'development';
    
    const { data, error } = await resend.emails.send({
      from: 'TubeMine <contact@tubemine.com.br>',
      to: ['viniciushideki2050@gmail.com'],
      subject: '[DEV] MODELO 6 - LOGO 120PX FINAL ✅',
      html: MODELO_6_LOGO_120PX_FINAL_HTML
    });

    if (error) {
      console.error('❌ Erro:', error);
      return;
    }

    console.log('✅ Modelo 6 - Logo 120px Final enviado! ID:', data.id);
    console.log('📧 Email enviado para: viniciushideki2050@gmail.com');
    console.log('🔧 Modo: Desenvolvimento (não consome limite)');
    console.log('✅ Logo 120px - versão final perfeita!');
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

enviarModelo6Logo120pxFinal();
