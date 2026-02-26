# Epic: Resolução de Débitos Técnicos - Plataforma CRM

**Epic ID:** EPIC-TECH-DEBT-2026
**Criado por:** @pm (Morgan via Bob)
**Data:** 2026-02-23
**Status:** Planejado
**Prioridade:** CRÍTICA

---

## 📋 Objetivo do Epic

Resolver **25 débitos técnicos** identificados no Brownfield Discovery, transformando a Plataforma CRM em um produto **escalável, seguro, acessível e mobile-friendly**.

**Resultado Esperado:** Produto pronto para crescimento com fundação sólida (testes ≥70%, WCAG AA, auth, design system, mobile otimizado).

---

## 🎯 Escopo

### In-Scope
- ✅ 100% de acessibilidade (WCAG 2.1 AA)
- ✅ Autenticação e autorização (JWT + protected routes)
- ✅ Design system + 10 componentes reutilizáveis
- ✅ Mobile-first optimization
- ✅ Test coverage ≥70% (unit + integration + E2E)
- ✅ API integration layer (zero dados mockados)
- ✅ Error handling global + monitoring (Sentry)
- ✅ CI/CD pipeline (GitHub Actions)

### Out-of-Scope (Futuro)
- ❌ Migração TypeScript completa (apenas planejamento)
- ❌ Performance optimization avançado (P4 itens)
- ❌ Novas features de produto

---

## 📊 Métricas de Sucesso

| Métrica | Baseline | Target | Como Medir |
|---------|----------|--------|------------|
| Lighthouse Accessibility | 0 | ≥90 | Lighthouse audit |
| Test Coverage | 0% | ≥70% | Jest coverage report |
| Lighthouse Performance | ~70 | ≥80 | Lighthouse audit |
| Lighthouse Mobile | ~60 | ≥80 | Lighthouse mobile audit |
| Dados Mockados | 100% | 0% | Code search |
| Componentes Reutilizáveis | 2 | ≥10 | Storybook count |
| Deployment Time | Manual | <5min | CI/CD metrics |
| Error Rate | Unknown | <1% | Sentry dashboard |

---

## ⏱️ Timeline

**Duração Total:** 20 sprints (10 semanas com 2 devs | 20 semanas com 1 dev)

| Fase | Sprints | Timeline | Investimento |
|------|---------|----------|--------------|
| **Fase 1: Quick Wins** | 1 sprint | 1 semana | R$ 24.000 |
| **Fase 2: Fundação** | 3 sprints | 3 semanas | R$ 65.000 |
| **Fase 3: Segurança & Mobile** | 4 sprints | 4 semanas | R$ 55.000 |
| **Fase 4: Escalabilidade** | 2 sprints | 2 semanas | R$ 21.000 |

**Total:** R$ 165.000 | 1,100 horas

---

## 💰 Budget Aprovado

**Total:** R$ 165.000

**Breakdown:**
- Dev sênior (R$ 150/hora x 1,100h): R$ 165.000
- Consultor acessibilidade: R$ 10.000 (incluído)
- Ferramentas (Sentry, Chromatic): R$ 1.200/mês

**Aprovação:** Aguardando stakeholders

---

## 📚 Lista de Stories

### Prioridade P0 (CRÍTICA - Sprint 1-2)
- [Story 1.1](story-1.1-wcag-aa-compliance.md): Implementar WCAG 2.1 AA Compliance
- [Story 1.2](story-1.2-accessibility-audit.md): Auditoria de Acessibilidade

### Prioridade P1 (ALTA - Sprint 3-8)
- [Story 2.1](story-2.1-setup-testing.md): Setup de Testes (Jest + RTL)
- [Story 2.2](story-2.2-unit-tests.md): Unit Tests (70% coverage)
- [Story 2.3](story-2.3-e2e-tests.md): E2E Tests (Cypress)
- [Story 2.4](story-2.4-design-system.md): Criar Design System (Shadcn UI)
- [Story 2.5](story-2.5-base-components.md): Componentes Reutilizáveis Base (10)
- [Story 2.6](story-2.6-authentication.md): Implementar Autenticação JWT
- [Story 2.7](story-2.7-protected-routes.md): Protected Routes + RBAC
- [Story 2.8](story-2.8-mobile-optimization.md): Mobile-First Optimization
- [Story 2.9](story-2.9-error-states.md): Error States (Toast System)

### Prioridade P2 (MÉDIA - Sprint 9-12)
- [Story 3.1](story-3.1-api-integration.md): API Integration Layer
- [Story 3.2](story-3.2-monitoring.md): Monitoring (Sentry)
- [Story 3.3](story-3.3-loading-states.md): Loading States (Skeleton)
- [Story 3.4](story-3.4-dark-mode.md): Corrigir Dark Mode
- [Story 3.5](story-3.5-empty-states.md): Empty States
- [Story 3.6](story-3.6-refactor-files.md): Modularizar Arquivos Grandes

### Prioridade P3 (Sprint 13-16)
- [Story 4.1](story-4.1-react-router.md): Implementar React Router
- [Story 4.2](story-4.2-ci-cd.md): CI/CD Pipeline (GitHub Actions)
- [Story 4.3](story-4.3-error-handling.md): Global Error Handling

### Backlog (Futuro)
- TypeScript Migration Plan
- Bundle Optimization
- Virtualização de Listas
- Animações (Framer Motion)

---

## 🚧 Riscos e Mitigações

| Risco | Mitigação |
|-------|-----------|
| Falta de especialista em acessibilidade | Contratar consultor (R$ 10k já orçado) |
| Mobile redesign excede timeline | Protótipos validados antes de implementar |
| Testes revelam bugs críticos | Buffer 20% já incluído (100h) |
| Design system sem buy-in | Designer envolvido desde Sprint 1 |

---

## 📈 Progresso

| Fase | Status | Progresso |
|------|--------|-----------|
| Fase 1: Quick Wins | ⏳ Planejado | 0% |
| Fase 2: Fundação | ⏳ Planejado | 0% |
| Fase 3: Segurança & Mobile | ⏳ Planejado | 0% |
| Fase 4: Escalabilidade | ⏳ Planejado | 0% |

**Epic Progress:** 0/25 stories completas

---

## ✅ Definition of Done (Epic)

Epic completo quando:
- ✅ Lighthouse Accessibility ≥90
- ✅ Test coverage ≥70%
- ✅ Auth funcional (JWT + protected routes)
- ✅ Design system + 10 componentes documentados no Storybook
- ✅ Mobile Lighthouse ≥80
- ✅ 0 dados mockados (API integrada)
- ✅ Sentry monitoring ativo
- ✅ CI/CD deploy automático
- ✅ Todas as 25 stories P0-P3 completas
- ✅ QA sign-off

---

## 📎 Documentação de Referência

- [Technical Debt Assessment](../prd/technical-debt-assessment.md)
- [Technical Debt Report (Executivo)](../reports/TECHNICAL-DEBT-REPORT.md)
- [System Architecture](../architecture/system-architecture.md)
- [Frontend/UX Spec](../frontend/frontend-spec.md)

---

**Criado por:** @pm (Morgan) via Bob
**Aprovado por:** Aguardando
**Data:** 2026-02-23
**Status:** 📋 Planejado - Aguardando aprovação de budget
