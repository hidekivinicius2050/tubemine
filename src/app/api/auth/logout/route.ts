import { NextRequest, NextResponse } from 'next/server'
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

    // Remover sessão do banco
    await db.run('DELETE FROM user_sessions WHERE token = ?', [token])

    return NextResponse.json({
      message: 'Logout realizado com sucesso'
    })

  } catch (error) {
    console.error('Erro no logout:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
