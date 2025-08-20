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

    // Buscar todos os usuários com dados de assinatura e contagem de buscas
    const users = await db.all(`
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.role, 
        u.created_at, 
        u.updated_at,
        s.plan_type,
        s.status as subscription_status,
        s.valid_until,
        COUNT(sl.id) as search_count
      FROM users u
      LEFT JOIN subscriptions s ON u.id = s.user_id
      LEFT JOIN search_logs sl ON u.id = sl.user_id
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `)

    // Formatar dados
    const formattedUsers = users.map((user: any) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
      subscription: {
        plan_type: user.plan_type || 'free',
        status: user.subscription_status || 'active',
        valid_until: user.valid_until
      },
      search_count: user.search_count || 0
    }))

    return NextResponse.json({ users: formattedUsers })

  } catch (error) {
    console.error('Erro ao buscar usuários:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
