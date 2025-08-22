require('dotenv').config({ path: '.env.local' });

const { Resend } = require('resend');

// Configuração do Resend em modo desenvolvedor
const resend = new Resend(process.env.RESEND_API_KEY || 're_JA8LHWRb_6dGf4LANihdZQMguBhSaWHbe');

const EMAIL_RECUPERACAO_SENHA_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TubeMine - Recuperação de Senha</title>
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
    
    .reset-container {
      background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
      border-radius: 20px;
      padding: 35px;
      margin: 30px 0;
      border: 1px solid rgba(220, 38, 38, 0.1);
      text-align: center;
    }
    
    .reset-title {
      font-size: 22px;
      font-weight: 700;
      color: #333;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }
    
    .reset-text {
      color: #666;
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 30px;
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
    
    .security-info {
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      border-radius: 15px;
      padding: 25px;
      margin: 30px 0;
      border: 1px solid rgba(59, 130, 246, 0.1);
    }
    
    .security-title {
      font-size: 18px;
      font-weight: 700;
      color: #1e40af;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    
    .security-text {
      color: #374151;
      font-size: 14px;
      line-height: 1.6;
      text-align: center;
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
    
    .recuperacao-badge {
      background: #dc2626;
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
        <h1>Recuperação de Senha</h1>
        <p>Vamos redefinir sua senha de forma segura</p>
      </div>
      <div class="content">
        <div style="text-align: center; margin-bottom: 20px;">
          <div class="recuperacao-badge">🔐 RECUPERAÇÃO DE SENHA</div>
        </div>
        
        <div class="greeting">Olá, Vinicius! 🔐</div>
        
        <p class="intro-text">
          Recebemos uma solicitação para redefinir a senha da sua conta TubeMine. 
          Se você não fez essa solicitação, pode ignorar este email com segurança.
        </p>
        
        <div class="reset-container">
          <div class="reset-title">
            🔑 Redefinir Sua Senha
          </div>
          
          <p class="reset-text">
            Clique no botão abaixo para ser redirecionado ao sistema e criar uma nova senha segura. 
            Este link é válido por 24 horas por questões de segurança.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:3001/reset-password?token={{RESET_TOKEN}}" class="btn">
              Redefinir Senha
            </a>
          </div>
        </div>
        
        <div class="security-info">
          <div class="security-title">
            🛡️ Dicas de Segurança
          </div>
          <p class="security-text">
            • Use uma senha forte com pelo menos 8 caracteres<br>
            • Combine letras maiúsculas, minúsculas, números e símbolos<br>
            • Não compartilhe sua senha com ninguém<br>
            • Ative a autenticação de dois fatores se disponível
          </p>
        </div>
        
        <div style="background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border-radius: 15px; padding: 25px; margin: 30px 0; text-align: center;">
          <p style="color: #dc2626; font-weight: 600; margin: 0; font-size: 15px;">
            ⚠️ <strong>Importante:</strong> Se você não solicitou esta recuperação, sua conta pode estar em risco. Entre em contato conosco imediatamente.
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

async function enviarEmailRecuperacaoSenha() {
  console.log('🔐 ENVIANDO EMAIL DE RECUPERAÇÃO DE SENHA...');
  
  try {
    // Configurar modo desenvolvedor
    process.env.NODE_ENV = 'development';
    
    const { data, error } = await resend.emails.send({
      from: 'TubeMine <contact@tubemine.com.br>',
      to: ['viniciushideki2050@gmail.com'],
      subject: '[DEV] TubeMine - Recuperação de Senha 🔐 (BOTÃO FUNCIONAL)',
      html: EMAIL_RECUPERACAO_SENHA_HTML
    });

    if (error) {
      console.error('❌ Erro:', error);
      return;
    }

    console.log('✅ Email de Recuperação de Senha enviado! ID:', data.id);
    console.log('📧 Email enviado para: viniciushideki2050@gmail.com');
    console.log('🔧 Modo: Desenvolvimento (não consome limite)');
    console.log('🔐 Design profissional aplicado!');
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

enviarEmailRecuperacaoSenha();
