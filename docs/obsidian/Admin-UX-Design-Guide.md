# 🎨 Guia de UX/UI - Painel Superadmin

> **Versão:** 1.0.0
> **Data:** 2026-02-25
> **Responsável:** @ux-design-expert
> **Status:** 🟢 Completo

---

## 📋 Índice

1. [Análise UX Atual](#análise-ux-atual)
2. [Princípios de Design](#princípios-de-design)
3. [Sistema de Design](#sistema-de-design)
4. [Componentes Visuais](#componentes-visuais)
5. [Novas Funcionalidades](#novas-funcionalidades)
6. [Estados de UI](#estados-de-ui)
7. [Micro-interações](#micro-interações)
8. [Acessibilidade](#acessibilidade)
9. [Especificações Técnicas](#especificações-técnicas)

---

## 🔍 Análise UX Atual

### Pontos Fortes

✅ **Estrutura Clara**
- Navegação por tabs bem definida (Dashboard, Usuários, Empresas, Sistema)
- Sidebar fixa facilita transição entre seções
- Hierarquia visual respeitada

✅ **Tema Purple Consistente**
- Uso correto de `from-purple-500 to-purple-600` para elementos primários
- Gradientes aplicados em CTAs e elementos de destaque
- Dark mode implementado em todos os componentes

✅ **Componentes Reutilizáveis**
- StatusBadge com variantes (active, inactive, pending, etc.)
- Badge genérico com 6 variantes (primary, success, warning, etc.)
- Modal acessível com focus trap
- UpgradeBanner bem estruturado

✅ **Feedback Visual Adequado**
- Badges coloridos para status
- Hover states em botões e cards
- Transições suaves (`transition-all`)

### Problemas Identificados

🔴 **Complexidade Excessiva**
- **Arquivo:** 2.939 linhas em um único componente
- **Impacto:** Difícil manutenção, re-renders desnecessários
- **Solução:** Refatoração modular (60+ componentes)

🟡 **Inconsistências Visuais**
- **Modais:** Alguns usam `max-w-3xl`, outros `max-w-6xl`
- **Espaçamento:** Variação entre `space-y-4`, `space-y-6`, `space-y-8`
- **Sombras:** Alguns cards usam `shadow-lg`, outros `shadow-xl`
- **Solução:** Sistema de tokens de design

🟡 **Estados de Loading**
- **Problema:** Sem feedback visual durante operações assíncronas
- **Impacto:** Usuário pode clicar múltiplas vezes
- **Solução:** Skeletons, spinners, estados disabled

🟡 **Validação de Formulários**
- **Problema:** Falta de feedback em tempo real
- **Impacto:** Usuário só descobre erros ao submeter
- **Solução:** Validação inline com mensagens claras

🟡 **Responsividade Limitada**
- **Problema:** Muitas tabelas sem scroll horizontal
- **Impacto:** Quebra em telas < 1024px
- **Solução:** Grid responsivo + mobile-first

---

## 🎯 Princípios de Design

### 1. Clareza sobre Complexidade
- **Evitar:** Informações excessivas em um único lugar
- **Preferir:** Progressive disclosure (revelar informações gradualmente)
- **Exemplo:** Detalhes de empresa devem abrir em modal/drawer, não inline

### 2. Feedback Imediato
- **Toda ação deve ter resposta visual em < 100ms**
- **Loading states:** Skeletons, spinners, progress bars
- **Success/Error:** Toasts, banners, modais de confirmação

### 3. Consistência Visual
- **Cores:** Purple Theme + Escala semântica (success, warning, error)
- **Espaçamento:** Sistema baseado em múltiplos de 4px (0.5rem)
- **Tipografia:** Hierarquia clara (h1, h2, h3, body, caption)
- **Bordas:** Radius padrão de 0.5rem (rounded-lg)

### 4. Acessibilidade em Primeiro Lugar
- **WCAG 2.1 AA:** Contraste mínimo de 4.5:1
- **Navegação por teclado:** Tab, Enter, Esc
- **Screen readers:** ARIA labels em todos os elementos interativos
- **Focus visible:** Ring de 2px em elementos focados

### 5. Mobile-First Responsivo
- **Breakpoints:** sm (640px), md (768px), lg (1024px), xl (1280px)
- **Tabelas:** Transformar em cards empilhados em mobile
- **Sidebar:** Transformar em bottom navigation em mobile

---

## 🎨 Sistema de Design

### Paleta de Cores

#### Cores Primárias (Purple Theme)
```css
/* Light Mode */
--purple-50:  #faf5ff;
--purple-100: #f3e8ff;
--purple-500: #a855f7;  /* Primary */
--purple-600: #9333ea;  /* Primary Dark */
--purple-700: #7e22ce;
--purple-900: #581c87;

/* Dark Mode */
--purple-900/30: rgba(88, 28, 135, 0.3);  /* Backgrounds */
--purple-800: #6b21a8;                     /* Borders */
--purple-400: #c084fc;                     /* Text */
```

#### Cores Semânticas
```css
/* Success - Emerald */
--success-light: #d1fae5;      /* bg-emerald-100 */
--success-text:  #047857;      /* text-emerald-700 */
--success-dark:  #065f46;      /* dark:bg-emerald-900/30 */

/* Warning - Amber */
--warning-light: #fef3c7;      /* bg-amber-100 */
--warning-text:  #b45309;      /* text-amber-700 */
--warning-dark:  #78350f;      /* dark:bg-amber-900/20 */

/* Error - Red */
--error-light: #fee2e2;        /* bg-red-100 */
--error-text:  #b91c1c;        /* text-red-700 */
--error-dark:  #7f1d1d;        /* dark:bg-red-900/30 */

/* Info - Blue */
--info-light: #dbeafe;         /* bg-blue-100 */
--info-text:  #1d4ed8;         /* text-blue-700 */
--info-dark:  #1e3a8a;         /* dark:bg-blue-900/30 */
```

### Tipografia

```css
/* Headings */
h1: text-3xl font-extrabold (30px, 900 weight)
h2: text-2xl font-bold     (24px, 700 weight)
h3: text-xl font-semibold  (20px, 600 weight)
h4: text-lg font-medium    (18px, 500 weight)

/* Body */
body:    text-base (16px)
small:   text-sm   (14px)
caption: text-xs   (12px)

/* Hierarchy */
Page Title:    text-3xl font-extrabold
Section Title: text-2xl font-bold
Card Title:    text-lg font-semibold
Label:         text-sm font-medium
```

### Espaçamento (8pt Grid)

```css
/* Spacing Scale (múltiplos de 4px) */
space-1:  0.25rem (4px)
space-2:  0.5rem  (8px)
space-3:  0.75rem (12px)
space-4:  1rem    (16px)
space-6:  1.5rem  (24px)
space-8:  2rem    (32px)
space-12: 3rem    (48px)

/* Component Spacing */
Card Padding:    p-6 (24px)
Modal Padding:   p-6 (24px)
Button Padding:  px-4 py-2 (16px / 8px)
Input Padding:   px-4 py-3 (16px / 12px)
```

### Sombras

```css
/* Shadow Scale */
shadow-sm:  0 1px 2px rgba(0,0,0,0.05)
shadow:     0 1px 3px rgba(0,0,0,0.1)
shadow-md:  0 4px 6px rgba(0,0,0,0.1)
shadow-lg:  0 10px 15px rgba(0,0,0,0.1)
shadow-xl:  0 20px 25px rgba(0,0,0,0.1)

/* Componentes */
Cards:      shadow-md
Modais:     shadow-2xl
Dropdowns:  shadow-lg
Tooltips:   shadow
```

### Bordas

```css
/* Border Radius */
rounded:     0.25rem (4px)   /* Small elements */
rounded-lg:  0.5rem  (8px)   /* Default (cards, inputs) */
rounded-xl:  0.75rem (12px)  /* Buttons */
rounded-2xl: 1rem    (16px)  /* Modais */
rounded-3xl: 1.5rem  (24px)  /* Dialogs especiais */

/* Border Width */
border:   1px
border-2: 2px (focus states)
border-4: 4px (left accent em banners)
```

### Ícones

```css
/* Tamanhos */
Small:  w-4 h-4   (16px)  /* Badges, labels */
Medium: w-5 h-5   (20px)  /* Botões, inputs */
Large:  w-6 h-6   (24px)  /* Títulos de seção */
XLarge: w-8 h-8   (32px)  /* Ícones decorativos */

/* Avatar/Logo Icons */
Avatar Small:  w-8 h-8   (32px)
Avatar Medium: w-10 h-10 (40px)
Avatar Large:  w-12 h-12 (48px)
```

---

## 🧩 Componentes Visuais

### 1. StatusBadge

**Uso:** Indicar status de entidades (usuários, empresas, integrações)

**Variantes:**
```jsx
<StatusBadge status="active">Ativo</StatusBadge>
<StatusBadge status="inactive">Inativo</StatusBadge>
<StatusBadge status="pending">Pendente</StatusBadge>
<StatusBadge status="success">Sucesso</StatusBadge>
<StatusBadge status="warning">Atenção</StatusBadge>
<StatusBadge status="error">Erro</StatusBadge>
```

**Especificação:**
```css
/* Base */
display: inline-flex
padding: 0.25rem 0.75rem (4px 12px)
border-radius: 9999px (rounded-full)
font-size: 0.75rem (text-xs)
font-weight: 600 (font-semibold)
border: 1px solid

/* Active (Emerald) */
bg: emerald-100 dark:emerald-900/30
text: emerald-700 dark:emerald-400
border: emerald-200 dark:emerald-800

/* Inactive (Gray) */
bg: gray-100 dark:gray-800
text: gray-700 dark:gray-400
border: gray-200 dark:gray-700

/* Pending (Amber) */
bg: amber-50 dark:amber-900/20
text: amber-700 dark:amber-400
border: amber-200 dark:amber-800

/* Error (Red) */
bg: red-100 dark:red-900/30
text: red-700 dark:red-400
border: red-200 dark:red-800
```

**Acessibilidade:**
```jsx
<StatusBadge status="active" aria-label="Status: Ativo">
  Ativo
</StatusBadge>
```

---

### 2. PlanBadge

**Uso:** Indicar plano de assinatura

**Variantes:**
```jsx
<PlanBadge plan="free">Free</PlanBadge>
<PlanBadge plan="starter">Starter</PlanBadge>
<PlanBadge plan="professional">Professional</PlanBadge>
<PlanBadge plan="enterprise">Enterprise</PlanBadge>
```

**Especificação:**
```css
/* Base */
display: inline-flex
align-items: center
gap: 0.5rem (8px)
padding: 0.25rem 0.75rem (4px 12px)
border-radius: 9999px
font-size: 0.75rem
font-weight: 600
border: 1px solid

/* Free (Gray) */
bg: gray-100 dark:gray-800
text: gray-700 dark:gray-300
border: gray-200 dark:gray-700
icon: FaGift

/* Starter (Blue) */
bg: blue-100 dark:blue-900/30
text: blue-700 dark:blue-400
border: blue-200 dark:blue-800
icon: FaRocket

/* Professional (Purple) */
bg: purple-100 dark:purple-900/30
text: purple-700 dark:purple-400
border: purple-200 dark:purple-800
icon: FaStar

/* Enterprise (Purple) */
bg: purple-100 dark:purple-900/30
text: purple-700 dark:purple-400
border: purple-200 dark:purple-800
icon: FaInfinity
```

**Componente:**
```jsx
const PlanBadge = ({ plan }) => {
  const config = {
    free: {
      label: 'Free',
      icon: FaGift,
      className: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
    },
    starter: {
      label: 'Starter',
      icon: FaRocket,
      className: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800'
    },
    professional: {
      label: 'Professional',
      icon: FaStar,
      className: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800'
    },
    enterprise: {
      label: 'Enterprise',
      icon: FaInfinity,
      className: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800'
    }
  };

  const { label, icon: Icon, className } = config[plan] || config.free;

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${className}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
};
```

---

### 3. StatCard (Métricas Dashboard)

**Uso:** Exibir estatísticas importantes

**Especificação:**
```jsx
<div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-800 hover:border-purple-200 dark:hover:border-purple-800 transition-all">
  {/* Icon */}
  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30">
    <FaIcon className="text-white text-xl" />
  </div>

  {/* Label */}
  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
    Total de Usuários
  </p>

  {/* Value */}
  <p className="text-3xl font-extrabold text-gray-900 dark:text-white">
    1,247
  </p>

  {/* Trend (opcional) */}
  <div className="flex items-center gap-1 mt-2">
    <FaArrowUp className="w-3 h-3 text-emerald-500" />
    <span className="text-xs font-semibold text-emerald-500">+12.5%</span>
    <span className="text-xs text-gray-500">vs mês anterior</span>
  </div>
</div>
```

**Estados:**
- **Default:** `border-gray-200 dark:border-gray-800`
- **Hover:** `border-purple-200 dark:border-purple-800`
- **Loading:** Skeleton com animação pulse

---

### 4. DataTable

**Uso:** Exibir listas de usuários, empresas, logs

**Especificação:**
```jsx
<div className="overflow-x-auto rounded-2xl border-2 border-gray-200 dark:border-gray-800">
  <table className="w-full">
    <thead className="bg-gray-50 dark:bg-gray-800/50 border-b-2 border-gray-200 dark:border-gray-800">
      <tr>
        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
          Nome
        </th>
        {/* ... */}
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
      <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
        <td className="px-6 py-4 whitespace-nowrap">
          {/* Cell content */}
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

**Estados:**
- **Hover Row:** `hover:bg-gray-50 dark:hover:bg-gray-800/30`
- **Selected Row:** `bg-purple-50 dark:bg-purple-900/20`
- **Loading:** Skeleton rows
- **Empty:** EmptyState component

---

### 5. Modal (Base)

**Uso:** Detalhes de usuário, empresa, edição

**Especificação:**
```jsx
<div
  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
>
  <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border-2 border-gray-200 dark:border-gray-800 shadow-2xl">
    {/* Header */}
    <div className="p-6 border-b-2 border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
      <h2 id="modal-title" className="text-2xl font-bold text-gray-900 dark:text-white">
        Detalhes do Usuário
      </h2>
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
        aria-label="Fechar modal"
      >
        <FaTimes className="w-5 h-5" />
      </button>
    </div>

    {/* Content */}
    <div className="p-6">
      {/* Tabs ou conteúdo direto */}
    </div>

    {/* Footer (opcional) */}
    <div className="p-6 border-t-2 border-gray-200 dark:border-gray-800 sticky bottom-0 bg-white dark:bg-gray-900">
      <div className="flex gap-3 justify-end">
        <button className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
          Cancelar
        </button>
        <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700">
          Salvar
        </button>
      </div>
    </div>
  </div>
</div>
```

**Acessibilidade:**
- ✅ `role="dialog"`
- ✅ `aria-modal="true"`
- ✅ `aria-labelledby` aponta para título
- ✅ Focus trap (primeiro elemento focável ao abrir)
- ✅ Fecha com Esc
- ✅ Restaura foco ao fechar

---

### 6. Tab Navigation

**Uso:** Navegação dentro de modais (UserModal, CompanyModal)

**Especificação:**
```jsx
<div className="flex gap-2 border-b-2 border-gray-200 dark:border-gray-800">
  <button
    className={`px-4 py-3 font-semibold transition-all ${
      activeTab === 'info'
        ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400 -mb-[2px]'
        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
    }`}
    onClick={() => setActiveTab('info')}
  >
    <FaUser className="inline-block w-4 h-4 mr-2" />
    Informações
  </button>
  {/* ... outras tabs */}
</div>
```

**Estados:**
- **Ativa:** Border bottom purple-600, texto purple-600
- **Inativa:** Texto gray-600, sem border
- **Hover (inativa):** Texto gray-900

---

### 7. SearchInput

**Uso:** Busca de usuários, empresas

**Especificação:**
```jsx
<div className="relative">
  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
  <input
    type="text"
    placeholder="Buscar por nome, email ou CPF..."
    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
  {searchTerm && (
    <button
      onClick={() => setSearchTerm('')}
      className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
    >
      <FaTimes className="w-4 h-4 text-gray-400" />
    </button>
  )}
</div>
```

**Estados:**
- **Default:** `border-gray-200`
- **Focus:** `border-purple-500 ring-2 ring-purple-500/20`
- **Error:** `border-red-500 ring-2 ring-red-500/20`
- **Success:** `border-emerald-500 ring-2 ring-emerald-500/20`

---

### 8. FilterBar

**Uso:** Filtros de plano, status, tipo

**Especificação:**
```jsx
<div className="flex flex-wrap gap-3">
  <select
    className="px-4 py-2 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-lg text-sm font-medium text-gray-900 dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none"
    value={filterPlano}
    onChange={(e) => setFilterPlano(e.target.value)}
  >
    <option value="todos">Todos os planos</option>
    <option value="free">Free</option>
    <option value="starter">Starter</option>
    <option value="professional">Professional</option>
    <option value="enterprise">Enterprise</option>
  </select>

  <select
    className="px-4 py-2 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-lg text-sm font-medium text-gray-900 dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none"
    value={filterStatus}
    onChange={(e) => setFilterStatus(e.target.value)}
  >
    <option value="todos">Todos os status</option>
    <option value="active">Ativos</option>
    <option value="inactive">Inativos</option>
    <option value="pending">Pendentes</option>
  </select>

  {/* Badge count */}
  <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
    <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
      {filteredCount} resultados
    </span>
  </div>

  {/* Clear filters */}
  {(filterPlano !== 'todos' || filterStatus !== 'todos') && (
    <button
      onClick={clearFilters}
      className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white underline"
    >
      Limpar filtros
    </button>
  )}
</div>
```

---

### 9. EmptyState

**Uso:** Quando não há resultados

**Especificação:**
```jsx
<div className="flex flex-col items-center justify-center py-16">
  <div className="w-24 h-24 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
    <FaIcon className="w-12 h-12 text-gray-400" />
  </div>
  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
    Nenhum resultado encontrado
  </h3>
  <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
    Não encontramos nenhum usuário com os filtros aplicados. Tente ajustar sua busca.
  </p>
  <button
    onClick={clearFilters}
    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-bold hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg shadow-purple-500/30"
  >
    Limpar filtros
  </button>
</div>
```

---

## 🆕 Novas Funcionalidades

### 1. Sistema de Upload de Logo

**Localização:** Sistema > Configurações > Branding

**Componente:** `SettingsTab/BrandingSettings.jsx`

**UI:**
```jsx
<div className="space-y-6">
  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
    Logo da Plataforma
  </h3>

  {/* Preview + Upload */}
  <div className="flex items-start gap-6">
    {/* Preview Box */}
    <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 relative overflow-hidden group">
      {platformLogo ? (
        <>
          <img
            src={platformLogo}
            alt="Logo da Plataforma"
            className="max-w-full max-h-full object-contain"
          />
          {/* Overlay com ações */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              onClick={() => logoInputRef.current.click()}
              className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all"
              aria-label="Alterar logo"
            >
              <FaEdit className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={handleRemoveLogo}
              className="p-2 bg-red-500/80 backdrop-blur-sm rounded-lg hover:bg-red-600 transition-all"
              aria-label="Remover logo"
            >
              <FaTrash className="w-5 h-5 text-white" />
            </button>
          </div>
        </>
      ) : (
        <div className="text-center p-4">
          <FaImage className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-xs text-gray-500">Nenhuma logo</p>
        </div>
      )}
    </div>

    {/* Upload Controls */}
    <div className="flex-1 space-y-4">
      <div>
        <input
          type="file"
          accept="image/png,image/jpeg,image/svg+xml"
          onChange={handleLogoUpload}
          className="hidden"
          ref={logoInputRef}
          id="logo-upload"
        />
        <button
          onClick={() => logoInputRef.current.click()}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-bold hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg shadow-purple-500/30 flex items-center gap-2"
        >
          <FaUpload className="w-5 h-5" />
          Fazer Upload
        </button>
      </div>

      {/* Validações */}
      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
        <p className="flex items-center gap-2">
          <FaCheckCircle className="w-4 h-4 text-emerald-500" />
          Formatos: PNG, JPG, SVG
        </p>
        <p className="flex items-center gap-2">
          <FaCheckCircle className="w-4 h-4 text-emerald-500" />
          Tamanho máximo: 2MB
        </p>
        <p className="flex items-center gap-2">
          <FaCheckCircle className="w-4 h-4 text-emerald-500" />
          Dimensões recomendadas: 200x200px
        </p>
      </div>

      {/* Error message */}
      {uploadError && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg">
          <div className="flex items-start gap-3">
            <FaExclamationTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
            <div>
              <p className="font-semibold text-red-800 dark:text-red-300">Erro no upload</p>
              <p className="text-sm text-red-600 dark:text-red-400">{uploadError}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>

  {/* Live Preview */}
  <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-gray-200 dark:border-gray-800">
    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
      Preview em Tempo Real
    </p>
    <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
      {platformLogo && (
        <img src={platformLogo} alt="Preview" className="h-10 w-auto" />
      )}
      <span className="text-lg font-bold text-gray-900 dark:text-white">
        {platformName || 'Plataforma'}
      </span>
    </div>
  </div>
</div>
```

**Estados:**
- **Idle:** Preview vazio com ícone placeholder
- **Hover (com logo):** Overlay com botões de editar/remover
- **Uploading:** Spinner + progress bar
- **Success:** Animação de check + toast
- **Error:** Banner de erro inline

**Validações:**
```javascript
const validateLogo = (file) => {
  const maxSize = 2 * 1024 * 1024; // 2MB
  const allowedTypes = ['image/png', 'image/jpeg', 'image/svg+xml'];

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Formato não suportado. Use PNG, JPG ou SVG.' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'Arquivo muito grande. Máximo: 2MB.' };
  }

  return { valid: true };
};
```

---

### 2. Troca de Favicon

**UI:**
```jsx
<div className="space-y-6 mt-8">
  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
    Favicon
  </h3>

  <div className="flex items-start gap-6">
    {/* Preview Box (menor) */}
    <div className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center bg-white dark:bg-gray-900 relative">
      {favicon ? (
        <img src={favicon} alt="Favicon" className="w-10 h-10" />
      ) : (
        <FaGlobe className="w-8 h-8 text-gray-400" />
      )}
    </div>

    {/* Upload Controls */}
    <div className="flex-1 space-y-4">
      <div>
        <input
          type="file"
          accept=".ico,.png"
          onChange={handleFaviconUpload}
          className="hidden"
          ref={faviconInputRef}
          id="favicon-upload"
        />
        <button
          onClick={() => faviconInputRef.current.click()}
          className="px-6 py-3 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl font-bold hover:border-purple-500 transition-all flex items-center gap-2"
        >
          <FaUpload className="w-5 h-5" />
          Upload Favicon
        </button>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
        <p>Formatos: .ico, .png</p>
        <p>Dimensões: 16x16, 32x32 ou 64x64px</p>
      </div>
    </div>
  </div>

  {/* Preview na aba do navegador */}
  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-lg">
    <div className="flex items-start gap-3">
      <FaInfoCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
      <div className="text-sm text-blue-800 dark:text-blue-300">
        <p className="font-semibold mb-1">Dica:</p>
        <p>O favicon aparecerá na aba do navegador ao lado do título. Pode levar alguns minutos para atualizar após a troca.</p>
      </div>
    </div>
  </div>
</div>
```

**Implementação Técnica:**
```javascript
const updateFavicon = (faviconUrl) => {
  // Remove favicon antigo
  const existingFavicon = document.querySelector("link[rel*='icon']");
  if (existingFavicon) {
    existingFavicon.remove();
  }

  // Adiciona novo favicon
  const link = document.createElement('link');
  link.type = 'image/x-icon';
  link.rel = 'shortcut icon';
  link.href = faviconUrl;
  document.getElementsByTagName('head')[0].appendChild(link);

  // Salvar no backend
  await saveSettings({ favicon: faviconUrl });
};
```

---

### 3. Sistema de Banners

**Localização:** Sistema > Configurações > Banners

**UI - Lista de Banners:**
```jsx
<div className="space-y-6">
  <div className="flex items-center justify-between">
    <div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
        Banners e Avisos
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
        Gerencie banners que aparecerão para todos os usuários
      </p>
    </div>
    <button
      onClick={() => setShowAddBanner(true)}
      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-bold hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg shadow-purple-500/30 flex items-center gap-2"
    >
      <FaPlus className="w-5 h-5" />
      Adicionar Banner
    </button>
  </div>

  {/* Lista de Banners */}
  {banners.length === 0 ? (
    <EmptyState
      icon={FaBell}
      title="Nenhum banner criado"
      description="Crie banners para exibir avisos importantes para seus usuários"
      action={{
        label: 'Criar primeiro banner',
        onClick: () => setShowAddBanner(true)
      }}
    />
  ) : (
    <div className="space-y-4">
      {banners.map(banner => (
        <BannerCard
          key={banner.id}
          banner={banner}
          onEdit={() => handleEditBanner(banner)}
          onDelete={() => handleDeleteBanner(banner.id)}
          onToggle={() => handleToggleBanner(banner.id)}
        />
      ))}
    </div>
  )}
</div>
```

**BannerCard Component:**
```jsx
const BannerCard = ({ banner, onEdit, onDelete, onToggle }) => {
  const typeColors = {
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-800 dark:text-blue-300',
      icon: FaInfoCircle
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-200 dark:border-amber-800',
      text: 'text-amber-800 dark:text-amber-300',
      icon: FaExclamationTriangle
    },
    success: {
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      border: 'border-emerald-200 dark:border-emerald-800',
      text: 'text-emerald-800 dark:text-emerald-300',
      icon: FaCheckCircle
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-800 dark:text-red-300',
      icon: FaTimes
    }
  };

  const { bg, border, text, icon: Icon } = typeColors[banner.type];

  return (
    <div className={`p-6 rounded-2xl border-2 ${border} ${bg}`}>
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${text}`} />
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              {banner.title && (
                <h4 className={`font-bold ${text} mb-1`}>{banner.title}</h4>
              )}
              <p className={text}>{banner.message}</p>
            </div>

            {/* Toggle Active */}
            <button
              onClick={onToggle}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                banner.active
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              {banner.active ? 'Ativo' : 'Inativo'}
            </button>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap gap-3 text-xs text-gray-600 dark:text-gray-400 mt-3">
            <span className="flex items-center gap-1">
              <FaGlobe className="w-3 h-3" />
              {banner.display.pages[0] === 'all' ? 'Todas as páginas' : 'Páginas específicas'}
            </span>
            <span className="flex items-center gap-1">
              <FaMapPin className="w-3 h-3" />
              {banner.display.position === 'top' ? 'Topo' : 'Rodapé'}
            </span>
            {banner.display.dismissible && (
              <span className="flex items-center gap-1">
                <FaTimes className="w-3 h-3" />
                Dismissível
              </span>
            )}
            {banner.startDate && (
              <span className="flex items-center gap-1">
                <FaCalendar className="w-3 h-3" />
                {new Date(banner.startDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="p-2 hover:bg-white/50 dark:hover:bg-black/20 rounded-lg transition-all"
            aria-label="Editar banner"
          >
            <FaEdit className={`w-4 h-4 ${text}`} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all"
            aria-label="Excluir banner"
          >
            <FaTrash className="w-4 h-4 text-red-600 dark:text-red-400" />
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="mt-4 pt-4 border-t border-current opacity-30">
        <p className="text-xs font-semibold mb-2">Preview:</p>
        <BannerPreview data={banner} />
      </div>
    </div>
  );
};
```

**Modal de Criar/Editar Banner:**
```jsx
<Modal
  isOpen={showBannerModal}
  onClose={() => setShowBannerModal(false)}
  title={editingBanner ? 'Editar Banner' : 'Adicionar Banner'}
  maxWidth="max-w-4xl"
>
  <div className="space-y-6">
    {/* Tipo */}
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Tipo do Banner
      </label>
      <div className="grid grid-cols-4 gap-3">
        {['info', 'warning', 'success', 'error'].map(type => (
          <button
            key={type}
            onClick={() => setFormData({...formData, type})}
            className={`p-4 rounded-xl border-2 transition-all ${
              formData.type === type
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                : 'border-gray-200 dark:border-gray-800 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              {type === 'info' && <FaInfoCircle className="w-6 h-6 text-blue-500 mx-auto mb-2" />}
              {type === 'warning' && <FaExclamationTriangle className="w-6 h-6 text-amber-500 mx-auto mb-2" />}
              {type === 'success' && <FaCheckCircle className="w-6 h-6 text-emerald-500 mx-auto mb-2" />}
              {type === 'error' && <FaTimes className="w-6 h-6 text-red-500 mx-auto mb-2" />}
              <p className="text-sm font-semibold capitalize">{type}</p>
            </div>
          </button>
        ))}
      </div>
    </div>

    {/* Título (opcional) */}
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Título (opcional)
      </label>
      <input
        type="text"
        value={formData.title}
        onChange={(e) => setFormData({...formData, title: e.target.value})}
        placeholder="Ex: Manutenção programada"
        className="w-full px-4 py-3 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none"
      />
    </div>

    {/* Mensagem */}
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Mensagem <span className="text-red-500">*</span>
      </label>
      <textarea
        value={formData.message}
        onChange={(e) => setFormData({...formData, message: e.target.value})}
        placeholder="Escreva a mensagem que será exibida no banner..."
        rows={3}
        required
        className="w-full px-4 py-3 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none resize-none"
      />
      <p className="text-xs text-gray-500 mt-1">
        {formData.message.length}/200 caracteres
      </p>
    </div>

    {/* Botão de Ação */}
    <div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={formData.action.enabled}
          onChange={(e) => setFormData({
            ...formData,
            action: {...formData.action, enabled: e.target.checked}
          })}
          className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
        />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Adicionar botão de ação
        </span>
      </label>

      {formData.action.enabled && (
        <div className="ml-7 mt-3 space-y-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <input
            type="text"
            placeholder="Texto do botão (ex: Saiba mais)"
            value={formData.action.text}
            onChange={(e) => setFormData({
              ...formData,
              action: {...formData.action, text: e.target.value}
            })}
            className="w-full px-4 py-2 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-lg text-sm"
          />
          <input
            type="text"
            placeholder="Link (URL ou rota, ex: /subscription)"
            value={formData.action.link}
            onChange={(e) => setFormData({
              ...formData,
              action: {...formData.action, link: e.target.value}
            })}
            className="w-full px-4 py-2 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-lg text-sm"
          />
        </div>
      )}
    </div>

    {/* Configurações de Exibição */}
    <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl space-y-4">
      <h4 className="font-bold text-gray-900 dark:text-white">
        Configurações de Exibição
      </h4>

      <div className="grid grid-cols-2 gap-4">
        {/* Páginas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Exibir em
          </label>
          <select
            value={formData.display.pages[0]}
            onChange={(e) => setFormData({
              ...formData,
              display: {...formData.display, pages: [e.target.value]}
            })}
            className="w-full px-4 py-2 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-lg text-sm"
          >
            <option value="all">Todas as páginas</option>
            <option value="dashboard">Apenas Dashboard</option>
            <option value="specific">Páginas específicas...</option>
          </select>
        </div>

        {/* Posição */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Posição
          </label>
          <select
            value={formData.display.position}
            onChange={(e) => setFormData({
              ...formData,
              display: {...formData.display, position: e.target.value}
            })}
            className="w-full px-4 py-2 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-lg text-sm"
          >
            <option value="top">Topo da página</option>
            <option value="bottom">Rodapé da página</option>
          </select>
        </div>
      </div>

      {/* Checkboxes */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.display.dismissible}
            onChange={(e) => setFormData({
              ...formData,
              display: {...formData.display, dismissible: e.target.checked}
            })}
            className="w-4 h-4 rounded border-gray-300 text-purple-600"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Permitir que usuários fechem o banner
          </span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.display.autoHide}
            onChange={(e) => setFormData({
              ...formData,
              display: {...formData.display, autoHide: e.target.checked}
            })}
            className="w-4 h-4 rounded border-gray-300 text-purple-600"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Ocultar automaticamente após
          </span>
        </label>

        {formData.display.autoHide && (
          <div className="ml-6 flex items-center gap-2">
            <input
              type="number"
              value={formData.display.autoHideDelay / 1000}
              onChange={(e) => setFormData({
                ...formData,
                display: {...formData.display, autoHideDelay: e.target.value * 1000}
              })}
              min={1}
              max={30}
              className="w-20 px-3 py-1 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-lg text-sm"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">segundos</span>
          </div>
        )}
      </div>
    </div>

    {/* Agendamento */}
    <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl space-y-4">
      <h4 className="font-bold text-gray-900 dark:text-white">
        Agendamento (opcional)
      </h4>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Data de início
          </label>
          <input
            type="datetime-local"
            value={formData.startDate || ''}
            onChange={(e) => setFormData({...formData, startDate: e.target.value})}
            className="w-full px-4 py-2 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Data de término
          </label>
          <input
            type="datetime-local"
            value={formData.endDate || ''}
            onChange={(e) => setFormData({...formData, endDate: e.target.value})}
            className="w-full px-4 py-2 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-lg text-sm"
          />
        </div>
      </div>
      <p className="text-xs text-gray-500">
        Deixe em branco para exibir indefinidamente
      </p>
    </div>

    {/* Preview */}
    <div>
      <h4 className="font-bold text-gray-900 dark:text-white mb-3">
        Preview
      </h4>
      <BannerPreview data={formData} />
    </div>

    {/* Actions */}
    <div className="flex gap-3 justify-end pt-6 border-t-2 border-gray-200 dark:border-gray-800">
      <button
        onClick={() => setShowBannerModal(false)}
        className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
      >
        Cancelar
      </button>
      <button
        onClick={handleSaveBanner}
        disabled={!formData.message}
        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-bold hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {editingBanner ? 'Salvar Alterações' : 'Criar Banner'}
      </button>
    </div>
  </div>
</Modal>
```

**Banner Component (Exibição):**
```jsx
const Banner = ({ banner }) => {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (banner.display.autoHide) {
      const timer = setTimeout(() => {
        setDismissed(true);
      }, banner.display.autoHideDelay);
      return () => clearTimeout(timer);
    }
  }, [banner]);

  // Não exibir se foi dismissed
  if (dismissed) return null;

  // Verificar agendamento
  const now = new Date();
  if (banner.startDate && new Date(banner.startDate) > now) return null;
  if (banner.endDate && new Date(banner.endDate) < now) return null;

  const typeConfig = {
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-800 dark:text-blue-200',
      icon: FaInfoCircle
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-200 dark:border-amber-800',
      text: 'text-amber-800 dark:text-amber-200',
      icon: FaExclamationTriangle
    },
    success: {
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      border: 'border-emerald-200 dark:border-emerald-800',
      text: 'text-emerald-800 dark:text-emerald-200',
      icon: FaCheckCircle
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-800 dark:text-red-200',
      icon: FaTimes
    }
  };

  const { bg, border, text, icon: Icon } = typeConfig[banner.type];

  return (
    <div
      className={`border-l-4 p-4 ${bg} ${border} relative animate-slide-down`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0">
          <Icon className={`w-6 h-6 ${text}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {banner.title && (
            <h4 className={`font-bold ${text} mb-1`}>{banner.title}</h4>
          )}
          <p className={`${text} text-sm`}>{banner.message}</p>

          {banner.action.enabled && (
            <button
              onClick={() => window.location.href = banner.action.link}
              className={`mt-2 underline font-semibold ${text} hover:opacity-80 transition-opacity`}
            >
              {banner.action.text}
            </button>
          )}
        </div>

        {/* Close Button */}
        {banner.display.dismissible && (
          <button
            onClick={() => setDismissed(true)}
            className={`flex-shrink-0 ${text} opacity-60 hover:opacity-100 transition-opacity`}
            aria-label="Fechar banner"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};
```

---

### 4. Color Picker para Tema

**Localização:** Sistema > Configurações > Personalização

**UI:**
```jsx
<div className="space-y-8">
  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
    Personalização de Cores
  </h3>

  {/* Cor Primária */}
  <div className="space-y-4">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
      Cor Primária
    </label>

    <div className="flex items-center gap-4">
      {/* Color Picker */}
      <div className="relative">
        <input
          type="color"
          value={themeColors.primary}
          onChange={(e) => updateThemeColor('primary', e.target.value)}
          className="w-16 h-16 rounded-xl cursor-pointer border-2 border-gray-200 dark:border-gray-800"
        />
      </div>

      {/* Hex Input */}
      <div className="flex-1">
        <input
          type="text"
          value={themeColors.primary}
          onChange={(e) => updateThemeColor('primary', e.target.value)}
          placeholder="#9333ea"
          className="w-full px-4 py-3 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-xl font-mono text-gray-900 dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none"
        />
        <p className="text-xs text-gray-500 mt-1">
          Formato: #RRGGBB
        </p>
      </div>

      {/* Reset Button */}
      <button
        onClick={() => resetColor('primary')}
        className="px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
      >
        Resetar
      </button>
    </div>

    {/* Preview Swatch */}
    <div className="space-y-2">
      <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
        Preview:
      </p>
      <div className="grid grid-cols-5 gap-2">
        {['50', '100', '500', '600', '900'].map(shade => (
          <div key={shade} className="space-y-1">
            <div
              className="h-16 rounded-lg"
              style={{ backgroundColor: generateShade(themeColors.primary, shade) }}
            />
            <p className="text-xs text-center text-gray-600 dark:text-gray-400">
              {shade}
            </p>
          </div>
        ))}
      </div>
    </div>
  </div>

  {/* Gradiente de Botões */}
  <div className="space-y-4">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
      Gradiente de Botões
    </label>

    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={gradientStart}
          onChange={(e) => setGradientStart(e.target.value)}
          className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-200 dark:border-gray-800"
        />
        <span className="text-gray-400">→</span>
        <input
          type="color"
          value={gradientEnd}
          onChange={(e) => setGradientEnd(e.target.value)}
          className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-200 dark:border-gray-800"
        />
      </div>

      <button
        onClick={() => {
          setGradientStart('#a855f7');
          setGradientEnd('#9333ea');
        }}
        className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all text-sm"
      >
        Resetar
      </button>
    </div>

    {/* Preview Button */}
    <div>
      <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
        Preview:
      </p>
      <button
        className="px-6 py-3 text-white rounded-xl font-bold shadow-lg transition-all hover:scale-105"
        style={{
          background: `linear-gradient(to right, ${gradientStart}, ${gradientEnd})`
        }}
      >
        Botão de Exemplo
      </button>
    </div>
  </div>

  {/* Aplicar Tema */}
  <div className="flex gap-3 pt-6 border-t-2 border-gray-200 dark:border-gray-800">
    <button
      onClick={applyTheme}
      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-bold hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg shadow-purple-500/30 flex items-center gap-2"
    >
      <FaPalette className="w-5 h-5" />
      Aplicar Tema
    </button>
    <button
      onClick={previewTheme}
      className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
    >
      Visualizar Preview
    </button>
  </div>

  {/* Warning */}
  <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 rounded-lg">
    <div className="flex items-start gap-3">
      <FaExclamationTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
      <div className="text-sm text-amber-800 dark:text-amber-300">
        <p className="font-semibold mb-1">Atenção:</p>
        <p>Alterações de cor afetarão toda a plataforma. Certifique-se de testar em diferentes páginas e modos (claro/escuro).</p>
      </div>
    </div>
  </div>
</div>
```

**Implementação Técnica:**
```javascript
// Atualizar CSS variables
const applyTheme = async () => {
  const root = document.documentElement;

  // Aplicar cores primárias
  root.style.setProperty('--color-primary', themeColors.primary);
  root.style.setProperty('--gradient-start', gradientStart);
  root.style.setProperty('--gradient-end', gradientEnd);

  // Gerar shades automaticamente
  ['50', '100', '500', '600', '700', '900'].forEach(shade => {
    const color = generateShade(themeColors.primary, shade);
    root.style.setProperty(`--color-primary-${shade}`, color);
  });

  // Salvar no backend
  await saveSettings({
    theme: {
      primary: themeColors.primary,
      gradient: { start: gradientStart, end: gradientEnd }
    }
  });

  // Toast de sucesso
  showToast('Tema aplicado com sucesso!', 'success');
};

// Gerar shades a partir de uma cor base
const generateShade = (baseColor, shade) => {
  // Implementar lógica de geração de shades
  // Pode usar biblioteca como polished ou chroma-js
  return color; // Retornar cor gerada
};
```

---

## 🔄 Estados de UI

### Loading States

#### 1. Skeleton Loading (StatCard)
```jsx
<div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-800 animate-pulse">
  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-xl mb-4" />
  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mb-2" />
  <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
</div>
```

#### 2. Skeleton Loading (Table Row)
```jsx
<tr className="animate-pulse">
  <td className="px-6 py-4">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-full" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-32" />
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-24" />
      </div>
    </div>
  </td>
  <td className="px-6 py-4">
    <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-full w-20" />
  </td>
  {/* ... */}
</tr>
```

#### 3. Spinner (Inline)
```jsx
<div className="flex items-center justify-center gap-2">
  <svg
    className="animate-spin h-5 w-5 text-purple-600"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
  <span className="text-sm text-gray-600 dark:text-gray-400">Carregando...</span>
</div>
```

#### 4. Progress Bar (Upload)
```jsx
<div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
  <div
    className="bg-gradient-to-r from-purple-500 to-purple-600 h-full transition-all duration-300"
    style={{ width: `${uploadProgress}%` }}
  />
</div>
<p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
  {uploadProgress}% concluído
</p>
```

### Success States

#### 1. Toast Notification
```jsx
<div className="fixed top-4 right-4 z-50 animate-slide-in-right">
  <div className="bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-emerald-500 rounded-lg p-4 shadow-lg max-w-md">
    <div className="flex items-start gap-3">
      <FaCheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold text-emerald-800 dark:text-emerald-300">
          Sucesso!
        </p>
        <p className="text-sm text-emerald-700 dark:text-emerald-400">
          {message}
        </p>
      </div>
      <button
        onClick={onClose}
        className="ml-auto text-emerald-600 hover:text-emerald-700 transition-colors"
      >
        <FaTimes className="w-4 h-4" />
      </button>
    </div>
  </div>
</div>
```

#### 2. Success Banner (Inline)
```jsx
<div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-emerald-500 rounded-lg">
  <div className="flex items-start gap-3">
    <FaCheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
    <div>
      <p className="font-semibold text-emerald-800 dark:text-emerald-300">
        Logo atualizada com sucesso
      </p>
      <p className="text-sm text-emerald-700 dark:text-emerald-400">
        A nova logo será exibida em toda a plataforma.
      </p>
    </div>
  </div>
</div>
```

### Error States

#### 1. Error Toast
```jsx
<div className="fixed top-4 right-4 z-50 animate-slide-in-right">
  <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg p-4 shadow-lg max-w-md">
    <div className="flex items-start gap-3">
      <FaExclamationTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold text-red-800 dark:text-red-300">
          Erro ao fazer upload
        </p>
        <p className="text-sm text-red-700 dark:text-red-400">
          {errorMessage}
        </p>
      </div>
      <button onClick={onClose} className="ml-auto text-red-600 hover:text-red-700">
        <FaTimes className="w-4 h-4" />
      </button>
    </div>
  </div>
</div>
```

#### 2. Inline Error (Form Field)
```jsx
<div className="space-y-1">
  <input
    type="text"
    className="w-full px-4 py-3 border-2 border-red-500 rounded-xl focus:ring-2 focus:ring-red-500/20 outline-none"
    aria-invalid="true"
    aria-describedby="error-message"
  />
  <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
    <FaExclamationTriangle className="w-4 h-4" />
    <p id="error-message" className="text-sm">
      Este campo é obrigatório
    </p>
  </div>
</div>
```

### Empty States

**Ver componente EmptyState acima.**

---

## ✨ Micro-interações

### 1. Button Hover & Active
```css
/* Hover */
.button-primary:hover {
  transform: scale(1.02);
  shadow: 0 20px 25px rgba(147, 51, 234, 0.3);
}

/* Active (pressed) */
.button-primary:active {
  transform: scale(0.98);
}

/* Focus (keyboard) */
.button-primary:focus-visible {
  ring: 2px solid rgb(147, 51, 234);
  ring-offset: 2px;
}
```

### 2. Card Hover
```css
.card:hover {
  border-color: rgb(216, 180, 254); /* purple-200 */
  transform: translateY(-2px);
  shadow: 0 10px 15px rgba(0,0,0,0.1);
}
```

### 3. Modal Enter/Exit Animation
```css
/* Backdrop */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-backdrop {
  animation: fade-in 150ms ease-out;
}

/* Modal */
@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-content {
  animation: scale-in 150ms ease-out;
}
```

### 4. Toast Slide In
```css
@keyframes slide-in-right {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.toast {
  animation: slide-in-right 200ms ease-out;
}
```

### 5. Tab Transition
```css
.tab-content {
  animation: fade-in 200ms ease-out;
}
```

### 6. Ripple Effect (Material Design)
```jsx
const Ripple = ({ x, y }) => (
  <span
    className="absolute bg-white/30 rounded-full animate-ripple"
    style={{
      left: x,
      top: y,
      width: 0,
      height: 0,
    }}
  />
);

// CSS
@keyframes ripple {
  to {
    width: 200px;
    height: 200px;
    opacity: 0;
  }
}
```

---

## ♿ Acessibilidade (WCAG 2.1 AA)

### Contraste de Cores

#### Mínimos Exigidos
- **Texto normal (< 18px):** 4.5:1
- **Texto grande (≥ 18px ou bold ≥ 14px):** 3:1
- **Componentes de UI:** 3:1

#### Validação
```javascript
// Exemplo de validação de contraste
const getContrast = (color1, color2) => {
  // Implementar algoritmo WCAG
  // https://www.w3.org/TR/WCAG21/#contrast-minimum
};

// Purple-600 (#9333ea) sobre branco (#ffffff)
const contrast = getContrast('#9333ea', '#ffffff'); // ~4.6:1 ✅

// Purple-400 (#c084fc) sobre branco
const contrast2 = getContrast('#c084fc', '#ffffff'); // ~2.8:1 ❌ (não passar)
```

### Navegação por Teclado

#### Tab Order
```jsx
// Ordem lógica de tabulação
<Modal>
  <button tabIndex={1}>Fechar</button> {/* Primeiro elemento focável */}
  <input tabIndex={2} />
  <button tabIndex={3}>Salvar</button>
  <button tabIndex={4}>Cancelar</button>
</Modal>
```

#### Atalhos de Teclado
- **Esc:** Fechar modal/dropdown
- **Enter:** Submeter formulário, abrir link
- **Space:** Selecionar checkbox/radio
- **Arrow Keys:** Navegar entre tabs, options
- **Tab:** Próximo elemento focável
- **Shift + Tab:** Elemento focável anterior

### ARIA Labels

#### Botões sem Texto
```jsx
<button
  onClick={handleDelete}
  aria-label="Excluir usuário"
  className="p-2 hover:bg-red-100 rounded-lg"
>
  <FaTrash className="w-4 h-4 text-red-600" aria-hidden="true" />
</button>
```

#### Status Dinâmicos
```jsx
<div role="status" aria-live="polite">
  {isLoading ? 'Carregando usuários...' : `${users.length} usuários carregados`}
</div>
```

#### Formulários
```jsx
<label htmlFor="user-email" className="block text-sm font-medium mb-2">
  Email
</label>
<input
  id="user-email"
  type="email"
  aria-required="true"
  aria-invalid={!!error}
  aria-describedby={error ? 'email-error' : undefined}
/>
{error && (
  <p id="email-error" role="alert" className="text-sm text-red-600">
    {error}
  </p>
)}
```

### Focus Visible

```css
/* Focus ring para navegação por teclado */
button:focus-visible,
input:focus-visible,
select:focus-visible,
a:focus-visible {
  outline: 2px solid rgb(147, 51, 234);
  outline-offset: 2px;
}

/* Remover outline para cliques de mouse */
button:focus:not(:focus-visible) {
  outline: none;
}
```

### Screen Reader Only Text

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

```jsx
<button>
  <FaTrash className="w-4 h-4" aria-hidden="true" />
  <span className="sr-only">Excluir usuário</span>
</button>
```

---

## 🛠 Especificações Técnicas

### Breakpoints Responsivos

```javascript
const breakpoints = {
  sm: '640px',  // Mobile landscape
  md: '768px',  // Tablet portrait
  lg: '1024px', // Tablet landscape / small desktop
  xl: '1280px', // Desktop
  '2xl': '1536px' // Large desktop
};
```

### Estrutura de Componentes

```
src/pages/Admin/components/
├── Shared/
│   ├── StatusBadge.jsx          # Badge de status (active, inactive, etc)
│   ├── PlanBadge.jsx             # Badge de plano (free, starter, etc)
│   ├── StatCard.jsx              # Card de métrica do dashboard
│   ├── DataTable.jsx             # Tabela genérica
│   ├── SearchInput.jsx           # Input de busca com ícone
│   ├── FilterBar.jsx             # Barra de filtros
│   ├── EmptyState.jsx            # Estado vazio
│   ├── Modal.jsx                 # Modal base (já existe)
│   ├── TabNavigation.jsx         # Navegação por tabs
│   ├── ThemeToggle.jsx           # Botão de alternar tema
│   └── Toast.jsx                 # Notificação toast
├── System/SettingsTab/
│   ├── BrandingSettings.jsx      # Logo, nome, favicon
│   ├── BannersManagement.jsx     # Sistema de banners
│   ├── BannerModal.jsx           # Modal de criar/editar banner
│   ├── BannerCard.jsx            # Card de banner na lista
│   ├── BannerPreview.jsx         # Preview do banner
│   ├── ThemeCustomization.jsx    # Color picker e tema
│   └── ColorPicker.jsx           # Componente de picker de cor
└── Banner.jsx                    # Banner exibido aos usuários (src/components/)
```

### Animações (Tailwind CSS)

Adicionar ao `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 150ms ease-out',
        'scale-in': 'scaleIn 150ms ease-out',
        'slide-in-right': 'slideInRight 200ms ease-out',
        'slide-down': 'slideDown 200ms ease-out',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ripple': 'ripple 600ms ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        ripple: {
          '0%': { width: '0', height: '0', opacity: '0.5' },
          '100%': { width: '200px', height: '200px', opacity: '0' },
        },
      },
    },
  },
};
```

### Performance Optimizations

```javascript
// 1. React.memo para componentes pesados
export default React.memo(UsersTable, (prevProps, nextProps) => {
  return prevProps.users === nextProps.users;
});

// 2. useMemo para computações caras
const filteredUsers = useMemo(() => {
  return users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
}, [users, searchTerm]);

// 3. useCallback para funções passadas como props
const handleUserClick = useCallback((userId) => {
  setSelectedUser(users.find(u => u.id === userId));
  setShowUserModal(true);
}, [users]);

// 4. React.lazy para modais
const UserModal = React.lazy(() => import('./UserModal'));
const CompanyModal = React.lazy(() => import('./CompanyModal'));

// Uso
<Suspense fallback={<LoadingSpinner />}>
  {showUserModal && <UserModal user={selectedUser} />}
</Suspense>
```

---

## 📊 Checklist de Implementação

### Fase 1: Componentes Base (Dia 1 - 4h)
- [ ] StatusBadge.jsx (reutilizar existente)
- [ ] PlanBadge.jsx (novo)
- [ ] StatCard.jsx com skeleton
- [ ] EmptyState.jsx
- [ ] Toast.jsx
- [ ] TabNavigation.jsx
- [ ] ColorPicker.jsx

### Fase 2: Sistema de Branding (Dia 1-2 - 6h)
- [ ] BrandingSettings.jsx
- [ ] Upload de logo com validação
- [ ] Preview em tempo real
- [ ] Upload de favicon
- [ ] Atualização dinâmica do DOM
- [ ] API endpoints (backend)

### Fase 3: Sistema de Banners (Dia 2-3 - 8h)
- [ ] BannersManagement.jsx
- [ ] BannerModal.jsx (criar/editar)
- [ ] BannerCard.jsx (lista)
- [ ] BannerPreview.jsx
- [ ] Banner.jsx (exibição)
- [ ] Agendamento de banners
- [ ] API endpoints CRUD

### Fase 4: Tema Customizado (Dia 3 - 4h)
- [ ] ThemeCustomization.jsx
- [ ] Color picker component
- [ ] Preview de gradientes
- [ ] Atualização de CSS variables
- [ ] Persistência no backend

### Fase 5: Animações & Micro-interações (Dia 4 - 3h)
- [ ] Configurar keyframes no Tailwind
- [ ] Aplicar animações em modais
- [ ] Toast animations
- [ ] Hover states
- [ ] Focus states

### Fase 6: Acessibilidade (Dia 4 - 3h)
- [ ] Validar contraste de cores
- [ ] ARIA labels em todos os componentes
- [ ] Navegação por teclado
- [ ] Focus trap em modais
- [ ] Screen reader testing

### Fase 7: Testes (Dia 5 - 4h)
- [ ] Testes de componentes (Jest + RTL)
- [ ] Testes de acessibilidade (axe-core)
- [ ] Testes de responsividade
- [ ] Validação dark mode
- [ ] Testes de performance

---

## 🔗 Referências

- [[Admin Refactoring Plan]] - Plano de refatoração completo
- [[Admin New Features]] - Funcionalidades detalhadas
- [[Story 4.1 - Superadmin Complete Overhaul]]
- [WCAG 2.1 AA Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Material Design - Motion](https://m3.material.io/styles/motion/overview)
- [Inclusive Components](https://inclusive-components.design/)

---

**Última Atualização:** 2026-02-25
**Responsável:** @ux-design-expert
**Revisores:** @architect, @dev, @qa
**Status:** ✅ Pronto para Implementação
