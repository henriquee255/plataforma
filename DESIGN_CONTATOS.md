# Design da Página de Contatos - Plataforma

## Visão Geral

A página de Contatos foi desenvolvida seguindo o padrão de design da plataforma, inspirada em aplicativos de chat modernos como WhatsApp e plataformas de CRM profissionais. O design é limpo, intuitivo e responsivo.

---

## Estrutura da Página

### Layout Principal (3 Colunas)

```
+------------------+---------------------------+------------------+
|   SIDEBAR LISTA  |   ÁREA DE DETALHES       |                  |
|   DE CONTATOS    |   DO CONTATO             |                  |
|                  |                           |                  |
|   - Header       |   - Header do Contato    |                  |
|   - Busca        |   - Informações Pessoais |                  |
|   - Filtros      |   - Tags                 |                  |
|   - Lista Cards  |   - Atribuição           |                  |
|                  |   - Notas                |                  |
+------------------+---------------------------+------------------+
```

---

## 1. SIDEBAR ESQUERDA - Lista de Contatos

### 1.1 Header da Sidebar
- **Título:** "Contatos" em negrito
- **Botão:** Criar Novo Contato (ícone FaUserPlus)
- **Cor:** Roxo gradiente (bg-purple-600)

### 1.2 Barra de Busca
- Campo de texto com ícone de lupa (FaSearch)
- Placeholder: "Buscar por nome, telefone, email..."
- Busca em tempo real
- Fundo: Gray-100 (dark: Gray-900)
- Border radius: xl (rounded-xl)

### 1.3 Filtros (Dropdowns)
Três filtros principais em linha horizontal:

#### Filtro por Tag
- Ícone: FaTag
- Opções:
  - Todas Tags
  - VIP
  - Urgente
  - Importante
  - Cliente Novo
  - Recorrente
  - Promoção
  - Suporte
  - Vendas
  - Cancelamento
  - Follow-up

#### Filtro por Origem
- Ícone: FaMapMarkerAlt
- Opções:
  - Todas Origens
  - Site - Chat ao vivo
  - WhatsApp
  - Instagram
  - Facebook
  - Telefone
  - Email
  - Indicação
  - Outros

#### Filtro por Atribuição
- Ícone: FaUser
- Opções:
  - Todos
  - Meus
  - Não atribuídos

#### Botão de Ordenação
- Ícone: FaSortAmountDown / FaSortAmountUp
- Ordena por última interação (mais recentes primeiro/mais antigos primeiro)

### 1.4 Ações Rápidas
Dois botões lado a lado:
- **Importar** (FaFileImport) - Gray background
- **Exportar** (FaFileExport) - Gray background

### 1.5 Lista de Contatos (Cards)
Cada card de contato contém:
- **Avatar circular** com gradiente roxo e iniciais
- **Nome do contato** em negrito
- **Telefone** com ícone FaPhone
- **Tags** (máximo 2 visíveis + contador se houver mais)
- **Hover effect:** Elevação suave e mudança de background
- **Seleção:** Border roxo à esquerda quando selecionado

---

## 2. ÁREA CENTRAL - Detalhes do Contato

### 2.1 Header do Contato
- **Avatar grande** (64x64px) com gradiente roxo
- **Nome** em fonte grande e bold
- **Última interação** em fonte pequena e cinza
- **Botões de ação:**
  - Iniciar Conversa (purple-600, ícone FaComments)
  - Editar (ícone FaEdit)
  - Excluir (ícone FaTrash, vermelho)

### 2.2 Seção de Informações Pessoais

#### Card com Grid Responsivo (2 colunas em desktop)
- **Nome Completo**
  - Ícone: Nenhum
  - Campo editável quando em modo de edição

- **Telefone**
  - Ícone: FaPhone (roxo)
  - Campo editável quando em modo de edição

- **Email**
  - Ícone: FaEnvelope (roxo)
  - Campo editável quando em modo de edição

- **Documento (CPF/CNPJ)**
  - Ícone: FaIdCard (roxo)
  - Campo editável quando em modo de edição

- **Origem do Contato** (2 colunas de largura)
  - Ícone: FaMapMarkerAlt (roxo)
  - Select dropdown quando em modo de edição

**Design:**
- Background: White (dark: Gray-950)
- Border: Gray-200 (dark: Gray-800)
- Border radius: xl
- Padding: 6 (p-6)

### 2.3 Seção de Tags

#### Card de Tags
- **Título:** "Tags" em negrito
- **Tags existentes:**
  - Background: Purple-100 (dark: Purple-900/30)
  - Texto: Purple-700 (dark: Purple-300)
  - Border radius: lg
  - Botão X para remover

- **Botão Adicionar Tag:**
  - Background: Purple-100 (dark: Purple-900/30)
  - Texto: "+" Adicionar Tag
  - Abre dropdown com tags disponíveis
  - Filtra tags já adicionadas

**Design:**
- Background: White (dark: Gray-950)
- Border: Gray-200 (dark: Gray-800)
- Border radius: xl
- Padding: 6 (p-6)

### 2.4 Seção de Atribuição

#### Card de Atribuição
- **Mostra:** "Atribuído para: [Nome/Não atribuído]"
- **Botões:**
  - **Se não atribuído:** "Atribuir a mim" (purple-600)
  - **Se atribuído:** "Desatribuir" (red-50, texto red-600)
  - **Dropdown:** "Transferir para" com lista de atendentes

**Design:**
- Background: White (dark: Gray-950)
- Border: Gray-200 (dark: Gray-800)
- Border radius: xl
- Padding: 6 (p-6)

### 2.5 Seção de Notas/Observações

#### Card de Notas
- **Título:** "Observações dos Atendentes"
- **Textarea para nova nota:**
  - Placeholder: "Adicionar observação sobre este contato..."
  - Rows: 4
  - Background: Gray-100 (dark: Gray-800)
  - Border radius: lg

- **Botão Adicionar Nota:**
  - Background: Purple-600
  - Texto: "Adicionar Nota"
  - Desabilitado quando textarea vazia

- **Lista de Notas (Histórico):**
  - Cada nota em card separado
  - Background: Gray-50 (dark: Gray-800)
  - Mostra: texto da nota, data/hora
  - Botões: Editar (purple) e Excluir (red)
  - Hover: Border muda para purple-300

- **Estado vazio:**
  - Ícone grande FaEdit centralizado
  - Texto: "Nenhuma observação ainda"
  - Subtexto: "Adicione notas sobre este contato"

**Design:**
- Background: White (dark: Gray-950)
- Border: Gray-200 (dark: Gray-800)
- Border radius: xl
- Padding: 6 (p-6)

---

## 3. ESTADO VAZIO - Nenhum Contato Selecionado

### Tela Centralizada
- **Gradiente de fundo:** Gray-50 para Purple-50/20
- **Ícone grande:** FaUser em círculo roxo (96x96px)
- **Texto principal:** "Selecione um contato"
- **Subtexto:** "Escolha um contato da lista para ver os detalhes"
- **Botão CTA:** "Criar novo contato" (purple-600)

---

## Paleta de Cores

### Cores Principais
- **Purple-500/600:** Cor primária da plataforma
- **Gray-50/100/200:** Backgrounds neutros
- **Gray-900/950:** Backgrounds dark mode
- **Red-600/50:** Ações de exclusão/desatribuir
- **Green-600:** Ações de confirmação

### Cores por Tag (Exemplo)
- **VIP:** Purple-100/700
- **Urgente:** Red-100/700
- **Importante:** Orange-100/700
- **Cliente Novo:** Green-100/700
- **Recorrente:** Blue-100/700
- **Promoção:** Pink-100/700
- **Suporte:** Cyan-100/700
- **Vendas:** Emerald-100/700

---

## Tipografia

### Fontes
- **Títulos grandes:** text-xl/text-lg, font-bold
- **Títulos de seção:** text-lg, font-bold
- **Texto normal:** text-sm, font-medium
- **Labels:** text-xs, text-gray-500
- **Botões:** text-sm, font-medium/font-semibold

---

## Espaçamentos e Bordas

### Padding
- **Cards principais:** p-6
- **Cards secundários:** p-4/p-3
- **Botões:** px-4 py-2 (médio), px-3 py-1.5 (pequeno)

### Border Radius
- **Cards principais:** rounded-xl
- **Botões:** rounded-lg
- **Tags:** rounded-full
- **Inputs:** rounded-lg

### Gaps
- **Entre elementos:** gap-2, gap-3, gap-4
- **Grid columns:** gap-4
- **Flex items:** gap-2

---

## Interações e Animações

### Hover Effects
- **Cards de contato:**
  - Elevação suave (hover:shadow-xl)
  - Translação para cima (hover:-translate-y-1)
  - Mudança de border color

- **Botões:**
  - Mudança de cor (hover:bg-purple-700)
  - Cursor pointer

- **Tags:**
  - Opacidade dos botões de remover

### Transições
- **Duração:** transition-all/transition-colors
- **Ease:** ease-in-out
- **Elementos:** opacity, background, border, transform

### Estados
- **Selecionado:** Border roxo à esquerda, background purple-50
- **Desabilitado:** opacity-50, cursor-not-allowed
- **Loading:** (a implementar)

---

## Responsividade

### Breakpoints
- **Mobile (< 1024px):**
  - Sidebar overlay com backdrop
  - Layout de coluna única
  - Botão de toggle visível

- **Tablet (1024px - 1280px):**
  - Sidebar visível
  - Grid adaptativo (2 colunas)

- **Desktop (> 1280px):**
  - Layout completo de 3 colunas
  - Grid 2 colunas nas informações

### Grid Responsivo
```css
grid-cols-1 md:grid-cols-2
```

---

## Funcionalidades Implementadas

### Busca e Filtros
- Busca em tempo real por nome, telefone e email
- Filtro por tag com seleção única
- Filtro por origem do contato
- Filtro por atribuição (meus/não atribuídos)
- Ordenação por última interação (asc/desc)

### Gerenciamento de Contatos
- Criar novo contato (placeholder)
- Selecionar contato
- Editar informações do contato
- Excluir contato (com confirmação)
- Atribuir/Desatribuir contato
- Transferir para outro atendente

### Tags
- Adicionar tags ao contato
- Remover tags do contato
- Visualização de tags (máx 2 + contador)
- Cores diferenciadas por tipo de tag

### Notas
- Adicionar nota/observação
- Editar nota existente
- Excluir nota
- Histórico de notas com data/hora

### Navegação
- Iniciar conversa (navega para Inbox)
- Importar contatos (placeholder)
- Exportar contatos (placeholder)

---

## Integração com Outras Páginas

### Sidebar (Menu Principal)
- Item "Contatos" com ícone FaUsers
- Navegação via onNavigate('contacts')

### MainLayout
- Importa componente Contacts
- Renderiza quando currentPage === 'contacts'

### Inbox
- Botão "Iniciar conversa" navega para Inbox
- Passa contactId como parâmetro

---

## Dados Mockados (Exemplo)

### Estrutura de Contato
```javascript
{
  id: 1,
  nome: 'João Silva',
  avatar: 'JS',
  telefone: '+55 (11) 98765-4321',
  email: 'joao.silva@email.com',
  documento: '123.456.789-00',
  origem: 'Site - Chat ao vivo',
  tags: ['VIP', 'Urgente'],
  atribuidoPara: 'Você',
  ultimaInteracao: '2024-02-23 10:30',
  timestampValue: 1030
}
```

### Estrutura de Nota
```javascript
{
  id: 1,
  text: 'Cliente interessado em produtos premium',
  date: '20/02/2026 14:30'
}
```

---

## Acessibilidade

### Boas Práticas
- Labels semânticos em todos os inputs
- Titles em botões de ação
- Contraste adequado entre texto e fundo
- Estados visuais claros (hover, focus, active)
- Navegação por teclado (a implementar)

### Dark Mode
- Suporte completo a tema escuro
- Cores adaptadas para legibilidade
- Gradientes ajustados

---

## Performance

### Otimizações
- Filtragem em memória (sem requisições desnecessárias)
- Renderização condicional
- Uso de índices únicos em listas
- Estados locais otimizados

---

## Próximos Passos / Melhorias Futuras

### Funcionalidades
- [ ] Integração com API backend
- [ ] Upload de foto de perfil
- [ ] Histórico completo de interações
- [ ] Segmentação avançada de contatos
- [ ] Exportação em CSV/Excel
- [ ] Importação em massa
- [ ] Campos customizados
- [ ] Integração com redes sociais

### UI/UX
- [ ] Skeleton loading states
- [ ] Animações de transição entre estados
- [ ] Drag and drop para ordenação
- [ ] Visualização em tabela (além de grid)
- [ ] Paginação ou scroll infinito
- [ ] Atalhos de teclado
- [ ] Tour guiado (onboarding)

### Performance
- [ ] Virtualização de lista para grandes volumes
- [ ] Cache de dados
- [ ] Lazy loading de componentes
- [ ] Otimização de imagens

---

## Referências de Design

Esta página foi inspirada em:
- **WhatsApp Web:** Layout de 3 colunas, sidebar com lista
- **HubSpot CRM:** Cards de informação, tags coloridas
- **Intercom:** Sistema de notas e atribuição
- **Material Design:** Componentes e espaçamentos
- **Tailwind UI:** Padrões de design e utilidades

### Recursos Utilizados
- [Chat UI Design Ideas - Muzli](https://muz.li/inspiration/chat-ui/)
- [Chat App UI Design Template - Uizard](https://uizard.io/templates/mobile-app-templates/messaging-app/)
- [The Ultimate Chat App Design Guide - Contus](https://www.contus.com/blog/chat-ui-implemtation/)
- [Chat User Interface Design - UXPin](https://www.uxpin.com/studio/blog/chat-user-interface-design/)
- [24 resources for a killer chat app UI - Sendbird](https://sendbird.com/blog/resources-for-modern-chat-app-ui)

---

## Conclusão

A página de Contatos foi desenvolvida com foco em:
- **Usabilidade:** Interface intuitiva e fácil de navegar
- **Design consistente:** Seguindo os padrões da plataforma
- **Responsividade:** Funciona em todos os tamanhos de tela
- **Funcionalidade completa:** Todas as operações essenciais implementadas
- **Extensibilidade:** Estrutura preparada para futuras melhorias

O design privilegia a simplicidade e a eficiência, permitindo que os usuários gerenciem seus contatos de forma rápida e organizada, com acesso fácil a todas as informações relevantes e histórico de interações.
