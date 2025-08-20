# 📧 Configuração do Sistema de E-mail - AWS SES

## 🚀 Visão Geral

O TubeMine agora possui integração completa com AWS SES (Simple Email Service) para envio de e-mails automáticos e notificações.

## 📋 Tipos de E-mail Implementados

### 1. **E-mail de Boas-vindas** 🎉
- **Quando**: Após registro de novo usuário
- **Conteúdo**: Boas-vindas, explicação dos recursos, plano atual

### 2. **Confirmação de Upgrade** ⭐
- **Quando**: Usuário é atualizado para Premium pelo admin
- **Conteúdo**: Confirmação, benefícios Premium, data de validade

### 3. **Assinatura Expirada** ⏰
- **Quando**: Assinatura Premium expira
- **Conteúdo**: Aviso de expiração, incentivo para renovar

### 4. **Redefinição de Senha** 🔐
- **Quando**: Usuário solicita redefinição de senha
- **Conteúdo**: Link seguro para redefinição (expira em 1 hora)

### 5. **Limite de Busca Atingido** ⚠️
- **Quando**: Usuário gratuito atinge limite diário
- **Conteúdo**: Incentivo para upgrade, benefícios Premium

### 6. **Notificações Administrativas** 📊
- **Quando**: Admin envia notificação manual
- **Conteúdo**: Relatórios, alertas, informações importantes

## ⚙️ Configuração do AWS SES

### 1. **Criar Conta AWS**
- Acesse [AWS Console](https://aws.amazon.com/)
- Crie uma conta ou use existente

### 2. **Configurar SES**
```bash
# 1. Acesse o console do SES
# 2. Vá para "Email Addresses" e verifique seu domínio
# 3. Configure as credenciais de acesso
```

### 3. **Variáveis de Ambiente**
Adicione ao seu arquivo `.env.local`:

```env
# Configurações do AWS SES
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1

# Configurações de E-mail
SES_FROM_EMAIL=noreply@yourdomain.com
SES_FROM_NAME=TubeMine Platform
SES_REPLY_TO=support@yourdomain.com
```

### 4. **Verificar Domínio no SES**
```bash
# 1. No console SES, vá para "Verified identities"
# 2. Clique em "Create identity"
# 3. Selecione "Domain" e adicione seu domínio
# 4. Siga as instruções para verificar o domínio
```

## 🔧 APIs Implementadas

### 1. **Registro de Usuário** (`POST /api/auth/register`)
- Envia e-mail de boas-vindas automaticamente

### 2. **Upgrade de Usuário** (`POST /api/admin/users/[userId]/upgrade`)
- Envia confirmação de upgrade

### 3. **Esqueci a Senha** (`POST /api/auth/forgot-password`)
- Envia link de redefinição

### 4. **Redefinir Senha** (`POST /api/auth/reset-password`)
- Processa redefinição com token

### 5. **Notificações Admin** (`POST /api/admin/notifications`)
- Envia notificações administrativas

## 📱 Templates de E-mail

Todos os e-mails usam templates HTML responsivos com:
- ✅ Design moderno e profissional
- ✅ Cores da marca TubeMine
- ✅ Botões de ação
- ✅ Informações relevantes
- ✅ Links para a plataforma

## 🛡️ Segurança

### Tokens de Redefinição
- Tokens únicos de 32 bytes
- Expiração em 1 hora
- Remoção automática após uso
- Invalidação de sessões ativas

### Validações
- Verificação de domínio no SES
- Rate limiting automático
- Logs de envio
- Tratamento de erros

## 🧪 Teste em Desenvolvimento

Se o SES não estiver configurado, o sistema:
- ✅ Continua funcionando normalmente
- ✅ Logs de debug para desenvolvimento
- ✅ Retorna tokens para teste (apenas em dev)

## 📊 Monitoramento

### Logs de E-mail
```bash
✅ E-mail enviado com sucesso: [MessageId]
❌ Erro ao enviar e-mail: [Error]
```

### Métricas no AWS SES
- Taxa de entrega
- Taxa de bounce
- Taxa de queixa
- Reputação do domínio

## 🚀 Próximos Passos

1. **Configurar domínio no SES**
2. **Adicionar variáveis de ambiente**
3. **Testar envio de e-mails**
4. **Monitorar métricas**
5. **Configurar alertas**

## 📞 Suporte

Para dúvidas sobre configuração:
- Documentação AWS SES
- Console AWS
- Logs da aplicação
