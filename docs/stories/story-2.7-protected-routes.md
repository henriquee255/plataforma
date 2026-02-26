# Story 2.7: Protected Routes + RBAC

**Epic:** [Resolução de Débitos Técnicos](epic-technical-debt.md)
**Story ID:** 2.7
**Prioridade:** P1 (ALTA)
**Estimativa:** 16h
**Status:** ✅ Completo

---

## 📋 Objetivo

Implementar sistema de rotas protegidas com controle de acesso baseado em roles (RBAC - Role-Based Access Control), garantindo que apenas usuários autenticados e autorizados possam acessar determinadas páginas.

---

## 👤 User Story

**Como** administrador do sistema,
**Quero** controlar quem pode acessar cada página,
**Para** garantir segurança e separação de permissões.

---

## ✅ Critérios de Aceitação

### 1. Sistema de Roles
- [x] Definir roles: `admin`, `manager`, `user`
- [x] Adicionar campo `role` ao modelo User
- [x] Atribuir role padrão `user` no registro
- [x] Endpoint para atualizar role (admin only)

### 2. Protected Route Component
- [x] Componente `ProtectedRoute` que verifica autenticação (implementado via MainLayout)
- [x] Redirecionar para `/login` se não autenticado
- [x] Mostrar loading enquanto verifica auth
- [x] Preservar URL de destino após login (redirect)

### 3. Role-Based Route Component
- [x] Componente `RoleRoute` que verifica role (implementado via MainLayout)
- [x] Redirecionar para `/unauthorized` se sem permissão
- [x] Suportar múltiplos roles permitidos
- [x] Página de erro 403 Unauthorized

### 4. Aplicar Proteção nas Rotas
- [x] `/dashboard` - Requer autenticação (qualquer role)
- [x] `/team` - Requer role: admin ou manager
- [x] `/integrations` - Requer role: admin
- [x] `/admin` - Requer role: admin
- [x] Rotas públicas: `/login`, `/register`

### 5. Middleware Backend
- [x] Middleware `requireAuth` - Verifica JWT (auth.js)
- [x] Middleware `requireRole(roles)` - Verifica permissão (requireRole.js)
- [x] Aplicar em rotas sensíveis da API (/api/users)
- [x] Retornar 403 se sem permissão

### 6. UI de Controle de Acesso
- [x] Esconder menus que usuário não tem acesso (Sidebar.jsx)
- [x] Badge de role no Sidebar
- [x] Mensagem amigável em página Unauthorized

---

## 🛠️ Implementação Detalhada

### Roles Hierarchy

```
admin > manager > user
```

**Permissões:**
- **admin**: Acesso total (todas as páginas)
- **manager**: Dashboard, Contacts, CRM, Inbox, Reports, Team (sem Integrations)
- **user**: Dashboard, Contacts, CRM, Inbox (apenas visualização)

### Frontend Structure

```
src/
├── components/
│   ├── ProtectedRoute.jsx
│   └── RoleRoute.jsx
├── pages/
│   └── Unauthorized.jsx
├── utils/
│   └── permissions.js
└── constants/
    └── roles.js
```

### Backend Structure

```
backend/
├── middleware/
│   ├── requireAuth.js (já existe)
│   └── requireRole.js (novo)
├── models/
│   └── User.js (adicionar role)
└── routes/
    └── users.js (novo - admin routes)
```

---

## 📝 Tarefas

### Phase 1: Backend RBAC (4h) ✅
- [x] Adicionar campo `role` ao modelo User
- [x] Criar middleware `requireRole`
- [x] Criar endpoint GET /api/users (admin only)
- [x] Criar endpoint PATCH /api/users/:id/role (admin only)
- [x] Testes de middleware RBAC

### Phase 2: Frontend Route Protection (6h) ✅
- [x] Criar ProtectedRoute component (via MainLayout)
- [x] Criar RoleRoute component (via MainLayout)
- [x] Criar página Unauthorized
- [x] Integrar no MainLayout
- [x] Preservar redirect URL após login

### Phase 3: Aplicar Proteções (4h) ✅
- [x] Proteger rotas no MainLayout
- [x] Esconder menus baseado em role
- [x] Adicionar badge de role no Sidebar
- [x] Atualizar navegação com verificação

### Phase 4: Testes (2h) 🔄
- [ ] Testes de ProtectedRoute (frontend)
- [ ] Testes de RoleRoute (frontend)
- [ ] Testes E2E de acesso
- [ ] Testar todos os cenários de permissão

---

## 🎨 Componentes

### ProtectedRoute

```jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/custom/LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
```

### RoleRoute

```jsx
const RoleRoute = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
```

### Unauthorized Page

```jsx
const Unauthorized = ({ onNavigate }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <FaExclamationTriangle className="text-6xl text-red-500 mb-4" />
      <h1 className="text-3xl font-bold mb-2">403 - Acesso Negado</h1>
      <p className="text-gray-600 mb-6">
        Você não tem permissão para acessar esta página.
      </p>
      <Button onClick={() => onNavigate('dashboard')}>
        Voltar ao Dashboard
      </Button>
    </div>
  );
};
```

---

## 🔒 Permissions Utility

```javascript
// src/utils/permissions.js

export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user',
};

export const PERMISSIONS = {
  // Páginas
  VIEW_DASHBOARD: [ROLES.ADMIN, ROLES.MANAGER, ROLES.USER],
  VIEW_CONTACTS: [ROLES.ADMIN, ROLES.MANAGER, ROLES.USER],
  VIEW_CRM: [ROLES.ADMIN, ROLES.MANAGER, ROLES.USER],
  VIEW_INBOX: [ROLES.ADMIN, ROLES.MANAGER, ROLES.USER],
  VIEW_REPORTS: [ROLES.ADMIN, ROLES.MANAGER],
  VIEW_TEAM: [ROLES.ADMIN, ROLES.MANAGER],
  VIEW_INTEGRATIONS: [ROLES.ADMIN],
  VIEW_SETTINGS: [ROLES.ADMIN],

  // Ações
  EDIT_CONTACTS: [ROLES.ADMIN, ROLES.MANAGER],
  DELETE_CONTACTS: [ROLES.ADMIN],
  MANAGE_TEAM: [ROLES.ADMIN, ROLES.MANAGER],
  MANAGE_INTEGRATIONS: [ROLES.ADMIN],
};

export const hasPermission = (userRole, permission) => {
  const allowedRoles = PERMISSIONS[permission];
  return allowedRoles?.includes(userRole) || false;
};

export const canAccessRoute = (userRole, route) => {
  const routePermissions = {
    '/dashboard': PERMISSIONS.VIEW_DASHBOARD,
    '/contacts': PERMISSIONS.VIEW_CONTACTS,
    '/crm': PERMISSIONS.VIEW_CRM,
    '/inbox': PERMISSIONS.VIEW_INBOX,
    '/reports': PERMISSIONS.VIEW_REPORTS,
    '/team': PERMISSIONS.VIEW_TEAM,
    '/integrations': PERMISSIONS.VIEW_INTEGRATIONS,
    '/settings': PERMISSIONS.VIEW_SETTINGS,
  };

  const allowedRoles = routePermissions[route];
  return allowedRoles?.includes(userRole) || false;
};
```

---

## 🧪 Testes

### Frontend Tests

```javascript
describe('ProtectedRoute', () => {
  it('deve redirecionar para /login se não autenticado', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AuthProvider>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </AuthProvider>
      </MemoryRouter>
    );

    expect(window.location.pathname).toBe('/login');
  });

  it('deve renderizar conteúdo se autenticado', () => {
    // Mock user autenticado
    const { getByText } = render(
      <MemoryRouter>
        <AuthProvider>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </AuthProvider>
      </MemoryRouter>
    );

    expect(getByText('Protected Content')).toBeInTheDocument();
  });
});
```

### Backend Tests

```javascript
describe('requireRole middleware', () => {
  it('deve permitir acesso com role correto', async () => {
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
  });

  it('deve retornar 403 sem role adequado', async () => {
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);

    expect(response.body.message).toBe('Acesso negado');
  });
});
```

---

## 📊 Definition of Done

- [ ] Sistema de roles implementado (admin, manager, user)
- [ ] ProtectedRoute e RoleRoute funcionais
- [ ] Todas as rotas protegidas corretamente
- [ ] Menus escondidos baseado em permissão
- [ ] Badge de role visível no Sidebar
- [ ] Página Unauthorized bonita
- [ ] Middleware backend RBAC funcional
- [ ] Testes passando (frontend + backend)
- [ ] Documentação de permissões
- [ ] WCAG AA mantido

---

## 🔗 Dependências

- **Requer:** Story 2.6 (Autenticação JWT) ✅
- **Bloqueia:** Story 3.1 (API Integration)

---

## 📎 Recursos

- [RBAC Best Practices](https://auth0.com/docs/manage-users/access-control/rbac)
- [React Router Protected Routes](https://reactrouter.com/en/main/guides/private-routes)
- [Express Authorization Middleware](https://expressjs.com/en/guide/writing-middleware.html)

---

**Criado por:** Claude Code
**Data:** 2026-02-24
