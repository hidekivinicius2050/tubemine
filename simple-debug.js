const { exec } = require('child_process')

console.log('🔍 Debugando banco de dados do servidor...\n')

// Comando 1: Verificar usuário hideki
console.log('1️⃣ Verificando usuário hideki...')
exec('ssh root@72.60.10.222 "cd /var/www/tubemine && sqlite3 database.sqlite \\"SELECT id, name, email FROM users WHERE email = \\'hideki@gmail.com\\';\\""', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Erro:', error.message)
  } else {
    console.log('📊 Usuário:', stdout.trim() || 'Não encontrado')
  }
  
  // Comando 2: Verificar assinaturas
  console.log('\n2️⃣ Verificando assinaturas...')
  exec('ssh root@72.60.10.222 "cd /var/www/tubemine && sqlite3 database.sqlite \\"SELECT * FROM subscriptions WHERE user_id = 1 ORDER BY created_at DESC;\\""', (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Erro:', error.message)
    } else {
      console.log('📊 Assinaturas:', stdout.trim() || 'Nenhuma encontrada')
    }
    
    // Comando 3: Testar query da API
    console.log('\n3️⃣ Testando query da API...')
    exec('ssh root@72.60.10.222 "cd /var/www/tubemine && sqlite3 database.sqlite \\"SELECT s1.user_id, s1.plan_type, s1.status FROM subscriptions s1 LEFT JOIN subscriptions s2 ON s1.user_id = s2.user_id AND s1.created_at < s2.created_at WHERE s2.user_id IS NULL AND s1.user_id = 1;\\""', (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Erro:', error.message)
      } else {
        console.log('📊 Query API:', stdout.trim() || 'Nenhum resultado')
      }
      
      console.log('\n✅ Debug concluído!')
    })
  })
})
