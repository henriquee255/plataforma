# System Architecture - Plataforma

**Projeto:** Plataforma de CRM/Vendas
**Data de Análise:** 2026-02-23
**Versão:** 1.0
**Analisado por:** @architect via Bob (PM Mode)

---

## 📋 Executive Summary

Sistema de CRM e gerenciamento de vendas construído em React com foco em integrações com plataformas de pagamento (Kiwify, Hotmart, Stripe). Interface moderna com tema purple e suporte a dark mode.

**Status:** Brownfield - Projeto em desenvolvimento ativo
**Complexidade:** Média (17 componentes, SPA monolítica)
**Stack:** React 19 + Vite 7 + Tailwind CSS 3.4

---

## 🏗️ Stack Tecnológico

### Frontend Framework
- **React:** 19.2.0 (latest)
- **React DOM:** 19.2.0
- **Build Tool:** Vite 7.3.1

### UI & Styling
- **Tailwind CSS:** 3.4.19
- **Dark Mode:** Habilitado via classe CSS
- **Design System:** Tema purple (gradientes from-purple-500 to-purple-600)
- **Icons:** React Icons 5.5.0 (FaIcons)

### Data Visualization
- **Recharts:** 3.7.0 (LineChart, BarChart, ResponsiveContainer)

### Utilities
- **React DatePicker:** 9.1.0

### Development Tools
- **ESLint:** 9.39.1
- **Autoprefixer:** 10.4.24
- **PostCSS:** 8.5.6

---

## 📂 Estrutura do Projeto

```
plataforma/
├── src/
│   ├── App.jsx                      # Root component
│   ├── MainLayout.jsx               # Layout principal
│   ├── Sidebar.jsx                  # Navegação lateral
│   ├── Dashboard.jsx                # Métricas e dashboards
│   ├── CRM.jsx                      # Pipeline de vendas (drag-and-drop)
│   ├── Inbox.jsx                    # Sistema de mensagens
│   ├── Contacts.jsx                 # Gerenciamento de contatos (tabela)
│   ├── Companies.jsx                # Gerenciamento de empresas
│   ├── Integrations.jsx             # Integrações (Kiwify, Hotmart, Stripe)
│   ├── Connections.jsx              # Conexões (WhatsApp, Instagram, etc)
│   ├── Team.jsx                     # Gerenciamento de equipe
│   ├── Profile.jsx                  # Perfil do usuário
│   ├── Reports.jsx                  # Relatórios
│   ├── IA.jsx                       # Funcionalidades de IA
│   ├── contexts/
│   │   └── AppContext.jsx           # Estado global via Context API
│   └── components/
│       └── SaveNotification.jsx     # Notificação de salvamento
├── docs/
│   └── architecture/
│       └── system-architecture.md   # Este documento (FASE 1 completa)
├── package.json
├── vite.config.js
├── tailwind.config.js
└── index.html
```

**Total de Arquivos:** 17 componentes JSX

---

## 🎨 Arquitetura de Componentes

### Hierarquia

```
App (AppProvider)
└── MainLayout
    ├── Sidebar (navegação)
    └── <ComponenteAtivo>
        ├── Dashboard
        ├── CRM
        ├── Inbox
        ├── Contacts
        ├── Companies
        ├── Integrations
        ├── Connections
        ├── Team
        ├── Profile
        ├── Reports
        └── IA
└── SaveNotification (global)
```

### Padrões Identificados

1. **Navegação via Props:**
   - `onNavigate` é passado para todos os componentes
   - Não usa React Router
   - Navegação controlada pelo MainLayout

2. **Estado Global:**
   - Context API (AppContext)
   - Provider no nível raiz (App.jsx)
   - Acessível via hooks customizados

3. **UI Patterns:**
   - Tema purple consistente
   - Dark mode via Tailwind classes
   - Gradientes: `from-purple-500 to-purple-600`

4. **Dados Mockados:**
   - Dashboard.jsx contém dados hardcoded
   - Arrays de clientes, métricas simuladas
   - Sem integração real com backend ainda

---

## 🔗 Pontos de Integração

### Integrações de Pagamento (Planejadas - Integrations.jsx)

**Plataformas Suportadas:**
- Kiwify
- Hotmart
- Stripe
- Perfectpay
- Eduzz

**Funcionalidades Esperadas:**
- Tags automáticas baseadas em produtos
- Dados de clientes (email, CPF, telefone, nome)
- Tipo de compra (vitalícia, anual, mensal)
- Total de vendas
- Reembolsos
- Relatório de últimos compradores

### Conexões de Contato (Planejadas - Connections.jsx)

**Canais:**
- WhatsApp
- Instagram
- Email
- Telegram
- Messenger

---

## ⚙️ Configuração

### Vite (vite.config.js)
```javascript
{
  plugins: [react()]
}
```

**Observação:** Configuração minimalista, sem otimizações customizadas

### Tailwind (tailwind.config.js)
```javascript
{
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"]
}
```

**Dark Mode:** Habilitado via classe CSS

### Build Scripts (package.json)
- `dev` - Vite dev server
- `build` - Vite build
- `lint` - ESLint
- `preview` - Preview build

---

## 🚨 Débitos Técnicos Identificados (Nível Sistema)

### 1. **Falta de Testes**
- **Severidade:** ALTA
- **Descrição:** Zero cobertura de testes
- **Impacto:** Risco de regressão, bugs não detectados
- **Recomendação:** Adicionar Jest + React Testing Library

### 2. **Dados Mockados no Código**
- **Severidade:** MÉDIA
- **Descrição:** Dados hardcoded diretamente em componentes (Dashboard.jsx)
- **Impacto:** Não escalável, dificulta manutenção
- **Recomendação:** Mover para API/backend ou arquivo de fixtures

### 3. **Navegação Manual (Sem React Router)**
- **Severidade:** MÉDIA
- **Descrição:** Navegação via props `onNavigate`, sem roteamento real
- **Impacto:** Sem deep linking, sem histórico do navegador
- **Recomendação:** Implementar React Router v6

### 4. **Sem Autenticação/Autorização**
- **Severidade:** ALTA
- **Descrição:** Não há sistema de login ou proteção de rotas
- **Impacto:** Aplicação completamente aberta
- **Recomendação:** Implementar auth (JWT, OAuth, ou similar)

### 5. **Configurações Hardcoded**
- **Severidade:** BAIXA
- **Descrição:** URLs de API, chaves, etc. podem estar hardcoded
- **Impacto:** Dificulta deploy em ambientes diferentes
- **Recomendação:** Variáveis de ambiente (.env)

### 6. **Sem Tratamento de Erro Global**
- **Severidade:** MÉDIA
- **Descrição:** Não há ErrorBoundary ou sistema de log
- **Impacto:** Erros podem crashar a aplicação sem feedback
- **Recomendação:** Implementar ErrorBoundary + logging

### 7. **Código Duplicado**
- **Severidade:** BAIXA
- **Descrição:** Possível duplicação de lógica entre componentes
- **Impacto:** Manutenção difícil
- **Recomendação:** Refatorar para hooks customizados

### 8. **Dependências Não Otimizadas**
- **Severidade:** BAIXA
- **Descrição:** Bundle pode ser reduzido com code splitting
- **Impacto:** Performance inicial
- **Recomendação:** Lazy loading + Suspense

### 9. **Falta de TypeScript**
- **Severidade:** MÉDIA
- **Descrição:** Projeto em JavaScript puro
- **Impacto:** Erros de tipo em tempo de desenvolvimento
- **Recomendação:** Migrar para TypeScript gradualmente

### 10. **Sem CI/CD**
- **Severidade:** MÉDIA
- **Descrição:** Não há pipeline de deploy automático
- **Impacto:** Deploy manual, risco de erro humano
- **Recomendação:** Configurar GitHub Actions

---

## 📊 Métricas do Sistema

| Métrica | Valor |
|---------|-------|
| Total de Componentes | 17 JSX |
| Linhas de Código (estimado) | ~2000-3000 |
| Dependências Diretas | 5 |
| DevDependencies | 12 |
| Versão React | 19.2.0 (latest) |
| Cobertura de Testes | 0% |
| TypeScript | Não |

---

## 🎯 Próximos Passos Recomendados

1. **FASE 2:** Análise de Database (@data-engineer)
   - Verificar se há Supabase/Firebase configurado
   - Schema de banco de dados
   - RLS policies

2. **FASE 3:** Análise de Frontend/UX (@ux-design-expert)
   - Design system consistency
   - Acessibilidade (a11y)
   - Componentes UI reutilizáveis
   - Mobile responsiveness

3. **FASE 4:** Consolidação inicial de débitos (@architect)

---

## 📝 Notas Adicionais

- **Memória do Projeto:** O usuário enfatizou que a página de Integrações deve ter ícones específicos para cada plataforma, tags automáticas, e dados completos de clientes (email, CPF, telefone, etc.)
- **Padrão de Tema:** Purple gradients são consistentes em todo o projeto
- **Dark Mode:** Suportado via Tailwind classes

---

**Documento gerado por:** @architect (via Bob - PM Mode)
**Workflow:** Brownfield Discovery - FASE 1
**Próxima Fase:** FASE 2 - Database Documentation (@data-engineer)
