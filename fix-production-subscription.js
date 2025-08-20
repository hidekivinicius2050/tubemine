const axios = require('axios')

async function fixProductionSubscription() {
  try {
    console.log('🔧 Corrigindo assinatura em produção...\n')
    
    // 1. Fazer login
    console.log('1️⃣ Fazendo login...')
    const loginResponse = await axios.post('https://www.tubemine.com.br/api/auth/login', {
      email: 'admin@tubemine.com',
      password: 'b50x20Hi@'
    })
    
    const token = loginResponse.data.token
    console.log('✅ Login realizado\n')
    
    // 2. Fazer upgrade do usuário hideki para PRO
    console.log('2️⃣ Fazendo upgrade do usuário hideki para PRO...')
    const upgradeResponse = await axios.post('https://www.tubemine.com.br/api/admin/users/1/upgrade', {}, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    
    console.log('✅ Upgrade realizado:', upgradeResponse.data)
    
    // 3. Verificar se funcionou
    console.log('\n3️⃣ Verificando resultado...')
    const usersResponse = await axios.get('https://www.tubemine.com.br/api/admin/users', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    
    const hidekiUser = usersResponse.data.users.find(u => u.email === 'hideki@gmail.com')
    if (hidekiUser) {
      console.log('👤 Usuário hideki:')
      console.log(`   ID: ${hidekiUser.id}`)
      console.log(`   Nome: ${hidekiUser.name}`)
      console.log(`   Email: ${hidekiUser.email}`)
      console.log(`   Plano: ${hidekiUser.subscription.plan_type}`)
      console.log(`   Status: ${hidekiUser.subscription.status}`)
      
      if (hidekiUser.subscription.plan_type === 'pro') {
        console.log('🎉 SUCESSO! Usuário agora está com plano PRO!')
      } else {
        console.log('❌ Ainda está com plano FREE')
      }
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.response?.data || error.message)
  }
}

fixProductionSubscription()
