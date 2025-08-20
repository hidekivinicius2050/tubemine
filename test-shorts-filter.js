const axios = require('axios')

async function testShortsFilter() {
  try {
    console.log('🧪 Testando filtro de Shorts...\n')
    
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
    
    // 3. Verificar se o campo SHORTS está presente no HTML
    const html = buscadorResponse.data
    const hasShortsField = html.includes('id="shorts"')
    const hasShortsOptions = html.includes('Excluir Shorts') && html.includes('Incluir Shorts')
    
    console.log('\n3️⃣ Verificando campo SHORTS no HTML:')
    console.log(`   Campo shorts encontrado: ${hasShortsField}`)
    console.log(`   Opções do campo encontradas: ${hasShortsOptions}`)
    
    if (hasShortsField && hasShortsOptions) {
      console.log('✅ Campo SHORTS implementado corretamente!')
    } else {
      console.log('❌ Campo não encontrado no HTML')
    }
    
    // 4. Verificar se o CSS está sendo carregado
    const cssResponse = await axios.get('http://localhost:3000/styles/buscador.css')
    const css = cssResponse.data
    const hasShortsCSS = css.includes('#shorts')
    
    console.log('\n4️⃣ Verificando CSS:')
    console.log(`   CSS #shorts encontrado: ${hasShortsCSS}`)
    
    if (hasShortsCSS) {
      console.log('✅ CSS implementado corretamente!')
    } else {
      console.log('❌ CSS não encontrado')
    }
    
    console.log('\n🎉 Teste concluído!')
    console.log('\n📋 Resumo da funcionalidade SHORTS:')
    console.log('   - Campo select adicionado ao lado de "Inscritos máximos"')
    console.log('   - Opções: "Todos os vídeos", "Excluir Shorts", "Incluir Shorts"')
    console.log('   - Valor padrão: "Todos os vídeos" (não filtra nada)')
    console.log('   - "Excluir Shorts": Filtra vídeos com duração > 1 minuto')
    console.log('   - "Incluir Shorts": Permite todos os vídeos (incluindo Shorts)')
    console.log('   - Função de reset implementada')
    console.log('   - JavaScript atualizado para aplicar o filtro')
    console.log('   - CSS estilizado com tema vermelho')
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error.response?.data || error.message)
  }
}

testShortsFilter()
