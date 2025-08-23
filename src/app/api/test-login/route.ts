import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getDatabase } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Test Login API chamada')
    
    // Dados fixos para teste
    const email = 'admin@tubemine.com'
    const password = 'admin123'
    
    console.log('📧 Email:', email)
    console.log('🔐 Senha:', password)

    const db = await getDatabase()
    console.log('✅ Banco conectado')

    // Buscar usuário
    const user = await db.get(
      'SELECT id, name, email, password_hash, role FROM users WHERE email = ?',
      [email]
    )

    if (!user) {
      console.log('❌ Usuário não encontrado')
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    console.log('✅ Usuário encontrado:', user.email, user.role)

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.password_hash)

    if (!isValidPassword) {
      console.log('❌ Senha inválida')
      return NextResponse.json(
        { error: 'Senha inválida' },
        { status: 401 }
      )
    }

    console.log('✅ Senha válida')

    // Gerar token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )

    // Salvar sessão
    await db.run(
      'INSERT INTO user_sessions (user_id, token) VALUES (?, ?)',
      [user.id, token]
    )

    console.log('✅ Login bem-sucedido para:', user.email)

    return NextResponse.json({
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })

  } catch (error) {
    console.error('❌ Erro no login:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
