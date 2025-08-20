import AWS from 'aws-sdk'

// Configuração do AWS SES
const ses = new AWS.SES({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1',
  apiVersion: '2010-12-01'
})

// Configurações de e-mail
const EMAIL_CONFIG = {
  FROM_EMAIL: process.env.FROM_EMAIL || 'contact@tubemine.com.br',
  FROM_NAME: process.env.FROM_NAME || 'TubeMine',
  REPLY_TO: process.env.REPLY_TO || 'contact@tubemine.com.br'
}

// Tipos de e-mail (apenas reset de senha para economizar créditos)
export type EmailType = 
  | 'password_reset'

// Interface para dados do e-mail
export interface EmailData {
  to: string
  toName?: string
  type: EmailType
  data?: Record<string, any>
}

// Templates de e-mail (apenas reset de senha para economizar créditos)
const EMAIL_TEMPLATES = {
  password_reset: {
    subject: 'Redefinição de Senha - TubeMine 🔐',
    html: (data: any) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Redefinição de Senha</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .btn { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Redefinição de Senha</h1>
            <p>Você solicitou uma nova senha</p>
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

    const params = {
      Source: `${EMAIL_CONFIG.FROM_NAME} <${EMAIL_CONFIG.FROM_EMAIL}>`,
      Destination: {
        ToAddresses: [emailData.to]
      },
      Message: {
        Subject: {
          Data: template.subject,
          Charset: 'UTF-8'
        },
        Body: {
          Html: {
            Data: template.html({ ...emailData.data, name: emailData.toName || emailData.to.split('@')[0] }),
            Charset: 'UTF-8'
          }
        }
      },
      ReplyToAddresses: [EMAIL_CONFIG.REPLY_TO]
    }

    const result = await ses.sendEmail(params).promise()
    console.log('✅ E-mail enviado com sucesso:', result.MessageId)
    return true

  } catch (error) {
    console.error('❌ Erro ao enviar e-mail:', error)
    return false
  }
}

// Função específica para reset de senha (única função ativa para economizar créditos)
export async function sendPasswordResetEmail(email: string, name: string, resetToken: string): Promise<boolean> {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`
  return sendEmail({
    to: email,
    toName: name,
    type: 'password_reset',
    data: { resetUrl }
  })
}

// Função para verificar se o SES está configurado
export function isEmailConfigured(): boolean {
  return !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && process.env.FROM_EMAIL)
}
