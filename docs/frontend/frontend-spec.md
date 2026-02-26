# Frontend/UX Specification - Plataforma

**Projeto:** Plataforma de CRM/Vendas
**Data de Análise:** 2026-02-23
**Versão:** 1.0
**Analisado por:** @ux-design-expert via Bob (PM Mode)

---

## 📋 Executive Summary

Sistema de CRM com interface rica e interativa. Design moderno com tema purple, dark mode suportado, e componentes complexos (drag-and-drop, chat, modais). Identificados 12 débitos de UX/UI que afetam escalabilidade, acessibilidade e experiência mobile.

**Componentes UI:** 17 JSX
**Design System:** Informal (tema purple, sem documentação)
**Acessibilidade:** 0% (não implementada)
**Mobile:** Não otimizado

---

## 🎨 Design System Atual

### Paleta de Cores

**Tema Principal: Purple**
- **Gradiente primário:** `from-purple-500 to-purple-600`
- **Purple shades:** purple-400, purple-500, purple-600, purple-700
- **Accent:** orange, emerald, blue (para status e plataformas)

**Cores por Plataforma (Integrations.jsx):**
- Kiwify: emerald (400-600)
- Hotmart: orange-red (500-600)
- Stripe: indigo-purple (500-600)
- Eduzz: blue (500-700)
- PayPal: blue (600-800)

**Cores Semânticas:**
- Sucesso: green-500
- Alerta: yellow-500
- Erro: red-500
- Info: blue-500

### Tipografia

**Não estruturado** - Usa defaults do Tailwind:
- Sans-serif padrão
- Tamanhos: text-xs, text-sm, text-base, text-lg, text-xl, text-2xl
- Pesos: font-normal, font-medium, font-semibold, font-bold

### Espaçamento

**Grid Tailwind padrão:**
- Spacing: p-2, p-4, p-6, gap-2, gap-4, gap-6
- Sem escala customizada

### Componentes Base

**Observação:** Não há componentes reutilizáveis. Código duplicado entre páginas.

---

## 📦 Componentes UI Identificados

### 1. **Dashboard.jsx** - Dashboards e Métricas

**Funcionalidades:**
- Filtro por data (dataInicio, dataFim)
- Seletor de plataforma integrada
- Cards de métricas (clientes, mensagens, taxa de resposta)
- Gráficos (LineChart, BarChart via Recharts)
- Tabela de clientes esperando atendimento

**UI Patterns:**
- Cards com gradiente purple
- Ícones react-icons/fa
- Tabela responsiva (overflow-x-auto)
- Dark mode suportado

**Débitos:**
- Dados mockados hardcoded
- Sem skeleton loader
- Sem estados de erro

### 2. **CRM.jsx** - Pipeline de Vendas (Drag-and-Drop)

**Funcionalidades:**
- Drag-and-drop de leads entre colunas
- Múltiplas pipelines customizáveis
- Filtros: status, responsável, origem, tags
- Modais: adicionar lead, editar lead, qualificação, motivo de perda
- Sistema de notas por lead
- Follow-up tracking

**UI Patterns:**
- Colunas Kanban com cores customizáveis
- Cards arrastáveis
- Dropdowns de filtro
- Modais full-screen
- Menu de contexto (3 dots)

**Débitos:**
- Arquivo muito grande (~1500+ linhas)
- 20+ estados locais (difícil manter)
- Modais não são componentes reutilizáveis
- Sem indicador visual de drag (ghost)
- Sem animações de transição

### 3. **Inbox.jsx** - Sistema de Mensagens (Chat)

**Funcionalidades:**
- Lista de conversas com filtros
- Chat em tempo real (simulado)
- Painel lateral com info do contato
- Sistema de notas
- Atribuição de atendente
- Tags de contato
- Anexos (arquivo, foto, vídeo)
- Gravação de áudio
- Emoji picker

**UI Patterns:**
- Layout 3 colunas (lista, chat, painel)
- Mensagens estilo WhatsApp
- Avatares com iniciais
- Badges de status (lido/não lido)
- Timestamps relativos

**Débitos:**
- Arquivo muito grande (~1000+ linhas)
- 25+ estados locais
- Não há virtualização (lista de conversas pode ser lenta com muitos itens)
- Sem lazy loading de mensagens
- Sem indicador de "digitando..."
- Emoji picker não implementado (apenas placeholder)

### 4. **Integrations.jsx** - Gestão de Integrações

**Funcionalidades:**
- Cards de plataformas (Kiwify, Hotmart, Stripe, etc.)
- Ícones customizados por plataforma
- Modal de configuração de integração
- Modal de visualização de dados (abas: clientes, produtos, vendas, reembolsos)
- Status: ativo/inativo/erro
- Sync manual

**UI Patterns:**
- Grid de cards responsivo
- Ícones gradiente com letra inicial
- Tabs para dados da integração
- Tabelas de dados

**Débitos:**
- Dados de integração mockados
- Sem paginação nas tabelas
- Sem busca interna nas abas de dados
- Ícones são divs com letra, não logos reais

### 5. **Contacts.jsx** - Gestão de Contatos

**Funcionalidades:**
- Tabela de contatos
- Busca e filtros
- Adicionar/editar/deletar contatos
- Importação/exportação (placeholders)
- Visualização de detalhes

**UI Patterns:**
- Tabela com hover
- Modais para adicionar/editar
- Botões de ação por linha

**Débitos:**
- Sem virtualização de tabela (performance com >1000 contatos)
- Importação/exportação não funcional
- Sem validação de formulário

### 6. **Companies.jsx** - Gestão de Empresas

Similar a Contacts.jsx

**Débitos:**
- Duplicação de código com Contacts.jsx
- Mesmo padrão de tabela não reutilizado

### 7. **Team.jsx** - Gestão de Equipe

**Funcionalidades:**
- Lista de membros da equipe
- Permissões por membro
- Carga horária semanal
- Adicionar/editar/remover membros

**UI Patterns:**
- Cards de membros
- Checkboxes de permissões
- Input de horas

**Débitos:**
- Sem validação de carga horária
- Permissões não são granulares

### 8. **Sidebar.jsx** - Navegação

**Funcionalidades:**
- Menu lateral com ícones
- Contador de notificações
- Botão de collapse
- Dark mode toggle
- Logout

**UI Patterns:**
- Fixed sidebar
- Hover effects
- Active state

**Débitos:**
- Não responsivo (mobile)
- Sem indicador de página ativa além do hover

### 9. **Profile.jsx** - Perfil do Usuário

**Funcionalidades:**
- Edição de dados pessoais
- Upload de avatar
- Configurações de notificações

**Débitos:**
- Upload de avatar não funcional
- Sem crop de imagem

### 10. **Reports.jsx** - Relatórios

**Funcionalidades:**
- Exportação de relatórios
- Filtros por data e tipo

**Débitos:**
- Exportação não implementada
- Sem visualização de gráficos

---

## ♿ Acessibilidade (A11y)

### Estado Atual: 0% Implementado

**Problemas Identificados:**

1. **Sem ARIA labels:**
   - Botões sem aria-label
   - Modais sem aria-modal
   - Dropdowns sem aria-expanded

2. **Sem navegação por teclado:**
   - Drag-and-drop não funciona com teclado
   - Modais não capturam foco
   - Escape para fechar modais não implementado

3. **Sem indicadores visuais:**
   - Focus states inconsistentes
   - Sem skip links
   - Contraste de cores não validado

4. **Sem leitores de tela:**
   - Imagens sem alt text
   - Ícones sem títulos
   - Conteúdo dinâmico sem anúncios

**Impacto:**
- Usuários com deficiências visuais não conseguem usar
- Não atende WCAG 2.1 AA
- Risco legal/compliance

---

## 📱 Responsividade Mobile

### Estado Atual: Parcial

**O que funciona:**
- Tailwind classes responsivas (md:, lg:)
- Grid adapta com breakpoints
- overflow-x-auto em tabelas

**O que NÃO funciona:**

1. **Sidebar:**
   - Não colapsa em mobile
   - Sem menu hamburger
   - Ocupa espaço fixo

2. **CRM (Kanban):**
   - Colunas não scrollam horizontalmente bem
   - Cards muito largos em mobile
   - Drag-and-drop difícil no touch

3. **Inbox (Chat):**
   - 3 colunas não adaptam para mobile
   - Painel lateral sempre visível
   - Difícil navegação

4. **Modais:**
   - Alguns modais muito largos
   - Sem scroll interno
   - Fecham área útil da tela

5. **Tabelas:**
   - Scroll horizontal (ok)
   - Mas ações ficam escondidas

**Recomendação:**
- Redesign mobile-first
- Bottom navigation para mobile
- Drawer para sidebar
- Modais full-screen em mobile

---

## 🎯 Padrões de Interação

### Modais

**Padrão atual:**
- Overlay escuro (bg-black/50)
- Conteúdo centralizado
- Botão X no canto superior direito
- Sem animação de entrada/saída

**Tipos de modais identificados:**
- Formulários (adicionar/editar)
- Confirmação (deletar)
- Visualização de dados
- Configurações

**Problema:** Código duplicado - cada componente implementa seu próprio modal

### Dropdowns

**Padrão atual:**
- Trigger button
- Lista absolute positioned
- Fecha ao clicar fora

**Problema:** Implementação inconsistente entre componentes

### Drag-and-Drop (CRM)

**Padrão:**
- onDragStart / onDragEnd
- Visual feedback básico
- Atualização de estado após drop

**Problema:**
- Sem indicador de área de drop
- Sem ghost do item sendo arrastado
- Não funciona em mobile (touch)

### Loading States

**Estado atual:** Ausente

**Impacto:**
- Usuário não sabe quando operação está em andamento
- Clicks duplos
- Sensação de lentidão

**Recomendação:**
- Skeleton screens
- Spinners inline
- Disabled states em botões

### Error States

**Estado atual:** Ausente

**Impacto:**
- Erros silenciosos
- Frustração do usuário
- Sem recovery

**Recomendação:**
- Toast notifications
- Error boundaries
- Mensagens claras

---

## 🚨 Débitos Técnicos Identificados (Nível Frontend/UX)

### 1. **Sem Design System Estruturado**
- **Severidade:** ALTA
- **Descrição:** Cores, tipografia, spacing não documentados
- **Impacto:** Inconsistências visuais, difícil manutenção
- **Recomendação:** Criar design system (Storybook + Figma)
- **Esforço:** 40 horas

### 2. **Componentes Não Reutilizáveis**
- **Severidade:** ALTA
- **Descrição:** Modais, dropdowns, tabelas duplicados
- **Impacto:** Código repetido, bugs duplicados
- **Recomendação:** Biblioteca de componentes base
- **Esforço:** 60 horas

### 3. **Arquivos Muito Grandes**
- **Severidade:** MÉDIA
- **Descrição:** CRM.jsx ~1500 linhas, Inbox.jsx ~1000 linhas
- **Impacto:** Difícil manutenção, lentidão em dev
- **Recomendação:** Modularizar em componentes menores
- **Esforço:** 30 horas

### 4. **Acessibilidade Zero**
- **Severidade:** CRÍTICA
- **Descrição:** Sem ARIA, navegação por teclado, leitores de tela
- **Impacto:** Exclusão de usuários, risco legal
- **Recomendação:** Implementar WCAG 2.1 AA
- **Esforço:** 80 horas

### 5. **Mobile Não Otimizado**
- **Severidade:** ALTA
- **Descrição:** Sidebar, CRM, Inbox não funcionam bem em mobile
- **Impacto:** UX ruim em dispositivos móveis
- **Recomendação:** Redesign mobile-first
- **Esforço:** 100 horas

### 6. **Sem Estados de Loading**
- **Severidade:** MÉDIA
- **Descrição:** Ausência de skeleton, spinners
- **Impacto:** UX confusa, clicks duplos
- **Recomendação:** Skeleton screens + spinners
- **Esforço:** 20 horas

### 7. **Sem Estados de Erro**
- **Severidade:** ALTA
- **Descrição:** Erros não são exibidos ao usuário
- **Impacto:** Frustração, perda de dados
- **Recomendação:** Toast system + error boundaries
- **Esforço:** 30 horas

### 8. **Dados Mockados no Código**
- **Severidade:** MÉDIA
- **Descrição:** Arrays hardcoded em componentes
- **Impacto:** Não conectável a backend real
- **Recomendação:** Abstrair para API layer
- **Esforço:** 40 horas

### 9. **Sem Virtualização de Listas**
- **Severidade:** BAIXA
- **Descrição:** Tabelas/listas renderizam todos os itens
- **Impacto:** Performance ruim com >500 itens
- **Recomendação:** React Virtualized ou Tanstack Virtual
- **Esforço:** 15 horas

### 10. **Drag-and-Drop Básico**
- **Severidade:** MÉDIA
- **Descrição:** CRM drag sem visual feedback, sem touch support
- **Impacto:** UX ruim em mobile, confusa em desktop
- **Recomendação:** React DnD ou dnd-kit
- **Esforço:** 25 horas

### 11. **Inconsistências Visuais**
- **Severidade:** BAIXA
- **Descrição:** Botões, inputs, cards com estilos variados
- **Impacto:** Aparência não profissional
- **Recomendação:** Normalizar com design system
- **Esforço:** 20 horas

### 12. **Sem Animações/Transições**
- **Severidade:** BAIXA
- **Descrição:** Modais aparecem sem animação
- **Impacto:** UX menos polida
- **Recomendação:** Framer Motion ou Tailwind animations
- **Esforço:** 15 horas

---

## 📊 Métricas de UX

| Métrica | Valor Atual | Meta |
|---------|-------------|------|
| Componentes Reutilizáveis | 2 (SaveNotification, AppContext) | 20+ |
| Acessibilidade (WCAG) | 0% | 90%+ |
| Mobile Usability | 40% | 90%+ |
| Performance (Lighthouse) | Não medido | 90+ |
| Design System Coverage | 0% | 80%+ |

---

## 🎯 Recomendações Prioritárias

### Curto Prazo (1-2 semanas)

1. **Criar biblioteca de componentes base:**
   - Button, Input, Modal, Dropdown, Card
   - Usar Storybook para documentação
   - **ROI:** Reduz 60% do código duplicado

2. **Implementar estados de loading/error:**
   - Skeleton screens
   - Toast notifications
   - **ROI:** Melhora UX imediatamente

3. **Modularizar componentes grandes:**
   - Quebrar CRM.jsx em 5-7 componentes
   - Quebrar Inbox.jsx em 4-5 componentes
   - **ROI:** Facilita manutenção

### Médio Prazo (1-2 meses)

4. **Implementar acessibilidade básica:**
   - ARIA labels
   - Navegação por teclado
   - Focus management
   - **ROI:** Amplia público, reduz risco legal

5. **Otimizar para mobile:**
   - Sidebar responsivo
   - CRM adaptativo
   - Inbox em tabs para mobile
   - **ROI:** 50%+ dos usuários em mobile

6. **Design system formal:**
   - Documentar cores, tipografia, spacing
   - Tokens CSS ou Tailwind config
   - Figma Design System
   - **ROI:** Consistência visual

### Longo Prazo (2-3 meses)

7. **Migrar para TypeScript:**
   - Type safety
   - Melhor DX
   - **ROI:** Menos bugs

8. **Implementar testes E2E:**
   - Cypress ou Playwright
   - Cobertura de fluxos críticos
   - **ROI:** Confiança em deploys

---

## 📎 Anexos

### Fluxos de Usuário Mapeados

1. **Login → Dashboard → Ver métricas**
2. **Dashboard → CRM → Adicionar lead → Mover pipeline**
3. **Inbox → Selecionar chat → Responder → Atribuir atendente**
4. **Integrations → Conectar Kiwify → Ver dados de clientes**
5. **Contacts → Adicionar contato → Adicionar tags**

### Protótipos Recomendados

- Sidebar mobile (drawer)
- CRM mobile (tabs + swipe)
- Inbox mobile (full-screen chat)
- Design system components (Storybook)

---

**Documento gerado por:** @ux-design-expert (via Bob - PM Mode)
**Workflow:** Brownfield Discovery - FASE 3
**Próxima Fase:** FASE 4 - Consolidação Inicial de Débitos (@architect)
