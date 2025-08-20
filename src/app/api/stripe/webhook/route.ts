import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { getDatabase } from '@/lib/database'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Assinatura do webhook não encontrada' },
      { status: 400 }
    )
  }

  let event

  if (!stripe) {
    console.error('Stripe não configurado')
    return NextResponse.json(
      { error: 'Stripe não configurado' },
      { status: 500 }
    )
  }

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    )
  } catch (err) {
    console.error('Erro na verificação da assinatura do webhook:', err)
    return NextResponse.json(
      { error: 'Assinatura inválida' },
      { status: 400 }
    )
  }

  const db = await getDatabase()

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object, db)
        break

      case 'invoice.paid':
        await handleInvoicePaid(event.data.object, db)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object, db)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object, db)
        break

      default:
        console.log(`Evento não tratado: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Erro ao processar webhook:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

async function handleCheckoutSessionCompleted(session: any, db: any) {
  const userId = parseInt(session.metadata?.user_id || '0')
  const customerId = session.customer
  const subscriptionId = session.subscription

  if (!userId || !customerId || !subscriptionId) {
    console.error('Dados insuficientes no checkout session')
    return
  }

  // Calcular data de validade (30 dias)
  const validUntil = new Date()
  validUntil.setDate(validUntil.getDate() + 30)

  // Criar ou atualizar assinatura
  await db.run(`
    INSERT OR REPLACE INTO subscriptions 
    (user_id, stripe_subscription_id, stripe_customer_id, status, plan_type, valid_until, updated_at)
    VALUES (?, ?, ?, 'active', 'pro', ?, CURRENT_TIMESTAMP)
  `, [userId, subscriptionId, customerId, validUntil.toISOString()])

  console.log(`Assinatura PRO ativada para usuário ${userId}`)
}

async function handleInvoicePaid(invoice: any, db: any) {
  const subscriptionId = invoice.subscription
  const customerId = invoice.customer

  if (!subscriptionId || !customerId) {
    console.error('Dados insuficientes no invoice')
    return
  }

  // Buscar usuário pelo customer_id
  const user = await db.get(
    'SELECT id FROM users WHERE stripe_customer_id = ?',
    [customerId]
  )

  if (!user) {
    console.error('Usuário não encontrado para customer_id:', customerId)
    return
  }

  // Calcular nova data de validade (30 dias)
  const validUntil = new Date()
  validUntil.setDate(validUntil.getDate() + 30)

  // Atualizar assinatura
  await db.run(`
    UPDATE subscriptions 
    SET status = 'active', valid_until = ?, updated_at = CURRENT_TIMESTAMP
    WHERE stripe_subscription_id = ?
  `, [validUntil.toISOString(), subscriptionId])

  console.log(`Renovação PRO processada para usuário ${user.id}`)
}

async function handleSubscriptionUpdated(subscription: any, db: any) {
  const subscriptionId = subscription.id
  const customerId = subscription.customer
  const status = subscription.status

  if (!subscriptionId || !customerId) {
    console.error('Dados insuficientes na subscription')
    return
  }

  // Buscar usuário pelo customer_id
  const user = await db.get(
    'SELECT id FROM users WHERE stripe_customer_id = ?',
    [customerId]
  )

  if (!user) {
    console.error('Usuário não encontrado para customer_id:', customerId)
    return
  }

  if (status === 'active') {
    // Calcular data de validade (30 dias)
    const validUntil = new Date()
    validUntil.setDate(validUntil.getDate() + 30)

    await db.run(`
      UPDATE subscriptions 
      SET status = 'active', valid_until = ?, updated_at = CURRENT_TIMESTAMP
      WHERE stripe_subscription_id = ?
    `, [validUntil.toISOString(), subscriptionId])
  } else if (status === 'canceled' || status === 'unpaid') {
    await db.run(`
      UPDATE subscriptions 
      SET status = 'inactive', updated_at = CURRENT_TIMESTAMP
      WHERE stripe_subscription_id = ?
    `, [subscriptionId])
  }

  console.log(`Assinatura ${subscriptionId} atualizada para status: ${status}`)
}

async function handleSubscriptionDeleted(subscription: any, db: any) {
  const subscriptionId = subscription.id

  if (!subscriptionId) {
    console.error('Subscription ID não encontrado')
    return
  }

  // Marcar assinatura como inativa
  await db.run(`
    UPDATE subscriptions 
    SET status = 'inactive', updated_at = CURRENT_TIMESTAMP
    WHERE stripe_subscription_id = ?
  `, [subscriptionId])

  console.log(`Assinatura ${subscriptionId} cancelada`)
}
