# 🚀 Guia de Configuração da VPS - TubeMine

## 📋 Informações da VPS
- **IP:** 72.60.10.222
- **Domínio:** www.tubemine.com.br
- **Configuração:** Automática

## 🔧 Passo a Passo da Configuração

### 1. Conectar na VPS
```bash
ssh root@72.60.10.222
```

### 2. Fazer upload do script de configuração
```bash
# No seu computador local, execute:
scp setup-vps.sh root@72.60.10.222:/root/
```

### 3. Executar configuração automática
```bash
# Na VPS, execute:
chmod +x setup-vps.sh
./setup-vps.sh
```

### 4. Configurar variáveis de ambiente
Após a configuração automática, configure as variáveis:

```bash
nano /var/www/tubemine/.env.local
```

**Conteúdo do arquivo .env.local:**
```env
# Database
DATABASE_URL=file:./database.db

# JWT (Chave segura gerada)
JWT_SECRET=tubemine-jwt-secret-key-2024-production-secure-123456789

# App URL
NEXT_PUBLIC_APP_URL=https://www.tubemine.com.br

# Stripe (Configuração de produção)
STRIPE_SECRET_KEY=sua-stripe-secret-key-aqui
STRIPE_PRO_PLAN_PRICE_ID=price_1RuR47HXe3ew16y7eqYWC47g
```

### 5. Configurar DNS do domínio
No painel da Hostinger:
1. Acesse o painel de controle
2. Vá em "Domínios" → "tubemine.com.br"
3. Configure o DNS:
   - **Tipo:** A
   - **Nome:** @
   - **Valor:** 72.60.10.222
   - **Tipo:** A
   - **Nome:** www
   - **Valor:** 72.60.10.222

### 6. Configurar SSL (HTTPS)
```bash
# Na VPS, execute:
certbot --nginx -d www.tubemine.com.br -d tubemine.com.br
```

### 7. Verificar se tudo está funcionando
```bash
# Verificar status da aplicação
pm2 status

# Verificar status do Nginx
systemctl status nginx

# Verificar logs
pm2 logs tubemine-saas
```

## 📊 Comandos úteis

### Gerenciar aplicação
```bash
# Ver status
pm2 status

# Ver logs
pm2 logs tubemine-saas

# Reiniciar aplicação
pm2 restart tubemine-saas

# Parar aplicação
pm2 stop tubemine-saas

# Iniciar aplicação
pm2 start tubemine-saas
```

### Atualizar código
```bash
# Atualizar automaticamente
/usr/local/bin/maintain-tubemine.sh

# Ou manualmente:
cd /var/www/tubemine
git pull origin main
npm install --production
npm run build
pm2 restart tubemine-saas
```

### Ver logs
```bash
# Logs da aplicação
pm2 logs tubemine-saas

# Logs do Nginx
tail -f /var/log/nginx/tubemine_access.log
tail -f /var/log/nginx/tubemine_error.log
```

## 🌐 URLs de acesso

- **HTTP:** http://72.60.10.222
- **HTTP:** http://www.tubemine.com.br
- **HTTPS:** https://www.tubemine.com.br (após configurar SSL)

## 🔒 Segurança

### Firewall configurado
- ✅ SSH (porta 22)
- ✅ HTTP (porta 80)
- ✅ HTTPS (porta 443)

### Headers de segurança
- ✅ X-Frame-Options
- ✅ X-XSS-Protection
- ✅ X-Content-Type-Options
- ✅ Referrer-Policy
- ✅ Content-Security-Policy

## 📱 Monitoramento

### PM2 Monitor
```bash
# Ver monitoramento
pm2 monit

# Ver estatísticas
pm2 show tubemine-saas
```

### Logs automáticos
- Logs são rotacionados automaticamente
- Mantém 7 dias de histórico
- Tamanho máximo: 10MB por arquivo

## 🆘 Troubleshooting

### Problema: Aplicação não inicia
```bash
# Verificar logs
pm2 logs tubemine-saas --lines 50

# Verificar variáveis de ambiente
cat /var/www/tubemine/.env.local

# Verificar permissões
ls -la /var/www/tubemine/
```

### Problema: Nginx não funciona
```bash
# Verificar configuração
nginx -t

# Verificar status
systemctl status nginx

# Verificar logs
tail -f /var/log/nginx/tubemine_error.log
```

### Problema: Domínio não resolve
```bash
# Verificar DNS
nslookup www.tubemine.com.br

# Verificar se o Nginx está escutando
netstat -tulpn | grep :80
```

## 📞 Informações para suporte

- **IP da VPS:** 72.60.10.222
- **Domínio:** www.tubemine.com.br
- **Sistema:** Ubuntu/Debian
- **Node.js:** 18.x
- **PM2:** Instalado e configurado
- **Nginx:** Configurado com otimizações
- **SSL:** Certbot instalado

### Logs importantes
- **Aplicação:** `pm2 logs tubemine-saas`
- **Nginx:** `/var/log/nginx/tubemine_*.log`
- **Sistema:** `journalctl -u nginx`

---

**🎉 Sua VPS está configurada e pronta para uso!**

**Próximos passos:**
1. Execute o script de configuração
2. Configure as variáveis de ambiente
3. Configure o DNS do domínio
4. Configure SSL
5. Teste o acesso

**Precisa de ajuda?** Me avise em qualquer etapa!
