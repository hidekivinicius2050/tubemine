# 📋 Changelog

## [0.2.0] - 2024-12-19

### ✨ Novas Funcionalidades
- **Sistema de Chave da API Individual**: Cada usuário agora pode inserir sua própria chave da API do YouTube
- **Campo obrigatório de chave da API**: Validação para garantir que a chave seja fornecida antes da busca
- **Link direto para Google Cloud Console**: Acesso facilitado para obter chave da API gratuita
- **Layout de vídeos aprimorado**: Thumbnail grande à esquerda e informações organizadas à direita
- **Exibição de duração e data de upload**: Informações detalhadas de cada vídeo
- **Contagem correta de comentários**: Correção na busca de estatísticas de comentários

### 🔧 Melhorias Técnicas
- **Remoção do sistema de múltiplas chaves**: Simplificação para usar apenas a chave fornecida pelo usuário
- **Otimização da API de comentários**: Uso correto da API `videos` com `part=statistics`
- **Melhor validação de formulário**: Verificação obrigatória da chave da API
- **Estilos CSS aprimorados**: Layout mais moderno e responsivo
- **Correção de paginação**: Sistema de paginação funcionando corretamente

### 🐛 Correções
- **Erro de quota da API**: Resolvido com sistema de chave individual
- **Contagem incorreta de comentários**: Corrigida para usar dados corretos da API
- **Layout de vídeos**: Melhorado para exibição mais organizada
- **Validação de formulário**: Aprimorada para garantir chave da API

### 📱 Interface
- **Campo de chave da API**: Design integrado ao formulário
- **Layout de resultados**: Thumbnail grande (280px) com informações organizadas
- **Estilos modernos**: Gradientes e sombras aprimoradas
- **Responsividade**: Melhor adaptação para diferentes telas

### 🔒 Segurança
- **Validação de chave da API**: Verificação obrigatória antes das requisições
- **Tratamento de erros**: Melhor feedback para problemas de API

---

## [0.1.0] - 2024-12-18

### 🎉 Lançamento Inicial
- Sistema completo de autenticação
- Integração com Stripe para pagamentos
- Buscador de vídeos do YouTube
- Painel administrativo
- Sistema de assinaturas
- Central de suporte
