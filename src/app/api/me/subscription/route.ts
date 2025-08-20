import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/database'
import { hasActiveSubscription, getTodaySearchCount } from '@/lib/stripe'

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

    // Obter dados da assinatura
    const subscription = await db.get(`
      SELECT status, plan_type, valid_until, created_at, updated_at
      FROM subscriptions 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT 1
    `, [userId])

    // Verificar se tem assinatura PRO ativa
    const hasPro = await hasActiveSubscription(userId)
    
    // Contar buscas de hoje
    const todaySearches = await getTodaySearchCount(userId)



    // Determinar status atual
    let currentPlan = 'free'
    let canSearch = true
    let message = 'Busca gratuita disponível'
    let limit = 1
    let remaining = 1 - todaySearches

    if (hasPro) {
      currentPlan = 'pro'
      canSearch = true
      message = 'Assinatura PRO ativa - Buscas ilimitadas'
      limit = -1 // Ilimitado
      remaining = -1
    } else if (todaySearches >= 1) {
      canSearch = false
      message = 'Limite diário atingido. Faça upgrade para PRO!'
      remaining = 0
    }

    return NextResponse.json({
      plan: currentPlan,
      canSearch,
      message,
      todaySearches,
      limit,
      remaining,
      subscription: subscription ? {
        status: subscription.status,
        planType: subscription.plan_type,
        validUntil: subscription.valid_until,
        createdAt: subscription.created_at,
        updatedAt: subscription.updated_at
      } : null
    })

  } catch (error) {
    console.error('Erro ao verificar assinatura:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
