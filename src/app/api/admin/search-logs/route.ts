import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/database'

export async function GET(request: NextRequest) {
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

    const userId = session.user_id

    // Verificar se é admin
    const user = await db.get(
      'SELECT role FROM users WHERE id = ?',
      [userId]
    )

    if (user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Acesso negado. Apenas administradores.' },
        { status: 403 }
      )
    }

    // Buscar logs de busca com nome do usuário
    const logs = await db.all(`
      SELECT 
        sl.id,
        sl.user_id,
        sl.search_query,
        sl.results_count,
        sl.created_at,
        u.name as user_name
      FROM search_logs sl
      JOIN users u ON sl.user_id = u.id
      ORDER BY sl.created_at DESC
      LIMIT 100
    `)

    return NextResponse.json({ logs })

  } catch (error) {
    console.error('Erro ao buscar logs de busca:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
