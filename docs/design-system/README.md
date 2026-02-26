# Design System - Plataforma CRM

**Versão:** 1.0.0
**Última Atualização:** 23 de Fevereiro de 2026
**Stack:** Shadcn UI + Radix UI + Tailwind CSS

---

## 🎨 Visão Geral

O Design System da Plataforma CRM é construído sobre Shadcn UI, fornecendo componentes acessíveis (WCAG 2.1 AA), reutilizáveis e consistentes com nosso tema purple.

### Princípios

1. **Acessibilidade First** - WCAG 2.1 AA em todos os componentes
2. **Consistência Visual** - Tema purple unificado
3. **Reutilizabilidade** - Componentes DRY e composáveis
4. **Performance** - Otimizados e tree-shakeable
5. **Developer Experience** - API simples e intuitiva

---

## 📦 Componentes Disponíveis

### Componentes Base (Shadcn UI)

Localizados em `src/components/ui/`:

1. **Button** - Botões com múltiplas variantes
2. **Input** - Inputs de texto e variações
3. **Select** - Dropdowns com busca
4. **Checkbox** - Checkboxes acessíveis
5. **Card** - Cards com header, content, footer
6. **Dialog** - Modais acessíveis
7. **Dropdown Menu** - Menus contextuais
8. **Badge** - Indicadores de status
9. **Switch** - Toggle switches
10. **Label** - Labels para formulários

### Componentes Customizados

Localizados em `src/components/custom/`:

1. **LoadingButton** - Button com loading state
2. **FormInput** - Input com label e validação
3. **StatusBadge** - Badge pré-configurado para status

---

## 🎨 Design Tokens

### Cores Primary (Purple Theme)

```css
--primary: 271 81% 56%           /* purple-600 #9333ea */
--primary-foreground: 0 0% 100%  /* white */
```

#### Paleta Purple Completa

| Token | Light | Dark | Uso |
|-------|-------|------|-----|
| purple-50 | #faf5ff | - | Backgrounds hover |
| purple-100 | #f3e8ff | - | Backgrounds leves |
| purple-500 | #a855f7 | - | Ações secundárias |
| purple-600 | #9333ea | #9333ea | **Principal** |
| purple-700 | #7e22ce | - | Hover states |
| purple-900 | #581c87 | - | Textos escuros |

### Cores Semânticas

| Cor | Uso | Light | Dark |
|-----|-----|-------|------|
| **Success** | Ações positivas | emerald-600 | emerald-400 |
| **Warning** | Alertas | amber-600 | amber-400 |
| **Error** | Erros | red-600 | red-400 |
| **Info** | Informações | sky-600 | sky-400 |

### Typography

```js
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif

fontSize:
  xs: 0.75rem (12px)
  sm: 0.875rem (14px)
  base: 1rem (16px)
  lg: 1.125rem (18px)
  xl: 1.25rem (20px)
  2xl: 1.5rem (24px)
  3xl: 1.875rem (30px)

fontWeight:
  normal: 400
  medium: 500
  semibold: 600
  bold: 700
```

### Spacing

Base: `4px` (Tailwind padrão)

```
1 = 4px
2 = 8px
3 = 12px
4 = 16px
6 = 24px
8 = 32px
12 = 48px
16 = 64px
```

### Border Radius

```css
--radius: 0.75rem (12px)
```

Variações:
- `rounded-sm` - 4px
- `rounded` - 6px
- `rounded-md` - 8px
- `rounded-lg` - 12px
- `rounded-xl` - 16px
- `rounded-2xl` - 24px

### Shadows

```css
--shadow-layered: 0 2px 4px rgba(0,0,0,0.02),
                  0 8px 16px rgba(0,0,0,0.04),
                  0 16px 32px rgba(0,0,0,0.06)

--shadow-primary: 0 10px 25px -5px rgba(139, 92, 246, 0.3)
```

---

## 📚 Guia de Uso

### Button

```jsx
import { Button } from '@/components/ui/button';

// Variantes
<Button variant="default">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>
<Button variant="link">Link</Button>

// Tamanhos
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">
  <IconComponent />
</Button>
```

### LoadingButton

```jsx
import LoadingButton from '@/components/custom/LoadingButton';

<LoadingButton
  loading={isSubmitting}
  loadingText="Salvando..."
  onClick={handleSubmit}
>
  Salvar
</LoadingButton>
```

### Input

```jsx
import { Input } from '@/components/ui/input';

<Input
  type="email"
  placeholder="seu@email.com"
  aria-label="Email"
/>
```

### FormInput

```jsx
import FormInput from '@/components/custom/FormInput';
import { FaEnvelope } from 'react-icons/fa';

<FormInput
  label="Email"
  type="email"
  placeholder="seu@email.com"
  icon={<FaEnvelope />}
  error={errors.email}
  required
  helperText="Nunca compartilharemos seu email"
/>
```

### StatusBadge

```jsx
import StatusBadge from '@/components/custom/StatusBadge';

<StatusBadge status="active">Ativo</StatusBadge>
<StatusBadge status="pending">Pendente</StatusBadge>
<StatusBadge status="error">Erro</StatusBadge>
```

### Dialog (Modal)

```jsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

<Dialog>
  <DialogTrigger asChild>
    <Button>Abrir Modal</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Título do Modal</DialogTitle>
      <DialogDescription>
        Descrição do modal aqui.
      </DialogDescription>
    </DialogHeader>
    <div>Conteúdo do modal</div>
    <DialogFooter>
      <Button variant="outline">Cancelar</Button>
      <Button>Confirmar</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Card

```jsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Título do Card</CardTitle>
    <CardDescription>Descrição breve</CardDescription>
  </CardHeader>
  <CardContent>
    Conteúdo principal do card
  </CardContent>
  <CardFooter>
    <Button>Ação</Button>
  </CardFooter>
</Card>
```

---

## ♿ Acessibilidade

Todos os componentes seguem WCAG 2.1 Nível AA:

- ✅ Contraste mínimo 4.5:1 (AA) ou 7:1 (AAA)
- ✅ Navegação completa por teclado
- ✅ Screen reader support
- ✅ Focus visible (purple-600, 3px outline)
- ✅ ARIA labels e roles apropriados

### Focus Management

```css
/* Foco global - purple theme */
*:focus-visible {
  outline: 3px solid #9333ea;
  outline-offset: 2px;
  border-radius: 4px;
}
```

### Keyboard Navigation

- `Tab` - Próximo elemento
- `Shift+Tab` - Elemento anterior
- `Enter` - Ativar botão/link
- `Space` - Ativar botão/checkbox
- `Esc` - Fechar modal/dropdown

---

## 🌙 Dark Mode

Todos os componentes suportam dark mode via classe `.dark`:

```jsx
<html className="dark">
  <!-- App content -->
</html>
```

Toggle dark mode:

```jsx
const toggleDarkMode = () => {
  document.documentElement.classList.toggle('dark');
};
```

---

## 🚀 Instalando Novos Componentes

Para adicionar mais componentes do Shadcn:

```bash
npx shadcn@latest add [component-name]
```

Exemplos:
```bash
npx shadcn@latest add avatar
npx shadcn@latest add tabs
npx shadcn@latest add alert
npx shadcn@latest add toast
```

---

## 📝 Contribuindo

### Criando Componentes Customizados

1. Use componentes Shadcn como base
2. Adicione funcionalidade específica
3. Mantenha acessibilidade WCAG AA
4. Documente props e exemplos
5. Adicione testes

Exemplo:

```jsx
// src/components/custom/MyComponent.jsx
import { Button } from '@/components/ui/button';

const MyComponent = ({ customProp, ...props }) => {
  return (
    <Button {...props}>
      {/* Custom functionality */}
    </Button>
  );
};

export default MyComponent;
```

---

## 📚 Recursos

- [Shadcn UI Docs](https://ui.shadcn.com/)
- [Radix UI Primitives](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Criado:** 2026-02-23
**Responsável:** Claude Code
**Versão:** 1.0.0
