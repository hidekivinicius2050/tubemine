const puppeteer = require('puppeteer')

async function testRegisterEye() {
  console.log('👁️ Testando funcionalidade do olho na página de registro...\n')
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  })
  
  try {
    const page = await browser.newPage()
    
    // 1. Acessar a página de registro
    console.log('1️⃣ Acessando página de registro...')
    await page.goto('http://localhost:3000/registro')
    await page.waitForSelector('.password-container', { timeout: 5000 })
    console.log('✅ Página carregada')
    
    // 2. Verificar se os campos de senha existem
    console.log('\n2️⃣ Verificando campos de senha...')
    const passwordInputs = await page.$$('.password-container input[type="password"]')
    const eyeButtons = await page.$$('.password-toggle')
    
    console.log(`   Campos de senha encontrados: ${passwordInputs.length}`)
    console.log(`   Botões de olho encontrados: ${eyeButtons.length}`)
    
    if (passwordInputs.length === 0 || eyeButtons.length === 0) {
      console.log('❌ Campos de senha ou botões de olho não encontrados')
      return
    }
    
    // 3. Testar o primeiro campo de senha
    console.log('\n3️⃣ Testando primeiro campo de senha...')
    
    // Digitar uma senha
    await page.type('.password-container:first-child input', 'teste123')
    console.log('✅ Senha digitada')
    
    // Verificar se o campo está como password
    const isPassword = await page.$eval('.password-container:first-child input', el => el.type === 'password')
    console.log(`   Campo está como password: ${isPassword}`)
    
    // Clicar no olho
    await page.click('.password-container:first-child .password-toggle')
    await page.waitForTimeout(500)
    
    // Verificar se mudou para text
    const isText = await page.$eval('.password-container:first-child input', el => el.type === 'text')
    console.log(`   Campo mudou para text: ${isText}`)
    
    if (isText) {
      console.log('✅ Primeiro olho funcionando!')
    } else {
      console.log('❌ Primeiro olho não funcionou')
    }
    
    // 4. Testar o segundo campo de senha
    console.log('\n4️⃣ Testando segundo campo de senha...')
    
    // Digitar uma senha
    await page.type('.password-container:last-child input', 'teste123')
    console.log('✅ Senha digitada')
    
    // Verificar se o campo está como password
    const isPassword2 = await page.$eval('.password-container:last-child input', el => el.type === 'password')
    console.log(`   Campo está como password: ${isPassword2}`)
    
    // Clicar no olho
    await page.click('.password-container:last-child .password-toggle')
    await page.waitForTimeout(500)
    
    // Verificar se mudou para text
    const isText2 = await page.$eval('.password-container:last-child input', el => el.type === 'text')
    console.log(`   Campo mudou para text: ${isText2}`)
    
    if (isText2) {
      console.log('✅ Segundo olho funcionando!')
    } else {
      console.log('❌ Segundo olho não funcionou')
    }
    
    // 5. Testar alternância múltiplas vezes
    console.log('\n5️⃣ Testando alternância múltiplas vezes...')
    
    for (let i = 0; i < 3; i++) {
      await page.click('.password-container:first-child .password-toggle')
      await page.waitForTimeout(200)
      const type = await page.$eval('.password-container:first-child input', el => el.type)
      console.log(`   Clique ${i + 1}: campo está como "${type}"`)
    }
    
    console.log('\n🎉 Teste concluído!')
    
    // Manter o navegador aberto por 5 segundos para inspeção visual
    console.log('\n⏰ Mantendo navegador aberto por 5 segundos para inspeção...')
    await page.waitForTimeout(5000)
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message)
  } finally {
    await browser.close()
  }
}

testRegisterEye()
