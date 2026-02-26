# Admin Panel Optimization - Priority Implementation Guide

**Data:** 2026-02-25
**Estratégia:** Implementação incremental por prioridade de impacto
**Tempo total estimado:** 3-4 dias

---

## 🎯 Priorização por Impacto

### Matriz de Impacto vs Esforço

```
Alto Impacto, Baixo Esforço (FAZER PRIMEIRO) ⭐⭐⭐
├── P1: Debounce na busca (30min)
├── P2: Índices MongoDB (1h)
└── P3: Paginação básica backend (2h)

Alto Impacto, Médio Esforço (FAZER EM SEGUIDA) ⭐⭐
├── P4: React Query setup (1h)
├── P5: Hook useAdminData (2h)
├── P6: Refatorar tab Dashboard (3h)
└── P7: Refatorar tab Usuários (3h)

Médio Impacto, Alto Esforço (FAZER DEPOIS) ⭐
├── P8: Infinite scroll logs (4h)
├── P9: Analytics tracking (3h)
└── P10: Redis cache (6h)

Baixo Impacto, Alto Esforço (NICE TO HAVE) 💡
├── Websockets real-time
└── Dashboard em tempo real
```

---

## 📅 Plano de Implementação (3 Sprints)

### SPRINT 1 (Dia 1) - Quick Wins de Performance

**Objetivo:** Resolver 70% dos problemas de performance com 20% do esforço

**Duração:** 4-6 horas

#### Task 1.1: Debounce na Busca (30min) ⚡

**Problema:** Busca chama API a cada tecla digitada
**Solução:** Hook useDebounce

**Arquivos:**
- `src/hooks/useDebounce.js` (CRIAR)
- `src/pages/Admin.jsx` (MODIFICAR)

**Código:**

```javascript
// src/hooks/useDebounce.js
import { useState, useEffect } from 'react';

export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};
```

```javascript
// src/pages/Admin.jsx
import { useDebounce } from '../hooks/useDebounce';

const AdminNew = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Usar debouncedSearch nas queries em vez de searchTerm
  useEffect(() => {
    if (debouncedSearch) {
      fetchUsers(debouncedSearch);
    }
  }, [debouncedSearch]);
};
```

**Impacto:**
- ✅ Reduz chamadas de API em 90%
- ✅ Melhora experiência de busca
- ✅ Reduz carga no servidor

---

#### Task 1.2: Índices MongoDB (1h) 🗄️

**Problema:** Queries lentas (500-1000ms)
**Solução:** Índices compostos otimizados

**Arquivos:**
- `backend/models/User.js` (MODIFICAR)
- `backend/models/Company.js` (MODIFICAR)
- `backend/models/ActivityLog.js` (CRIAR)

**Código:**

```javascript
// backend/models/User.js
userSchema.index({ email: 1 }); // Já existe
userSchema.index({ plan: 1, status: 1 }); // ADICIONAR
userSchema.index({ createdAt: -1 }); // ADICIONAR
userSchema.index({ name: 'text', email: 'text' }); // ADICIONAR

// backend/models/Company.js
companySchema.index({ name: 'text', email: 'text' });
companySchema.index({ owner: 1 });
companySchema.index({ plan: 1 });
companySchema.index({ createdAt: -1 });

// backend/models/ActivityLog.js (NOVO)
const activityLogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now, required: true },
  level: { type: String, enum: ['INFO', 'WARNING', 'ERROR'], required: true },
  module: { type: String, required: true },
  message: { type: String, required: true },
  ip: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  metadata: { type: mongoose.Schema.Types.Mixed }
});

// Índices críticos
activityLogSchema.index({ timestamp: -1 });
activityLogSchema.index({ level: 1, timestamp: -1 });
activityLogSchema.index({ module: 1, timestamp: -1 });

// TTL: deletar logs após 90 dias
activityLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 });

export default mongoose.model('ActivityLog', activityLogSchema);
```

**Como verificar índices criados:**

```bash
# MongoDB Shell ou Compass
db.users.getIndexes()
db.companies.getIndexes()
db.activitylogs.getIndexes()
```

**Impacto:**
- ✅ Queries 10-100x mais rápidas
- ✅ Suporta 10.000+ registros sem degradação
- ✅ Logs com TTL automático (economia de espaço)

---

#### Task 1.3: Paginação Backend Básica (2h) 📄

**Problema:** Retorna TODOS os usuários de uma vez
**Solução:** Endpoint paginado `/api/admin/users`

**Arquivos:**
- `backend/controllers/adminController.js` (CRIAR)
- `backend/routes/admin.js` (CRIAR)
- `backend/middleware/roleMiddleware.js` (CRIAR)
- `backend/server.js` (MODIFICAR)

**Código:**

```javascript
// backend/controllers/adminController.js
export const getUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      plan = '',
      status = ''
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = Math.min(parseInt(limit), 100);
    const skip = (pageNum - 1) * limitNum;

    // Query
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (plan && plan !== 'todos') query.plan = plan;
    if (status && status !== 'todos') query.status = status;

    // Buscar dados + total em paralelo
    const [users, total] = await Promise.all([
      UserModel.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      UserModel.countDocuments(query)
    ]);

    return res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum)
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
```

```javascript
// backend/routes/admin.js
import express from 'express';
import { getUsers } from '../controllers/adminController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(authenticateToken);
router.use(requireAdmin);

router.get('/users', getUsers);

export default router;
```

```javascript
// backend/middleware/roleMiddleware.js
export const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Acesso negado. Apenas administradores.'
    });
  }
  next();
};
```

```javascript
// backend/server.js
import adminRoutes from './routes/admin.js';

// ... outras rotas
app.use('/api/admin', adminRoutes);
```

**Testar com cURL:**

```bash
# Página 1
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:5000/api/admin/users?page=1&limit=20"

# Busca + filtro
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:5000/api/admin/users?search=João&plan=professional"
```

**Impacto:**
- ✅ Payload reduz de 200KB para 20KB (90%)
- ✅ Tempo de resposta de 2s para 0.3s (85%)
- ✅ Escalável para 100.000+ usuários

---

### SPRINT 2 (Dia 2) - React Query + Cache

**Objetivo:** Eliminar requisições redundantes e melhorar UX

**Duração:** 6-8 horas

#### Task 2.1: Setup React Query (1h) ⚙️

**Arquivos:**
- `package.json` (MODIFICAR)
- `src/main.jsx` (MODIFICAR)

**Instalação:**

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

**Configuração:**

```javascript
// src/main.jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 min
      cacheTime: 10 * 60 * 1000 // 10 min
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <App />
    {import.meta.env.DEV && <ReactQueryDevtools />}
  </QueryClientProvider>
);
```

---

#### Task 2.2: Hook useAdminData (2h) 🎣

**Arquivos:**
- `src/hooks/useAdminData.js` (CRIAR)

**Código completo no documento principal:** `ADMIN-DATA-ENGINEERING.md`

**Hooks principais:**
- `useAdminStats()` - Estatísticas gerais (cache 5min)
- `useAdminUsers(filters)` - Lista de usuários paginada
- `useAdminCompanies(filters)` - Lista de empresas
- `useDeleteUser()` - Mutation com invalidação de cache
- `useUpdateUserRole()` - Mutation para atualizar role

**Exemplo de uso:**

```javascript
const AdminDashboard = () => {
  const { data: stats, isLoading } = useAdminStats();

  if (isLoading) return <Loading />;

  return (
    <div>
      <StatCard title="Total Usuários" value={stats.users.total} />
      <StatCard title="Receita" value={stats.revenue.total} />
    </div>
  );
};
```

---

#### Task 2.3: Refatorar Tab Dashboard (3h) 🏠

**Arquivo:**
- `src/pages/Admin.jsx` (MODIFICAR)

**Antes:**

```javascript
// 50 linhas de código mockado + useEffect
const [stats, setStats] = useState({});

useEffect(() => {
  // Buscar stats
}, []);
```

**Depois:**

```javascript
// 5 linhas, cache automático
const { data: stats, isLoading } = useAdminStats();
```

**Componentes a extrair:**
- `StatsCard` - Cards de métricas
- `RecentUsersTable` - Tabela de usuários recentes
- `PlansChart` - Gráfico de distribuição de planos

---

#### Task 2.4: Refatorar Tab Usuários (3h) 👥

**Arquivo:**
- `src/pages/Admin.jsx` (MODIFICAR)

**Adicionar:**
- Paginação funcional (botões prev/next)
- Controle de itens por página (10, 20, 50)
- Loading state durante transição
- Busca com debounce (já implementado)
- Filtros com query params

**Código:**

```javascript
const AdminUsersTab = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    search: '',
    plan: 'todos',
    status: 'todos'
  });

  const debouncedSearch = useDebounce(filters.search, 500);

  const {
    data,
    isLoading,
    isPreviousData
  } = useAdminUsers({
    ...filters,
    search: debouncedSearch
  });

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
  };

  return (
    <div>
      <SearchBar
        value={filters.search}
        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
      />

      <UsersTable
        users={data?.users || []}
        isLoading={isLoading || isPreviousData}
      />

      <Pagination
        currentPage={filters.page}
        totalPages={data?.pagination.totalPages || 1}
        onPageChange={handlePageChange}
      />
    </div>
  );
};
```

---

### SPRINT 3 (Dia 3) - Advanced Features

**Objetivo:** Infinite scroll, analytics e polimentos

**Duração:** 6-8 horas

#### Task 3.1: Infinite Scroll para Logs (4h) ♾️

**Arquivos:**
- `backend/controllers/adminController.js` (ADICIONAR getLogs)
- `src/hooks/useInfiniteScroll.js` (CRIAR)
- `src/pages/ActivityLogs.jsx` (MODIFICAR)

**Backend - Cursor-based Pagination:**

```javascript
export const getLogs = async (req, res) => {
  const { cursor = null, limit = 50, level = '', module = '' } = req.query;

  const query = {};

  if (cursor) {
    query.timestamp = { $lt: new Date(cursor) };
  }

  if (level && level !== 'todos') query.level = level;
  if (module && module !== 'todos') query.module = module;

  const logs = await ActivityLogModel.find(query)
    .sort({ timestamp: -1 })
    .limit(parseInt(limit) + 1)
    .lean();

  const hasMore = logs.length > parseInt(limit);
  const data = hasMore ? logs.slice(0, parseInt(limit)) : logs;
  const nextCursor = hasMore ? data[data.length - 1].timestamp : null;

  return res.json({
    success: true,
    data: {
      logs: data,
      pagination: { nextCursor, hasMore }
    }
  });
};
```

**Frontend - Intersection Observer:**

```javascript
import { useInfiniteQuery } from '@tanstack/react-query';

const ActivityLogs = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['admin', 'logs'],
    queryFn: ({ pageParam = null }) => fetchLogs(pageParam),
    getNextPageParam: (lastPage) => lastPage.pagination.nextCursor
  });

  // Auto-load ao chegar no final
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

    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  return (
    <div>
      {data?.pages.map((page) =>
        page.logs.map((log) => <LogItem key={log._id} log={log} />)
      )}

      <div ref={observerTarget} className="h-10" />

      {isFetchingNextPage && <p>Carregando mais...</p>}
    </div>
  );
};
```

---

#### Task 3.2: Analytics Tracking (3h) 📊

**Arquivos:**
- `src/services/analyticsService.js` (CRIAR)
- `src/hooks/useAnalytics.js` (CRIAR)
- `backend/controllers/adminController.js` (ADICIONAR endpoint)

**Eventos a rastrear:**
- Page views (tab navigation)
- Actions (delete user, update role, etc)
- Performance (component render time)
- Errors (API failures)

**Frontend - Service:**

```javascript
// src/services/analyticsService.js
class AnalyticsService {
  constructor() {
    this.events = [];
    this.startAutoFlush();
  }

  track(eventType, payload) {
    this.events.push({
      eventType,
      payload,
      timestamp: new Date().toISOString()
    });

    if (this.events.length >= 50) this.flush();
  }

  async flush() {
    if (this.events.length === 0) return;

    const events = [...this.events];
    this.events = [];

    await axios.post('/api/admin/analytics/events', { events });
  }

  startAutoFlush() {
    setInterval(() => this.flush(), 30000); // 30s
  }
}

export const analyticsService = new AnalyticsService();
```

**Frontend - Hook:**

```javascript
// src/hooks/useAnalytics.js
export const usePageTracking = (pageName) => {
  useEffect(() => {
    analyticsService.track('page_view', { page: pageName });
  }, [pageName]);
};

export const useAdminAction = () => {
  return (action, metadata) => {
    analyticsService.track('admin_action', { action, ...metadata });
  };
};
```

**Uso:**

```javascript
const AdminNew = () => {
  usePageTracking('admin_dashboard');
  const trackAction = useAdminAction();

  const handleDeleteUser = (userId) => {
    deleteUser(userId);
    trackAction('user_deleted', { userId });
  };
};
```

---

## 🎯 Métricas de Sucesso por Sprint

### Sprint 1 - Quick Wins

**Antes:**
- Busca: 20+ requisições por digitação
- Query usuarios: 500-1000ms
- Payload: 200KB

**Depois:**
- Busca: 1-2 requisições (debounce)
- Query usuarios: 10-50ms (índices)
- Payload: 20KB (paginação)

**Ganho:** 80-90% de melhoria

---

### Sprint 2 - React Query

**Antes:**
- Cada mudança de tab: 3-5s (3 requisições)
- Re-renders: 50+ por navegação
- Cache: 0

**Depois:**
- Mudança de tab: Instantâneo (cache)
- Re-renders: 5-10
- Cache: 5-10 min TTL

**Ganho:** 100% em navegação (cache hit)

---

### Sprint 3 - Advanced

**Antes:**
- Logs: Paginação simples (lenta com muitos registros)
- Analytics: 0
- Insights: 0

**Depois:**
- Logs: Infinite scroll (carrega 50 de cada vez)
- Analytics: Todos eventos rastreados
- Insights: Dashboard de métricas

**Ganho:** UX melhorada + visibilidade

---

## 🔍 Como Validar Cada Sprint

### Sprint 1 - Testes

```bash
# 1. Testar debounce
# - Digitar rápido no campo de busca
# - Abrir Network tab do DevTools
# - Verificar que só faz 1 request após parar de digitar

# 2. Testar índices
# MongoDB Compass ou Shell:
db.users.find({ plan: 'professional' }).explain('executionStats')
# Verificar que usa index (não COLLSCAN)

# 3. Testar paginação
curl "http://localhost:5000/api/admin/users?page=1&limit=20"
# Response deve ter pagination object
```

### Sprint 2 - Testes

```bash
# 1. Abrir React Query DevTools (bottom-left)
# - Ver queries ativas
# - Ver cache hits/misses
# - Ver stale/fresh status

# 2. Navegar entre tabs
# - Primeira vez: deve mostrar "fetching"
# - Segunda vez: deve ser instantâneo (cache)

# 3. Deletar usuário
# - Observar invalidação de cache no DevTools
# - Lista deve atualizar automaticamente
```

### Sprint 3 - Testes

```bash
# 1. Infinite scroll
# - Abrir página de logs
# - Scrollar até o final
# - Deve carregar mais automaticamente

# 2. Analytics
# - Abrir console do backend
# - Ver logs de eventos sendo enviados
# - POST /api/admin/analytics/events a cada 30s
```

---

## 🚨 Troubleshooting

### Problema: Índices não criados

**Sintoma:** Queries ainda lentas após adicionar índices

**Solução:**
```bash
# Forçar criação de índices
node backend/scripts/createIndexes.js

# Ou via MongoDB Shell
use plataforma_db
db.users.createIndex({ plan: 1, status: 1 })
db.users.getIndexes()
```

---

### Problema: React Query não atualiza após mutation

**Sintoma:** Deletar usuário mas lista não atualiza

**Solução:**
```javascript
// Garantir invalidação no mutation
const deleteUser = useMutation({
  mutationFn: deleteUserApi,
  onSuccess: () => {
    queryClient.invalidateQueries(['admin', 'users']); // ✅
  }
});
```

---

### Problema: Cache muito agressivo

**Sintoma:** Dados "travados", não atualizam mesmo após tempo

**Solução:**
```javascript
// Forçar refetch manual
const { data, refetch } = useAdminUsers();

<button onClick={() => refetch()}>Atualizar</button>

// Ou reduzir staleTime
useQuery({
  queryKey: ['admin', 'users'],
  staleTime: 1 * 60 * 1000 // 1 min em vez de 5
});
```

---

## 📋 Checklist Final

### Sprint 1
- [ ] useDebounce implementado
- [ ] Índices criados no MongoDB
- [ ] Endpoint paginado funcionando
- [ ] Testes de performance passando

### Sprint 2
- [ ] React Query instalado e configurado
- [ ] DevTools habilitado
- [ ] useAdminData criado
- [ ] Tab Dashboard refatorado
- [ ] Tab Usuários refatorado
- [ ] Cache funcionando corretamente

### Sprint 3
- [ ] Infinite scroll implementado
- [ ] Analytics service criado
- [ ] Eventos sendo rastreados
- [ ] Backend recebendo eventos

---

## 🎓 Conclusão

Seguindo este guia, você terá:

✅ **Admin Panel 80-90% mais rápido**
✅ **Escalável para 10.000+ usuários**
✅ **Cache inteligente**
✅ **UX melhorada**
✅ **Observabilidade (analytics)**

**Tempo total:** 3-4 dias
**ROI:** Alto (problemas de performance eliminados)

---

**Autor:** @data-engineer (Claude Sonnet 4.5)
**Data:** 2026-02-25
**Versão:** 1.0
