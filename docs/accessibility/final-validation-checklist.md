# Checklist Final de Validação WCAG 2.1 AA

**Data:** _________
**Testador:** _________
**Versão:** 1.0
**Navegador:** _________
**Screen Reader:** _________

---

## 📋 Instruções

- Marque `[x]` quando o item for validado com sucesso
- Marque `[ ]` quando houver problema
- Adicione notas em **Observações** se necessário

---

## 1️⃣ TESTES AUTOMATIZADOS

### Lighthouse Accessibility

#### Desktop
- [ ] Dashboard - Score ≥ 90
- [ ] CRM - Score ≥ 90
- [ ] Inbox - Score ≥ 90
- [ ] Integrations - Score ≥ 90
- [ ] Contacts - Score ≥ 90
- [ ] Team - Score ≥ 90
- [ ] Companies - Score ≥ 90

**Observações:**
```
Score médio: _____
Issues encontrados: _____
```

#### Mobile
- [ ] Dashboard - Score ≥ 90
- [ ] CRM - Score ≥ 90
- [ ] Inbox - Score ≥ 90
- [ ] Integrations - Score ≥ 90
- [ ] Contacts - Score ≥ 90
- [ ] Team - Score ≥ 90
- [ ] Companies - Score ≥ 90

**Observações:**
```
Score médio: _____
Issues encontrados: _____
```

---

### axe DevTools

- [ ] 0 Violations (Critical)
- [ ] 0 Violations (Serious)
- [ ] < 5 Warnings (Moderate)
- [ ] Todas as páginas escaneadas

**Issues Encontrados:**
```
Critical: _____
Serious: _____
Moderate: _____
Minor: _____
```

---

### WAVE Accessibility

- [ ] 0 Erros (Errors)
- [ ] < 5 Alertas (Alerts)
- [ ] Contrast validado
- [ ] ARIA validado

**Observações:**
```

```

---

## 2️⃣ NAVEGAÇÃO POR TECLADO

### Dashboard

#### Navegação Básica
- [ ] Tab navega em ordem lógica
- [ ] Skip link funciona (`href="#main-content"`)
- [ ] Foco visível em todos os elementos
- [ ] Esc não fecha nada (sem modais abertos)

#### Seletores e Filtros
- [ ] Selector de dashboard abre com Enter/Space
- [ ] Setas navegam opções
- [ ] Enter seleciona opção
- [ ] Esc fecha dropdown

#### Cards de Métricas
- [ ] Tab navega entre cards
- [ ] Foco visível em cada card
- [ ] Cards NÃO são clicáveis (apenas informativos)

#### Clientes Esperando
- [ ] Tab navega entre clientes
- [ ] Enter abre conversa no Inbox
- [ ] Space também abre conversa
- [ ] Foco retorna após navegar

**Problemas Encontrados:**
```

```

---

### Sidebar

#### Menu Principal
- [ ] Tab navega itens de menu
- [ ] Setas Up/Down navegam (opcional)
- [ ] Enter abre página
- [ ] Item atual tem `aria-current="page"`
- [ ] Foco visível em item atual

#### Toggle Button
- [ ] Abre/fecha sidebar
- [ ] Estado anunciado (expandido/colapsado)
- [ ] Funciona em mobile e desktop

#### Menu de Usuário
- [ ] Tab foca avatar
- [ ] Enter/Space abre menu
- [ ] Esc fecha menu
- [ ] Tab navega opções (Perfil, Sair)
- [ ] Enter ativa ação

**Problemas Encontrados:**
```

```

---

### CRM

#### Busca e Filtros
- [ ] `/` foca campo de busca (futura implementação)
- [ ] Tab navega filtros
- [ ] Dropdowns abrem com Enter
- [ ] Esc fecha dropdowns

#### Cards de Lead
- [ ] Tab navega entre leads
- [ ] Enter abre detalhes
- [ ] Setas navegam dentro da coluna (opcional)
- [ ] Drag com teclado funciona (opcional)

#### Modal de Detalhes
- [ ] Abre com foco no primeiro elemento
- [ ] Tab fica preso no modal (focus trap)
- [ ] Shift+Tab navega backwards
- [ ] Esc fecha modal
- [ ] Foco retorna ao card do lead

#### Modal Adicionar Lead
- [ ] Foco automático no campo Nome
- [ ] Tab navega campos em ordem
- [ ] Enter submete formulário
- [ ] Esc cancela e fecha

**Problemas Encontrados:**
```

```

---

### Inbox

#### Lista de Conversas
- [ ] Tab navega conversas
- [ ] Enter abre conversa
- [ ] Busca funciona
- [ ] Filtros acessíveis

#### Envio de Mensagem
- [ ] Tab foca campo de input
- [ ] Ctrl+Enter envia mensagem
- [ ] Tab → Botão Enviar
- [ ] Anexos acessíveis
- [ ] Emojis acessíveis

**Problemas Encontrados:**
```

```

---

### Integrations, Contacts, Team, Companies

#### Busca e Tabelas
- [ ] Busca acessível
- [ ] Tabelas navegáveis
- [ ] Setas navegam células (opcional)
- [ ] Ações acessíveis

#### Modais
- [ ] Focus trap funciona
- [ ] Esc fecha
- [ ] Foco restaurado

**Problemas Encontrados:**
```

```

---

## 3️⃣ SCREEN READER (NVDA/JAWS)

### NVDA Testing

#### Dashboard
- [ ] "Dashboard, região principal" anunciado
- [ ] Cards anunciados como artigos
- [ ] Valores lidos corretamente
- [ ] Gráficos têm descrição
- [ ] Clientes esperando têm contexto

**Anúncios Validados:**
```
Exemplo: "Artigo: Total de Contatos: 1,234"
```

#### Sidebar
- [ ] "Navegação, Menu de navegação principal"
- [ ] Itens anunciados como botões
- [ ] "Dashboard, atual" quando selecionado
- [ ] Menu usuário: "expandido/colapsado"

**Anúncios Validados:**
```

```

#### CRM
- [ ] Busca: "Buscar leads por nome, empresa..."
- [ ] Leads: "Botão: Lead: João Silva, Valor: R$ 5.000"
- [ ] Modal: "Diálogo modal: Detalhes do Lead"
- [ ] Botões com labels corretos

**Anúncios Validados:**
```

```

#### Inbox
- [ ] Conversas identificadas
- [ ] Mensagens navegáveis
- [ ] Envio acessível

**Anúncios Validados:**
```

```

---

### JAWS Testing

#### Comandos Testados
- [ ] Insert+Down (Ler tudo)
- [ ] H (Headings)
- [ ] B (Botões)
- [ ] F (Formulários)
- [ ] T (Tabelas)

#### Componentes Validados
- [ ] Dashboard
- [ ] Sidebar
- [ ] CRM
- [ ] Inbox

**Problemas Encontrados:**
```

```

---

## 4️⃣ CONTRASTE DE CORES

### Validação Manual

- [ ] Textos normais: ≥ 4.5:1
- [ ] Textos grandes: ≥ 3:1
- [ ] Ícones: ≥ 3:1
- [ ] Bordas de foco: ≥ 3:1

### Ferramentas Usadas
- [ ] Colour Contrast Analyser
- [ ] WebAIM Contrast Checker
- [ ] Chrome DevTools

**Problemas Encontrados:**
```
Elemento: _____
Contraste Atual: _____
Contraste Mínimo: _____
```

---

## 5️⃣ RESPONSIVIDADE

### Breakpoints Testados

#### Mobile (320px - 767px)
- [ ] Layout funcional
- [ ] Sem scroll horizontal
- [ ] Botões acessíveis (touch targets ≥ 44x44px)
- [ ] Texto legível

#### Tablet (768px - 1023px)
- [ ] Layout adaptado
- [ ] Navegação funcional
- [ ] Sidebar responsiva

#### Desktop (≥ 1024px)
- [ ] Layout completo
- [ ] Todas as features acessíveis

### Zoom Testing
- [ ] 200% zoom funcional
- [ ] 400% zoom (móvel)
- [ ] Sem perda de conteúdo

**Problemas Encontrados:**
```

```

---

## 6️⃣ SEMÂNTICA HTML

### Landmarks
- [ ] `<main>` presente
- [ ] `<nav>` para navegação
- [ ] `<aside>` para sidebar
- [ ] Headings hierárquicos (h1 → h2 → h3)

### Formulários
- [ ] Labels associados a inputs
- [ ] Fieldsets para grupos
- [ ] Required fields marcados
- [ ] Erro de validação acessível

### Tabelas
- [ ] `<thead>`, `<tbody>`
- [ ] `<th scope="col/row">`
- [ ] Caption ou aria-label

**Problemas Encontrados:**
```

```

---

## 7️⃣ ARIA IMPLEMENTATION

### Roles
- [ ] role="navigation"
- [ ] role="main"
- [ ] role="dialog"
- [ ] role="button" quando apropriado
- [ ] role="img" para gráficos

### States & Properties
- [ ] aria-label descritivos
- [ ] aria-expanded para dropdowns
- [ ] aria-current="page" para navegação
- [ ] aria-live para atualizações
- [ ] aria-hidden="true" para ícones decorativos

### Modal
- [ ] aria-modal="true"
- [ ] aria-labelledby aponta para título
- [ ] Focus trap funciona

**Problemas Encontrados:**
```

```

---

## 8️⃣ FOCUS MANAGEMENT

### Visual
- [ ] Outline visível (3px purple)
- [ ] Offset adequado (2px)
- [ ] Box-shadow em elementos
- [ ] Nunca `outline: none` sem substituição

### Funcional
- [ ] Tab order lógico
- [ ] Skip link funciona
- [ ] Focus não escapa de modais
- [ ] Esc restaura foco

**Problemas Encontrados:**
```

```

---

## 9️⃣ ESTADOS E FEEDBACK

### Visual
- [ ] Hover tem feedback visual
- [ ] Active state visível
- [ ] Disabled state claro
- [ ] Loading state informado

### Screen Reader
- [ ] Estados anunciados
- [ ] Mudanças dinâmicas com aria-live
- [ ] Erros anunciados
- [ ] Sucesso anunciado

**Problemas Encontrados:**
```

```

---

## 🔟 CASOS EDGE

### Sem Conteúdo
- [ ] "Nenhum resultado" anunciado
- [ ] Mensagem visível
- [ ] Não quebra layout

### Erro
- [ ] Mensagem descritiva
- [ ] aria-invalid="true"
- [ ] Foco no campo com erro
- [ ] Sugestão de correção

### Carregamento
- [ ] Indicador visual
- [ ] Anúncio "Carregando..."
- [ ] Não bloqueia interação crítica

**Problemas Encontrados:**
```

```

---

## ✅ RESUMO FINAL

### Scores Alcançados

| Ferramenta | Score Mínimo | Score Alcançado | Status |
|------------|--------------|-----------------|--------|
| Lighthouse Desktop | 90 | _____ | [ ] |
| Lighthouse Mobile | 90 | _____ | [ ] |
| axe-core | 0 violations | _____ | [ ] |
| WAVE | 0 errors | _____ | [ ] |

### Conformidade WCAG 2.1 AA

- [ ] **Perceptível** - 100%
- [ ] **Operável** - 100%
- [ ] **Compreensível** - 100%
- [ ] **Robusto** - 100%

### Issues Críticos
```
Total: _____
Resolvidos: _____
Pendentes: _____
```

### Issues Moderados
```
Total: _____
Resolvidos: _____
Pendentes: _____
```

---

## 📝 APROVAÇÃO

**QA Aprovado:** [ ] Sim [ ] Não

**Assinatura QA:** ___________________

**Data:** ___/___/______

**Notas Finais:**
```




```

---

## 🎯 PRÓXIMOS PASSOS

1. [ ] Corrigir issues críticos
2. [ ] Revisar issues moderados
3. [ ] Re-executar testes
4. [ ] Documentar conformidade
5. [ ] Deploy para produção

**Status:** [ ] Pronto para produção [ ] Necessita ajustes

---

**Documento criado:** 2026-02-23
**Última atualização:** ___________
