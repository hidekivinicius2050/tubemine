import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getDatabase } from '@/lib/database'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: NextRequest) {
  try {
    const { currentPassword, newPassword } = await request.json()

    // Validar dados de entrada
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: 'Senha atual e nova senha são obrigatórias.' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { message: 'A nova senha deve ter pelo menos 6 caracteres.' },
        { status: 400 }
      )
    }

    // Obter token do header Authorization
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Token de autenticação não fornecido.' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)

    // Verificar token
    let decoded: any
    try {
      decoded = jwt.verify(token, JWT_SECRET)
    } catch (error) {
      return NextResponse.json(
        { message: 'Token inválido ou expirado.' },
        { status: 401 }
      )
    }

    const db = await getDatabase()

    // Buscar usuário
    const user = await db.get(
      'SELECT * FROM users WHERE id = ?',
      [decoded.userId]
    )

    if (!user) {
      return NextResponse.json(
        { message: 'Usuário não encontrado.' },
        { status: 404 }
      )
    }

    // Verificar senha atual
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password)
    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { message: 'Senha atual incorreta.' },
        { status: 400 }
      )
    }

    // Verificar se a nova senha é diferente da atual
    const isNewPasswordSame = await bcrypt.compare(newPassword, user.password)
    if (isNewPasswordSame) {
      return NextResponse.json(
        { message: 'A nova senha deve ser diferente da senha atual.' },
        { status: 400 }
      )
    }

    // Hash da nova senha
    const hashedNewPassword = await bcrypt.hash(newPassword, 12)

    // Atualizar senha no banco
    await db.run(
      'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [hashedNewPassword, user.id]
    )

    // Invalidar todas as sessões do usuário (forçar logout em todos os dispositivos)
    await db.run(
      'DELETE FROM user_sessions WHERE user_id = ?',
      [user.id]
    )

    return NextResponse.json(
      { message: 'Senha alterada com sucesso! Você será redirecionado para fazer login novamente.' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Erro ao alterar senha:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor.' },
      { status: 500 }
    )
  }
}
