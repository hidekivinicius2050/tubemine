import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { getDatabase } from '@/lib/database'
import { sendEmail, isEmailConfigured } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      )
    }

    const db = await getDatabase()

    // Verificar se o usuário existe
    const user = await db.get(
      'SELECT id, name, email FROM users WHERE email = ?',
      [email]
    )

    if (!user) {
      // Por segurança, não revelar se o email existe ou não
      return NextResponse.json({
        message: 'Se o email estiver cadastrado, você receberá um link de recuperação'
      })
    }

    // Gerar token único
    const token = crypto.randomBytes(32).toString('hex')
    const tokenHash = await bcrypt.hash(token, 12)

    // Definir expiração (1 hora)
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 1)

    // Salvar token no banco
    await db.run(`
      INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
      VALUES (?, ?, ?)
    `, [user.id, tokenHash, expiresAt.toISOString()])

    // URL de reset
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.tubemine.com.br'}/reset-password?token=${token}`

    // Enviar email se configurado
    if (isEmailConfigured()) {
      try {
        await sendEmail({
          to: email,
          toName: user.name,
          type: 'password_reset',
          data: {
            name: user.name,
            resetUrl
          }
        })
        console.log('✅ E-mail de recuperação enviado para:', email)
      } catch (emailError) {
        console.error('❌ Erro ao enviar e-mail de recuperação:', emailError)
        // Não falha se o email der erro
      }
    }

    return NextResponse.json({
      message: 'Se o email estiver cadastrado, você receberá um link de recuperação'
    })

  } catch (error) {
    console.error('Erro na recuperação de senha:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
