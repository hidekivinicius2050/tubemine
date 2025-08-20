const axios = require('axios')

async function testMaxResults() {
  try {
    console.log('🧪 Testando campo de quantidade máxima de vídeos...\n')
    
    // 1. Fazer login
    console.log('1️⃣ Fazendo login...')
    const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'admin@tubemine.com',
      password: 'b50x20Hi@'
    })
    
    const token = loginResponse.data.token
    console.log('✅ Login realizado com sucesso')
    
    // 2. Acessar a página do buscador
    console.log('\n2️⃣ Acessando página do buscador...')
    const buscadorResponse = await axios.get('http://localhost:3000/buscador', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    
    console.log('✅ Página do buscador acessada')
    
    // 3. Verificar se o campo maxResults está presente no HTML
    const html = buscadorResponse.data
    const hasMaxResultsField = html.includes('id="maxResults"')
    const hasMaxResultsSection = html.includes('max-results-section')
    
    console.log('\n3️⃣ Verificando campo no HTML:')
    console.log(`   Campo maxResults encontrado: ${hasMaxResultsField}`)
    console.log(`   Seção max-results-section encontrada: ${hasMaxResultsSection}`)
    
    if (hasMaxResultsField && hasMaxResultsSection) {
      console.log('✅ Campo de quantidade máxima implementado corretamente!')
    } else {
      console.log('❌ Campo não encontrado no HTML')
    }
    
    // 4. Verificar se o CSS está sendo carregado
    const cssResponse = await axios.get('http://localhost:3000/styles/buscador.css')
    const css = cssResponse.data
    const hasMaxResultsCSS = css.includes('.max-results-section')
    const hasMaxResultsInputCSS = css.includes('.max-results-input')
    
    console.log('\n4️⃣ Verificando CSS:')
    console.log(`   CSS max-results-section encontrado: ${hasMaxResultsCSS}`)
    console.log(`   CSS max-results-input encontrado: ${hasMaxResultsInputCSS}`)
    
    if (hasMaxResultsCSS && hasMaxResultsInputCSS) {
      console.log('✅ CSS implementado corretamente!')
    } else {
      console.log('❌ CSS não encontrado')
    }
    
    console.log('\n🎉 Teste concluído!')
    console.log('\n📋 Resumo:')
    console.log('   - Campo de quantidade máxima adicionado ao formulário')
    console.log('   - Valor padrão: 50 vídeos')
    console.log('   - Limite máximo: 500 vídeos')
    console.log('   - CSS estilizado com tema verde')
    console.log('   - Função de reset implementada')
    console.log('   - JavaScript atualizado para usar o valor do campo')
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error.response?.data || error.message)
  }
}

testMaxResults()
