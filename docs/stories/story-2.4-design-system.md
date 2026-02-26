# Story 2.4: Criar Design System (Shadcn UI)

**Epic:** [Resolução de Débitos Técnicos](epic-technical-debt.md)
**Story ID:** 2.4
**Prioridade:** P1 (ALTA)
**Estimativa:** 16h
**Status:** 🔄 Em Progresso

---

## 📋 Objetivo

Implementar um Design System completo usando Shadcn UI + Tailwind CSS, criando a fundação para componentes reutilizáveis consistentes.

---

## 👤 User Story

**Como** desenvolvedor,
**Quero** um design system consistente e reutilizável,
**Para** manter coerência visual e acelerar desenvolvimento de features.

---

## ✅ Critérios de Aceitação

### 1. Configuração Shadcn UI
- [ ] Shadcn UI CLI instalado
- [ ] Configuração inicial (components.json)
- [ ] Estrutura de diretórios (/components/ui)
- [ ] Suporte a dark mode configurado

### 2. Design Tokens
- [ ] Paleta de cores definida (purple theme mantido)
- [ ] Typography scale (font sizes, weights, line heights)
- [ ] Spacing scale (4px base)
- [ ] Border radius tokens
- [ ] Shadow tokens
- [ ] Documentado em design-tokens.md

### 3. Componentes Base Shadcn
- [ ] Button (variants: primary, secondary, outline, ghost)
- [ ] Input (text, email, password, number)
- [ ] Select (dropdown com busca)
- [ ] Checkbox
- [ ] Radio
- [ ] Switch (toggle)
- [ ] Badge (status indicators)
- [ ] Card (container reutilizável)
- [ ] Dialog (modal melhorado)
- [ ] Dropdown Menu

### 4. Tema Customizado
- [ ] Cores purple mantidas
- [ ] Dark mode consistente
- [ ] Focus states (purple-600, 3px outline)
- [ ] Hover states definidos
- [ ] Disabled states consistentes

### 5. Documentação
- [ ] Storybook OU doc simples em Markdown
- [ ] Exemplo de uso de cada componente
- [ ] Guia de contribuição
- [ ] Design guidelines

---

## 🎨 Design Tokens

### Colors (Purple Theme)

```js
colors: {
  primary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',  // purple-500
    600: '#9333ea',  // purple-600 (main)
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',
  },
  // ... outros tokens
}
```

### Typography

```js
fontSize: {
  xs: ['0.75rem', { lineHeight: '1rem' }],
  sm: ['0.875rem', { lineHeight: '1.25rem' }],
  base: ['1rem', { lineHeight: '1.5rem' }],
  lg: ['1.125rem', { lineHeight: '1.75rem' }],
  xl: ['1.25rem', { lineHeight: '1.75rem' }],
  '2xl': ['1.5rem', { lineHeight: '2rem' }],
  '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
}
```

---

## 🛠️ Implementação

### Fase 1: Setup Shadcn (3h)

```bash
# Instalar Shadcn CLI
npx shadcn@latest init

# Configurar components.json
# Instalar componentes base
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add select
npx shadcn@latest add checkbox
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add badge
npx shadcn@latest add switch
```

### Fase 2: Customização Purple Theme (4h)

- Atualizar tailwind.config.js com tokens
- Customizar Shadcn components para purple theme
- Garantir contraste WCAG AA (já alcançado na Story 1.1)
- Testar dark mode

### Fase 3: Componentes Customizados (5h)

Criar wrappers ou extensões:
- `<Button>` com loading state
- `<Input>` com error state e icon
- `<Select>` com busca integrada
- `<Modal>` baseado em Dialog (substitui atual)

### Fase 4: Documentação (4h)

- Criar `docs/design-system/`
- Documentar cada componente
- Screenshots ou exemplos visuais
- Guia de uso

---

## 📝 Tarefas

### Phase 1: Setup (3h)
- [ ] Instalar Shadcn UI
- [ ] Configurar components.json
- [ ] Instalar 10 componentes base
- [ ] Verificar compatibilidade com projeto

### Phase 2: Customização (4h)
- [ ] Atualizar tailwind.config.js (tokens)
- [ ] Customizar theme para purple
- [ ] Garantir acessibilidade (contraste)
- [ ] Testar dark mode

### Phase 3: Componentes (5h)
- [ ] Criar wrappers customizados
- [ ] Adicionar loading states
- [ ] Adicionar error states
- [ ] Migrar Modal atual para Dialog Shadcn

### Phase 4: Documentação (4h)
- [ ] Criar design-tokens.md
- [ ] Criar component-library.md
- [ ] Exemplos de uso
- [ ] Screenshots

---

## 🧪 Testes de Validação

```bash
# Visual: Verificar componentes renderizam corretamente
npm run dev

# Acessibilidade: Garantir WCAG AA
npm run test:a11y

# Responsividade: Testar mobile/tablet/desktop
# Manual com DevTools
```

---

## 📊 Definition of Done

- [ ] 10+ componentes Shadcn instalados
- [ ] Tema purple customizado aplicado
- [ ] Dark mode funcionando
- [ ] Acessibilidade WCAG AA mantida
- [ ] Documentação completa
- [ ] Pelo menos 3 componentes em uso na aplicação
- [ ] Zero regressões visuais

---

## 📁 Arquivos Criados/Modificados

### Criados
- [ ] `src/components/ui/` (10+ componentes Shadcn)
- [ ] `docs/design-system/design-tokens.md`
- [ ] `docs/design-system/component-library.md`
- [ ] `docs/design-system/usage-guide.md`

### Modificados
- [ ] `tailwind.config.js` (tokens customizados)
- [ ] `src/index.css` (variáveis CSS do Shadcn)
- [ ] `package.json` (dependências Shadcn)

---

## 🔗 Dependências

**Depende de:**
- Story 1.1 (Acessibilidade) - mantém WCAG AA
- Story 2.1 (Testes) - testa componentes

**Bloqueia:**
- Story 2.5 (Componentes Base) - usa design system

---

## 📚 Referências

- [Shadcn UI](https://ui.shadcn.com/)
- [Radix UI Primitives](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 📈 Progresso

**Status:** 🔄 Em Progresso
**Tempo Gasto:** 0h / 16h
**Última Atualização:** 2026-02-23

---

**Criado por:** Claude Code
**Data:** 2026-02-23
