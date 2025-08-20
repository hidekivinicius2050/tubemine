import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { getDatabase } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: 'Token não fornecido' },
        { status: 400 }
      )
    }

    const db = await getDatabase()

    // Verificar se o token existe no banco
    const session = await db.get(
      'SELECT user_id FROM user_sessions WHERE token = ?',
      [token]
    )

    if (!session) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      )
    }

    // Verificar se o token é válido
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any
      
      // Buscar dados do usuário
      const user = await db.get(
        'SELECT id, name, email, role FROM users WHERE id = ?',
        [session.user_id]
      )

      if (!user) {
        return NextResponse.json(
          { error: 'Usuário não encontrado' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        valid: true,
        user
      })

    } catch (jwtError) {
      // Token JWT inválido, remover do banco
      await db.run(
        'DELETE FROM user_sessions WHERE token = ?',
        [token]
      )

      return NextResponse.json(
        { error: 'Token expirado ou inválido' },
        { status: 401 }
      )
    }

  } catch (error) {
    console.error('Erro na verificação do token:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
