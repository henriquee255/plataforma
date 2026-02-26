# Admin Panel Optimization - Implementation Checklist

**Data de Início:** ___/___/2026
**Data de Conclusão:** ___/___/2026
**Responsável:** _______________

---

## 📋 Como Usar Este Checklist

1. Marque [x] conforme completa cada tarefa
2. Anote o tempo real gasto em cada task
3. Faça commit após cada task concluída
4. Valide cada task antes de marcar como completo

---

## SPRINT 1: Quick Wins (80% de melhoria, 20% do esforço)

**Objetivo:** Resolver gargalos críticos de performance
**Tempo Estimado:** 4-6 horas
**Tempo Real:** _____ horas

### Task 1.1: Debounce na Busca (30min) ⚡

- [ ] **Criar hook useDebounce**
  - [ ] Criar arquivo `src/hooks/useDebounce.js`
  - [ ] Copiar código do guia de implementação
  - [ ] Adicionar testes (opcional)
  - Tempo: _____ min

- [ ] **Implementar no Admin.jsx**
  - [ ] Importar useDebounce
  - [ ] Substituir searchTerm por debouncedSearch
  - [ ] Testar digitação rápida
  - Tempo: _____ min

- [ ] **Validar Implementação**
  - [ ] Abrir Network tab do DevTools
  - [ ] Digitar "joão" rapidamente
  - [ ] Verificar que só faz 1 request após parar
  - [ ] ✅ PASS / ❌ FAIL

**Commit:** `feat: add search debounce (Sprint 1.1)`

**Resultado Esperado:**
- ✅ Redução de 90% nas chamadas de API durante busca
- ✅ UX mais fluida

---

### Task 1.2: Índices MongoDB (1h) 🗄️

- [ ] **Adicionar índices no User model**
  - [ ] Editar `backend/models/User.js`
  - [ ] Adicionar `userSchema.index({ plan: 1, status: 1 })`
  - [ ] Adicionar `userSchema.index({ createdAt: -1 })`
  - [ ] Adicionar `userSchema.index({ name: 'text', email: 'text' })`
  - Tempo: _____ min

- [ ] **Adicionar índices no Company model**
  - [ ] Editar `backend/models/Company.js`
  - [ ] Adicionar `companySchema.index({ name: 'text', email: 'text' })`
  - [ ] Adicionar `companySchema.index({ owner: 1 })`
  - [ ] Adicionar `companySchema.index({ plan: 1 })`
  - [ ] Adicionar `companySchema.index({ createdAt: -1 })`
  - Tempo: _____ min

- [ ] **Criar ActivityLog model com índices**
  - [ ] Criar arquivo `backend/models/ActivityLog.js`
  - [ ] Copiar schema do guia
  - [ ] Adicionar índices:
    - [ ] `{ timestamp: -1 }`
    - [ ] `{ level: 1, timestamp: -1 }`
    - [ ] `{ module: 1, timestamp: -1 }`
  - [ ] Adicionar TTL index (90 dias)
  - Tempo: _____ min

- [ ] **Forçar criação de índices**
  - [ ] Reiniciar backend
  - [ ] Verificar logs de criação de índices
  - Tempo: _____ min

- [ ] **Validar Índices**
  - [ ] Abrir MongoDB Compass
  - [ ] Verificar `users.getIndexes()` (4 índices)
  - [ ] Verificar `companies.getIndexes()` (4 índices)
  - [ ] Verificar `activitylogs.getIndexes()` (4 índices)
  - [ ] ✅ PASS / ❌ FAIL

- [ ] **Testar Performance**
  ```bash
  # MongoDB Shell ou Compass
  db.users.find({ plan: 'professional' }).explain('executionStats')
  ```
  - [ ] Verificar: `executionStages.stage === "IXSCAN"`
  - [ ] Anotar tempo: executionTimeMillis = _____ ms
  - [ ] ✅ Tempo < 50ms (PASS) / ❌ > 50ms (FAIL)

**Commit:** `feat: add MongoDB indexes for performance (Sprint 1.2)`

**Resultado Esperado:**
- ✅ Queries 10-100x mais rápidas (500ms → 10-50ms)
- ✅ Uso de IXSCAN em vez de COLLSCAN

---

### Task 1.3: Paginação Backend (2h) 📄

- [ ] **Criar Admin Controller**
  - [ ] Criar arquivo `backend/controllers/adminController.js`
  - [ ] Implementar `getUsers()` com paginação
  - [ ] Implementar `getStats()` (preparar para cache)
  - [ ] Implementar `getCompanies()` com paginação
  - [ ] Implementar `getLogs()` (cursor-based)
  - Tempo: _____ min

- [ ] **Criar Middleware de Role**
  - [ ] Criar arquivo `backend/middleware/roleMiddleware.js`
  - [ ] Implementar `requireAdmin()`
  - Tempo: _____ min

- [ ] **Criar Rota Admin**
  - [ ] Criar arquivo `backend/routes/admin.js`
  - [ ] Adicionar rotas:
    - [ ] `GET /api/admin/users`
    - [ ] `GET /api/admin/stats`
    - [ ] `GET /api/admin/companies`
    - [ ] `GET /api/admin/logs`
  - [ ] Aplicar middleware `authenticateToken`
  - [ ] Aplicar middleware `requireAdmin`
  - Tempo: _____ min

- [ ] **Registrar Rota no Server**
  - [ ] Editar `backend/server.js`
  - [ ] Adicionar `app.use('/api/admin', adminRoutes)`
  - Tempo: _____ min

- [ ] **Testar Endpoints**
  ```bash
  # Usuários (paginado)
  curl -H "Authorization: Bearer TOKEN" \
    "http://localhost:5000/api/admin/users?page=1&limit=20"

  # Com busca
  curl -H "Authorization: Bearer TOKEN" \
    "http://localhost:5000/api/admin/users?search=joão&plan=professional"

  # Stats
  curl -H "Authorization: Bearer TOKEN" \
    "http://localhost:5000/api/admin/stats"
  ```
  - [ ] Endpoint `/users` responde com paginação ✅ / ❌
  - [ ] Endpoint `/stats` responde com dados agregados ✅ / ❌
  - [ ] Payload < 30KB ✅ / ❌
  - [ ] Tempo de resposta < 200ms ✅ / ❌

**Commit:** `feat: add paginated admin endpoints (Sprint 1.3)`

**Resultado Esperado:**
- ✅ Payload reduz de 200KB para 20KB (90%)
- ✅ Tempo de resposta de 2s para 0.3s (85%)

---

## ✅ Checkpoint Sprint 1

- [ ] **Todas as tasks do Sprint 1 concluídas**
- [ ] **Testes passando**
- [ ] **3 commits feitos**
- [ ] **Documentação atualizada (se necessário)**

**Métricas Sprint 1:**
- Tempo total gasto: _____ horas
- Busca: _____ requests → _____ requests (meta: 1-2)
- Query users: _____ ms → _____ ms (meta: <50ms)
- Payload: _____ KB → _____ KB (meta: <30KB)

---

## SPRINT 2: React Query + Cache

**Objetivo:** Eliminar requisições redundantes
**Tempo Estimado:** 6-8 horas
**Tempo Real:** _____ horas

### Task 2.1: Setup React Query (1h) ⚙️

- [ ] **Instalar Dependências**
  ```bash
  npm install @tanstack/react-query @tanstack/react-query-devtools
  ```
  - [ ] Verificar versão instalada: ___________
  - Tempo: _____ min

- [ ] **Configurar QueryClient**
  - [ ] Editar `src/main.jsx`
  - [ ] Importar QueryClient e QueryClientProvider
  - [ ] Criar queryClient com configurações:
    - [ ] staleTime: 5min
    - [ ] cacheTime: 10min
    - [ ] retry: 1
  - [ ] Envolver App em QueryClientProvider
  - Tempo: _____ min

- [ ] **Adicionar DevTools**
  - [ ] Importar ReactQueryDevtools
  - [ ] Adicionar `<ReactQueryDevtools />` (apenas dev)
  - Tempo: _____ min

- [ ] **Validar Setup**
  - [ ] Executar `npm run dev`
  - [ ] Verificar que app inicia sem erros
  - [ ] Abrir DevTools (ícone no canto inferior esquerdo)
  - [ ] ✅ DevTools aparece / ❌ Erro

**Commit:** `feat: setup React Query (Sprint 2.1)`

**Resultado Esperado:**
- ✅ React Query instalado e configurado
- ✅ DevTools funcionando

---

### Task 2.2: Hook useAdminData (2h) 🎣

- [ ] **Criar useAdminData hook**
  - [ ] Criar arquivo `src/hooks/useAdminData.js`
  - [ ] Implementar `useAdminStats()`
  - [ ] Implementar `useAdminUsers(filters)`
  - [ ] Implementar `useAdminCompanies(filters)`
  - [ ] Implementar `useDeleteUser()` mutation
  - [ ] Implementar `useUpdateUserRole()` mutation
  - Tempo: _____ min

- [ ] **Configurar API base**
  - [ ] Adicionar `VITE_API_URL` no `.env`
  - [ ] Usar `import.meta.env.VITE_API_URL`
  - Tempo: _____ min

- [ ] **Testar hook isolado**
  ```javascript
  // Componente de teste
  const Test = () => {
    const { data, isLoading } = useAdminStats();
    console.log(data);
    return <div>{JSON.stringify(data)}</div>;
  };
  ```
  - [ ] Hook retorna dados corretamente ✅ / ❌
  - [ ] Cache funciona (segunda chamada é instantânea) ✅ / ❌
  - Tempo: _____ min

**Commit:** `feat: add useAdminData hook (Sprint 2.2)`

**Resultado Esperado:**
- ✅ Hook reutilizável criado
- ✅ Cache automático funcionando

---

### Task 2.3: Refatorar Tab Dashboard (3h) 🏠

- [ ] **Extrair componentes**
  - [ ] Criar `StatsCard` component
  - [ ] Criar `RecentUsersTable` component
  - [ ] Criar `PlansChart` component
  - Tempo: _____ min

- [ ] **Refatorar Admin.jsx (Dashboard Tab)**
  - [ ] Substituir dados mockados por `useAdminStats()`
  - [ ] Remover useEffect de fetching
  - [ ] Usar componentes extraídos
  - [ ] Adicionar loading states
  - [ ] Adicionar error handling
  - Tempo: _____ min

- [ ] **Testar Dashboard Tab**
  - [ ] Primeira visita: dados carregam
  - [ ] Navegar para outra tab e voltar: instantâneo (cache)
  - [ ] Abrir React Query DevTools:
    - [ ] Ver query `['admin', 'stats']`
    - [ ] Ver status: fresh/stale
    - [ ] Ver cache hit após navegar
  - [ ] ✅ Tudo funciona / ❌ Problemas

**Commit:** `refactor: migrate Dashboard tab to React Query (Sprint 2.3)`

**Resultado Esperado:**
- ✅ Dashboard usa React Query
- ✅ Navegação instantânea (cache)

---

### Task 2.4: Refatorar Tab Usuários (3h) 👥

- [ ] **Adicionar controles de paginação**
  - [ ] Criar state de filtros (page, limit, search, plan, status)
  - [ ] Criar componente `Pagination` (prev/next)
  - [ ] Criar selector de itens por página (10, 20, 50)
  - Tempo: _____ min

- [ ] **Refatorar Admin.jsx (Usuários Tab)**
  - [ ] Substituir dados mockados por `useAdminUsers(filters)`
  - [ ] Usar debounce na busca (Task 1.1)
  - [ ] Implementar paginação funcional
  - [ ] Adicionar `isPreviousData` para loading entre páginas
  - [ ] Adicionar loading states
  - Tempo: _____ min

- [ ] **Implementar mutations**
  - [ ] Usar `useDeleteUser()` no botão deletar
  - [ ] Usar `useUpdateUserRole()` no selector de role
  - [ ] Verificar invalidação de cache após mutation
  - Tempo: _____ min

- [ ] **Testar Tab Usuários**
  - [ ] Paginação funciona (prev/next)
  - [ ] Busca funciona (debounce + cache)
  - [ ] Filtros funcionam
  - [ ] Deletar usuário:
    - [ ] Mutation executa
    - [ ] Cache invalida
    - [ ] Lista atualiza automaticamente
  - [ ] Abrir DevTools:
    - [ ] Ver query `['admin', 'users', {...}]`
    - [ ] Ver invalidação após delete
  - [ ] ✅ Tudo funciona / ❌ Problemas

**Commit:** `refactor: migrate Users tab to React Query (Sprint 2.4)`

**Resultado Esperado:**
- ✅ Tab Usuários completamente refatorado
- ✅ Paginação + busca + filtros funcionais
- ✅ Mutations com invalidação de cache

---

### Task 2.5: Refatorar Tab Empresas (2h) 🏢

- [ ] **Seguir mesmo padrão do Tab Usuários**
  - [ ] Usar `useAdminCompanies(filters)`
  - [ ] Adicionar paginação
  - [ ] Adicionar busca (debounce)
  - [ ] Adicionar filtros
  - Tempo: _____ min

- [ ] **Testar Tab Empresas**
  - [ ] Funciona igual ao Tab Usuários
  - [ ] Cache funcionando
  - [ ] ✅ PASS / ❌ FAIL

**Commit:** `refactor: migrate Companies tab to React Query (Sprint 2.5)`

---

## ✅ Checkpoint Sprint 2

- [ ] **Todas as tasks do Sprint 2 concluídas**
- [ ] **React Query DevTools mostrando cache hits**
- [ ] **5 commits feitos**

**Métricas Sprint 2:**
- Tempo total gasto: _____ horas
- Cache hit rate: _____ % (meta: >70%)
- Navegação entre tabs: _____ ms (meta: <50ms)
- Re-renders: _____ (meta: <10)

---

## SPRINT 3: Advanced Features

**Objetivo:** Infinite scroll e analytics
**Tempo Estimado:** 6-8 horas
**Tempo Real:** _____ horas

### Task 3.1: Infinite Scroll de Logs (4h) ♾️

- [ ] **Backend: Endpoint de logs**
  - [ ] Adicionar `getLogs()` no adminController (já feito em 1.3)
  - [ ] Testar cursor-based pagination:
    ```bash
    curl "http://localhost:5000/api/admin/logs?limit=50"
    curl "http://localhost:5000/api/admin/logs?limit=50&cursor=2026-02-25T14:30:00Z"
    ```
  - [ ] ✅ Endpoint funciona / ❌ Erro
  - Tempo: _____ min

- [ ] **Frontend: Hook useInfiniteScroll**
  - [ ] Criar arquivo `src/hooks/useInfiniteScroll.js`
  - [ ] Implementar `useInfiniteActivityLogs(filters)`
  - [ ] Configurar `getNextPageParam`
  - Tempo: _____ min

- [ ] **Frontend: Componente ActivityLogs**
  - [ ] Editar `src/pages/ActivityLogs.jsx`
  - [ ] Usar `useInfiniteActivityLogs()`
  - [ ] Implementar Intersection Observer
  - [ ] Mapear `data.pages` para renderizar logs
  - [ ] Adicionar loading indicator no final
  - Tempo: _____ min

- [ ] **Testar Infinite Scroll**
  - [ ] Abrir página de logs
  - [ ] Scrollar até o final
  - [ ] Verificar que carrega mais automaticamente
  - [ ] Scrollar múltiplas vezes (10+ páginas)
  - [ ] Verificar que não trava
  - [ ] Abrir DevTools:
    - [ ] Ver query `['admin', 'logs']`
    - [ ] Ver múltiplas páginas no cache
  - [ ] ✅ Funciona perfeitamente / ❌ Problemas

**Commit:** `feat: add infinite scroll for activity logs (Sprint 3.1)`

**Resultado Esperado:**
- ✅ Carrega 50 logs de cada vez
- ✅ UX fluida (carregamento invisível)
- ✅ Performance constante (não degrada)

---

### Task 3.2: Analytics Tracking (3h) 📊

- [ ] **Frontend: Analytics Service**
  - [ ] Criar arquivo `src/services/analyticsService.js`
  - [ ] Implementar `AnalyticsService` class
  - [ ] Métodos:
    - [ ] `trackPageView(pageName)`
    - [ ] `trackAction(action, metadata)`
    - [ ] `trackPerformance(metric, value)`
    - [ ] `trackError(error, context)`
  - [ ] Auto-flush a cada 30s
  - Tempo: _____ min

- [ ] **Frontend: Hook useAnalytics**
  - [ ] Criar arquivo `src/hooks/useAnalytics.js`
  - [ ] Implementar `usePageTracking(pageName)`
  - [ ] Implementar `useAdminAction()`
  - Tempo: _____ min

- [ ] **Integrar no Admin.jsx**
  - [ ] Adicionar `usePageTracking('admin_dashboard')` em cada tab
  - [ ] Rastrear ações:
    - [ ] user_deleted
    - [ ] user_role_updated
    - [ ] filter_applied
    - [ ] search_performed
  - Tempo: _____ min

- [ ] **Backend: Endpoint de Analytics**
  - [ ] Adicionar `POST /api/admin/analytics/events` no adminController
  - [ ] Salvar eventos no banco (ou apenas logar)
  - Tempo: _____ min

- [ ] **Testar Analytics**
  - [ ] Navegar entre tabs
  - [ ] Fazer algumas ações (deletar, filtrar, etc)
  - [ ] Ver console do backend:
    - [ ] Logs de eventos sendo recebidos
    - [ ] POST /api/admin/analytics/events a cada 30s
  - [ ] ✅ Eventos sendo enviados / ❌ Não funciona

**Commit:** `feat: add analytics tracking (Sprint 3.2)`

**Resultado Esperado:**
- ✅ Todos eventos rastreados
- ✅ Backend recebendo dados
- ✅ Observabilidade do painel

---

## ✅ Checkpoint Sprint 3

- [ ] **Todas as tasks do Sprint 3 concluídas**
- [ ] **Infinite scroll funcionando perfeitamente**
- [ ] **Analytics rastreando eventos**
- [ ] **2 commits feitos**

**Métricas Sprint 3:**
- Tempo total gasto: _____ horas
- Infinite scroll: Carrega _____ logs de cada vez (meta: 50)
- Analytics: _____ eventos por minuto

---

## 🎉 CONCLUSÃO

### Resumo Final

**Tempo Total Gasto:** _____ horas (estimado: 16-22h)

**Commits Feitos:** _____ (estimado: 10+)

**Arquivos Criados:**
- [ ] `src/hooks/useDebounce.js`
- [ ] `src/hooks/useAdminData.js`
- [ ] `src/hooks/useInfiniteScroll.js`
- [ ] `src/hooks/useAnalytics.js`
- [ ] `src/services/analyticsService.js`
- [ ] `backend/controllers/adminController.js`
- [ ] `backend/routes/admin.js`
- [ ] `backend/models/ActivityLog.js`
- [ ] `backend/middleware/roleMiddleware.js`

**Arquivos Modificados:**
- [ ] `src/main.jsx`
- [ ] `src/pages/Admin.jsx`
- [ ] `src/pages/ActivityLogs.jsx`
- [ ] `backend/models/User.js`
- [ ] `backend/models/Company.js`
- [ ] `backend/server.js`
- [ ] `package.json`

---

### Métricas Finais

| Métrica | Antes | Depois | Melhoria Real |
|---------|-------|--------|---------------|
| **Carregamento inicial** | 3-5s | ___s | ___% |
| **Payload lista usuários** | 200KB | ___KB | ___% |
| **Query MongoDB** | 500-1000ms | ___ms | ___% |
| **Busca (requests)** | 20+ | ___ | ___% |
| **Navegação (cache)** | 1.5s | ___ms | ___% |
| **Re-renders** | 50+ | ___ | ___% |

**Meta:** 80-90% de melhoria

**Atingido:** ✅ SIM / ❌ NÃO (___%)

---

### Validação Final

- [ ] **Performance:**
  - [ ] Lighthouse score melhorou
  - [ ] React Query DevTools mostra 70%+ cache hit
  - [ ] MongoDB queries usando IXSCAN

- [ ] **Funcionalidade:**
  - [ ] Todas as tabs funcionam
  - [ ] Paginação funciona
  - [ ] Busca funciona (debounce)
  - [ ] Filtros funcionam
  - [ ] Mutations funcionam (delete, update role)
  - [ ] Infinite scroll funciona
  - [ ] Analytics rastreando

- [ ] **Código:**
  - [ ] Linting passa (`npm run lint`)
  - [ ] Type checking passa (`npm run typecheck`)
  - [ ] Testes passam (`npm test`)
  - [ ] Build funciona (`npm run build`)

- [ ] **Deploy:**
  - [ ] Deploy em staging
  - [ ] Testes em staging
  - [ ] Deploy em produção
  - [ ] Monitoring ativo

---

### Próximos Passos (Opcional)

- [ ] **Fase 4: Redis Cache (servidor)**
  - Tempo estimado: 6h
  - Impacto: +20% performance backend

- [ ] **Fase 5: Websockets (real-time)**
  - Tempo estimado: 8h
  - Impacto: Updates em tempo real

- [ ] **Fase 6: Grafana Dashboard**
  - Tempo estimado: 4h
  - Impacto: Observabilidade avançada

---

## 📝 Notas e Observações

**Desafios Encontrados:**
-
-
-

**Soluções Aplicadas:**
-
-
-

**Lições Aprendidas:**
-
-
-

---

**Data de Conclusão:** ___/___/2026
**Responsável:** _______________
**Revisado por:** _______________

**Status:**
- [ ] ⏳ Em Progresso
- [ ] ✅ Concluído
- [ ] 🚀 Deploy em Produção

---

**Assinatura Digital:**

```
Eu, _________________, confirmo que implementei todas as otimizações
especificadas neste checklist e que as métricas de performance foram
atingidas conforme esperado.

Data: ___/___/2026
Assinatura: _______________
```

---

**Documento criado por:** @data-engineer (Claude Sonnet 4.5)
**Data:** 2026-02-25
**Versão:** 1.0
