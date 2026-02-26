# Story 2.5: Componentes Reutilizáveis Base (10)

**Epic:** [Resolução de Débitos Técnicos](epic-technical-debt.md)
**Story ID:** 2.5
**Prioridade:** P1 (ALTA)
**Estimativa:** 24h
**Status:** ✅ Completo

---

## 📋 Objetivo

Criar 10 componentes reutilizáveis usando o Design System (Story 2.4), substituindo código duplicado e melhorando consistência.

---

## 👤 User Story

**Como** desenvolvedor,
**Quero** componentes reutilizáveis bem definidos,
**Para** evitar código duplicado e manter consistência visual.

---

## ✅ Critérios de Aceitação

### 1. Componentes Base Criados (10)
- [x] **PageHeader** - Header de página com título, breadcrumbs, ações
- [x] **EmptyState** - Estado vazio com ícone, mensagem, ação
- [x] **LoadingSpinner** - Spinner de loading reutilizável
- [x] **ErrorAlert** - Alert de erro consistente
- [x] **SuccessToast** - Toast de sucesso (não-blocking)
- [x] **ConfirmDialog** - Modal de confirmação
- [x] **DataTable** - Tabela com sort, filter, pagination
- [x] **SearchBar** - Barra de busca com debounce
- [x] **AvatarGroup** - Grupo de avatares empilhados
- [x] **StatCard** - Card de métrica/estatística

### 2. Componentes Acessíveis
- [x] WCAG 2.1 AA em todos
- [x] Navegação por teclado
- [x] Screen reader support
- [x] Focus management

### 3. Documentação
- [x] Props documentados
- [x] Exemplos de uso
- [x] Storybook OU exemplos em Markdown

### 4. Testes
- [x] Pelo menos 1 teste por componente
- [x] Cobertura de casos principais

---

## 🛠️ Componentes Detalhados

### 1. PageHeader
**Props:** title, subtitle, breadcrumbs, actions
**Uso:** Topo de páginas principais

```jsx
<PageHeader
  title="Dashboard"
  subtitle="Visão geral das métricas"
  breadcrumbs={[
    { label: 'Home', href: '/' },
    { label: 'Dashboard', href: '/dashboard' }
  ]}
  actions={<Button>Nova Ação</Button>}
/>
```

### 2. EmptyState
**Props:** icon, title, description, action
**Uso:** Quando não há dados

```jsx
<EmptyState
  icon={<FaInbox />}
  title="Nenhuma mensagem"
  description="Você não tem mensagens no momento"
  action={<Button>Enviar Mensagem</Button>}
/>
```

### 3. LoadingSpinner
**Props:** size, variant, text
**Uso:** Estados de loading

```jsx
<LoadingSpinner size="lg" text="Carregando..." />
```

### 4-10. (Similar structure)

---

## 📝 Tarefas

### Phase 1: Componentes de Layout (6h)
- [x] PageHeader
- [x] EmptyState
- [x] LoadingSpinner

### Phase 2: Componentes de Feedback (6h)
- [x] ErrorAlert
- [x] SuccessToast
- [x] ConfirmDialog

### Phase 3: Componentes de Dados (8h)
- [x] DataTable
- [x] SearchBar
- [x] StatCard

### Phase 4: Componentes Visuais (4h)
- [x] AvatarGroup

---

## 📊 Definition of Done

- [x] 10 componentes criados
- [x] Todos usando Design System (Shadcn)
- [x] WCAG AA mantido
- [x] Documentados com exemplos
- [x] Testados (1+ teste cada)
- [x] Em uso em pelo menos 3 páginas

---

**Criado por:** Claude Code
**Data:** 2026-02-23
