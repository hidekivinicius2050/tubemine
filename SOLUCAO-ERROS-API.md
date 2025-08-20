# 🔧 Guia de Solução de Problemas - API do YouTube

## ❌ Erro: "API do YouTube não está habilitada"

### 🎯 **Problema:**
A API do YouTube Data v3 não está habilitada no seu projeto do Google Cloud Console.

### ✅ **Solução:**

1. **Acesse o Google Cloud Console:**
   - Vá para: https://console.cloud.google.com/
   - Faça login com sua conta Google

2. **Selecione seu projeto:**
   - No topo da página, clique no seletor de projetos
   - Escolha o projeto onde você criou sua chave da API

3. **Habilite a API do YouTube:**
   - Vá para: https://console.cloud.google.com/apis/library/youtube.googleapis.com
   - Ou navegue: **APIs & Services** → **Library** → **YouTube Data API v3**
   - Clique em **"Enable"** (Habilitar)

4. **Aguarde a propagação:**
   - Pode levar alguns minutos para a API ficar ativa
   - Tente novamente após 5-10 minutos

### 🔗 **Links Úteis:**
- **Habilitar API:** https://console.cloud.google.com/apis/library/youtube.googleapis.com
- **Criar Chave API:** https://console.cloud.google.com/apis/credentials
- **Gerenciar Projetos:** https://console.cloud.google.com/

---

## ❌ Erro: "Limite de requisições da API atingido"

### 🎯 **Problema:**
Você atingiu o limite diário de requisições da API do YouTube.

### ✅ **Soluções:**

1. **Aguarde até amanhã:**
   - O limite é resetado diariamente
   - Tente novamente após 24 horas

2. **Use uma chave diferente:**
   - Crie uma nova chave da API
   - Cada chave tem seu próprio limite

3. **Verifique seu uso:**
   - Acesse: https://console.cloud.google.com/apis/dashboard
   - Veja o consumo da API

### 📊 **Limites da API:**
- **Gratuito:** 10.000 requisições/dia
- **Pago:** Até 300.000 requisições/dia

---

## ❌ Erro: "Acesso negado à API"

### 🎯 **Problema:**
Sua chave da API está incorreta ou não tem as permissões necessárias.

### ✅ **Soluções:**

1. **Verifique a chave:**
   - Copie a chave completa do Google Cloud Console
   - Não adicione espaços extras

2. **Crie uma nova chave:**
   - Vá para: https://console.cloud.google.com/apis/credentials
   - Clique em **"Create Credentials"** → **"API Key"**

3. **Configure restrições (opcional):**
   - Clique na chave criada
   - Em **"Application restrictions"** escolha **"HTTP referrers"**
   - Adicione: `localhost:3000/*`

---

## ❌ Erro: "Parâmetros inválidos na requisição"

### 🎯 **Problema:**
Os filtros aplicados estão causando erro na API.

### ✅ **Soluções:**

1. **Limpe os filtros:**
   - Clique em **"Limpar"**
   - Tente uma busca simples primeiro

2. **Verifique as datas:**
   - Data inicial deve ser anterior à data final
   - Use formato: DD/MM/AAAA

3. **Ajuste os números:**
   - Use apenas números nos campos de filtro
   - Não use pontos ou vírgulas

---

## 🆘 **Ainda com problemas?**

### 📞 **Contato:**
- **Email:** suporte@tubemine.com
- **Discord:** [Link do servidor]
- **Documentação:** [Link da documentação]

### 🔍 **Logs para Debug:**
Se precisar de ajuda, forneça:
1. A mensagem de erro completa
2. Os filtros que estava usando
3. A data/hora do erro

---

## ✅ **Checklist de Verificação:**

- [ ] API do YouTube Data v3 está habilitada
- [ ] Chave da API está correta
- [ ] Não atingiu o limite diário
- [ ] Filtros estão válidos
- [ ] Aguardou propagação da API (5-10 min)

---

## 🎯 **Dicas para Evitar Problemas:**

1. **Use chaves dedicadas:** Crie uma chave específica para o TubeMine
2. **Monitore o uso:** Verifique regularmente o consumo da API
3. **Configure restrições:** Limite o uso da chave ao seu domínio
4. **Faça backups:** Tenha chaves alternativas prontas
5. **Teste primeiro:** Sempre teste com busca simples antes de usar filtros complexos

---

*Última atualização: Dezembro 2024*
