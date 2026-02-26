# ⚡ Testing Cheatsheet - Quick Reference

> **Referência rápida de comandos, queries e patterns**

---

## 🚀 Comandos

### Executar Testes

```bash
# Todos
npm test

# Watch mode
npm run test:watch

# UI Mode (recomendado)
npm run test:ui

# Coverage
npm run test:coverage

# Arquivo específico
npm test -- useAdminData

# Pattern
npm test -- Admin

# E2E
npx playwright test
```

---

## 🔍 Queries (React Testing Library)

### Prioridade de Queries

```javascript
// 1️⃣ MELHOR - Acessível
screen.getByRole('button', { name: /submit/i })
screen.getByLabelText(/email/i)

// 2️⃣ BOM - Forms
screen.getByPlaceholderText(/enter email/i)
screen.getByDisplayValue('Current Value')

// 3️⃣ OK - Conteúdo
screen.getByText(/welcome/i)
screen.getByAltText(/profile picture/i)

// 4️⃣ ÚLTIMO RECURSO
screen.getByTestId('submit-button')
```

---

### Variações de Queries

| Prefixo | Múltiplos? | Espera? | Throw? | Uso |
|---------|------------|---------|--------|-----|
| `getBy` | ❌ | ❌ | ✅ | Elemento existe agora |
| `queryBy` | ❌ | ❌ | ❌ | Elemento pode não existir |
| `findBy` | ❌ | ✅ | ✅ | Elemento aparecerá |
| `getAllBy` | ✅ | ❌ | ✅ | Múltiplos elementos existem |
| `queryAllBy` | ✅ | ❌ | ❌ | Múltiplos podem não existir |
| `findAllBy` | ✅ | ✅ | ✅ | Múltiplos aparecerão |

```javascript
// Único elemento que existe
const button = screen.getByRole('button');

// Único que pode não existir
const error = screen.queryByText(/erro/i);

// Único que aparecerá
const success = await screen.findByText(/sucesso/i);

// Múltiplos elementos
const buttons = screen.getAllByRole('button');

// Múltiplos que podem não existir
const errors = screen.queryAllByText(/erro/i);

// Múltiplos que aparecerão
const items = await screen.findAllByRole('listitem');
```

---

## 🎭 User Events

```javascript
import userEvent from '@testing-library/user-event';

const user = userEvent.setup();

// Click
await user.click(button);
await user.dblClick(button);

// Typing
await user.type(input, 'Hello');
await user.clear(input);

// Keyboard
await user.keyboard('{Enter}');
await user.keyboard('{Escape}');
await user.keyboard('{Tab}');
await user.keyboard('{Shift>}A{/Shift}'); // Shift+A

// Tab navigation
await user.tab(); // Tab forward
await user.tab({ shift: true }); // Shift+Tab

// Select
await user.selectOptions(select, 'option-value');

// Checkbox/Radio
await user.click(checkbox);

// Upload file
await user.upload(fileInput, file);

// Hover
await user.hover(element);
await user.unhover(element);
```

---

## 🧪 Assertions (Jest/Vitest)

### DOM

```javascript
// Presença
expect(element).toBeInTheDocument();
expect(element).not.toBeInTheDocument();

// Visibilidade
expect(element).toBeVisible();
expect(element).not.toBeVisible();

// Disabled/Enabled
expect(button).toBeDisabled();
expect(button).toBeEnabled();

// Classes
expect(element).toHaveClass('active', 'primary');

// Atributos
expect(link).toHaveAttribute('href', '/page');

// Text content
expect(element).toHaveTextContent('Hello');
expect(element).toHaveTextContent(/hello/i);

// Value (inputs)
expect(input).toHaveValue('text');
expect(checkbox).toBeChecked();

// Focus
expect(input).toHaveFocus();
```

---

### Geral

```javascript
// Equality
expect(value).toBe(42);
expect(obj).toEqual({ name: 'Test' });
expect(obj).toMatchObject({ name: 'Test' }); // Partial match

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeUndefined();

// Numbers
expect(count).toBeGreaterThan(0);
expect(count).toBeLessThan(100);
expect(count).toBeGreaterThanOrEqual(1);

// Arrays
expect(array).toHaveLength(3);
expect(array).toContain('item');
expect(array).toContainEqual({ id: 1 });

// Strings
expect(text).toMatch(/pattern/i);
expect(text).toContain('substring');

// Functions
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledTimes(2);
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
expect(mockFn).toHaveBeenLastCalledWith('arg');

// Promises
await expect(promise).resolves.toBe(value);
await expect(promise).rejects.toThrow('error');

// Exceptions
expect(() => fn()).toThrow();
expect(() => fn()).toThrow('error message');
expect(() => fn()).toThrow(/pattern/);
```

---

## 🎯 Mocking (Vitest)

### Functions

```javascript
// Mock básico
const mockFn = vi.fn();

// Mock com retorno
const mockFn = vi.fn().mockReturnValue(42);

// Mock com retorno assíncrono
const mockFn = vi.fn().mockResolvedValue({ data: [] });

// Mock com erro
const mockFn = vi.fn().mockRejectedValue(new Error('Failed'));

// Mock com múltiplas chamadas
const mockFn = vi.fn()
  .mockReturnValueOnce(1)
  .mockReturnValueOnce(2)
  .mockReturnValue(3);

// Mock com implementação
const mockFn = vi.fn((a, b) => a + b);

// Verificar chamadas
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledTimes(2);
expect(mockFn).toHaveBeenCalledWith('arg');
expect(mockFn).toHaveBeenLastCalledWith('arg');

// Limpar
mockFn.mockClear(); // Limpa histórico de chamadas
mockFn.mockReset(); // Limpa histórico + implementação
mockFn.mockRestore(); // Restaura implementação original
```

---

### Modules

```javascript
// Mock módulo completo
vi.mock('./module', () => ({
  default: vi.fn(),
  namedExport: vi.fn(),
}));

// Mock parcial
vi.mock('./module', async () => {
  const actual = await vi.importActual('./module');
  return {
    ...actual,
    functionToMock: vi.fn(),
  };
});

// Mock com factory
const mockFn = vi.fn();
vi.mock('./module', () => ({
  useMyHook: () => mockFn(),
}));

// Diferentes retornos por teste
beforeEach(() => {
  mockFn.mockReturnValue({ data: [] });
});
```

---

### Timers

```javascript
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

it('teste com timer', () => {
  // Avançar tempo
  vi.advanceTimersByTime(1000); // 1 segundo
  vi.runAllTimers(); // Executar todos
  vi.runOnlyPendingTimers(); // Apenas pendentes

  // Obter tempo atual
  const now = vi.getRealSystemTime();
});
```

---

### Globals

```javascript
// fetch
global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: async () => ({ data: [] }),
});

// localStorage
const mockGetItem = vi.spyOn(Storage.prototype, 'getItem');
const mockSetItem = vi.spyOn(Storage.prototype, 'setItem');

mockGetItem.mockReturnValue('value');

expect(mockSetItem).toHaveBeenCalledWith('key', 'value');

// window
Object.defineProperty(window, 'location', {
  value: { href: 'http://localhost' },
  writable: true,
});

// matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    addListener: vi.fn(),
    removeListener: vi.fn(),
  })),
});
```

---

## ⏱️ Async Utils

### waitFor

```javascript
import { waitFor } from '@testing-library/react';

// Esperar condição
await waitFor(() => {
  expect(screen.getByText('Success')).toBeInTheDocument();
});

// Com timeout
await waitFor(() => {
  expect(mockFn).toHaveBeenCalled();
}, { timeout: 5000 });

// Com interval
await waitFor(() => {
  expect(data).toBeDefined();
}, { interval: 100 });
```

---

### waitForElementToBeRemoved

```javascript
import { waitForElementToBeRemoved } from '@testing-library/react';

// Esperar elemento sumir
const loading = screen.getByText(/loading/i);
await waitForElementToBeRemoved(loading);
```

---

### act

```javascript
import { act } from 'react';

// Wrap state updates
act(() => {
  result.current.setState(newState);
});

// Async act
await act(async () => {
  await result.current.fetchData();
});
```

---

## 🧩 Common Patterns

### Render com Providers

```javascript
const renderWithProviders = (ui, options = {}) => {
  const Wrapper = ({ children }) => (
    <BrowserRouter>
      <AppProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </AppProvider>
    </BrowserRouter>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};

// Uso
renderWithProviders(<MyComponent />);
```

---

### Hook Test

```javascript
import { renderHook, waitFor } from '@testing-library/react';

it('deve retornar dados', async () => {
  const { result } = renderHook(() => useMyHook());

  // Estado inicial
  expect(result.current.data).toEqual([]);

  // Aguardar mudança
  await waitFor(() => {
    expect(result.current.data).toHaveLength(3);
  });
});
```

---

### Modal Test

```javascript
it('deve abrir e fechar modal', async () => {
  const user = userEvent.setup();
  render(<Component />);

  // Abrir
  const openButton = screen.getByRole('button', { name: /open/i });
  await user.click(openButton);

  // Verificar aberto
  const modal = screen.getByRole('dialog');
  expect(modal).toBeInTheDocument();

  // Fechar com ESC
  await user.keyboard('{Escape}');

  // Verificar fechado
  await waitFor(() => {
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
```

---

### Form Test

```javascript
it('deve submeter formulário', async () => {
  const user = userEvent.setup();
  const mockOnSubmit = vi.fn();

  render(<Form onSubmit={mockOnSubmit} />);

  // Preencher
  const nameInput = screen.getByLabelText(/name/i);
  const emailInput = screen.getByLabelText(/email/i);

  await user.type(nameInput, 'John');
  await user.type(emailInput, 'john@test.com');

  // Submeter
  const submitButton = screen.getByRole('button', { name: /submit/i });
  await user.click(submitButton);

  // Verificar
  expect(mockOnSubmit).toHaveBeenCalledWith({
    name: 'John',
    email: 'john@test.com',
  });
});
```

---

### Loading Test

```javascript
it('deve mostrar loading', async () => {
  // Mock resposta lenta
  global.fetch = vi.fn().mockImplementation(
    () => new Promise(resolve => setTimeout(resolve, 1000))
  );

  render(<Component />);

  // Loading aparece
  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  // Loading desaparece
  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));

  // Conteúdo aparece
  expect(screen.getByText('Content')).toBeInTheDocument();
});
```

---

### Error Test

```javascript
it('deve mostrar erro', async () => {
  // Mock erro
  global.fetch = vi.fn().mockRejectedValue(new Error('Failed'));

  render(<Component />);

  // Aguardar erro aparecer
  const error = await screen.findByText(/erro/i);
  expect(error).toBeInTheDocument();
});
```

---

## ♿ Accessibility

### Jest Axe

```javascript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

it('não deve ter violações', async () => {
  const { container } = render(<Component />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

### Keyboard Navigation

```javascript
it('deve navegar com Tab', async () => {
  const user = userEvent.setup();
  render(<Component />);

  // Tab para primeiro elemento
  await user.tab();
  expect(screen.getByRole('button', { name: /first/i })).toHaveFocus();

  // Tab para segundo
  await user.tab();
  expect(screen.getByRole('button', { name: /second/i })).toHaveFocus();

  // Shift+Tab para voltar
  await user.tab({ shift: true });
  expect(screen.getByRole('button', { name: /first/i })).toHaveFocus();
});
```

---

## 🐛 Debugging

### screen.debug()

```javascript
// Toda a árvore
screen.debug();

// Elemento específico
screen.debug(screen.getByRole('button'));

// Infinito (sem truncar)
screen.debug(undefined, Infinity);
```

---

### logRoles()

```javascript
import { logRoles } from '@testing-library/react';

const { container } = render(<Component />);
logRoles(container);
```

---

### Testing Playground

```javascript
screen.logTestingPlaygroundURL();
// Abre URL com UI interativa
```

---

## 📊 Coverage

```bash
# Gerar coverage
npm run test:coverage

# Ver report HTML
open coverage/index.html

# Coverage de arquivo específico
npm test -- --coverage src/file.js
```

---

## 🎯 Best Practices Summary

✅ **DO:**
- Testar comportamento, não implementação
- Usar `getByRole` quando possível
- Usar `userEvent` ao invés de `fireEvent`
- Usar `waitFor` para assincronismo
- Limpar mocks no `beforeEach`
- Testar acessibilidade
- Testar edge cases

❌ **DON'T:**
- Usar `data-testid` como primeira opção
- Testar código de bibliotecas
- Usar `sleep` ou `setTimeout`
- Fazer assertions genéricas (`toBeTruthy`)
- Mocks globais sem cleanup
- Testes acoplados

---

## 🔗 Links Úteis

- [RTL Cheatsheet](https://testing-library.com/docs/react-testing-library/cheatsheet)
- [User Event API](https://testing-library.com/docs/user-event/intro)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)
- [Vitest API](https://vitest.dev/api/)
- [Playwright Cheatsheet](https://playwright.dev/docs/api/class-playwright)

---

**Última Atualização:** 2026-02-25
**Responsável:** @qa
