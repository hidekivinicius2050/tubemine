import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getDatabase } from '@/lib/database'
import { createFreeSubscription } from '@/lib/stripe'
import { sendEmail, isEmailConfigured } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Validações
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'A senha deve ter pelo menos 6 caracteres' },
        { status: 400 }
      )
    }

    const db = await getDatabase()

    // Verificar se o email já existe
    const existingUser = await db.get(
      'SELECT id FROM users WHERE email = ?',
      [email]
    )

    if (existingUser) {
      return NextResponse.json(
        { error: 'Este email já está cadastrado' },
        { status: 409 }
      )
    }

    // Hash da senha
    const saltRounds = 12
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // Inserir usuário
    const result = await db.run(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [name, email, passwordHash]
    )

    const userId = result.lastID

    // Criar assinatura gratuita inicial
    await createFreeSubscription(userId)

    // NÃO gerar token JWT automaticamente
    // O usuário deve fazer login manualmente após o registro

    // Enviar e-mail de boas-vindas
    if (isEmailConfigured()) {
      try {
        await sendEmail({
          to: email,
          toName: name,
          type: 'welcome',
          data: { name }
        })
        console.log('✅ E-mail de boas-vindas enviado para:', email)
      } catch (emailError) {
        console.error('❌ Erro ao enviar e-mail de boas-vindas:', emailError)
        // Não falha o registro se o e-mail falhar
      }
    }

    return NextResponse.json({
      message: 'Usuário registrado com sucesso! Faça login para continuar.',
      user: {
        id: userId,
        name,
        email,
        role: 'user'
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Erro no registro:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
