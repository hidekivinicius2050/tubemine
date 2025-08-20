# 🚀 TubeMine Platform v0.2.0

**Sistema completo de mineração de vídeos virais com assinatura mensal via Stripe**

## ✨ Funcionalidades

### 🔐 Sistema de Autenticação
- **Registro e Login** com banco SQLite
- **JWT Tokens** para sessões seguras
- **Proteção de rotas** por autenticação
- **Mudança de senha** com validação
- **Logout** com limpeza de sessão

### 💳 Sistema de Assinatura (Stripe)
- **Plano Grátis**: 1 busca por dia
- **Plano PRO**: R$ 19,90/mês - buscas ilimitadas
- **Stripe Checkout** para pagamentos seguros
- **Webhooks** para sincronização automática
- **Renovação automática** mensal
- **Cancelamento** a qualquer momento

### 🔍 Buscador de Vídeos Virais
- **API do YouTube** integrada
- **Filtros avançados**: país, idioma, datas, visualizações, likes
- **Paginação** (10 vídeos por página)
- **Download de thumbnails**
- **Ordenação** por relevância, visualizações, likes, data

### 👥 Painel Administrativo
- **Listagem de usuários**
- **Controle de acesso** por role
- **Estatísticas** de uso

### 🆘 Central de Suporte
- **Contato direto** (email/WhatsApp)
- **Informações** de contato
- **Tickets de suporte**

## 🛠️ Tecnologias

- **Frontend**: Next.js 14, React, TypeScript
- **Backend**: Node.js, SQLite, bcryptjs, JWT
- **Pagamentos**: Stripe (Checkout + Webhooks)
- **APIs**: YouTube Data API v3
- **Estilização**: CSS moderno com gradientes e animações

## 📦 Instalação

### 1. Clone o repositório
```bash
git clone <repository-url>
cd saas
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env.local` na raiz do projeto:

```env
# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
STRIPE_PRO_PLAN_PRICE_ID=price_your_pro_plan_price_id_here

# Database
DATABASE_URL=./database.sqlite
```

### 4. Configure o Stripe

#### 4.1 Crie uma conta no Stripe
- Acesse [stripe.com](https://stripe.com)
- Crie uma conta e obtenha suas chaves de teste

#### 4.2 Crie um produto e preço
1. No Dashboard do Stripe, vá para **Products**
2. Crie um novo produto chamado "TubeMine PRO"
3. Adicione um preço recorrente de R$ 19,90/mês
4. Copie o `price_id` gerado

#### 4.3 Configure o webhook
1. No Dashboard do Stripe, vá para **Webhooks**
2. Adicione endpoint: `https://seu-dominio.com/api/stripe/webhook`
3. Selecione os eventos:
   - `checkout.session.completed`
   - `invoice.paid`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copie o `webhook_secret` gerado

### 5. Inicie o servidor
```bash
# Usando o script automatizado
node start-server.js

# Ou manualmente
npm run dev
```

## 🚀 Como Usar

### Acesso Inicial
- **URL**: http://localhost:3000
- **Admin**: admin@tubemine.com / admin123

### Fluxo de Usuário

#### 1. **Primeira Visita**
- Usuário se registra ou faz login
- Modal de boas-vindas aparece com planos
- Pode escolher entre Grátis ou PRO

#### 2. **Plano Grátis**
- **1 busca por dia**
- Na 2ª busca: modal bloqueante aparece
- Oferece upgrade para PRO

#### 3. **Plano PRO**
- **Buscas ilimitadas**
- **R$ 19,90/mês**
- **Renovação automática**
- **Cancelamento a qualquer momento**

#### 4. **Pagamento**
- Clique em "Assinar PRO"
- Redirecionamento para Stripe Checkout
- Pagamento seguro via cartão
- Ativação imediata após confirmação

## 📊 Estrutura do Banco

### Tabelas Principais
```sql
-- Usuários
users (id, name, email, password_hash, role, stripe_customer_id)

-- Sessões
user_sessions (id, user_id, token, created_at)

-- Assinaturas
subscriptions (id, user_id, stripe_subscription_id, status, plan_type, valid_until)

-- Logs de Busca
search_logs (id, user_id, search_query, results_count, created_at)

-- Tickets de Suporte
support_tickets (id, user_id, subject, message, status, created_at)
```

## 🔧 APIs

### Autenticação
- `POST /api/auth/register` - Registro de usuário
- `POST /api/auth/login` - Login
- `POST /api/auth/verify` - Verificação de token
- `POST /api/auth/logout` - Logout
- `POST /api/auth/change-password` - Mudança de senha

### Assinatura
- `POST /api/stripe/create-checkout-session` - Criar sessão de pagamento
- `POST /api/stripe/webhook` - Webhook do Stripe
- `GET /api/me/subscription` - Status da assinatura
- `POST /api/search/log` - Registrar busca

### Administração
- `GET /api/admin/users` - Listar usuários
- `POST /api/support` - Criar ticket de suporte

## 🎨 Interface

### Design System
- **Tema Dark** consistente
- **Gradientes** modernos
- **Animações** suaves
- **Responsivo** para mobile

### Componentes
- **Navigation** com menu de perfil
- **SubscriptionModal** para planos
- **ChangePasswordModal** para alteração de senha
- **SupportModal** para suporte
- **Notification** para feedback

## 🔒 Segurança

### Autenticação
- **JWT Tokens** com expiração
- **Hash bcrypt** para senhas
- **Sessões** no banco de dados
- **Proteção de rotas** por middleware

### Pagamentos
- **Stripe Checkout** (PCI compliant)
- **Webhook signature** verification
- **Server-side** validation
- **Customer reconciliation**

### Dados
- **SQLite** com prepared statements
- **Validação** de entrada
- **Sanitização** de dados
- **Error handling** robusto

## 📈 Monitoramento

### Logs
- **Console logs** detalhados
- **Error tracking** em APIs
- **Webhook events** logging
- **Search analytics**

### Métricas
- **Usuários ativos**
- **Buscas realizadas**
- **Conversões** para PRO
- **Revenue** tracking

## 🚀 Deploy

### Produção
1. Configure variáveis de ambiente
2. Use `npm run build` para build
3. Configure webhook do Stripe para produção
4. Use HTTPS obrigatório
5. Configure domínio personalizado

### Variáveis de Produção
```env
NODE_ENV=production
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
JWT_SECRET=super-secret-production-key
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

- **Email**: suporte@tubemine.com
- **WhatsApp**: (11) 99999-9999
- **Horário**: Segunda a Sexta, 9h às 18h

---

**Desenvolvido com ❤️ para mineradores de vídeos virais**
