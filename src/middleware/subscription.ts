import { NextRequest, NextResponse } from 'next/server'
import { hasActiveSubscription, getTodaySearchCount } from '@/lib/stripe'

export async function requireActiveSubscriptionOrQuota(request: NextRequest) {
  try {
    // Extrair token do header Authorization
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token de autenticação necessário' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    
    // Verificar token e obter usuário
    const db = await import('@/lib/database').then(m => m.getDatabase())
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

    // Verificar se tem assinatura PRO ativa
    const hasPro = await hasActiveSubscription(userId)
    
    if (hasPro) {
      // Usuário PRO - permitir busca ilimitada
      return NextResponse.json({ 
        canSearch: true, 
        plan: 'pro',
        message: 'Assinatura PRO ativa'
      })
    }

    // Usuário gratuito - verificar limite diário
    const todaySearches = await getTodaySearchCount(userId)
    
    if (todaySearches >= 1) {
      // Limite atingido - bloquear busca
      return NextResponse.json({
        canSearch: false,
        plan: 'free',
        todaySearches,
        limit: 1,
        message: 'Limite diário atingido. Faça upgrade para PRO!'
      }, { status: 402 }) // Payment Required
    }

    // Ainda pode fazer busca gratuita
    return NextResponse.json({
      canSearch: true,
      plan: 'free',
      todaySearches,
      limit: 1,
      message: 'Busca gratuita disponível'
    })

  } catch (error) {
    console.error('Erro no middleware de assinatura:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
