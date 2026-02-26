# Fluxos de Navegação por Teclado e Screen Reader

## 🎯 Fluxos Principais

### 1. Fluxo: Login → Dashboard → Visualizar Cliente Esperando

**Objetivo:** Navegar do login até atender um cliente esperando

**Passos com Teclado:**
1. `Tab` → Focar campo email
2. Digitar email → Preencher
3. `Tab` → Focar campo senha
4. Digitar senha → Preencher
5. `Enter` → Fazer login
6. *[Dashboard carrega]*
7. `Tab` (6x) → Navegar pelos cards de métricas
8. `Tab` → Focar primeiro cliente esperando
9. `Enter` → Abrir conversa do cliente no Inbox

**Anúncios NVDA Esperados:**
```
"Email, entrada de texto"
"Senha, entrada de senha"
"Botão: Entrar"
"Dashboard, região principal"
"Artigo: Total de Contatos: 1,234"
"Artigo: Clientes Esperando: 3"
"Região: Clientes esperando atendimento"
"Botão: Atender João Silva - esperando há 45 min"
```

---

### 2. Fluxo: Dashboard → CRM → Adicionar Lead

**Objetivo:** Adicionar novo lead no CRM

**Passos com Teclado:**
1. `Tab` → Focar menu lateral
2. `Seta Down` (2x) → Navegar até "CRM"
3. `Enter` → Abrir CRM
4. `Tab` (3x) → Focar botão "Novo Lead"
5. `Enter` → Abrir modal
6. `Tab` → Campo Nome (foco automático)
7. Preencher dados
8. `Tab` (5x) → Navegar campos
9. `Enter` → Salvar lead

**Anúncios NVDA Esperados:**
```
"Navegação: Menu de navegação principal"
"Botão: CRM"
"Botão: Novo Lead"
"Diálogo modal: Adicionar Novo Lead"
"Nome, entrada de texto obrigatória"
"Botão: Salvar Lead"
```

---

### 3. Fluxo: Inbox → Responder Mensagem

**Objetivo:** Responder mensagem de cliente

**Passos com Teclado:**
1. Navegar até Inbox (vide fluxo anterior)
2. `Tab` → Campo de busca
3. Digitar nome → Buscar
4. `Tab` (2x) → Primeira conversa
5. `Enter` → Abrir conversa
6. `Tab` (múltiplo) → Navegar até campo de mensagem
7. Digitar mensagem
8. `Tab` → Botão enviar
9. `Enter` → Enviar mensagem

**Anúncios NVDA Esperados:**
```
"Entrada de busca: Buscar conversas"
"João Silva, 3 mensagens não lidas"
"Entrada de texto: Digite sua mensagem"
"Botão: Enviar mensagem"
"Status: Mensagem enviada"
```

---

### 4. Fluxo: Integrations → Configurar Kiwify

**Objetivo:** Ativar integração com Kiwify

**Passos com Teclado:**
1. Navegar até Integrações
2. `Tab` → Campo de busca
3. Digitar "Kiwify"
4. `Tab` (2x) → Card Kiwify
5. `Enter` → Abrir configuração
6. `Tab` → API Key
7. Colar chave
8. `Tab` → API Secret
9. Colar secret
10. `Tab` → Botão Conectar
11. `Enter` → Salvar

**Anúncios NVDA Esperados:**
```
"Entrada de busca: Buscar integração"
"Kiwify, Inativo, Plataforma completa de vendas digitais"
"Diálogo modal: Configurar Kiwify"
"API Key, entrada de texto obrigatória"
"Botão: Conectar Kiwify"
```

---

### 5. Fluxo: Contacts → Enviar para CRM

**Objetivo:** Converter contato em lead do CRM

**Passos com Teclado:**
1. Navegar até Contatos
2. `Tab` → Tabela de contatos
3. `Seta Down` → Navegar linhas
4. `Tab` (múltiplo) → Botão de ação
5. `Enter` → Menu de opções
6. `Seta Down` → "Enviar para CRM"
7. `Enter` → Abrir modal
8. `Tab` → Selecionar pipeline
9. `Tab` → Selecionar estágio
10. `Enter` → Confirmar

**Anúncios NVDA Esperados:**
```
"Tabela com 50 linhas e 6 colunas"
"João Silva, célula"
"Botão: Ações"
"Menu: Enviar para CRM"
"Diálogo: Enviar Contato para CRM"
"Pipeline, caixa de combinação"
```

---

## ⌨️ Atalhos de Teclado

### Globais
| Atalho | Ação |
|--------|------|
| `Tab` | Próximo elemento focável |
| `Shift+Tab` | Elemento anterior |
| `Enter` | Ativar botão/link |
| `Space` | Ativar botão/checkbox |
| `Esc` | Fechar modal/dropdown |
| `Arrow Keys` | Navegar em listas/menus |

### Específicos por Componente

#### Dashboard
| Atalho | Ação |
|--------|------|
| `1-6` | Pular para card específico (futura implementação) |
| `G` | Ir para gráfico (futura implementação) |

#### CRM
| Atalho | Ação |
|--------|------|
| `N` | Novo lead (futura implementação) |
| `/` | Focar busca (futura implementação) |

#### Inbox
| Atalho | Ação |
|--------|------|
| `Ctrl+Enter` | Enviar mensagem (já implementado em inputs) |
| `/` | Focar busca (futura implementação) |

---

## 🔄 Ordem de Foco (Tab Order)

### Dashboard
```
1. Skip Link ("Pular para conteúdo principal")
2. Sidebar Toggle (mobile)
3. Menu Lateral
   3.1. Dashboard
   3.2. Empresas
   3.3. Relatórios
   3.4. Inbox
   3.5. Contatos
   3.6. CRM
   3.7. IA
   3.8. Equipe
   3.9. Conexões
   3.10. Integrações
   3.11. Configurações
4. Menu de Usuário (avatar)
5. Conteúdo Principal
   5.1. Selector de Dashboard
   5.2. Data Início
   5.3. Data Fim
   5.4. Card: Total de Contatos
   5.5. Card: Em Aberto
   5.6. Card: Resolvidas
   5.7. Card: Sem Responsável
   5.8. Card: Mensagens
   5.9. Card: Clientes Esperando
   5.10. Cliente 1 (botão)
   5.11. Cliente 2 (botão)
   5.12. Cliente 3 (botão)
   5.13. Cliente 4 (botão)
```

### Modal (Focus Trap)
```
1. Primeiro elemento focável (auto-focus)
2. Campos do formulário
3. Botões de ação
4. Botão fechar (X)
[Tab circula de volta ao item 1]
```

---

## 🎨 Landmarks ARIA

### Estrutura da Página
```html
<body>
  <!-- Skip Link -->
  <a href="#main-content" class="skip-link">
    Pular para conteúdo principal
  </a>

  <!-- Sidebar -->
  <aside role="navigation" aria-label="Menu de navegação principal">
    <nav aria-label="Menu principal">
      <!-- Menu items -->
    </nav>
  </aside>

  <!-- Main Content -->
  <main id="main-content" role="main" aria-label="Conteúdo principal">
    <!-- Dashboard, CRM, Inbox, etc -->

    <!-- Regions -->
    <div role="region" aria-label="Métricas de atendimento">
      <!-- Cards -->
    </div>

    <div role="region" aria-label="Clientes esperando atendimento" aria-live="polite">
      <!-- Lista de clientes -->
    </div>
  </main>
</body>
```

---

## 🐛 Casos Edge e Fallbacks

### Modal sem Título
**Problema:** Modal genérico sem título
**Solução:** Sempre usar `aria-labelledby` ou `aria-label`

### Tabela Vazia
**Problema:** "Tabela com 0 linhas"
**Solução:** Mensagem "Nenhum resultado encontrado" com role="status"

### Carregamento
**Problema:** Conteúdo carregando sem feedback
**Solução:** aria-live="polite" + "Carregando..."

### Erro de Formulário
**Problema:** Erros silenciosos
**Solução:** aria-invalid="true" + aria-describedby

---

## ✅ Checklist de Validação

### Por Página

#### Dashboard
- [x] Skip link funciona
- [x] Sidebar navegável
- [x] Cards têm role="article"
- [x] Gráficos têm role="img" + aria-label
- [x] Clientes esperando têm aria-live
- [x] Botões de cliente são focáveis e ativam

#### CRM
- [x] Busca identificada
- [x] Leads navegáveis
- [x] Modal com focus trap
- [x] Esc fecha modal
- [x] Botões têm aria-label

#### Inbox
- [x] Conversas navegáveis
- [x] Campo mensagem identificado
- [x] Botão enviar acessível

#### Demais Páginas
- [x] Tabelas com cabeçalhos
- [x] Formulários com labels
- [x] Botões identificados

---

## 🎯 Metas de Acessibilidade

### Curto Prazo (Concluído)
- ✅ 100% elementos com nomes acessíveis
- ✅ Navegação completa por teclado
- ✅ Focus trap em modais
- ✅ Contraste WCAG AAA

### Médio Prazo (Próximo)
- ⏳ Atalhos de teclado customizados
- ⏳ Modo de alto contraste
- ⏳ Suporte a magnificadores de tela

### Longo Prazo (Futuro)
- ⏳ Suporte a voice control
- ⏳ Personalização de acessibilidade
- ⏳ Tutoriais interativos

---

**Criado:** 2026-02-23
**Status:** 📋 Documentado e validado
