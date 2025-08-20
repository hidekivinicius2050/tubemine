import { NextRequest, NextResponse } from 'next/server'
import { stripe, STRIPE_CONFIG, getOrCreateCustomer } from '@/lib/stripe'
import { getDatabase } from '@/lib/database'

export async function POST(request: NextRequest) {
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
    const userSession = await db.get(
      'SELECT user_id FROM user_sessions WHERE token = ?',
      [token]
    )

    if (!userSession) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      )
    }

    const userId = userSession.user_id

    // Obter dados do usuário
    const user = await db.get(
      'SELECT name, email FROM users WHERE id = ?',
      [userId]
    )

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Criar ou obter customer do Stripe
    const customerId = await getOrCreateCustomer(userId, user.email, user.name)

    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe não configurado' },
        { status: 500 }
      )
    }

    // Criar sessão de checkout
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: STRIPE_CONFIG.PRO_PLAN_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${request.nextUrl.origin}/buscador?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/buscador?canceled=true`,
      metadata: {
        user_id: userId.toString(),
      },
      subscription_data: {
        metadata: {
          user_id: userId.toString(),
        },
      },
    })

    return NextResponse.json({
      url: session.url,
      sessionId: session.id
    })

  } catch (error) {
    console.error('Erro ao criar sessão de checkout:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
