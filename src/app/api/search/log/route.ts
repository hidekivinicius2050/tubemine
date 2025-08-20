import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/database'
import { logSearch } from '@/lib/stripe'

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

    // Obter dados da busca
    const { searchQuery, resultsCount = 0 } = await request.json()


    if (!searchQuery) {
      return NextResponse.json(
        { error: 'Query de busca é obrigatória' },
        { status: 400 }
      )
    }

    // Registrar a busca
    await logSearch(userId, searchQuery, resultsCount)


    return NextResponse.json({
      success: true,
      message: 'Busca registrada com sucesso'
    })

  } catch (error) {
    console.error('Erro ao registrar busca:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
