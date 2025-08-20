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

    // Buscar estatísticas
    const today = new Date().toISOString().split('T')[0]
    const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]

    // Total de usuários
    const totalUsersResult = await db.get('SELECT COUNT(*) as count FROM users')
    const totalUsers = totalUsersResult?.count || 0

    // Usuários ativos (com sessão nos últimos 30 dias)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const activeUsersResult = await db.get(`
      SELECT COUNT(DISTINCT user_id) as count 
      FROM user_sessions 
      WHERE created_at > ?
    `, [thirtyDaysAgo])
    const activeUsers = activeUsersResult?.count || 0

    // Usuários premium
    const premiumUsersResult = await db.get(`
      SELECT COUNT(*) as count 
      FROM subscriptions 
      WHERE plan_type = 'pro' AND status = 'active' AND valid_until > datetime('now')
    `)
    const premiumUsers = premiumUsersResult?.count || 0

    // Total de buscas
    const totalSearchesResult = await db.get('SELECT COUNT(*) as count FROM search_logs')
    const totalSearches = totalSearchesResult?.count || 0

    // Buscas de hoje
    const todaySearchesResult = await db.get(`
      SELECT COUNT(*) as count 
      FROM search_logs 
      WHERE DATE(created_at) = ?
    `, [today])
    const todaySearches = todaySearchesResult?.count || 0

    // Receita mensal (usuários premium * R$ 19,90)
    const monthlyRevenue = premiumUsers * 19.90

    return NextResponse.json({
      totalUsers,
      activeUsers,
      premiumUsers,
      totalSearches,
      todaySearches,
      monthlyRevenue
    })

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
