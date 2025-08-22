import { Resend } from 'resend'

// Configuração do Resend
const resend = new Resend(process.env.RESEND_API_KEY || 're_JA8LHWRb_6dGf4LANihdZQMguBhSaWHbe')

// Configurações de e-mail
const EMAIL_CONFIG = {
  FROM_EMAIL: 'contact@tubemine.com.br', // Domínio verificado do Resend
  FROM_NAME: 'TubeMine',
  REPLY_TO: 'viniciushideki2050@gmail.com' // Email verificado
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

// CSS compartilhado para todos os templates - MODELO 2: ELEGANTE PREMIUM MELHORADO
const SHARED_CSS = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body { 
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
    line-height: 1.6; 
    margin: 0;
    padding: 0;
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #404040 100%);
    min-height: 100vh;
  }
  
  .email-wrapper {
    padding: 50px 20px;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .container { 
    max-width: 700px; 
    width: 100%;
    background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
    border-radius: 30px;
    overflow: hidden;
    box-shadow: 
      0 30px 60px rgba(0, 0, 0, 0.4),
      0 0 40px rgba(220, 38, 38, 0.2);
    border: 3px solid transparent;
    position: relative;
  }
  
  .container::before {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    background: linear-gradient(45deg, #dc2626, #b91c1c, #991b1b, #7f1d1d, #dc2626);
    z-index: -1;
    border-radius: 33px;
    animation: borderGlow 4s ease-in-out infinite;
  }
  
  .header { 
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 30%, #991b1b 60%, #7f1d1d 100%);
    color: white; 
    padding: 100px 60px 80px;
    text-align: center; 
    position: relative;
    overflow: hidden;
  }
  
  .header::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 25% 75%, rgba(255,255,255,0.15) 0%, transparent 60%),
      radial-gradient(circle at 75% 25%, rgba(255,255,255,0.15) 0%, transparent 60%),
      radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08) 0%, transparent 70%);
  }
  
  .header h1 {
    margin: 0;
    font-size: 48px;
    font-weight: 900;
    color: #ffffff;
    position: relative;
    z-index: 1;
    letter-spacing: -1.5px;
    text-shadow: 0 6px 12px rgba(0,0,0,0.4);
  }
  
  .header p {
    margin: 20px 0 0 0;
    font-size: 22px;
    color: rgba(255, 255, 255, 0.95);
    position: relative;
    z-index: 1;
    font-weight: 600;
  }
  
  .content { 
    background: linear-gradient(145deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%); 
    padding: 60px 50px; 
    color: #374151;
    position: relative;
  }
  
  .content::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #dc2626, #b91c1c, #991b1b, #dc2626);
  }
  
  .btn { 
    display: inline-block; 
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 25%, #991b1b 50%, #7f1d1d 75%, #450a0a 100%);
    color: #ffffff !important; 
    padding: 20px 45px; 
    text-decoration: none; 
    border-radius: 0; 
    margin: 35px 0; 
    font-weight: 700;
    font-size: 18px;
    text-align: center;
    transition: all 0.4s ease;
    box-shadow: 
      0 10px 30px -10px rgba(220, 38, 38, 0.5),
      0 0 20px rgba(220, 38, 38, 0.3);
    position: relative;
    overflow: hidden;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  .btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    transition: left 0.6s;
  }
  
  .btn:hover::before {
    left: 100%;
  }
  
  .btn:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 
      0 20px 40px -15px rgba(220, 38, 38, 0.7),
      0 0 30px rgba(220, 38, 38, 0.5);
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 25%, #b91c1c 50%, #991b1b 75%, #7f1d1d 100%);
  }
  
  .footer { 
    text-align: center; 
    background: linear-gradient(135deg, #111827 0%, #1f2937 50%, #374151 100%);
    color: white; 
    font-size: 14px; 
    padding: 50px;
    position: relative;
    overflow: hidden;
  }
  
  .footer::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #dc2626, #b91c1c, #dc2626, transparent);
  }
  
  .logo {
    width: 80px;
    height: 80px;
    margin: 0 auto 24px;
    background: #ffffff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    position: relative;
    z-index: 1;
  }
  
  .logo img {
    width: 48px;
    height: 48px;
    object-fit: contain;
  }
  
  .feature-list {
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #e2e8f0 100%);
    border: none;
    border-radius: 25px;
    padding: 50px;
    margin: 45px 0;
    position: relative;
    box-shadow: 
      0 25px 50px rgba(0, 0, 0, 0.08),
      0 0 40px rgba(220, 38, 38, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);
    overflow: hidden;
  }
  
  .feature-list::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #dc2626, #b91c1c, #991b1b, #dc2626);
    border-radius: 25px 25px 0 0;
  }
  
  .feature-list::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(220, 38, 38, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(220, 38, 38, 0.03) 0%, transparent 50%);
    pointer-events: none;
  }
  
  .pro-features-box {
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 30%, #cbd5e1 70%, #94a3b8 100%);
    border: none;
    border-radius: 20px;
    padding: 40px;
    margin: 40px 0;
    position: relative;
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.06),
      0 0 30px rgba(220, 38, 38, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
    overflow: hidden;
  }
  
  .pro-features-box::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #dc2626, #b91c1c, #dc2626);
    border-radius: 20px 20px 0 0;
  }
  
  .pro-features-box::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 30% 70%, rgba(220, 38, 38, 0.02) 0%, transparent 60%),
      radial-gradient(circle at 70% 30%, rgba(220, 38, 38, 0.02) 0%, transparent 60%);
    pointer-events: none;
  }
  
  .feature-item {
    display: flex;
    align-items: center;
    margin: 18px 0;
    color: #374151;
    font-weight: 600;
    font-size: 16px;
    padding: 12px 0;
    border-bottom: 1px solid rgba(220, 38, 38, 0.1);
    transition: all 0.3s ease;
  }
  
  .feature-item:last-child {
    border-bottom: none;
  }
  
  .feature-item:hover {
    color: #dc2626;
    transform: translateX(10px);
  }
  
  .feature-icon {
    color: #dc2626;
    margin-right: 18px;
    font-size: 22px;
    width: 28px;
    text-align: center;
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
    border-radius: 50%;
    padding: 8px;
    box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);
    color: white;
  }
  
  .tip-box {
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%);
    border: none;
    border-radius: 0;
    padding: 35px;
    margin: 35px 0;
    position: relative;
    box-shadow: 0 15px 35px rgba(220, 38, 38, 0.3);
  }
  
  .tip-box::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, #ffffff, #fca5a5, #ffffff);
  }
  
  .warning-box {
    background: linear-gradient(135deg, #991b1b 0%, #7f1d1d 50%, #450a0a 100%);
    border: 2px solid #dc2626;
    border-radius: 0;
    padding: 35px;
    margin: 35px 0;
    position: relative;
    box-shadow: 0 15px 35px rgba(220, 38, 38, 0.3);
  }
  
  .warning-box::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, #dc2626, #ef4444, #dc2626);
  }
  
  .security-box {
    background: linear-gradient(135deg, #1f2937 0%, #111827 50%, #0f172a 100%);
    border: 2px solid #dc2626;
    border-radius: 0;
    padding: 35px;
    margin: 35px 0;
    position: relative;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
  }
  
  .security-box::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, #dc2626, #b91c1c, #dc2626);
  }
  
  .divider {
    border: none;
    height: 2px;
    background: linear-gradient(90deg, transparent, #dc2626, #b91c1c, #dc2626, transparent);
    margin: 50px 0;
  }
  
  .greeting {
    color: #dc2626;
    font-weight: 900;
    font-size: 32px;
    margin-bottom: 25px;
    text-shadow: 0 2px 4px rgba(220, 38, 38, 0.3);
  }
  
  .info-box {
    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 30%, #bbf7d0 70%, #86efac 100%);
    border: none;
    border-radius: 20px;
    padding: 45px;
    margin: 45px 0;
    position: relative;
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.06),
      0 0 30px rgba(22, 163, 74, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
    overflow: hidden;
  }
  
  .info-box::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #16a34a, #059669, #16a34a);
    border-radius: 20px 20px 0 0;
  }
  
  .info-box::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 25% 75%, rgba(22, 163, 74, 0.02) 0%, transparent 60%),
      radial-gradient(circle at 75% 25%, rgba(22, 163, 74, 0.02) 0%, transparent 60%);
    pointer-events: none;
  }
  
  .brand-name {
    color: #dc2626;
    font-weight: 900;
    font-size: 28px;
    margin-bottom: 10px;
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 2px 4px rgba(220, 38, 38, 0.3);
  }
  
  .brand-tagline {
    color: #9ca3af;
    font-size: 16px;
    margin-bottom: 10px;
    font-weight: 600;
  }
  
  .copyright {
    color: #6b7280;
    font-size: 14px;
    font-weight: 500;
  }
  
  .highlight {
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 900;
  }
  
  .emoji {
    font-size: 1.3em;
    margin-right: 10px;
  }
  
  .benefits-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin: 30px 0;
  }
  
  .benefit-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }
  
  .benefit-card:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px);
  }
  
  .benefit-content {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .benefit-icon {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    background: #dc2626;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 16px;
  }
  
  .benefit-text {
    flex: 1;
  }
  
  .benefit-check {
    flex-shrink: 0;
    color: #16a34a;
    font-size: 16px;
    font-weight: bold;
  }
  
  .info-cards-grid {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin: 30px 0;
  }
  
  .info-card-green {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 12px;
    padding: 16px;
  }
  
  .info-card-red {
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 12px;
    padding: 16px;
  }
  
  .info-card-content {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }
  
  .info-dot-green {
    width: 8px;
    height: 8px;
    background: #16a34a;
    border-radius: 50%;
    flex-shrink: 0;
    margin-top: 6px;
  }
  
  .info-dot-red {
    width: 8px;
    height: 8px;
    background: #dc2626;
    border-radius: 50%;
    flex-shrink: 0;
    margin-top: 6px;
  }
  
  .info-text {
    flex: 1;
  }
  
  @media (max-width: 600px) {
    .email-wrapper {
      padding: 20px 10px;
    }
    
    .container {
      border-radius: 0;
    }
    
    .header {
      padding: 60px 30px 40px;
    }
    
    .header h1 {
      font-size: 32px;
    }
    
    .content {
      padding: 40px 30px;
    }
    
    .logo {
      width: 100px;
      height: 100px;
      padding: 20px;
    }
    
    .logo img {
      width: 60px;
      height: 60px;
    }
  }
  
  @keyframes borderGlow {
    0%, 100% { opacity: 0.8; }
    50% { opacity: 1; }
  }
  
  @keyframes topGlow {
    0%, 100% { opacity: 0.7; }
    50% { opacity: 1; }
  }
  
  @keyframes backgroundPulse {
    0%, 100% { opacity: 0.8; }
    50% { opacity: 1; }
  }
  
  @keyframes textGlow {
    0%, 100% { text-shadow: 0 8px 16px rgba(0,0,0,0.5); }
    50% { text-shadow: 0 8px 16px rgba(220, 38, 38, 0.3); }
  }
  
  @keyframes glow {
    from { box-shadow: 0 0 20px rgba(220, 38, 38, 0.3); }
    to { box-shadow: 0 0 30px rgba(220, 38, 38, 0.6); }
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
`

// Templates de e-mail (design baseado nas imagens)
const EMAIL_TEMPLATES = {
  welcome: {
    subject: 'TubeMine - Bem-vindo! 🚀',
    html: (data: any) => `
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
          
          .bonus-section {
            background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
            border-radius: 20px;
            padding: 30px;
            margin: 30px 0;
            border: 1px solid rgba(220, 38, 38, 0.1);
            text-align: center;
          }
          
          .bonus-section h3 {
            color: #dc2626;
            font-size: 22px;
            font-weight: 700;
            margin-bottom: 15px;
          }
          
          .bonus-section p {
            color: #666;
            font-size: 16px;
            line-height: 1.6;
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
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            border-radius: 20px;
            padding: 30px;
            margin: 30px 0;
            border: 1px solid rgba(59, 130, 246, 0.1);
          }
          
          .next-steps h3 {
            color: #1e40af;
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 20px;
            text-align: center;
          }
          
          .steps-list {
            list-style: none;
            padding: 0;
          }
          
          .steps-list li {
            color: #374151;
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 12px;
            padding-left: 25px;
            position: relative;
          }
          
          .steps-list li:before {
            content: '🎯';
            position: absolute;
            left: 0;
            top: 0;
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
              <h1>Bem-vindo ao TubeMine!</h1>
              <p>Sua conta foi criada com sucesso</p>
            </div>
            <div class="content">
              <div class="greeting">Olá, ${data.name}! 🚀</div>
              
              <p class="intro-text">
                Seja bem-vindo ao <strong>TubeMine</strong>! Estamos muito felizes em tê-lo conosco. 
                O TubeMine é a plataforma mais avançada para análise e mineração de dados do YouTube, 
                desenvolvida para ajudar criadores de conteúdo a crescerem e otimizarem seus canais.
              </p>
              
              <div class="bonus-section">
                <h3>🎁 Bônus de Boas-vindas</h3>
                <p>Como presente especial, você tem direito a 1 busca grátis por dia em todos os recursos premium!</p>
              </div>
              
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
    `
  },

  password_reset: {
    subject: 'TubeMine - Recuperação de Senha 🔐',
    html: (data: any) => `
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
              
              <div class="greeting">Olá, ${data.name}! 🔐</div>
              
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
                  <a href="${data.resetUrl}" class="btn">
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
        <div class="email-wrapper">
          <div class="container">
            <div class="header">
              <div class="logo">
                <img src="https://i.postimg.cc/7htj7BtY/logo-tubeminer.png" alt="TubeMine Logo">
              </div>
              <h1>Assinatura PRO Confirmada!</h1>
              <p>Bem-vindo ao clube exclusivo da TubeMine</p>
            </div>
            <div class="content">
              <div class="greeting">Parabéns ${data.name}! 🎉</div>
              <p style="font-size: 16px; line-height: 1.7; color: #4b5563; margin-bottom: 25px;">
                Obrigado por escolher o TubeMine PRO. Agora você tem acesso completo a todas as 
                funcionalidades premium da nossa plataforma de analytics avançada.
              </p>
              
              <h3 style="color: #374151; margin: 30px 0 20px 0; font-size: 20px; font-weight: 700;">
                Seus novos benefícios incluem:
              </h3>
              
                             <div class="benefits-grid">
                 <div class="benefit-card">
                   <div class="benefit-content">
                     <div class="benefit-icon">▶️</div>
                     <div class="benefit-text">
                       <h4 style="color: #374151; font-weight: 600; margin: 0 0 2px 0; font-size: 14px;">Simulados do Plano PRO</h4>
                       <p style="color: #6b7280; font-size: 12px; margin: 0;">Acesso completo a todos os simulados premium</p>
                     </div>
                     <div class="benefit-check">✓</div>
                   </div>
                 </div>
                 
                 <div class="benefit-card">
                   <div class="benefit-content">
                     <div class="benefit-icon">📊</div>
                     <div class="benefit-text">
                       <h4 style="color: #374151; font-weight: 600; margin: 0 0 2px 0; font-size: 14px;">Dados Ilimitados</h4>
                       <p style="color: #6b7280; font-size: 12px; margin: 0;">Análise completa sem limitações</p>
                     </div>
                     <div class="benefit-check">✓</div>
                   </div>
                 </div>
                 
                 <div class="benefit-card">
                   <div class="benefit-content">
                     <div class="benefit-icon">👥</div>
                     <div class="benefit-text">
                       <h4 style="color: #374151; font-weight: 600; margin: 0 0 2px 0; font-size: 14px;">Todas as Métricas Avançadas</h4>
                       <p style="color: #6b7280; font-size: 12px; margin: 0;">Insights profundos sobre performance</p>
                     </div>
                     <div class="benefit-check">✓</div>
                   </div>
                 </div>
                 
                 <div class="benefit-card">
                   <div class="benefit-content">
                     <div class="benefit-icon">🛡️</div>
                     <div class="benefit-text">
                       <h4 style="color: #374151; font-weight: 600; margin: 0 0 2px 0; font-size: 14px;">Relatórios Completos</h4>
                       <p style="color: #6b7280; font-size: 12px; margin: 0;">Documentação detalhada dos resultados</p>
                     </div>
                     <div class="benefit-check">✓</div>
                   </div>
                 </div>
                 
                 <div class="benefit-card">
                   <div class="benefit-content">
                     <div class="benefit-icon">⚡</div>
                     <div class="benefit-text">
                       <h4 style="color: #374151; font-weight: 600; margin: 0 0 2px 0; font-size: 14px;">Suporte Prioritário</h4>
                       <p style="color: #6b7280; font-size: 12px; margin: 0;">Atendimento exclusivo para membros PRO</p>
                     </div>
                     <div class="benefit-check">✓</div>
                   </div>
                 </div>
               </div>
              
              <div style="text-align: center;">
                <a href="https://www.tubemine.com.br/buscador" class="btn">
                  <span class="emoji">🚀</span>COMEÇAR A ANALISAR
                </a>
              </div>
              
              <div class="info-cards-grid">
                <div class="info-card-green">
                  <div class="info-card-content">
                    <div class="info-dot-green"></div>
                    <div class="info-text">
                      <p style="color: #16a34a; font-weight: 600; margin: 0 0 4px 0; font-size: 14px;">Definições de Aprendizado:</p>
                      <p style="color: #059669; font-size: 12px; margin: 0 0 2px 0;">Planos e estratégias avançadas</p>
                      <p style="color: #047857; font-size: 11px; margin: 0;">Política atualizada disponível</p>
                    </div>
                  </div>
                </div>
                
                <div class="info-card-red">
                  <div class="info-card-content">
                    <div class="info-dot-red"></div>
                    <div class="info-text">
                      <p style="color: #dc2626; font-weight: 600; margin: 0 0 4px 0; font-size: 14px;">📹 YouTube PRO Desbloquado:</p>
                      <p style="color: #b91c1c; font-size: 12px; margin: 0 0 2px 0;">Análise avançada de performance</p>
                      <p style="color: #991b1b; font-size: 11px; margin: 0;">Relatórios detalhados disponíveis</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="footer">
              <div class="brand-name">TubeMine</div>
              <div class="brand-tagline">Vídeo Analytics Platform</div>
              <div class="copyright">© 2024 TubeMine. Todos os direitos reservados.</div>
            </div>
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
        <div class="email-wrapper">
          <div class="container">
            <div class="header">
              <div class="logo">
                <img src="https://i.postimg.cc/7htj7BtY/logo-tubeminer.png" alt="TubeMine Logo">
              </div>
              <h1>Solicitação de Suporte</h1>
              <p>Recebemos sua mensagem</p>
            </div>
            <div class="content">
              <div class="greeting">Olá ${data.name}! 👋</div>
              <p style="font-size: 16px; line-height: 1.7; color: #4b5563; margin-bottom: 25px;">
                Recebemos sua solicitação de suporte e nossa equipe está trabalhando para responder o mais rápido possível.
              </p>
              
              <div class="feature-list">
                <h3 style="color: #dc2626; margin: 0 0 20px 0; font-size: 20px; font-weight: 700;">
                  <span class="emoji">📋</span>Detalhes da Solicitação:
                </h3>
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
              
              <div class="info-box">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                  <span style="color: #374151; font-weight: 600;">Tempo de resposta:</span>
                  <span style="color: #059669; font-weight: 600;">Até 24 horas</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="color: #374151; font-weight: 600;">Status:</span>
                  <span style="color: #dc2626; font-weight: 600;">Em análise</span>
                </div>
              </div>
            </div>
            <div class="footer">
              <div class="brand-name">TubeMine</div>
              <div class="brand-tagline">Video Analytics Platform</div>
              <div class="copyright">© 2025 TubeMine. Todos os direitos reservados.</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  },

  thank_you_pro: {
    subject: 'TubeMine - Obrigado pelo Plano PRO! 💎',
    html: (data: any) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>TubeMine - Obrigado pelo Plano PRO!</title>
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
          
          .pro-badge {
            background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            margin-bottom: 20px;
            display: inline-block;
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
            gap: 15px;
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
              <h1>Obrigado pelo Plano PRO!</h1>
              <p>Você faz parte do nosso clube exclusivo</p>
            </div>
            <div class="content">
              <div style="text-align: center; margin-bottom: 20px;">
                <div class="pro-badge">💎 PLANO PRO ATIVADO</div>
              </div>
              
              <div class="greeting">Olá, ${data.name}! 💎</div>
              
              <p class="intro-text">
                Queremos agradecer por escolher o plano <strong>PRO</strong> do TubeMine. 
                Sua confiança em nossa plataforma significa muito para nós e agora você tem acesso completo a todos os recursos premium!
              </p>
              
              <div class="features-grid">
                <div class="feature-item">
                  <span class="feature-emoji">🚀</span>
                  <div class="feature-content">
                    <div class="feature-title">Buscas Ilimitadas</div>
                    <div class="feature-desc">Acesso completo sem restrições</div>
                  </div>
                </div>
                
                <div class="feature-item">
                  <span class="feature-emoji">⚡</span>
                  <div class="feature-content">
                    <div class="feature-title">Filtros Avançados</div>
                    <div class="feature-desc">Recursos exclusivos para análise</div>
                  </div>
                </div>
                
                <div class="feature-item">
                  <span class="feature-emoji">🛡️</span>
                  <div class="feature-content">
                    <div class="feature-title">Suporte Premium</div>
                    <div class="feature-desc">Atendimento prioritário 24/7</div>
                  </div>
                </div>
                
                <div class="feature-item">
                  <span class="feature-emoji">📈</span>
                  <div class="feature-content">
                    <div class="feature-title">Atualizações Exclusivas</div>
                    <div class="feature-desc">Novos recursos em primeira mão</div>
                  </div>
                </div>
              </div>
              
              <div style="background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border-radius: 15px; padding: 25px; margin: 30px 0; text-align: center;">
                <p style="color: #dc2626; font-weight: 600; margin: 0; font-size: 15px;">
                  💡 <strong>Dica Pro:</strong> Use os filtros de data para encontrar tendências específicas e otimizar seu conteúdo!
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

    // Agora podemos enviar para qualquer e-mail (domínio verificado)
    console.log(`📧 Enviando e-mail para: ${emailData.to}`)

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
