import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/database'

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // Verificar autenticação
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token de autenticação necessário' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const db = await getDatabase()
    
    // Verificar token e obter usuário
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

    const adminUserId = session.user_id

    // Verificar se é admin
    const adminUser = await db.get(
      'SELECT role FROM users WHERE id = ?',
      [adminUserId]
    )

    if (adminUser?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Acesso negado. Apenas administradores.' },
        { status: 403 }
      )
    }

    const userId = parseInt(params.userId)

    // Verificar se o usuário existe
    const user = await db.get(
      'SELECT id, name, email FROM users WHERE id = ?',
      [userId]
    )

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Suspender assinatura
    await db.run(`
      UPDATE subscriptions 
      SET status = 'suspended', updated_at = datetime('now')
      WHERE user_id = ?
    `, [userId])

    // Remover sessões ativas
    await db.run(`
      DELETE FROM user_sessions 
      WHERE user_id = ?
    `, [userId])

    return NextResponse.json({
      success: true,
      message: `Usuário ${user.name} foi suspenso`
    })

  } catch (error) {
    console.error('Erro ao suspender usuário:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
