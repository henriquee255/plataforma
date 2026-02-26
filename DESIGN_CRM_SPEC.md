# Design da Página CRM - Especificações Completas

## 📋 Trabalho Realizado

### 1. Estrutura de Layout Definida

#### **Layout Principal**
- Container principal com max-width de 1600px centralizado
- Background: `bg-[#f0f2f5]` (light) / `dark:bg-gray-950` (dark)
- Padding: 8 unidades (p-8)
- Animações de entrada: `animate-fade-in-up` com delays escalonados

#### **Seções Principais**
1. **Cabeçalho**
   - Título: "CRM - Gestão de Leads" (text-5xl, font-bold)
   - Subtítulo: "Pipeline de vendas e oportunidades"
   - Botão "Novo Lead" com gradiente purple (rounded-3xl)

2. **Cards de Estatísticas Rápidas** (Grid 4 colunas)
   - Total em Leads
   - Ticket Médio
   - Alta Prioridade
   - Taxa de Conversão

3. **Barra de Filtros e Busca**
   - Input de busca com ícone
   - Dropdown de ordenação
   - Botão de filtros (tags)
   - Toggle entre visualizações (Pipeline/Lista)

4. **Tabs de Estágios do Pipeline**
   - Todos, Novo Lead, Primeiro Contato, Qualificação, Proposta, Negociação, Fechamento
   - Cada tab mostra contador de leads

5. **Área de Conteúdo Principal**
   - **Modo Pipeline**: Grid responsivo de cards (1/3/4 colunas)
   - **Modo Lista**: Tabela completa com todas as informações

6. **Modal de Detalhes do Lead**
   - Layout em 2 colunas
   - Header com gradiente purple
   - Informações completas do lead
   - Botões de ação

---

### 2. Componentes Visuais Especificados

#### **Cards de Estatísticas**
```jsx
Estrutura:
- Background: bg-white dark:bg-gray-900
- Border: border-3 border-gray-900 dark:border-gray-700
- Border-radius: rounded-3xl
- Padding: p-6
- Shadow: var(--shadow-layered)

Elementos:
- Ícone em círculo gradiente (10x10)
- Título em uppercase (text-xs, font-bold)
- Valor principal (text-3xl, font-bold)
- Texto auxiliar (text-xs, text-gray-500)
```

#### **Card de Lead (Modo Pipeline)**
```jsx
Estrutura:
- Background: bg-white dark:bg-gray-900
- Border: border-3 com hover em purple
- Border-radius: rounded-3xl
- Padding: p-6
- Cursor: pointer
- Hover: border-purple-500 + shadow-xl

Conteúdo:
1. Header:
   - Nome da empresa (text-lg, font-bold)
   - Nome do contato (text-xs)
   - Botão menu (três pontos)

2. Valor da Oportunidade:
   - Background gradiente purple
   - Valor em destaque (text-2xl)

3. Informações de Contato:
   - Telefone, Email, Cidade
   - Ícones + texto (text-xs)

4. Prioridade:
   - Sistema de 5 estrelas
   - FaStar (preenchida) / FaRegStar (vazia)

5. Probabilidade:
   - Barra de progresso
   - Cores: red (<40%), amber (40-70%), green (>70%)
   - Percentual ao lado

6. Tags:
   - Pills com bg-purple-100 dark:bg-purple-900/30
   - Text-xs, rounded-full

7. Próxima Ação:
   - Border-top separador
   - Ícone relógio + descrição + data
```

#### **Tabela (Modo Lista)**
```jsx
Estrutura:
- Container: rounded-3xl com border-3
- Header: bg-gray-50 dark:bg-gray-800
- Rows: hover:bg-purple-50 dark:hover:bg-purple-900/10
- Colunas:
  1. Empresa/Contato (com avatar)
  2. Estágio (pill colorida)
  3. Valor (destaque purple)
  4. Prioridade (estrelas)
  5. Probabilidade (barra + %)
  6. Próxima Ação (texto + data)
  7. Ações (botões editar/menu)
```

#### **Modal de Detalhes**
```jsx
Estrutura:
- Overlay: bg-black/50 backdrop-blur-sm
- Container: rounded-3xl, max-w-4xl
- Max-height: 90vh com scroll

Header:
- Gradiente purple
- Avatar grande (16x16)
- Nome empresa + contato + cargo
- Botão fechar (X)

Conteúdo (Grid 2 colunas):
Coluna Esquerda:
- Informações de Contato
- Valor e Probabilidade
- Tags

Coluna Direita:
- Prioridade
- Próxima Ação
- Observações
- Última Interação

Footer:
- Botão "Abrir Conversa" (purple gradient)
- Botão "Editar Lead" (gray)
- Botão "Deletar" (red)
```

---

### 3. Paleta de Cores e Estilos

#### **Cores Principais**
```css
Purple Theme (Primary):
- from-purple-500 to-purple-600 (gradientes)
- purple-700 (texto destaque)
- purple-100 dark:purple-900/30 (backgrounds sutis)
- purple-50 dark:purple-900/10 (hover states)

Status Colors:
- Blue (Novo): bg-blue-500
- Cyan (Contato): bg-cyan-500
- Purple (Qualificação): bg-purple-500
- Amber (Proposta): bg-amber-500
- Orange (Negociação): bg-orange-500
- Green (Fechamento): bg-green-500

Probabilidade:
- Red: <40% (bg-red-500)
- Amber: 40-70% (bg-amber-500)
- Green: >70% (bg-green-500)

Neutros:
- Gray 50-950 (escala completa)
- White / Gray-900 (backgrounds)
- Gray-500 (textos secundários)
```

#### **Tipografia**
```css
Hierarquia:
- H1 (Título): text-5xl, font-bold
- H2 (Subtítulo): text-lg, font-semibold
- H3 (Card título): text-lg/xl, font-bold
- Body (Normal): text-sm, font-medium
- Caption: text-xs, text-gray-500

Pesos:
- font-bold: Títulos principais
- font-semibold: Subtítulos e labels
- font-medium: Textos normais
```

#### **Espaçamentos**
```css
Padding:
- Cards: p-6
- Containers principais: p-8
- Botões: px-4 py-2.5 / px-6 py-3

Gaps:
- Grid cards: gap-6
- Flex items: gap-3 / gap-4

Margens:
- Seções: mb-6 / mb-8
- Elementos internos: mb-2 / mb-4
```

#### **Bordas e Sombras**
```css
Border Radius:
- Cards principais: rounded-3xl
- Pills/Tags: rounded-full
- Botões: rounded-xl / rounded-2xl
- Inputs: rounded-2xl

Borders:
- Principal: border-3 border-gray-900 dark:border-gray-700
- Hover: border-purple-500
- Separadores: border-t-2 border-gray-100 dark:border-gray-800

Shadows:
- Padrão: var(--shadow-layered)
- Hover: shadow-xl
- Elementos flutuantes: shadow-2xl
```

---

### 4. Design Responsivo Planejado

#### **Breakpoints**
```css
Mobile (< 640px):
- Cards de estatísticas: grid-cols-1
- Pipeline: grid-cols-1
- Ocultar sidebar automaticamente
- Botão hamburguer para menu

Tablet (640px - 1024px):
- Cards de estatísticas: grid-cols-2
- Pipeline: grid-cols-2
- Tabela com scroll horizontal

Desktop (> 1024px):
- Cards de estatísticas: grid-cols-4
- Pipeline: grid-cols-3
- Sidebar fixa

Large Desktop (> 1280px):
- Pipeline: grid-cols-4
- Máxima largura: 1600px
```

#### **Ajustes Mobile**
```jsx
- Header: flex-col em mobile
- Botão "Novo Lead": w-full em mobile
- Filtros: expandir verticalmente
- Tabs de estágio: scroll horizontal
- Modal: padding reduzido, grid-cols-1
- Tabela: scroll horizontal obrigatório
```

---

## ✅ Verificação de Alinhamento

### Padrões do Projeto Seguidos

#### 1. **Purple Theme** ✓
- Gradientes: `from-purple-500 to-purple-600`
- Cores de destaque: `purple-700`, `purple-600`
- Backgrounds sutis: `purple-50 dark:purple-900/20`
- Hovers: `purple-100 dark:purple-900/30`

#### 2. **Rounded-3xl** ✓
- Cards principais: `rounded-3xl`
- Containers: `rounded-3xl`
- Modal: `rounded-3xl`
- Consistência em todos os elementos grandes

#### 3. **Shadow-layered** ✓
- CSS Variable utilizada: `var(--shadow-layered)`
- Aplicado em todos os cards e containers principais
- Hover states com `shadow-xl`

#### 4. **Border-3** ✓
- Padrão: `border-3 border-gray-900 dark:border-gray-700`
- Hover: transição para `border-purple-500`
- Separadores internos: `border-t-2`

#### 5. **Animações** ✓
- Entrada: `animate-fade-in-up`
- Delays: `delay-100`, `delay-200`, etc.
- Transições suaves: `transition-all duration-300`
- Hover effects: `scale-110`, `translateY(-8px)`

#### 6. **Dark Mode** ✓
- Classes dark: aplicadas em todos os elementos
- Contraste adequado
- Gradientes adaptados
- Backgrounds: `dark:bg-gray-900/950`

---

### Comparação com Padrões Existentes

#### **Dashboard.jsx**
- ✓ Mesma estrutura de cabeçalho
- ✓ Grid de cards com mesmos estilos
- ✓ Animações consistentes
- ✓ DatePicker não usado (CRM não precisa)

#### **Inbox.jsx**
- ✓ Sistema de busca similar
- ✓ Filtros dropdown consistentes
- ✓ Cards de conversa adaptados para leads
- ✓ Modal lateral vs modal centralizado (adequado ao contexto)

---

## 💡 Sugestões de Integração

### 1. Componentes Reutilizáveis de Outros Módulos

#### **Do Dashboard**
```jsx
// Card de Estatística (pode ser componentizado)
<StatCard
  icon={<FaChartLine />}
  title="Total em Leads"
  value={totalValue}
  subtitle="45 oportunidades"
  color="purple"
/>

// DatePicker de Período (se necessário filtro de datas)
<PeriodSelector
  startDate={startDate}
  endDate={endDate}
  onStartChange={setStartDate}
  onEndChange={setEndDate}
/>
```

#### **Do Inbox**
```jsx
// Sistema de Tags
<TagManager
  tags={tags}
  availableTags={availableTags}
  onAdd={handleAddTag}
  onRemove={handleRemoveTag}
/>

// Barra de Busca
<SearchBar
  value={searchTerm}
  onChange={setSearchTerm}
  placeholder="Buscar leads..."
/>

// Sistema de Filtros
<FilterPanel
  filters={filters}
  onFilterChange={handleFilterChange}
  isOpen={showFilters}
  onToggle={setShowFilters}
/>
```

---

### 2. Integração Visual com Inbox

#### **Navegação entre CRM e Inbox**
```jsx
// No card de lead (CRM)
<button
  onClick={() => onNavigate('inbox', { chatId: lead.id })}
  className="flex items-center gap-2 px-4 py-2 bg-purple-600..."
>
  <FaComments />
  Abrir Conversa
</button>

// No Inbox - adicionar botão para ver lead no CRM
<button
  onClick={() => onNavigate('crm', { leadId: contact.id })}
  className="flex items-center gap-2 px-4 py-2..."
>
  <FaHandshake />
  Ver no CRM
</button>
```

#### **Indicadores Visuais Compartilhados**
```jsx
// Tags coloridas (mesmo estilo)
<span className="px-2.5 py-1 bg-purple-100 dark:bg-purple-900/30
               text-purple-700 dark:text-purple-300
               text-xs font-medium rounded-full">
  {tag}
</span>

// Status de prioridade
<div className="flex gap-1">
  {renderPriorityStars(priority)}
</div>
```

---

### 3. Padrões de Navegação entre Páginas

#### **Estrutura de Navegação Proposta**

```jsx
// MainLayout.jsx - Sistema de navegação com parâmetros
const handleNavigate = (page, params = {}) => {
  setCurrentPage(page);

  // Parâmetros específicos por página
  if (params.chatId) setSelectedChatId(params.chatId);
  if (params.leadId) setSelectedLeadId(params.leadId);
  if (params.contactId) setSelectedContactId(params.contactId);
};

// Exemplos de uso:

// Dashboard → CRM (ver lead específico)
onNavigate('crm', { leadId: 123 })

// Dashboard → Inbox (ver conversa)
onNavigate('inbox', { chatId: 456 })

// CRM → Inbox (iniciar conversa)
onNavigate('inbox', { chatId: lead.id, openChat: true })

// Inbox → CRM (ver informações completas)
onNavigate('crm', { leadId: contact.id, openDetails: true })
```

#### **Breadcrumbs Sugerido**
```jsx
// Componente de navegação contextual
<Breadcrumb>
  <BreadcrumbItem href="/" icon={<FaHome />}>Dashboard</BreadcrumbItem>
  <BreadcrumbItem href="/crm" icon={<FaHandshake />}>CRM</BreadcrumbItem>
  <BreadcrumbItem active>João Silva</BreadcrumbItem>
</Breadcrumb>
```

#### **Menu Rápido no Header**
```jsx
// Quick Actions Menu (aparece em todas as páginas)
<QuickActions>
  <QuickAction
    icon={<FaPlus />}
    label="Novo Lead"
    onClick={() => openNewLeadModal()}
  />
  <QuickAction
    icon={<FaEnvelope />}
    label="Nova Mensagem"
    onClick={() => onNavigate('inbox', { newMessage: true })}
  />
  <QuickAction
    icon={<FaUser />}
    label="Novo Contato"
    onClick={() => openNewContactModal()}
  />
</QuickActions>
```

---

### 4. Fluxo de Trabalho Integrado

#### **Cenário 1: Lead → Conversa → Fechamento**
```
1. Usuário visualiza lead no CRM (Pipeline)
2. Clica em "Abrir Conversa"
3. Abre Inbox com conversa do lead
4. Conversa fluindo naturalmente
5. Botão "Ver Lead no CRM" disponível no painel lateral
6. Atualizar estágio do lead direto no Inbox
7. Marcar como "Fechado" e retornar ao CRM
```

#### **Cenário 2: Inbox → CRM → Qualificação**
```
1. Nova mensagem chega no Inbox
2. Usuário responde e identifica oportunidade
3. Clica em "Criar Lead no CRM"
4. Modal rápido de criação abre
5. Lead criado e vinculado ao contato
6. Navegação para CRM com lead selecionado
7. Informações adicionais preenchidas
```

#### **Cenário 3: Dashboard → Ação Rápida**
```
1. Dashboard mostra "Clientes +30min sem resposta"
2. Usuário clica no card do cliente
3. Abre Inbox com a conversa selecionada
4. Usuário responde
5. Se for lead, link "Ver no CRM" aparece
6. Atualização de status reflete em ambos
```

---

### 5. Estados Compartilhados (Context API Sugerido)

```jsx
// LeadContext.js - Estado global de leads
const LeadContext = createContext();

export const LeadProvider = ({ children }) => {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);

  const updateLeadStage = (leadId, newStage) => {
    // Atualiza em tempo real
  };

  const createLead = (data) => {
    // Adiciona novo lead
  };

  return (
    <LeadContext.Provider value={{
      leads,
      selectedLead,
      updateLeadStage,
      createLead
    }}>
      {children}
    </LeadContext.Provider>
  );
};

// Uso nas páginas:
// CRM.jsx
const { leads, updateLeadStage } = useContext(LeadContext);

// Inbox.jsx
const { createLead } = useContext(LeadContext);
```

---

### 6. Notificações e Alertas Visuais

```jsx
// Sistema de notificação entre páginas
<NotificationBadge page="crm">
  {/* Mostra quantidade de leads novos */}
  {newLeadsCount > 0 && (
    <span className="absolute -top-1 -right-1 w-5 h-5
                     bg-red-500 rounded-full text-white
                     text-xs font-bold flex items-center justify-center">
      {newLeadsCount}
    </span>
  )}
</NotificationBadge>

// No Sidebar
<FaHandshake /> CRM
{hasHighPriorityLeads && <PulsingDot color="red" />}
```

---

## 📊 Estatísticas de Implementação

### Componentes Criados
- 1 página principal (CRM.jsx)
- 6 tipos de visualização de dados
- 2 modos de exibição (Pipeline/Lista)
- 1 modal de detalhes completo
- 4 cards de estatísticas
- 7 estágios de pipeline
- Sistema completo de filtros

### Elementos Interativos
- 15+ botões funcionais
- 3 dropdowns
- 1 input de busca
- 1 toggle de visualização
- Sistema de tags dinâmico
- Barra de probabilidade animada
- Sistema de estrelas (prioridade)

### Responsividade
- 4 breakpoints cobertos
- Grid adaptativo (1-4 colunas)
- Tabela com scroll horizontal
- Modal responsivo
- Touch-friendly em mobile

---

## 🎨 Características Visuais Destacadas

### Melhorias sobre ChatPlatform
1. **Pipeline Visual Intuitivo**: Cards grandes com todas as informações visíveis
2. **Sistema de Prioridade**: Estrelas visuais ao invés de números
3. **Probabilidade em Barras**: Feedback visual imediato da chance de fechamento
4. **Tags Coloridas**: Identificação rápida de categorias
5. **Estágios Claros**: Navegação por tabs ao invés de filtros escondidos
6. **Modal Rico**: Todas as informações em um só lugar
7. **Dupla Visualização**: Pipeline (visual) e Lista (dados) no mesmo contexto
8. **Estatísticas no Topo**: KPIs sempre visíveis
9. **Ações Rápidas**: Menos cliques para ações comuns
10. **Dark Mode Completo**: Todos os elementos adaptados

---

## 🚀 Próximos Passos Sugeridos

### Funcionalidades a Implementar
1. **Backend Integration**
   - API de leads
   - Sincronização em tempo real
   - Persistência de dados

2. **Drag & Drop**
   - Mover leads entre estágios
   - Reordenar prioridades

3. **Histórico e Timeline**
   - Atividades do lead
   - Log de mudanças de estágio
   - Histórico de interações

4. **Relatórios e Analytics**
   - Funil de vendas visual
   - Taxa de conversão por estágio
   - Tempo médio por estágio

5. **Automações**
   - Emails automáticos
   - Lembretes de follow-up
   - Notificações de ações pendentes

6. **Integração com Calendário**
   - Agendar reuniões
   - Lembretes de próxima ação
   - Sincronização com Google Calendar

---

## 📝 Notas Finais

Este design foi criado seguindo rigorosamente os padrões estabelecidos no projeto:
- Purple theme consistente
- Rounded-3xl em todos os cards
- Shadow-layered como padrão
- Border-3 com transições suaves
- Dark mode completo e bem implementado
- Animações sutis e profissionais
- Responsividade em todos os níveis
- Acessibilidade considerada

O resultado é uma interface moderna, funcional e visualmente coerente com o resto da plataforma, superando o ChatPlatform em organização visual e usabilidade.
