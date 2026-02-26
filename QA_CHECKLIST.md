# Checklist de Testes - Plataforma CRM

Use este checklist para validar todas as funcionalidades da plataforma após fazer correções ou adicionar novas features.

---

## 1. Navegação entre Páginas

### Dashboard
- [ ] Dashboard carrega corretamente
- [ ] Gráficos são exibidos
- [ ] KPIs mostram valores corretos
- [ ] Clientes esperando aparecem na lista
- [ ] Botão "Atender" redireciona para Inbox
- [ ] Selector de dashboard (principal/kiwify/stripe) funciona

### Sidebar
- [ ] Sidebar abre e fecha em desktop
- [ ] Sidebar fica oculta em mobile (<1024px)
- [ ] Todos os ícones são exibidos
- [ ] Hover mostra tooltip em sidebar fechada
- [ ] Navegação funciona para todas as páginas
- [ ] Contador de notificações aparece (se houver)

### Páginas Principais
- [ ] Dashboard
- [ ] Empresas
- [ ] Relatórios
- [ ] Inbox
- [ ] Contatos
- [ ] CRM
- [ ] IA
- [ ] Equipe
- [ ] Conexões
- [ ] Integrações
- [ ] Base de Conhecimento
- [ ] Profile
- [ ] Admin (se for admin)

---

## 2. Dark Mode

### Toggle de Tema
- [ ] Botão de dark mode na sidebar funciona
- [ ] Mudança é instantânea
- [ ] Tema persiste ao recarregar página
- [ ] Tema persiste ao navegar entre páginas

### Páginas com Dark Mode
- [ ] Dashboard - todos os cards ficam escuros
- [ ] Integrations - cards e modais escuros
- [ ] Team - tabela e cards escuros
- [ ] Contacts - tabela escura
- [ ] CRM - cards de leads escuros
- [ ] Inbox - chat escuro
- [ ] Profile - formulários escuros
- [ ] Companies - cards escuros
- [ ] Connections - cards escuros
- [ ] IA - interface escura
- [ ] Reports - gráficos escuros
- [ ] KnowledgeBase - artigos escuros
- [ ] Subscription - planos escuros
- [ ] Admin - dashboard escuro
- [ ] Sidebar - background escuro
- [ ] LoginNew - (usa gradiente fixo, OK)
- [ ] Register - dark mode funcional

### Elementos Específicos
- [ ] Modais ficam escuros
- [ ] Dropdowns ficam escuros
- [ ] Tooltips ficam escuros
- [ ] Inputs ficam escuros
- [ ] Buttons mantêm contraste
- [ ] Textos ficam claros (legíveis)

---

## 3. Modais e Diálogos

### Integrations Modals
- [ ] Modal de configuração abre
- [ ] ESC fecha o modal
- [ ] Click no backdrop fecha
- [ ] Modal de dados sincronizados abre
- [ ] Tabs de dados funcionam (clientes, produtos, vendas, reembolsos)
- [ ] Dados são exibidos corretamente

### Team Modals
- [ ] Modal de adicionar membro abre
- [ ] Modal de detalhes do membro abre
- [ ] Tabs funcionam (info, permissões, carga horária)
- [ ] ESC fecha os modais
- [ ] Formulários validam corretamente

### CRM Modals
- [ ] Modal de adicionar lead abre
- [ ] Modal de detalhes do lead abre
- [ ] Modal de editar lead abre
- [ ] Modal de qualificação abre
- [ ] Modal de selecionar contatos abre
- [ ] ESC fecha todos os modais

### Contacts Modals
- [ ] Sidebar de detalhes abre
- [ ] Modal de enviar para CRM abre
- [ ] Modal de atalhos abre
- [ ] ESC fecha sidebar e modais

### Companies Modals
- [ ] Modal de adicionar empresa abre
- [ ] Formulário valida
- [ ] ESC fecha

### Connections Modals
- [ ] Modais de configuração abrem para cada canal
- [ ] QR Code é exibido (WhatsApp)
- [ ] Preview do widget funciona
- [ ] ESC fecha

### IA Modals
- [ ] Modal de adicionar fonte abre
- [ ] Modal de visualizar fonte abre
- [ ] Tipos de fonte funcionam (PDF, URL, YouTube, Manual)
- [ ] ESC fecha

### Focus Trap (Acessibilidade)
- [ ] TAB navega dentro do modal
- [ ] TAB não sai do modal quando aberto
- [ ] Primeiro elemento recebe foco ao abrir
- [ ] Foco volta para elemento que abriu ao fechar

---

## 4. Formulários

### Login (LoginNew.jsx)
- [ ] Validação de email (formato correto)
- [ ] Validação de senha (campo obrigatório)
- [ ] Mensagem de erro aparece se credenciais inválidas
- [ ] Loading state durante login
- [ ] Redireciona para dashboard após login
- [ ] Botão de registrar redireciona

### Profile
- [ ] Nome, email, telefone carregam do contexto
- [ ] Edição salva corretamente
- [ ] Mudança de senha valida senha atual
- [ ] Senha nova precisa ter 6+ caracteres
- [ ] Senha nova e confirmação precisam ser iguais
- [ ] Upload de avatar funciona
- [ ] Feedback de sucesso aparece
- [ ] Notificações salvam

### Team - Invite Member
- [ ] Email é obrigatório
- [ ] Cargo é obrigatório
- [ ] Setor é obrigatório
- [ ] Convite é enviado
- [ ] Membro aparece na lista

### Integrations - Config
- [ ] Campos obrigatórios são validados
- [ ] Webhook URL é readonly
- [ ] Testa conexão funciona
- [ ] Salvar ativa integração
- [ ] Dados persistem

### CRM - Add Lead
- [ ] Nome é obrigatório
- [ ] Email valida formato
- [ ] Telefone é opcional
- [ ] Lead é adicionado ao estágio correto
- [ ] Pipeline correto

### Contacts - Edit
- [ ] Nome, telefone, email editam
- [ ] Documento edita
- [ ] Origem edita
- [ ] Tags podem ser adicionadas/removidas
- [ ] Notas podem ser criadas/editadas/deletadas
- [ ] Salvamento automático

---

## 5. Permissões (Trial vs Paid)

### Trial Mode
- [ ] Modo trial ativa automaticamente (sem assinatura)
- [ ] TrialBanner aparece no topo
- [ ] Botões de edição desabilitados
- [ ] Botões de adicionar desabilitados
- [ ] Botões de deletar desabilitados
- [ ] Tentativa de editar mostra UpgradeBanner
- [ ] Link para Subscription funciona

### Starter Plan
- [ ] Pode editar
- [ ] Máximo 2 integrações
- [ ] Tentativa de adicionar 3ª integração mostra banner
- [ ] Máximo 1 canal
- [ ] Máximo 3 membros na equipe

### Professional Plan
- [ ] Pode editar
- [ ] Integrações ilimitadas
- [ ] Canais ilimitados
- [ ] Membros ilimitados
- [ ] Relatórios avançados acessíveis
- [ ] WhatsApp API disponível

### Enterprise Plan
- [ ] Pode editar
- [ ] Todas as features Professional
- [ ] IA acessível
- [ ] Auto tags funcionam
- [ ] Múltiplas empresas
- [ ] Help Center acessível
- [ ] Webhooks disponíveis

### Upgrade Flow
- [ ] UpgradeBanner mostra planos corretos
- [ ] Click em "Fazer Upgrade" redireciona
- [ ] Subscription page mostra todos os planos
- [ ] Features checadas/unchecked corretas
- [ ] Preços mensais e anuais corretos
- [ ] Botões de assinar funcionam

---

## 6. AppContext Integration

### Persistência de Dados
- [ ] userData persiste no localStorage
- [ ] appSettings persiste
- [ ] crmData persiste
- [ ] contactsData persiste
- [ ] teamData persiste
- [ ] companiesData persiste
- [ ] iaData persiste
- [ ] integrationsData persiste

### Auto-Save
- [ ] Mudanças salvam automaticamente (300ms debounce)
- [ ] Indicador "Salvando..." aparece
- [ ] Indicador "Salvo" aparece
- [ ] Último salvamento mostra timestamp

### Funções de Update
- [ ] updateUser() funciona
- [ ] updateSettings() funciona
- [ ] updateCRM() funciona
- [ ] updateContacts() funciona
- [ ] updateTeam() funciona
- [ ] updateCompanies() funciona
- [ ] updateIA() funciona
- [ ] updateIntegrations() funciona

### Utilidades
- [ ] exportData() gera JSON
- [ ] importData() carrega JSON
- [ ] clearAllData() limpa tudo
- [ ] getCurrentPlan() retorna plano correto
- [ ] canEdit() funciona baseado no plano

---

## 7. Responsividade

### Mobile (375px)
- [ ] Dashboard: Cards empilham verticalmente
- [ ] Sidebar: Fica oculta, botão hambúrguer funciona
- [ ] Integrations: Grid 1 coluna
- [ ] Team: Grid 1 coluna
- [ ] Contacts: Tabela scroll horizontal
- [ ] CRM: Pipeline scroll horizontal
- [ ] Inbox: Chat ocupa tela toda
- [ ] Profile: Formulário 1 coluna
- [ ] Modais: Largura 95% da tela
- [ ] Botões: Tamanho touch-friendly (min 44px)

### Tablet (768px)
- [ ] Dashboard: 2 colunas
- [ ] Integrations: 2 colunas
- [ ] Team: 2 colunas
- [ ] CRM: Pipeline com 2-3 estágios visíveis
- [ ] Sidebar: Pode colapsar

### Desktop (1024px)
- [ ] Dashboard: 3-4 colunas
- [ ] Integrations: 3 colunas
- [ ] Team: 3 colunas
- [ ] CRM: Todos os estágios visíveis
- [ ] Sidebar: Sempre visível

### Wide Screen (1920px)
- [ ] Layout não ultrapassa max-width razoável
- [ ] Conteúdo centralizado
- [ ] Sidebar não fica muito larga

---

## 8. Console Errors

### Verificar Console
- [ ] Abrir DevTools (F12)
- [ ] Navegar por todas as páginas
- [ ] Nenhum erro vermelho
- [ ] Nenhum warning de React
- [ ] Nenhuma promise rejection

### Console Logs
- [ ] Nenhum console.log em produção
- [ ] Nenhum console.error desnecessário
- [ ] Nenhum console.warn desnecessário

---

## 9. Performance

### Métricas
- [ ] First Paint < 3s
- [ ] Time to Interactive < 4s
- [ ] Bundle size < 600KB (gzipped)
- [ ] Nenhum re-render desnecessário visível
- [ ] Scrolling suave
- [ ] Animações sem lag

### Otimizações
- [ ] Imagens otimizadas
- [ ] Code splitting implementado
- [ ] Lazy loading implementado
- [ ] React.memo em componentes pesados
- [ ] useCallback em funções passadas como props
- [ ] useMemo em cálculos pesados

---

## 10. Acessibilidade (WCAG 2.1 AA)

### Navegação por Teclado
- [ ] TAB navega por todos os elementos interativos
- [ ] ENTER ativa botões e links
- [ ] ESC fecha modais
- [ ] Setas navegam em dropdowns
- [ ] SPACE ativa checkboxes

### ARIA e Semântica
- [ ] Todos os botões têm aria-label
- [ ] Modais têm role="dialog"
- [ ] Formulários têm labels
- [ ] Imagens têm alt text
- [ ] Links descritivos

### Contraste
- [ ] Textos têm contraste mínimo 4.5:1
- [ ] Botões têm contraste adequado
- [ ] Placeholders são legíveis
- [ ] Dark mode mantém contraste

### Screen Reader
- [ ] Skip link funciona
- [ ] Títulos hierárquicos (h1, h2, h3)
- [ ] Listas semânticas (<ul>, <ol>)
- [ ] Regiões ARIA (main, nav, aside)
- [ ] Anúncios de mudanças (ScreenReaderAnnouncer)

---

## 11. Funcionalidades Específicas

### Integrations - Kiwify/Hotmart
- [ ] Ícone correto (🥝 para Kiwify, 🔥 para Hotmart)
- [ ] Status (active/inactive) correto
- [ ] Última sincronização mostra data
- [ ] Total de clientes correto
- [ ] Total de vendas correto
- [ ] Total de reembolsos correto
- [ ] Produtos listados
- [ ] Tags automáticas criadas por produto
- [ ] Últimos compradores
- [ ] Tipo de compra (vitalício/anual/mensal)
- [ ] Dados do cliente (nome, email, CPF, telefone)

### Team - Departamentos
- [ ] Departamentos padrão existem
- [ ] Criar departamento customizado funciona
- [ ] Editar departamento funciona
- [ ] Deletar departamento funciona
- [ ] Permissões por departamento funcionam
- [ ] Ícone do departamento muda
- [ ] Cor do departamento muda

### Contacts - Tags
- [ ] Tags podem ser adicionadas
- [ ] Tags podem ser removidas
- [ ] Tags filtram contatos
- [ ] Cores das tags corretas

### CRM - Drag and Drop
- [ ] Arrastar lead entre estágios funciona
- [ ] Lead atualiza estágio
- [ ] Animação suave
- [ ] Não quebra em mobile (touch)
- [ ] Múltiplas pipelines funcionam
- [ ] Criar pipeline funciona
- [ ] Editar pipeline funciona
- [ ] Deletar pipeline funciona

### Inbox - Chat
- [ ] Enviar mensagem funciona
- [ ] Anexar arquivo funciona
- [ ] Gravar áudio funciona
- [ ] Emojis funcionam
- [ ] Marcar como lido/não lido
- [ ] Arquivar conversa
- [ ] Atribuir atendente
- [ ] Painel de informações do contato

---

## 12. Segurança

### Autenticação
- [ ] ❌ Senha NÃO está em plain text (CRÍTICO)
- [ ] ❌ Dados sensíveis NÃO estão no localStorage (CRÍTICO)
- [ ] Login requer credenciais válidas
- [ ] Logout limpa sessão
- [ ] Token expira (se JWT implementado)
- [ ] Refresh token funciona (se implementado)

### Proteções
- [ ] CORS configurado corretamente
- [ ] CSP implementado
- [ ] XSS protection
- [ ] CSRF tokens
- [ ] Rate limiting
- [ ] Input sanitization

### HTTPS
- [ ] Produção usa HTTPS
- [ ] Cookies são Secure
- [ ] Cookies são HttpOnly
- [ ] Cookies são SameSite

---

## 13. Testes Automatizados

### Unit Tests
- [ ] Componentes principais têm testes
- [ ] Contextos têm testes
- [ ] Hooks têm testes
- [ ] Coverage > 80%

### Integration Tests
- [ ] Fluxo de login testado
- [ ] Fluxo de CRUD testado
- [ ] Navegação testada

### E2E Tests
- [ ] Fluxo completo de usuário
- [ ] Casos de uso principais
- [ ] Edge cases

---

## 14. Build e Deploy

### Build de Produção
- [ ] `npm run build` sem erros
- [ ] Bundle otimizado
- [ ] Source maps gerados
- [ ] Assets otimizados
- [ ] ENV vars configuradas

### Deploy
- [ ] CI/CD configurado
- [ ] Testes rodam antes do deploy
- [ ] Rollback possível
- [ ] Monitoring configurado
- [ ] Error tracking (Sentry, etc)

---

## Status do Checklist

Total de itens: ~280
Completados: [ ] / 280

**Meta:** 100% antes do go-live

---

## Prioridades

### P0 - Bloqueador (DEVE estar OK)
- Segurança (#12)
- Navegação (#1)
- Autenticação
- Permissões (#5)

### P1 - Crítico (DEVE estar OK)
- Dark Mode (#2)
- Modais (#3)
- Formulários (#4)
- AppContext (#6)

### P2 - Importante (DEVERIA estar OK)
- Responsividade (#7)
- Performance (#9)
- Acessibilidade (#10)

### P3 - Desejável (PODE estar OK)
- Console Errors (#8)
- Funcionalidades Específicas (#11)
- Testes Automatizados (#13)

---

**Use este checklist antes de cada release!**
