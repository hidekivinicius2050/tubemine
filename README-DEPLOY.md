# 🚀 Deploy do TubeMine SaaS na VPS Hostinger

Este guia te ajudará a fazer o deploy do TubeMine SaaS na sua VPS da Hostinger.

## 📋 Pré-requisitos

- VPS Linux na Hostinger
- Acesso SSH à VPS
- Domínio configurado (opcional, mas recomendado)

## 🔧 Passo a Passo

### 1. Conectar via SSH
```bash
ssh root@seu-ip-da-vps
```

### 2. Upload dos arquivos
Você pode fazer upload dos arquivos de várias formas:

#### Opção A: Via Git (Recomendado)
```bash
# Na VPS
cd /var/www
git clone https://github.com/hidekivinicius2050/tubemine.git
cd tubemine
```

#### Opção B: Via SCP
```bash
# No seu computador local
scp -r ./* root@seu-ip-da-vps:/var/www/tubemine-saas/
```

#### Opção C: Via File Manager da Hostinger
- Acesse o painel da Hostinger
- Vá em "File Manager"
- Navegue até `/var/www/`
- Faça upload dos arquivos

### 3. Configurar variáveis de ambiente
```bash
cd /var/www/tubemine-saas
nano .env.local
```

Adicione suas variáveis:
```env
# Database
DATABASE_URL=file:./database.db

# JWT
JWT_SECRET=sua-chave-secreta-muito-segura

# Email (AWS SES)
AWS_ACCESS_KEY_ID=sua-access-key
AWS_SECRET_ACCESS_KEY=sua-secret-key
AWS_REGION=us-east-1

# Stripe (opcional)
STRIPE_SECRET_KEY=sua-stripe-secret-key
STRIPE_PRO_PLAN_PRICE_ID=price_xxx

# App URL
NEXT_PUBLIC_APP_URL=https://seu-dominio.com
```

### 4. Executar script de deploy
```bash
chmod +x deploy.sh
./deploy.sh
```

# Criar diretório do projeto
echo "📁 Criando diretório do projeto..."
sudo mkdir -p /var/www/tubemine
sudo mkdir -p /var/log/tubemine

# Definir permissões
sudo chown -R $USER:$USER /var/www/tubemine
sudo chown -R $USER:$USER /var/log/tubemine

# Navegar para o diretório
cd /var/www/tubemine

### 5. Configurar Nginx (Recomendado)
```bash
sudo apt install nginx
```

Criar configuração do site:
```bash
sudo nano /etc/nginx/sites-available/tubemine-saas
```

Conteúdo:
```nginx
server {
    listen 80;
    server_name seu-dominio.com www.seu-dominio.com;

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
    }
}
```

Ativar o site:
```bash
sudo ln -s /etc/nginx/sites-available/tubemine-saas /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6. Configurar SSL (HTTPS)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d seu-dominio.com -d www.seu-dominio.com
```

## 📊 Comandos úteis

### Gerenciar aplicação
```bash
# Ver status
pm2 status

# Ver logs
pm2 logs tubemine-saas

# Reiniciar
pm2 restart tubemine-saas

# Parar
pm2 stop tubemine-saas

# Iniciar
pm2 start tubemine-saas
```

### Atualizar aplicação
```bash
cd /var/www/tubemine-saas
git pull origin main
npm install
npm run build
pm2 restart tubemine-saas
```

### Ver logs do Nginx
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## 🔒 Segurança

### Firewall
```bash
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### Atualizações automáticas
```bash
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

## 📱 Monitoramento

### Instalar monitoramento básico
```bash
pm2 install pm2-server-monit
pm2 install pm2-logrotate
```

### Configurar alertas
```bash
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

## 🆘 Troubleshooting

### Aplicação não inicia
```bash
pm2 logs tubemine-saas --lines 50
```

### Erro de permissão
```bash
sudo chown -R $USER:$USER /var/www/tubemine-saas
```

### Porta em uso
```bash
sudo netstat -tulpn | grep :3000
sudo kill -9 PID_DO_PROCESSO
```

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs: `pm2 logs tubemine-saas`
2. Verifique o status: `pm2 status`
3. Reinicie a aplicação: `pm2 restart tubemine-saas`

---

**🎉 Parabéns! Seu TubeMine SaaS está rodando em produção!**
