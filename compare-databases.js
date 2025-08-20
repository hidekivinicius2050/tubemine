const axios = require('axios')

async function compareDatabases() {
  try {
    console.log('🔍 Comparando bancos de dados...\n')
    
    // 1. Testar local
    console.log('1️⃣ Testando LOCAL...')
    const localLogin = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'admin@tubemine.com',
      password: 'b50x20Hi@'
    })
    
    const localToken = localLogin.data.token
    const localUsers = await axios.get('http://localhost:3000/api/admin/users', {
      headers: { 'Authorization': `Bearer ${localToken}` }
    })
    
    const localHideki = localUsers.data.users.find(u => u.email === 'hideki@gmail.com')
    console.log(`   Local - Plano do hideki: ${localHideki?.subscription.plan_type || 'não encontrado'}`)
    
    // 2. Testar produção
    console.log('\n2️⃣ Testando PRODUÇÃO...')
    const prodLogin = await axios.post('https://www.tubemine.com.br/api/auth/login', {
      email: 'admin@tubemine.com',
      password: 'b50x20Hi@'
    })
    
    const prodToken = prodLogin.data.token
    const prodUsers = await axios.get('https://www.tubemine.com.br/api/admin/users', {
      headers: { 'Authorization': `Bearer ${prodToken}` }
    })
    
    const prodHideki = prodUsers.data.users.find(u => u.email === 'hideki@gmail.com')
    console.log(`   Produção - Plano do hideki: ${prodHideki?.subscription.plan_type || 'não encontrado'}`)
    
    // 3. Comparar
    console.log('\n3️⃣ Comparação:')
    if (localHideki?.subscription.plan_type === prodHideki?.subscription.plan_type) {
      console.log('✅ Ambos mostram o mesmo plano')
    } else {
      console.log('❌ DIFERENÇA ENCONTRADA!')
      console.log(`   Local: ${localHideki?.subscription.plan_type}`)
      console.log(`   Produção: ${prodHideki?.subscription.plan_type}`)
    }
    
    // 4. Mostrar detalhes do usuário em produção
    if (prodHideki) {
      console.log('\n📋 Detalhes do usuário em produção:')
      console.log(`   ID: ${prodHideki.id}`)
      console.log(`   Nome: ${prodHideki.name}`)
      console.log(`   Email: ${prodHideki.email}`)
      console.log(`   Plano: ${prodHideki.subscription.plan_type}`)
      console.log(`   Status: ${prodHideki.subscription.status}`)
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.response?.data || error.message)
  }
}

compareDatabases()
