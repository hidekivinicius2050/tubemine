#!/bin/bash

# Script de Verificação de Saúde - TubeMine
# Verifica se todos os componentes estão funcionando

echo "🏥 VERIFICAÇÃO DE SAÚDE DO SISTEMA - TUBEMINE"
echo "============================================="

# 1. VERIFICAR PM2
echo "📊 1. Verificando PM2..."
if pm2 list | grep -q "online"; then
    echo "✅ PM2: Aplicação online"
else
    echo "❌ PM2: Aplicação offline!"
    exit 1
fi

# 2. VERIFICAR PORTA 3000
echo "🌐 2. Verificando porta 3000..."
if netstat -tlnp | grep -q ":3000"; then
    echo "✅ Porta 3000: Ativa"
else
    echo "❌ Porta 3000: Inativa!"
    exit 1
fi

# 3. VERIFICAR BANCO DE DADOS
echo "🗄️  3. Verificando banco de dados..."
if [ -f "database.sqlite" ]; then
    echo "✅ Banco de dados: Existe"
    
    # Verificar se tem admin
    if node -e "
    const sqlite3 = require('sqlite3');
    const { open } = require('sqlite');
    const path = require('path');
    (async () => {
        const db = await open({
            filename: path.join(process.cwd(), 'database.sqlite'),
            driver: sqlite3.Database
        });
        const admin = await db.get('SELECT id, name, email, role FROM users WHERE role = ?', ['admin']);
        if (admin) {
            console.log('Admin encontrado:', admin.email);
            process.exit(0);
        } else {
            console.log('Nenhum admin encontrado');
            process.exit(1);
        }
        await db.close();
    })();
    " 2>/dev/null; then
        echo "✅ Admin: Existe no banco"
    else
        echo "❌ Admin: Não encontrado no banco!"
        exit 1
    fi
else
    echo "❌ Banco de dados: Não existe!"
    exit 1
fi

# 4. TESTAR API DE LOGIN
echo "🔐 4. Testando API de login..."
if curl -s -X POST http://localhost:3000/api/test-login | grep -q "Login realizado com sucesso"; then
    echo "✅ API de login: Funcionando"
else
    echo "❌ API de login: Falhou!"
    exit 1
fi

# 5. VERIFICAR ARQUIVOS ESTÁTICOS
echo "📁 5. Verificando arquivos estáticos..."
if [ -d ".next/standalone/.next/static" ]; then
    echo "✅ Arquivos estáticos: Existem"
else
    echo "❌ Arquivos estáticos: Não encontrados!"
    exit 1
fi

# 6. VERIFICAR NGINX
echo "🌍 6. Verificando Nginx..."
if systemctl is-active --quiet nginx; then
    echo "✅ Nginx: Ativo"
else
    echo "❌ Nginx: Inativo!"
    exit 1
fi

# 7. TESTAR ACESSO EXTERNO
echo "🌐 7. Testando acesso externo..."
if curl -s -I https://tubemine.com.br | grep -q "200 OK"; then
    echo "✅ Site externo: Acessível"
else
    echo "❌ Site externo: Não acessível!"
    exit 1
fi

# 8. VERIFICAR LOGS DE ERRO
echo "📋 8. Verificando logs de erro..."
ERROR_COUNT=$(pm2 logs tubemine --err --lines 50 | grep -c "error\|Error\|ERROR" || echo "0")
if [ "$ERROR_COUNT" -lt 10 ]; then
    echo "✅ Logs de erro: OK ($ERROR_COUNT erros recentes)"
else
    echo "⚠️  Logs de erro: Muitos erros ($ERROR_COUNT)"
fi

echo ""
echo "🎉 VERIFICAÇÃO DE SAÚDE CONCLUÍDA!"
echo "=================================="
echo "✅ Todos os componentes principais estão funcionando"
echo ""
echo "📊 Resumo:"
echo "- PM2: ✅"
echo "- Porta 3000: ✅"
echo "- Banco de dados: ✅"
echo "- API de login: ✅"
echo "- Arquivos estáticos: ✅"
echo "- Nginx: ✅"
echo "- Site externo: ✅"
echo ""
echo "🚀 Sistema pronto para produção!"
