# Plataforma de Gestão e Atendimento

> Sistema completo de gestão de atendimento, vendas e equipe com integrações de plataformas de pagamento

## Índice

- [Visão Geral](#visão-geral)
- [Funcionalidades Principais](#funcionalidades-principais)
- [Requisitos](#requisitos)
- [Instalação](#instalação)
- [Como Rodar](#como-rodar)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Sistema de Permissões](#sistema-de-permissões)
- [Planos e Recursos](#planos-e-recursos)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Testes](#testes)
- [Acessibilidade](#acessibilidade)
- [Contribuindo](#contribuindo)

## Visão Geral

Plataforma completa para gestão de atendimento ao cliente, vendas, equipe e integrações com principais plataformas de pagamento do mercado. Sistema totalmente responsivo com suporte a dark mode e foco em acessibilidade (WCAG 2.1 AA).

## Funcionalidades Principais

### Dashboard

- **Dashboard Principal**: Métricas de atendimento com visão geral de contatos, mensagens e clientes esperando
- **Dashboard de Vendas**: Métricas específicas por plataforma de pagamento integrada (Kiwify, Hotmart, Stripe, etc)
- **Pico de Clientes**: Gráfico de horários de maior movimento
- **Clientes Aguardando**: Lista de clientes esperando há mais de 30 minutos

### Inbox

- Sistema de mensagens estilo WhatsApp
- Atribuição de conversas para membros da equipe
- Arquivamento de conversas
- Filtros por status (todas, não lidas, atribuídas)
- Mensagens rápidas (Quick Replies)

### CRM

- Pipeline visual de vendas com drag-and-drop
- Funis personalizáveis (Prospecção, Qualificação, Proposta, Fechamento, Pós-venda)
- Visualização de valores monetários
- Cartões de negócio com informações detalhadas

### Contatos

- Gerenciamento completo de contatos
- Visualização em tabela responsiva
- Tags e segmentação
- Importação/exportação
- Pesquisa e filtros avançados

### Equipe

- Gerenciamento de membros da equipe
- Sistema de permissões granulares
- Cargos e departamentos personalizáveis
- Controle de carga horária
- Estatísticas de performance

### Integrações

**Plataformas de Pagamento:**
- Kiwify
- Hotmart
- Eduzz
- Monetizze
- Stripe
- Perfect Pay
- Braip
- Ticto

**Funcionalidades de Integração:**
- Tags automáticas baseadas em produtos
- Dados de clientes (email, CPF, telefone)
- Total de vendas e faturamento
- Métodos de pagamento (Cartão, PIX, Boleto)
- Tipo de compra (Vitalício, Anual, Mensal)
- Relatório de reembolsos
- Últimas compras com detalhes

### Conexões

- WhatsApp
- Instagram
- Facebook Messenger
- Telegram
- E-mail
- SMS

### Relatórios

- Relatórios de vendas
- Relatórios de atendimento
- Performance da equipe
- Exportação em múltiplos formatos

## Requisitos

- **Node.js**: 18.x ou superior
- **npm**: 9.x ou superior (ou yarn/pnpm)
- **Navegador**: Chrome, Firefox, Safari ou Edge (versões recentes)

## Instalação

```bash
# Clone o repositório
git clone <url-do-repositorio>

# Entre na pasta do projeto
cd plataforma

# Instale as dependências
npm install
```

## Como Rodar

### Modo Desenvolvimento

```bash
npm run dev
```

O projeto estará disponível em `http://localhost:5173`

### Build para Produção

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`

### Preview da Build

```bash
npm run preview
```

## Estrutura do Projeto

```
plataforma/
├── src/
│   ├── components/           # Componentes reutilizáveis
│   │   ├── ui/              # Componentes base (Radix UI + Tailwind)
│   │   └── custom/          # Componentes personalizados
│   ├── contexts/            # Context API (Auth, App)
│   ├── hooks/               # Custom hooks
│   ├── pages/               # Páginas da aplicação
│   ├── services/            # Serviços de API
│   ├── utils/               # Funções utilitárias
│   ├── __tests__/           # Testes unitários
│   ├── App.jsx              # Componente raiz
│   ├── MainLayout.jsx       # Layout principal com roteamento
│   ├── Sidebar.jsx          # Menu lateral
│   ├── Dashboard.jsx        # Dashboard principal
│   ├── Inbox.jsx            # Sistema de mensagens
│   ├── CRM.jsx              # Pipeline de vendas
│   ├── Contacts.jsx         # Gerenciamento de contatos
│   ├── Team.jsx             # Gerenciamento de equipe
│   ├── Integrations.jsx     # Integrações de pagamento
│   ├── Connections.jsx      # Conexões de canais
│   └── main.jsx             # Entry point
├── public/                  # Arquivos estáticos
├── .claude/                 # Configurações do AIOS
└── docs/                    # Documentação

```

## Sistema de Permissões

O sistema possui permissões granulares organizadas por módulo:

### Níveis de Acesso

- **Proprietário**: Acesso total a todos os recursos
- **Administrador**: Acesso quase total, exceto configurações críticas
- **Gerente**: Gerenciamento de equipe e visualização de relatórios
- **Atendente**: Acesso a inbox e contatos
- **Vendedor**: Acesso a CRM e contatos
- **Visualizador**: Apenas visualização, sem edição

### Módulos de Permissões

#### Dashboard
- `dashboard_visualizar` - Visualizar dashboard
- `dashboard_editar` - Editar configurações do dashboard

#### Inbox
- `inbox_visualizar` - Ver conversas
- `inbox_responder` - Responder mensagens
- `inbox_atribuir` - Atribuir conversas
- `inbox_arquivar` - Arquivar conversas
- `inbox_deletar` - Deletar conversas

#### CRM
- `crm_visualizar` - Ver pipeline
- `crm_editar` - Editar negócios
- `crm_criar` - Criar negócios
- `crm_deletar` - Deletar negócios
- `crm_valores` - Ver valores financeiros
- `crm_valores_proprios` - Ver apenas valores próprios

#### Contatos
- `contatos_visualizar` - Ver contatos
- `contatos_editar` - Editar contatos
- `contatos_criar` - Criar contatos
- `contatos_deletar` - Deletar contatos
- `contatos_exportar` - Exportar dados

#### Equipe
- `equipe_visualizar` - Ver membros
- `equipe_convidar` - Convidar membros
- `equipe_editar` - Editar membros
- `equipe_remover` - Remover membros
- `equipe_permissoes` - Gerenciar permissões

#### Integrações
- `integracoes_visualizar` - Ver integrações
- `integracoes_configurar` - Configurar integrações
- `integracoes_dashboard` - Ver dashboard de vendas

#### Relatórios
- `relatorios_visualizar` - Ver relatórios
- `relatorios_exportar` - Exportar relatórios
- `relatorios_criar` - Criar relatórios personalizados

#### Configurações
- `config_visualizar` - Ver configurações
- `config_editar` - Editar configurações
- `config_plano` - Gerenciar plano e pagamento

## Planos e Recursos

### Plano Gratuito
- 1 usuário
- 100 contatos
- Recursos básicos de atendimento

### Plano Starter (R$ 49/mês)
- 3 usuários
- 1.000 contatos
- 1 integração de pagamento
- Inbox e CRM básico

### Plano Professional (R$ 199/mês)
- 10 usuários
- 10.000 contatos
- 3 integrações de pagamento
- Todos os recursos + Relatórios avançados

### Plano Business (R$ 499/mês)
- 50 usuários
- 50.000 contatos
- Integrações ilimitadas
- Todos os recursos + API + Suporte prioritário

### Plano Enterprise (Personalizado)
- Usuários ilimitados
- Contatos ilimitados
- Recursos personalizados
- Suporte dedicado

## Tecnologias Utilizadas

### Core
- **React 19** - Biblioteca UI
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utility-first

### UI Components
- **Radix UI** - Componentes acessíveis e sem estilo
- **Lucide React** - Ícones
- **React Icons** - Ícones adicionais
- **Recharts** - Gráficos e visualizações

### Estado e Contexto
- **Context API** - Gerenciamento de estado global
- **Custom Hooks** - Lógica reutilizável

### Testes
- **Vitest** - Framework de testes
- **Testing Library** - Testes de componentes React
- **@vitest/ui** - Interface visual para testes

### Qualidade de Código
- **ESLint** - Linter JavaScript/React
- **Prettier** - Formatação de código (via ESLint)

### Utilitários
- **clsx** - Manipulação de classes CSS
- **tailwind-merge** - Merge de classes Tailwind
- **class-variance-authority** - Variantes de componentes

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento

# Build
npm run build            # Cria build de produção
npm run preview          # Preview da build de produção

# Qualidade de Código
npm run lint             # Executa linter

# Testes
npm test                 # Executa testes em modo watch
npm run test:ui          # Interface visual de testes
npm run test:coverage    # Testes com cobertura
npm run test:ci          # Testes para CI/CD
```

## Testes

O projeto utiliza Vitest e Testing Library para testes:

```bash
# Rodar todos os testes
npm test

# Rodar com interface visual
npm run test:ui

# Gerar relatório de cobertura
npm run test:coverage
```

### Estrutura de Testes

```
src/
├── __tests__/           # Testes de componentes
│   ├── components/      # Testes de componentes UI
│   ├── utils/           # Utilitários de teste
│   └── App.test.jsx     # Testes do App
└── tests/               # Testes de páginas
    ├── useAuth.test.jsx
    ├── LoginNew.test.jsx
    └── Admin.test.jsx
```

## Acessibilidade

O projeto segue as diretrizes **WCAG 2.1 nível AA**:

- **Navegação por teclado**: Todos os elementos interativos são acessíveis via teclado
- **ARIA labels**: Labels apropriados para leitores de tela
- **Contraste de cores**: Contraste mínimo de 4.5:1 para texto normal
- **Skip links**: Links para pular navegação
- **Screen Reader Announcer**: Anúncios de mudanças de página
- **Focus visible**: Indicadores claros de foco
- **Semantic HTML**: Uso de elementos semânticos

## Contribuindo

1. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
2. Commit suas mudanças (`git commit -m 'feat: Adiciona MinhaFeature'`)
3. Push para a branch (`git push origin feature/MinhaFeature`)
4. Abra um Pull Request

### Padrões de Commit

Seguimos o padrão **Conventional Commits**:

- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Documentação
- `style:` - Formatação, sem mudança de código
- `refactor:` - Refatoração de código
- `test:` - Adição ou correção de testes
- `chore:` - Tarefas de manutenção

## Licença

Copyright © 2026 - Todos os direitos reservados

---

**Desenvolvido com** ❤️ **usando React, Vite e Tailwind CSS**
