import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getDatabase } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Login API chamada')
    
    // Tentar diferentes formas de obter o body
    let data: any = {}
    
    try {
      // Primeiro, tentar como JSON normal
      data = await request.json()
      console.log('✅ JSON parseado com sucesso:', { email: data.email, password: data.password ? '***' : 'undefined' })
    } catch (jsonError) {
      console.log('❌ Erro no JSON.parse, tentando como texto...')
      
      try {
        // Se falhar, tentar como texto e fazer parse manual
        const bodyText = await request.text()
        console.log('📝 Body como texto:', bodyText)
        
        // Tentar limpar o JSON se estiver malformado
        let cleanBody = bodyText
        
        // Remover barras invertidas extras
        cleanBody = cleanBody.replace(/\\:/g, ':')
        cleanBody = cleanBody.replace(/\\,/g, ',')
        cleanBody = cleanBody.replace(/\\"/g, '"')
        
        console.log('🧹 Body limpo:', cleanBody)
        
        data = JSON.parse(cleanBody)
        console.log('✅ JSON limpo parseado:', { email: data.email, password: data.password ? '***' : 'undefined' })
      } catch (textError) {
        console.error('❌ Erro ao fazer parse do texto:', textError)
        return NextResponse.json(
          { error: 'Formato de dados inválido' },
          { status: 400 }
        )
      }
    }

    const { email, password } = data

    // Validações
    if (!email || !password) {
      console.log('❌ Email ou senha faltando')
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    console.log('📧 Email:', email)
    console.log('🔐 Senha:', password ? '***' : 'undefined')

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
        { error: 'Email ou senha inválidos' },
        { status: 401 }
      )
    }

    console.log('✅ Usuário encontrado:', user.email, user.role)

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.password_hash)

    if (!isValidPassword) {
      console.log('❌ Senha inválida')
      return NextResponse.json(
        { error: 'Email ou senha inválidos' },
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
