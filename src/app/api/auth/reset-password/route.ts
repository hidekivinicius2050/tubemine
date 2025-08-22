import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getDatabase } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token e nova senha são obrigatórios' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'A senha deve ter pelo menos 6 caracteres' },
        { status: 400 }
      )
    }

    const db = await getDatabase()

    // Buscar token válido
    const resetToken = await db.get(`
      SELECT prt.user_id, prt.token_hash, prt.expires_at, u.email, u.name
      FROM password_reset_tokens prt
      JOIN users u ON prt.user_id = u.id
      WHERE prt.expires_at > datetime('now')
      ORDER BY prt.created_at DESC
      LIMIT 1
    `)

    if (!resetToken) {
      return NextResponse.json(
        { error: 'Token inválido ou expirado' },
        { status: 400 }
      )
    }

    // Verificar se o token corresponde
    const isValidToken = await bcrypt.compare(token, resetToken.token_hash)
    if (!isValidToken) {
      return NextResponse.json(
        { error: 'Token inválido ou expirado' },
        { status: 400 }
      )
    }

    // Hash da nova senha
    const saltRounds = 12
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // Atualizar senha do usuário
    await db.run(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [passwordHash, resetToken.user_id]
    )

    // Remover token usado
    await db.run(
      'DELETE FROM password_reset_tokens WHERE user_id = ?',
      [resetToken.user_id]
    )

    // Invalidar todas as sessões do usuário
    await db.run(
      'DELETE FROM user_sessions WHERE user_id = ?',
      [resetToken.user_id]
    )

    console.log(`✅ Senha redefinida com sucesso para usuário: ${resetToken.email}`)

    return NextResponse.json({
      message: 'Senha redefinida com sucesso'
    })

  } catch (error) {
    console.error('Erro ao redefinir senha:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
