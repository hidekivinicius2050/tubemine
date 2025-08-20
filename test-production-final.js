const axios = require('axios')

async function testProductionFinal() {
  try {
    console.log('🔍 Teste final da produção...\n')
    
    // 1. Fazer login
    console.log('1️⃣ Fazendo login...')
    const loginResponse = await axios.post('https://www.tubemine.com.br/api/auth/login', {
      email: 'admin@tubemine.com',
      password: 'b50x20Hi@'
    })
    
    const token = loginResponse.data.token
    console.log('✅ Login realizado\n')
    
    // 2. Testar API de usuários
    console.log('2️⃣ Testando API de usuários...')
    const usersResponse = await axios.get('https://www.tubemine.com.br/api/admin/users', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    
    console.log(`✅ API funcionando - ${usersResponse.data.users.length} usuários encontrados\n`)
    
    // 3. Procurar pelo usuário hideki
    const hidekiUser = usersResponse.data.users.find(u => u.email === 'hideki@gmail.com')
    
    if (hidekiUser) {
      console.log('👤 Usuário hideki encontrado:')
      console.log(`   ID: ${hidekiUser.id}`)
      console.log(`   Nome: ${hidekiUser.name}`)
      console.log(`   Email: ${hidekiUser.email}`)
      console.log(`   Plano: ${hidekiUser.subscription.plan_type}`)
      console.log(`   Status: ${hidekiUser.subscription.status}`)
      
      if (hidekiUser.subscription.plan_type === 'pro') {
        console.log('\n🎉 SUCESSO! O usuário está com plano PRO!')
        console.log('✅ A correção funcionou!')
      } else {
        console.log('\n❌ Ainda está com plano FREE')
        console.log('🔧 Vamos tentar uma abordagem diferente...')
        
        // 4. Tentar fazer upgrade novamente
        console.log('\n4️⃣ Tentando upgrade novamente...')
        try {
          const upgradeResponse = await axios.post('https://www.tubemine.com.br/api/admin/users/1/upgrade', {}, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
          console.log('✅ Upgrade realizado:', upgradeResponse.data)
          
          // 5. Verificar novamente
          console.log('\n5️⃣ Verificando novamente...')
          const usersResponse2 = await axios.get('https://www.tubemine.com.br/api/admin/users', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
          
          const hidekiUser2 = usersResponse2.data.users.find(u => u.email === 'hideki@gmail.com')
          if (hidekiUser2?.subscription.plan_type === 'pro') {
            console.log('🎉 AGORA FUNCIONOU! Usuário com plano PRO!')
          } else {
            console.log('❌ Ainda não funcionou')
          }
        } catch (upgradeError) {
          console.error('❌ Erro no upgrade:', upgradeError.response?.data || upgradeError.message)
        }
      }
    } else {
      console.log('❌ Usuário hideki não encontrado')
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.response?.data || error.message)
  }
}

testProductionFinal()
