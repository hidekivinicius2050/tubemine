#!/usr/bin/env node

const { spawn } = require('child_process');

console.log('🧹 Limpando processos na porta 3000...\n');

// Função para executar comandos
function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Comando falhou com código ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

// Função para matar processos na porta 3000
async function killProcessOnPort3000() {
  try {
    const isWindows = process.platform === 'win32';
    
    if (isWindows) {
      console.log('🔍 Verificando processos na porta 3000 (Windows)...');
      
      // Encontrar processos na porta 3000
      const result = await new Promise((resolve, reject) => {
        const child = spawn('netstat', ['-ano'], { stdio: 'pipe' });
        let output = '';
        
        child.stdout.on('data', (data) => {
          output += data.toString();
        });
        
        child.on('close', () => resolve(output));
        child.on('error', reject);
      });
      
      const lines = result.split('\n');
      const port3000Processes = lines
        .filter(line => line.includes(':3000') && line.includes('LISTENING'))
        .map(line => {
          const parts = line.trim().split(/\s+/);
          return parts[parts.length - 1]; // PID
        })
        .filter(pid => pid && pid !== 'PID');
      
      if (port3000Processes.length > 0) {
        console.log(`🔄 Encontrados ${port3000Processes.length} processo(s) na porta 3000:`);
        
        for (const pid of port3000Processes) {
          console.log(`   - PID: ${pid}`);
        }
        
        console.log('\n🔄 Matando processos...');
        
        for (const pid of port3000Processes) {
          try {
            await runCommand('taskkill', ['/F', '/PID', pid], { stdio: 'pipe' });
            console.log(`✅ Processo ${pid} finalizado`);
          } catch (error) {
            console.log(`⚠️  Não foi possível finalizar processo ${pid}: ${error.message}`);
          }
        }
        
        console.log('\n⏳ Aguardando processos serem finalizados...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        
      } else {
        console.log('✅ Nenhum processo encontrado na porta 3000');
      }
      
      // Também matar todos os processos node.exe para garantir
      console.log('\n🔄 Verificando processos Node.js...');
      try {
        await runCommand('taskkill', ['/F', '/IM', 'node.exe'], { stdio: 'pipe' });
        console.log('✅ Todos os processos Node.js finalizados');
      } catch (error) {
        console.log('ℹ️  Nenhum processo Node.js encontrado ou já finalizado');
      }
      
    } else {
      console.log('🔍 Verificando processos na porta 3000 (Linux/Mac)...');
      
      // Encontrar processos na porta 3000
      const result = await new Promise((resolve, reject) => {
        const child = spawn('lsof', ['-ti:3000'], { stdio: 'pipe' });
        let output = '';
        
        child.stdout.on('data', (data) => {
          output += data.toString();
        });
        
        child.on('close', () => resolve(output));
        child.on('error', reject);
      });
      
      const pids = result.trim().split('\n').filter(pid => pid);
      
      if (pids.length > 0) {
        console.log(`🔄 Encontrados ${pids.length} processo(s) na porta 3000:`);
        
        for (const pid of pids) {
          console.log(`   - PID: ${pid}`);
        }
        
        console.log('\n🔄 Matando processos...');
        
        for (const pid of pids) {
          try {
            await runCommand('kill', ['-9', pid], { stdio: 'pipe' });
            console.log(`✅ Processo ${pid} finalizado`);
          } catch (error) {
            console.log(`⚠️  Não foi possível finalizar processo ${pid}: ${error.message}`);
          }
        }
        
        console.log('\n⏳ Aguardando processos serem finalizados...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        
      } else {
        console.log('✅ Nenhum processo encontrado na porta 3000');
      }
    }
    
    console.log('\n✅ Limpeza concluída! A porta 3000 está livre.');
    
  } catch (error) {
    console.error('❌ Erro durante a limpeza:', error.message);
  }
}

// Executar limpeza
killProcessOnPort3000().then(() => {
  console.log('\n🎉 Pronto! Agora você pode iniciar o servidor na porta 3000.');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Erro:', error.message);
  process.exit(1);
});
