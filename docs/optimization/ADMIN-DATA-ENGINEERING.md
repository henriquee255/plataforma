# Admin Panel Data Engineering & Performance Optimization

**Data:** 2026-02-25
**Status:** 📋 ESPECIFICAÇÃO COMPLETA
**Autor:** @data-engineer
**Objetivo:** Otimizar queries, cache e pipelines de dados do Admin Panel

---

## 📊 Análise da Situação Atual

### Painel Admin - Visão Geral

O painel Admin (`src/pages/Admin.jsx`) é um componente monolítico de **2939 linhas** que gerencia:

- **Usuários** (1000+ registros potenciais)
- **Empresas** (500+ registros)
- **Membros** por empresa (5-50 membros cada)
- **Integrações** do sistema (6 tipos principais)
- **Logs** de atividade (ilimitado, crescimento constante)
- **Analytics** e métricas gerais

### Problemas Identificados

#### 1. Dados Mockados In-Memory
```javascript
// ❌ PROBLEMA: Arrays gigantes hardcoded no componente
const users = [
  { id: 1, nome: 'João Silva', ... },
  { id: 2, nome: 'Maria Santos', ... },
  // ... 1000+ usuários
];

const companyMembers = {
  1000: [{ id: 1, name: 'João', ... }, ...],
  1001: [{ id: 1, name: 'Maria', ... }, ...],
  // ... dados aninhados complexos
};
```

**Impacto:**
- Componente carrega TODOS os dados de uma vez
- Re-renders custosos (todo o array é recriado)
- Filtros e buscas lentos (operações em memória)
- Sem paginação server-side

#### 2. Filtros Não Otimizados
```javascript
// ❌ Filtro rodando em TODOS os dados a cada keystroke
const filteredUsers = users
  .filter(u => u.nome.toLowerCase().includes(searchTerm.toLowerCase()))
  .filter(u => filterPlano === 'todos' || u.plano === filterPlano)
  .filter(u => filterStatus === 'todos' || u.status === filterStatus);
```

**Impacto:**
- Busca sem debounce (API call a cada letra digitada)
- Filtros combinados executam múltiplas iterações
- Sem índices no backend

#### 3. Sem Sistema de Cache
```javascript
// ❌ Cada navegação de tab recarrega tudo
useEffect(() => {
  fetchUsers(); // Busca API toda vez
  fetchCompanies(); // Busca API toda vez
  fetchIntegrations(); // Busca API toda vez
}, [activeTab]);
```

**Impacto:**
- Requisições redundantes
- Latência acumulada (3-5 segundos por tab)
- Backend sobrecarregado

#### 4. Backend Não Preparado para Performance
```javascript
// backend/controllers/userController.js
export const getAllUsers = async (req, res) => {
  const users = await UserModel.findAll(); // ❌ SEM PAGINAÇÃO
  return res.status(200).json({ users }); // ❌ TODOS OS DADOS
};
```

**Impacto:**
- Queries lentas (full table scan)
- Payloads gigantes (200KB+ JSON)
- Timeout em tabelas grandes

---

## 🎯 Estratégia de Otimização

### Arquitetura Proposta

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │  useAdminData │───▶│  React Query │───▶│ Cache Layer  │  │
│  │   (hook)      │    │  (stale/5min) │   │ (localStorage)│  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│         │                                         │          │
│         ├─ usePaginatedData (tabelas)             │          │
│         ├─ useInfiniteScroll (logs)               │          │
│         └─ useDebounce (busca)                    │          │
│                                                               │
└───────────────────────────┬───────────────────────────────────┘
                            │
                     API REST (Express)
                            │
┌───────────────────────────▼───────────────────────────────────┐
│                     BACKEND (Node.js)                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │  Redis Cache │◀───│  Controllers │───▶│  MongoDB     │  │
│  │  (5min TTL)  │    │  (paginação) │    │  (indexes)   │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│                                                               │
│  Cache Strategy:                                              │
│  - Stats: 5 min TTL                                           │
│  - Lists: invalidate on CRUD                                  │
│  - Search: cache per query (1min)                             │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Implementação Detalhada

### FASE 1: Backend - Paginação e Índices

#### 1.1. Criar Endpoints Paginados

**Arquivo:** `backend/controllers/adminController.js` (NOVO)

```javascript
/**
 * GET /api/admin/users
 * Listar usuários com paginação, filtros e busca
 *
 * Query params:
 * - page: número da página (default: 1)
 * - limit: itens por página (default: 20, max: 100)
 * - search: termo de busca (nome, email)
 * - plan: filtro por plano (free, starter, professional, enterprise)
 * - status: filtro por status (ativo, suspenso, trial)
 * - sort: campo de ordenação (createdAt, name, email)
 * - order: direção (asc, desc)
 */
export const getUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      plan = '',
      status = '',
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    // Validação
    const pageNum = parseInt(page);
    const limitNum = Math.min(parseInt(limit), 100); // Max 100 items
    const skip = (pageNum - 1) * limitNum;

    // Construir query
    const query = {};

    // Full-text search (nome ou email)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Filtros
    if (plan && plan !== 'todos') {
      query.plan = plan;
    }

    if (status && status !== 'todos') {
      query.status = status;
    }

    // Executar query com paginação
    const [users, total] = await Promise.all([
      UserModel.find(query)
        .select('-password') // Nunca retornar senha
        .sort({ [sort]: order === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(), // Retorna objeto JS puro (mais rápido)
      UserModel.countDocuments(query) // Total para paginação
    ]);

    // Metadados de paginação
    const totalPages = Math.ceil(total / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    return res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages,
          hasNextPage,
          hasPrevPage
        }
      }
    });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao listar usuários',
      error: error.message
    });
  }
};

/**
 * GET /api/admin/stats
 * Estatísticas gerais do painel (cacheável)
 *
 * Cache: 5 minutos
 */
export const getStats = async (req, res) => {
  try {
    // Buscar do cache Redis primeiro
    const cacheKey = 'admin:stats:general';
    const cached = await redisClient.get(cacheKey);

    if (cached) {
      return res.status(200).json({
        success: true,
        data: JSON.parse(cached),
        cached: true
      });
    }

    // Executar queries em paralelo
    const [
      totalUsers,
      activeUsers,
      totalCompanies,
      totalRevenue,
      planDistribution
    ] = await Promise.all([
      UserModel.countDocuments(),
      UserModel.countDocuments({ status: 'ativo' }),
      CompanyModel.countDocuments(),
      SaleModel.aggregate([
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      UserModel.aggregate([
        { $group: { _id: '$plan', count: { $sum: 1 } } }
      ])
    ]);

    const stats = {
      users: {
        total: totalUsers,
        active: activeUsers,
        growth: calculateGrowthRate(totalUsers) // função auxiliar
      },
      companies: {
        total: totalCompanies
      },
      revenue: {
        total: totalRevenue[0]?.total || 0
      },
      plans: planDistribution.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {})
    };

    // Salvar no cache (5 minutos)
    await redisClient.setex(cacheKey, 300, JSON.stringify(stats));

    return res.status(200).json({
      success: true,
      data: stats,
      cached: false
    });
  } catch (error) {
    console.error('Erro ao buscar stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar estatísticas',
      error: error.message
    });
  }
};

/**
 * GET /api/admin/companies
 * Listar empresas com paginação
 */
export const getCompanies = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      plan = ''
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = Math.min(parseInt(limit), 100);
    const skip = (pageNum - 1) * limitNum;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (plan && plan !== 'todos') {
      query.plan = plan;
    }

    const [companies, total] = await Promise.all([
      CompanyModel.find(query)
        .populate('owner', 'name email') // Join com User
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      CompanyModel.countDocuments(query)
    ]);

    return res.status(200).json({
      success: true,
      data: {
        companies,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (error) {
    console.error('Erro ao listar empresas:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao listar empresas',
      error: error.message
    });
  }
};

/**
 * GET /api/admin/logs
 * Logs de atividade com infinite scroll
 */
export const getLogs = async (req, res) => {
  try {
    const {
      cursor = null, // Timestamp do último log carregado
      limit = 50,
      level = '', // INFO, WARNING, ERROR
      module = '' // Auth, Payment, Integration, etc
    } = req.query;

    const limitNum = Math.min(parseInt(limit), 100);

    const query = {};

    // Cursor-based pagination (mais eficiente que offset)
    if (cursor) {
      query.timestamp = { $lt: new Date(cursor) };
    }

    // Filtros
    if (level && level !== 'todos') {
      query.level = level;
    }

    if (module && module !== 'todos') {
      query.module = module;
    }

    const logs = await ActivityLogModel.find(query)
      .sort({ timestamp: -1 })
      .limit(limitNum + 1) // +1 para saber se tem mais
      .lean();

    const hasMore = logs.length > limitNum;
    const data = hasMore ? logs.slice(0, limitNum) : logs;
    const nextCursor = hasMore ? data[data.length - 1].timestamp : null;

    return res.status(200).json({
      success: true,
      data: {
        logs: data,
        pagination: {
          nextCursor,
          hasMore
        }
      }
    });
  } catch (error) {
    console.error('Erro ao buscar logs:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar logs',
      error: error.message
    });
  }
};
```

#### 1.2. Criar Índices no MongoDB

**Arquivo:** `backend/models/User.js`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  plan: {
    type: String,
    enum: ['free', 'starter', 'professional', 'enterprise'],
    default: 'free'
  },
  status: {
    type: String,
    enum: ['ativo', 'suspenso', 'trial'],
    default: 'ativo'
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'user'],
    default: 'user'
  }
}, {
  timestamps: true
});

// ÍNDICES PARA PERFORMANCE
userSchema.index({ email: 1 }); // Já existe (unique)
userSchema.index({ plan: 1, status: 1 }); // Filtros combinados
userSchema.index({ createdAt: -1 }); // Ordenação
userSchema.index({ name: 'text', email: 'text' }); // Full-text search

export default mongoose.model('User', userSchema);
```

**Arquivo:** `backend/models/Company.js`

```javascript
const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  plan: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'active' }
}, {
  timestamps: true
});

// ÍNDICES
companySchema.index({ name: 'text', email: 'text' });
companySchema.index({ owner: 1 });
companySchema.index({ plan: 1 });
companySchema.index({ createdAt: -1 });
```

**Arquivo:** `backend/models/ActivityLog.js` (NOVO)

```javascript
const activityLogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now, required: true },
  level: {
    type: String,
    enum: ['INFO', 'WARNING', 'ERROR'],
    required: true
  },
  module: {
    type: String,
    required: true
  },
  message: { type: String, required: true },
  ip: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  metadata: { type: mongoose.Schema.Types.Mixed }
}, {
  timestamps: false // Usar apenas timestamp custom
});

// ÍNDICES (CRÍTICOS para logs)
activityLogSchema.index({ timestamp: -1 }); // Ordenação (mais importante)
activityLogSchema.index({ level: 1, timestamp: -1 }); // Filtro + ordenação
activityLogSchema.index({ module: 1, timestamp: -1 }); // Filtro + ordenação

// TTL Index: deletar logs após 90 dias automaticamente
activityLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 });

export default mongoose.model('ActivityLog', activityLogSchema);
```

#### 1.3. Rotas do Admin

**Arquivo:** `backend/routes/admin.js` (NOVO)

```javascript
import express from 'express';
import {
  getUsers,
  getStats,
  getCompanies,
  getLogs
} from '../controllers/adminController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Todas as rotas exigem autenticação + role admin
router.use(authenticateToken);
router.use(requireAdmin);

// Endpoints
router.get('/users', getUsers);
router.get('/stats', getStats);
router.get('/companies', getCompanies);
router.get('/logs', getLogs);

export default router;
```

**Arquivo:** `backend/server.js` (adicionar rota)

```javascript
import adminRoutes from './routes/admin.js';

// ... outras rotas
app.use('/api/admin', adminRoutes);
```

---

### FASE 2: Frontend - Hooks Otimizados

#### 2.1. Hook: useAdminData (Cache + React Query)

**Arquivo:** `src/hooks/useAdminData.js` (NOVO)

```javascript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Hook principal para dados do Admin
 * - Cache automático (5 min)
 * - Refetch em background
 * - Invalidação inteligente
 */
export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE}/admin/stats`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos em cache
    refetchOnWindowFocus: true, // Atualizar ao voltar à aba
    refetchInterval: 5 * 60 * 1000 // Auto-refresh a cada 5min
  });
};

/**
 * Hook para lista de usuários paginada
 */
export const useAdminUsers = (filters) => {
  const { page, limit, search, plan, status, sort, order } = filters;

  return useQuery({
    queryKey: ['admin', 'users', filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page || 1,
        limit: limit || 20,
        ...(search && { search }),
        ...(plan && plan !== 'todos' && { plan }),
        ...(status && status !== 'todos' && { status }),
        ...(sort && { sort }),
        ...(order && { order })
      });

      const { data } = await axios.get(
        `${API_BASE}/admin/users?${params}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      return data.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutos (lista muda mais)
    cacheTime: 5 * 60 * 1000,
    keepPreviousData: true // Manter dados anteriores durante transição de página
  });
};

/**
 * Hook para lista de empresas paginada
 */
export const useAdminCompanies = (filters) => {
  const { page, limit, search, plan } = filters;

  return useQuery({
    queryKey: ['admin', 'companies', filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page || 1,
        limit: limit || 20,
        ...(search && { search }),
        ...(plan && plan !== 'todos' && { plan })
      });

      const { data } = await axios.get(
        `${API_BASE}/admin/companies?${params}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      return data.data;
    },
    staleTime: 2 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    keepPreviousData: true
  });
};

/**
 * Mutation: Deletar usuário
 * Invalida cache automaticamente
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId) => {
      const { data } = await axios.delete(
        `${API_BASE}/users/${userId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      return data;
    },
    onSuccess: () => {
      // Invalidar caches relacionados
      queryClient.invalidateQueries(['admin', 'users']);
      queryClient.invalidateQueries(['admin', 'stats']);
    }
  });
};

/**
 * Mutation: Atualizar role de usuário
 */
export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, role }) => {
      const { data } = await axios.patch(
        `${API_BASE}/users/${userId}/role`,
        { role },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin', 'users']);
    }
  });
};

export default {
  useAdminStats,
  useAdminUsers,
  useAdminCompanies,
  useDeleteUser,
  useUpdateUserRole
};
```

#### 2.2. Hook: useDebounce (Busca Otimizada)

**Arquivo:** `src/hooks/useDebounce.js` (NOVO)

```javascript
import { useState, useEffect } from 'react';

/**
 * Hook para debounce de valores
 * Evita chamadas excessivas de API durante digitação
 *
 * @param value - Valor a ser debounced
 * @param delay - Delay em ms (default: 500ms)
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set timer para atualizar valor após delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: cancelar timer se valor mudar antes do delay
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
```

**Uso:**

```javascript
import { useDebounce } from '../hooks/useDebounce';

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Query usa valor debounced
  const { data, isLoading } = useAdminUsers({
    search: debouncedSearch,
    page: 1,
    limit: 20
  });

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Buscar usuário..."
    />
  );
};
```

#### 2.3. Hook: useInfiniteScroll (Logs)

**Arquivo:** `src/hooks/useInfiniteScroll.js` (NOVO)

```javascript
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Hook para infinite scroll de logs
 * Carrega mais dados conforme usuário scrolla
 */
export const useInfiniteActivityLogs = (filters) => {
  const { level, module } = filters;

  return useInfiniteQuery({
    queryKey: ['admin', 'logs', filters],
    queryFn: async ({ pageParam = null }) => {
      const params = new URLSearchParams({
        limit: 50,
        ...(pageParam && { cursor: pageParam }),
        ...(level && level !== 'todos' && { level }),
        ...(module && module !== 'todos' && { module })
      });

      const { data } = await axios.get(
        `${API_BASE}/admin/logs?${params}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      return data.data;
    },
    getNextPageParam: (lastPage) => {
      // Retorna cursor para próxima página, ou undefined se acabou
      return lastPage.pagination.hasMore
        ? lastPage.pagination.nextCursor
        : undefined;
    },
    staleTime: 1 * 60 * 1000, // 1 minuto (logs mudam rápido)
    cacheTime: 3 * 60 * 1000
  });
};

export default useInfiniteActivityLogs;
```

**Uso com Intersection Observer:**

```javascript
import { useInfiniteActivityLogs } from '../hooks/useInfiniteScroll';
import { useEffect, useRef } from 'react';

const ActivityLogs = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteActivityLogs({ level: '', module: '' });

  // Observer para carregar mais ao chegar no final
  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasNextPage, fetchNextPage]);

  return (
    <div>
      {data?.pages.map((page, i) => (
        <div key={i}>
          {page.logs.map((log) => (
            <div key={log.id}>{log.message}</div>
          ))}
        </div>
      ))}

      {/* Elemento observado para trigger de load */}
      <div ref={observerTarget} className="h-10" />

      {isFetchingNextPage && <p>Carregando mais...</p>}
    </div>
  );
};
```

---

### FASE 3: Setup de React Query

#### 3.1. Instalar Dependências

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

#### 3.2. Configurar Provider

**Arquivo:** `src/main.jsx`

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import App from './App';
import './index.css';

// Configuração do QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Retentar 1 vez em caso de erro
      refetchOnWindowFocus: false, // Não refetch automático ao focar janela
      staleTime: 5 * 60 * 1000, // 5 minutos por padrão
      cacheTime: 10 * 60 * 1000, // 10 minutos em cache
    },
    mutations: {
      retry: 0 // Não retentar mutations
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      {/* DevTools apenas em dev */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  </React.StrictMode>
);
```

---

### FASE 4: Refatorar Admin.jsx

#### 4.1. Exemplo de Refatoração (Dashboard Tab)

**Antes:**

```javascript
const AdminNew = ({ onNavigate }) => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Buscar todos os dados
    fetchUsers();
    fetchStats();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    const response = await fetch('/api/users');
    const data = await response.json();
    setUsers(data.users);
    setIsLoading(false);
  };

  // ... resto do código
};
```

**Depois:**

```javascript
import { useAdminStats, useAdminUsers } from '../hooks/useAdminData';
import { useDebounce } from '../hooks/useDebounce';

const AdminNew = ({ onNavigate }) => {
  // Estados locais apenas para UI
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    plan: 'todos',
    status: 'todos',
    page: 1,
    limit: 20
  });

  // Debounce na busca
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Hooks de dados (com cache automático)
  const { data: stats, isLoading: statsLoading } = useAdminStats();

  const {
    data: usersData,
    isLoading: usersLoading,
    isPreviousData // True durante transição de página
  } = useAdminUsers({
    search: debouncedSearch,
    ...filters
  });

  // Mutations
  const deleteUser = useDeleteUser();

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser.mutateAsync(userId);
      // Cache invalidado automaticamente!
    } catch (error) {
      console.error('Erro ao deletar:', error);
    }
  };

  // Renderização
  if (statsLoading) return <Loading />;

  return (
    <div>
      {/* Stats Card */}
      <StatsCard
        totalUsers={stats.users.total}
        activeUsers={stats.users.active}
        revenue={stats.revenue.total}
      />

      {/* Tabela de Usuários */}
      <UsersTable
        users={usersData?.users || []}
        pagination={usersData?.pagination}
        isLoading={usersLoading || isPreviousData}
        onDelete={handleDeleteUser}
        onPageChange={(page) => setFilters({ ...filters, page })}
      />
    </div>
  );
};
```

---

### FASE 5: Analytics Tracking

#### 5.1. Sistema de Eventos

**Arquivo:** `src/services/analyticsService.js` (NOVO)

```javascript
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Serviço de analytics para painel admin
 */
class AnalyticsService {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.events = [];
    this.flushInterval = 30000; // Enviar eventos a cada 30s
    this.startAutoFlush();
  }

  generateSessionId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Rastrear evento de navegação
   */
  trackPageView(pageName) {
    this.track('page_view', {
      page: pageName,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Rastrear ação do admin
   */
  trackAction(action, metadata = {}) {
    this.track('admin_action', {
      action,
      ...metadata,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Rastrear performance
   */
  trackPerformance(metric, value) {
    this.track('performance', {
      metric,
      value,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Rastrear erro
   */
  trackError(error, context = {}) {
    this.track('error', {
      message: error.message,
      stack: error.stack,
      ...context,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Adicionar evento à fila
   */
  track(eventType, payload) {
    this.events.push({
      sessionId: this.sessionId,
      eventType,
      payload
    });

    // Se fila ficar muito grande, flush imediato
    if (this.events.length >= 50) {
      this.flush();
    }
  }

  /**
   * Enviar eventos para backend
   */
  async flush() {
    if (this.events.length === 0) return;

    const eventsToSend = [...this.events];
    this.events = [];

    try {
      await axios.post(
        `${API_BASE}/admin/analytics/events`,
        { events: eventsToSend },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
    } catch (error) {
      console.error('Erro ao enviar analytics:', error);
      // Recolocar eventos na fila em caso de erro
      this.events.unshift(...eventsToSend);
    }
  }

  /**
   * Flush automático periódico
   */
  startAutoFlush() {
    setInterval(() => {
      this.flush();
    }, this.flushInterval);

    // Flush ao fechar aba
    window.addEventListener('beforeunload', () => {
      this.flush();
    });
  }
}

export const analyticsService = new AnalyticsService();

export default analyticsService;
```

#### 5.2. Hook para Analytics

**Arquivo:** `src/hooks/useAnalytics.js` (NOVO)

```javascript
import { useEffect } from 'react';
import { analyticsService } from '../services/analyticsService';

/**
 * Hook para rastrear página
 */
export const usePageTracking = (pageName) => {
  useEffect(() => {
    analyticsService.trackPageView(pageName);
  }, [pageName]);
};

/**
 * Hook para rastrear performance de componente
 */
export const usePerformanceTracking = (componentName) => {
  useEffect(() => {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      if (renderTime > 100) { // Só rastrear se demorar > 100ms
        analyticsService.trackPerformance('component_render', {
          component: componentName,
          duration: renderTime
        });
      }
    };
  }, [componentName]);
};

/**
 * Rastrear ações do admin
 */
export const useAdminAction = () => {
  return (action, metadata) => {
    analyticsService.trackAction(action, metadata);
  };
};

export default {
  usePageTracking,
  usePerformanceTracking,
  useAdminAction
};
```

**Uso:**

```javascript
import { usePageTracking, useAdminAction } from '../hooks/useAnalytics';

const AdminNew = () => {
  // Rastrear página
  usePageTracking('admin_dashboard');

  // Rastrear ações
  const trackAction = useAdminAction();

  const handleDeleteUser = (userId) => {
    deleteUser(userId);
    trackAction('user_deleted', { userId });
  };

  const handleFilterChange = (filter) => {
    setFilter(filter);
    trackAction('filter_applied', { filter });
  };

  // ... resto do código
};
```

---

## 📊 Métricas de Sucesso

### Performance Esperada

| Métrica | Antes | Depois | Melhoria |
|---------|-------|--------|----------|
| **Carregamento inicial** | 3-5s | 0.5-1s | **80%** |
| **Busca de usuários** | 2s | 0.3s | **85%** |
| **Troca de tabs** | 1.5s | Instantâneo (cache) | **100%** |
| **Payload de lista** | 200KB | 20KB (paginado) | **90%** |
| **Re-renders** | 50+ | 5-10 | **80%** |

### Queries Otimizadas

**Antes:**
```
db.users.find() → Full table scan (1000+ docs)
Tempo: 500-1000ms
```

**Depois:**
```
db.users.find({ plan: 'professional' })
  .hint({ plan: 1, createdAt: -1 }) → Index scan
  .skip(20).limit(20)
Tempo: 10-50ms
```

---

## 🚀 Próximos Passos

### Fase 6: Redis Cache (Opcional)

Se backend ficar lento mesmo com índices:

```javascript
// backend/services/cacheService.js
import redis from 'redis';

const client = redis.createClient({
  url: process.env.REDIS_URL
});

export const cacheMiddleware = (ttl = 300) => {
  return async (req, res, next) => {
    const key = `cache:${req.originalUrl}`;

    const cached = await client.get(key);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    // Override res.json para cachear resposta
    const originalJson = res.json.bind(res);
    res.json = (data) => {
      client.setex(key, ttl, JSON.stringify(data));
      return originalJson(data);
    };

    next();
  };
};
```

### Fase 7: Websockets para Updates em Tempo Real

```javascript
// backend/services/socketService.js
import { Server } from 'socket.io';

export const setupWebSocket = (server) => {
  const io = new Server(server);

  io.on('connection', (socket) => {
    console.log('Admin conectado:', socket.id);

    // Enviar updates de stats a cada minuto
    const interval = setInterval(async () => {
      const stats = await getStats();
      socket.emit('stats_update', stats);
    }, 60000);

    socket.on('disconnect', () => {
      clearInterval(interval);
    });
  });
};
```

---

## 📚 Arquivos a Serem Criados/Modificados

### Backend (NOVO)

- `backend/controllers/adminController.js` ✅
- `backend/routes/admin.js` ✅
- `backend/models/ActivityLog.js` ✅
- `backend/middleware/roleMiddleware.js` (adicionar requireAdmin)
- `backend/services/cacheService.js` (opcional)

### Backend (MODIFICAR)

- `backend/models/User.js` (adicionar índices) ✅
- `backend/models/Company.js` (adicionar índices) ✅
- `backend/server.js` (adicionar rota /api/admin) ✅

### Frontend (NOVO)

- `src/hooks/useAdminData.js` ✅
- `src/hooks/useDebounce.js` ✅
- `src/hooks/useInfiniteScroll.js` ✅
- `src/hooks/useAnalytics.js` ✅
- `src/services/analyticsService.js` ✅

### Frontend (MODIFICAR)

- `src/main.jsx` (adicionar QueryClientProvider) ✅
- `src/pages/Admin.jsx` (refatorar para usar hooks)

---

## ✅ Checklist de Implementação

### Backend

- [ ] Criar `adminController.js` com endpoints paginados
- [ ] Criar `ActivityLog` model com índices
- [ ] Adicionar índices em `User` e `Company` models
- [ ] Criar rota `/api/admin`
- [ ] Implementar middleware `requireAdmin`
- [ ] Testar endpoints com Postman/Insomnia
- [ ] Validar performance de queries (usar `explain()`)

### Frontend

- [ ] Instalar `@tanstack/react-query`
- [ ] Configurar `QueryClient` no `main.jsx`
- [ ] Criar hook `useAdminData`
- [ ] Criar hook `useDebounce`
- [ ] Criar hook `useInfiniteScroll`
- [ ] Criar hook `useAnalytics`
- [ ] Criar `analyticsService`
- [ ] Refatorar `Admin.jsx` (tab por tab)
- [ ] Testar cache com React Query DevTools
- [ ] Validar performance com Profiler

### Testes

- [ ] Teste de carga: 1000+ usuários no banco
- [ ] Teste de busca: digitação rápida (debounce)
- [ ] Teste de paginação: navegar 10+ páginas
- [ ] Teste de infinite scroll: carregar 500+ logs
- [ ] Teste de cache: invalidação após CRUD
- [ ] Teste de analytics: eventos sendo enviados

---

## 🎓 Lições e Recomendações

### Boas Práticas

1. **Sempre paginar listas grandes** (>50 items)
2. **Usar índices compostos** para filtros combinados
3. **Debounce em buscas** (mínimo 300ms)
4. **Cache com TTL inteligente** (stats: 5min, listas: 2min)
5. **Cursor-based pagination** para infinite scroll
6. **React Query para estado do servidor**
7. **Analytics em background** (não bloquear UI)

### Armadilhas a Evitar

❌ **Não fazer:**
- Queries sem índices
- Busca sem debounce
- Carregar todos os dados de uma vez
- Cache sem invalidação
- Logs sem TTL (crescimento infinito)

✅ **Fazer:**
- Índices para TODOS os filtros
- Debounce + cancel de requests anteriores
- Paginação server-side
- Cache com invalidação inteligente
- TTL Index para logs (90 dias)

---

## 📞 Suporte e Referências

### Documentação

- [React Query Docs](https://tanstack.com/query/latest/docs/react/overview)
- [MongoDB Indexes](https://www.mongodb.com/docs/manual/indexes/)
- [Redis Caching Strategies](https://redis.io/docs/manual/patterns/caching/)

### Ferramentas de Debug

- React Query DevTools (já configurado)
- MongoDB Compass (visualizar índices)
- Chrome DevTools → Performance tab
- React DevTools → Profiler

---

**Documentado por:** @data-engineer (Claude Sonnet 4.5)
**Data:** 2026-02-25
**Versão:** 1.0
**Status:** Especificação completa, pronta para implementação

---

## 📌 Resumo Executivo

Este documento especifica uma **refatoração completa do Admin Panel** com foco em:

1. **Paginação server-side** - Reduzir payloads de 200KB para 20KB
2. **Índices MongoDB** - Queries 10-100x mais rápidas
3. **React Query + Cache** - Eliminar requisições redundantes
4. **Debounce** - Reduzir chamadas de API em 90%
5. **Infinite Scroll** - UX fluida para logs
6. **Analytics** - Rastrear uso e performance

**Resultado esperado:** Admin Panel **80-90% mais rápido**, escalável para 10.000+ usuários.
