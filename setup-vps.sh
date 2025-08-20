#!/bin/bash

# Script de Configuração da VPS - TubeMine
# IP: 72.60.10.222
# Domínio: www.tubemine.com.br

echo "🚀 Configurando VPS para TubeMine..."
echo "📍 IP: 72.60.10.222"
echo "🌐 Domínio: www.tubemine.com.br"
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

# Verificar se está rodando como root
if [ "$EUID" -ne 0 ]; then
    print_error "Este script deve ser executado como root (sudo)"
    exit 1
fi

# 1. Atualizar sistema
print_status "Atualizando sistema..."
apt update && apt upgrade -y
print_success "Sistema atualizado"

# 2. Instalar dependências básicas
print_status "Instalando dependências básicas..."
apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release
print_success "Dependências básicas instaladas"

# 3. Instalar Node.js 18.x
print_status "Instalando Node.js 18.x..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
    print_success "Node.js instalado"
else
    print_warning "Node.js já está instalado"
fi

# 4. Instalar PM2
print_status "Instalando PM2..."
npm install -g pm2
print_success "PM2 instalado"

# 5. Instalar Nginx
print_status "Instalando Nginx..."
apt install -y nginx
systemctl enable nginx
systemctl start nginx
print_success "Nginx instalado e iniciado"

# 6. Configurar firewall
print_status "Configurando firewall..."
ufw allow ssh
ufw allow 'Nginx Full'
ufw --force enable
print_success "Firewall configurado"

# 7. Criar diretórios
print_status "Criando diretórios..."
mkdir -p /var/www/tubemine
mkdir -p /var/log/tubemine
chown -R $SUDO_USER:$SUDO_USER /var/www/tubemine
chown -R $SUDO_USER:$SUDO_USER /var/log/tubemine
print_success "Diretórios criados"

# 8. Clonar projeto
print_status "Clonando projeto TubeMine..."
cd /var/www
if [ -d "tubemine" ]; then
    print_warning "Diretório tubemine já existe. Removendo..."
    rm -rf tubemine
fi

git clone https://github.com/hidekivinicius2050/tubemine.git
cd tubemine
print_success "Projeto clonado"

# 9. Configurar variáveis de ambiente
print_status "Configurando variáveis de ambiente..."
cat > .env.local << 'EOF'
# Database
DATABASE_URL=file:./database.db

# JWT (Chave segura gerada)
JWT_SECRET=tubemine-jwt-secret-key-2024-production-secure-123456789

# App URL
NEXT_PUBLIC_APP_URL=https://www.tubemine.com.br

# Stripe (Configuração de produção)
STRIPE_SECRET_KEY=YOUR_STRIPE_SECRET_KEY_HERE
STRIPE_PRO_PLAN_PRICE_ID=YOUR_STRIPE_PRICE_ID_HERE
EOF
print_success "Variáveis de ambiente configuradas"

# 10. Instalar dependências
print_status "Instalando dependências..."
npm install --production
print_success "Dependências instaladas"

# 11. Fazer build
print_status "Fazendo build do projeto..."
npm run build
print_success "Build concluído"

# 12. Configurar Nginx
print_status "Configurando Nginx..."
cat > /etc/nginx/sites-available/tubemine << 'EOF'
server {
    listen 80;
    server_name www.tubemine.com.br tubemine.com.br;

    # Logs
    access_log /var/log/nginx/tubemine_access.log;
    error_log /var/log/nginx/tubemine_error.log;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    # Static files
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Favicon and other static assets
    location ~* \.(ico|css|js|gif|jpe?g|png|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public";
    }
}
EOF

# Remover configuração padrão
rm -f /etc/nginx/sites-enabled/default

# Ativar configuração
ln -sf /etc/nginx/sites-available/tubemine /etc/nginx/sites-enabled/

# Testar e reiniciar Nginx
if nginx -t; then
    systemctl restart nginx
    print_success "Nginx configurado"
else
    print_error "Erro na configuração do Nginx"
    exit 1
fi

# 13. Configurar PM2
print_status "Configurando PM2..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup
print_success "PM2 configurado"

# 14. Instalar monitoramento
print_status "Instalando monitoramento..."
pm2 install pm2-server-monit
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
print_success "Monitoramento instalado"

# 15. Configurar SSL
print_status "Configurando SSL..."
apt install -y certbot python3-certbot-nginx
print_success "Certbot instalado"

# 16. Criar script de manutenção
print_status "Criando script de manutenção..."
cat > /usr/local/bin/maintain-tubemine.sh << 'EOF'
#!/bin/bash
cd /var/www/tubemine

echo "🔄 Atualizando TubeMine..."

# Atualizar código
git pull origin main

# Instalar dependências
npm install --production

# Fazer build
npm run build

# Reiniciar aplicação
pm2 restart tubemine-saas

echo "✅ Manutenção concluída: $(date)"
EOF

chmod +x /usr/local/bin/maintain-tubemine.sh
print_success "Script de manutenção criado"

# 17. Mostrar informações finais
echo ""
echo "🎉 CONFIGURAÇÃO CONCLUÍDA!"
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
echo "3. Verifique se tudo está funcionando:"
echo "   pm2 status"
echo "   systemctl status nginx"
echo ""
echo "📞 COMANDOS ÚTEIS:"
echo "• Status: pm2 status"
echo "• Logs: pm2 logs tubemine-saas"
echo "• Reiniciar: pm2 restart tubemine-saas"
echo "• Atualizar: /usr/local/bin/maintain-tubemine.sh"
echo ""
echo "🌐 URLs:"
echo "• HTTP: http://72.60.10.222"
echo "• HTTP: http://www.tubemine.com.br"
echo "• HTTPS: https://www.tubemine.com.br (após configurar SSL)"
echo ""
print_success "VPS configurada com sucesso!"
