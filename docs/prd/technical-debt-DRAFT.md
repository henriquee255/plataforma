# Technical Debt Assessment - DRAFT

**Projeto:** Plataforma de CRM/Vendas
**Data:** 2026-02-23
**Versão:** 1.0 (DRAFT - Para Revisão)
**Consolidado por:** @architect via Bob (PM Mode)

---

## ⚠️ ESTE É UM DRAFT

Este documento consolida os débitos técnicos identificados nas fases de coleta (Sistema e Frontend/UX). Aguarda revisão e validação dos especialistas antes da versão final.

**Status das Validações:**
- ⏳ **PENDENTE:** Revisão @ux-design-expert (Frontend/UX)
- ⏳ **PENDENTE:** Revisão @qa (Quality Gate)

---

## 📋 Executive Summary

**Total de Débitos Identificados:** 22

**Por Severidade:**
- 🔴 **CRÍTICA:** 1 débito
- ❌ **ALTA:** 7 débitos
- ⚠️ **MÉDIA:** 10 débitos
- ⚡ **BAIXA:** 4 débitos

**Esforço Total Estimado:** ~540 horas (~3.5 meses com 1 dev full-time)

**Áreas Afetadas:**
- Sistema/Arquitetura: 10 débitos
- Frontend/UX: 12 débitos
- Database: 0 débitos (sem database detectado)

---

## 🏗️ 1. Débitos de Sistema/Arquitetura

*Fonte: docs/architecture/system-architecture.md*

| ID | Débito | Severidade | Esforço | Impacto | Prioridade |
|----|--------|------------|---------|---------|------------|
| SYS-01 | Falta de Testes | ALTA | 80h | Alto - Risco de regressão | P1 |
| SYS-02 | Dados Mockados no Código | MÉDIA | 40h | Médio - Não escalável | P2 |
| SYS-03 | Navegação Manual (Sem React Router) | MÉDIA | 20h | Médio - Sem deep linking | P3 |
| SYS-04 | Sem Autenticação/Autorização | ALTA | 60h | Crítico - Segurança | P1 |
| SYS-05 | Configurações Hardcoded | BAIXA | 8h | Baixo - Deploy | P4 |
| SYS-06 | Sem Tratamento de Erro Global | MÉDIA | 24h | Médio - UX ruim | P2 |
| SYS-07 | Código Duplicado | BAIXA | 30h | Baixo - Manutenção | P4 |
| SYS-08 | Dependências Não Otimizadas | BAIXA | 16h | Baixo - Performance inicial | P4 |
| SYS-09 | Falta de TypeScript | MÉDIA | 80h | Médio - Type safety | P3 |
| SYS-10 | Sem CI/CD | MÉDIA | 16h | Médio - Deploy manual | P3 |

**Subtotal Sistema:** 374 horas

**Detalhes:**

### SYS-01: Falta de Testes ⚠️ ALTA
- **Descrição:** Zero cobertura de testes (unit, integration, E2E)
- **Impacto:** Risco de regressão em cada mudança, bugs não detectados
- **Recomendação:** Jest + React Testing Library + Cypress
- **Dependências:** Nenhuma
- **Esforço:** 80 horas

### SYS-02: Dados Mockados no Código ⚠️ MÉDIA
- **Descrição:** Arrays hardcoded em Dashboard.jsx, CRM.jsx, etc.
- **Impacto:** Não conectável a backend real, dificulta manutenção
- **Recomendação:** Abstrair para API layer (axios/fetch) + mock service
- **Dependências:** SYS-04 (auth para API calls)
- **Esforço:** 40 horas

### SYS-03: Navegação Manual (Sem React Router) ⚠️ MÉDIA
- **Descrição:** Navegação via props onNavigate, sem roteamento real
- **Impacto:** Sem deep linking, sem histórico do navegador, SEO ruim
- **Recomendação:** Implementar React Router v6
- **Dependências:** Refatorar MainLayout
- **Esforço:** 20 horas

### SYS-04: Sem Autenticação/Autorização 🔴 ALTA
- **Descrição:** Não há sistema de login ou proteção de rotas
- **Impacto:** Aplicação completamente aberta, risco de segurança crítico
- **Recomendação:** JWT auth + protected routes + role-based access
- **Dependências:** SYS-03 (React Router para protected routes)
- **Esforço:** 60 horas

### SYS-05: Configurações Hardcoded ⚡ BAIXA
- **Descrição:** URLs de API, chaves podem estar hardcoded
- **Impacto:** Dificulta deploy em ambientes diferentes (dev/staging/prod)
- **Recomendação:** Variáveis de ambiente (.env) + Vite env vars
- **Dependências:** Nenhuma
- **Esforço:** 8 horas

### SYS-06: Sem Tratamento de Erro Global ⚠️ MÉDIA
- **Descrição:** Não há ErrorBoundary ou sistema de log
- **Impacto:** Erros podem crashar a aplicação sem feedback ao usuário
- **Recomendação:** ErrorBoundary + Sentry/LogRocket
- **Dependências:** Nenhuma
- **Esforço:** 24 horas

### SYS-07: Código Duplicado ⚡ BAIXA
- **Descrição:** Lógica duplicada entre componentes (tabelas, modais)
- **Impacto:** Manutenção difícil, bugs replicados
- **Recomendação:** Refatorar para hooks customizados + componentes reutilizáveis
- **Dependências:** UX-02 (biblioteca de componentes)
- **Esforço:** 30 horas

### SYS-08: Dependências Não Otimizadas ⚡ BAIXA
- **Descrição:** Bundle pode ser reduzido com code splitting
- **Impacto:** Performance inicial (First Contentful Paint)
- **Recomendação:** Lazy loading + Suspense + route-based splitting
- **Dependências:** SYS-03 (React Router para route splitting)
- **Esforço:** 16 horas

### SYS-09: Falta de TypeScript ⚠️ MÉDIA
- **Descrição:** Projeto em JavaScript puro
- **Impacto:** Erros de tipo em tempo de desenvolvimento, refatorações arriscadas
- **Recomendação:** Migrar para TypeScript gradualmente (.jsx → .tsx)
- **Dependências:** Longo prazo, baixa prioridade
- **Esforço:** 80 horas

### SYS-10: Sem CI/CD ⚠️ MÉDIA
- **Descrição:** Não há pipeline de deploy automático
- **Impacto:** Deploy manual, risco de erro humano, sem testes automáticos
- **Recomendação:** GitHub Actions (lint + test + build + deploy)
- **Dependências:** SYS-01 (testes para CI)
- **Esforço:** 16 horas

---

## 🎨 2. Débitos de Frontend/UX

*Fonte: docs/frontend/frontend-spec.md*

| ID | Débito | Severidade | Esforço | Impacto UX | Prioridade |
|----|--------|------------|---------|------------|------------|
| UX-01 | Sem Design System Estruturado | ALTA | 40h | Alto - Inconsistências | P1 |
| UX-02 | Componentes Não Reutilizáveis | ALTA | 60h | Alto - Código duplicado | P1 |
| UX-03 | Arquivos Muito Grandes | MÉDIA | 30h | Médio - Manutenção | P2 |
| UX-04 | Acessibilidade Zero | CRÍTICA | 80h | Crítico - Exclusão | P0 |
| UX-05 | Mobile Não Otimizado | ALTA | 100h | Alto - 50% usuários | P1 |
| UX-06 | Sem Estados de Loading | MÉDIA | 20h | Médio - UX confusa | P2 |
| UX-07 | Sem Estados de Erro | ALTA | 30h | Alto - Frustração | P1 |
| UX-08 | Dados Mockados (Duplicado SYS-02) | MÉDIA | 0h | - | - |
| UX-09 | Sem Virtualização de Listas | BAIXA | 15h | Baixo - Performance | P4 |
| UX-10 | Drag-and-Drop Básico | MÉDIA | 25h | Médio - UX em mobile | P3 |
| UX-11 | Inconsistências Visuais | BAIXA | 20h | Baixo - Estética | P4 |
| UX-12 | Sem Animações/Transições | BAIXA | 15h | Baixo - Polimento | P4 |

**Subtotal Frontend/UX:** 435 horas (excluindo UX-08 que é duplicado de SYS-02)

**Ajuste:** 435h (UX) - 40h (duplicado) = **395 horas**

**Detalhes:**

### UX-01: Sem Design System Estruturado ⚠️ ALTA
- **Descrição:** Cores, tipografia, spacing não documentados
- **Impacto:** Inconsistências visuais entre páginas, difícil onboarding de designers
- **Recomendação:** Criar design system (Storybook + Figma + design tokens)
- **Dependências:** Nenhuma
- **Esforço:** 40 horas

### UX-02: Componentes Não Reutilizáveis ⚠️ ALTA
- **Descrição:** Modais, dropdowns, tabelas duplicados em cada arquivo
- **Impacto:** Código repetido, bugs duplicados, 60% do código é duplicação
- **Recomendação:** Biblioteca de componentes base (Button, Input, Modal, Dropdown, Card)
- **Dependências:** UX-01 (design system)
- **Esforço:** 60 horas

### UX-03: Arquivos Muito Grandes ⚠️ MÉDIA
- **Descrição:** CRM.jsx ~1500 linhas, Inbox.jsx ~1000 linhas
- **Impacto:** Difícil manutenção, lentidão em dev server
- **Recomendação:** Modularizar em componentes menores (máx 300 linhas/arquivo)
- **Dependências:** UX-02 (componentes reutilizáveis)
- **Esforço:** 30 horas

### UX-04: Acessibilidade Zero 🔴 CRÍTICA
- **Descrição:** Sem ARIA labels, navegação por teclado, leitores de tela
- **Impacto:** Exclusão de usuários com deficiências, não atende WCAG 2.1 AA, risco legal
- **Recomendação:** Implementar WCAG 2.1 AA (ARIA, keyboard nav, contrast)
- **Dependências:** UX-02 (componentes acessíveis desde o início)
- **Esforço:** 80 horas
- **Observação:** ⚠️ MAIOR RISCO LEGAL

### UX-05: Mobile Não Otimizado ⚠️ ALTA
- **Descrição:** Sidebar, CRM, Inbox não funcionam bem em mobile
- **Impacto:** UX ruim em 50%+ dos usuários (mobile-first)
- **Recomendação:** Redesign mobile-first (drawer, tabs, full-screen modals)
- **Dependências:** UX-02 (componentes responsivos)
- **Esforço:** 100 horas

### UX-06: Sem Estados de Loading ⚠️ MÉDIA
- **Descrição:** Ausência de skeleton screens, spinners
- **Impacto:** UX confusa (usuário não sabe se sistema está processando), clicks duplos
- **Recomendação:** Skeleton screens + spinners inline + disabled states
- **Dependências:** Nenhuma (quick win)
- **Esforço:** 20 horas

### UX-07: Sem Estados de Erro ⚠️ ALTA
- **Descrição:** Erros não são exibidos ao usuário
- **Impacto:** Frustração, perda de dados, usuário não sabe o que deu errado
- **Recomendação:** Toast system (react-hot-toast) + error boundaries
- **Dependências:** SYS-06 (error boundaries globais)
- **Esforço:** 30 horas

### UX-09: Sem Virtualização de Listas ⚡ BAIXA
- **Descrição:** Tabelas/listas renderizam todos os itens
- **Impacto:** Performance ruim com >500 itens (travamentos)
- **Recomendação:** React Virtualized ou Tanstack Virtual
- **Dependências:** Baixa prioridade
- **Esforço:** 15 horas

### UX-10: Drag-and-Drop Básico ⚠️ MÉDIA
- **Descrição:** CRM drag sem visual feedback, sem touch support
- **Impacto:** UX ruim em mobile (50% dos usuários), confusa em desktop
- **Recomendação:** React DnD ou dnd-kit (touch support)
- **Dependências:** UX-05 (mobile optimization)
- **Esforço:** 25 horas

### UX-11: Inconsistências Visuais ⚡ BAIXA
- **Descrição:** Botões, inputs, cards com estilos variados
- **Impacto:** Aparência não profissional
- **Recomendação:** Normalizar com design system
- **Dependências:** UX-01 (design system)
- **Esforço:** 20 horas

### UX-12: Sem Animações/Transições ⚡ BAIXA
- **Descrição:** Modais aparecem sem animação, mudanças abruptas
- **Impacto:** UX menos polida, sensação de "site de 2010"
- **Recomendação:** Framer Motion ou Tailwind animations
- **Dependências:** UX-02 (componentes animados)
- **Esforço:** 15 horas

---

## 📊 3. Matriz Preliminar de Priorização

### Prioridade P0 (CRÍTICA - Fazer AGORA)

| ID | Débito | Severidade | Esforço | ROI |
|----|--------|------------|---------|-----|
| UX-04 | Acessibilidade Zero | CRÍTICA | 80h | ALTO - Evita risco legal |

**Total P0:** 80 horas

### Prioridade P1 (ALTA - Próximas 2 semanas)

| ID | Débito | Severidade | Esforço | ROI |
|----|--------|------------|---------|-----|
| SYS-01 | Falta de Testes | ALTA | 80h | ALTO - Previne regressão |
| SYS-04 | Sem Autenticação | ALTA | 60h | CRÍTICO - Segurança |
| UX-01 | Sem Design System | ALTA | 40h | ALTO - Reduz 60% duplicação |
| UX-02 | Componentes Não Reutilizáveis | ALTA | 60h | ALTO - Manutenibilidade |
| UX-05 | Mobile Não Otimizado | ALTA | 100h | ALTO - 50% usuários |
| UX-07 | Sem Estados de Erro | ALTA | 30h | ALTO - UX básica |

**Total P1:** 370 horas

### Prioridade P2 (MÉDIA - Próximo mês)

| ID | Débito | Severidade | Esforço | ROI |
|----|--------|------------|---------|-----|
| SYS-02 | Dados Mockados | MÉDIA | 40h | MÉDIO - Escalabilidade |
| SYS-06 | Sem Erro Global | MÉDIA | 24h | MÉDIO - Estabilidade |
| UX-03 | Arquivos Grandes | MÉDIA | 30h | MÉDIO - Dev velocity |
| UX-06 | Sem Loading States | MÉDIA | 20h | MÉDIO - UX polish |

**Total P2:** 114 horas

### Prioridade P3 (Próximos 2-3 meses)

| ID | Débito | Severidade | Esforço | ROI |
|----|--------|------------|---------|-----|
| SYS-03 | Sem React Router | MÉDIA | 20h | MÉDIO - SEO + UX |
| SYS-09 | Falta de TypeScript | MÉDIA | 80h | MÉDIO - Type safety |
| SYS-10 | Sem CI/CD | MÉDIA | 16h | MÉDIO - Automação |
| UX-10 | Drag-and-Drop Básico | MÉDIA | 25h | BAIXO - UX polish |

**Total P3:** 141 horas

### Prioridade P4 (Backlog - Futuro)

| ID | Débito | Severidade | Esforço | ROI |
|----|--------|------------|---------|-----|
| SYS-05 | Configs Hardcoded | BAIXA | 8h | BAIXO - Ops |
| SYS-07 | Código Duplicado | BAIXA | 30h | BAIXO - Já coberto por UX-02 |
| SYS-08 | Bundle Não Otimizado | BAIXA | 16h | BAIXO - Performance |
| UX-09 | Sem Virtualização | BAIXA | 15h | BAIXO - Edge case |
| UX-11 | Inconsistências Visuais | BAIXA | 20h | BAIXO - Já coberto por UX-01 |
| UX-12 | Sem Animações | BAIXA | 15h | BAIXO - Nice to have |

**Total P4:** 104 horas

---

## 🎯 4. Perguntas para Especialistas

### ⚠️ PENDENTE: Revisão @ux-design-expert

**Perguntas:**

1. **UX-04 (Acessibilidade):** Qual o nível mínimo de conformidade WCAG necessário para compliance? AA ou AAA?

2. **UX-05 (Mobile):** Devemos redesign mobile-first ou adaptar o desktop existente? Qual abordagem tem melhor ROI?

3. **UX-02 (Componentes):** Priorizar criação de biblioteca de componentes ou migrar para Shadcn UI / Material UI?

4. **UX-01 (Design System):** Criar do zero ou adaptar um existente (Tailwind UI, Chakra, etc.)?

5. **UX-10 (Drag-and-Drop):** Touch support no CRM é crítico ou podemos adiar? Qual % de usuários usa mobile para CRM?

### ⚠️ PENDENTE: Revisão @qa

**Perguntas:**

1. **Cobertura de Testes:** Qual cobertura mínima aceitável? 70%? 80%?

2. **Ordem de Resolução:** A ordem de priorização P0→P1→P2→P3→P4 faz sentido? Algum débito está mal priorizado?

3. **Dependências:** Identifiquei as dependências corretamente? (ex: SYS-04 depende de SYS-03)

4. **Riscos Cruzados:** Há algum risco que não identifiquei ao resolver estes débitos em paralelo?

5. **Critérios de Aceite:** Para cada P0/P1, quais métricas validam que o débito foi resolvido?

---

## 📈 5. Estimativas Consolidadas

| Prioridade | Total Horas | Timeline (1 dev) | Timeline (2 devs) |
|------------|-------------|------------------|-------------------|
| P0 (CRÍTICA) | 80h | 2 semanas | 1 semana |
| P1 (ALTA) | 370h | 9 semanas | 4.5 semanas |
| P2 (MÉDIA) | 114h | 3 semanas | 1.5 semanas |
| P3 | 141h | 3.5 semanas | 1.75 semanas |
| P4 (Backlog) | 104h | 2.5 semanas | 1.25 semanas |
| **TOTAL** | **809h** | **20 semanas (5 meses)** | **10 semanas (2.5 meses)** |

**Observação:** Estimativas assumem dev full-stack com experiência React + Tailwind.

---

## 🚀 6. Plano de Resolução Proposto (Sujeito a Validação)

### Sprint 1 (2 semanas) - P0
- UX-04: Implementar acessibilidade WCAG 2.1 AA

### Sprint 2-3 (4 semanas) - P1 Parte 1
- SYS-01: Configurar Jest + React Testing Library (cobertura 70%)
- SYS-04: Implementar autenticação JWT + protected routes
- UX-07: Implementar toast system + error boundaries

### Sprint 4-5 (4 semanas) - P1 Parte 2
- UX-01: Criar design system (Storybook + Figma)
- UX-02: Biblioteca de componentes reutilizáveis (10 componentes base)

### Sprint 6-7 (4 semanas) - P1 Parte 3
- UX-05: Otimização mobile (drawer, tabs, responsive)

### Sprint 8-9 (4 semanas) - P2
- SYS-02: Abstrair dados mockados para API layer
- UX-03: Modularizar arquivos grandes
- UX-06: Loading states (skeleton screens)
- SYS-06: Error handling global

### Sprint 10+ (Backlog) - P3, P4
- Conforme capacity e priorização de negócio

---

## ✅ 7. Critérios de Sucesso (Preliminar)

### P0 (Acessibilidade)
- ✅ WCAG 2.1 AA compliance (Lighthouse Accessibility score ≥90)
- ✅ Navegação por teclado em todos os componentes
- ✅ ARIA labels em modais, dropdowns, forms
- ✅ Screen reader compatible

### P1 (Fundação)
- ✅ Cobertura de testes ≥70%
- ✅ Auth funcional (login, logout, protected routes)
- ✅ 10 componentes reutilizáveis documentados no Storybook
- ✅ Mobile Lighthouse score ≥80
- ✅ Toast notifications em todos os erros

### P2 (Escalabilidade)
- ✅ 0 dados mockados em produção (todos via API)
- ✅ Arquivos ≤300 linhas
- ✅ Skeleton screens em 100% das pages
- ✅ ErrorBoundary global funcional

---

## 📎 8. Anexos

### Documentos Fonte
- [System Architecture](../architecture/system-architecture.md) - 10 débitos
- [Frontend/UX Spec](../frontend/frontend-spec.md) - 12 débitos

### Próximos Passos
1. **FASE 5:** ~~Validação @data-engineer~~ (pulada - sem database)
2. **FASE 6:** Validação @ux-design-expert (docs/reviews/ux-specialist-review.md)
3. **FASE 7:** Validação @qa (docs/reviews/qa-review.md)
4. **FASE 8:** Assessment Final @architect (incorporar feedback)
5. **FASE 9:** Relatório Executivo @analyst (stakeholders)
6. **FASE 10:** Epic + Stories @pm (planning)

---

**Documento consolidado por:** @architect (via Bob - PM Mode)
**Workflow:** Brownfield Discovery - FASE 4
**Status:** ⏳ DRAFT - Aguardando validações (FASES 6-7)
**Próxima Fase:** FASE 6 - UX Specialist Review
