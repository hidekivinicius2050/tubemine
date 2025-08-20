const axios = require('axios')

async function testAPI() {
  try {
    console.log('🔍 Testando API local...\n')
    
    // 1. Fazer login para obter token
    console.log('1️⃣ Fazendo login...')
    const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'admin@tubemine.com',
      password: 'b50x20Hi@'
    })
    
    const token = loginResponse.data.token
    console.log('✅ Login realizado com sucesso')
    console.log(`   Token: ${token.substring(0, 50)}...\n`)
    
    // 2. Testar API de usuários
    console.log('2️⃣ Testando API de usuários...')
    const usersResponse = await axios.get('http://localhost:3000/api/admin/users', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    console.log('✅ API de usuários funcionando')
    console.log(`   Total de usuários: ${usersResponse.data.users.length}\n`)
    
    // 3. Procurar pelo usuário hideki
    const hidekiUser = usersResponse.data.users.find(user => 
      user.email === 'hideki@gmail.com' || user.name === 'hideki'
    )
    
    if (hidekiUser) {
      console.log('👤 Usuário hideki encontrado:')
      console.log(`   ID: ${hidekiUser.id}`)
      console.log(`   Nome: ${hidekiUser.name}`)
      console.log(`   Email: ${hidekiUser.email}`)
      console.log(`   Plano: ${hidekiUser.subscription.plan_type}`)
      console.log(`   Status: ${hidekiUser.subscription.status}`)
      
      if (hidekiUser.subscription.plan_type === 'pro') {
        console.log('✅ SUCESSO! O usuário está com plano PRO!')
      } else {
        console.log('❌ PROBLEMA! O usuário ainda está com plano FREE!')
      }
    } else {
      console.log('❌ Usuário hideki não encontrado na lista')
    }
    
    // 4. Mostrar todos os usuários para debug
    console.log('\n📋 Todos os usuários:')
    usersResponse.data.users.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.name} (${user.email}) - Plano: ${user.subscription.plan_type}`)
    })
    
  } catch (error) {
    console.error('❌ Erro:', error.response?.data || error.message)
  }
}

testAPI()
