#!/bin/bash

echo "🚀 Iniciando deploy do TubeMine..."

# Conectar ao servidor e fazer deploy
ssh root@45.79.12.84 << 'EOF'

echo "📁 Acessando diretório do projeto..."
cd /var/www/tubemine

echo "🔄 Fazendo pull das últimas mudanças..."
git pull origin main

echo "📦 Instalando dependências..."
npm install

echo "🔨 Fazendo build da aplicação..."
npm run build

echo "🔄 Reiniciando aplicação..."
pm2 restart tubemine

echo "🌐 Reiniciando Nginx..."
systemctl restart nginx

echo "✅ Deploy concluído com sucesso!"
echo "🌍 Acesse: https://www.tubemine.com.br"

EOF

echo "🎉 Deploy finalizado!"
