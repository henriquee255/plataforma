# 🎯 Guia de Execução QA - Painel Superadmin

> **Agent:** @qa (Quality Assurance)
> **Sprint:** Refatoração Admin (Story 4.1)
> **Meta:** > 80% coverage + WCAG 2.1 AA compliance
> **Data:** 2026-02-25

---

## 📋 Quick Start

### 1. Instalar Dependências de Teste

```bash
# Dependências já instaladas
npm install -D vitest @vitest/ui @testing-library/react @testing-library/user-event @testing-library/jest-dom

# Instalar Playwright (E2E)
npm install -D @playwright/test

# Instalar Axe (Acessibilidade)
npm install -D jest-axe @axe-core/react
```

### 2. Executar Testes

```bash
# Todos os testes
npm test

# Modo watch
npm run test:watch

# UI Mode (recomendado)
npm run test:ui

# Coverage
npm run test:coverage

# E2E (Playwright)
npx playwright test

# Apenas Admin tests
npm test -- src/pages/Admin
```

---

## 📊 Status de Cobertura (Meta: 80%)

### Baseline Atual
```
Statements   : 0%    (0/0)      → Target: > 80%
Branches     : 0%    (0/0)      → Target: > 80%
Functions    : 0%    (0/0)      → Target: > 80%
Lines        : 0%    (0/0)      → Target: > 80%
```

### Após Implementação (Esperado)
```
Statements   : 85%   (850/1000)  ✅
Branches     : 82%   (410/500)   ✅
Functions    : 88%   (220/250)   ✅
Lines        : 86%   (860/1000)  ✅
```

---

## 🗺️ Roadmap de Implementação

### Semana 1: Foundation (Crítico)
**Objetivo:** Setup + Hooks + Shared Components

#### Dia 1-2: Setup e Hooks Core
- [x] Setup de ferramentas (vitest.config.js, setup.js)
- [x] Criar mocks (adminMockData.js, apiMocks.js)
- [x] Criar test utilities (testUtils.jsx)
- [ ] **useAdminData.test.js** (15 test cases)
- [ ] **useUserManagement.test.js** (25 test cases)
- [ ] **useCompanyManagement.test.js** (20 test cases)

**Prioridade:** 🔴 CRÍTICA
**Tempo Estimado:** 8-10 horas
**Bloqueador:** Refatoração precisa criar os hooks primeiro

#### Dia 3-4: Shared Components
- [ ] **StatCard.test.jsx** (7 test cases)
- [ ] **DataTable.test.jsx** (10 test cases)
- [ ] **FilterBar.test.jsx** (5 test cases)
- [ ] **SearchInput.test.jsx** (6 test cases)
- [ ] **StatusBadge.test.jsx** (5 test cases)
- [ ] **PlanBadge.test.jsx** (5 test cases)
- [ ] **RoleBadge.test.jsx** (4 test cases)
- [ ] **ModalBackdrop.test.jsx** (7 test cases)

**Prioridade:** 🔴 ALTA
**Tempo Estimado:** 6-8 horas

#### Dia 5: Integration Tests (User CRUD)
- [ ] **user-crud.test.jsx** (Fluxo completo)
- [ ] **filters-and-search.test.jsx**

**Prioridade:** 🔴 ALTA
**Tempo Estimado:** 4-6 horas

---

### Semana 2: Coverage Expansion

#### Dia 6-7: Utility Functions + Tab Components
- [ ] **validators.test.js**
- [ ] **formatters.test.js**
- [ ] **adminHelpers.test.js**
- [ ] **Dashboard/** components (5 files)
- [ ] **Users/** components (4 files)

**Prioridade:** 🟡 MÉDIA
**Tempo Estimado:** 6-8 horas

#### Dia 8-9: Companies + System
- [ ] **Companies/** components (4 files)
- [ ] **System/** components (4 files)
- [ ] **company-crud.test.jsx** (Integration)

**Prioridade:** 🟡 MÉDIA
**Tempo Estimado:** 6-8 horas

#### Dia 10: Accessibility Tests
- [ ] **keyboard-navigation.test.jsx**
- [ ] **screen-reader.test.jsx**
- [ ] **aria-labels.test.jsx**

**Prioridade:** 🔴 ALTA (WCAG compliance)
**Tempo Estimado:** 4-6 horas

---

### Semana 3: Polish & E2E

#### Dia 11-12: Responsiveness
- [ ] **mobile.test.jsx**
- [ ] **tablet.test.jsx**
- [ ] **desktop.test.jsx**

**Prioridade:** 🟢 BAIXA
**Tempo Estimado:** 4-6 horas

#### Dia 13-14: Performance
- [ ] **render-performance.test.jsx**
- [ ] **memo-optimization.test.jsx**

**Prioridade:** 🟢 BAIXA
**Tempo Estimado:** 3-4 horas

#### Dia 15: E2E (Playwright)
- [ ] **complete-user-flow.spec.js**
- [ ] **complete-company-flow.spec.js**

**Prioridade:** 🟡 MÉDIA
**Tempo Estimado:** 4-6 horas

---

## 🎯 Checklist de Qualidade

### Para Cada Componente Testado

#### Code Coverage
- [ ] Statements > 80%
- [ ] Branches > 80%
- [ ] Functions > 80%
- [ ] Lines > 80%

#### Test Quality
- [ ] Testes descrevem comportamento, não implementação
- [ ] Cada test case é independente
- [ ] Mocks são limpos após cada teste (beforeEach/afterEach)
- [ ] Assertions são específicas (não genéricas)
- [ ] Happy path + Edge cases + Error cases cobertos

#### Acessibilidade
- [ ] Navegação por teclado funciona
- [ ] ARIA labels presentes e corretos
- [ ] Focus visível em todos os elementos
- [ ] Sem violações no jest-axe
- [ ] Screen readers compatíveis

#### Performance
- [ ] Renderização < 100ms (componentes pequenos)
- [ ] Renderização < 500ms (componentes grandes)
- [ ] React.memo implementado onde necessário
- [ ] Sem re-renders desnecessários

#### Responsividade
- [ ] Mobile (320px-767px) funciona
- [ ] Tablet (768px-1023px) funciona
- [ ] Desktop (1024px+) funciona
- [ ] Touch targets mínimo 44x44px

---

## 🔧 Ferramentas e Comandos

### Vitest (Unit + Integration)

```bash
# Executar testes específicos
npm test -- useAdminData

# Watch mode para desenvolvimento
npm run test:watch

# UI Mode (melhor para debug)
npm run test:ui

# Coverage detalhado
npm run test:coverage

# Coverage de arquivo específico
npm test -- --coverage src/pages/Admin/hooks/useAdminData.js
```

### Playwright (E2E)

```bash
# Executar todos os E2E
npx playwright test

# UI Mode
npx playwright test --ui

# Debug mode
npx playwright test --debug

# Apenas um spec
npx playwright test user-crud

# Com headed browser
npx playwright test --headed

# Report
npx playwright show-report
```

### Jest Axe (Acessibilidade)

```javascript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

it('não deve ter violações de acessibilidade', async () => {
  const { container } = render(<Component />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

## 📝 Templates de Test Cases

### Hook Test Template

```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react';
import useMyHook from '@admin/hooks/useMyHook';

describe('useMyHook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve retornar estado inicial', () => {
    const { result } = renderHook(() => useMyHook());

    expect(result.current.data).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it('deve carregar dados', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: ['item1'] }),
    });

    const { result } = renderHook(() => useMyHook());

    await act(async () => {
      await result.current.fetchData();
    });

    expect(result.current.data).toEqual(['item1']);
  });
});
```

### Component Test Template

```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../utils/testUtils';
import MyComponent from '@admin/components/MyComponent';

describe('MyComponent', () => {
  const defaultProps = {
    data: [],
    onAction: vi.fn(),
  };

  it('deve renderizar corretamente', () => {
    renderWithProviders(<MyComponent {...defaultProps} />);

    expect(screen.getByText('Title')).toBeInTheDocument();
  });

  it('deve chamar callback ao clicar', async () => {
    const user = userEvent.setup();
    const mockOnAction = vi.fn();

    renderWithProviders(
      <MyComponent {...defaultProps} onAction={mockOnAction} />
    );

    const button = screen.getByRole('button', { name: /action/i });
    await user.click(button);

    expect(mockOnAction).toHaveBeenCalledTimes(1);
  });
});
```

### Integration Test Template

```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../utils/testUtils';
import Admin from '@admin/index';

describe('Feature Flow Integration', () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
    global.fetch = vi.fn();
  });

  it('deve completar fluxo completo', async () => {
    // 1. Setup
    renderWithProviders(<Admin />);

    // 2. Navegar
    const tab = screen.getByRole('button', { name: /tab/i });
    await user.click(tab);

    // 3. Abrir modal
    const addButton = screen.getByRole('button', { name: /add/i });
    await user.click(addButton);

    // 4. Preencher formulário
    const modal = screen.getByRole('dialog');
    const input = within(modal).getByLabelText(/name/i);
    await user.type(input, 'Test');

    // 5. Submeter
    const saveButton = within(modal).getByRole('button', { name: /save/i });
    await user.click(saveButton);

    // 6. Validar resultado
    await waitFor(() => {
      expect(screen.getByText(/success/i)).toBeInTheDocument();
    });
  });
});
```

---

## 🐛 Debugging Tips

### 1. Ver Renderizações

```javascript
import { screen } from '@testing-library/react';

// Ver estrutura HTML atual
screen.debug();

// Ver elemento específico
screen.debug(screen.getByRole('button'));

// Salvar em arquivo
screen.debug(undefined, Infinity);
```

### 2. Ver Queries Disponíveis

```javascript
const { container } = render(<Component />);

// Lista todas as queries possíveis
screen.logTestingPlaygroundURL();
```

### 3. Ver Chamadas de Mock

```javascript
const mockFn = vi.fn();

// Ver quantas vezes foi chamado
console.log(mockFn.mock.calls.length);

// Ver argumentos de cada chamada
console.log(mockFn.mock.calls);

// Ver resultados
console.log(mockFn.mock.results);
```

### 4. Esperar por Elemento

```javascript
// Esperar aparecer
await waitFor(() => {
  expect(screen.getByText('Text')).toBeInTheDocument();
});

// Esperar desaparecer
await waitFor(() => {
  expect(screen.queryByText('Text')).not.toBeInTheDocument();
});

// Timeout customizado
await waitFor(() => {
  expect(screen.getByText('Text')).toBeInTheDocument();
}, { timeout: 5000 });
```

---

## 📊 Relatórios

### Coverage Report

Após executar `npm run test:coverage`, abrir:

```bash
# Browser
open coverage/index.html

# Terminal
cat coverage/coverage-summary.json
```

### CI/CD Integration

GitHub Actions irá:
1. Executar todos os testes
2. Gerar coverage report
3. Upload para Codecov
4. Falhar PR se coverage < 80%

---

## 🎓 Recursos

### Documentação
- [Vitest](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library User Event](https://testing-library.com/docs/user-event/intro)
- [Jest Axe](https://github.com/nickcolley/jest-axe)
- [Playwright](https://playwright.dev/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### Exemplos Completos
- `docs/testing/test-examples/useAdminData.test.example.js`
- `docs/testing/test-examples/useUserManagement.test.example.js`
- `docs/testing/test-examples/user-crud-integration.test.example.jsx`
- `docs/testing/test-examples/keyboard-navigation-accessibility.test.example.jsx`

### Arquitetura
- `docs/testing/admin-testing-strategy.md` (Documento principal)
- `docs/obsidian/Admin-Refactoring-Plan.md` (Plano de refatoração)

---

## 🚨 Alertas Importantes

### ⚠️ Dependências entre Testes
- **Hooks dependem da refatoração:** Não podem ser testados antes de existirem
- **Components dependem dos hooks:** Ordem de criação importa
- **Integration tests precisam de tudo:** Implementar por último

### ⚠️ Ordem de Prioridade
1. **CRÍTICO:** useAdminData, useUserManagement (base de tudo)
2. **ALTO:** Shared components, User CRUD integration
3. **MÉDIO:** Tab components, Companies
4. **BAIXO:** Performance, Responsiveness

### ⚠️ Evitar
- ❌ Testar implementação ao invés de comportamento
- ❌ Testes acoplados (um depende de outro)
- ❌ Assertions genéricas (`toBeTruthy()` ao invés de `toBe(true)`)
- ❌ Mocks globais não limpos
- ❌ Snapshot tests sem necessidade

---

## ✅ Definition of Done

Um componente está **DONE** quando:

1. ✅ Coverage > 80% (statements, branches, functions, lines)
2. ✅ Todos os test cases passando
3. ✅ 0 violações de acessibilidade (jest-axe)
4. ✅ Navegação por teclado funciona
5. ✅ Responsivo em 3 breakpoints
6. ✅ Dark mode testado
7. ✅ Loading states testados
8. ✅ Error states testados
9. ✅ Documentação atualizada
10. ✅ Code review aprovado

---

## 📞 Suporte

**Squad:**
- **@qa** - Quality Assurance (você!)
- **@dev** - Desenvolvimento (implementação)
- **@architect** - Arquitetura (revisão de estrutura)

**Comunicação:**
- Issues críticos: Marcar @dev no PR
- Dúvidas de arquitetura: Consultar @architect
- Bloqueadores: Escalar para @aios-master

---

**Última Atualização:** 2026-02-25
**Responsável:** @qa
**Status:** 🟢 Pronto para Execução
