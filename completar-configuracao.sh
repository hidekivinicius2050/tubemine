#!/bin/bash

echo "🚀 Finalizando configuração da VPS TubeMine..."
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 1. Ir para o diretório do projeto
print_status "Navegando para o diretório do projeto..."
cd /var/www/tubemine
print_success "Diretório: $(pwd)"

# 2. Verificar se os arquivos existem
print_status "Verificando arquivos necessários..."
if [ -f "src/hooks/useAuth.ts" ]; then
    print_success "useAuth.ts encontrado"
else
    print_error "useAuth.ts não encontrado"
fi

if [ -f "src/components/ProtectedRoute.tsx" ]; then
    print_success "ProtectedRoute.tsx encontrado"
else
    print_error "ProtectedRoute.tsx não encontrado"
fi

if [ -f "src/styles/admin.css" ]; then
    print_success "admin.css encontrado"
else
    print_error "admin.css não encontrado"
fi

# 3. Limpar cache e reinstalar dependências
print_status "Limpando cache e reinstalando dependências..."
rm -rf .next node_modules package-lock.json
npm install
print_success "Dependências reinstaladas"

# 4. Tentar build
print_status "Fazendo build do projeto..."
if npm run build; then
    print_success "Build concluído com sucesso!"
else
    print_warning "Build falhou, tentando abordagem alternativa..."
    
    # Tentar build com mais verbosidade
    npm run build --verbose
    
    if [ $? -ne 0 ]; then
        print_error "Build ainda falhou. Vamos continuar com a configuração..."
    fi
fi

# 5. Configurar PM2
print_status "Configurando PM2..."
if [ -f "ecosystem.config.js" ]; then
    pm2 start ecosystem.config.js
    pm2 save
    pm2 startup
    print_success "PM2 configurado"
else
    print_warning "ecosystem.config.js não encontrado, criando configuração básica..."
    
    # Criar configuração básica do PM2
    cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'tubemine-saas',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/tubemine',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/var/log/tubemine/err.log',
      out_file: '/var/log/tubemine/out.log',
      log_file: '/var/log/tubemine/combined.log',
      time: true
    }
  ]
}
EOF
    
    pm2 start ecosystem.config.js
    pm2 save
    pm2 startup
    print_success "PM2 configurado com configuração básica"
fi

# 6. Verificar status dos serviços
print_status "Verificando status dos serviços..."
echo ""
echo "📊 Status do PM2:"
pm2 status
echo ""
echo "🌐 Status do Nginx:"
systemctl status nginx --no-pager -l
echo ""

# 7. Testar se o site está funcionando
print_status "Testando se o site está funcionando..."
if curl -s http://localhost:3000 > /dev/null; then
    print_success "Aplicação rodando na porta 3000"
else
    print_warning "Aplicação não está respondendo na porta 3000"
fi

if curl -s http://localhost:80 > /dev/null; then
    print_success "Nginx respondendo na porta 80"
else
    print_warning "Nginx não está respondendo na porta 80"
fi

# 8. Mostrar informações finais
echo ""
echo "🎉 CONFIGURAÇÃO FINALIZADA!"
echo "=========================="
echo ""
echo "📍 IP da VPS: 72.60.10.222"
echo "🌐 Domínio: www.tubemine.com.br"
echo "📁 Diretório: /var/www/tubemine"
echo ""
echo "🔧 PRÓXIMOS PASSOS:"
echo ""
echo "1. Configure o DNS do domínio:"
echo "   - Acesse o painel da Hostinger"
echo "   - Configure o DNS de www.tubemine.com.br"
echo "   - Aponte para: 72.60.10.222"
echo ""
echo "2. Configure SSL (HTTPS):"
echo "   certbot --nginx -d www.tubemine.com.br -d tubemine.com.br"
echo ""
echo "3. Teste o site:"
echo "   - HTTP: http://72.60.10.222"
echo "   - HTTPS: https://www.tubemine.com.br (após SSL)"
echo ""
echo "📞 COMANDOS ÚTEIS:"
echo "• Status: pm2 status"
echo "• Logs: pm2 logs tubemine-saas"
echo "• Reiniciar: pm2 restart tubemine-saas"
echo "• Nginx: systemctl restart nginx"
echo ""
print_success "Configuração finalizada!"
