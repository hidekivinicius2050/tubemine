const sqlite3 = require('sqlite3')
const { open } = require('sqlite')
const bcrypt = require('bcryptjs')
const path = require('path')

async function createAdmin() {
  const db = await open({
    filename: path.join(process.cwd(), 'database.sqlite'),
    driver: sqlite3.Database
  })

  // Criar tabelas se não existirem
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      stripe_customer_id TEXT
    )
  `)

  await db.exec(`
    CREATE TABLE IF NOT EXISTS user_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `)

  // Verificar se já existe um admin
  const existingAdmin = await db.get('SELECT id FROM users WHERE role = ?', ['admin'])
  
  if (existingAdmin) {
    console.log('Usuário admin já existe!')
    console.log('Tentando atualizar a senha...')
    
    // Criar hash da nova senha
    const hashedPassword = await bcrypt.hash('b50x20Hi@', 12)
    
    // Atualizar senha do admin
    await db.run(
      'UPDATE users SET password_hash = ? WHERE role = ?',
      [hashedPassword, 'admin']
    )
    
    console.log('Senha do admin atualizada!')
    console.log('Email: admin@tubemine.com')
    console.log('Senha: b50x20Hi@')
    
    await db.close()
    return
  }

  // Criar hash da nova senha
  const hashedPassword = await bcrypt.hash('b50x20Hi@', 12)

  // Inserir usuário admin
  const result = await db.run(
    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
    ['Administrador', 'admin@tubemine.com', hashedPassword, 'admin']
  )

  console.log('Usuário admin criado com sucesso!')
  console.log('Email: admin@tubemine.com')
  console.log('Senha: b50x20Hi@')
  console.log('ID:', result.lastID)

  await db.close()
}

createAdmin().catch(console.error)
