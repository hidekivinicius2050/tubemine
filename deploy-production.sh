#!/bin/bash

# Script de Deploy Robusto para Produção - TubeMine
# Este script garante um deploy seguro e sem bugs

set -e  # Para o script se qualquer comando falhar

echo "🚀 INICIANDO DEPLOY DE PRODUÇÃO - TUBEMINE"
echo "=========================================="

# 1. BACKUP DO BANCO DE DADOS
echo "📦 1. Fazendo backup do banco de dados..."
if [ -f "database.sqlite" ]; then
    cp database.sqlite database.sqlite.backup.$(date +%Y%m%d_%H%M%S)
    echo "✅ Backup criado: database.sqlite.backup.$(date +%Y%m%d_%H%M%S)"
else
    echo "⚠️  Banco de dados não encontrado, será criado novo"
fi

# 2. PULL DAS ATUALIZAÇÕES
echo "📥 2. Baixando atualizações do Git..."
git fetch origin
git reset --hard origin/main
echo "✅ Código atualizado"

# 3. INSTALAR DEPENDÊNCIAS
echo "📦 3. Instalando dependências..."
npm ci --production
echo "✅ Dependências instaladas"

# 4. VERIFICAR VARIÁVEIS DE AMBIENTE
echo "🔧 4. Verificando variáveis de ambiente..."
if [ ! -f ".env.local" ]; then
    echo "❌ Arquivo .env.local não encontrado!"
    exit 1
fi
echo "✅ Variáveis de ambiente OK"

# 5. BUILD DA APLICAÇÃO
echo "🔨 5. Fazendo build da aplicação..."
npm run build
echo "✅ Build concluído"

# 6. VERIFICAR SE O BUILD FOI SUCESSO
if [ ! -d ".next" ]; then
    echo "❌ Build falhou - pasta .next não encontrada!"
    exit 1
fi

# 7. COPIAR ARQUIVOS ESTÁTICOS
echo "📁 6. Copiando arquivos estáticos..."
if [ -d ".next/static" ]; then
    mkdir -p .next/standalone/.next
    cp -r .next/static .next/standalone/.next/
    echo "✅ Arquivos estáticos copiados"
else
    echo "❌ Pasta .next/static não encontrada!"
    exit 1
fi

# 8. VERIFICAR BANCO DE DADOS
echo "🗄️  7. Verificando banco de dados..."
if [ ! -f "database.sqlite" ]; then
    echo "⚠️  Banco não existe, criando novo..."
    node scripts/create-admin.js
else
    echo "✅ Banco de dados existe"
fi

# 9. TESTAR API CRÍTICAS
echo "🧪 8. Testando APIs críticas..."
sleep 2  # Aguardar um pouco

# Testar API de login
if curl -s -X POST http://localhost:3000/api/test-login | grep -q "Login realizado com sucesso"; then
    echo "✅ API de login funcionando"
else
    echo "❌ API de login falhou!"
    exit 1
fi

# 10. REINICIAR PM2
echo "🔄 9. Reiniciando aplicação..."
pm2 restart tubemine
sleep 3

# 11. VERIFICAR STATUS
echo "📊 10. Verificando status da aplicação..."
if pm2 list | grep -q "online"; then
    echo "✅ Aplicação online"
else
    echo "❌ Aplicação offline!"
    pm2 logs tubemine --lines 10
    exit 1
fi

# 12. TESTE FINAL
echo "🎯 11. Teste final..."
sleep 2
if curl -s -X POST http://localhost:3000/api/test-login | grep -q "Login realizado com sucesso"; then
    echo "✅ Teste final passou"
else
    echo "❌ Teste final falhou!"
    exit 1
fi

echo ""
echo "🎉 DEPLOY CONCLUÍDO COM SUCESSO!"
echo "================================="
echo "✅ Aplicação: https://tubemine.com.br"
echo "✅ Admin: https://tubemine.com.br/admin"
echo "✅ Login: admin@tubemine.com"
echo "✅ Senha: b50x20Hi@"
echo ""
echo "📊 Status PM2:"
pm2 list
echo ""
echo "🔍 Logs recentes:"
pm2 logs tubemine --lines 5
