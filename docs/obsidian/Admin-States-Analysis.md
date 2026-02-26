# 📊 Análise de Estados - Admin.jsx

> **Arquivo:** `src/pages/Admin.jsx`
> **Total de Estados:** 33 estados locais
> **Problema:** Gerenciamento complexo e prop drilling

---

## 🔍 Breakdown Completo dos Estados

### 1️⃣ Estados de Navegação e Tema (2)

```javascript
const [activeTab, setActiveTab] = useState('dashboard');
const [adminTheme, setAdminTheme] = useState(() => {
  const saved = localStorage.getItem('adminTheme');
  return saved || 'light';
});
```

**Uso:**
- `activeTab`: Controla qual tab está visível (dashboard, companies, users, integrations, logs, analytics, settings)
- `adminTheme`: Tema independente do painel (light/dark)

**Proposta:** ✅ Mover para AdminContext

---

### 2️⃣ Estados de Filtros e Busca (4)

```javascript
const [searchTerm, setSearchTerm] = useState('');
const [filterPlano, setFilterPlano] = useState('todos');
const [filterStatus, setFilterStatus] = useState('todos');
const [filterTipo, setFilterTipo] = useState('todos');
```

**Uso:**
- Filtrar lista de usuários/empresas
- Busca global por nome/email

**Proposta:** ✅ Consolidar em objeto `filters` no AdminContext + hook `useAdminFilters`

```javascript
// AdminContext
const [filters, setFilters] = useState({
  searchTerm: '',
  plano: 'todos',
  status: 'todos',
  tipo: 'todos'
});
```

---

### 3️⃣ Estados de Modal de Usuário (4)

```javascript
const [selectedUser, setSelectedUser] = useState(null);
const [showUserModal, setShowUserModal] = useState(false);
const [userModalTab, setUserModalTab] = useState('info');
const [editingUserRole, setEditingUserRole] = useState('comum');
```

**Uso:**
- Abrir/fechar modal de edição de usuário
- Controlar tab ativa (info, config, actions)
- Gerenciar role sendo editada

**Proposta:** ✅ Consolidar em objeto `userModal` no AdminContext

```javascript
const [userModal, setUserModal] = useState({
  open: false,
  user: null,
  activeTab: 'info',
  editingRole: 'comum'
});

// Helpers
const openUserModal = (user, tab = 'info') => {
  setUserModal({ open: true, user, activeTab: tab, editingRole: user.role });
};
const closeUserModal = () => {
  setUserModal({ open: false, user: null, activeTab: 'info', editingRole: 'comum' });
};
```

---

### 4️⃣ Estados de Modal de Empresa (4)

```javascript
const [selectedCompany, setSelectedCompany] = useState(null);
const [showCompanyDetailsModal, setShowCompanyDetailsModal] = useState(false);
const [showCompanyEditModal, setShowCompanyEditModal] = useState(false);
const [companyModalTab, setCompanyModalTab] = useState('detalhes');
```

**Uso:**
- Abrir modal lateral de detalhes da empresa
- Modal de edição
- Controlar tab ativa (detalhes, membros, plano, configuracoes)

**Proposta:** ✅ Consolidar em objeto `companyModal`

```javascript
const [companyModal, setCompanyModal] = useState({
  detailsOpen: false,
  editOpen: false,
  company: null,
  activeTab: 'detalhes'
});
```

---

### 5️⃣ Estados de Modal de Membro (2)

```javascript
const [selectedMember, setSelectedMember] = useState(null);
const [showMemberEditModal, setShowMemberEditModal] = useState(false);
```

**Uso:**
- Editar membro da empresa dentro do CompanyModal

**Proposta:** ✅ Mover para componente `MembersTab` (estado local)

---

### 6️⃣ Estados de Modais de Gestão (6)

```javascript
const [showAddCargoModal, setShowAddCargoModal] = useState(false);
const [showAddSetorModal, setShowAddSetorModal] = useState(false);
const [showAddRoleModal, setShowAddRoleModal] = useState(false);
const [editingCargo, setEditingCargo] = useState(null);
const [editingSetor, setEditingSetor] = useState(null);
const [editingRole, setEditingRole] = useState(null);
```

**Uso:**
- Gerenciar cargos, setores e roles da empresa
- Usado dentro da tab "Configurações" do CompanyModal

**Proposta:** ✅ Mover para componente `SettingsTab` (estado local)

```javascript
// Em SettingsTab/index.jsx
const [modals, setModals] = useState({
  cargo: { open: false, editing: null },
  setor: { open: false, editing: null },
  role: { open: false, editing: null }
});
```

---

## 🎯 Consolidação Proposta

### AdminContext (Estado Global)

```javascript
export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  // ===== NAVEGAÇÃO =====
  const [activeTab, setActiveTab] = useState('dashboard');

  // ===== TEMA =====
  const [adminTheme, setAdminTheme] = useState(() => {
    return localStorage.getItem('adminTheme') || 'light';
  });

  // ===== MODAIS =====
  const [userModal, setUserModal] = useState({
    open: false,
    user: null,
    activeTab: 'info',
    editingRole: 'comum'
  });

  const [companyModal, setCompanyModal] = useState({
    detailsOpen: false,
    editOpen: false,
    company: null,
    activeTab: 'detalhes'
  });

  // ===== FILTROS =====
  const [filters, setFilters] = useState({
    searchTerm: '',
    plano: 'todos',
    status: 'todos',
    tipo: 'todos'
  });

  // ===== HELPERS =====
  const openUserModal = (user, tab = 'info') => {
    setUserModal({
      open: true,
      user,
      activeTab: tab,
      editingRole: user?.role || 'comum'
    });
  };

  const closeUserModal = () => {
    setUserModal({
      open: false,
      user: null,
      activeTab: 'info',
      editingRole: 'comum'
    });
  };

  const openCompanyDetails = (company, tab = 'detalhes') => {
    setCompanyModal({
      detailsOpen: true,
      editOpen: false,
      company,
      activeTab: tab
    });
  };

  const closeCompanyModal = () => {
    setCompanyModal({
      detailsOpen: false,
      editOpen: false,
      company: null,
      activeTab: 'detalhes'
    });
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      searchTerm: '',
      plano: 'todos',
      status: 'todos',
      tipo: 'todos'
    });
  };

  const toggleTheme = () => {
    const newTheme = adminTheme === 'light' ? 'dark' : 'light';
    setAdminTheme(newTheme);
    localStorage.setItem('adminTheme', newTheme);

    // Aplicar ao DOM
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  };

  const value = {
    // Navegação
    activeTab,
    setActiveTab,

    // Tema
    adminTheme,
    toggleTheme,

    // User Modal
    userModal,
    openUserModal,
    closeUserModal,
    setUserModal,

    // Company Modal
    companyModal,
    openCompanyDetails,
    closeCompanyModal,
    setCompanyModal,

    // Filtros
    filters,
    updateFilter,
    resetFilters,
    setFilters
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdminContext must be used within AdminProvider');
  }
  return context;
};
```

### Estados Locais (Mantidos em Componentes)

#### MembersTab Component
```javascript
// src/pages/Admin/components/Companies/CompanyModal/MembersTab/index.jsx
const [memberModal, setMemberModal] = useState({
  open: false,
  member: null
});
```

#### SettingsTab Component
```javascript
// src/pages/Admin/components/Companies/CompanyModal/SettingsTab/index.jsx
const [modals, setModals] = useState({
  cargo: { open: false, editing: null },
  setor: { open: false, editing: null },
  role: { open: false, editing: null }
});
```

---

## 📊 Comparação: Antes vs Depois

| Métrica | Antes | Depois | Melhoria |
|---------|-------|--------|----------|
| **Estados no index.jsx** | 33 | 0 | -100% |
| **Estados no AdminContext** | 0 | 5 objetos | Centralizado |
| **Estados locais** | 0 | 2 componentes | Isolado |
| **Prop Drilling** | Alto | Zero | ✅ |
| **Manutenibilidade** | Baixa | Alta | ✅ |

---

## 🔗 Referências

- [[Admin Refactoring Plan]]
- [[AdminContext Implementation]]
- [[Component State Best Practices]]

---

**Última Atualização:** 2026-02-25
**Responsável:** @architect
