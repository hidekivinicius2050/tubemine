# 🚀 Deploy de Produção - TubeMine

Este documento contém as instruções para fazer deploy seguro em produção.

## 📋 Pré-requisitos

- Node.js 18+ instalado
- PM2 instalado globalmente
- Nginx configurado
- Acesso SSH ao servidor
- Git configurado

## 🔧 Scripts Disponíveis

### 1. Deploy Automatizado
```bash
chmod +x deploy-production.sh
./deploy-production.sh
```

### 2. Verificação de Saúde
```bash
chmod +x health-check.sh
./health-check.sh
```

### 3. Rollback de Emergência
```bash
chmod +x rollback.sh
./rollback.sh
```

## 🎯 Processo de Deploy

### Passo 1: Preparação
```bash
# Conectar ao servidor
ssh root@tubemine.com.br

# Ir para o diretório da aplicação
cd /var/www/tubemine

# Dar permissão aos scripts
chmod +x deploy-production.sh health-check.sh rollback.sh
```

### Passo 2: Deploy
```bash
# Executar deploy automatizado
./deploy-production.sh
```

### Passo 3: Verificação
```bash
# Verificar saúde do sistema
./health-check.sh
```

## 🔍 Verificações Pós-Deploy

### 1. Status da Aplicação
```bash
pm2 list
pm2 logs tubemine --lines 10
```

### 2. Teste de Login
```bash
curl -X POST http://localhost:3000/api/test-login
```

### 3. Acesso Externo
- Site: https://tubemine.com.br
- Admin: https://tubemine.com.br/admin

## 🚨 Em Caso de Problemas

### Rollback Automático
```bash
./rollback.sh
```

### Verificação Manual
```bash
# Verificar logs
pm2 logs tubemine

# Verificar status
pm2 list

# Verificar porta
netstat -tlnp | grep :3000

# Verificar banco
ls -la database.sqlite*
```

## 📊 Monitoramento

### Logs Importantes
- **PM2:** `pm2 logs tubemine`
- **Nginx:** `tail -f /var/log/nginx/access.log`
- **Sistema:** `journalctl -u nginx`

### Métricas
- **CPU:** `htop`
- **Memória:** `free -h`
- **Disco:** `df -h`

## 🔐 Credenciais de Produção

### Admin
- **URL:** https://tubemine.com.br/admin
- **Email:** admin@tubemine.com
- **Senha:** b50x20Hi@

### Banco de Dados
- **Arquivo:** `/var/www/tubemine/database.sqlite`
- **Backup:** Automático antes de cada deploy

## ⚠️ Pontos de Atenção

1. **Sempre fazer backup** antes do deploy
2. **Testar APIs críticas** após deploy
3. **Verificar arquivos estáticos** estão copiados
4. **Monitorar logs** por pelo menos 5 minutos
5. **Ter plano de rollback** pronto

## 🆘 Contatos de Emergência

- **Servidor:** root@tubemine.com.br
- **Logs:** `/var/log/tubemine/`
- **Backup:** `database.sqlite.backup.*`

## 📈 Checklist de Deploy

- [ ] Backup do banco feito
- [ ] Código atualizado via Git
- [ ] Dependências instaladas
- [ ] Build executado com sucesso
- [ ] Arquivos estáticos copiados
- [ ] PM2 reiniciado
- [ ] API de login testada
- [ ] Site externo acessível
- [ ] Logs verificados
- [ ] Health check passou

---

**🎉 Sistema pronto para produção!**
