# Guia Visual Rápido - CRM Design

## 🎨 Preview da Interface

### Layout Geral
```
┌─────────────────────────────────────────────────────────────────┐
│ 📊 CRM - Gestão de Leads               [+ Novo Lead]            │
│ Pipeline de vendas e oportunidades                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│ │ R$ 217k  │ │ R$ 36k   │ │    4     │ │   67%    │          │
│ │ Total    │ │ Ticket   │ │ Alta Pri │ │ Conversão│          │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ 🔍 Buscar...  [▼ Ordenar] [🔽 Filtros] [Pipeline] [Lista]    │
│                                                                 │
│ [Todos 45] [Novo 12] [Contato 8] [Qualificação 10]...         │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│ │Tech Sol  │ │Varejo Pr │ │StartUp   │ │Metal Corp│          │
│ │João Silva│ │Maria San │ │Pedro Cost│ │Ana Paula │          │
│ │──────────│ │──────────│ │──────────│ │──────────│          │
│ │R$ 45.000 │ │R$ 28.500 │ │R$ 15.000 │ │R$ 82.000 │          │
│ │⭐⭐⭐⭐⭐  │ │⭐⭐⭐⭐☆  │ │⭐⭐⭐☆☆  │ │⭐⭐⭐⭐⭐  │          │
│ │[██████░░]│ │[████░░░░]│ │[███░░░░░]│ │[████████]│          │
│ │75%       │ │60%       │ │40%       │ │85%       │          │
│ │[VIP]     │ │[Varejo]  │ │[PME]     │ │[VIP][URG]│          │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Elementos Principais

### 1. Cabeçalho
```
┌─────────────────────────────────────────────┐
│ CRM - Gestão de Leads      [➕ Novo Lead]  │
│ Pipeline de vendas e oportunidades         │
└─────────────────────────────────────────────┘

Estilos:
- Título: text-5xl font-bold text-gray-900 dark:text-gray-100
- Subtítulo: text-lg font-semibold text-gray-500
- Botão: bg-gradient-to-r from-purple-500 to-purple-600
         rounded-3xl px-6 py-3 text-white
```

### 2. Cards de Estatísticas
```
┌─────────────────┐
│ 📊              │
│ TOTAL EM LEADS  │
│ R$ 217.000      │ ← text-3xl font-bold
│ 45 oportunidades│ ← text-xs text-gray-500
└─────────────────┘

Cores dos Ícones:
- Total: purple (from-purple-500 to-purple-600)
- Ticket: green (from-green-500 to-green-600)
- Alta Pri: amber (from-amber-500 to-amber-600)
- Conversão: blue (from-blue-500 to-blue-600)

Container:
- bg-white dark:bg-gray-900
- rounded-3xl p-6
- border-3 border-gray-900 dark:border-gray-700
- box-shadow: var(--shadow-layered)
```

### 3. Barra de Filtros
```
┌──────────────────────────────────────────────────────┐
│ 🔍 [Buscar por nome...]  [▼Ordenar] [Filtros] [P][L]│
└──────────────────────────────────────────────────────┘

Elementos:
- Input: rounded-2xl bg-gray-100 dark:bg-gray-800
- Dropdowns: rounded-xl
- Toggle P/L: bg-gray-100 com botões internos rounded-lg
- Filtros ativos: badge com número (purple)
```

### 4. Tabs de Estágio
```
┌────────────────────────────────────────────────────┐
│ [Todos 45] [Novo 12] [Contato 8] [Qualificação 10]│
│                                                    │
│ ● = Indicador colorido por estágio                │
└────────────────────────────────────────────────────┘

Cores dos Estágios:
● Todos: gray-500
● Novo Lead: blue-500
● Primeiro Contato: cyan-500
● Qualificação: purple-500
● Proposta Enviada: amber-500
● Negociação: orange-500
● Fechamento: green-500

Tab Ativo:
- bg-white dark:bg-gray-900
- shadow-lg
- border-3 border-gray-900 dark:border-gray-700

Tab Inativo:
- bg-white/60 dark:bg-gray-900/60
- text-gray-600 dark:text-gray-400
- hover:bg-white
```

### 5. Card de Lead (Pipeline)
```
┌─────────────────────────────────┐
│ Tech Solutions Ltda        ⋮    │ ← Header
│ 👤 João Silva                   │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Valor da Oportunidade       │ │ ← Box destaque
│ │ R$ 45.000                   │ │   (gradiente purple)
│ └─────────────────────────────┘ │
│                                 │
│ 📞 +55 (11) 98765-4321         │
│ ✉️  joao@techsolutions.com     │
│ 📍 São Paulo - SP              │
│                                 │
│ Prioridade                      │
│ ⭐⭐⭐⭐⭐                        │
│                                 │
│ Probabilidade            75%    │
│ [████████████░░░░░░]           │
│                                 │
│ [VIP] [Grande Porte]           │ ← Tags
│                                 │
│ ─────────────────────────────  │
│ 🕒 Enviar proposta técnica     │ ← Próxima ação
│    24/02/2026                   │
└─────────────────────────────────┘

Container:
- bg-white dark:bg-gray-900
- rounded-3xl p-6
- border-3 border-gray-900 dark:border-gray-700
- hover:border-purple-500
- cursor-pointer
- transition-all duration-300
```

### 6. Tabela (Modo Lista)
```
┌──────────────────────────────────────────────────────────────────┐
│ Empresa/Contato │ Estágio │ Valor │ Prioridade │ Prob. │ Ações  │
├──────────────────────────────────────────────────────────────────┤
│ 🔵 Tech Solut.. │ [Qual.] │ 45k  │ ⭐⭐⭐⭐⭐   │ ████75% │ ✏️ ⋮  │
│    João Silva   │         │      │           │        │       │
├──────────────────────────────────────────────────────────────────┤
│ 🔵 Varejo Prem. │ [Prop.] │ 28k  │ ⭐⭐⭐⭐☆   │ ███60%  │ ✏️ ⋮  │
│    Maria Santos │         │      │           │        │       │
└──────────────────────────────────────────────────────────────────┘

Estilos:
- Header: bg-gray-50 dark:bg-gray-800
          font-bold text-xs uppercase
- Row: hover:bg-purple-50 dark:hover:bg-purple-900/10
- Estágios: Pills coloridas (badge)
- Avatar: rounded-full gradient purple
```

### 7. Modal de Detalhes
```
┌─────────────────────────────────────────────────────────────┐
│ [Gradiente Purple]                                      ✕   │
│ 🔵 Tech Solutions Ltda                                      │
│    João Silva - Diretor de TI                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌──────────────────┐ ┌──────────────────┐                 │
│ │ COLUNA ESQUERDA  │ │ COLUNA DIREITA   │                 │
│ │                  │ │                  │                 │
│ │ 📋 Contato       │ │ ⭐ Prioridade    │                 │
│ │ 📞 (11) 98765... │ │ ⭐⭐⭐⭐⭐        │                 │
│ │ ✉️  joao@tech... │ │                  │                 │
│ │ 📍 São Paulo-SP  │ │ 🕒 Próxima Ação  │                 │
│ │                  │ │ Enviar proposta  │                 │
│ │ 💰 Oportunidade  │ │ 24/02/2026       │                 │
│ │ R$ 45.000        │ │                  │                 │
│ │ [████████75%]    │ │ 📝 Observações   │                 │
│ │                  │ │ Cliente demons...│                 │
│ │ 🏷️ Tags          │ │                  │                 │
│ │ [VIP] [Grande]   │ │ ⏰ Última Inter. │                 │
│ │                  │ │ 2 horas atrás    │                 │
│ └──────────────────┘ └──────────────────┘                 │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ [💬 Abrir Conversa] [✏️ Editar Lead] [🗑️]                  │
└─────────────────────────────────────────────────────────────┘

Dimensões:
- max-w-4xl (1024px)
- max-h-90vh
- overflow-y-auto

Header:
- bg-gradient-to-r from-purple-500 to-purple-600
- text-white
- p-6

Grid:
- grid-cols-1 md:grid-cols-2
- gap-6
```

---

## 🎨 Paleta de Cores Aplicada

### Cores por Contexto

#### Background
```
Light Mode:
- Página: #f0f2f5
- Cards: #ffffff
- Input: #f3f4f6

Dark Mode:
- Página: rgb(3, 7, 18) [gray-950]
- Cards: rgb(17, 24, 39) [gray-900]
- Input: rgb(31, 41, 55) [gray-800]
```

#### Texto
```
Light Mode:
- Principal: #111827 (gray-900)
- Secundário: #6b7280 (gray-500)
- Auxiliar: #9ca3af (gray-400)

Dark Mode:
- Principal: #f9fafb (gray-100)
- Secundário: #9ca3af (gray-400)
- Auxiliar: #6b7280 (gray-500)
```

#### Elementos Interativos
```
Purple (Primary):
- Default: #8b5cf6 (purple-600)
- Hover: #7c3aed (purple-700)
- Active: #6d28d9 (purple-800)
- Light: #f3e8ff (purple-100)
- Dark BG: rgba(139, 92, 246, 0.2)

Status Colors:
- Success: #059669 (emerald-600)
- Warning: #d97706 (amber-600)
- Error: #dc2626 (red-600)
- Info: #0284c7 (sky-600)
```

#### Estágios (Pipeline)
```
#3b82f6 (blue-500)    → Novo Lead
#06b6d4 (cyan-500)    → Primeiro Contato
#8b5cf6 (purple-500)  → Qualificação
#f59e0b (amber-500)   → Proposta Enviada
#f97316 (orange-500)  → Negociação
#10b981 (green-500)   → Fechamento
```

---

## 🔧 Classes Tailwind Mais Usadas

### Layout
```css
Container Principal:
- min-h-screen bg-[#f0f2f5] dark:bg-gray-950 p-8

Grids:
- grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6

Flex:
- flex items-center justify-between gap-4
```

### Cards
```css
Padrão:
- bg-white dark:bg-gray-900
- rounded-3xl p-6
- border-3 border-gray-900 dark:border-gray-700
- shadow: var(--shadow-layered)

Hover:
- hover:border-purple-500
- hover:shadow-xl
- transition-all duration-300
```

### Botões
```css
Primary:
- bg-gradient-to-r from-purple-500 to-purple-600
- text-white rounded-2xl px-6 py-3
- hover:from-purple-600 hover:to-purple-700
- font-semibold

Secondary:
- bg-gray-100 dark:bg-gray-800
- text-gray-900 dark:text-white
- rounded-2xl px-6 py-3
- hover:bg-gray-200 dark:hover:bg-gray-700

Destructive:
- bg-red-100 dark:bg-red-900/30
- text-red-600 dark:text-red-400
- rounded-2xl px-6 py-3
- hover:bg-red-200 dark:hover:bg-red-900/50
```

### Tags/Pills
```css
- inline-flex items-center
- px-2.5 py-1
- bg-purple-100 dark:bg-purple-900/30
- text-purple-700 dark:text-purple-300
- text-xs font-medium
- rounded-full
```

### Inputs
```css
- w-full px-4 py-3
- bg-gray-100 dark:bg-gray-800
- border border-gray-200 dark:border-gray-700
- rounded-2xl text-sm
- text-gray-900 dark:text-white
- placeholder-gray-500
- focus:outline-none focus:ring-2 focus:ring-purple-500
```

---

## 📱 Responsividade

### Breakpoints Aplicados

```css
Mobile (< 640px):
grid-cols-1
flex-col
w-full
hidden (alguns elementos)

Tablet (640px - 1024px):
sm:grid-cols-2
sm:flex-row
sm:w-auto

Desktop (> 1024px):
lg:grid-cols-3
lg:ml-64 (sidebar)

Large Desktop (> 1280px):
xl:grid-cols-4
max-w-[1600px]
```

### Elementos que Adaptam

```jsx
// Estatísticas
grid-cols-1 md:grid-cols-2 lg:grid-cols-4

// Pipeline Cards
grid-cols-1 lg:grid-cols-3 xl:grid-cols-4

// Modal
grid-cols-1 md:grid-cols-2 (conteúdo interno)

// Header
flex-col lg:flex-row (título + botão)

// Filtros
flex-wrap (permite quebra de linha)

// Tabela
overflow-x-auto (scroll horizontal em mobile)
```

---

## ⚡ Animações e Transições

### Animações de Entrada
```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

Uso:
- animate-fade-in-up
- delay-100, delay-200, delay-300... (stagger effect)
```

### Transições
```css
Padrão:
- transition-all duration-300

Hover:
- hover:scale-110 (ícones)
- hover:translateY(-8px) (cards)
- hover:border-purple-500 (borders)

Active:
- active:scale-95 (botões)
```

### Loading States (Skeleton)
```jsx
// Placeholder para carregamento
<div className="animate-pulse">
  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
</div>
```

---

## 🎯 Estados Interativos

### Hover
```css
Cards:
- border-gray-900 → border-purple-500
- shadow-layered → shadow-xl

Botões:
- scale-100 → scale-105
- brightness-100 → brightness-110

Tabs:
- bg-white/60 → bg-white
- text-gray-600 → text-gray-900
```

### Active/Selecionado
```css
Tab Ativa:
- bg-white shadow-lg
- border-3 border-gray-900

Lead Selecionado:
- border-purple-500
- bg-purple-50 dark:bg-purple-900/10

Filtro Ativo:
- bg-purple-600 text-white
- shadow-lg
```

### Disabled
```css
- bg-gray-300 dark:bg-gray-700
- text-gray-500
- cursor-not-allowed
- opacity-50
```

---

## 🔍 Acessibilidade

### Implementado
```jsx
// Contraste adequado
- WCAG AA compliant em todos os textos

// Focus states
- focus:outline-none focus:ring-2 focus:ring-purple-500

// Aria labels
- aria-label para botões de ícone
- role="button" onde necessário

// Keyboard navigation
- Tab order lógico
- Enter para abrir modais
- Esc para fechar modais

// Screen readers
- Textos alternativos em elementos visuais
- Estrutura semântica (h1, h2, h3...)
```

---

## 📦 Componentes Reutilizáveis Sugeridos

### 1. StatCard
```jsx
<StatCard
  icon={<FaChartLine />}
  title="Total em Leads"
  value="R$ 217.000"
  subtitle="45 oportunidades"
  color="purple"
/>
```

### 2. PriorityStars
```jsx
<PriorityStars value={5} />
// Renderiza ⭐⭐⭐⭐⭐
```

### 3. ProbabilityBar
```jsx
<ProbabilityBar value={75} />
// Renderiza barra verde com 75%
```

### 4. Tag
```jsx
<Tag color="purple">VIP</Tag>
<Tag color="amber" onRemove={() => {}}>Urgente ✕</Tag>
```

### 5. LeadCard
```jsx
<LeadCard
  lead={leadData}
  onClick={() => openDetails()}
/>
```

### 6. Modal
```jsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Detalhes do Lead"
>
  {children}
</Modal>
```

---

## 🎓 Boas Práticas Aplicadas

✅ Componentes pequenos e reutilizáveis
✅ Props tipadas (use TypeScript depois)
✅ Estado local vs global bem definido
✅ Nomes de classes consistentes
✅ Comentários em seções complexas
✅ Performance: evitar re-renders desnecessários
✅ Lazy loading de imagens/componentes pesados
✅ Error boundaries para robustez
✅ Loading states para feedback
✅ Mensagens de erro amigáveis

---

## 🚀 Performance Tips

```jsx
// 1. Memoização
const MemoizedLeadCard = React.memo(LeadCard);

// 2. Lazy loading
const CRMModal = lazy(() => import('./CRMModal'));

// 3. Virtualization (lista grande)
import { FixedSizeList } from 'react-window';

// 4. Debounce na busca
const debouncedSearch = useMemo(
  () => debounce(handleSearch, 300),
  []
);

// 5. Pagination
const paginatedLeads = leads.slice(
  (page - 1) * perPage,
  page * perPage
);
```

---

Esse guia visual serve como referência rápida para implementação e manutenção do design do CRM!
