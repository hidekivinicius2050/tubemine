#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando TubeMine Platform...\n');

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
    console.log('🔍 Verificando se a porta 3000 está em uso...');
    
    // Verificar se há processos na porta 3000
    const isWindows = process.platform === 'win32';
    
    if (isWindows) {
      // Windows - usar netstat para encontrar processos
      try {
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
          console.log('🔄 Encontrados processos na porta 3000. Matando...');
          
          for (const pid of port3000Processes) {
            try {
              await runCommand('taskkill', ['/F', '/PID', pid], { stdio: 'pipe' });
              console.log(`✅ Processo ${pid} finalizado`);
            } catch (error) {
              console.log(`⚠️  Não foi possível finalizar processo ${pid}: ${error.message}`);
            }
          }
          
          // Aguardar um pouco para os processos serem finalizados
          await new Promise(resolve => setTimeout(resolve, 2000));
        } else {
          console.log('✅ Porta 3000 está livre');
        }
      } catch (error) {
        console.log('⚠️  Não foi possível verificar processos na porta 3000');
      }
    } else {
      // Linux/Mac - usar lsof para encontrar processos
      try {
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
          console.log('🔄 Encontrados processos na porta 3000. Matando...');
          
          for (const pid of pids) {
            try {
              await runCommand('kill', ['-9', pid], { stdio: 'pipe' });
              console.log(`✅ Processo ${pid} finalizado`);
            } catch (error) {
              console.log(`⚠️  Não foi possível finalizar processo ${pid}: ${error.message}`);
            }
          }
          
          // Aguardar um pouco para os processos serem finalizados
          await new Promise(resolve => setTimeout(resolve, 2000));
        } else {
          console.log('✅ Porta 3000 está livre');
        }
      } catch (error) {
        console.log('⚠️  Não foi possível verificar processos na porta 3000');
      }
    }
  } catch (error) {
    console.log('⚠️  Erro ao verificar porta 3000:', error.message);
  }
}

// Função para verificar se o banco de dados existe
function checkDatabase() {
  const dbPath = path.join(process.cwd(), 'database.sqlite');
  return fs.existsSync(dbPath);
}

// Função para criar o admin se necessário
async function setupDatabase() {
  try {
    console.log('📊 Verificando banco de dados...');
    
    if (!checkDatabase()) {
      console.log('🗄️  Criando banco de dados e usuário admin...');
      await runCommand('node', ['scripts/create-admin.js']);
      console.log('✅ Banco de dados criado com sucesso!');
    } else {
      console.log('✅ Banco de dados já existe!');
    }
  } catch (error) {
    console.error('❌ Erro ao configurar banco de dados:', error.message);
    process.exit(1);
  }
}

// Função para verificar se as dependências estão instaladas
async function checkDependencies() {
  try {
    console.log('📦 Verificando dependências...');
    
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error('package.json não encontrado!');
    }

    const nodeModulesPath = path.join(process.cwd(), 'node_modules');
    if (!fs.existsSync(nodeModulesPath)) {
      console.log('📥 Instalando dependências...');
      await runCommand('npm', ['install']);
      console.log('✅ Dependências instaladas!');
    } else {
      console.log('✅ Dependências já instaladas!');
    }
  } catch (error) {
    console.error('❌ Erro ao verificar dependências:', error.message);
    process.exit(1);
  }
}

// Função principal
async function startServer() {
  try {
    // Verificar dependências
    await checkDependencies();
    
    // Configurar banco de dados
    await setupDatabase();
    
    // Matar processos na porta 3000
    await killProcessOnPort3000();
    
    console.log('\n🎯 Iniciando servidor de desenvolvimento...');
    console.log('📍 URL: http://localhost:3000');
    console.log('🔑 Admin: admin@tubemine.com / admin123');
    console.log('⏹️  Para parar o servidor, pressione Ctrl+C\n');
    
    // Iniciar servidor Next.js na porta 3000
    await runCommand('npx', ['next', 'dev', '--port', '3000']);
    
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error.message);
    process.exit(1);
  }
}

// Tratamento de sinais para parar o servidor graciosamente
process.on('SIGINT', () => {
  console.log('\n👋 Servidor parado pelo usuário');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 Servidor parado');
  process.exit(0);
});

// Iniciar o servidor
startServer();
