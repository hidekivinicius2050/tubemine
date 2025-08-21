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
    
    // Verificar se é admin
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

    const adminUser = await db.get(
      'SELECT role FROM users WHERE id = ?',
      [session.user_id]
    )

    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Acesso negado. Apenas administradores.' },
        { status: 403 }
      )
    }

    const userId = parseInt(params.userId)

    if (!userId || isNaN(userId)) {
      return NextResponse.json(
        { error: 'ID de usuário inválido' },
        { status: 400 }
      )
    }

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

    // Verificar se o usuário tem plano PRO ativo
    const subscription = await db.get(`
      SELECT id, plan_type, status, stripe_subscription_id
      FROM subscriptions 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT 1
    `, [userId])

    if (!subscription || subscription.plan_type !== 'pro' || subscription.status !== 'active') {
      return NextResponse.json(
        { error: 'Usuário não possui plano PRO ativo' },
        { status: 400 }
      )
    }

    // Remover plano PRO (marcar como inativo)
    await db.run(`
      UPDATE subscriptions 
      SET status = 'inactive', updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `, [userId])

    // Se tiver subscription_id do Stripe, cancelar no Stripe também
    if (subscription.stripe_subscription_id) {
      try {
        // Importar Stripe dinamicamente
        const { stripe } = await import('@/lib/stripe')
        
        if (stripe) {
          await stripe.subscriptions.cancel(subscription.stripe_subscription_id)
          console.log(`✅ Subscription ${subscription.stripe_subscription_id} cancelada no Stripe`)
        }
      } catch (stripeError) {
        console.error('❌ Erro ao cancelar no Stripe:', stripeError)
        // Não falha a operação se o Stripe der erro
      }
    }

    console.log(`✅ Plano PRO removido do usuário ${userId} (${user.email})`)

    return NextResponse.json({
      success: true,
      message: `Plano PRO removido com sucesso do usuário ${user.name}`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    })

  } catch (error) {
    console.error('❌ Erro ao remover plano PRO:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
