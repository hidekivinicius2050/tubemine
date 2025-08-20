const { exec } = require('child_process')

function checkServerFile() {
  console.log('🔍 Verificando arquivo no servidor...\n')
  
  const command = `ssh root@72.60.10.222 "cd /var/www/tubemine && grep -A 10 -B 5 'subscriptionMap' src/app/api/admin/users/route.ts"`
  
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Erro ao conectar:', error.message)
      return
    }
    
    if (stderr) {
      console.error('❌ Erro:', stderr)
      return
    }
    
    console.log('📄 Conteúdo do arquivo no servidor:')
    console.log(stdout)
    
    // Verificar se contém a query correta
    if (stdout.includes('LEFT JOIN subscriptions s2')) {
      console.log('\n✅ Arquivo parece estar correto!')
    } else {
      console.log('\n❌ Arquivo pode não ter sido atualizado corretamente')
    }
  })
}

checkServerFile()
