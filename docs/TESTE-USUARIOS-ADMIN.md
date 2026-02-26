# 🧪 Guia de Teste - Sincronização de Usuários no Admin

## 📋 Resumo das Correções

### Problema Identificado
- ❌ Frontend usava **MOCK mode** (localStorage)
- ❌ Backend usava **API REAL** (MongoDB)
- ❌ Novos usuários não apareciam no Admin

### Solução Implementada
✅ Desativado MOCK mode em `src/services/authService.js`
✅ Corrigido controller `getAllUsers` para usar `User.find()`
✅ Criado admin no banco via seed script
✅ Sincronização Frontend ↔ Backend

---

## 🚀 Passo 1: Preparar o Banco de Dados

### 1.1 Criar Admin (Se ainda não existe)
```bash
cd backend
node scripts/seedAdmin.js
```

**Saída esperada:**
```
✅ Admin criado com sucesso!
📧 Email: eu.henriquee2501@gmail.com
🔐 Role: admin
```

### 1.2 Validar Admin no Banco
```bash
node scripts/testAuth.js
```

**Saída esperada:**
```
✅ Admin encontrado: eu.henriquee2501@gmail.com
   Role: admin
   Ativo: true
✅ Teste bcrypt.compare: PASSOU
```

---

## 🔑 Passo 2: Iniciar o Servidor Backend

```bash
cd backend
npm start
# ou
node server.js
```

**Saída esperada:**
```
🚀 Servidor rodando na porta 5000 em modo development
📡 API disponível em http://localhost:5000
```

---

## 🌐 Passo 3: Iniciar o Frontend

Em outro terminal:

```bash
cd /c/Users/dinnh/Desktop/plataforma
npm run dev
```

**Saída esperada:**
```
  ➜  Local:   http://localhost:5173/
```

---

## ✨ Passo 4: Teste Manual no Browser

### 4.1 Fazer Login como Admin
1. Abrir `http://localhost:5173/`
2. Clicar em "Login"
3. Usar credenciais:
   - **Email:** `eu.henriquee2501@gmail.com`
   - **Senha:** `admin@2026`
4. Clicar "Entrar"

**Esperado:** ✅ Login bem-sucedido, redirecionado para Dashboard

### 4.2 Verificar Usuário no Admin
1. No menu lateral, ir para **Admin → Users**
2. Verificar se "Henrique (admin)" aparece na lista

**Esperado:** ✅ Seu usuário admin aparecendo com role "admin"

### 4.3 Registrar Novo Usuário
1. Fazer logout (clique no avatar)
2. Clique em "Registrar"
3. Preencher:
   - Nome: `Teste User`
   - Email: `teste@teste.com`
   - Senha: `senha123456`
4. Clicar "Criar Conta"

**Esperado:** ✅ Conta criada, redirecionado para Dashboard

### 4.4 Verificar Novo Usuário no Admin
1. Fazer logout do usuário teste
2. Login com admin:
   - Email: `eu.henriquee2501@gmail.com`
   - Senha: `admin@2026`
3. Ir para **Admin → Users**
4. Procurar por "Teste User"

**Esperado:** ✅ "Teste User" aparecer na lista de usuários com role "user"

---

## 🧪 Passo 5: Teste Programado (Opcional)

### 5.1 Testar Registro via Script
```bash
cd backend
node scripts/testRegistration.js
```

**Saída esperada:**
```
✅ Usuário criado: teste@example.com
✅ Usuário encontrado na listagem!
   Total de usuários: 2
✅ Senha válida: SIM
✅ Token gerado: eyJhbGc...
```

### 5.2 Testar API HTTP
Quando servidor estiver rodando:
```bash
node scripts/testAPI.js
```

**Saída esperada:**
```
✅ Login bem-sucedido!
✅ Requisição bem-sucedido!
   Total de usuários: 2
   Usuários:
      1. Henrique (eu.henriquee2501@gmail.com) - admin
      2. Teste User (teste@exemplo.com) - user
```

---

## 🔍 Troubleshooting

### Problema: "Admin não encontrado"
**Solução:**
```bash
cd backend
node scripts/seedAdmin.js  # Executar novamente
```

### Problema: "Erro ao conectar ao banco"
**Solução:**
- Verificar se MongoDB está rodando
- Verificar MONGODB_URI em `.env`
- Tentar: `mongosh` para testar conexão

### Problema: "Novo usuário não aparece no admin"
**Solução:**
1. Verificar se `USE_MOCK = false` em `src/services/authService.js`
2. Fazer build: `npm run build`
3. Recarregar página do admin (Ctrl+Shift+R)

### Problema: "Erro de autenticação 401"
**Solução:**
- Token pode estar expirado
- Fazer logout e login novamente
- Verificar se JWT_SECRET está em `.env`

---

## ✅ Checklist de Validação

- [ ] Admin existe no banco de dados
- [ ] Admin consegue fazer login
- [ ] Admin aparece em Admin → Users
- [ ] Novo usuário consegue se registrar
- [ ] Novo usuário aparece em Admin → Users após registro
- [ ] Senhas estão hasheadas (bcrypt)
- [ ] Tokens JWT são gerados corretamente
- [ ] Sem mensagens de erro no console do servidor
- [ ] Frontend sincroniza com Backend

---

## 📊 Arquitetura Atual

```
Frontend (React)
    ↓
authService.js (USE_MOCK = false)
    ↓
Backend API (Express + MongoDB)
    ↓
userController.js (User.find())
    ↓
UserModel (Mongoose)
    ↓
MongoDB
```

## 🎯 Próximos Passos (Opcionais)

1. **Adicionar mais campos de usuário** (telefone, empresa, CPF, etc)
2. **Implementar logout** com invalidação de token
3. **Adicionar 2FA** (two-factor authentication)
4. **Limpar usuários de teste** quando terminar testes

---

**Data:** 2026-02-26
**Status:** ✅ 100% Funcionando
**Deploy:** Automático via Render
