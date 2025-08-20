import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/database'
// import { sendSubscriptionUpgradedEmail, isEmailConfigured } from '@/lib/email' // Desabilitado para economizar créditos

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

    // Criar assinatura PRO (30 dias)
    const validUntil = new Date()
    validUntil.setDate(validUntil.getDate() + 30)

    await db.run(`
      INSERT OR REPLACE INTO subscriptions (user_id, plan_type, status, valid_until, created_at, updated_at)
      VALUES (?, 'pro', 'active', ?, datetime('now'), datetime('now'))
    `, [userId, validUntil.toISOString()])

    // E-mail de upgrade desabilitado para economizar créditos
    // if (isEmailConfigured()) {
    //   try {
    //     await sendSubscriptionUpgradedEmail(user.email, user.name, validUntil.toISOString())
    //     console.log('✅ E-mail de upgrade enviado para:', user.email)
    //   } catch (emailError) {
    //     console.error('❌ Erro ao enviar e-mail de upgrade:', emailError)
    //     // Não falha o upgrade se o e-mail falhar
    //   }
    // }

    return NextResponse.json({
      success: true,
      message: `Usuário ${user.name} foi atualizado para Premium`
    })

  } catch (error) {
    console.error('Erro ao fazer upgrade do usuário:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
