# Design Tokens - Plataforma CRM

**Versão:** 1.0.0
**Última Atualização:** 23 de Fevereiro de 2026

---

## 🎨 Color System

### Primary Colors (Purple Theme)

| Token | Value | HSL | Usage |
|-------|-------|-----|-------|
| primary-50 | #faf5ff | 270 100% 98% | Hover muito leve |
| primary-100 | #f3e8ff | 270 100% 95% | Backgrounds leves |
| primary-200 | #e9d5ff | 271 91% 91% | Borders hover |
| primary-300 | #d8b4fe | 271 91% 85% | Disabled states |
| primary-400 | #c084fc | 271 91% 75% | Ações secundárias hover |
| primary-500 | #a855f7 | 271 81% 66% | Ações secundárias |
| **primary-600** | **#9333ea** | **271 81% 56%** | **COR PRINCIPAL** |
| primary-700 | #7e22ce | 271 77% 46% | Hover escuro |
| primary-800 | #6b21a8 | 272 73% 39% | Active state |
| primary-900 | #581c87 | 272 67% 32% | Textos escuros |

### Semantic Colors

#### Success (Green)

| Token | Value | HSL | Usage |
|-------|-------|-----|-------|
| success-50 | #ecfdf5 | 155 76% 96% | Success backgrounds |
| success-600 | #059669 | 162 93% 30% | Success actions (light) |
| success-700 | #047857 | 162 91% 25% | Success hover |
| success-400 (dark) | #34d399 | 156 72% 52% | Success text (dark mode) |

#### Warning (Amber)

| Token | Value | HSL | Usage |
|-------|-------|-----|-------|
| warning-50 | #fffbeb | 48 100% 96% | Warning backgrounds |
| warning-600 | #d97706 | 32 95% 44% | Warning actions (light) |
| warning-700 | #b45309 | 32 94% 37% | Warning hover |
| warning-400 (dark) | #fbbf24 | 45 93% 58% | Warning text (dark mode) |

#### Error (Red)

| Token | Value | HSL | Usage |
|-------|-------|-----|-------|
| error-50 | #fef2f2 | 0 86% 97% | Error backgrounds |
| error-600 | #dc2626 | 0 84% 51% | Error actions (light) |
| error-700 | #b91c1c | 0 84% 42% | Error hover |
| error-400 (dark) | #f87171 | 0 91% 71% | Error text (dark mode) |

#### Info (Sky)

| Token | Value | HSL | Usage |
|-------|-------|-----|-------|
| info-50 | #f0f9ff | 204 100% 97% | Info backgrounds |
| info-600 | #0284c7 | 199 89% 39% | Info actions (light) |
| info-700 | #0369a1 | 200 98% 32% | Info hover |
| info-400 (dark) | #38bdf8 | 199 95% 61% | Info text (dark mode) |

### Neutral Colors

#### Gray Scale

| Token | Value | HSL | Usage |
|-------|-------|-----|-------|
| gray-50 | #f9fafb | 220 9% 98% | Lightest backgrounds |
| gray-100 | #f3f4f6 | 220 9% 96% | Subtle backgrounds |
| gray-200 | #e5e7eb | 220 9% 91% | Borders light |
| gray-300 | #d1d5db | 214 14% 85% | Borders, disabled |
| gray-400 | #9ca3af | 214 12% 66% | Placeholders |
| gray-500 | #6b7280 | 217 11% 47% | Secondary text |
| gray-600 | #4b5563 | 215 14% 34% | Body text |
| gray-700 | #374151 | 217 19% 27% | Headings |
| gray-800 | #1f2937 | 215 28% 17% | Dark backgrounds |
| gray-900 | #111827 | 222 84% 5% | Darkest backgrounds |

---

## 📐 Typography

### Font Families

```css
--font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Font Sizes

| Token | Value (rem) | Value (px) | Line Height | Usage |
|-------|-------------|------------|-------------|-------|
| text-xs | 0.75rem | 12px | 1rem | Captions, labels |
| text-sm | 0.875rem | 14px | 1.25rem | Secondary text |
| text-base | 1rem | 16px | 1.5rem | Body text |
| text-lg | 1.125rem | 18px | 1.75rem | Subheadings |
| text-xl | 1.25rem | 20px | 1.75rem | Headings H4 |
| text-2xl | 1.5rem | 24px | 2rem | Headings H3 |
| text-3xl | 1.875rem | 30px | 2.25rem | Headings H2 |
| text-4xl | 2.25rem | 36px | 2.5rem | Headings H1 |
| text-5xl | 3rem | 48px | 1 | Display |

### Font Weights

| Token | Value | Usage |
|-------|-------|-------|
| font-normal | 400 | Body text |
| font-medium | 500 | Emphasis |
| font-semibold | 600 | Buttons, labels |
| font-bold | 700 | Headings |

### Letter Spacing

| Token | Value | Usage |
|-------|-------|-------|
| tracking-tight | -0.025em | Large headings |
| tracking-normal | 0 | Body text |
| tracking-wide | 0.025em | Uppercase labels |
| tracking-wider | 0.05em | All caps |

---

## 📏 Spacing

Base unit: `4px`

| Token | Value | Usage |
|-------|-------|-------|
| 0 | 0 | None |
| px | 1px | Thin borders |
| 0.5 | 2px | Micro spacing |
| 1 | 4px | Tiny spacing |
| 2 | 8px | Small spacing |
| 3 | 12px | Spacing between elements |
| 4 | 16px | Standard spacing |
| 5 | 20px | Medium spacing |
| 6 | 24px | Large spacing |
| 8 | 32px | XL spacing |
| 10 | 40px | 2XL spacing |
| 12 | 48px | 3XL spacing |
| 16 | 64px | 4XL spacing |
| 20 | 80px | Section spacing |
| 24 | 96px | Large section spacing |

---

## 🔘 Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| rounded-none | 0 | Square corners |
| rounded-sm | 4px | Subtle rounding |
| rounded | 6px | Standard |
| rounded-md | 8px | Inputs, buttons small |
| rounded-lg | 12px | Cards, dialogs |
| rounded-xl | 16px | Large cards |
| rounded-2xl | 24px | Hero sections |
| rounded-full | 9999px | Pills, avatars |

### Component-Specific

```css
--radius: 0.75rem; /* 12px - Base radius for Shadcn components */
```

---

## 💧 Shadows

### Elevation System

| Token | Value | Usage |
|-------|-------|-------|
| shadow-sm | 0 1px 2px rgba(0,0,0,0.05) | Subtle elevation |
| shadow | 0 1px 3px rgba(0,0,0,0.1) | Cards |
| shadow-md | 0 4px 6px rgba(0,0,0,0.1) | Dropdowns |
| shadow-lg | 0 10px 15px rgba(0,0,0,0.1) | Modals |
| shadow-xl | 0 20px 25px rgba(0,0,0,0.1) | Popovers |
| shadow-2xl | 0 25px 50px rgba(0,0,0,0.25) | Maximum elevation |

### Custom Shadows

```css
/* Layered shadow */
--shadow-layered:
  0 2px 4px rgba(0,0,0,0.02),
  0 8px 16px rgba(0,0,0,0.04),
  0 16px 32px rgba(0,0,0,0.06);

/* Primary shadow (purple) */
--shadow-primary: 0 10px 25px -5px rgba(139, 92, 246, 0.3);
--shadow-primary-hover: 0 15px 30px -5px rgba(139, 92, 246, 0.4);
```

---

## ⏱️ Transitions

### Duration

| Token | Value | Usage |
|-------|-------|-------|
| duration-75 | 75ms | Instant feedback |
| duration-100 | 100ms | Quick transitions |
| duration-150 | 150ms | Standard transitions |
| duration-200 | 200ms | Hover effects |
| duration-300 | 300ms | Modals, overlays |
| duration-500 | 500ms | Complex animations |
| duration-700 | 700ms | Slow reveals |
| duration-1000 | 1000ms | Hero animations |

### Timing Functions

```css
ease-linear: cubic-bezier(0, 0, 1, 1);
ease-in: cubic-bezier(0.4, 0, 1, 1);
ease-out: cubic-bezier(0, 0, 0.2, 1);
ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

---

## 🎭 Opacity

| Token | Value | Usage |
|-------|-------|-------|
| opacity-0 | 0 | Hidden |
| opacity-5 | 0.05 | Barely visible |
| opacity-10 | 0.10 | Subtle overlay |
| opacity-20 | 0.20 | Light overlay |
| opacity-30 | 0.30 | Disabled state |
| opacity-40 | 0.40 | Muted elements |
| opacity-50 | 0.50 | Half opacity |
| opacity-60 | 0.60 | Secondary |
| opacity-70 | 0.70 | Hover |
| opacity-80 | 0.80 | Active |
| opacity-90 | 0.90 | Nearly full |
| opacity-100 | 1.00 | Full opacity |

---

## 🔲 Z-Index

| Token | Value | Usage |
|-------|-------|-------|
| z-0 | 0 | Base layer |
| z-10 | 10 | Dropdowns |
| z-20 | 20 | Sticky headers |
| z-30 | 30 | Modals backdrop |
| z-40 | 40 | Modals |
| z-50 | 50 | Tooltips, popovers |
| z-auto | auto | Default |

---

## 📱 Breakpoints

| Token | Value | Usage |
|-------|-------|-------|
| sm | 640px | Mobile landscape |
| md | 768px | Tablet |
| lg | 1024px | Desktop |
| xl | 1280px | Large desktop |
| 2xl | 1536px | Extra large |

---

## ♿ Accessibility Tokens

### Focus Ring

```css
--ring-width: 3px;
--ring-color: #9333ea; /* purple-600 */
--ring-offset: 2px;
--ring-shadow: 0 0 0 4px rgba(147, 51, 234, 0.1);
```

### Minimum Touch Target

```css
--touch-target-min: 44px; /* WCAG AA recommendation */
```

### Contrast Ratios

| Context | Minimum | Target |
|---------|---------|--------|
| Normal text | 4.5:1 (AA) | 7:1 (AAA) ✅ Alcançado |
| Large text | 3:1 (AA) | 4.5:1 (AAA) |
| UI components | 3:1 (AA) | 4.5:1+ |
| Focus indicators | 3:1 (AA) | 5.25:1+ ✅ Alcançado |

---

## 🔧 Usage in Code

### Tailwind CSS

```jsx
<div className="bg-primary text-primary-foreground rounded-lg p-4 shadow-md">
  Purple card
</div>
```

### CSS Variables

```css
.custom-element {
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  border-radius: var(--radius);
}
```

### JavaScript

```js
const theme = {
  colors: {
    primary: 'hsl(271 81% 56%)',
    success: 'hsl(162 93% 30%)',
  },
};
```

---

**Criado:** 2026-02-23
**Responsável:** Claude Code
**Versão:** 1.0.0
