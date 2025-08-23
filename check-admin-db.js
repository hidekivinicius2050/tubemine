const sqlite3 = require('sqlite3')
const { open } = require('sqlite')
const path = require('path')

async function checkAdmin() {
  const db = await open({
    filename: path.join(process.cwd(), 'database.sqlite'),
    driver: sqlite3.Database
  })

  try {
    const admin = await db.get('SELECT id, name, email, role FROM users WHERE role = ?', ['admin'])
    
    if (admin) {
      console.log('✅ Admin encontrado:')
      console.log('ID:', admin.id)
      console.log('Nome:', admin.name)
      console.log('Email:', admin.email)
      console.log('Role:', admin.role)
    } else {
      console.log('❌ Nenhum admin encontrado!')
      
      const users = await db.all('SELECT id, name, email, role FROM users')
      console.log('\n📋 Todos os usuários:')
      users.forEach(user => {
        console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`)
      })
    }

    await db.close()
    
  } catch (error) {
    console.error('❌ Erro:', error)
    await db.close()
  }
}

checkAdmin().catch(console.error)
