const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');

async function fixAdminPanel() {
  console.log('🔍 Diagnosticando problema do painel admin...');
  
  // Verificar se o arquivo existe
  const fs = require('fs');
  if (!fs.existsSync(dbPath)) {
    console.log('❌ Arquivo database.sqlite não encontrado!');
    return;
  }
  
  console.log('✅ Arquivo database.sqlite encontrado');
  
  const db = new sqlite3.Database(dbPath);
  
  try {
    // Verificar tabelas
    db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
      if (err) {
        console.error('❌ Erro ao verificar tabelas:', err);
        return;
      }
      
      console.log('📋 Tabelas encontradas:', tables.map(t => t.name));
      
      // Verificar usuários
      db.all("SELECT id, email, name, role, created_at FROM users", (err, users) => {
        if (err) {
          console.error('❌ Erro ao verificar usuários:', err);
          return;
        }
        
        console.log('👥 Usuários no banco:', users.length);
        users.forEach(user => {
          console.log(`  - ID: ${user.id}, Email: ${user.email}, Nome: ${user.name}, Role: ${user.role}`);
        });
        
        // Se não há usuários, criar o admin
        if (users.length === 0) {
          console.log('⚠️ Nenhum usuário encontrado. Criando admin...');
          createAdmin(db);
        } else {
          // Verificar se o admin existe
          const admin = users.find(u => u.email === 'admin@tubemine.com');
          if (!admin) {
            console.log('⚠️ Admin não encontrado. Criando...');
            createAdmin(db);
          } else {
            console.log('✅ Admin encontrado:', admin);
          }
        }
      });
    });
    
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

async function createAdmin(db) {
  try {
    const hashedPassword = await bcrypt.hash('b50x20Hi@', 12);
    
    db.run(`
      INSERT INTO users (email, password_hash, name, role)
      VALUES (?, ?, ?, ?)
    `, ['admin@tubemine.com', hashedPassword, 'Administrador', 'admin'], function(err) {
      if (err) {
        console.error('❌ Erro ao criar admin:', err);
      } else {
        console.log('✅ Admin criado com sucesso!');
        console.log('📧 Email: admin@tubemine.com');
        console.log('🔑 Senha: b50x20Hi@');
      }
      db.close();
    });
    
  } catch (error) {
    console.error('❌ Erro ao criar admin:', error);
    db.close();
  }
}

fixAdminPanel();

