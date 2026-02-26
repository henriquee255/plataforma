# 🧪 Estratégia Completa de Testes - Painel Superadmin

> **Squad:** @qa (Quality Assurance Agent)
> **Data Criação:** 2026-02-25
> **Meta:** > 80% code coverage
> **Story Relacionada:** [[Story 4.1 - Superadmin Complete Overhaul]]

---

## 📊 Visão Geral

### Contexto
- **Arquivo Original:** `src/pages/Admin.jsx` (2.939 linhas)
- **Refatoração:** 60+ componentes modulares
- **Arquitetura:** Context API + Custom Hooks + Shared Components
- **Ferramentas:** Vitest + React Testing Library + Testing Library User Event

### Objetivos de Teste
1. **Cobertura > 80%** em todos os módulos
2. **Qualidade WCAG 2.1 AA** em acessibilidade
3. **Performance** validada (tempo de renderização, re-renders)
4. **Responsividade** em 4 breakpoints (mobile, tablet, desktop, ultrawide)
5. **Integração E2E** com fluxos completos de CRUD

---

## 🎯 Pirâmide de Testes

```
        /\
       /  \      5% E2E Tests (Playwright)
      /    \
     /------\    15% Integration Tests (RTL)
    /--------\
   /----------\  80% Unit Tests (Vitest)
  /------------\
```

### Distribuição
- **Unit Tests:** 80% (hooks, utils, componentes isolados)
- **Integration Tests:** 15% (fluxos CRUD, modais, navegação)
- **E2E Tests:** 5% (fluxos críticos de ponta a ponta)

---

## 🗂️ Estrutura de Arquivos de Teste

```
src/pages/Admin/
├── __tests__/
│   ├── unit/
│   │   ├── hooks/
│   │   │   ├── useAdminData.test.js
│   │   │   ├── useUserManagement.test.js
│   │   │   ├── useCompanyManagement.test.js
│   │   │   ├── useMemberManagement.test.js
│   │   │   ├── useAdminFilters.test.js
│   │   │   ├── useAdminTheme.test.js
│   │   │   ├── useSystemIntegrations.test.js
│   │   │   ├── useSystemLogs.test.js
│   │   │   └── usePermissions.test.js
│   │   ├── utils/
│   │   │   ├── adminHelpers.test.js
│   │   │   ├── validators.test.js
│   │   │   └── formatters.test.js
│   │   ├── shared/
│   │   │   ├── StatCard.test.jsx
│   │   │   ├── DataTable.test.jsx
│   │   │   ├── FilterBar.test.jsx
│   │   │   ├── SearchInput.test.jsx
│   │   │   ├── StatusBadge.test.jsx
│   │   │   ├── PlanBadge.test.jsx
│   │   │   ├── RoleBadge.test.jsx
│   │   │   ├── ModalBackdrop.test.jsx
│   │   │   ├── EmptyState.test.jsx
│   │   │   ├── AdminSidebar.test.jsx
│   │   │   └── ThemeToggle.test.jsx
│   │   ├── dashboard/
│   │   │   ├── MetricsSection.test.jsx
│   │   │   ├── PlanDistribution.test.jsx
│   │   │   ├── PlatformHealth.test.jsx
│   │   │   ├── RecentCompanies.test.jsx
│   │   │   └── RecentUsers.test.jsx
│   │   ├── users/
│   │   │   ├── UsersHeader.test.jsx
│   │   │   ├── UsersSearchBar.test.jsx
│   │   │   ├── UsersFilters.test.jsx
│   │   │   └── UsersTable.test.jsx
│   │   ├── companies/
│   │   │   ├── CompaniesHeader.test.jsx
│   │   │   ├── CompaniesStats.test.jsx
│   │   │   ├── CompaniesFilters.test.jsx
│   │   │   └── CompaniesTable.test.jsx
│   │   └── system/
│   │       ├── IntegrationsTab.test.jsx
│   │       ├── LogsTab.test.jsx
│   │       ├── AnalyticsTab.test.jsx
│   │       └── SettingsTab.test.jsx
│   ├── integration/
│   │   ├── user-crud.test.jsx
│   │   ├── company-crud.test.jsx
│   │   ├── member-management.test.jsx
│   │   ├── filters-and-search.test.jsx
│   │   ├── navigation.test.jsx
│   │   ├── user-modal-flow.test.jsx
│   │   ├── company-modal-flow.test.jsx
│   │   └── theme-switching.test.jsx
│   ├── accessibility/
│   │   ├── keyboard-navigation.test.jsx
│   │   ├── screen-reader.test.jsx
│   │   ├── color-contrast.test.jsx
│   │   └── aria-labels.test.jsx
│   ├── responsive/
│   │   ├── mobile.test.jsx
│   │   ├── tablet.test.jsx
│   │   ├── desktop.test.jsx
│   │   └── ultrawide.test.jsx
│   ├── performance/
│   │   ├── render-performance.test.jsx
│   │   ├── memo-optimization.test.jsx
│   │   └── lazy-loading.test.jsx
│   └── e2e/
│       ├── complete-user-flow.spec.js
│       ├── complete-company-flow.spec.js
│       └── admin-dashboard-flow.spec.js
├── __mocks__/
│   ├── adminMockData.js
│   ├── adminContextMock.js
│   └── apiMocks.js
└── __fixtures__/
    ├── users.json
    ├── companies.json
    ├── members.json
    └── system-logs.json
```

---

## 🔬 Plano de Testes Unitários

### 1. Custom Hooks

#### `useAdminData.test.js`

**Objetivo:** Testar carregamento e gerenciamento de dados globais

**Test Cases:**
```javascript
describe('useAdminData', () => {
  it('deve carregar dados iniciais corretamente', async () => {});
  it('deve atualizar métricas quando dados mudam', () => {});
  it('deve calcular totais de usuários por role', () => {});
  it('deve calcular totais de empresas por plano', () => {});
  it('deve retornar loading=true durante fetch', async () => {});
  it('deve retornar error quando falha API', async () => {});
  it('deve fazer cache de dados por 5 minutos', () => {});
  it('deve invalidar cache ao fazer mutação', () => {});
  it('deve fazer polling a cada 30 segundos', () => {});
  it('deve limpar polling ao desmontar', () => {});
});
```

**Mocks Necessários:**
- `fetch()` global
- `localStorage` para cache
- `setInterval` / `clearInterval`

---

#### `useUserManagement.test.js`

**Objetivo:** Testar CRUD completo de usuários

**Test Cases:**
```javascript
describe('useUserManagement', () => {
  describe('READ', () => {
    it('deve listar todos os usuários', async () => {});
    it('deve buscar usuário por ID', async () => {});
    it('deve filtrar usuários por role', () => {});
    it('deve filtrar usuários por status', () => {});
    it('deve buscar usuários por termo (nome/email)', () => {});
  });

  describe('CREATE', () => {
    it('deve criar novo usuário com sucesso', async () => {});
    it('deve validar campos obrigatórios', async () => {});
    it('deve validar formato de email', async () => {});
    it('deve retornar erro se email já existe', async () => {});
  });

  describe('UPDATE', () => {
    it('deve atualizar role de usuário', async () => {});
    it('deve atualizar status (ativo/inativo)', async () => {});
    it('deve atualizar dados pessoais', async () => {});
    it('deve retornar erro se usuário não encontrado', async () => {});
  });

  describe('DELETE', () => {
    it('deve deletar usuário com sucesso', async () => {});
    it('deve impedir deleção do próprio usuário', () => {});
    it('deve retornar erro se usuário não encontrado', async () => {});
  });

  describe('Permissions', () => {
    it('deve atualizar permissões de usuário', async () => {});
    it('deve validar permissões antes de salvar', () => {});
  });
});
```

**Mocks Necessários:**
- `fetch()` para API calls
- `useAdminContext` para estado global
- `useNotification` para toasts

---

#### `useCompanyManagement.test.js`

**Objetivo:** Testar CRUD completo de empresas

**Test Cases:**
```javascript
describe('useCompanyManagement', () => {
  describe('READ', () => {
    it('deve listar todas as empresas', async () => {});
    it('deve buscar empresa por ID', async () => {});
    it('deve filtrar empresas por plano', () => {});
    it('deve filtrar empresas por status', () => {});
    it('deve buscar empresas por nome', () => {});
  });

  describe('CREATE', () => {
    it('deve criar nova empresa com sucesso', async () => {});
    it('deve validar campos obrigatórios', async () => {});
    it('deve validar CNPJ', async () => {});
    it('deve retornar erro se CNPJ já existe', async () => {});
  });

  describe('UPDATE', () => {
    it('deve atualizar dados da empresa', async () => {});
    it('deve atualizar plano da empresa', async () => {});
    it('deve atualizar status da empresa', async () => {});
  });

  describe('DELETE', () => {
    it('deve deletar empresa com sucesso', async () => {});
    it('deve impedir deleção se tem membros ativos', () => {});
  });

  describe('Members', () => {
    it('deve listar membros da empresa', async () => {});
    it('deve adicionar membro à empresa', async () => {});
    it('deve remover membro da empresa', async () => {});
  });

  describe('Plan Management', () => {
    it('deve fazer upgrade de plano', async () => {});
    it('deve fazer downgrade de plano', async () => {});
    it('deve cancelar assinatura', async () => {});
  });
});
```

---

#### `useMemberManagement.test.js`

**Objetivo:** Testar gerenciamento de membros de empresa

**Test Cases:**
```javascript
describe('useMemberManagement', () => {
  it('deve listar membros de uma empresa', async () => {});
  it('deve adicionar novo membro', async () => {});
  it('deve editar cargo/setor de membro', async () => {});
  it('deve remover membro', async () => {});
  it('deve atualizar carga horária de membro', async () => {});
  it('deve atualizar permissões de membro', async () => {});
  it('deve validar limite de membros por plano', () => {});
});
```

---

#### `useAdminFilters.test.js`

**Objetivo:** Testar sistema de filtros e busca

**Test Cases:**
```javascript
describe('useAdminFilters', () => {
  it('deve aplicar filtro de plano', () => {});
  it('deve aplicar filtro de status', () => {});
  it('deve aplicar filtro de tipo', () => {});
  it('deve aplicar busca por termo', () => {});
  it('deve combinar múltiplos filtros', () => {});
  it('deve limpar todos os filtros', () => {});
  it('deve persistir filtros no localStorage', () => {});
  it('deve restaurar filtros ao montar', () => {});
});
```

---

#### `useAdminTheme.test.js`

**Objetivo:** Testar gerenciamento de tema admin

**Test Cases:**
```javascript
describe('useAdminTheme', () => {
  it('deve iniciar com tema padrão (light)', () => {});
  it('deve alternar entre light e dark', () => {});
  it('deve aplicar classes no HTML e BODY', () => {});
  it('deve salvar tema no localStorage', () => {});
  it('deve restaurar tema salvo ao montar', () => {});
  it('deve preservar tema global ao desmontar', () => {});
  it('deve aplicar tema independente do tema global', () => {});
});
```

---

#### `usePermissions.test.js`

**Objetivo:** Testar validação de permissões

**Test Cases:**
```javascript
describe('usePermissions', () => {
  it('deve verificar se usuário tem permissão', () => {});
  it('deve retornar false para usuário não autenticado', () => {});
  it('deve retornar true para superadmin em todas as permissões', () => {});
  it('deve validar permissões de empresa', () => {});
  it('deve validar permissões de membro', () => {});
});
```

---

#### `useSystemIntegrations.test.js`

**Objetivo:** Testar gerenciamento de integrações

**Test Cases:**
```javascript
describe('useSystemIntegrations', () => {
  it('deve listar todas as integrações', async () => {});
  it('deve buscar status de integração', async () => {});
  it('deve habilitar integração', async () => {});
  it('deve desabilitar integração', async () => {});
  it('deve validar credenciais de integração', async () => {});
});
```

---

#### `useSystemLogs.test.js`

**Objetivo:** Testar sistema de logs

**Test Cases:**
```javascript
describe('useSystemLogs', () => {
  it('deve listar logs com paginação', async () => {});
  it('deve filtrar logs por tipo', () => {});
  it('deve filtrar logs por data', () => {});
  it('deve buscar logs por termo', () => {});
  it('deve exportar logs como CSV', () => {});
  it('deve limpar logs antigos', async () => {});
});
```

---

### 2. Utility Functions

#### `adminHelpers.test.js`

**Test Cases:**
```javascript
describe('adminHelpers', () => {
  describe('calculateMetrics', () => {
    it('deve calcular total de usuários por role', () => {});
    it('deve calcular total de empresas por plano', () => {});
    it('deve calcular taxa de crescimento', () => {});
  });

  describe('sortData', () => {
    it('deve ordenar usuários por nome', () => {});
    it('deve ordenar empresas por data', () => {});
    it('deve ordenar por campo customizado', () => {});
  });

  describe('exportData', () => {
    it('deve exportar dados como CSV', () => {});
    it('deve exportar dados como JSON', () => {});
    it('deve exportar dados como Excel', () => {});
  });
});
```

---

#### `validators.test.js`

**Test Cases:**
```javascript
describe('validators', () => {
  describe('validateEmail', () => {
    it('deve validar email correto', () => {});
    it('deve rejeitar email inválido', () => {});
    it('deve rejeitar email vazio', () => {});
  });

  describe('validateCNPJ', () => {
    it('deve validar CNPJ correto', () => {});
    it('deve rejeitar CNPJ inválido', () => {});
    it('deve aceitar CNPJ com formatação', () => {});
  });

  describe('validatePhone', () => {
    it('deve validar telefone BR correto', () => {});
    it('deve rejeitar telefone inválido', () => {});
  });

  describe('validateUserData', () => {
    it('deve validar dados completos', () => {});
    it('deve rejeitar dados faltando campos obrigatórios', () => {});
  });
});
```

---

#### `formatters.test.js`

**Test Cases:**
```javascript
describe('formatters', () => {
  describe('formatDate', () => {
    it('deve formatar data no padrão BR', () => {});
    it('deve formatar data com hora', () => {});
    it('deve retornar "Agora" para data atual', () => {});
  });

  describe('formatCurrency', () => {
    it('deve formatar valor em BRL', () => {});
    it('deve formatar valores negativos', () => {});
  });

  describe('formatCNPJ', () => {
    it('deve formatar CNPJ com máscara', () => {});
  });

  describe('formatPhone', () => {
    it('deve formatar telefone com DDD', () => {});
  });
});
```

---

### 3. Shared Components

#### `StatCard.test.jsx`

**Test Cases:**
```javascript
describe('StatCard', () => {
  it('deve renderizar título e valor', () => {});
  it('deve renderizar ícone correto', () => {});
  it('deve mostrar tendência positiva', () => {});
  it('deve mostrar tendência negativa', () => {});
  it('deve aplicar cor por tipo (success, warning, error)', () => {});
  it('deve ser acessível (ARIA)', () => {});
  it('deve aplicar dark mode corretamente', () => {});
});
```

---

#### `DataTable.test.jsx`

**Test Cases:**
```javascript
describe('DataTable', () => {
  it('deve renderizar cabeçalhos', () => {});
  it('deve renderizar linhas de dados', () => {});
  it('deve ordenar por coluna ao clicar', async () => {});
  it('deve mostrar estado vazio quando sem dados', () => {});
  it('deve renderizar ações por linha', () => {});
  it('deve aplicar paginação', () => {});
  it('deve ser responsiva (mobile)', () => {});
  it('deve ter navegação por teclado', () => {});
});
```

---

#### `FilterBar.test.jsx`

**Test Cases:**
```javascript
describe('FilterBar', () => {
  it('deve renderizar opções de filtro', () => {});
  it('deve aplicar filtro ao selecionar', async () => {});
  it('deve limpar filtros', async () => {});
  it('deve mostrar contador de filtros ativos', () => {});
  it('deve ser acessível', () => {});
});
```

---

#### `SearchInput.test.jsx`

**Test Cases:**
```javascript
describe('SearchInput', () => {
  it('deve renderizar input com placeholder', () => {});
  it('deve chamar onChange ao digitar', async () => {});
  it('deve ter debounce de 300ms', async () => {});
  it('deve limpar busca ao clicar no X', async () => {});
  it('deve ter navegação por teclado (Enter)', async () => {});
  it('deve ser acessível (aria-label)', () => {});
});
```

---

#### `StatusBadge.test.jsx`

**Test Cases:**
```javascript
describe('StatusBadge', () => {
  it('deve renderizar status "Ativo" em verde', () => {});
  it('deve renderizar status "Inativo" em cinza', () => {});
  it('deve renderizar status "Pendente" em amarelo', () => {});
  it('deve renderizar status "Bloqueado" em vermelho', () => {});
  it('deve aplicar dark mode', () => {});
});
```

---

#### `PlanBadge.test.jsx`

**Test Cases:**
```javascript
describe('PlanBadge', () => {
  it('deve renderizar plano "Free" em cinza', () => {});
  it('deve renderizar plano "Starter" em azul', () => {});
  it('deve renderizar plano "Pro" em purple', () => {});
  it('deve renderizar plano "Enterprise" em dourado', () => {});
  it('deve renderizar ícone de plano', () => {});
});
```

---

#### `RoleBadge.test.jsx`

**Test Cases:**
```javascript
describe('RoleBadge', () => {
  it('deve renderizar role "Superadmin" com ícone de coroa', () => {});
  it('deve renderizar role "Admin" em vermelho', () => {});
  it('deve renderizar role "Manager" em azul', () => {});
  it('deve renderizar role "User" em cinza', () => {});
});
```

---

#### `ModalBackdrop.test.jsx`

**Test Cases:**
```javascript
describe('ModalBackdrop', () => {
  it('deve renderizar quando open=true', () => {});
  it('deve não renderizar quando open=false', () => {});
  it('deve chamar onClose ao clicar no backdrop', async () => {});
  it('deve chamar onClose ao pressionar ESC', async () => {});
  it('deve ter animação de entrada/saída', () => {});
  it('deve bloquear scroll do body', () => {});
  it('deve ser acessível (focus trap)', () => {});
});
```

---

#### `EmptyState.test.jsx`

**Test Cases:**
```javascript
describe('EmptyState', () => {
  it('deve renderizar mensagem customizada', () => {});
  it('deve renderizar ícone customizado', () => {});
  it('deve renderizar botão de ação', () => {});
  it('deve chamar onAction ao clicar', async () => {});
});
```

---

#### `AdminSidebar.test.jsx`

**Test Cases:**
```javascript
describe('AdminSidebar', () => {
  it('deve renderizar todas as tabs', () => {});
  it('deve destacar tab ativa', () => {});
  it('deve navegar ao clicar em tab', async () => {});
  it('deve mostrar contadores em cada tab', () => {});
  it('deve ser retrátil em mobile', () => {});
  it('deve ter navegação por teclado', () => {});
  it('deve aplicar dark mode', () => {});
});
```

---

#### `ThemeToggle.test.jsx`

**Test Cases:**
```javascript
describe('ThemeToggle', () => {
  it('deve renderizar ícone de sol (light mode)', () => {});
  it('deve renderizar ícone de lua (dark mode)', () => {});
  it('deve alternar tema ao clicar', async () => {});
  it('deve salvar tema no localStorage', async () => {});
  it('deve ter animação de transição', () => {});
  it('deve ser acessível (aria-label)', () => {});
});
```

---

### 4. Tab Components

#### Dashboard Components

```javascript
// MetricsSection.test.jsx
describe('MetricsSection', () => {
  it('deve renderizar 4 StatCards', () => {});
  it('deve calcular métricas corretamente', () => {});
  it('deve atualizar ao mudar dados', () => {});
});

// PlanDistribution.test.jsx
describe('PlanDistribution', () => {
  it('deve renderizar gráfico de pizza', () => {});
  it('deve mostrar percentuais corretos', () => {});
  it('deve aplicar cores por plano', () => {});
});

// PlatformHealth.test.jsx
describe('PlatformHealth', () => {
  it('deve mostrar status geral da plataforma', () => {});
  it('deve mostrar métricas de uptime', () => {});
  it('deve mostrar alertas se houver', () => {});
});

// RecentCompanies.test.jsx
describe('RecentCompanies', () => {
  it('deve listar últimas 5 empresas', () => {});
  it('deve ordenar por data de criação', () => {});
  it('deve ter link para cada empresa', () => {});
});

// RecentUsers.test.jsx
describe('RecentUsers', () => {
  it('deve listar últimos 5 usuários', () => {});
  it('deve ordenar por data de criação', () => {});
  it('deve ter link para cada usuário', () => {});
});
```

---

#### Users Components

```javascript
// UsersHeader.test.jsx
describe('UsersHeader', () => {
  it('deve renderizar título e total de usuários', () => {});
  it('deve ter botão "Adicionar Usuário"', () => {});
  it('deve abrir modal ao clicar em adicionar', async () => {});
});

// UsersSearchBar.test.jsx
describe('UsersSearchBar', () => {
  it('deve buscar por nome', async () => {});
  it('deve buscar por email', async () => {});
  it('deve ter debounce', async () => {});
});

// UsersFilters.test.jsx
describe('UsersFilters', () => {
  it('deve filtrar por role', async () => {});
  it('deve filtrar por status', async () => {});
  it('deve combinar filtros', async () => {});
});

// UsersTable.test.jsx
describe('UsersTable', () => {
  it('deve renderizar lista de usuários', () => {});
  it('deve ordenar por coluna', async () => {});
  it('deve ter ações por linha (editar, deletar)', () => {});
  it('deve abrir modal ao clicar em editar', async () => {});
});
```

---

#### Companies Components

```javascript
// CompaniesHeader.test.jsx
describe('CompaniesHeader', () => {
  it('deve renderizar título e total de empresas', () => {});
  it('deve ter botão "Adicionar Empresa"', () => {});
});

// CompaniesStats.test.jsx
describe('CompaniesStats', () => {
  it('deve mostrar total por plano', () => {});
  it('deve mostrar total ativo/inativo', () => {});
});

// CompaniesFilters.test.jsx
describe('CompaniesFilters', () => {
  it('deve filtrar por plano', async () => {});
  it('deve filtrar por status', async () => {});
});

// CompaniesTable.test.jsx
describe('CompaniesTable', () => {
  it('deve renderizar lista de empresas', () => {});
  it('deve mostrar membros por empresa', () => {});
  it('deve ter ações por linha', () => {});
});
```

---

## 🔗 Plano de Testes de Integração

### 1. User CRUD Flow

**Arquivo:** `integration/user-crud.test.jsx`

**Fluxo Completo:**
```javascript
describe('User CRUD Integration', () => {
  it('deve completar fluxo: criar → editar → deletar usuário', async () => {
    // 1. Abrir modal de criação
    // 2. Preencher formulário
    // 3. Submeter e validar toast de sucesso
    // 4. Verificar usuário na tabela
    // 5. Abrir modal de edição
    // 6. Alterar dados
    // 7. Submeter e validar toast
    // 8. Verificar dados atualizados
    // 9. Deletar usuário
    // 10. Confirmar deleção
    // 11. Validar toast
    // 12. Verificar usuário removido da tabela
  });

  it('deve atualizar role de usuário via dropdown', async () => {});
  it('deve atualizar status de usuário', async () => {});
  it('deve atualizar permissões de usuário', async () => {});
});
```

---

### 2. Company CRUD Flow

**Arquivo:** `integration/company-crud.test.jsx`

**Fluxo Completo:**
```javascript
describe('Company CRUD Integration', () => {
  it('deve completar fluxo: criar → editar → deletar empresa', async () => {});
  it('deve adicionar membros à empresa', async () => {});
  it('deve remover membros da empresa', async () => {});
  it('deve fazer upgrade de plano', async () => {});
  it('deve fazer downgrade de plano', async () => {});
  it('deve cancelar assinatura', async () => {});
});
```

---

### 3. Member Management

**Arquivo:** `integration/member-management.test.jsx`

**Fluxo Completo:**
```javascript
describe('Member Management Integration', () => {
  it('deve adicionar membro → editar cargo → remover membro', async () => {});
  it('deve validar limite de membros por plano', async () => {});
  it('deve adicionar cargo customizado', async () => {});
  it('deve adicionar setor customizado', async () => {});
});
```

---

### 4. Filters and Search

**Arquivo:** `integration/filters-and-search.test.jsx`

**Fluxo Completo:**
```javascript
describe('Filters and Search Integration', () => {
  it('deve aplicar busca + filtros combinados', async () => {});
  it('deve persistir filtros ao navegar entre tabs', () => {});
  it('deve limpar filtros ao clicar em "Limpar"', async () => {});
  it('deve exportar dados filtrados', async () => {});
});
```

---

### 5. Navigation

**Arquivo:** `integration/navigation.test.jsx`

**Fluxo Completo:**
```javascript
describe('Navigation Integration', () => {
  it('deve navegar entre tabs: Dashboard → Users → Companies → System', async () => {});
  it('deve preservar estado ao navegar', () => {});
  it('deve atualizar URL ao mudar de tab', async () => {});
  it('deve carregar tab correta via URL', () => {});
});
```

---

### 6. User Modal Flow

**Arquivo:** `integration/user-modal-flow.test.jsx`

**Fluxo Completo:**
```javascript
describe('User Modal Integration', () => {
  it('deve navegar entre tabs: Info → Config → Actions', async () => {});
  it('deve fechar modal ao clicar fora', async () => {});
  it('deve fechar modal ao pressionar ESC', async () => {});
  it('deve fazer lazy load de tabs', () => {});
});
```

---

### 7. Company Modal Flow

**Arquivo:** `integration/company-modal-flow.test.jsx`

**Fluxo Completo:**
```javascript
describe('Company Modal Integration', () => {
  it('deve navegar entre tabs: Detalhes → Membros → Plano → Settings', async () => {});
  it('deve adicionar membro e atualizar lista', async () => {});
  it('deve editar membro e salvar', async () => {});
  it('deve adicionar cargo/setor e usar no membro', async () => {});
});
```

---

### 8. Theme Switching

**Arquivo:** `integration/theme-switching.test.jsx`

**Fluxo Completo:**
```javascript
describe('Theme Switching Integration', () => {
  it('deve alternar tema em todos os componentes', async () => {});
  it('deve preservar tema ao navegar', () => {});
  it('deve aplicar tema apenas no painel admin', () => {});
  it('deve restaurar tema global ao sair', () => {});
});
```

---

## ♿ Plano de Testes de Acessibilidade

### 1. Keyboard Navigation

**Arquivo:** `accessibility/keyboard-navigation.test.jsx`

**Test Cases:**
```javascript
describe('Keyboard Navigation (WCAG 2.1.1)', () => {
  it('deve navegar entre tabs com Tab/Shift+Tab', async () => {});
  it('deve ativar tab com Enter/Space', async () => {});
  it('deve navegar sidebar com Arrow keys', async () => {});
  it('deve abrir modal com Enter', async () => {});
  it('deve fechar modal com ESC', async () => {});
  it('deve navegar formulário com Tab', async () => {});
  it('deve submeter formulário com Enter', async () => {});
  it('deve ter focus trap em modais', async () => {});
  it('deve ter focus visível (outline)', () => {});
});
```

**Ferramentas:**
- `@testing-library/user-event` para simulação de teclado
- `jest-axe` para validação automática

---

### 2. Screen Reader

**Arquivo:** `accessibility/screen-reader.test.jsx`

**Test Cases:**
```javascript
describe('Screen Reader Support (WCAG 4.1.2)', () => {
  it('deve ter ARIA labels em todos os botões', () => {});
  it('deve ter ARIA labels em inputs', () => {});
  it('deve ter ARIA roles corretas', () => {});
  it('deve anunciar mudanças de estado', () => {});
  it('deve ter alt text em imagens', () => {});
  it('deve ter aria-describedby em campos com erro', () => {});
  it('deve ter aria-live para notificações', () => {});
  it('deve ter aria-expanded em dropdowns', () => {});
});
```

**Ferramentas:**
- `jest-axe` para validação ARIA
- `@testing-library/react` queries por role/label

---

### 3. Color Contrast

**Arquivo:** `accessibility/color-contrast.test.jsx`

**Test Cases:**
```javascript
describe('Color Contrast (WCAG 1.4.3)', () => {
  it('deve ter contraste mínimo 4.5:1 em textos normais', () => {});
  it('deve ter contraste mínimo 3:1 em textos grandes', () => {});
  it('deve ter contraste em dark mode', () => {});
  it('deve ter contraste em badges', () => {});
  it('deve ter contraste em botões', () => {});
  it('deve ter contraste em links', () => {});
});
```

**Ferramentas:**
- `jest-axe` com regra de contraste
- Script customizado para calcular contraste

---

### 4. ARIA Labels

**Arquivo:** `accessibility/aria-labels.test.jsx`

**Test Cases:**
```javascript
describe('ARIA Labels (WCAG 4.1.2)', () => {
  it('deve ter aria-label em ícones sem texto', () => {});
  it('deve ter aria-labelledby em seções', () => {});
  it('deve ter aria-describedby em tooltips', () => {});
  it('deve ter role="navigation" em sidebar', () => {});
  it('deve ter role="main" em conteúdo principal', () => {});
  it('deve ter role="dialog" em modais', () => {});
  it('deve ter role="table" em tabelas', () => {});
});
```

---

## 📱 Plano de Testes de Responsividade

### Breakpoints
- **Mobile:** 320px - 767px
- **Tablet:** 768px - 1023px
- **Desktop:** 1024px - 1919px
- **Ultrawide:** 1920px+

### 1. Mobile Tests

**Arquivo:** `responsive/mobile.test.jsx`

**Test Cases:**
```javascript
describe('Mobile Responsiveness (320px - 767px)', () => {
  beforeEach(() => {
    window.innerWidth = 375;
    window.innerHeight = 667;
    window.dispatchEvent(new Event('resize'));
  });

  it('deve retrair sidebar em mobile', () => {});
  it('deve mostrar menu hamburguer', () => {});
  it('deve empilhar cards verticalmente', () => {});
  it('deve tornar tabela scrollável horizontalmente', () => {});
  it('deve ocultar colunas menos importantes', () => {});
  it('deve aumentar touch targets (min 44x44px)', () => {});
  it('deve ajustar fonte para mobile', () => {});
});
```

---

### 2. Tablet Tests

**Arquivo:** `responsive/tablet.test.jsx`

**Test Cases:**
```javascript
describe('Tablet Responsiveness (768px - 1023px)', () => {
  beforeEach(() => {
    window.innerWidth = 768;
    window.innerHeight = 1024;
    window.dispatchEvent(new Event('resize'));
  });

  it('deve mostrar sidebar colapsável', () => {});
  it('deve exibir 2 colunas de cards', () => {});
  it('deve manter tabela com scroll', () => {});
});
```

---

### 3. Desktop Tests

**Arquivo:** `responsive/desktop.test.jsx`

**Test Cases:**
```javascript
describe('Desktop Responsiveness (1024px - 1919px)', () => {
  beforeEach(() => {
    window.innerWidth = 1440;
    window.innerHeight = 900;
    window.dispatchEvent(new Event('resize'));
  });

  it('deve mostrar sidebar expandida', () => {});
  it('deve exibir 4 colunas de cards', () => {});
  it('deve mostrar tabela completa', () => {});
});
```

---

### 4. Ultrawide Tests

**Arquivo:** `responsive/ultrawide.test.jsx`

**Test Cases:**
```javascript
describe('Ultrawide Responsiveness (1920px+)', () => {
  beforeEach(() => {
    window.innerWidth = 2560;
    window.innerHeight = 1440;
    window.dispatchEvent(new Event('resize'));
  });

  it('deve limitar largura máxima de conteúdo', () => {});
  it('deve centralizar layout', () => {});
  it('deve aproveitar espaço extra para gráficos', () => {});
});
```

---

## ⚡ Plano de Testes de Performance

### 1. Render Performance

**Arquivo:** `performance/render-performance.test.jsx`

**Test Cases:**
```javascript
describe('Render Performance', () => {
  it('deve renderizar < 100ms com 100 usuários', () => {});
  it('deve renderizar < 200ms com 1000 usuários', () => {});
  it('deve renderizar < 500ms com 10000 usuários', () => {});
  it('deve usar virtualização para listas grandes', () => {});
  it('deve fazer lazy load de modais', () => {});
});
```

**Ferramentas:**
- `performance.now()` para medir tempo
- React Profiler API

---

### 2. Memo Optimization

**Arquivo:** `performance/memo-optimization.test.jsx`

**Test Cases:**
```javascript
describe('React.memo Optimization', () => {
  it('não deve re-renderizar StatCard se props não mudaram', () => {});
  it('não deve re-renderizar UsersTable se dados não mudaram', () => {});
  it('não deve re-renderizar CompaniesTable se dados não mudaram', () => {});
  it('deve usar useMemo para filtros', () => {});
  it('deve usar useCallback para handlers', () => {});
});
```

**Ferramentas:**
- React Testing Library `render` count
- React DevTools Profiler

---

### 3. Lazy Loading

**Arquivo:** `performance/lazy-loading.test.jsx`

**Test Cases:**
```javascript
describe('Lazy Loading', () => {
  it('deve carregar UserModal apenas quando abrir', async () => {});
  it('deve carregar CompanyModal apenas quando abrir', async () => {});
  it('deve mostrar Suspense fallback durante load', () => {});
  it('deve fazer preload ao hover em botão', async () => {});
});
```

---

## 🌐 Plano de Testes E2E (Playwright)

### 1. Complete User Flow

**Arquivo:** `e2e/complete-user-flow.spec.js`

**Fluxo:**
```javascript
test('deve completar fluxo de gerenciamento de usuário', async ({ page }) => {
  // 1. Login como superadmin
  await page.goto('http://localhost:3000/login');
  await page.fill('[name="email"]', 'admin@test.com');
  await page.fill('[name="password"]', 'admin@2026');
  await page.click('button[type="submit"]');

  // 2. Navegar para Admin
  await page.click('a[href="/admin"]');
  await expect(page).toHaveURL('/admin');

  // 3. Ir para tab Users
  await page.click('text=Usuários');

  // 4. Criar novo usuário
  await page.click('text=Adicionar Usuário');
  await page.fill('[name="name"]', 'Test User');
  await page.fill('[name="email"]', 'test@example.com');
  await page.selectOption('[name="role"]', 'user');
  await page.click('button:has-text("Salvar")');

  // 5. Verificar toast de sucesso
  await expect(page.locator('.toast')).toContainText('Usuário criado');

  // 6. Verificar usuário na tabela
  await expect(page.locator('table')).toContainText('Test User');

  // 7. Editar usuário
  await page.click('button[aria-label="Editar Test User"]');
  await page.fill('[name="name"]', 'Test User Updated');
  await page.click('button:has-text("Salvar")');

  // 8. Verificar toast
  await expect(page.locator('.toast')).toContainText('Usuário atualizado');

  // 9. Deletar usuário
  await page.click('button[aria-label="Deletar Test User Updated"]');
  await page.click('button:has-text("Confirmar")');

  // 10. Verificar toast
  await expect(page.locator('.toast')).toContainText('Usuário deletado');

  // 11. Verificar usuário removido
  await expect(page.locator('table')).not.toContainText('Test User Updated');
});
```

---

### 2. Complete Company Flow

**Arquivo:** `e2e/complete-company-flow.spec.js`

**Fluxo:**
```javascript
test('deve completar fluxo de gerenciamento de empresa', async ({ page }) => {
  // Similar ao fluxo de usuário, mas para empresas
});
```

---

### 3. Admin Dashboard Flow

**Arquivo:** `e2e/admin-dashboard-flow.spec.js`

**Fluxo:**
```javascript
test('deve navegar por todas as tabs e validar dados', async ({ page }) => {
  // 1. Validar Dashboard
  // 2. Validar Users tab
  // 3. Validar Companies tab
  // 4. Validar System tab
  // 5. Validar filtros funcionam
  // 6. Validar busca funciona
  // 7. Validar dark mode funciona
});
```

---

## 🛠️ Setup de Ferramentas

### 1. Configuração Vitest

**Arquivo:** `vitest.config.js` (já existe)

```javascript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/tests/',
        '*.config.js',
        'dist/',
        'src/pages/Admin/__mocks__/**',
        'src/pages/Admin/__fixtures__/**',
      ],
      // Meta: > 80% coverage
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80,
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@admin': path.resolve(__dirname, './src/pages/Admin'),
    },
  },
});
```

---

### 2. Setup de Testes

**Arquivo:** `src/pages/Admin/__tests__/setup.js`

```javascript
import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend matchers
expect.extend(matchers);

// Cleanup após cada teste
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() { return []; }
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn((key) => null),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

// Mock fetch
global.fetch = vi.fn();
```

---

### 3. Mock Data

**Arquivo:** `src/pages/Admin/__mocks__/adminMockData.js`

```javascript
export const mockUsers = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@test.com',
    role: 'superadmin',
    status: 'ativo',
    avatar: 'https://i.pravatar.cc/150?img=1',
    createdAt: '2026-01-01T00:00:00.000Z',
    permissions: ['all'],
  },
  {
    id: '2',
    name: 'Manager User',
    email: 'manager@test.com',
    role: 'manager',
    status: 'ativo',
    avatar: 'https://i.pravatar.cc/150?img=2',
    createdAt: '2026-01-15T00:00:00.000Z',
    permissions: ['users.read', 'users.update'],
  },
  {
    id: '3',
    name: 'Regular User',
    email: 'user@test.com',
    role: 'user',
    status: 'inativo',
    avatar: 'https://i.pravatar.cc/150?img=3',
    createdAt: '2026-02-01T00:00:00.000Z',
    permissions: ['users.read'],
  },
];

export const mockCompanies = [
  {
    id: '1',
    name: 'Tech Corp',
    cnpj: '12.345.678/0001-90',
    plan: 'enterprise',
    status: 'ativo',
    membersCount: 50,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    name: 'Startup XYZ',
    cnpj: '98.765.432/0001-10',
    plan: 'pro',
    status: 'ativo',
    membersCount: 10,
    createdAt: '2026-01-15T00:00:00.000Z',
  },
  {
    id: '3',
    name: 'Freelancer',
    cnpj: '',
    plan: 'starter',
    status: 'ativo',
    membersCount: 1,
    createdAt: '2026-02-01T00:00:00.000Z',
  },
];

export const mockMembers = [
  {
    id: '1',
    userId: '2',
    companyId: '1',
    cargo: 'Desenvolvedor',
    setor: 'TI',
    cargaHoraria: 40,
    permissions: ['crm.read', 'crm.write'],
  },
  {
    id: '2',
    userId: '3',
    companyId: '1',
    cargo: 'Designer',
    setor: 'Marketing',
    cargaHoraria: 40,
    permissions: ['crm.read'],
  },
];

export const mockSystemLogs = [
  {
    id: '1',
    type: 'info',
    message: 'Usuário criado',
    userId: '1',
    timestamp: '2026-02-25T10:00:00.000Z',
  },
  {
    id: '2',
    type: 'warning',
    message: 'Tentativa de login falhou',
    userId: '2',
    timestamp: '2026-02-25T11:00:00.000Z',
  },
  {
    id: '3',
    type: 'error',
    message: 'Erro ao processar pagamento',
    userId: '1',
    timestamp: '2026-02-25T12:00:00.000Z',
  },
];
```

---

### 4. Admin Context Mock

**Arquivo:** `src/pages/Admin/__mocks__/adminContextMock.js`

```javascript
import { vi } from 'vitest';

export const mockAdminContext = {
  // State
  activeTab: 'dashboard',
  adminTheme: 'light',
  userModal: { open: false, user: null, tab: 'info' },
  companyModal: { open: false, company: null, tab: 'detalhes' },
  filters: {
    searchTerm: '',
    plano: 'todos',
    status: 'todos',
    tipo: 'todos',
  },

  // Actions
  setActiveTab: vi.fn(),
  toggleTheme: vi.fn(),
  openUserModal: vi.fn(),
  closeUserModal: vi.fn(),
  openCompanyModal: vi.fn(),
  closeCompanyModal: vi.fn(),
  setFilters: vi.fn(),
  clearFilters: vi.fn(),
};

export const AdminProviderMock = ({ children, value = mockAdminContext }) => {
  return children;
};
```

---

### 5. API Mocks

**Arquivo:** `src/pages/Admin/__mocks__/apiMocks.js`

```javascript
import { vi } from 'vitest';
import { mockUsers, mockCompanies, mockMembers } from './adminMockData';

export const mockFetchSuccess = (data) => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({ success: true, ...data }),
  });
};

export const mockFetchError = (error = 'Erro ao buscar dados') => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: false,
    status: 500,
    json: async () => ({ success: false, error }),
  });
};

export const mockAPIEndpoints = () => {
  global.fetch = vi.fn().mockImplementation((url) => {
    // Users
    if (url.includes('/api/users') && !url.includes('/api/users/')) {
      return Promise.resolve({
        ok: true,
        json: async () => ({ success: true, users: mockUsers }),
      });
    }

    if (url.match(/\/api\/users\/\d+$/)) {
      const id = url.split('/').pop();
      const user = mockUsers.find(u => u.id === id);
      return Promise.resolve({
        ok: true,
        json: async () => ({ success: true, user }),
      });
    }

    // Companies
    if (url.includes('/api/companies')) {
      return Promise.resolve({
        ok: true,
        json: async () => ({ success: true, companies: mockCompanies }),
      });
    }

    // Members
    if (url.includes('/api/members')) {
      return Promise.resolve({
        ok: true,
        json: async () => ({ success: true, members: mockMembers }),
      });
    }

    // Default: 404
    return Promise.resolve({
      ok: false,
      status: 404,
      json: async () => ({ success: false, error: 'Not found' }),
    });
  });
};
```

---

### 6. Test Utilities

**Arquivo:** `src/pages/Admin/__tests__/utils/testUtils.jsx`

```javascript
import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from '@/contexts/AppContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { AdminProvider } from '@admin/context/AdminContext';

export const renderWithProviders = (
  ui,
  {
    adminContextValue,
    route = '/admin',
    ...renderOptions
  } = {}
) => {
  window.history.pushState({}, 'Test page', route);

  const Wrapper = ({ children }) => (
    <BrowserRouter>
      <AppProvider>
        <AuthProvider>
          <AdminProvider value={adminContextValue}>
            {children}
          </AdminProvider>
        </AuthProvider>
      </AppProvider>
    </BrowserRouter>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

export const mockUser = {
  id: '1',
  name: 'Admin',
  email: 'admin@test.com',
  role: 'superadmin',
};

export const mockNavigate = vi.fn();

export * from '@testing-library/react';
export { renderWithProviders as render };
```

---

### 7. Configuração Playwright (E2E)

**Arquivo:** `playwright.config.js`

```javascript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/pages/Admin/__tests__/e2e',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'playwright-report/results.json' }],
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

### 8. Instalação de Dependências

**Comando:**
```bash
npm install -D @playwright/test @axe-core/playwright
```

---

## 📈 Métricas e Relatórios

### Coverage Report

**Executar:**
```bash
npm run test:coverage
```

**Targets:**
- **Lines:** > 80%
- **Functions:** > 80%
- **Branches:** > 80%
- **Statements:** > 80%

**Visualização:**
```bash
open coverage/index.html
```

---

### CI/CD Integration

**GitHub Actions Workflow:**
```yaml
name: Admin Tests

on:
  pull_request:
    paths:
      - 'src/pages/Admin/**'
  push:
    branches:
      - main

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:ci
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 🎯 Priorização de Testes

### Fase 1 (Crítico) - Primeira Semana
- [x] Setup de ferramentas
- [ ] Testes unitários de hooks (useAdminData, useUserManagement, useCompanyManagement)
- [ ] Testes de shared components (StatCard, DataTable, FilterBar)
- [ ] Testes de integração: User CRUD
- [ ] Testes de acessibilidade: keyboard navigation

### Fase 2 (Alta) - Segunda Semana
- [ ] Testes unitários de utils (validators, formatters)
- [ ] Testes de tab components (Dashboard, Users, Companies)
- [ ] Testes de integração: Company CRUD, Filters and Search
- [ ] Testes de acessibilidade: screen reader, ARIA labels

### Fase 3 (Média) - Terceira Semana
- [ ] Testes unitários de hooks (useSystemIntegrations, useSystemLogs)
- [ ] Testes de modais (UserModal, CompanyModal)
- [ ] Testes de integração: Member Management, Navigation
- [ ] Testes de responsividade (mobile, tablet, desktop)

### Fase 4 (Baixa) - Quarta Semana
- [ ] Testes de performance (render, memo, lazy loading)
- [ ] Testes E2E (Playwright)
- [ ] Testes de acessibilidade: color contrast
- [ ] Refinamento e otimização

---

## 📝 Checklist de Validação

### Para cada componente testado:
- [ ] Cobertura > 80%
- [ ] Testes unitários passando
- [ ] Testes de integração passando
- [ ] Testes de acessibilidade passando
- [ ] Testes de responsividade passando
- [ ] Sem erros no console
- [ ] Sem warnings no console
- [ ] Performance validada
- [ ] Dark mode validado
- [ ] Documentação atualizada

---

## 🔗 Referências

- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Jest Axe](https://github.com/nickcolley/jest-axe)

---

## 📊 Exemplo de Test Case Completo

### Exemplo: UsersTable.test.jsx

```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../utils/testUtils';
import UsersTable from '@admin/components/Users/UsersTable';
import { mockUsers } from '@admin/__mocks__/adminMockData';

describe('UsersTable', () => {
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnRoleChange = vi.fn();

  const defaultProps = {
    users: mockUsers,
    onEdit: mockOnEdit,
    onDelete: mockOnDelete,
    onRoleChange: mockOnRoleChange,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('deve renderizar cabeçalhos da tabela', () => {
      renderWithProviders(<UsersTable {...defaultProps} />);

      expect(screen.getByText('Nome')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Permissão')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Criado em')).toBeInTheDocument();
      expect(screen.getByText('Ações')).toBeInTheDocument();
    });

    it('deve renderizar todos os usuários', () => {
      renderWithProviders(<UsersTable {...defaultProps} />);

      mockUsers.forEach(user => {
        expect(screen.getByText(user.name)).toBeInTheDocument();
        expect(screen.getByText(user.email)).toBeInTheDocument();
      });
    });

    it('deve renderizar avatares', () => {
      renderWithProviders(<UsersTable {...defaultProps} />);

      const avatars = screen.getAllByRole('img');
      expect(avatars).toHaveLength(mockUsers.length);
    });

    it('deve renderizar badges de role', () => {
      renderWithProviders(<UsersTable {...defaultProps} />);

      expect(screen.getByText('Superadmin')).toBeInTheDocument();
      expect(screen.getByText('Manager')).toBeInTheDocument();
      expect(screen.getByText('User')).toBeInTheDocument();
    });

    it('deve renderizar badges de status', () => {
      renderWithProviders(<UsersTable {...defaultProps} />);

      const activeBadges = screen.getAllByText('Ativo');
      const inactiveBadges = screen.getAllByText('Inativo');

      expect(activeBadges.length).toBe(2);
      expect(inactiveBadges.length).toBe(1);
    });
  });

  describe('Sorting', () => {
    it('deve ordenar por nome ao clicar no cabeçalho', async () => {
      const user = userEvent.setup();
      renderWithProviders(<UsersTable {...defaultProps} />);

      const nameHeader = screen.getByText('Nome');
      await user.click(nameHeader);

      // Verificar ordem após sort
      const rows = screen.getAllByRole('row');
      // ... validar ordem
    });

    it('deve alternar ordem (asc/desc)', async () => {
      const user = userEvent.setup();
      renderWithProviders(<UsersTable {...defaultProps} />);

      const nameHeader = screen.getByText('Nome');

      // Primeira click: ASC
      await user.click(nameHeader);
      // ... verificar ordem ASC

      // Segunda click: DESC
      await user.click(nameHeader);
      // ... verificar ordem DESC
    });
  });

  describe('Actions', () => {
    it('deve chamar onEdit ao clicar em editar', async () => {
      const user = userEvent.setup();
      renderWithProviders(<UsersTable {...defaultProps} />);

      const editButton = screen.getByLabelText('Editar Admin User');
      await user.click(editButton);

      expect(mockOnEdit).toHaveBeenCalledWith(mockUsers[0]);
    });

    it('deve chamar onDelete ao clicar em deletar', async () => {
      const user = userEvent.setup();
      renderWithProviders(<UsersTable {...defaultProps} />);

      const deleteButton = screen.getByLabelText('Deletar Admin User');
      await user.click(deleteButton);

      expect(mockOnDelete).toHaveBeenCalledWith(mockUsers[0]);
    });

    it('deve chamar onRoleChange ao mudar role', async () => {
      const user = userEvent.setup();
      renderWithProviders(<UsersTable {...defaultProps} />);

      const roleSelect = screen.getByLabelText('Role de Admin User');
      await user.selectOptions(roleSelect, 'manager');

      expect(mockOnRoleChange).toHaveBeenCalledWith(mockUsers[0].id, 'manager');
    });
  });

  describe('Empty State', () => {
    it('deve mostrar estado vazio quando não há usuários', () => {
      renderWithProviders(<UsersTable {...defaultProps} users={[]} />);

      expect(screen.getByText('Nenhum usuário encontrado')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('deve ter aria-labels em botões', () => {
      renderWithProviders(<UsersTable {...defaultProps} />);

      expect(screen.getByLabelText('Editar Admin User')).toBeInTheDocument();
      expect(screen.getByLabelText('Deletar Admin User')).toBeInTheDocument();
    });

    it('deve ter role="table"', () => {
      renderWithProviders(<UsersTable {...defaultProps} />);

      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
    });

    it('deve ser navegável por teclado', async () => {
      const user = userEvent.setup();
      renderWithProviders(<UsersTable {...defaultProps} />);

      const editButton = screen.getByLabelText('Editar Admin User');

      // Tab até o botão
      await user.tab();
      expect(editButton).toHaveFocus();

      // Enter para acionar
      await user.keyboard('{Enter}');
      expect(mockOnEdit).toHaveBeenCalled();
    });
  });

  describe('Responsive', () => {
    it('deve ocultar colunas menos importantes em mobile', () => {
      // Mock mobile viewport
      window.innerWidth = 375;
      window.dispatchEvent(new Event('resize'));

      renderWithProviders(<UsersTable {...defaultProps} />);

      // Colunas principais devem estar visíveis
      expect(screen.getByText('Nome')).toBeInTheDocument();
      expect(screen.getByText('Ações')).toBeInTheDocument();

      // Colunas secundárias devem estar ocultas
      expect(screen.queryByText('Criado em')).not.toBeVisible();
    });
  });

  describe('Dark Mode', () => {
    it('deve aplicar classes de dark mode', () => {
      const adminContextValue = { adminTheme: 'dark' };
      renderWithProviders(
        <UsersTable {...defaultProps} />,
        { adminContextValue }
      );

      const table = screen.getByRole('table');
      expect(table).toHaveClass('dark:bg-gray-800');
    });
  });

  describe('Performance', () => {
    it('deve renderizar rápido com muitos usuários', () => {
      const manyUsers = Array.from({ length: 1000 }, (_, i) => ({
        ...mockUsers[0],
        id: `${i}`,
        name: `User ${i}`,
        email: `user${i}@test.com`,
      }));

      const start = performance.now();
      renderWithProviders(<UsersTable {...defaultProps} users={manyUsers} />);
      const end = performance.now();

      expect(end - start).toBeLessThan(500); // < 500ms
    });
  });
});
```

---

**Última Atualização:** 2026-02-25
**Responsável:** @qa (Quality Assurance Agent)
**Revisores:** @dev, @architect
**Status:** 🟢 Pronto para Implementação
