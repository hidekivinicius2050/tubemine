const sqlite3 = require('sqlite3').verbose()
const path = require('path')

const dbPath = path.join(__dirname, 'database.sqlite')
const db = new sqlite3.Database(dbPath)

console.log('🔍 Verificando assinaturas no banco de dados...\n')

// Verificar usuário hideki
db.get("SELECT id, name, email FROM users WHERE email = 'hideki@gmail.com'", (err, user) => {
  if (err) {
    console.error('Erro ao buscar usuário:', err)
    return
  }
  
  if (!user) {
    console.log('❌ Usuário hideki@gmail.com não encontrado')
    return
  }
  
  console.log('👤 Usuário encontrado:')
  console.log(`   ID: ${user.id}`)
  console.log(`   Nome: ${user.name}`)
  console.log(`   Email: ${user.email}\n`)
  
  // Verificar assinaturas deste usuário
  db.all("SELECT * FROM subscriptions WHERE user_id = ? ORDER BY created_at DESC", [user.id], (err, subscriptions) => {
    if (err) {
      console.error('Erro ao buscar assinaturas:', err)
      return
    }
    
    console.log(`📋 Assinaturas encontradas: ${subscriptions.length}`)
    subscriptions.forEach((sub, index) => {
      console.log(`\n   Assinatura ${index + 1}:`)
      console.log(`   ID: ${sub.id}`)
      console.log(`   User ID: ${sub.user_id}`)
      console.log(`   Plan Type: ${sub.plan_type}`)
      console.log(`   Status: ${sub.status}`)
      console.log(`   Valid Until: ${sub.valid_until}`)
      console.log(`   Created At: ${sub.created_at}`)
    })
    
    // Testar a query que está sendo usada na API
    console.log('\n🔍 Testando query da API...')
    db.all(`
      SELECT 
        s1.user_id,
        s1.plan_type,
        s1.status,
        s1.valid_until
      FROM subscriptions s1
      LEFT JOIN subscriptions s2 ON s1.user_id = s2.user_id AND s1.created_at < s2.created_at
      WHERE s2.user_id IS NULL AND s1.user_id = ?
    `, [user.id], (err, result) => {
      if (err) {
        console.error('Erro na query da API:', err)
        return
      }
      
      console.log(`\n📊 Resultado da query da API: ${result.length} registros`)
      result.forEach((r, index) => {
        console.log(`   ${index + 1}: User ID ${r.user_id} - Plan: ${r.plan_type} - Status: ${r.status}`)
      })
      
      db.close()
    })
  })
})
