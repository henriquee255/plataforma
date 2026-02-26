# 🎓 Best Practices - Testing Guidelines

> **Guia de boas práticas para testes de qualidade**
> **Baseado em:** React Testing Library, Kent C. Dodds, Testing Trophy

---

## 🎯 Princípios Fundamentais

### 1. Teste Comportamento, Não Implementação

❌ **ERRADO:**
```javascript
it('deve ter estado loading como true', () => {
  const { result } = renderHook(() => useAdminData());
  expect(result.current.loading).toBe(true);
});
```

✅ **CORRETO:**
```javascript
it('deve mostrar indicador de loading enquanto carrega dados', async () => {
  render(<UsersList />);

  expect(screen.getByText(/carregando/i)).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.queryByText(/carregando/i)).not.toBeInTheDocument();
  });
});
```

**Por quê?** Testar implementação torna testes frágeis. Mudanças internas quebram testes mesmo que comportamento permaneça igual.

---

### 2. Teste Como Usuário Usaria

❌ **ERRADO:**
```javascript
it('deve atualizar state ao chamar handleClick', () => {
  const { result } = renderHook(() => useCounter());
  result.current.handleClick();
  expect(result.current.count).toBe(1);
});
```

✅ **CORRETO:**
```javascript
it('deve incrementar contador ao clicar no botão', async () => {
  const user = userEvent.setup();
  render(<Counter />);

  const button = screen.getByRole('button', { name: /incrementar/i });
  await user.click(button);

  expect(screen.getByText(/contador: 1/i)).toBeInTheDocument();
});
```

**Por quê?** Usuários interagem com UI, não com código. Testes devem simular uso real.

---

### 3. Evite "Test IDs" Quando Possível

❌ **ERRADO:**
```javascript
render(<Button data-testid="submit-button">Submit</Button>);
const button = screen.getByTestId('submit-button');
```

✅ **CORRETO:**
```javascript
render(<Button>Submit</Button>);
const button = screen.getByRole('button', { name: /submit/i });
```

**Ordem de prioridade de queries:**
1. `getByRole` (melhor - mais acessível)
2. `getByLabelText` (forms)
3. `getByPlaceholderText` (forms)
4. `getByText` (conteúdo não-interativo)
5. `getByDisplayValue` (form values)
6. `getByAltText` (imagens)
7. `getByTitle` (tooltips)
8. `getByTestId` (último recurso)

---

### 4. Use User Event, Não FireEvent

❌ **ERRADO:**
```javascript
fireEvent.click(button);
```

✅ **CORRETO:**
```javascript
const user = userEvent.setup();
await user.click(button);
```

**Por quê?** `userEvent` simula interações reais (hover antes de click, multiple events), enquanto `fireEvent` apenas dispara um evento.

---

### 5. Assertions Específicas

❌ **ERRADO:**
```javascript
expect(screen.getByText('Admin')).toBeTruthy();
expect(result.current.users.length).toBeGreaterThan(0);
```

✅ **CORRETO:**
```javascript
expect(screen.getByText('Admin')).toBeInTheDocument();
expect(result.current.users).toHaveLength(3);
expect(result.current.users[0]).toEqual(expect.objectContaining({
  name: 'Admin User',
  role: 'superadmin',
}));
```

**Por quê?** Assertions específicas dão mensagens de erro mais claras e testam exatamente o esperado.

---

## 🧪 Estrutura de Testes

### AAA Pattern: Arrange, Act, Assert

```javascript
it('deve criar usuário com sucesso', async () => {
  // ===== ARRANGE (Setup) =====
  const user = userEvent.setup();
  const mockOnCreate = vi.fn();

  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ success: true, user: { id: '1' } }),
  });

  render(<UserForm onSubmit={mockOnCreate} />);

  // ===== ACT (Ação) =====
  const nameInput = screen.getByLabelText(/nome/i);
  const emailInput = screen.getByLabelText(/email/i);
  const submitButton = screen.getByRole('button', { name: /salvar/i });

  await user.type(nameInput, 'Test User');
  await user.type(emailInput, 'test@test.com');
  await user.click(submitButton);

  // ===== ASSERT (Validação) =====
  await waitFor(() => {
    expect(mockOnCreate).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'test@test.com',
    });
  });

  expect(screen.getByText(/usuário criado/i)).toBeInTheDocument();
});
```

---

### Descrição Clara de Testes

❌ **ERRADO:**
```javascript
describe('useAdminData', () => {
  it('works', () => {});
  it('test 2', () => {});
  it('should return data', () => {});
});
```

✅ **CORRETO:**
```javascript
describe('useAdminData', () => {
  describe('Carregamento Inicial', () => {
    it('deve carregar dados de usuários e empresas', async () => {});
    it('deve retornar loading=true durante fetch', () => {});
    it('deve retornar erro quando API falha', async () => {});
  });

  describe('Cálculo de Métricas', () => {
    it('deve calcular total de usuários por role', () => {});
    it('deve calcular total de empresas por plano', () => {});
  });
});
```

**Template:**
```
describe('[Nome do módulo/componente]', () => {
  describe('[Categoria de funcionalidade]', () => {
    it('deve [comportamento esperado] quando [condição]', () => {});
  });
});
```

---

## 🔄 Lifecycle e Cleanup

### beforeEach e afterEach

```javascript
describe('UserModal', () => {
  let user;
  let mockFetch;

  beforeEach(() => {
    // Setup comum a todos os testes
    user = userEvent.setup();
    mockFetch = vi.fn();
    global.fetch = mockFetch;

    // Limpar mocks
    vi.clearAllMocks();

    // Resetar localStorage
    localStorage.clear();
  });

  afterEach(() => {
    // Cleanup automático (já feito pelo setup.js, mas exemplo):
    // cleanup(); // RTL
    // vi.restoreAllMocks(); // Vitest
  });

  it('teste 1', () => {});
  it('teste 2', () => {});
});
```

**Regras:**
- Use `beforeEach` para setup comum
- Use `afterEach` para cleanup (se necessário)
- Use `beforeAll/afterAll` apenas para setup pesado e imutável

---

## 🎭 Mocking Eficiente

### Mock de Hooks

```javascript
// Arquivo de teste
vi.mock('@admin/context/AdminContext', () => ({
  useAdminContext: () => ({
    users: mockUsers,
    setUsers: vi.fn(),
    refetchData: vi.fn(),
  }),
}));

// Ou com factory function para controle por teste
const mockUseAdminContext = vi.fn();
vi.mock('@admin/context/AdminContext', () => ({
  useAdminContext: () => mockUseAdminContext(),
}));

beforeEach(() => {
  mockUseAdminContext.mockReturnValue({
    users: mockUsers,
    // ...
  });
});
```

---

### Mock de API (fetch)

```javascript
// Setup básico
global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: async () => ({ success: true, data: [] }),
});

// Mock com múltiplas respostas
global.fetch = vi.fn()
  .mockResolvedValueOnce({ ok: true, json: async () => ({ users: [] }) })
  .mockResolvedValueOnce({ ok: true, json: async () => ({ companies: [] }) });

// Mock condicional
global.fetch = vi.fn().mockImplementation((url) => {
  if (url.includes('/users')) {
    return Promise.resolve({
      ok: true,
      json: async () => ({ users: mockUsers }),
    });
  }
  if (url.includes('/companies')) {
    return Promise.resolve({
      ok: true,
      json: async () => ({ companies: mockCompanies }),
    });
  }
  return Promise.reject(new Error('Unknown endpoint'));
});
```

---

### Mock de Timers

```javascript
describe('Polling', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('deve fazer polling a cada 30 segundos', async () => {
    let fetchCallCount = 0;
    global.fetch = vi.fn().mockImplementation(() => {
      fetchCallCount++;
      return Promise.resolve({ ok: true, json: async () => ({}) });
    });

    renderHook(() => useAdminData({ pollingInterval: 30000 }));

    expect(fetchCallCount).toBe(1); // Chamada inicial

    // Avançar 30 segundos
    act(() => {
      vi.advanceTimersByTime(30000);
    });

    await waitFor(() => {
      expect(fetchCallCount).toBe(2);
    });
  });
});
```

---

## 🔍 Queries e Waiters

### Quando usar cada query

| Query | Retorna | Espera? | Throw? | Uso |
|-------|---------|---------|--------|-----|
| `getBy*` | Element | Não | Sim | Elemento existe |
| `queryBy*` | Element or null | Não | Não | Elemento pode não existir |
| `findBy*` | Promise<Element> | Sim | Sim | Elemento aparecerá |

```javascript
// Elemento existe agora
const button = screen.getByRole('button');

// Elemento pode não existir
const error = screen.queryByText(/erro/i);
expect(error).not.toBeInTheDocument();

// Elemento aparecerá depois
const success = await screen.findByText(/sucesso/i);
expect(success).toBeInTheDocument();
```

---

### waitFor vs findBy

❌ **Redundante:**
```javascript
await waitFor(() => {
  expect(screen.getByText('Success')).toBeInTheDocument();
});
```

✅ **Melhor:**
```javascript
const success = await screen.findByText('Success');
expect(success).toBeInTheDocument();
```

**Use `waitFor` quando:**
- Precisa esperar múltiplas condições
- Precisa esperar por side effects
- Precisa timeout customizado

```javascript
await waitFor(() => {
  expect(mockOnSuccess).toHaveBeenCalled();
  expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
}, { timeout: 5000 });
```

---

## 🎯 Test Coverage

### O que NÃO testar

❌ **Não testar:**
- Código de bibliotecas externas
- Código auto-gerado
- Trivialidades óbvias
- Implementação de frameworks

❌ **Exemplo ruim:**
```javascript
it('useState deve iniciar com valor correto', () => {
  // Isso testa React, não seu código
  const [count] = useState(0);
  expect(count).toBe(0);
});
```

---

### O que SIM testar

✅ **Testar:**
- Comportamento do usuário
- Edge cases
- Error states
- Loading states
- Validações
- Lógica de negócio

✅ **Exemplo bom:**
```javascript
it('deve validar email antes de submeter', async () => {
  const user = userEvent.setup();
  render(<UserForm />);

  const emailInput = screen.getByLabelText(/email/i);
  const submitButton = screen.getByRole('button', { name: /salvar/i });

  // Edge case: email inválido
  await user.type(emailInput, 'invalid-email');
  await user.click(submitButton);

  // Validação deve impedir submit
  expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
  expect(global.fetch).not.toHaveBeenCalled();
});
```

---

## 🚀 Performance de Testes

### Paralelização

```javascript
// vitest.config.js
export default defineConfig({
  test: {
    // Executar testes em paralelo
    threads: true,
    maxThreads: 4,

    // Isolar testes
    isolate: true,
  },
});
```

---

### Evitar Sleeps

❌ **ERRADO:**
```javascript
await sleep(1000); // Esperar 1 segundo
expect(screen.getByText('Success')).toBeInTheDocument();
```

✅ **CORRETO:**
```javascript
await waitFor(() => {
  expect(screen.getByText('Success')).toBeInTheDocument();
});
```

---

### Mocks Leves

❌ **PESADO:**
```javascript
// Mock toda a biblioteca
vi.mock('react-router-dom');
```

✅ **LEVE:**
```javascript
// Mock apenas o necessário
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));
```

---

## 🎨 Acessibilidade em Testes

### ARIA Roles

```javascript
// Preferir queries por role
const button = screen.getByRole('button', { name: /submit/i });
const heading = screen.getByRole('heading', { name: /title/i, level: 1 });
const textbox = screen.getByRole('textbox', { name: /email/i });
const checkbox = screen.getByRole('checkbox', { name: /accept terms/i });
const link = screen.getByRole('link', { name: /read more/i });
```

**Roles comuns:**
- `button`
- `heading` (com `level`)
- `textbox` (input type="text")
- `checkbox`
- `radio`
- `link`
- `dialog` (modal)
- `table`, `row`, `cell`
- `navigation`
- `main`

---

### ARIA Labels

```javascript
it('deve ter aria-labels em ícones sem texto', () => {
  render(<DeleteButton />);

  const button = screen.getByLabelText(/deletar/i);
  expect(button).toBeInTheDocument();
});

// Componente
<button aria-label="Deletar usuário">
  <FaTrash />
</button>
```

---

### Jest Axe

```javascript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

it('não deve ter violações de acessibilidade', async () => {
  const { container } = render(<UserModal />);

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

// Com configuração customizada
it('deve ter contraste AAA', async () => {
  const { container } = render(<Button />);

  const results = await axe(container, {
    rules: {
      'color-contrast': { enabled: true },
    },
  });

  expect(results).toHaveNoViolations();
});
```

---

## 📝 Documentação de Testes

### Comentários Úteis

```javascript
it('deve fazer retry após 3 falhas', async () => {
  let callCount = 0;

  global.fetch = vi.fn().mockImplementation(() => {
    callCount++;

    // Primeiras 2 chamadas: falha
    if (callCount <= 2) {
      return Promise.reject(new Error('Network error'));
    }

    // 3ª chamada: sucesso
    return Promise.resolve({
      ok: true,
      json: async () => ({ success: true, users: mockUsers }),
    });
  });

  const { result } = renderHook(() => useAdminData({ maxRetries: 3 }));

  // Aguardar até 3 tentativas (timeout generoso)
  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  }, { timeout: 5000 });

  // Validar que tentou 3 vezes
  expect(callCount).toBe(3);

  // Validar que dados foram carregados na 3ª tentativa
  expect(result.current.users).toEqual(mockUsers);
});
```

---

## 🐛 Debugging

### screen.debug()

```javascript
// Ver toda a árvore
screen.debug();

// Ver elemento específico
screen.debug(screen.getByRole('button'));

// Ver com mais linhas
screen.debug(undefined, Infinity);

// Salvar em variável
const html = screen.debug.toString();
console.log(html);
```

---

### logRoles()

```javascript
import { logRoles } from '@testing-library/react';

const { container } = render(<Component />);

// Ver todos os roles disponíveis
logRoles(container);
```

---

### Testing Playground

```javascript
screen.logTestingPlaygroundURL();
// Abre URL com UI interativa para explorar queries
```

---

## 📊 CI/CD

### GitHub Actions

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test:ci

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          fail_ci_if_error: true

      - name: Check coverage threshold
        run: |
          if [ $(grep -oP 'Lines\s+:\s+\K[\d.]+' coverage/coverage-summary.txt | head -1) -lt 80 ]; then
            echo "Coverage below 80%"
            exit 1
          fi
```

---

## 🎓 Recursos

### Leitura Recomendada
- [Testing Trophy and Testing Classifications](https://kentcdodds.com/blog/write-tests)
- [Common mistakes with React Testing Library](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Accessibility in Testing](https://testing-library.com/docs/queries/about/#priority)

### Ferramentas
- [Testing Playground](https://testing-playground.com/)
- [Jest Axe](https://github.com/nickcolley/jest-axe)
- [MSW (Mock Service Worker)](https://mswjs.io/)

---

**Última Atualização:** 2026-02-25
**Responsável:** @qa
**Revisores:** Community Best Practices
