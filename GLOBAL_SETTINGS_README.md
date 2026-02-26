# Configurações Globais - Admin

## Visão Geral

A seção de **Configurações Globais** foi criada para permitir que administradores configurem todos os aspectos da plataforma a partir de uma interface centralizada.

## Acesso

### Caminho de Navegação
1. Faça login como **Admin**
2. Acesse o menu **Admin** na barra lateral
3. Clique na aba **Configurações Globais**

Ou diretamente:
```
Dashboard > Admin > Configurações Globais
```

## Funcionalidades Implementadas

### 1. Configurações de Plataforma
**Localização:** `C:\Users\dinnh\Desktop\plataforma\src\pages\GlobalSettings.jsx`

**Funcionalidades:**
- Nome da plataforma (editável)
- Upload de logo (PNG, JPG, SVG - máx 2MB)
- Preview de logo em tempo real
- Cor primária (seletor de cor + input hex)
- Cor secundária (seletor de cor + input hex)
- Botão "Restaurar Padrão"

**Estados:**
```javascript
platformName       // Nome da plataforma
platformLogo       // URL/Base64 da logo
primaryColor       // Cor primária em hex
secondaryColor     // Cor secundária em hex
logoPreview        // Preview da logo carregada
```

**Ações:**
- `handleSavePlatform()` - Salva configurações
- `handleLogoUpload()` - Upload e preview de logo

---

### 2. Gerenciamento de Planos
**Funcionalidades:**
- Visualização de todos os planos
- Editar plano (botão)
- Ativar/Desativar plano (switch)
- Informações: preço, intervalo, recursos, limites

**Planos Padrão:**
1. **Básico** - R$ 49,90/mês
   - 5 usuários
   - 1.000 contatos
   - 10 GB armazenamento

2. **Profissional** - R$ 149,90/mês
   - 20 usuários
   - 10.000 contatos
   - 50 GB armazenamento
   - Relatórios avançados

3. **Enterprise** - R$ 499,90/mês
   - Usuários ilimitados
   - Contatos ilimitados
   - 500 GB armazenamento
   - Suporte prioritário
   - API personalizada

**Ações:**
- `handleEditPlan(planId)` - Abre modal de edição
- `handleTogglePlan(planId)` - Ativa/desativa plano

---

### 3. Configurações de Email (SMTP)
**Funcionalidades:**
- Configuração completa de servidor SMTP
- Teste de envio de email
- Conexão segura TLS/SSL

**Campos:**
- Host SMTP (ex: smtp.gmail.com)
- Porta (ex: 587)
- Usuário (email)
- Senha (oculta)
- Email remetente
- Conexão segura (switch)

**Ações:**
- `handleSaveEmail()` - Salva configurações SMTP
- `handleTestEmail()` - Envia email de teste

**Validação:**
- Todos os campos são obrigatórios
- Porta deve ser numérica

---

### 4. Configurações de Notificações
**Funcionalidades:**
- Canais de notificação (Email, Push, SMS)
- Eventos notificáveis
- Relatórios automáticos

**Canais:**
- **Email** - Notificações por email
- **Push** - Notificações no navegador
- **SMS** - Via Twilio (requer integração)

**Eventos:**
- Novo usuário cadastrado
- Nova venda realizada
- Relatórios semanais

**Ações:**
- `handleSaveNotifications()` - Salva preferências

---

### 5. Integrações Globais (API Keys)
**Funcionalidades:**
- Armazenamento seguro de chaves de API
- Suporte para múltiplos serviços

**Integrações Suportadas:**
- **Stripe** - Pagamentos
- **Google Analytics** - Métricas web
- **Facebook Pixel** - Tracking
- **AWS** - Cloud storage (Access + Secret Key)
- **Twilio** - SMS (Account SID + Auth Token)

**Ações:**
- `handleSaveIntegrations()` - Salva chaves de API

**Segurança:**
- Campos de senha ocultam valores
- Chaves não são exibidas no frontend após salvar

---

### 6. Configurações de Segurança
**Funcionalidades:**
- 2FA obrigatório (switch destacado)
- Políticas de senha personalizáveis
- Controles de sessão

**Políticas de Senha:**
- Comprimento mínimo (6-32 caracteres)
- Exigir letra maiúscula (switch)
- Exigir números (switch)
- Exigir caracteres especiais (switch)

**Controles de Sessão:**
- Timeout de sessão (minutos)
- Máximo de tentativas de login
- Expiração de senha (dias) - 0 = nunca

**Ações:**
- `handleSaveSecurity()` - Salva políticas

**Validação:**
- Comprimento mínimo não pode ser menor que 6

---

### 7. Backups Automáticos
**Funcionalidades:**
- Ativar/desativar backup automático
- Configurar frequência e retenção
- Backup manual sob demanda
- Visualizar último backup

**Configurações:**
- **Frequência:** Horária, Diária, Semanal, Mensal
- **Retenção:** 7-365 dias
- **Local de armazenamento:**
  - Servidor Local
  - AWS S3
  - Google Cloud
  - Azure Storage

**Ações:**
- `handleSaveBackups()` - Salva configurações
- `handleManualBackup()` - Executa backup imediato

**Feedback:**
- Notifica quando backup é iniciado
- Notifica quando backup é concluído (3s delay simulado)

---

### 8. Manutenção Programada
**Funcionalidades:**
- Modo de manutenção imediato
- Agendar manutenção futura
- Mensagem customizável para usuários

**Modo Imediato:**
- Switch vermelho de alerta
- Bloqueia acesso de todos os usuários instantaneamente

**Manutenção Programada:**
- Data e horário específicos
- Mensagem personalizada
- Preview antes de ativar

**Ações:**
- `handleToggleMaintenanceMode()` - Ativa/desativa imediatamente
- `handleSaveMaintenance()` - Salva agendamento

**Validação:**
- Se programado, data e hora são obrigatórios

---

## Estrutura de Arquivos

```
src/
├── pages/
│   ├── Admin.jsx                    # Componente principal com abas
│   ├── GlobalSettings.jsx           # Configurações globais (NOVO)
│   └── AdminAnalytics.jsx           # Analytics (existente)
├── components/
│   ├── ui/
│   │   ├── switch.jsx              # Componente Switch (usado extensivamente)
│   │   ├── input.jsx               # Input
│   │   ├── select.jsx              # Select
│   │   ├── button.jsx              # Button
│   │   ├── card.jsx                # Card
│   │   └── label.jsx               # Label
│   └── custom/
│       └── PageHeader.jsx          # Header de página
└── hooks/
    └── useNotification.jsx         # Hook de notificações
```

---

## Como Usar

### Exemplo 1: Alterar Logo da Plataforma

```javascript
// 1. Clique no input de arquivo
<Input type="file" accept="image/*" onChange={handleLogoUpload} />

// 2. Selecione uma imagem (PNG, JPG, SVG)
// 3. Preview aparece automaticamente
// 4. Clique em "Salvar Configurações"
```

### Exemplo 2: Configurar SMTP

```javascript
// Preencha os campos:
smtpHost: "smtp.gmail.com"
smtpPort: "587"
smtpUser: "seu-email@gmail.com"
smtpPassword: "sua-senha-de-app"
emailFrom: "noreply@synkra.com"
smtpSecure: true

// Clique em "Enviar Teste" para verificar
// Clique em "Salvar Email"
```

### Exemplo 3: Ativar 2FA Obrigatório

```javascript
// 1. Vá para "Configurações de Segurança"
// 2. Ative o switch "2FA Obrigatório"
// 3. Clique em "Salvar Segurança"
// TODOS os usuários precisarão configurar 2FA no próximo login
```

### Exemplo 4: Executar Backup Manual

```javascript
// 1. Vá para "Backups Automáticos"
// 2. Clique em "Backup Manual"
// 3. Aguarde notificação de conclusão
// 4. Último backup será atualizado automaticamente
```

---

## Integrações com Backend

### Endpoints Necessários (a implementar)

```javascript
// Plataforma
POST /api/admin/settings/platform
GET  /api/admin/settings/platform

// Email
POST /api/admin/settings/email
POST /api/admin/settings/email/test

// Notificações
POST /api/admin/settings/notifications
GET  /api/admin/settings/notifications

// Integrações
POST /api/admin/settings/integrations
GET  /api/admin/settings/integrations

// Segurança
POST /api/admin/settings/security
GET  /api/admin/settings/security

// Backups
POST /api/admin/settings/backups
GET  /api/admin/settings/backups
POST /api/admin/backups/manual

// Manutenção
POST /api/admin/settings/maintenance
GET  /api/admin/settings/maintenance
```

---

## Notificações Implementadas

Todas as ações fornecem feedback visual via `useNotification`:

- `notifySaved()` - Configurações salvas com sucesso
- `notifySuccess()` - Ação bem-sucedida
- `notifyError()` - Erro na operação
- `notifyUpdated()` - Item atualizado

---

## Padrão de Cores (Purple Theme)

```css
Primária: #8b5cf6 (purple-600)
Secundária: #ec4899 (pink-500)
Gradientes: from-purple-500 to-purple-600
```

---

## Dark Mode

Todos os componentes suportam dark mode:
```javascript
className="bg-white dark:bg-gray-800"
className="text-gray-900 dark:text-white"
className="border-gray-200 dark:border-gray-700"
```

---

## Testes Recomendados

### 1. Upload de Logo
- [ ] Upload de PNG
- [ ] Upload de JPG
- [ ] Upload de SVG
- [ ] Arquivo maior que 2MB (deve falhar)
- [ ] Preview em tempo real

### 2. Configurações de Email
- [ ] Campos obrigatórios (validação)
- [ ] Teste de envio
- [ ] Toggle TLS/SSL

### 3. Backups
- [ ] Ativar/desativar automático
- [ ] Mudar frequência
- [ ] Backup manual
- [ ] Atualização de "último backup"

### 4. Manutenção
- [ ] Ativar modo imediato
- [ ] Programar manutenção futura
- [ ] Validação de data/hora

---

## Próximos Passos

1. **Backend Integration** - Conectar todos os formulários com API real
2. **Validação Avançada** - Adicionar validação de formulários com Zod/Yup
3. **Permissões** - Restringir acesso a apenas usuários Admin
4. **Auditoria** - Log de todas as mudanças de configuração
5. **Versionamento** - Histórico de alterações de configurações
6. **Testes** - Testes unitários e E2E

---

## Contribuindo

Para adicionar novas configurações:

1. Adicione estados no componente `GlobalSettings.jsx`
2. Crie o card com `<Card>` e `<CardHeader>`
3. Adicione campos usando componentes de `@/components/ui`
4. Implemente função `handleSave{Nome}()`
5. Adicione validação se necessário
6. Teste dark mode

---

## Suporte

Para dúvidas ou problemas, contate o time de desenvolvimento.

**Arquivo criado em:** 24/02/2026
**Versão:** 1.0.0
**Autor:** Claude Sonnet 4.5
