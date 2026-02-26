# Arquitetura do Sistema de Filtro por Setores

## Diagrama de Fluxo

```
┌─────────────────────────────────────────────────────────────────┐
│                         USUÁRIO ACESSA                          │
│                      Página de Atalhos                          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     CARREGA AppContext                          │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  userData = {                                             │  │
│  │    name: "Henrique de Oliveira",                         │  │
│  │    role: "admin",  ◄────── PERMISSÃO                    │  │
│  │    setor: "geral"  ◄────── SETOR DO USUÁRIO             │  │
│  │  }                                                         │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   CARREGA ATALHOS (Mock Data)                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  localStorage.getItem('shortcutsData')                    │  │
│  │  OU                                                        │  │
│  │  Mock inicial com 15 atalhos:                            │  │
│  │    - 2 Geral                                              │  │
│  │    - 3 Vendas                                             │  │
│  │    - 3 Suporte                                            │  │
│  │    - 3 Financeiro                                         │  │
│  │    - 3 RH                                                 │  │
│  │    - 1 Individual                                         │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    APLICA FILTROS                               │
│                                                                  │
│  1️⃣ FILTRO DE BUSCA (search)                                   │
│     ▼                                                           │
│     shortcut.includes(search) ||                               │
│     title.includes(search) ||                                  │
│     content.includes(search)                                   │
│                                                                  │
│  2️⃣ FILTRO DE TAB (activeTab)                                  │
│     ▼                                                           │
│     all | global | sector | individual                         │
│                                                                  │
│  3️⃣ FILTRO DE SETOR (matchSetor)                              │
│     ▼                                                           │
│     ┌───────────────────────────────────────┐                  │
│     │  userData.role === 'admin' ?          │                  │
│     │    ✅ Vê TODOS os setores             │                  │
│     │  :                                     │                  │
│     │    ✅ Vê apenas seu setor + Geral     │                  │
│     └───────────────────────────────────────┘                  │
│                                                                  │
│  4️⃣ FILTRO MANUAL (filterSetor)                               │
│     ▼                                                           │
│     ┌───────────────────────────────────────┐                  │
│     │  filterSetor !== 'todos' ?            │                  │
│     │    ✅ Sobrescreve filtro automático   │                  │
│     │  :                                     │                  │
│     │    ✅ Usa filtro automático            │                  │
│     └───────────────────────────────────────┘                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                  RENDERIZA ATALHOS FILTRADOS                    │
│                                                                  │
│  Para cada atalho:                                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  📌 /atalho                                              │   │
│  │  ├─ Título                                               │   │
│  │  ├─ Badge Scope (Global/Setor/Individual)               │   │
│  │  ├─ Badge Setor (Vendas/Suporte/Financeiro/RH/Geral)   │   │
│  │  └─ Conteúdo (truncado)                                 │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Fluxo de Decisão: Qual Atalho Mostrar?

```
┌─ INÍCIO ─┐
     │
     ▼
┌────────────────────┐
│ Usuário é Admin?   │
└──────┬─────────────┘
       │
  ┌────┴────┐
  │         │
 Sim       Não
  │         │
  │         ▼
  │    ┌──────────────────────────────┐
  │    │ Setor do usuário = ?         │
  │    └──────┬───────────────────────┘
  │           │
  │      ┌────┴─────┬──────┬──────┬────┐
  │      │          │      │      │    │
  │   Vendas    Suporte  Finan  RH  Geral
  │      │          │      │      │    │
  │      ▼          ▼      ▼      ▼    ▼
  │    Vê:        Vê:    Vê:   Vê:   Vê:
  │   Vendas    Suporte  Fin   RH   Geral
  │   + Geral   + Geral +Geral +Geral
  │      │          │      │      │    │
  │      └──────────┴──────┴──────┴────┘
  │                 │
  ▼                 ▼
┌──────────────────────────────┐
│ Filtro Manual ativo?         │
└──────┬───────────────────────┘
       │
  ┌────┴────┐
  │         │
 Sim       Não
  │         │
  ▼         ▼
Mostra   Usa filtro
setor    automático
selecionado
  │         │
  └────┬────┘
       │
       ▼
┌──────────────────┐
│ ATALHOS EXIBIDOS │
└──────────────────┘
```

---

## Estrutura de Dados

### 1. Estado Global (AppContext)

```javascript
userData: {
  name: string,
  email: string,
  role: 'admin' | 'user',     // ◄── Define permissões
  setor: 'vendas' | 'suporte' | 'financeiro' | 'rh' | 'geral', // ◄── Define filtro
  cargo: string,
  // ...outros campos
}
```

### 2. Atalho (Shortcut)

```javascript
{
  id: string,                   // ID único
  shortcut: string,             // Comando (ex: "ola")
  title: string,                // Título exibido
  content: string,              // Conteúdo do atalho

  // SISTEMA ANTIGO (Legacy)
  scope: 'global' | 'sector' | 'individual',
  user_id: string | null,       // Se individual
  sector_id: string | null,     // Se por setor (antigo)

  // SISTEMA NOVO (Filtro por Setor)
  setor: 'vendas' | 'suporte' | 'financeiro' | 'rh' | 'geral'  // ◄── NOVO
}
```

### 3. Setor

```javascript
{
  id: 'vendas',                 // ID do setor
  name: 'Vendas',               // Nome exibido
  color: 'text-blue-600',       // Cor do badge
  bg: 'bg-blue-50 dark:bg-blue-900/30'  // Fundo do badge
}
```

---

## Lógica de Filtragem (Código)

### filteredReplies (linha 91-120)

```javascript
const filteredReplies = replies.filter(reply => {
  // 1️⃣ Filtro de Busca
  const matchSearch = !search ||
    reply.shortcut.toLowerCase().includes(search.toLowerCase()) ||
    reply.title.toLowerCase().includes(search.toLowerCase()) ||
    reply.content.toLowerCase().includes(search.toLowerCase());

  // 2️⃣ Filtro de Tab
  const matchTab = activeTab === 'all' || reply.scope === activeTab;

  // 3️⃣ Filtro por Setor (AUTOMÁTICO)
  let matchSetor = true;

  if (userData.role === 'admin') {
    // Admin vê TODOS os atalhos
    matchSetor = true;
  } else {
    // Usuário comum: vê apenas seu setor + Geral
    const userSetor = userData.setor || 'geral';
    matchSetor = reply.setor === userSetor || reply.setor === 'geral';
  }

  // 4️⃣ Filtro Manual (DROPDOWN)
  if (filterSetor !== 'todos') {
    // Sobrescreve filtro automático
    matchSetor = reply.setor === filterSetor;
  }

  return matchSearch && matchTab && matchSetor;
});
```

---

## Componentes UI

### 1. Banner Informativo (Azul)

```
┌─────────────────────────────────────────────────────────┐
│ 🔵 Filtro por Setor                                     │
│                                                          │
│ Como Admin, você vê todos os atalhos de todos os        │
│ setores. Use o filtro acima para visualizar atalhos     │
│ específicos.                                             │
└─────────────────────────────────────────────────────────┘
```

**OU** (se usuário comum)

```
┌─────────────────────────────────────────────────────────┐
│ 🔵 Filtro por Setor                                     │
│                                                          │
│ Você está no setor Vendas e vê apenas atalhos do seu   │
│ setor + Geral. Use o filtro para explorar outros        │
│ setores.                                                 │
└─────────────────────────────────────────────────────────┘
```

### 2. Dropdown de Filtro

```
┌───────────────────────────────┐
│ 🔍 [Buscar respostas...]      │
└───────────────────────────────┘

┌─────────────────────┐
│ 🔽 Todos os Setores │ ◄── Dropdown
├─────────────────────┤
│   Todos os Setores  │
│   Vendas            │
│   Suporte           │
│   Financeiro        │
│   RH                │
│   Geral             │
└─────────────────────┘
```

### 3. Card de Atalho

```
┌─────────────────────────────────────────────────────┐
│  /proposta                                          │
│                                                     │
│  Envio de Proposta                                 │
│  [Global] [Vendas] ◄── Badges                     │
│                                                     │
│  📋 Olá! Segue a proposta comercial conforme...   │
│                                                     │
│                                      [✏️] [🗑️]     │
└─────────────────────────────────────────────────────┘
```

**Badges:**
- **Purple:** Global/Setor/Individual (scope)
- **Colored:** Vendas/Suporte/Financeiro/RH/Geral (setor)

---

## Persistência (localStorage)

### Chaves no localStorage

```javascript
{
  "userData": {
    "name": "Henrique de Oliveira",
    "role": "admin",
    "setor": "geral"  // ◄── Setor do usuário
  },

  "shortcutsData": [
    {
      "id": "1",
      "shortcut": "ola",
      "title": "Saudação Inicial",
      "setor": "geral"  // ◄── Setor do atalho
    },
    // ... mais atalhos
  ]
}
```

### Auto-save

```javascript
useEffect(() => {
  localStorage.setItem('shortcutsData', JSON.stringify(replies));
}, [replies]); // Salva sempre que replies mudar
```

---

## Mapa de Cores por Setor

| Setor | Cor Principal | Background | Badge |
|-------|--------------|------------|-------|
| **Vendas** | `text-blue-600` | `bg-blue-50 dark:bg-blue-900/30` | 🔵 |
| **Suporte** | `text-green-600` | `bg-green-50 dark:bg-green-900/30` | 🟢 |
| **Financeiro** | `text-yellow-600` | `bg-yellow-50 dark:bg-yellow-900/30` | 🟡 |
| **RH** | `text-pink-600` | `bg-pink-50 dark:bg-pink-900/30` | 🩷 |
| **Geral** | `text-purple-600` | `bg-purple-50 dark:bg-purple-900/30` | 🟣 |

---

## Casos de Uso

### Caso 1: Admin quer ver todos os atalhos de Vendas

1. Admin acessa Atalhos
2. Vê todos os 15 atalhos por padrão
3. Clica no dropdown "Todos os Setores"
4. Seleciona "Vendas"
5. Vê apenas os 3 atalhos de Vendas

**Filtro aplicado:** Manual (filterSetor = 'vendas')

---

### Caso 2: Usuário de Suporte quer criar atalho

1. Usuário (setor: suporte) acessa Atalhos
2. Vê automaticamente: Suporte + Geral (5 atalhos)
3. Clica em "Nova Resposta"
4. Preenche formulário
5. Campo "Setor do Atalho" vem pré-selecionado com "Suporte"
6. Pode mudar para outro setor se quiser
7. Salva
8. Novo atalho aparece na lista

**Filtro aplicado:** Automático (userData.setor = 'suporte')

---

### Caso 3: Usuário de Financeiro quer ver atalhos de RH

1. Usuário (setor: financeiro) acessa Atalhos
2. Vê automaticamente: Financeiro + Geral (5 atalhos)
3. Clica no dropdown
4. Seleciona "RH"
5. Vê os 3 atalhos de RH
6. Pode voltar para "Todos os Setores" para ver Financeiro + Geral

**Filtro aplicado:** Manual (filterSetor = 'rh')

---

## Performance

### Otimizações Implementadas

1. **localStorage Batch Write:**
   - Salva todos os atalhos de uma vez
   - `useEffect` com dependência `[replies]`

2. **Filtragem Client-Side:**
   - Filtros aplicados no frontend
   - Sem necessidade de chamadas à API

3. **Memoization (Futuro):**
   - Pode adicionar `useMemo` para `filteredReplies`
   - Evita recalcular filtros desnecessariamente

---

## Extensibilidade

### Futuras Features

1. **Múltiplos Setores por Atalho:**
   ```javascript
   setor: ['vendas', 'suporte'] // Array em vez de string
   ```

2. **Permissões Granulares:**
   ```javascript
   permissions: {
     canView: ['admin', 'manager'],
     canEdit: ['admin'],
     canDelete: ['admin']
   }
   ```

3. **Analytics:**
   ```javascript
   stats: {
     timesUsed: 42,
     lastUsed: '2026-02-24T10:30:00Z',
     mostUsedBy: 'suporte'
   }
   ```

---

**Arquitetura Concluída!** ✅
