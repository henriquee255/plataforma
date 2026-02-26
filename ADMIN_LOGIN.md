# 🔐 Credenciais de Administrador

## Login Admin - Acesso ao Painel Administrativo

Para acessar o painel administrativo completo, utilize as seguintes credenciais:

```
Email:    admin@plataforma.com
Senha:    admin@2026
```

---

## 📋 Informações Importantes

### Acesso ao Painel Admin
- **URL**: `/admin` após login
- **Permissões**: Acesso total ao sistema
- **Role**: `admin`

### O que o Admin pode fazer:
✅ Visualizar estatísticas globais do sistema
✅ Gerenciar todos os usuários
✅ Acessar logs de atividades
✅ Configurar integrações
✅ Gerenciar assinaturas e planos
✅ Visualizar métricas de uso
✅ Acessar configurações avançadas

---

## 🔒 Segurança

### Proteção Implementada:
- ✅ Apenas usuários com `role: 'admin'` podem acessar `/admin`
- ✅ Redirecionamento automático para página "Não Autorizado" se não for admin
- ✅ Credenciais hardcoded no `authService.js` (linhas 70-87)

### Para Produção:
⚠️ **IMPORTANTE**: Antes de fazer deploy em produção:
1. Altere as credenciais de admin
2. Implemente backend real com hash de senhas
3. Adicione autenticação de dois fatores (2FA)
4. Configure rate limiting para prevenir brute force

---

## 👥 Usuários Normais

Usuários que se registrarem normalmente terão:
- **Role**: `user`
- **Acesso**: Todas as funcionalidades da plataforma (sem restrições de assinatura)
- **Painel Admin**: ❌ Não podem acessar

---

## 🎯 Fluxo de Autenticação

1. **Usuário tenta fazer login**
2. **Sistema verifica credenciais**
   - Se for `admin@plataforma.com` → Login como Admin
   - Se for email cadastrado → Login como User normal
   - Se não encontrar → Erro de autenticação
3. **Após login bem-sucedido**
   - Admin pode acessar `/admin`
   - User normal é redirecionado se tentar acessar `/admin`

---

## 📂 Arquivos Relacionados

### Autenticação:
- `src/services/authService.js` - Lógica de login hardcoded (linhas 70-87)
- `src/contexts/AuthContext.jsx` - Contexto de autenticação
- `src/hooks/useAuth.js` - Hook de autenticação

### Proteção Admin:
- `src/pages/Admin.jsx` - Componente protegido (linhas 49-54)
- `src/pages/Unauthorized.jsx` - Página de acesso negado

### Sem Restrições:
- `src/contexts/AppContext.jsx` - Todas as verificações de plano retornam `true`

---

## 🚀 Como Testar

### 1. Login como Admin:
```
1. Acesse http://localhost:5180/login
2. Digite: admin@plataforma.com
3. Senha: admin@2026
4. Após login, navegue para /admin
✅ Deve mostrar o painel administrativo completo
```

### 2. Login como Usuário Normal:
```
1. Acesse http://localhost:5180/register
2. Crie uma conta com qualquer email
3. Após login, tente acessar /admin
❌ Deve ser redirecionado para página "Acesso Negado"
```

---

## 📝 Notas de Desenvolvimento

- **Sem Backend**: Sistema usa localStorage e mocks
- **Sem Restrições de Assinatura**: Todos têm acesso completo (Enterprise)
- **Admin Hardcoded**: Credenciais definidas no código
- **Segurança Mock**: Apenas para desenvolvimento/demonstração

---

**Data de Criação**: 24/02/2026
**Versão**: 1.0
**Status**: ✅ Pronto para uso
