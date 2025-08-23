#!/bin/bash

# Script de Rollback - TubeMine
# Para casos de emergência quando o deploy falha

echo "🔄 INICIANDO ROLLBACK DE EMERGÊNCIA - TUBEMINE"
echo "=============================================="

# 1. PARAR APLICAÇÃO
echo "⏹️  1. Parando aplicação..."
pm2 stop tubemine
echo "✅ Aplicação parada"

# 2. RESTAURAR BANCO DE DADOS
echo "🗄️  2. Restaurando banco de dados..."
BACKUP_FILE=$(ls -t database.sqlite.backup.* 2>/dev/null | head -1)
if [ -n "$BACKUP_FILE" ]; then
    cp "$BACKUP_FILE" database.sqlite
    echo "✅ Banco restaurado de: $BACKUP_FILE"
else
    echo "⚠️  Nenhum backup encontrado, mantendo banco atual"
fi

# 3. VOLTAR PARA COMMIT ANTERIOR
echo "📥 3. Voltando para commit anterior..."
git log --oneline -5
echo ""
read -p "Digite o hash do commit para voltar (ou Enter para voltar 1 commit): " COMMIT_HASH

if [ -z "$COMMIT_HASH" ]; then
    git reset --hard HEAD~1
    echo "✅ Voltou 1 commit"
else
    git reset --hard "$COMMIT_HASH"
    echo "✅ Voltou para commit: $COMMIT_HASH"
fi

# 4. REINSTALAR DEPENDÊNCIAS
echo "📦 4. Reinstalando dependências..."
npm ci --production
echo "✅ Dependências reinstaladas"

# 5. REBUILD
echo "🔨 5. Fazendo rebuild..."
npm run build
echo "✅ Build concluído"

# 6. COPIAR ARQUIVOS ESTÁTICOS
echo "📁 6. Copiando arquivos estáticos..."
if [ -d ".next/static" ]; then
    mkdir -p .next/standalone/.next
    cp -r .next/static .next/standalone/.next/
    echo "✅ Arquivos estáticos copiados"
fi

# 7. REINICIAR APLICAÇÃO
echo "🔄 7. Reiniciando aplicação..."
pm2 start tubemine
sleep 3

# 8. VERIFICAR STATUS
echo "📊 8. Verificando status..."
if pm2 list | grep -q "online"; then
    echo "✅ Aplicação online"
else
    echo "❌ Aplicação offline!"
    pm2 logs tubemine --lines 10
    exit 1
fi

# 9. TESTE FINAL
echo "🎯 9. Teste final..."
sleep 2
if curl -s -X POST http://localhost:3000/api/test-login | grep -q "Login realizado com sucesso"; then
    echo "✅ Teste final passou"
else
    echo "❌ Teste final falhou!"
    exit 1
fi

echo ""
echo "🎉 ROLLBACK CONCLUÍDO COM SUCESSO!"
echo "=================================="
echo "✅ Sistema restaurado para versão anterior"
echo "✅ Aplicação funcionando"
echo ""
echo "📊 Status PM2:"
pm2 list
