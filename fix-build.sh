#!/bin/bash

echo "🔧 Corrigindo problemas de build..."

cd /var/www/tubemine

# Limpar cache e dependências
echo "🧹 Limpando cache..."
rm -rf .next node_modules package-lock.json

# Reinstalar dependências
echo "📦 Reinstalando dependências..."
npm install

# Tentar build novamente
echo "🏗️ Fazendo build..."
npm run build

# Se o build falhar, vamos tentar uma abordagem alternativa
if [ $? -ne 0 ]; then
    echo "⚠️ Build falhou, tentando abordagem alternativa..."
    
    # Verificar se os arquivos existem
    echo "📁 Verificando arquivos..."
    ls -la src/hooks/useAuth.ts
    ls -la src/components/ProtectedRoute.tsx
    ls -la src/styles/admin.css
    
    # Tentar build com --debug
    echo "🔍 Build com debug..."
    npm run build -- --debug
fi

echo "✅ Processo concluído!"
