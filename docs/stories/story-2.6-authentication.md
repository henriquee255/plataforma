# Story 2.6: Implementar Autenticação JWT

**Epic:** [Resolução de Débitos Técnicos](epic-technical-debt.md)
**Story ID:** 2.6
**Prioridade:** P1 (ALTA)
**Estimativa:** 40h
**Status:** ✅ Completo

---

## 📋 Objetivo

Implementar sistema de autenticação JWT completo com login, registro, refresh tokens e persistência segura.

---

## 👤 User Story

**Como** usuário,
**Quero** fazer login de forma segura,
**Para** acessar a plataforma com minha conta protegida.

---

## ✅ Critérios de Aceitação

### 1. Backend JWT (Node.js/Express)
- [x] Endpoint POST /api/auth/login (email, password)
- [x] Endpoint POST /api/auth/register (nome, email, password)
- [x] Endpoint POST /api/auth/refresh (refreshToken)
- [x] Endpoint POST /api/auth/logout
- [x] Geração de accessToken (15min) e refreshToken (7d)
- [x] Hash de senhas com bcrypt (salt rounds: 10)
- [x] Validação de inputs (Joi/Zod)

### 2. Frontend Auth Context
- [x] AuthContext com Provider
- [x] Estados: user, isAuthenticated, isLoading
- [x] Funções: login(), register(), logout(), refreshToken()
- [x] Persistência de tokens em httpOnly cookies OU localStorage (definir estratégia)
- [x] Auto-refresh antes de expiração

### 3. UI de Autenticação
- [x] Página de Login (/login)
- [x] Página de Registro (/register)
- [x] Formulários com validação (email, senha mínimo 8 chars)
- [x] Estados de loading durante submit
- [x] Mensagens de erro claras (ex: "Email já cadastrado")
- [x] Acessibilidade WCAG AA mantida

### 4. Integração com App
- [x] Substituir mock de usuário por AuthContext
- [x] Header atualizado com nome/avatar do user real
- [x] Dropdown de perfil com "Sair"
- [x] Redirecionar para /login se não autenticado

### 5. Segurança
- [x] Tokens armazenados de forma segura
- [x] HTTPS em produção (documentar)
- [x] Rate limiting no login (max 5 tentativas/min)
- [x] Validação de força de senha (opcional: biblioteca zxcvbn)

---

## 🛠️ Implementação Detalhada

### Backend Structure

```
backend/
├── controllers/
│   └── authController.js
├── middleware/
│   ├── authMiddleware.js
│   └── rateLimiter.js
├── models/
│   └── User.js
├── routes/
│   └── auth.js
├── utils/
│   ├── jwt.js
│   └── validation.js
├── .env.example
└── server.js
```

### API Endpoints

#### POST /api/auth/register
**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@example.com"
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

#### POST /api/auth/login
**Body:**
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@example.com",
    "avatar": null
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

**Errors:**
- 401: "Email ou senha inválidos"
- 429: "Muitas tentativas. Tente novamente em X minutos."

#### POST /api/auth/refresh
**Body:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

#### POST /api/auth/logout
**Headers:** `Authorization: Bearer {accessToken}`

**Response (200):**
```json
{
  "message": "Logout realizado com sucesso"
}
```

---

### Frontend Structure

```
src/
├── contexts/
│   └── AuthContext.jsx
├── hooks/
│   └── useAuth.js
├── pages/
│   ├── Login.jsx
│   └── Register.jsx
├── services/
│   └── authService.js
└── utils/
    └── tokenStorage.js
```

### AuthContext Example

```jsx
import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on mount
    const token = localStorage.getItem('accessToken');
    if (token) {
      // Validate token and load user
      loadUser(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    const data = await response.json();
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

---

## 📝 Tarefas

### Phase 1: Backend Setup (12h) ✅ COMPLETO
- [x] Setup Express server
- [x] Configurar variáveis de ambiente (.env)
- [x] Criar modelo User (id, name, email, password_hash)
- [x] Implementar authController (register, login)
- [x] Implementar JWT utils (sign, verify)
- [x] Hash de senhas com bcrypt
- [x] Rate limiting middleware
- [x] Testes de endpoints (curl/teste manual)

### Phase 2: Frontend Auth Context (10h) ✅ COMPLETO
- [x] Criar AuthContext e Provider
- [x] Implementar authService (API calls)
- [x] Sistema de armazenamento de tokens
- [x] Auto-refresh logic
- [x] Hook useAuth personalizado
- [x] Integrar AuthProvider no App.jsx

### Phase 3: UI de Login/Registro (12h) ✅ COMPLETO
- [x] Página de Login
  - [x] Formulário com FormInput (Story 2.4)
  - [x] Validação (email obrigatório, senha min 8 chars)
  - [x] LoadingButton durante submit
  - [x] ErrorAlert para erros
  - [x] Link para página de Registro
- [x] Página de Registro
  - [x] Formulário (nome, email, senha, confirmar senha)
  - [x] Validação (senhas devem coincidir)
  - [x] Feedback de sucesso (SuccessToast)
  - [x] Redirecionar para dashboard após registro

### Phase 4: Integração com App (6h) ✅ COMPLETO
- [x] Remover dados mockados de usuário
- [x] Atualizar Header/Sidebar com user.name e user.avatar do AuthContext
- [x] Implementar botão "Sair" no dropdown
- [x] Redirecionar para /login ao fazer logout
- [x] Manter estado de autenticação ao recarregar página (via localStorage)

---

## 🧪 Testes

### Backend Tests
```javascript
describe('POST /api/auth/login', () => {
  it('deve retornar accessToken com credenciais válidas', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'senha123' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('user');
  });

  it('deve retornar 401 com senha inválida', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'errada' });

    expect(response.status).toBe(401);
  });
});
```

### Frontend Tests
```javascript
describe('AuthContext', () => {
  it('deve autenticar usuário com sucesso', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await result.current.login('test@example.com', 'senha123');
    });

    expect(result.current.user).toBeDefined();
    expect(result.current.user.email).toBe('test@example.com');
  });
});
```

---

## 📊 Definition of Done

- [x] Backend JWT funcional (4 endpoints)
- [x] Frontend AuthContext implementado
- [x] Páginas de Login e Registro criadas
- [x] Integração com App (substituir mock)
- [x] Tokens persistidos de forma segura
- [x] Rate limiting ativo
- [x] Testes backend (cobertura ≥80%)
- [x] Testes frontend AuthContext (≥70%)
- [x] Documentação de API (.md ou Swagger)
- [x] WCAG AA mantido em Login/Registro

---

## 🔒 Segurança - Checklist

- [x] Senhas hasheadas (bcrypt salt rounds: 10)
- [x] Tokens JWT com expiração (access: 15min, refresh: 7d)
- [x] Rate limiting (max 5 tentativas/min no login)
- [x] Validação de inputs (prevenir SQL injection, XSS)
- [x] HTTPS obrigatório em produção
- [x] Refresh tokens invalidados no logout
- [x] Sem senhas em logs ou mensagens de erro

---

## 📎 Recursos

- [JWT.io](https://jwt.io/) - Debugger de tokens
- [bcrypt.js](https://github.com/dcodeIO/bcrypt.js) - Hashing de senhas
- [express-rate-limit](https://github.com/nfriedly/express-rate-limit) - Rate limiting
- [React Context API](https://react.dev/reference/react/useContext)

---

## 🔗 Dependências

- **Requer:** Story 2.4 (Design System) ✅
- **Requer:** Story 2.5 (Componentes Base) ✅
- **Bloqueia:** Story 2.7 (Protected Routes + RBAC)

---

**Criado por:** Claude Code
**Data:** 2026-02-23
