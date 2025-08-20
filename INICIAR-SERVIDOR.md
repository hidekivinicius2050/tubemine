# 🚀 Como Iniciar o Servidor TubeMine

## 📋 Pré-requisitos

- **Node.js** (versão 16 ou superior)
- **npm** (vem com o Node.js)

## 🎯 Métodos de Inicialização

### 1. **Método Mais Fácil - Windows**
```bash
# Duplo clique no arquivo:
start-server.bat
```

### 2. **Método Mais Fácil - Linux/Mac**
```bash
# Dar permissão de execução (primeira vez)
chmod +x start-server.sh

# Executar
./start-server.sh
```

### 3. **Usando npm**
```bash
npm run start:setup
```

### 4. **Usando Node.js diretamente**
```bash
node start-server.js
```

## 🔧 O que o script faz automaticamente:

1. ✅ **Verifica dependências** - Instala se necessário
2. ✅ **Configura banco de dados** - Cria se não existir
3. ✅ **Cria usuário admin** - Se necessário
4. ✅ **Limpa porta 3000** - Mata processos conflitantes
5. ✅ **Inicia servidor** - Na porta 3000

## 🧹 Limpeza Manual de Portas

Se o servidor ainda não iniciar na porta 3000, você pode limpar manualmente:

### **Windows:**
```bash
npm run clean:ports
# ou
node clean-ports.js
```

### **Linux/Mac:**
```bash
npm run clean:ports
# ou
node clean-ports.js
```

### **Comando direto (Windows):**
```bash
taskkill /f /im node.exe
```

### **Comando direto (Linux/Mac):**
```bash
pkill -f node
```

## 🌐 URLs do Sistema

Após a inicialização, acesse:

- **Login:** http://localhost:3000
- **Registro:** http://localhost:3000/registro
- **Buscador:** http://localhost:3000/buscador
- **Admin:** http://localhost:3000/admin

## 🔑 Credenciais Padrão

- **Admin:** `admin@tubemine.com` / `admin123`
- **Usuário comum:** Registre-se na página de registro

## ⏹️ Como Parar o Servidor

- Pressione **Ctrl+C** no terminal
- Ou feche a janela do terminal

## 🐛 Solução de Problemas

### Porta 3000 em uso:
```bash
# O script agora mata automaticamente processos conflitantes
# Se ainda houver problemas, execute:
npm run clean:ports
```

### Erro de dependências:
```bash
npm install
```

### Erro de banco de dados:
```bash
node scripts/create-admin.js
```

### Múltiplos processos Node.js:
```bash
# Windows
taskkill /f /im node.exe

# Linux/Mac
pkill -f node
```

## 📞 Suporte

Se encontrar problemas, verifique:
1. Node.js está instalado corretamente
2. Todas as dependências estão instaladas
3. Execute `npm run clean:ports` para limpar processos conflitantes
4. Reinicie o terminal se necessário

---

**🎉 Pronto! Seu servidor TubeMine está rodando na porta 3000!**
