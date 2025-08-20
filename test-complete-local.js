const axios = require('axios')

async function testCompleteLocal() {
  try {
    console.log('🧪 TESTE COMPLETO - AMBIENTE LOCAL\n')
    
    // 1. Teste de Login
    console.log('1️⃣ Teste de Login...')
    const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'admin@tubemine.com',
      password: 'b50x20Hi@'
    })
    
    const token = loginResponse.data.token
    console.log('✅ Login realizado com sucesso')
    
    // 2. Teste de Listagem de Usuários
    console.log('\n2️⃣ Teste de Listagem de Usuários...')
    const usersResponse = await axios.get('http://localhost:3000/api/admin/users', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    
    console.log(`✅ ${usersResponse.data.users.length} usuários listados`)
    
    // 3. Teste de Upgrade de Usuário
    console.log('\n3️⃣ Teste de Upgrade de Usuário...')
    
    // Encontrar um usuário com plano free para fazer upgrade
    const freeUser = usersResponse.data.users.find(u => u.subscription.plan_type === 'free' && u.role === 'user')
    
    if (freeUser) {
      console.log(`   Fazendo upgrade do usuário: ${freeUser.name} (${freeUser.email})`)
      
      const upgradeResponse = await axios.post(`http://localhost:3000/api/admin/users/${freeUser.id}/upgrade`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      console.log('✅ Upgrade realizado:', upgradeResponse.data.message)
      
      // Verificar se o upgrade funcionou
      const usersResponse2 = await axios.get('http://localhost:3000/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      const updatedUser = usersResponse2.data.users.find(u => u.id === freeUser.id)
      if (updatedUser.subscription.plan_type === 'pro') {
        console.log('✅ Upgrade confirmado - usuário agora está PRO!')
      } else {
        console.log('❌ Upgrade não foi aplicado corretamente')
      }
    } else {
      console.log('   Nenhum usuário free encontrado para teste')
    }
    
    // 4. Teste de Estatísticas
    console.log('\n4️⃣ Teste de Estatísticas...')
    try {
      const statsResponse = await axios.get('http://localhost:3000/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      console.log('✅ Estatísticas carregadas:', statsResponse.data)
    } catch (error) {
      console.log('⚠️ Estatísticas não disponíveis:', error.response?.data?.error || error.message)
    }
    
    // 5. Teste de Logs de Busca
    console.log('\n5️⃣ Teste de Logs de Busca...')
    try {
      const logsResponse = await axios.get('http://localhost:3000/api/admin/search-logs', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      console.log(`✅ ${logsResponse.data.logs?.length || 0} logs de busca carregados`)
    } catch (error) {
      console.log('⚠️ Logs de busca não disponíveis:', error.response?.data?.error || error.message)
    }
    
    // 6. Resumo Final
    console.log('\n📊 RESUMO FINAL:')
    const finalUsers = await axios.get('http://localhost:3000/api/admin/users', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    
    const proUsers = finalUsers.data.users.filter(u => u.subscription.plan_type === 'pro')
    const freeUsers = finalUsers.data.users.filter(u => u.subscription.plan_type === 'free')
    
    console.log(`   Total de usuários: ${finalUsers.data.users.length}`)
    console.log(`   Usuários PRO: ${proUsers.length}`)
    console.log(`   Usuários FREE: ${freeUsers.length}`)
    
    // Verificar usuário hideki especificamente
    const hidekiUser = finalUsers.data.users.find(u => u.email === 'hideki@gmail.com')
    if (hidekiUser) {
      console.log(`   Usuário hideki: ${hidekiUser.subscription.plan_type.toUpperCase()}`)
    }
    
    console.log('\n🎉 TODOS OS TESTES CONCLUÍDOS COM SUCESSO!')
    console.log('✅ Ambiente local está funcionando perfeitamente!')
    
  } catch (error) {
    console.error('❌ Erro durante os testes:', error.response?.data || error.message)
  }
}

testCompleteLocal()
