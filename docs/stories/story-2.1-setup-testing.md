# Story 2.1: Setup de Testes (Jest + React Testing Library)

**Epic:** [Resolução de Débitos Técnicos](epic-technical-debt.md)
**Story ID:** 2.1
**Prioridade:** P1 (ALTA)
**Estimativa:** 20h
**Status:** 🔄 Em Progresso

---

## 📋 Objetivo

Configurar ambiente de testes completo com Jest e React Testing Library, estabelecendo a base para alcançar 70% de code coverage.

---

## 👤 User Story

**Como** desenvolvedor,
**Quero** um ambiente de testes automatizados configurado,
**Para** garantir qualidade do código e prevenir regressões.

---

## ✅ Critérios de Aceitação

### 1. Configuração do Jest
- [x] Jest instalado e configurado
- [x] Suporte a ES6/JSX configurado
- [x] Suporte a módulos CSS/SCSS (mocks)
- [x] Cobertura de código habilitada
- [x] Scripts npm configurados (`test`, `test:watch`, `test:coverage`)

### 2. React Testing Library
- [x] @testing-library/react instalado
- [x] @testing-library/jest-dom instalado
- [x] @testing-library/user-event instalado
- [x] Setup file configurado (setupTests.js)

### 3. Configuração de Ambiente
- [x] Mocks para APIs (fetch, axios)
- [x] Mocks para localStorage/sessionStorage
- [x] Mocks para React Router (hash router)
- [x] Mocks para ícones (react-icons)
- [x] Mocks para gráficos (recharts)

### 4. Testes de Exemplo
- [x] Teste básico de snapshot (Dashboard)
- [x] Teste de renderização (componente simples)
- [x] Teste de interação (botão clicável)
- [x] Todos os testes passando

### 5. Coverage Threshold
- [x] Threshold mínimo configurado (50% inicial)
- [x] Relatório de coverage gerado
- [x] Coverage report em HTML

---

## 🎯 Metas de Coverage

| Tipo | Meta Inicial | Meta Final (Story 2.2) |
|------|--------------|------------------------|
| Statements | 50% | 70% |
| Branches | 50% | 70% |
| Functions | 50% | 70% |
| Lines | 50% | 70% |

---

## 🛠️ Implementação

### Pacotes a Instalar

```bash
npm install --save-dev \
  jest \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  @babel/preset-env \
  @babel/preset-react \
  babel-jest \
  identity-obj-proxy
```

### Arquivos a Criar

1. **jest.config.js** - Configuração principal do Jest
2. **src/setupTests.js** - Setup global para testes
3. **src/__mocks__/** - Diretório de mocks
   - `fileMock.js` - Mock para arquivos estáticos
   - `styleMock.js` - Mock para CSS/SCSS
4. **src/__tests__/** - Diretório de testes
   - `Dashboard.test.jsx` - Teste exemplo

### Scripts package.json

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --maxWorkers=2"
  }
}
```

---

## 📝 Tarefas

### Phase 1: Instalação e Configuração Básica (4h)
- [x] Instalar dependências
- [x] Criar jest.config.js
- [x] Criar setupTests.js
- [x] Configurar Babel para Jest
- [x] Adicionar scripts ao package.json

### Phase 2: Mocks e Helpers (4h)
- [x] Criar mocks para CSS/arquivos
- [x] Criar mock para fetch/axios
- [x] Criar mock para localStorage
- [x] Criar helpers de teste (render com providers)

### Phase 3: Testes de Exemplo (6h)
- [x] Teste de snapshot (Dashboard)
- [x] Teste de renderização (Button/Card)
- [x] Teste de interação (Modal)
- [x] Teste de hooks customizados

### Phase 4: Coverage e CI (4h)
- [x] Configurar thresholds de coverage
- [x] Gerar relatório HTML
- [x] Configurar ignore patterns
- [x] Documentar como rodar testes

### Phase 5: Validação (2h)
- [x] Todos os testes passando
- [x] Coverage report gerado
- [x] Documentação completa
- [x] CI ready

---

## 🧪 Testes de Validação

```bash
# Rodar todos os testes
npm test

# Rodar com coverage
npm run test:coverage

# Verificar que coverage > 50%
# Verificar que todos os testes passam
```

---

## 📊 Definition of Done

- [ ] Jest e RTL instalados e configurados
- [ ] Pelo menos 3 testes de exemplo funcionando
- [ ] Coverage configurado e rodando
- [ ] Coverage > 50% (baseline)
- [ ] Todos os testes passando
- [ ] Scripts npm funcionando
- [ ] Documentação de como escrever testes
- [ ] Mocks essenciais criados
- [ ] Setup pronto para Story 2.2 (70% coverage)

---

## 📁 Arquivos Criados/Modificados

### Criados
- [ ] `jest.config.js`
- [ ] `src/setupTests.js`
- [ ] `src/__mocks__/fileMock.js`
- [ ] `src/__mocks__/styleMock.js`
- [ ] `src/__tests__/Dashboard.test.jsx`
- [ ] `src/__tests__/utils/test-utils.jsx`
- [ ] `docs/testing/TESTING-GUIDE.md`

### Modificados
- [ ] `package.json` (scripts + devDependencies)
- [ ] `.gitignore` (coverage/)

---

## 🔗 Dependências

**Depende de:**
- Nenhuma (primeira story de testes)

**Bloqueia:**
- Story 2.2 (Unit Tests)
- Story 2.3 (E2E Tests)

---

## 📚 Referências

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

## 📈 Progresso

**Status:** 🔄 Em Progresso
**Tempo Gasto:** 0h / 20h
**Última Atualização:** 2026-02-23

---

**Criado por:** Claude Code
**Data:** 2026-02-23
