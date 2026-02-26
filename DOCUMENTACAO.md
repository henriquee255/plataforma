# 📋 Plataforma - Documentação Completa

> **Projeto:** Sistema completo de atendimento, gestão de clientes, vendas, métricas e integrações
>
> **Stack:** React + Express + JWT + Tailwind CSS
>
> **Última atualização:** 2026-02-23

---

## 📑 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Backend](#backend)
4. [Frontend](#frontend)
5. [Integrações](#integrações)
6. [Autenticação e Segurança](#autenticação-e-segurança)
7. [Funcionalidades](#funcionalidades)
8. [Guia de Desenvolvimento](#guia-de-desenvolvimento)

---

## 🎯 Visão Geral

A **Plataforma** é um sistema completo de atendimento e gestão empresarial, desenvolvido para facilitar o relacionamento com clientes, vendas, métricas, equipes e integrações com diversas plataformas.

### Objetivos Principais

- ✅ Sistema de atendimento integrado (Inbox multi-canal)
- ✅ Gestão centralizada de clientes e contatos
- ✅ Pipeline visual de vendas
- ✅ Dashboard com métricas e analytics em tempo real
- ✅ Gerenciamento de equipes com controle de permissões (RBAC)
- ✅ Integrações com plataformas de pagamento (Kiwify, Hotmart, Stripe, etc)
- ✅ Conexões com canais de comunicação (WhatsApp, Instagram, etc)
- ✅ Assistente com IA

### Tecnologias Utilizadas

**Backend:**
- Node.js + Express
- JWT (JSON Web Tokens) para autenticação
- bcryptjs para hash de senhas
- CORS para controle de acesso
- Rate limiting para segurança

**Frontend:**
- React 18
- Vite (build tool)
- Tailwind CSS (estilização)
- Shadcn UI (componentes)
- React Icons
- React Beautiful DnD (drag-and-drop)

---

## 🏗️ Arquitetura

```
plataforma/
├── backend/                 # API REST
│   ├── controllers/         # Lógica de negócio
│   ├── middleware/          # Auth, RBAC, rate limiting
│   ├── models/             # Modelos de dados (in-memory)
│   ├── routes/             # Definição de rotas
│   ├── utils/              # Utilitários (seed, tokens)
│   ├── tests/              # Testes unitários (Jest)
│   └── server.js           # Entrada do servidor
│
├── src/                    # Frontend React
│   ├── components/         # Componentes reutilizáveis
│   ├── hooks/              # Custom hooks
│   ├── pages/              # Páginas principais
│   ├── contexts/           # Context API (Auth)
│   └── MainLayout.jsx      # Layout principal
│
└── docs/                   # Documentação
    └── stories/            # User stories
```

### Fluxo de Dados

```
Frontend (React)
    ↓
AuthContext (Estado Global)
    ↓
API REST (Express)
    ↓
Middleware (Auth + RBAC)
    ↓
Controllers (Lógica)
    ↓
Models (In-Memory DB)
```

---

## 🔧 Backend

### Estrutura de Diretórios

```
backend/
├── controllers/
│   ├── authController.js        # Login, register, refresh, logout
│   └── userController.js        # CRUD de usuários (admin)
├── middleware/
│   ├── auth.js                  # Verificação de JWT
│   ├── requireRole.js           # RBAC middleware
│   └── rateLimiter.js           # Rate limiting
├── models/
│   └── User.js                  # Modelo de usuário (in-memory)
├── routes/
│   ├── auth.js                  # Rotas de autenticação
│   └── users.js                 # Rotas de usuários
├── utils/
│   ├── jwt.js                   # Geração e validação de tokens
│   └── seed.js                  # Seed automático de usuários
└── server.js                    # Configuração do servidor
```

### Endpoints da API

#### **Autenticação** (`/api/auth`)

| Método | Endpoint | Descrição | Auth | Role |
|--------|----------|-----------|------|------|
| POST | `/register` | Registrar novo usuário | ❌ | - |
| POST | `/login` | Fazer login | ❌ | - |
| POST | `/refresh` | Renovar access token | ✅ | - |
| POST | `/logout` | Fazer logout | ✅ | - |
| GET | `/me` | Dados do usuário logado | ✅ | - |

#### **Usuários** (`/api/users`)

| Método | Endpoint | Descrição | Auth | Role |
|--------|----------|-----------|------|------|
| GET | `/` | Listar todos os usuários | ✅ | admin |
| GET | `/:id` | Buscar usuário por ID | ✅ | admin |
| PATCH | `/:id/role` | Atualizar role do usuário | ✅ | admin |
| DELETE | `/:id` | Deletar usuário | ✅ | admin |

### Modelo de Dados: User

```javascript
{
  id: string (UUID),
  name: string,
  email: string (unique, lowercase),
  password: string (bcrypt hash),
  avatar: string (URL),
  role: 'admin' | 'manager' | 'user',
  createdAt: Date,
  updatedAt: Date
}
```

### Sistema de Autenticação

**JWT (JSON Web Tokens)**

- **Access Token:** Expira em 15 minutos
- **Refresh Token:** Expira em 7 dias
- **Armazenamento:** LocalStorage (frontend)

**Flow de Autenticação:**

1. Login → Retorna `accessToken` + `refreshToken`
2. Requests → Header `Authorization: Bearer {accessToken}`
3. Access token expira → Renova com refresh token
4. Refresh token expira → Redireciona para login

### RBAC (Role-Based Access Control)

**Hierarquia de Roles:**

```
admin > manager > user
```

**Permissões por Role:**

| Página/Ação | user | manager | admin |
|-------------|------|---------|-------|
| Dashboard | ✅ | ✅ | ✅ |
| Inbox | ✅ | ✅ | ✅ |
| CRM | ✅ | ✅ | ✅ |
| Contatos | ✅ | ✅ | ✅ |
| Empresas | ✅ | ✅ | ✅ |
| Relatórios | ❌ | ✅ | ✅ |
| Equipe | ❌ | ✅ (view) | ✅ (full) |
| Gerenciar Usuários | ❌ | ❌ | ✅ |
| Integrações | ❌ | ❌ | ✅ |
| Conexões | ❌ | ❌ | ✅ |

### Seed Automático

O sistema cria automaticamente um usuário admin na primeira inicialização:

```javascript
{
  name: "Henrique de Oliveira",
  email: "eu.henriquee2501@gmail.com",
  password: "admin123",
  role: "admin"
}
```

**Localização:** `backend/utils/seed.js`

---

## 🎨 Frontend

### Páginas Principais

```
src/
├── Dashboard.jsx           # Dashboard com métricas
├── Inbox.jsx              # Sistema de mensagens
├── CRM.jsx                # Pipeline de vendas e negociações
├── Contacts.jsx           # Tabela de contatos
├── Companies.jsx          # Gestão de empresas
├── Team.jsx               # Gerenciamento de equipe
├── Integrations.jsx       # Integrações com plataformas
├── Connections.jsx        # Conexões (WhatsApp, Instagram)
├── Reports.jsx            # Relatórios e analytics
├── Profile.jsx            # Perfil do usuário
├── pages/
│   ├── LoginNew.jsx       # Tela de login (premium design)
│   ├── Register.jsx       # Tela de registro
│   ├── Admin.jsx          # Painel admin (gestão de usuários)
│   └── Unauthorized.jsx   # Página 403
└── IA.jsx                 # Assistente IA
```

### Componentes Principais

#### **SaveNotification.jsx**
- Notificação de salvamento automático
- Auto-oculta após 2 segundos
- Gradiente emerald para sucesso

#### **LoadingButton.jsx**
- Botão com estado de loading
- Spinner integrado
- Usado em formulários

#### **ErrorAlert.jsx**
- Alert de erro com ícone
- Botão de fechar
- Animação de entrada

### Hooks Customizados

#### **useAuth** (`src/hooks/useAuth.js`)

```javascript
const {
  user,           // Dados do usuário logado
  isLoading,      // Estado de carregamento
  login,          // Função de login
  register,       // Função de registro
  logout,         // Função de logout
  refreshAuth,    // Renovar autenticação
} = useAuth();
```

**Funcionalidades:**
- ✅ Login/Register/Logout
- ✅ Renovação automática de tokens
- ✅ Interceptação de 401 (redirect para login)
- ✅ Carregamento de dados do usuário
- ✅ Persistência em localStorage

#### **useNotification** (`src/hooks/useNotification.jsx`)

```javascript
const {
  notifySaved,      // Notificação de salvamento
  notifyAdded,      // Notificação de adição
  notifyUpdated,    // Notificação de atualização
  notifyDeleted,    // Notificação de exclusão
  notifySuccess,    // Notificação de sucesso genérica
  notifyError,      // Notificação de erro
  notifyWarning,    // Notificação de aviso
  notifyInfo,       // Notificação de informação
} = useNotification();
```

**Tipos de Notificação:**
- 🟢 Saved - Alterações salvas
- 🟢 Added - Item adicionado
- 🟢 Updated - Item atualizado
- 🔴 Deleted - Item deletado
- ✅ Success - Sucesso genérico
- ❌ Error - Erro
- ⚠️ Warning - Aviso
- ℹ️ Info - Informação

### Context API

#### **AuthContext** (`src/contexts/AuthContext.jsx`)

- Gerencia estado global de autenticação
- Provê hook `useAuth()` para todos os componentes
- Renova tokens automaticamente
- Intercepta erros 401

### Design System

**Tema Principal:** Purple Gradient

```css
/* Gradientes principais */
from-purple-500 to-purple-600
from-purple-600 to-indigo-600

/* Cores de destaque */
purple-500, purple-600, purple-700
indigo-500, indigo-600

/* Sombras */
shadow-purple-500/50
shadow-purple-500/60
```

**Dark Mode:** Totalmente suportado com classes `dark:`

**Componentes Shadcn UI:**
- Card, CardContent, CardHeader, CardTitle
- Input, Label, Button
- Select, Badge, Avatar
- Dialog, DropdownMenu
- Toaster (notificações)

---

## 🔌 Integrações

### Plataformas de Pagamento Planejadas

#### **1. Kiwify**
- ✅ Configuração de API Key e API Secret
- ✅ Webhook URL configurado
- 🔄 **Funcionalidades Pendentes:**
  - Tags automáticas por produto
  - Dados de clientes (nome, email, CPF, telefone)
  - Tipo de compra (vitalícia, anual, mensal)
  - Total de vendas e reembolsos
  - Relatório de últimas compras

#### **2. Hotmart**
- ✅ Estrutura de integração definida
- ✅ Campos: Client ID, Client Secret, Basic Token
- 🔄 Mesmas funcionalidades do Kiwify

#### **3. Eduzz**
- ✅ Estrutura de integração definida
- ✅ Campos: Public Key, API Key
- 🔄 Mesmas funcionalidades do Kiwify

#### **4. Monetizze**
- ✅ Estrutura de integração definida
- ✅ Campos: Consumer Key, Consumer Token
- 🔄 Mesmas funcionalidades do Kiwify

#### **5. Stripe**
- ✅ **Status: ATIVO**
- ✅ Integração configurada
- ✅ Último sync: 2026-02-23 09:15

#### **6. PagSeguro/PagBank**
- ✅ Estrutura de integração definida
- ✅ Campos: Email, Token

#### **7. Mercado Pago**
- ✅ Estrutura de integração definida
- ✅ Campos: Public Key, Access Token

#### **8. PayPal**
- ✅ Estrutura de integração definida
- ✅ Campos: Client ID, Client Secret

### Requisitos de Integração

Todas as integrações de pagamento devem:

1. **Ícones Próprios:** Cada plataforma com seu logo
2. **Tags Automáticas:** Criar tags baseadas nos produtos vendidos
3. **Dados de Clientes:**
   - Total de clientes que compraram
   - Valor total de vendas
   - Email, CPF, telefone, nome
4. **Tipo de Compra:** Vitalícia, anual ou mensal
5. **Reembolsos:** Total de reembolsos
6. **Relatório de Compras:**
   - Últimos compradores
   - O que compraram
   - Hora e data da compra

### Conexões de Contato

**Localização:** `src/Connections.jsx`

Plataformas planejadas:
- WhatsApp
- Instagram
- Facebook Messenger
- Telegram
- Email

---

## 🔐 Autenticação e Segurança

### Medidas de Segurança Implementadas

✅ **Senha:**
- Hash bcrypt com 10 salt rounds
- Validação de força no registro

✅ **JWT:**
- Access token de curta duração (15min)
- Refresh token de longa duração (7d)
- Assinatura HMAC SHA256

✅ **Rate Limiting:**
- Proteção contra força bruta
- Desabilitado em ambiente de teste

✅ **CORS:**
- Configurado para origem específica
- Credentials habilitado

✅ **Validação:**
- Input sanitization
- Validação de email format
- Verificação de roles

✅ **Headers de Segurança:**
- Authorization Bearer token
- Content-Type validation

### Boas Práticas

- ❌ Nunca expor senhas em logs
- ❌ Nunca retornar password em responses
- ✅ Sempre usar HTTPS em produção
- ✅ Renovar tokens antes de expirar
- ✅ Limpar tokens no logout
- ✅ Validar permissions em cada endpoint

---

## ✨ Funcionalidades

### ✅ Implementadas

#### **Autenticação (Story 2.6)**
- [x] Sistema de registro de usuários
- [x] Login com JWT
- [x] Refresh token automático
- [x] Logout
- [x] Proteção de rotas
- [x] 14 testes unitários (100% pass)

#### **RBAC (Story 2.7)**
- [x] Sistema de roles (admin, manager, user)
- [x] Middleware requireRole
- [x] Painel admin para gestão de usuários
- [x] Atualização de roles inline
- [x] Página de acesso negado (403)
- [x] Proteção de rotas por role

#### **Design**
- [x] Login screen premium (split-screen com animações)
- [x] Dark mode completo
- [x] Sistema de notificações (8 tipos)
- [x] Tema purple consistente
- [x] Componentes Shadcn UI

#### **Sistema de Seed**
- [x] Criação automática de admin no startup
- [x] Dados do admin configuráveis
- [x] Verificação de usuários existentes

### 🔄 Em Desenvolvimento

#### **Integrações de Pagamento**
- [ ] Webhook handlers para cada plataforma
- [ ] Sistema de tags automáticas
- [ ] Sincronização de dados de clientes
- [ ] Dashboard de vendas por plataforma
- [ ] Relatório de compras em tempo real

#### **CRM Avançado**
- [ ] Automações de pipeline
- [ ] Notificações de mudança de etapa
- [ ] Integração com Inbox
- [ ] Relatórios de conversão

#### **Inbox**
- [ ] Mensagens em tempo real (WebSocket)
- [ ] Integração com WhatsApp
- [ ] Integração com Instagram
- [ ] Templates de mensagem
- [ ] Respostas automáticas

### 📋 Backlog

- [ ] Sistema de IA para sugestões
- [ ] Relatórios avançados
- [ ] Exportação de dados (CSV, PDF)
- [ ] API pública para terceiros
- [ ] Mobile app (React Native)
- [ ] Sistema de notificações push
- [ ] Calendário integrado
- [ ] Sistema de tarefas/lembretes

---

## 🚀 Guia de Desenvolvimento

### Instalação

```bash
# Clone o repositório
git clone [url-do-repo]
cd plataforma

# Instalar dependências do backend
cd backend
npm install

# Instalar dependências do frontend
cd ../
npm install
```

### Configuração

**Backend** (`backend/.env`):
```env
PORT=3001
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=seu-secret-super-seguro-aqui
JWT_REFRESH_SECRET=seu-refresh-secret-super-seguro-aqui
NODE_ENV=development
```

**Frontend** (built-in):
- API URL: `http://localhost:3001`

### Executar em Desenvolvimento

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

**Acessar:**
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

### Testes

**Backend:**
```bash
cd backend
npm test                    # Rodar todos os testes
npm run test:watch          # Watch mode
npm run test:coverage       # Cobertura de código
```

**Cobertura Atual:**
- Statements: 70%
- Branches: 60%
- Functions: 65%
- Lines: 70%

### Build para Produção

```bash
# Frontend
npm run build

# Backend (não requer build, é Node.js)
```

### Comandos Úteis

```bash
# Verificar processos na porta 3001
netstat -ano | findstr :3001

# Matar processo (Windows)
taskkill /PID [PID] /F

# Verificar health do backend
curl http://localhost:3001/health

# Testar login via curl
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"eu.henriquee2501@gmail.com","password":"admin123"}'
```

### Estrutura de Branches (Git)

```
main                    # Produção
├── develop             # Desenvolvimento
│   ├── feature/xxx     # Novas funcionalidades
│   ├── fix/xxx         # Correções de bugs
│   └── story/x.x       # User stories
```

### Convenção de Commits

```bash
feat: adiciona sistema de notificações
fix: corrige erro de autenticação no login
docs: atualiza documentação do backend
style: ajusta tema purple no dashboard
refactor: reorganiza estrutura de pastas
test: adiciona testes para RBAC
chore: atualiza dependências
```

---

## 📝 Notas Importantes

### Usuário Admin Padrão

**IMPORTANTE:** Sempre que o servidor backend iniciar e não houver usuários no sistema, o admin será criado automaticamente:

```
Email: eu.henriquee2501@gmail.com
Senha: admin123
Role: admin
```

### In-Memory Database

⚠️ **ATENÇÃO:** O sistema atualmente usa banco de dados em memória (`backend/models/User.js`). Isso significa:

- ✅ Ótimo para desenvolvimento e testes
- ❌ Dados são perdidos ao reiniciar o servidor
- ⚠️ Não usar em produção sem migrar para DB persistente

**Migração Futura:** PostgreSQL ou MongoDB

### Segurança em Produção

Antes de fazer deploy em produção:

- [ ] Migrar para banco de dados persistente
- [ ] Usar HTTPS (SSL/TLS)
- [ ] Configurar variáveis de ambiente seguras
- [ ] Implementar log aggregation
- [ ] Configurar monitoring
- [ ] Habilitar CORS apenas para domínio de produção
- [ ] Implementar 2FA (autenticação de 2 fatores)
- [ ] Rate limiting mais agressivo

---

## 📚 Recursos e Links

- **Shadcn UI:** https://ui.shadcn.com
- **Tailwind CSS:** https://tailwindcss.com
- **React Icons:** https://react-icons.github.io/react-icons
- **JWT:** https://jwt.io
- **Express:** https://expressjs.com
- **Vite:** https://vitejs.dev

---

## 👤 Equipe

**Desenvolvedor Principal:** Henrique de Oliveira
**Email:** eu.henriquee2501@gmail.com

---

## 📄 Licença

[Definir licença do projeto]

---

**Última atualização:** 2026-02-23
**Versão:** 1.0.0
