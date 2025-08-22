import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { getDatabase } from '@/lib/database'
import { sendEmail, isEmailConfigured } from '@/lib/email'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: NextRequest) {
  try {
    const { category, subject, message } = await request.json()

    // Validar dados de entrada
    if (!category || !subject || !message) {
      return NextResponse.json(
        { message: 'Categoria, assunto e mensagem são obrigatórios.' },
        { status: 400 }
      )
    }

    if (subject.length < 3) {
      return NextResponse.json(
        { message: 'O assunto deve ter pelo menos 3 caracteres.' },
        { status: 400 }
      )
    }

    if (message.length < 10) {
      return NextResponse.json(
        { message: 'A mensagem deve ter pelo menos 10 caracteres.' },
        { status: 400 }
      )
    }

    if (message.length > 1000) {
      return NextResponse.json(
        { message: 'A mensagem deve ter no máximo 1000 caracteres.' },
        { status: 400 }
      )
    }

    // Obter token do header Authorization
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Token de autenticação não fornecido.' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)

    // Verificar token
    let decoded: any
    try {
      decoded = jwt.verify(token, JWT_SECRET)
    } catch (error) {
      return NextResponse.json(
        { message: 'Token inválido ou expirado.' },
        { status: 401 }
      )
    }

    const db = await getDatabase()

    // Buscar usuário
    const user = await db.get(
      'SELECT * FROM users WHERE id = ?',
      [decoded.userId]
    )

    if (!user) {
      return NextResponse.json(
        { message: 'Usuário não encontrado.' },
        { status: 404 }
      )
    }

    // Criar tabela de suporte se não existir
    await db.run(`
      CREATE TABLE IF NOT EXISTS support_tickets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        category TEXT NOT NULL,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        status TEXT DEFAULT 'open',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `)

    // Inserir ticket de suporte
    const result = await db.run(
      'INSERT INTO support_tickets (user_id, category, subject, message) VALUES (?, ?, ?, ?)',
      [user.id, category, subject, message]
    )

    // Log da mensagem de suporte (para desenvolvimento)
    console.log('=== NOVA MENSAGEM DE SUPORTE ===')
    console.log('Ticket ID:', result.lastID)
    console.log('Usuário:', user.name, `(${user.email})`)
    console.log('Categoria:', category)
    console.log('Assunto:', subject)
    console.log('Mensagem:', message)
    console.log('Data:', new Date().toISOString())
    console.log('================================')

    // Enviar e-mail de confirmação para o usuário
    if (isEmailConfigured()) {
      try {
        await sendEmail({
          to: user.email,
          toName: user.name,
          type: 'support_request',
          data: {
            name: user.name,
            subject: subject,
            message: message,
            ticketId: result.lastID
          }
        })
        console.log('✅ E-mail de confirmação de suporte enviado para:', user.email)
      } catch (emailError) {
        console.error('❌ Erro ao enviar e-mail de confirmação de suporte:', emailError)
      }
    }

    return NextResponse.json(
      { 
        message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
        ticketId: result.lastID
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Erro ao enviar mensagem de suporte:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor.' },
      { status: 500 }
    )
  }
}

// Função para buscar tickets do usuário (opcional)
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Token de autenticação não fornecido.' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)

    let decoded: any
    try {
      decoded = jwt.verify(token, JWT_SECRET)
    } catch (error) {
      return NextResponse.json(
        { message: 'Token inválido ou expirado.' },
        { status: 401 }
      )
    }

    const db = await getDatabase()

    // Verificar se a tabela existe
    const tableExists = await db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='support_tickets'"
    )

    if (!tableExists) {
      return NextResponse.json({ tickets: [] }, { status: 200 })
    }

    // Buscar tickets do usuário
    const tickets = await db.all(
      'SELECT id, category, subject, status, created_at FROM support_tickets WHERE user_id = ? ORDER BY created_at DESC',
      [decoded.userId]
    )

    return NextResponse.json({ tickets }, { status: 200 })

  } catch (error) {
    console.error('Erro ao buscar tickets:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor.' },
      { status: 500 }
    )
  }
}
