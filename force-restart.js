const { exec } = require('child_process')

function forceRestart() {
  console.log('🔄 Forçando reinício completo da aplicação...\n')
  
  const commands = [
    'ssh root@72.60.10.222 "cd /var/www/tubemine && pm2 stop tubemine-saas"',
    'ssh root@72.60.10.222 "cd /var/www/tubemine && pm2 delete tubemine-saas"',
    'ssh root@72.60.10.222 "cd /var/www/tubemine && pm2 start ecosystem.config.js"',
    'ssh root@72.60.10.222 "cd /var/www/tubemine && pm2 save"',
    'ssh root@72.60.10.222 "cd /var/www/tubemine && pm2 status"'
  ]
  
  let currentCommand = 0
  
  function executeNext() {
    if (currentCommand >= commands.length) {
      console.log('\n✅ Reinício completo finalizado!')
      return
    }
    
    console.log(`Executando comando ${currentCommand + 1}/${commands.length}...`)
    exec(commands[currentCommand], (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Erro no comando ${currentCommand + 1}:`, error.message)
      } else {
        console.log(`✅ Comando ${currentCommand + 1} executado com sucesso`)
        if (stdout) console.log(stdout)
      }
      
      currentCommand++
      setTimeout(executeNext, 2000) // Aguardar 2 segundos entre comandos
    })
  }
  
  executeNext()
}

forceRestart()
