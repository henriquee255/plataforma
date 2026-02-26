# Exemplos de Código - Otimização Admin Panel

**Complemento do:** ADMIN-PERFORMANCE-ANALYSIS.md
**Data:** 2026-02-25

Este documento contém código pronto para implementação das otimizações propostas.

---

## 📦 Fase 1: Quick Wins - Código Pronto

### 1.1 Dados Mockados Externos

**Arquivo:** `src/pages/Admin/mockData.js`

```javascript
// src/pages/Admin/mockData.js

// Usuários mockados
export const MOCK_USERS = [
  { id: 1, nome: 'João Silva', email: 'joao.silva@email.com', telefone: '+55 11 98765-4321', plano: 'professional', status: 'Ativo', dataCadastro: '2025-01-15', ultimoAcesso: '2026-02-24 14:30', faturamento: 2980.00, role: 'Admin' },
  { id: 2, nome: 'Maria Santos', email: 'maria.santos@email.com', telefone: '+55 11 98765-4322', plano: 'starter', status: 'Ativo', dataCadastro: '2025-02-10', ultimoAcesso: '2026-02-24 12:15', faturamento: 497.00, role: 'User' },
  { id: 3, nome: 'Pedro Costa', email: 'pedro.costa@email.com', telefone: '+55 11 98765-4323', plano: 'enterprise', status: 'Ativo', dataCadastro: '2024-11-20', ultimoAcesso: '2026-02-24 09:45', faturamento: 7490.00, role: 'Admin' },
  { id: 4, nome: 'Ana Paula', email: 'ana.paula@email.com', telefone: '+55 11 98765-4324', plano: 'professional', status: 'Suspenso', dataCadastro: '2025-03-05', ultimoAcesso: '2026-02-20 16:00', faturamento: 1490.00, role: 'User' },
  { id: 5, nome: 'Carlos Eduardo', email: 'carlos.eduardo@email.com', telefone: '+55 11 98765-4325', plano: 'trial', status: 'Trial', dataCadastro: '2026-02-20', ultimoAcesso: '2026-02-24 11:20', faturamento: 0.00, role: 'User' }
];

// Estatísticas
export const MOCK_STATS = {
  totalUsers: 1247,
  totalCompanies: 389,
  mrr: 156480,
  arr: 1877760,
  activeUsers: 892,
  totalRevenue: 284650.50,
  activeIntegrations: 15,
  systemUptime: '99.8%',
  avgResponseTime: '125ms',
  errorRate: '0.2%',
  newUsersThisMonth: 89,
  churnRate: 2.8,
  estimatedCancellations: 11
};

// Distribuição de planos
export const MOCK_PLAN_DISTRIBUTION = {
  free: 189,
  starter: 389,
  professional: 542,
  enterprise: 127
};

// Empresas recentes
export const MOCK_COMPANIES = [
  { id: 1000, name: 'Tech Solutions Ltda', email: 'contato@techsolutions.com', plan: 'enterprise', owner: 'João Silva', createdAt: '2026-02-20' },
  { id: 1001, name: 'Marketing Digital Pro', email: 'info@marketingpro.com', plan: 'professional', owner: 'Maria Santos', createdAt: '2026-02-19' },
  { id: 1002, name: 'Vendas Online Inc', email: 'vendas@vendasinc.com', plan: 'starter', owner: 'Pedro Costa', createdAt: '2026-02-18' },
  { id: 1003, name: 'E-commerce Global', email: 'admin@ecommerceglobal.com', plan: 'professional', owner: 'Ana Paula', createdAt: '2026-02-17' },
  { id: 1004, name: 'Infoprodutos Plus', email: 'contato@infoprodutosplus.com', plan: 'free', owner: 'Carlos Eduardo', createdAt: '2026-02-16' }
];

// Integrações do sistema
export const MOCK_INTEGRATIONS = [
  { id: 1, name: 'Kiwify', type: 'Pagamento', status: 'Ativo', users: 342, lastSync: '2026-02-24 14:00' },
  { id: 2, name: 'Hotmart', type: 'Pagamento', status: 'Ativo', users: 218, lastSync: '2026-02-24 13:45' },
  { id: 3, name: 'Stripe', type: 'Pagamento', status: 'Ativo', users: 156, lastSync: '2026-02-24 14:15' },
  { id: 4, name: 'WhatsApp Business', type: 'Comunicação', status: 'Ativo', users: 892, lastSync: '2026-02-24 14:20' },
  { id: 5, name: 'Instagram', type: 'Social', status: 'Ativo', users: 567, lastSync: '2026-02-24 14:10' },
  { id: 6, name: 'Email SMTP', type: 'Email', status: 'Ativo', users: 1247, lastSync: '2026-02-24 14:05' }
];

// Logs do sistema
export const MOCK_LOGS = [
  { id: 1, timestamp: '2026-02-24 14:30:15', level: 'INFO', module: 'Auth', message: 'Login bem-sucedido: joao.silva@email.com', ip: '192.168.1.100' },
  { id: 2, timestamp: '2026-02-24 14:28:42', level: 'WARNING', module: 'Payment', message: 'Tentativa de pagamento duplicado detectada', ip: '192.168.1.105' },
  { id: 3, timestamp: '2026-02-24 14:25:10', level: 'ERROR', module: 'Integration', message: 'Falha na sincronização Kiwify - timeout', ip: '10.0.0.50' },
  { id: 4, timestamp: '2026-02-24 14:20:33', level: 'INFO', module: 'User', message: 'Novo usuário registrado: carlos.eduardo@email.com', ip: '192.168.1.110' },
  { id: 5, timestamp: '2026-02-24 14:15:05', level: 'INFO', module: 'System', message: 'Backup automático concluído com sucesso', ip: 'SYSTEM' },
  { id: 6, timestamp: '2026-02-24 14:10:28', level: 'WARNING', module: 'Security', message: 'Múltiplas tentativas de login falhadas: admin@test.com', ip: '203.45.67.89' },
  { id: 7, timestamp: '2026-02-24 14:05:12', level: 'ERROR', module: 'Database', message: 'Timeout na consulta de usuários - otimização necessária', ip: 'DB-SERVER' },
  { id: 8, timestamp: '2026-02-24 14:00:45', level: 'INFO', module: 'Analytics', message: 'Relatório mensal gerado e enviado', ip: 'SYSTEM' }
];

// Membros das empresas
export const MOCK_COMPANY_MEMBERS = {
  1000: [
    { id: 1, name: 'João Silva', email: 'joao.silva@techsolutions.com', cargo: 'CEO', setor: 'Executivo', role: 'owner', status: 'active', lastAccess: '2 horas atrás' },
    { id: 2, name: 'Maria Santos', email: 'maria.santos@techsolutions.com', cargo: 'Gerente de Vendas', setor: 'Comercial', role: 'admin', status: 'active', lastAccess: '5 horas atrás' },
    { id: 3, name: 'Pedro Oliveira', email: 'pedro.oliveira@techsolutions.com', cargo: 'Desenvolvedor Senior', setor: 'TI', role: 'member', status: 'active', lastAccess: '1 dia atrás' },
    { id: 4, name: 'Ana Costa', email: 'ana.costa@techsolutions.com', cargo: 'Analista de Marketing', setor: 'Marketing', role: 'member', status: 'active', lastAccess: '3 horas atrás' },
    { id: 5, name: 'Carlos Ferreira', email: 'carlos.ferreira@techsolutions.com', cargo: 'Diretor Financeiro', setor: 'Financeiro', role: 'admin', status: 'active', lastAccess: '1 hora atrás' },
    { id: 6, name: 'Julia Mendes', email: 'julia.mendes@techsolutions.com', cargo: 'Analista de Suporte', setor: 'Atendimento', role: 'member', status: 'inactive', lastAccess: '2 semanas atrás' }
  ],
  1001: [
    { id: 1, name: 'Maria Santos', email: 'maria@marketingpro.com', cargo: 'Diretora', setor: 'Executivo', role: 'owner', status: 'active', lastAccess: '30 minutos atrás' },
    { id: 2, name: 'Roberto Lima', email: 'roberto@marketingpro.com', cargo: 'Gestor de Mídias', setor: 'Marketing', role: 'admin', status: 'active', lastAccess: '2 horas atrás' },
    { id: 3, name: 'Fernanda Rocha', email: 'fernanda@marketingpro.com', cargo: 'Designer Gráfico', setor: 'Criação', role: 'member', status: 'active', lastAccess: '1 hora atrás' }
  ],
  1002: [
    { id: 1, name: 'Pedro Costa', email: 'pedro@vendasinc.com', cargo: 'Fundador', setor: 'Executivo', role: 'owner', status: 'active', lastAccess: 'Agora' },
    { id: 2, name: 'Beatriz Alves', email: 'beatriz@vendasinc.com', cargo: 'Gerente Comercial', setor: 'Vendas', role: 'admin', status: 'active', lastAccess: '4 horas atrás' }
  ],
  1003: [
    { id: 1, name: 'Ana Paula', email: 'ana@ecommerceglobal.com', cargo: 'CEO', setor: 'Executivo', role: 'owner', status: 'active', lastAccess: '1 hora atrás' }
  ],
  1004: []
};

// Configurações das empresas
export const MOCK_COMPANY_SETTINGS = {
  1000: {
    cargos: [
      { id: 1, name: 'CEO' },
      { id: 2, name: 'Gerente de Vendas' },
      { id: 3, name: 'Desenvolvedor Senior' },
      { id: 4, name: 'Analista de Marketing' },
      { id: 5, name: 'Diretor Financeiro' },
      { id: 6, name: 'Analista de Suporte' }
    ],
    setores: [
      { id: 1, name: 'Executivo' },
      { id: 2, name: 'Comercial' },
      { id: 3, name: 'TI' },
      { id: 4, name: 'Marketing' },
      { id: 5, name: 'Financeiro' },
      { id: 6, name: 'Atendimento' }
    ],
    roles: [
      { id: 1, name: 'Owner', color: 'purple', permissions: ['all'] },
      { id: 2, name: 'Administrador', color: 'blue', permissions: ['gerenciar_membros', 'editar_configuracoes', 'visualizar_relatorios', 'gerenciar_integrações'] },
      { id: 3, name: 'Membro', color: 'gray', permissions: ['visualizar_dashboard', 'editar_perfil'] }
    ]
  }
};
```

---

### 1.2 Funções Helper Externas

**Arquivo:** `src/pages/Admin/utils/helpers.js`

```javascript
// src/pages/Admin/utils/helpers.js

/**
 * Retorna classes CSS baseadas no status
 */
export const getStatusColor = (status) => {
  const colors = {
    'Ativo': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Suspenso': 'bg-red-100 text-red-700 border-red-200',
    'Trial': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'Inativo': 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'
  };
  return colors[status] || 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700';
};

/**
 * Retorna classes CSS baseadas no nível de log
 */
export const getLogLevelColor = (level) => {
  const colors = {
    'INFO': 'bg-blue-100 text-blue-700 border-blue-200',
    'WARNING': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'ERROR': 'bg-red-100 text-red-700 border-red-200'
  };
  return colors[level] || 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700';
};

/**
 * Filtra usuários baseado em múltiplos critérios
 */
export const filterUsers = (users, searchTerm, filterPlano, filterStatus, filterTipo, planInfo) => {
  return users.filter(user => {
    // Filtro de busca por texto
    const matchesSearch =
      user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      planInfo[user.plano]?.label.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtro por plano
    const matchesPlano = filterPlano === 'todos' || user.plano === filterPlano;

    // Filtro por status
    const matchesStatus = filterStatus === 'todos' || user.status === filterStatus;

    // Filtro por tipo (SuperAdmin vs Usuário Comum)
    const matchesTipo =
      filterTipo === 'todos' ||
      (filterTipo === 'superadmin' && user.role === 'Admin') ||
      (filterTipo === 'comum' && user.role !== 'Admin');

    return matchesSearch && matchesPlano && matchesStatus && matchesTipo;
  });
};
```

---

### 1.3 Constantes Externas

**Arquivo:** `src/pages/Admin/utils/constants.js`

```javascript
// src/pages/Admin/utils/constants.js
import {
  FaClock,
  FaCalendar,
  FaStar,
  FaInfinity
} from 'react-icons/fa';

// Informações dos planos
export const PLAN_INFO = {
  free: {
    label: 'Gratuito',
    color: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700',
    icon: FaClock
  },
  trial: {
    label: 'Trial',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    icon: FaClock
  },
  starter: {
    label: 'Starter',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: FaCalendar
  },
  professional: {
    label: 'Professional',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    icon: FaStar
  },
  enterprise: {
    label: 'Enterprise',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    icon: FaInfinity
  }
};

// Menu items do sidebar
export const MENU_ITEMS = [
  { id: 'dashboard', icon: 'FaChartLine', label: 'Geral' },
  { id: 'companies', icon: 'FaBuilding', label: 'Empresas' },
  { id: 'users', icon: 'FaUsers', label: 'Usuários & Admins' },
  { id: 'integrations', icon: 'FaPlug', label: 'Integrações' },
  { id: 'logs', icon: 'FaFileAlt', label: 'Logs de Atividade' },
  { id: 'analytics', icon: 'FaChartBar', label: 'Analytics' },
  { id: 'settings', icon: 'FaCog', label: 'Configurações Globais' }
];
```

---

### 1.4 StatCard Memoizado

**Arquivo:** `src/pages/Admin/components/StatCard.jsx`

```javascript
// src/pages/Admin/components/StatCard.jsx
import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const StatCard = React.memo(({ label, value, sub, icon: Icon, color, bg, trend, trendValue }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${bg}`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        {trendValue && trend && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold ${
            trend === 'up' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' :
            trend === 'down' ? 'bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400' :
            'bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
          }`}>
            {trend === 'up' ? <FaArrowUp className="w-3 h-3" /> :
             trend === 'down' ? <FaArrowDown className="w-3 h-3" /> : null}
            {trendValue}
          </div>
        )}
      </div>
      <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">
        {label}
      </p>
      <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
        {value}
      </h3>
      <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-1">
        {sub}
      </p>
    </div>
  );
});

StatCard.displayName = 'StatCard';

export default StatCard;
```

---

### 1.5 Admin.jsx com Otimizações Fase 1

**Arquivo:** `src/pages/Admin.jsx` (trechos modificados)

```javascript
// src/pages/Admin.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { useAuth } from '../hooks/useAuth';

// Importar dados mockados
import {
  MOCK_USERS,
  MOCK_STATS,
  MOCK_PLAN_DISTRIBUTION,
  MOCK_COMPANIES,
  MOCK_INTEGRATIONS,
  MOCK_LOGS
} from './Admin/mockData';

// Importar funções helper
import { getStatusColor, getLogLevelColor, filterUsers } from './Admin/utils/helpers';

// Importar constantes
import { PLAN_INFO, MENU_ITEMS } from './Admin/utils/constants';

// Importar componentes
import StatCard from './Admin/components/StatCard';

// ... (imports de ícones mantidos)

const AdminNew = ({ onNavigate }) => {
  const { userData } = useAppContext();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Estados
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlano, setFilterPlano] = useState('todos');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [filterTipo, setFilterTipo] = useState('todos');
  // ... (outros estados mantidos)

  // ✅ OTIMIZAÇÃO: useMemo para filteredUsers
  const filteredUsers = useMemo(() => {
    return filterUsers(MOCK_USERS, searchTerm, filterPlano, filterStatus, filterTipo, PLAN_INFO);
  }, [searchTerm, filterPlano, filterStatus, filterTipo]);

  // ✅ OTIMIZAÇÃO: useMemo para dados que não mudam
  const stats = useMemo(() => MOCK_STATS, []);
  const planDistribution = useMemo(() => MOCK_PLAN_DISTRIBUTION, []);

  // ... (resto do código mantido)

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Sidebar mantido */}

      <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <div className="p-6 md:p-8 pb-16 max-w-screen-xl mx-auto">

          {/* TAB: Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="animate-fade-in">
              {/* ... */}

              {/* ✅ StatCard agora é memoizado */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  label="Total de Usuários"
                  value={stats.totalUsers.toLocaleString('pt-BR')}
                  sub="Todos os usuários ativos"
                  icon={FaUsers}
                  color="text-indigo-600"
                  bg="bg-indigo-50"
                  trend="up"
                  trendValue="+12%"
                />
                {/* ... outros StatCards */}
              </div>
            </div>
          )}

          {/* ... (outras tabs mantidas) */}
        </div>
      </main>
    </div>
  );
};

export default AdminNew;
```

---

## 📦 Fase 2: Refatoração de Estado

### 2.1 Custom Hook useFilters

**Arquivo:** `src/pages/Admin/hooks/useFilters.js`

```javascript
// src/pages/Admin/hooks/useFilters.js
import { useState, useCallback } from 'react';

export const useFilters = (initialFilters = {
  search: '',
  plano: 'todos',
  status: 'todos',
  tipo: 'todos'
}) => {
  const [filters, setFilters] = useState(initialFilters);

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const setSearch = useCallback((value) => {
    setFilters(prev => ({ ...prev, search: value }));
  }, []);

  const setPlano = useCallback((value) => {
    setFilters(prev => ({ ...prev, plano: value }));
  }, []);

  const setStatus = useCallback((value) => {
    setFilters(prev => ({ ...prev, status: value }));
  }, []);

  const setTipo = useCallback((value) => {
    setFilters(prev => ({ ...prev, tipo: value }));
  }, []);

  return {
    filters,
    updateFilter,
    resetFilters,
    setSearch,
    setPlano,
    setStatus,
    setTipo
  };
};
```

**Uso no Admin.jsx:**

```javascript
// Admin.jsx
import { useFilters } from './Admin/hooks/useFilters';

const AdminNew = ({ onNavigate }) => {
  // ✅ ANTES: 4 estados separados
  // const [searchTerm, setSearchTerm] = useState('');
  // const [filterPlano, setFilterPlano] = useState('todos');
  // const [filterStatus, setFilterStatus] = useState('todos');
  // const [filterTipo, setFilterTipo] = useState('todos');

  // ✅ DEPOIS: 1 hook customizado
  const { filters, setSearch, setPlano, setStatus, setTipo, resetFilters } = useFilters();

  // Atualizar useMemo
  const filteredUsers = useMemo(() => {
    return filterUsers(
      MOCK_USERS,
      filters.search,
      filters.plano,
      filters.status,
      filters.tipo,
      PLAN_INFO
    );
  }, [filters.search, filters.plano, filters.status, filters.tipo]);

  // No JSX:
  // <input value={filters.search} onChange={(e) => setSearch(e.target.value)} />
  // <select value={filters.plano} onChange={(e) => setPlano(e.target.value)}>
};
```

---

### 2.2 Modal Reducer

**Arquivo:** `src/pages/Admin/hooks/useModals.js`

```javascript
// src/pages/Admin/hooks/useModals.js
import { useReducer, useCallback } from 'react';

const initialState = {
  userModal: { open: false, tab: 'info', user: null, editingRole: 'comum' },
  companyDetailsModal: { open: false, tab: 'detalhes', company: null },
  companyEditModal: { open: false, company: null },
  memberEditModal: { open: false, member: null },
  cargoModal: { open: false, editing: null },
  setorModal: { open: false, editing: null },
  roleModal: { open: false, editing: null }
};

const modalReducer = (state, action) => {
  switch (action.type) {
    // User Modal
    case 'OPEN_USER_MODAL':
      return {
        ...state,
        userModal: {
          open: true,
          tab: 'info',
          user: action.payload,
          editingRole: action.payload.role === 'Admin' ? 'superadmin' : 'comum'
        }
      };
    case 'CLOSE_USER_MODAL':
      return {
        ...state,
        userModal: { open: false, tab: 'info', user: null, editingRole: 'comum' }
      };
    case 'SET_USER_MODAL_TAB':
      return {
        ...state,
        userModal: { ...state.userModal, tab: action.payload }
      };
    case 'SET_USER_EDITING_ROLE':
      return {
        ...state,
        userModal: { ...state.userModal, editingRole: action.payload }
      };

    // Company Details Modal
    case 'OPEN_COMPANY_DETAILS_MODAL':
      return {
        ...state,
        companyDetailsModal: {
          open: true,
          tab: 'detalhes',
          company: action.payload
        }
      };
    case 'CLOSE_COMPANY_DETAILS_MODAL':
      return {
        ...state,
        companyDetailsModal: { open: false, tab: 'detalhes', company: null }
      };
    case 'SET_COMPANY_MODAL_TAB':
      return {
        ...state,
        companyDetailsModal: {
          ...state.companyDetailsModal,
          tab: action.payload
        }
      };

    // Company Edit Modal
    case 'OPEN_COMPANY_EDIT_MODAL':
      return {
        ...state,
        companyEditModal: { open: true, company: action.payload }
      };
    case 'CLOSE_COMPANY_EDIT_MODAL':
      return {
        ...state,
        companyEditModal: { open: false, company: null }
      };

    // Member Edit Modal
    case 'OPEN_MEMBER_EDIT_MODAL':
      return {
        ...state,
        memberEditModal: { open: true, member: action.payload }
      };
    case 'CLOSE_MEMBER_EDIT_MODAL':
      return {
        ...state,
        memberEditModal: { open: false, member: null }
      };

    // Cargo Modal
    case 'OPEN_CARGO_MODAL':
      return {
        ...state,
        cargoModal: { open: true, editing: action.payload || null }
      };
    case 'CLOSE_CARGO_MODAL':
      return {
        ...state,
        cargoModal: { open: false, editing: null }
      };

    // Setor Modal
    case 'OPEN_SETOR_MODAL':
      return {
        ...state,
        setorModal: { open: true, editing: action.payload || null }
      };
    case 'CLOSE_SETOR_MODAL':
      return {
        ...state,
        setorModal: { open: false, editing: null }
      };

    // Role Modal
    case 'OPEN_ROLE_MODAL':
      return {
        ...state,
        roleModal: { open: true, editing: action.payload || null }
      };
    case 'CLOSE_ROLE_MODAL':
      return {
        ...state,
        roleModal: { open: false, editing: null }
      };

    default:
      return state;
  }
};

export const useModals = () => {
  const [state, dispatch] = useReducer(modalReducer, initialState);

  // User Modal actions
  const openUserModal = useCallback((user) => {
    dispatch({ type: 'OPEN_USER_MODAL', payload: user });
  }, []);

  const closeUserModal = useCallback(() => {
    dispatch({ type: 'CLOSE_USER_MODAL' });
  }, []);

  const setUserModalTab = useCallback((tab) => {
    dispatch({ type: 'SET_USER_MODAL_TAB', payload: tab });
  }, []);

  const setUserEditingRole = useCallback((role) => {
    dispatch({ type: 'SET_USER_EDITING_ROLE', payload: role });
  }, []);

  // Company Details Modal actions
  const openCompanyDetailsModal = useCallback((company) => {
    dispatch({ type: 'OPEN_COMPANY_DETAILS_MODAL', payload: company });
  }, []);

  const closeCompanyDetailsModal = useCallback(() => {
    dispatch({ type: 'CLOSE_COMPANY_DETAILS_MODAL' });
  }, []);

  const setCompanyModalTab = useCallback((tab) => {
    dispatch({ type: 'SET_COMPANY_MODAL_TAB', payload: tab });
  }, []);

  // Company Edit Modal actions
  const openCompanyEditModal = useCallback((company) => {
    dispatch({ type: 'OPEN_COMPANY_EDIT_MODAL', payload: company });
  }, []);

  const closeCompanyEditModal = useCallback(() => {
    dispatch({ type: 'CLOSE_COMPANY_EDIT_MODAL' });
  }, []);

  // Member Edit Modal actions
  const openMemberEditModal = useCallback((member) => {
    dispatch({ type: 'OPEN_MEMBER_EDIT_MODAL', payload: member });
  }, []);

  const closeMemberEditModal = useCallback(() => {
    dispatch({ type: 'CLOSE_MEMBER_EDIT_MODAL' });
  }, []);

  // Cargo Modal actions
  const openCargoModal = useCallback((cargo = null) => {
    dispatch({ type: 'OPEN_CARGO_MODAL', payload: cargo });
  }, []);

  const closeCargoModal = useCallback(() => {
    dispatch({ type: 'CLOSE_CARGO_MODAL' });
  }, []);

  // Setor Modal actions
  const openSetorModal = useCallback((setor = null) => {
    dispatch({ type: 'OPEN_SETOR_MODAL', payload: setor });
  }, []);

  const closeSetorModal = useCallback(() => {
    dispatch({ type: 'CLOSE_SETOR_MODAL' });
  }, []);

  // Role Modal actions
  const openRoleModal = useCallback((role = null) => {
    dispatch({ type: 'OPEN_ROLE_MODAL', payload: role });
  }, []);

  const closeRoleModal = useCallback(() => {
    dispatch({ type: 'CLOSE_ROLE_MODAL' });
  }, []);

  return {
    modals: state,
    // User Modal
    openUserModal,
    closeUserModal,
    setUserModalTab,
    setUserEditingRole,
    // Company Details Modal
    openCompanyDetailsModal,
    closeCompanyDetailsModal,
    setCompanyModalTab,
    // Company Edit Modal
    openCompanyEditModal,
    closeCompanyEditModal,
    // Member Edit Modal
    openMemberEditModal,
    closeMemberEditModal,
    // Cargo Modal
    openCargoModal,
    closeCargoModal,
    // Setor Modal
    openSetorModal,
    closeSetorModal,
    // Role Modal
    openRoleModal,
    closeRoleModal
  };
};
```

**Uso no Admin.jsx:**

```javascript
// Admin.jsx
import { useModals } from './Admin/hooks/useModals';

const AdminNew = ({ onNavigate }) => {
  // ✅ ANTES: 15+ estados de modais
  // const [selectedUser, setSelectedUser] = useState(null);
  // const [showUserModal, setShowUserModal] = useState(false);
  // const [userModalTab, setUserModalTab] = useState('info');
  // ... (mais 12 estados)

  // ✅ DEPOIS: 1 hook customizado
  const {
    modals,
    openUserModal,
    closeUserModal,
    setUserModalTab,
    openCompanyDetailsModal,
    // ... outros métodos
  } = useModals();

  // No JSX:
  // <button onClick={() => openUserModal(user)}>Ver Detalhes</button>
  //
  // {modals.userModal.open && (
  //   <UserModal
  //     user={modals.userModal.user}
  //     tab={modals.userModal.tab}
  //     onClose={closeUserModal}
  //     onChangeTab={setUserModalTab}
  //   />
  // )}
};
```

---

## 📊 Performance Monitoring - Código Pronto

### Web Vitals Integration

**Arquivo:** `src/utils/webVitals.js`

```javascript
// src/utils/webVitals.js
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    getCLS(onPerfEntry);
    getFID(onPerfEntry);
    getFCP(onPerfEntry);
    getLCP(onPerfEntry);
    getTTFB(onPerfEntry);
  }
};

export const logWebVitalsToConsole = () => {
  reportWebVitals((metric) => {
    const { name, value, rating } = metric;
    const emoji = rating === 'good' ? '✅' : rating === 'needs-improvement' ? '⚠️' : '🔴';

    console.log(`${emoji} ${name}:`, {
      value: Math.round(value),
      rating,
      metric
    });
  });
};

export const sendWebVitalsToAnalytics = () => {
  reportWebVitals((metric) => {
    // Enviar para Google Analytics
    if (window.gtag) {
      window.gtag('event', metric.name, {
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_category: 'Web Vitals',
        event_label: metric.id,
        non_interaction: true
      });
    }

    // Enviar para Sentry (opcional)
    if (window.Sentry) {
      window.Sentry.captureMessage(`Web Vital: ${metric.name}`, {
        level: metric.rating === 'good' ? 'info' : 'warning',
        tags: {
          webVital: metric.name,
          rating: metric.rating
        },
        contexts: {
          metric: {
            value: metric.value,
            rating: metric.rating,
            id: metric.id
          }
        }
      });
    }
  });
};
```

**Uso no main.jsx:**

```javascript
// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { logWebVitalsToConsole, sendWebVitalsToAnalytics } from './utils/webVitals';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Monitorar Web Vitals
if (import.meta.env.DEV) {
  logWebVitalsToConsole(); // Apenas em desenvolvimento
} else {
  sendWebVitalsToAnalytics(); // Enviar para analytics em produção
}
```

---

## 📝 Checklist de Implementação

### ✅ Fase 1 (2-4 horas)

```markdown
- [ ] Criar pasta `src/pages/Admin/`
- [ ] Criar `src/pages/Admin/mockData.js` e mover dados
- [ ] Criar `src/pages/Admin/utils/helpers.js` e mover funções
- [ ] Criar `src/pages/Admin/utils/constants.js` e mover constantes
- [ ] Criar `src/pages/Admin/components/StatCard.jsx` com React.memo
- [ ] Atualizar imports em `src/pages/Admin.jsx`
- [ ] Adicionar `useMemo` em `filteredUsers`
- [ ] Adicionar `useMemo` em `stats` e `planDistribution`
- [ ] Testar: npm run dev
- [ ] Verificar: console não deve ter warnings
- [ ] Medir: Lighthouse score deve melhorar +10-15 pontos
```

### ✅ Fase 2 (4-6 horas)

```markdown
- [ ] Criar pasta `src/pages/Admin/hooks/`
- [ ] Criar `useFilters.js` hook customizado
- [ ] Criar `useModals.js` com useReducer
- [ ] Atualizar `Admin.jsx` para usar useFilters
- [ ] Atualizar `Admin.jsx` para usar useModals
- [ ] Adicionar `useCallback` nos event handlers (min 10)
- [ ] Testar: todas as funcionalidades devem continuar funcionando
- [ ] Verificar: React DevTools Profiler - re-renders devem cair 40%
- [ ] Medir: TTI deve melhorar ~1.2s
```

---

**FIM DO DOCUMENTO**

**Próximos Passos:**
1. Implementar Fase 1 (Quick Wins)
2. Validar melhorias com Lighthouse
3. Prosseguir para Fase 2 se resultados satisfatórios
4. Iterar baseado em métricas reais
