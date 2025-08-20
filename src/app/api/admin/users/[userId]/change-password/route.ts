import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/database'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // Verificar autenticação do admin
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token de autenticação necessário' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any
    
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Acesso negado. Apenas administradores podem alterar senhas.' },
        { status: 403 }
      )
    }

    const { newPassword } = await request.json()
    const userId = parseInt(params.userId)

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: 'A nova senha deve ter pelo menos 6 caracteres' },
        { status: 400 }
      )
    }

    const db = await getDatabase()

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

    // Hash da nova senha
    const saltRounds = 12
    const passwordHash = await bcrypt.hash(newPassword, saltRounds)

    // Atualizar senha do usuário
    await db.run(
      'UPDATE users SET password_hash = ?, updated_at = datetime("now") WHERE id = ?',
      [passwordHash, userId]
    )

    // Remover todas as sessões ativas do usuário (forçar novo login)
    await db.run(
      'DELETE FROM user_sessions WHERE user_id = ?',
      [userId]
    )

    console.log(`✅ Admin alterou senha do usuário: ${user.email} (ID: ${userId})`)

    return NextResponse.json({
      message: 'Senha alterada com sucesso. O usuário precisará fazer login novamente.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    })

  } catch (error) {
    console.error('❌ Erro ao alterar senha do usuário:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
