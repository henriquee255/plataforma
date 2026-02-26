# Guia de Testes com Screen Readers - WCAG 2.1 AA

## 📋 Setup Inicial

### Windows - NVDA (Gratuito)
1. **Download:** https://www.nvaccess.org/download/
2. **Instalação:** Executar como administrador
3. **Configuração:**
   - Language: Português Brasil
   - Keyboard: Desktop
   - Voice: Microsoft Speech API version 5

### Windows - JAWS (Trial 40min)
1. **Download:** https://support.freedomscientific.com/Downloads/JAWS
2. **Instalação:** Trial gratuito de 40 minutos
3. **Reiniciar** a cada 40 minutos para novo trial

---

## ⌨️ Comandos Essenciais

### NVDA
| Comando | Ação |
|---------|------|
| `Ctrl` | Parar leitura |
| `NVDA+Down` | Modo de navegação |
| `H` | Próximo heading |
| `Shift+H` | Heading anterior |
| `B` | Próximo botão |
| `F` | Próximo campo de formulário |
| `T` | Próxima tabela |
| `L` | Próxima lista |
| `NVDA+F7` | Lista de elementos |
| `Tab` | Próximo elemento focável |

### JAWS
| Comando | Ação |
|---------|------|
| `Insert+Down` | Ler tudo |
| `H` | Próximo heading |
| `B` | Próximo botão |
| `F` | Próximo campo |
| `Insert+F5` | Lista de formulários |
| `Insert+F6` | Lista de headings |

---

## ✅ Checklist de Testes por Componente

### 1. Dashboard

#### Navegação Geral
- [ ] Título "Dashboard" é anunciado corretamente
- [ ] Selector de dashboard é identificado como combobox
- [ ] Cards de métricas são anunciados com valores
- [ ] Gráficos têm descrições adequadas

#### Cards de Métricas
- [ ] "Total de Contatos: 1,234" é lido completamente
- [ ] "Em Aberto: 45" é lido completamente
- [ ] "Resolvidas: 892" é lido completamente
- [ ] Navegação entre cards com Tab funciona
- [ ] Cada card tem role="article" anunciado

#### Lista de Clientes Esperando
- [ ] Título da seção é anunciado
- [ ] Cada cliente é identificado como botão
- [ ] Aria-label contém: nome + tempo de espera
- [ ] Enter/Space ativa o botão
- [ ] Atualizações são anunciadas (aria-live="polite")

#### Gráficos
- [ ] "Gráfico de linha mostrando vendas por dia" é lido
- [ ] Gráficos não são navegáveis (role="img")
- [ ] Descrições são suficientes para entender os dados

**Validação Esperada:**
```
"Dashboard, região principal, contém 6 artigos e 2 gráficos"
"Artigo: Total de Contatos: 1,234"
"Botão: Atender João Silva - esperando há 45 min"
"Gráfico: Pico de Clientes por Hora, região"
```

---

### 2. Sidebar (Navegação Principal)

#### Estrutura
- [ ] Identificado como "Menu de navegação principal"
- [ ] role="navigation" anunciado
- [ ] Logo/título da plataforma é lido

#### Menu Items
- [ ] Cada item é identificado como botão
- [ ] "Dashboard, selecionado" quando ativo (aria-current="page")
- [ ] Labels corretos: "Dashboard", "Empresas", "Relatórios", etc.
- [ ] Navegação com Tab funciona em ordem lógica

#### Menu de Usuário
- [ ] Botão "Menu do usuário" identificado
- [ ] Estado expandido/colapsado anunciado (aria-expanded)
- [ ] "Meu Perfil", "Admin", "Sair" são lidos
- [ ] Ícones não são lidos (aria-hidden="true")

#### Toggle Button
- [ ] "Abrir menu lateral" ou "Fechar menu lateral"
- [ ] Estado é anunciado (aria-expanded)

**Validação Esperada:**
```
"Navegação, Menu de navegação principal"
"Botão: Dashboard, atual"
"Botão: Menu do usuário, expandido"
"Botão: Fechar menu lateral"
```

---

### 3. CRM (Pipeline de Vendas)

#### Busca e Filtros
- [ ] Campo de busca: "Buscar leads por nome, empresa, telefone ou email"
- [ ] Botão filtro: "Filtrar por estágio, expandido/colapsado"
- [ ] Ícone de busca não é lido (aria-hidden="true")

#### Cards de Lead
- [ ] Cada lead é identificado como botão
- [ ] Aria-label: "Lead: João Silva, Valor: R$ 5.000"
- [ ] Enter/Space abre detalhes
- [ ] Tab navega entre leads

#### Modal de Detalhes
- [ ] Modal é anunciado: "Diálogo: Detalhes do Lead"
- [ ] Foco vai automaticamente para o primeiro elemento
- [ ] Tab fica preso dentro do modal (focus trap)
- [ ] Esc fecha o modal
- [ ] Botão "Editar lead" é identificado
- [ ] Botão "Deletar lead" é identificado
- [ ] Botão "Fechar modal" é identificado

#### Drag and Drop
- [ ] Cards são identificados como arrastáveis
- [ ] Teclado funciona (Enter/Space para mover)
- [ ] Anúncio de movimentação

**Validação Esperada:**
```
"Entrada de busca: Buscar leads por nome, empresa, telefone ou email"
"Botão: Lead: João Silva, Valor: R$ 5.000"
"Diálogo modal: Detalhes do Lead"
"Botão: Editar lead"
"Botão: Fechar modal"
```

---

### 4. Inbox (Mensagens)

#### Lista de Conversas
- [ ] Campo de busca: "Buscar conversas"
- [ ] Cada conversa é identificada
- [ ] Nome do contato + última mensagem são lidos
- [ ] Contador de não lidas é anunciado

#### Área de Mensagens
- [ ] Histórico de mensagens é navegável
- [ ] Mensagens enviadas vs recebidas são diferenciadas
- [ ] Timestamps são lidos

#### Envio de Mensagem
- [ ] Campo de input identificado
- [ ] Botão enviar: "Enviar mensagem"
- [ ] Botão anexo: identificado
- [ ] Botão emoji: identificado

**Validação Esperada:**
```
"Entrada de busca: Buscar conversas"
"João Silva, 3 mensagens não lidas"
"Botão: Enviar mensagem"
```

---

### 5. Integrations

#### Lista de Integrações
- [ ] Campo de busca: "Buscar integração"
- [ ] Cada integração é identificada
- [ ] Status ativo/inativo é anunciado
- [ ] Botões de ação são identificados

#### Modal de Configuração
- [ ] Modal "Configurar integração" é anunciado
- [ ] Campos de formulário têm labels
- [ ] Instruções são lidas
- [ ] Validação de erros é anunciada

**Validação Esperada:**
```
"Entrada de busca: Buscar integração"
"Kiwify, Ativo"
"Diálogo modal: Configurar Kiwify"
```

---

### 6. Contacts, Team, Companies

#### Tabelas
- [ ] Identificadas como tabelas
- [ ] Cabeçalhos são anunciados
- [ ] Navegação célula por célula funciona
- [ ] Botões de ação são identificados

#### Busca
- [ ] Placeholder correto
- [ ] Filtros são identificados
- [ ] Resultados são atualizados

**Validação Esperada:**
```
"Tabela com 10 linhas e 6 colunas"
"Cabeçalho: Nome"
"João Silva, célula"
```

---

## 🐛 Problemas Comuns e Soluções

### Problema: Botão sem label
**Sintoma:** "Botão" (sem descrição)
**Solução:** Adicionar `aria-label` ou texto visível

### Problema: Ícone decorativo lido
**Sintoma:** "Ícone de pesquisa" (desnecessário)
**Solução:** Adicionar `aria-hidden="true"`

### Problema: Modal não prende foco
**Sintoma:** Tab escapa do modal
**Solução:** Usar `useFocusTrap` hook

### Problema: Estado não anunciado
**Sintoma:** Dropdown abre sem anúncio
**Solução:** Adicionar `aria-expanded`

### Problema: Atualizações não anunciadas
**Sintoma:** Mudanças silenciosas
**Solução:** Usar `aria-live="polite"` ou `"assertive"`

---

## 📝 Documentação de Resultados

### Template de Teste
```markdown
## Teste: [Componente] - [Data]

**Screen Reader:** NVDA 2024.1
**Navegador:** Chrome 120
**Testador:** [Nome]

### Resultados

#### ✅ Passou
- Item 1
- Item 2

#### ❌ Falhou
- Item 1: [Descrição do problema]
  - **Esperado:** [O que deveria acontecer]
  - **Atual:** [O que acontece]
  - **Solução:** [Como consertar]

#### ⚠️ Observações
- Nota 1
- Nota 2
```

---

## ✅ Critérios de Sucesso

### Dashboard
- ✅ 100% dos elementos interativos identificados
- ✅ Navegação completa apenas com teclado
- ✅ Gráficos com descrições adequadas
- ✅ Atualizações dinâmicas anunciadas

### Sidebar
- ✅ Navegação clara e lógica
- ✅ Estado atual identificado
- ✅ Todos os botões com labels

### CRM
- ✅ Leads navegáveis e identificados
- ✅ Modal acessível com focus trap
- ✅ Drag-and-drop alternativo via teclado

### Inbox
- ✅ Conversas navegáveis
- ✅ Envio de mensagem acessível
- ✅ Notificações anunciadas

### Integrações, Contacts, Team, Companies
- ✅ Tabelas navegáveis
- ✅ Formulários com labels
- ✅ Busca e filtros acessíveis

---

## 🎯 Meta Final

**Objetivo:** 0 erros críticos em todos os componentes principais

**WCAG 2.1 AA Requirements:**
- ✅ Todos os elementos têm nomes acessíveis
- ✅ Navegação por teclado completa
- ✅ Focus visível em todos os elementos
- ✅ Contraste adequado (já validado)
- ✅ Estados anunciados corretamente

---

**Criado:** 2026-02-23
**Última Atualização:** 2026-02-23
**Status:** 📋 Pronto para testes
