const { exec } = require('child_process')

function debugServerDatabase() {
  console.log('🔍 Debugando banco de dados do servidor...\n')
  
  const commands = [
    // Verificar usuário hideki
    'ssh root@72.60.10.222 "cd /var/www/tubemine && sqlite3 database.sqlite \\"SELECT id, name, email FROM users WHERE email = \\'hideki@gmail.com\\';\\""',
    
    // Verificar todas as assinaturas do usuário hideki
    'ssh root@72.60.10.222 "cd /var/www/tubemine && sqlite3 database.sqlite \\"SELECT * FROM subscriptions WHERE user_id = (SELECT id FROM users WHERE email = \\'hideki@gmail.com\\') ORDER BY created_at DESC;\\""',
    
    // Testar a query da API diretamente no banco
    'ssh root@72.60.10.222 "cd /var/www/tubemine && sqlite3 database.sqlite \\"SELECT s1.user_id, s1.plan_type, s1.status, s1.valid_until FROM subscriptions s1 LEFT JOIN subscriptions s2 ON s1.user_id = s2.user_id AND s1.created_at < s2.created_at WHERE s2.user_id IS NULL AND s1.user_id = (SELECT id FROM users WHERE email = \\'hideki@gmail.com\\');\\""',
    
    // Verificar estrutura da tabela subscriptions
    'ssh root@72.60.10.222 "cd /var/www/tubemine && sqlite3 database.sqlite \\".schema subscriptions\\""'
  ]
  
  let currentCommand = 0
  
  function executeNext() {
    if (currentCommand >= commands.length) {
      console.log('\n✅ Debug concluído!')
      return
    }
    
    const descriptions = [
      '1️⃣ Verificando usuário hideki...',
      '2️⃣ Verificando assinaturas do usuário...',
      '3️⃣ Testando query da API...',
      '4️⃣ Verificando estrutura da tabela...'
    ]
    
    console.log(descriptions[currentCommand])
    exec(commands[currentCommand], (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Erro:`, error.message)
      } else {
        if (stdout.trim()) {
          console.log('📊 Resultado:')
          console.log(stdout)
        } else {
          console.log('📭 Nenhum resultado encontrado')
        }
      }
      
      console.log('') // Linha em branco
      currentCommand++
      setTimeout(executeNext, 1000)
    })
  }
  
  executeNext()
}

debugServerDatabase()
