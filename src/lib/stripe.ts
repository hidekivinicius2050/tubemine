import Stripe from 'stripe'

// Configuração do Stripe (apenas se a chave estiver configurada)
export const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-07-30.basil',
    })
  : null

// Configurações dos planos
export const STRIPE_CONFIG = {
  PRO_PLAN_PRICE_ID: process.env.STRIPE_PRO_PLAN_PRICE_ID || 'price_1RuR47HXe3ew16y7eqYWC47g', // Price ID correto do produto prod_Sq7I8ieIejfhTt
  PRODUCT_ID: 'prod_Sq7I8ieIejfhTt', // ID do produto fornecido
  CURRENCY: 'brl',
  PRO_PLAN_AMOUNT: 1990, // R$ 19,90 em centavos
}

// Função para criar ou recuperar customer
export async function getOrCreateCustomer(userId: number, email: string, name: string) {
  const db = await import('./database').then(m => m.getDatabase())
  
  // Verificar se já existe um customer_id para este usuário
  const existingUser = await db.get(
    'SELECT stripe_customer_id FROM users WHERE id = ?',
    [userId]
  )

  if (existingUser?.stripe_customer_id) {
    return existingUser.stripe_customer_id
  }

  // Se o Stripe não estiver configurado, retornar null
  if (!stripe) {
    console.log('⚠️ Stripe não configurado, pulando criação de customer')
    return null
  }

  try {
    // Criar novo customer no Stripe
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        user_id: userId.toString()
      }
    })

    // Salvar customer_id no banco
    await db.run(
      'UPDATE users SET stripe_customer_id = ? WHERE id = ?',
      [customer.id, userId]
    )

    return customer.id
  } catch (error) {
    console.error('❌ Erro ao criar customer no Stripe:', error)
    return null
  }
}

// Função para verificar se usuário tem assinatura ativa
export async function hasActiveSubscription(userId: number): Promise<boolean> {
  const db = await import('./database').then(m => m.getDatabase())
  
  const subscription = await db.get(`
    SELECT status, valid_until, plan_type 
    FROM subscriptions 
    WHERE user_id = ? 
    ORDER BY created_at DESC 
    LIMIT 1
  `, [userId])

  if (!subscription) {
    return false
  }

  // Verificar se é PRO e está válido
  if (subscription.plan_type === 'pro' && subscription.status === 'active') {
    const validUntil = new Date(subscription.valid_until)
    return validUntil > new Date()
  }

  return false
}

// Função para contar buscas do usuário hoje
export async function getTodaySearchCount(userId: number): Promise<number> {
  const db = await import('./database').then(m => m.getDatabase())
  
  const today = new Date().toISOString().split('T')[0]
  
  const result = await db.get(`
    SELECT COUNT(*) as count 
    FROM search_logs 
    WHERE user_id = ? 
    AND DATE(created_at) = ?
  `, [userId, today])

  const count = result?.count || 0
  
  return count
}

// Função para registrar uma busca
export async function logSearch(userId: number, searchQuery: string, resultsCount: number = 0) {
  const db = await import('./database').then(m => m.getDatabase())
  
  await db.run(`
    INSERT INTO search_logs (user_id, search_query, results_count) 
    VALUES (?, ?, ?)
  `, [userId, searchQuery, resultsCount])
}

// Função para criar assinatura inicial gratuita
export async function createFreeSubscription(userId: number) {
  const db = await import('./database').then(m => m.getDatabase())
  
  // Verificar se já existe uma assinatura
  const existing = await db.get(
    'SELECT id FROM subscriptions WHERE user_id = ?',
    [userId]
  )

  if (!existing) {
    await db.run(`
      INSERT INTO subscriptions (user_id, status, plan_type) 
      VALUES (?, 'active', 'free')
    `, [userId])
  }
}
