# Story 1.1: Implementar WCAG 2.1 AA Compliance

**Story ID:** TECH-DEBT-1.1
**Epic:** [epic-technical-debt.md](epic-technical-debt.md)
**Prioridade:** P0 (CRÍTICA)
**Esforço:** 80 horas
**Assignee:** TBD
**Status:** Planejado

---

## 📋 User Story

**Como** usuário com deficiência visual
**Eu quero** poder navegar a plataforma usando leitores de tela e teclado
**Para que** eu possa usar todas as funcionalidades de forma independente

---

## 🎯 Critérios de Aceite

### AC1: Navegação por Teclado
- ✅ Todos os elementos interativos acessíveis via Tab
- ✅ Tab order lógico (top-to-bottom, left-to-right)
- ✅ Focus visible em todos os elementos
- ✅ Esc fecha modais
- ✅ Enter/Space ativa botões

### AC2: ARIA Labels
- ✅ Todos os botões têm aria-label ou texto visível
- ✅ Modais têm aria-modal="true" e role="dialog"
- ✅ Dropdowns têm aria-expanded
- ✅ Forms têm labels associados corretamente
- ✅ Ícones decorativos têm aria-hidden="true"

### AC3: Contraste de Cores (WCAG AA)
- ✅ Texto normal: contraste ≥4.5:1
- ✅ Texto grande: contraste ≥3:1
- ✅ Componentes UI: contraste ≥3:1
- ✅ Validado via axe DevTools

### AC4: Screen Reader Compatible
- ✅ NVDA/JAWS consegue ler todos os elementos
- ✅ Conteúdo dinâmico anunciado via aria-live
- ✅ Tabelas têm cabeçalhos corretos
- ✅ Listas semânticas (ul, ol)

### AC5: Lighthouse Accessibility Score
- ✅ Desktop: ≥90
- ✅ Mobile: ≥90
- ✅ axe-core: 0 violations

---

## 🛠️ Tasks

- [ ] 1. Audit inicial com Lighthouse + axe DevTools (2h)
- [ ] 2. Implementar focus management global (8h)
- [ ] 3. Adicionar ARIA labels em todos os componentes (20h)
  - [ ] Dashboard
  - [ ] CRM
  - [ ] Inbox
  - [ ] Integrations
  - [ ] Contacts
  - [ ] Companies
  - [ ] Team
  - [ ] Profile
- [ ] 4. Corrigir contraste de cores (10h)
- [ ] 5. Implementar navegação por teclado em modais (8h)
- [ ] 6. Adicionar skip links (2h)
- [ ] 7. Testar com NVDA/JAWS (8h)
- [ ] 8. Corrigir issues encontrados (15h)
- [ ] 9. Audit final + documentação (7h)

**Total:** 80 horas

---

## 🧪 Testes

### Testes Manuais
- [ ] Navegação por teclado em todos os componentes
- [ ] NVDA lê corretamente todos os elementos
- [ ] JAWS lê corretamente todos os elementos
- [ ] Contraste validado com Colour Contrast Analyser

### Testes Automatizados
- [ ] axe-core: 0 violations
- [ ] Lighthouse Accessibility: ≥90
- [ ] Jest + @testing-library/react (render + keyboard events)

---

## 📚 Recursos

- [WCAG 2.1 AA Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

---

## ⚠️ Riscos

- **Risco:** Falta de expertise em acessibilidade
  - **Mitigação:** Contratar consultor (R$ 10k orçado)

---

## ✅ Definition of Done

- ✅ Lighthouse Accessibility ≥90 (desktop + mobile)
- ✅ axe-core: 0 violations
- ✅ NVDA/JAWS testado em todos os componentes
- ✅ Navegação por teclado 100% funcional
- ✅ Code review aprovado
- ✅ QA sign-off

---

**Criado por:** @pm (Morgan)
**Data:** 2026-02-23
