#!/bin/bash

echo "🔧 Aplicando correção na API de usuários..."

# Conectar ao servidor e aplicar correção
ssh root@72.60.10.222 << 'EOF'
cd /var/www/tubemine

echo "📋 Fazendo backup do arquivo atual..."
cp src/app/api/admin/users/route.ts src/app/api/admin/users/route.ts.backup

echo "🔧 Aplicando correção..."
cat > src/app/api/admin/users/route.ts << 'ROUTE_EOF'
import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/database'

export async function GET(request: NextRequest) {
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

    // Verificar se é admin
    const user = await db.get(
      'SELECT role FROM users WHERE id = ?',
      [userId]
    )

    if (user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Acesso negado. Apenas administradores.' },
        { status: 403 }
      )
    }

    // Buscar todos os usuários
    const users = await db.all(`
      SELECT
        u.id,
        u.name,
        u.email,
        u.role,
        u.created_at,
        u.updated_at,
        COUNT(sl.id) as search_count
      FROM users u
      LEFT JOIN search_logs sl ON u.id = sl.user_id
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `)

    // Buscar assinaturas mais recentes para cada usuário
    const subscriptions = await db.all(`
      SELECT 
        s1.user_id,
        s1.plan_type,
        s1.status,
        s1.valid_until
      FROM subscriptions s1
      LEFT JOIN subscriptions s2 ON s1.user_id = s2.user_id AND s1.created_at < s2.created_at
      WHERE s2.user_id IS NULL
    `)

    // Criar mapa de assinaturas
    const subscriptionMap = new Map()
    subscriptions.forEach((sub: any) => {
      subscriptionMap.set(sub.user_id, {
        plan_type: sub.plan_type,
        status: sub.status,
        valid_until: sub.valid_until
      })
    })

    // Formatar dados
    const formattedUsers = users.map((user: any) => {
      const subscription = subscriptionMap.get(user.id) || {
        plan_type: 'free',
        status: 'active',
        valid_until: null
      }
      
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
        subscription,
        search_count: user.search_count || 0
      }
    })

    return NextResponse.json({ users: formattedUsers })

  } catch (error) {
    console.error('Erro ao buscar usuários:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
ROUTE_EOF

echo "🔄 Reiniciando aplicação..."
pm2 restart tubemine-saas

echo "⏳ Aguardando aplicação inicializar..."
sleep 5

echo "🔑 Obtendo novo token..."
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@tubemine.com","password":"b50x20Hi@"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

echo "🧪 Testando API de usuários..."
curl -s -X GET http://localhost:3000/api/admin/users -H "Authorization: Bearer $TOKEN" | grep -A 10 -B 5 "hideki"

echo "✅ Correção aplicada e testada!"
EOF

echo "🎉 Processo concluído!"
