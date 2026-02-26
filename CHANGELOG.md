# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [2.0.0] - 2026-02-24

### Redesignado

#### Admin Panel
- 🎨 **Redesign completo do painel administrativo** seguindo estilo do chat-platform
- **Sidebar escura** (bg-[#0f172a]) com navegação vertical fixa
- **Paleta de cores atualizada** de Purple para Rose/Red como cor principal
- **Layout modernizado** com sidebar + conteúdo (substituindo header + tabs)
- **Tipografia profissional** com font-black e tracking-tight
- **Footer da sidebar** com informações do admin e badge "GOD"
- **Botão "Voltar ao Painel"** para navegação rápida
- **Scrollbar customizada** na sidebar com estilo rose

### Adicionado

#### Admin Panel - Novas Features
- **Indicadores de Trend** em cards de métricas (setas de crescimento)
- **Distribuição Visual de Planos** com barras de progresso coloridas
- **Taxa de Churn Dinâmica** com indicador vermelho/verde baseado em threshold (3.5%)
- **Seção de Empresas** dedicada para gerenciamento de empresas cadastradas
- **Ícones contextualizados** por plano (Calendar, Star, Infinity, Activity)
- **Badges customizados** para cada tipo de plano e status
- **Hover states profissionais** em todos os elementos interativos
- **Tabelas com hover** para melhor visualização de linhas

#### Admin Panel - Métricas
- **MRR** (Receita Mensal Recorrente)
- **ARR** (Receita Anual Projetada)
- **Cancelamentos estimados** por mês
- **Uptime do sistema** em destaque
- **Taxa de churn** com comparação à média do mercado
- **Gráfico de distribuição de assinaturas** por plano

#### Admin Panel - Seções
- **Dashboard Geral** - Visão executiva com 4 métricas principais + saúde da plataforma
- **Empresas** - Listagem completa de empresas cadastradas
- **Usuários & Admins** - Gerenciamento de usuários com pesquisa e ações
- **Integrações** - Status de todas as integrações do sistema
- **Logs de Atividade** - Timeline de eventos com filtros por nível
- **Analytics** - Métricas avançadas e insights
- **Configurações Globais** - Segurança, notificações, aparência e sistema

### Melhorado

#### Admin Panel - UX
- **Navegação aprimorada** com sidebar sempre visível
- **Hierarquia visual clara** usando diferentes tamanhos de fonte e pesos
- **Feedback visual consistente** com transitions suaves
- **Responsividade otimizada** em todos os breakpoints
- **Acessibilidade aprimorada** com contraste adequado e labels semânticos
- **Performance visual** com animações suaves (300ms)

#### Admin Panel - Design System
- **Cards uniformes** com `rounded-2xl border border-slate-100 shadow-sm`
- **Badges padronizados** com cores específicas por categoria
- **Gradientes sutis** nos ícones e elementos ativos
- **Espaçamento consistente** usando sistema de grid Tailwind

### Documentação
- 📚 **ADMIN_REDESIGN_OBSIDIAN.md** - Documentação completa em formato Obsidian
- Análise detalhada do design do chat-platform
- Comparação visual antes/depois
- Design system completo com paleta de cores e tipografia
- Exemplos de código para cada componente
- Checklist de implementação
- Guia de melhorias futuras

## [1.0.0] - 2026-02-24

### Adicionado

#### Core
- Sistema completo de autenticação com JWT
- Context API para gerenciamento de estado global
- Sistema de permissões granulares por módulo
- Suporte a múltiplos planos de assinatura
- Dark mode com persistência
- Modo trial de 7 dias

#### Dashboard
- Dashboard principal com métricas de atendimento
- Dashboard de vendas por plataforma integrada
- Gráficos de pico de clientes por hora
- Lista de clientes esperando atendimento há mais de 30 minutos
- Filtros por período de data
- Seletor dinâmico de dashboard

#### Inbox
- Sistema de mensagens estilo WhatsApp
- Atribuição de conversas para membros da equipe
- Arquivamento de conversas
- Filtros por status (todas, não lidas, atribuídas)
- Mensagens rápidas (Quick Replies)
- Informações detalhadas de contato
- Suporte a emojis

#### CRM
- Pipeline visual de vendas com drag-and-drop
- Funis personalizáveis
- Cartões de negócio com informações detalhadas
- Qualificação de leads
- Marcação de leads como perdidos
- Fechamento de vendas com detalhes
- Visualização de valores monetários

#### Contatos
- Gerenciamento completo de contatos
- Visualização em tabela responsiva
- Sistema de tags
- Atribuição de responsáveis
- Transferência de contatos
- Integração com CRM
- Pesquisa e filtros

#### Equipe
- Gerenciamento de membros da equipe
- Sistema de permissões por módulo
- Cargos e departamentos personalizáveis
- Criação de departamentos customizados com cores e ícones
- Controle de carga horária
- Permissões por departamento
- Estatísticas de performance
- Convite de novos membros

#### Integrações de Pagamento
- Suporte a 8+ plataformas (Kiwify, Hotmart, Eduzz, Monetizze, Stripe, Perfect Pay, Braip, Ticto)
- Configuração de credenciais por plataforma
- Dashboard de vendas específico por plataforma
- Métricas detalhadas:
  - Total de vendas e faturamento
  - Métodos de pagamento (Cartão, PIX, Boleto)
  - Tipo de compra (Vitalício, Anual, Mensal)
  - Reembolsos
  - Últimas vendas com detalhes
- Sincronização de dados
- Instruções de configuração

#### Conexões
- Configuração de canais de comunicação
- WhatsApp Business
- Instagram
- Facebook Messenger
- Telegram
- E-mail
- SMS

#### Interface
- Design moderno com Tailwind CSS
- Totalmente responsivo (mobile, tablet, desktop)
- Componentes acessíveis com Radix UI
- Animações e transições suaves
- Ícones com React Icons e Lucide
- Gráficos com Recharts

#### Acessibilidade
- Conformidade com WCAG 2.1 nível AA
- Navegação por teclado completa
- ARIA labels apropriados
- Contraste de cores adequado
- Skip links para navegação
- Screen Reader Announcer
- Focus trap em modais
- Anúncios de mudanças de página

#### Planos e Recursos
- **Gratuito**: 1 usuário, 100 contatos
- **Starter**: 3 usuários, 1.000 contatos, 1 integração (R$ 49/mês)
- **Professional**: 10 usuários, 10.000 contatos, 3 integrações (R$ 199/mês)
- **Business**: 50 usuários, 50.000 contatos, integrações ilimitadas (R$ 499/mês)
- **Enterprise**: Recursos personalizados

#### Sistema de Permissões
- Dashboard (visualizar, editar)
- Inbox (visualizar, responder, atribuir, arquivar, deletar)
- CRM (visualizar, editar, criar, deletar, valores)
- Contatos (visualizar, editar, criar, deletar, exportar)
- Equipe (visualizar, convidar, editar, remover, permissões)
- Integrações (visualizar, configurar, dashboard)
- Relatórios (visualizar, exportar, criar)
- Configurações (visualizar, editar, plano)

#### Testes
- Configuração completa do Vitest
- Testes de componentes com Testing Library
- Interface visual de testes (@vitest/ui)
- Cobertura de código
- Testes de integração

#### Documentação
- README.md completo com:
  - Visão geral do projeto
  - Instruções de instalação
  - Estrutura do projeto
  - Sistema de permissões detalhado
  - Planos e recursos
  - Tecnologias utilizadas
  - Guia de contribuição
- Comentários JSDoc em funções principais
- TODOs estratégicos para features futuras
- CHANGELOG.md seguindo Keep a Changelog

### Melhorado
- Performance geral da aplicação
- Responsividade em dispositivos móveis
- Experiência de usuário
- Feedback visual em ações
- Mensagens de erro descritivas

### Corrigido
- Persistência de tema entre sessões
- Fechamento de modais com tecla Esc
- Focus trap em modais
- Navegação por teclado
- Contraste de cores no dark mode

## [0.1.0] - 2026-02-20

### Adicionado
- Estrutura inicial do projeto
- Configuração do Vite
- Instalação do Tailwind CSS
- Componentes base

---

## Legendas

### Tipos de Mudanças
- **Adicionado** - Para novas funcionalidades
- **Alterado** - Para mudanças em funcionalidades existentes
- **Descontinuado** - Para funcionalidades que serão removidas
- **Removido** - Para funcionalidades removidas
- **Corrigido** - Para correção de bugs
- **Segurança** - Para vulnerabilidades corrigidas

### Versionamento
- **MAJOR** (X.0.0) - Mudanças incompatíveis com versões anteriores
- **MINOR** (0.X.0) - Novas funcionalidades compatíveis
- **PATCH** (0.0.X) - Correções de bugs
