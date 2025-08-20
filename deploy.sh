#!/bin/bash

# Script de Deploy para TubeMine SaaS
# Execute este script na sua VPS da Hostinger

echo "🚀 Iniciando deploy do TubeMine SaaS..."

# Atualizar sistema
echo "📦 Atualizando sistema..."
sudo apt update && sudo apt upgrade -y

# Instalar Node.js e npm (se não estiverem instalados)
if ! command -v node &> /dev/null; then
    echo "📥 Instalando Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Instalar PM2 globalmente
echo "📥 Instalando PM2..."
sudo npm install -g pm2

# Criar diretório do projeto
echo "📁 Criando diretório do projeto..."
sudo mkdir -p /var/www/tubemine
sudo mkdir -p /var/log/tubemine

# Definir permissões
sudo chown -R $USER:$USER /var/www/tubemine
sudo chown -R $USER:$USER /var/log/tubemine

# Navegar para o diretório
cd /var/www/tubemine

# Instalar dependências
echo "📦 Instalando dependências..."
npm install --production

# Fazer build do projeto
echo "🔨 Fazendo build do projeto..."
npm run build

# Iniciar aplicação com PM2
echo "🚀 Iniciando aplicação..."
pm2 start ecosystem.config.js

# Salvar configuração do PM2
pm2 save

# Configurar PM2 para iniciar com o sistema
pm2 startup

echo "✅ Deploy concluído!"
echo "🌐 Aplicação rodando em: http://localhost:3000"
echo "📊 Status: pm2 status"
echo "📋 Logs: pm2 logs tubemine-saas"
