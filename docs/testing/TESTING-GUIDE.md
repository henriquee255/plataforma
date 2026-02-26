# Guia de Testes - Plataforma CRM

**Atualizado:** 23 de Fevereiro de 2026
**Coverage Atual:** 1.18%
**Meta:** 70% (Story 2.2)

---

## 🎯 Objetivo

Este guia documenta como escrever e executar testes na Plataforma CRM usando Jest e React Testing Library.

---

## 🛠️ Stack de Testes

- **Jest** - Test runner e framework de testes
- **React Testing Library** - Biblioteca para testar componentes React
- **@testing-library/jest-dom** - Matchers customizados para DOM
- **@testing-library/user-event** - Simular interações de usuário

---

## 📁 Estrutura de Testes

```
src/
├── __tests__/
│   ├── utils/
│   │   └── test-utils.jsx          # Helpers de teste
│   ├── components/
│   │   ├── Modal.test.jsx          # Testes de componente
│   │   └── ScreenReaderAnnouncer.test.jsx
│   └── App.test.jsx
├── __mocks__/
│   ├── fileMock.js                 # Mock para arquivos estáticos
│   ├── styleMock.js                # Mock para CSS
│   └── rechartsMock.js             # Mock para Recharts
└── setupTests.js                   # Configuração global
```

---

## 🚀 Comandos

```bash
# Rodar todos os testes
npm test

# Rodar em modo watch (re-executa ao salvar)
npm run test:watch

# Gerar relatório de coverage
npm run test:coverage

# Rodar testes para CI
npm run test:ci
```

---

## ✍️ Como Escrever Testes

### 1. Teste Básico de Renderização

```jsx
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('should render without crashing', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### 2. Teste de Interação

```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from './Button';

describe('Button', () => {
  it('should call onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### 3. Teste com Props

```jsx
it('should render with custom title', () => {
  render(<Modal title="Custom Title" isOpen={true} />);
  expect(screen.getByText('Custom Title')).toBeInTheDocument();
});
```

### 4. Teste de ARIA Attributes

```jsx
it('should have correct ARIA attributes', () => {
  render(<Modal isOpen={true} title="Test" />);

  const dialog = screen.getByRole('dialog');
  expect(dialog).toHaveAttribute('aria-modal', 'true');
  expect(dialog).toHaveAttribute('aria-labelledby');
});
```

### 5. Teste de Estado Condicional

```jsx
it('should not render when closed', () => {
  const { container } = render(<Modal isOpen={false} />);
  expect(container.firstChild).toBeNull();
});
```

---

## 🧪 Matchers Úteis

### DOM Matchers (jest-dom)

```jsx
// Elemento existe no DOM
expect(element).toBeInTheDocument();

// Elemento é visível
expect(element).toBeVisible();

// Elemento tem classe CSS
expect(element).toHaveClass('active');

// Elemento tem atributo
expect(element).toHaveAttribute('aria-label', 'Close');

// Elemento tem texto
expect(element).toHaveTextContent('Hello World');

// Input tem valor
expect(input).toHaveValue('test@example.com');

// Checkbox está marcado
expect(checkbox).toBeChecked();

// Elemento está desabilitado
expect(button).toBeDisabled();
```

### Jest Matchers

```jsx
// Função foi chamada
expect(mockFn).toHaveBeenCalled();

// Função foi chamada N vezes
expect(mockFn).toHaveBeenCalledTimes(3);

// Função foi chamada com argumentos
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');

// Array contém item
expect(array).toContain(item);

// Objeto tem propriedade
expect(obj).toHaveProperty('name', 'John');

// Valor é verdadeiro
expect(value).toBeTruthy();

// Valor é falso
expect(value).toBeFalsy();
```

---

## 🔍 Queries

### Prioridade de Queries (do mais acessível ao menos)

1. **getByRole** (Preferido - usa ARIA roles)
   ```jsx
   screen.getByRole('button', { name: /submit/i });
   ```

2. **getByLabelText** (Para forms)
   ```jsx
   screen.getByLabelText('Email');
   ```

3. **getByPlaceholderText**
   ```jsx
   screen.getByPlaceholderText('Digite seu email');
   ```

4. **getByText**
   ```jsx
   screen.getByText('Hello World');
   ```

5. **getByTestId** (Último recurso)
   ```jsx
   screen.getByTestId('custom-element');
   ```

### Variantes de Queries

- **getBy...** - Lança erro se não encontrar (para afirmar existência)
- **queryBy...** - Retorna null se não encontrar (para afirmar não-existência)
- **findBy...** - Retorna Promise (para esperar elemento aparecer)

```jsx
// Elemento existe
expect(screen.getByText('Hello')).toBeInTheDocument();

// Elemento não existe
expect(screen.queryByText('Goodbye')).not.toBeInTheDocument();

// Esperar elemento aparecer (async)
const element = await screen.findByText('Loaded!');
```

---

## 🎭 Mocking

### 1. Mock de Função

```jsx
const mockFn = jest.fn();
mockFn.mockReturnValue(42);

expect(mockFn()).toBe(42);
```

### 2. Mock de Módulo

```jsx
jest.mock('../../utils/api', () => ({
  fetchData: jest.fn(() => Promise.resolve({ data: 'mock' })),
}));
```

### 3. Mock de localStorage

```jsx
// Já configurado em setupTests.js
localStorage.setItem('key', 'value');
expect(localStorage.setItem).toHaveBeenCalledWith('key', 'value');
```

### 4. Mock de fetch

```jsx
// Já configurado em setupTests.js
global.fetch.mockResolvedValueOnce({
  json: async () => ({ success: true }),
  ok: true,
});
```

---

## 📊 Coverage

### Ver Relatório

Após executar `npm run test:coverage`, abra:

```
coverage/lcov-report/index.html
```

### Interpretar Resultados

- **Statements:** % de declarações executadas
- **Branches:** % de branches (if/else) testados
- **Functions:** % de funções executadas
- **Lines:** % de linhas executadas

**Meta:** ≥70% em todas as métricas

---

## ✅ Boas Práticas

### 1. Escreva Testes Legíveis

```jsx
// ❌ Ruim
it('t1', () => { /* ... */ });

// ✅ Bom
it('should call onClose when close button is clicked', () => { /* ... */ });
```

### 2. Use describe para Agrupar

```jsx
describe('Modal Component', () => {
  describe('when opened', () => {
    it('should render content', () => { /* ... */ });
    it('should have focus trap', () => { /* ... */ });
  });

  describe('when closed', () => {
    it('should not render', () => { /* ... */ });
  });
});
```

### 3. Limpe Mocks

```jsx
beforeEach(() => {
  mockFn.mockClear();
});
```

### 4. Teste Comportamento, Não Implementação

```jsx
// ❌ Ruim - testa implementação
expect(component.state.count).toBe(1);

// ✅ Bom - testa comportamento
expect(screen.getByText('Count: 1')).toBeInTheDocument();
```

### 5. Evite Testes Frágeis

```jsx
// ❌ Frágil - quebra se mudar ordem
const buttons = screen.getAllByRole('button');
fireEvent.click(buttons[2]);

// ✅ Robusto - usa identificador semântico
fireEvent.click(screen.getByLabelText('Submit'));
```

---

## 🐛 Troubleshooting

### Erro: "Unable to find element"

**Causa:** Elemento não está no DOM ou query está errada.

**Solução:**
```jsx
// Ver o que está renderizado
screen.debug();

// Ver HTML completo
console.log(container.innerHTML);
```

### Erro: "Not wrapped in act(...)"

**Causa:** Mudança de estado assíncrona.

**Solução:**
```jsx
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});
```

### Erro: "Cannot find module"

**Causa:** Import não mockado.

**Solução:** Adicione mock em `jest.config.js` ou crie arquivo em `__mocks__/`.

---

## 📚 Recursos

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library Queries](https://testing-library.com/docs/queries/about/)
- [Common Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

## 🎯 Próximos Passos

1. **Story 2.2** - Escrever unit tests para alcançar 70% coverage
2. **Story 2.3** - Implementar E2E tests com Cypress

---

**Criado:** 2026-02-23
**Responsável:** Claude Code
**Status:** ✅ Setup Completo
