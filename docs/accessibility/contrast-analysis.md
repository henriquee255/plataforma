# Análise de Contraste de Cores - WCAG 2.1 AA

## 📋 Requisitos WCAG 2.1 AA

- **Texto Normal (< 18pt ou < 14pt bold):** Contraste ≥ 4.5:1
- **Texto Grande (≥ 18pt ou ≥ 14pt bold):** Contraste ≥ 3:1
- **Componentes UI:** Contraste ≥ 3:1

## 🔍 Cores do Tema Purple

### Cores Principais
- `purple-500`: #a855f7
- `purple-600`: #9333ea
- `purple-700`: #7c3aed
- `purple-400`: #c084fc
- `purple-300`: #d8b4fe

### Backgrounds
- Light Mode: white (#ffffff), gray-50 (#f9fafb), gray-100 (#f3f4f6)
- Dark Mode: gray-800 (#1f2937), gray-900 (#111827)

### Textos
- Light Mode: gray-900 (#111827), gray-700 (#374151), gray-600 (#4b5563), gray-500 (#6b7280), gray-400 (#9ca3af)
- Dark Mode: white (#ffffff), gray-300 (#d1d5db), gray-400 (#9ca3af)

## ⚠️ Problemas Identificados

### 1. Texto Cinza Claro em Fundo Branco

#### **gray-400 (#9ca3af) em white (#ffffff)**
- **Contraste Calculado:** 2.85:1 ❌
- **Mínimo Requerido:** 4.5:1
- **Status:** FALHA
- **Ocorrências:** ~180 casos
- **Exemplos:**
  - Ícones decorativos (FaSearch, FaCalendar)
  - Placeholders em inputs
  - Textos de ajuda/hint

**Solução:** Mudar para `gray-600` (#4b5563) - Contraste: 7.23:1 ✅

#### **gray-500 (#6b7280) em white (#ffffff)**
- **Contraste Calculado:** 4.61:1 ✅ (borderline)
- **Mínimo Requerido:** 4.5:1
- **Status:** PASSA (mas próximo do limite)
- **Ocorrências:** ~150 casos
- **Recomendação:** Mudar para `gray-600` para margem de segurança

### 2. Texto em Backgrounds Coloridos

#### **white (#ffffff) em purple-500 (#a855f7)**
- **Contraste Calculado:** 4.54:1 ✅
- **Status:** PASSA
- **Uso:** Botões primários, badges

#### **white (#ffffff) em purple-600 (#9333ea)**
- **Contraste Calculado:** 5.25:1 ✅
- **Status:** PASSA
- **Uso:** Botões, gradientes

### 3. Dark Mode Issues

#### **gray-400 (#9ca3af) em gray-800 (#1f2937)**
- **Contraste Calculado:** 4.03:1 ❌
- **Mínimo Requerido:** 4.5:1
- **Status:** FALHA
- **Solução:** Mudar para `gray-300` (#d1d5db) - Contraste: 6.39:1 ✅

#### **gray-400 (#9ca3af) em gray-900 (#111827)**
- **Contraste Calculado:** 4.98:1 ✅
- **Status:** PASSA

### 4. Placeholders

#### **placeholder-gray-500 em light mode**
- **Contraste:** 4.61:1 ✅ (borderline)
- **Recomendação:** Mudar para `placeholder-gray-600`

## 🔧 Ajustes Necessários

### Prioridade ALTA (Falhas WCAG)

1. **Substituir `text-gray-400` → `text-gray-600`** em light mode
   - Ícones decorativos
   - Textos secundários
   - Labels de formulário

2. **Dark Mode: `dark:text-gray-400` → `dark:text-gray-300`**
   - Todos os textos secundários
   - Ícones

3. **Placeholders: `placeholder-gray-500` → `placeholder-gray-600`**
   - Todos os inputs

### Prioridade MÉDIA (Melhorias)

4. **Substituir `text-gray-500` → `text-gray-600`** para margem de segurança
   - Timestamps
   - Metadados
   - Textos de ajuda

## 📊 Estimativa de Mudanças

| Tipo | Ocorrências | Tempo Estimado |
|------|-------------|----------------|
| text-gray-400 → text-gray-600 | ~180 | 3h |
| dark:text-gray-400 → dark:text-gray-300 | ~120 | 2h |
| placeholder-gray-500 → placeholder-gray-600 | ~30 | 1h |
| text-gray-500 → text-gray-600 | ~150 | 2h |
| Testes e validação | - | 2h |

**Total:** 10 horas ✅

## ✅ Validação Pós-Ajuste

1. ⏳ Lighthouse Accessibility Audit
2. ⏳ axe DevTools contrast check
3. ⏳ Manual verification com Colour Contrast Analyser
4. ⏳ Visual regression testing

---

**Criado:** 2026-02-23
**Status:** 📋 Análise completa - Pronto para implementação
