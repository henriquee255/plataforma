# 🚀 Quick Start - Sistema de Assinaturas

> **Como integrar e usar o sistema de assinaturas e empresas na plataforma**

---

## 📦 Arquivos Criados

### Backend (Node.js/MongoDB)

```
backend/
├── models/
│   ├── Subscription.js           # Model de assinatura
│   └── Company.js                 # Model de empresa
├── controllers/
│   ├── subscriptionController.js  # CRUD de assinaturas
│   └── companyController.js       # CRUD de empresas + membros
└── routes/
    ├── subscriptionRoutes.js      # Routes de assinatura
    └── companyRoutes.js           # Routes de empresas
```

### Frontend (React)

```
src/
├── config/
│   ├── plans.js                   # Planos e limitações
│   └── permissions.js             # Sistema de permissões
├── contexts/
│   └── SubscriptionContext.jsx    # Context global
└── components/
    ├── CompanySwitcher.jsx        # Dropdown de empresas
    └── Modals/
        └── CreateCompanyModal.jsx # Modal criar empresa
```

### Documentação

```
docs/
├── SUBSCRIPTION-ARCHITECTURE.md   # Arquitetura completa (33 páginas)
└── SUBSCRIPTION-QUICKSTART.md     # Este arquivo
```

---

## 🔧 Como Integrar

### 1. Adicionar SubscriptionProvider no App

```jsx
// src/App.jsx
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        {/* Suas rotas aqui */}
        <Router />
      </SubscriptionProvider>
    </AuthProvider>
  );
}
```

### 2. Adicionar CompanySwitcher na Sidebar

```jsx
// src/components/Sidebar.jsx
import CompanySwitcher from './CompanySwitcher';

const Sidebar = () => {
  return (
    <div className="sidebar">
      {/* Company Switcher no topo */}
      <CompanySwitcher className="mb-4" />

      {/* Resto da sidebar */}
      <nav>...</nav>
    </div>
  );
};
```

### 3. Usar hooks em qualquer componente

```jsx
// src/pages/Dashboard.jsx
import { useSubscription } from '../contexts/SubscriptionContext';

const Dashboard = () => {
  const {
    subscription,
    currentCompany,
    plan,
    hasFeature,
    hasPermission,
  } = useSubscription();

  // Verificar feature
  const showIA = hasFeature('ia');
  const showReports = hasFeature('reports');

  // Verificar permissão
  const canDeleteCRM = hasPermission('crm.delete');

  return (
    <div>
      <h1>Olá, {currentCompany?.name}!</h1>
      <p>Plano: {plan}</p>

      {showReports && <ReportsWidget />}
      {showIA && <IAAssistant />}

      {!showIA && (
        <div className="upgrade-prompt">
          IA disponível no plano Enterprise!
          <button>Fazer Upgrade</button>
        </div>
      )}
    </div>
  );
};
```

---

## 🎨 Componentes Prontos

### CompanySwitcher

Dropdown com lista de empresas + botão criar nova.

```jsx
<CompanySwitcher className="mb-4" />
```

**Features:**
- ✅ Lista todas as empresas (owned + member)
- ✅ Mostra role do usuário (Owner, Admin, Member)
- ✅ Troca empresa com 1 clique
- ✅ Botão "Nova Empresa" (verifica limite do plano)
- ✅ Mostra quantidade criada vs limite do plano

### CreateCompanyModal

Modal para criar nova empresa.

```jsx
const [showModal, setShowModal] = useState(false);

<button onClick={() => setShowModal(true)}>
  Nova Empresa
</button>

{showModal && (
  <CreateCompanyModal onClose={() => setShowModal(false)} />
)}
```

**Validações:**
- ✅ Verifica limite do plano antes de criar
- ✅ Mostra erro se atingiu limite
- ✅ Atualiza lista de empresas automaticamente
- ✅ Troca para empresa recém-criada

---

## 🔐 Sistema de Permissões

### Verificar Feature (baseado no plano)

```jsx
import { useSubscription } from '../contexts/SubscriptionContext';

const { hasFeature } = useSubscription();

// Verificar se plano tem feature
if (hasFeature('ia')) {
  // Mostrar IA
}

if (hasFeature('integrations')) {
  // Mostrar Integrações
}
```

### Verificar Permissão (baseado no role)

```jsx
import { useSubscription } from '../contexts/SubscriptionContext';

const { hasPermission } = useSubscription();

// Verificar permissão específica
if (hasPermission('crm.delete')) {
  // Mostrar botão deletar
}

if (hasPermission('team.invite')) {
  // Mostrar botão convidar membro
}
```

### Exemplo Completo

```jsx
const CRMPage = () => {
  const { hasFeature, hasPermission } = useSubscription();

  // Verificar se plano tem CRM
  if (!hasFeature('crm')) {
    return (
      <UpgradePrompt
        feature="CRM"
        plan="Starter"
        price={47}
      />
    );
  }

  // Tem CRM, verificar permissões
  const canCreate = hasPermission('crm.create');
  const canEdit = hasPermission('crm.edit');
  const canDelete = hasPermission('crm.delete');

  return (
    <div>
      <h1>CRM</h1>

      {canCreate && (
        <button onClick={handleCreate}>Novo Lead</button>
      )}

      {canEdit && (
        <button onClick={handleEdit}>Editar</button>
      )}

      {canDelete && (
        <button onClick={handleDelete}>Deletar</button>
      )}
    </div>
  );
};
```

---

## 📊 Planos Disponíveis

```javascript
import { PLANS } from '../config/plans';

// Acessar configuração dos planos
PLANS.free          // { price: 0, limits: { maxCompanies: 0 }, ... }
PLANS.starter       // { price: 47, limits: { maxCompanies: 1 }, ... }
PLANS.professional  // { price: 97, limits: { maxCompanies: 3 }, ... }
PLANS.enterprise    // { price: 297, limits: { maxCompanies: 5 }, ... }
```

### Helpers

```javascript
import { canCreateCompany, hasFeature, formatPrice } from '../config/plans';

// Verificar se pode criar empresa
canCreateCompany('professional', 2); // true (pode criar, está em 2 de 3)

// Verificar feature
hasFeature('professional', 'ia'); // false
hasFeature('enterprise', 'ia'); // true

// Formatar preço
formatPrice(97); // "R$ 97,00"
formatPrice(0);  // "Grátis"
```

---

## 🔌 API Endpoints

### Subscription

```javascript
// Obter assinatura
const { data } = await api.get('/api/subscriptions/me');

// Fazer upgrade
await api.patch('/api/subscriptions/upgrade', {
  newPlan: 'professional'
});

// Verificar se pode criar empresa
const { data } = await api.get('/api/subscriptions/can-create-company');
if (data.canCreate) {
  // Pode criar
} else {
  // Mostrar modal de upgrade
  alert(data.message);
}
```

### Companies

```javascript
// Listar empresas
const { data } = await api.get('/api/companies/my-companies');
const { owned, member } = data.data;

// Criar empresa
const { data } = await api.post('/api/companies', {
  name: 'Tech Corp',
  description: 'Empresa de tecnologia'
});

// Adicionar membro
await api.post(`/api/companies/${companyId}/members`, {
  email: 'maria@email.com',
  role: 'admin',
  department: 'vendas',
  permissions: []
});
```

---

## 🎯 Próximos Passos

### Para integrar na plataforma toda:

1. **Adicionar SubscriptionProvider** no App.jsx ✅
2. **Adicionar CompanySwitcher** na Sidebar
3. **Adaptar todas as páginas** para usar `currentCompany`
4. **Implementar guards** com `hasFeature` e `hasPermission`
5. **Criar página de Settings** com upgrade de plano
6. **Integrar webhooks** (Stripe, Kiwify, Hotmart)

### Páginas que precisam adaptar:

- ✅ **Dashboard** - Mostrar dados da empresa atual
- ✅ **CRM** - Verificar permissão + feature
- ✅ **Contacts** - Verificar permissão + feature
- ✅ **Inbox** - Verificar permissão + feature
- ✅ **Team** - Gerenciar membros da empresa
- ✅ **Integrations** - Verificar feature + limites
- ✅ **Reports** - Verificar feature
- ✅ **IA** - Verificar feature (apenas Enterprise)
- ✅ **Settings** - Gerenciar billing + upgrade

---

## 💡 Exemplos de Uso

### Exemplo 1: Criar empresa

```jsx
const CreateCompanyButton = () => {
  const { canCreateCompany } = useSubscription();
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    if (!canCreateCompany) {
      alert('Você atingiu o limite! Faça upgrade.');
      return;
    }
    setShowModal(true);
  };

  return (
    <>
      <button onClick={handleClick}>
        Nova Empresa
      </button>

      {showModal && (
        <CreateCompanyModal onClose={() => setShowModal(false)} />
      )}
    </>
  );
};
```

### Exemplo 2: Feature Gate

```jsx
const IAPage = () => {
  const { hasFeature, plan } = useSubscription();

  if (!hasFeature('ia')) {
    return (
      <div className="upgrade-prompt">
        <h2>IA disponível apenas no plano Enterprise</h2>
        <p>Seu plano atual: {plan}</p>
        <button>Fazer Upgrade para Enterprise</button>
      </div>
    );
  }

  return (
    <div>
      <h1>IA Assistant</h1>
      {/* Componente de IA */}
    </div>
  );
};
```

### Exemplo 3: Permission Guard

```jsx
const TeamPage = () => {
  const { hasPermission } = useSubscription();

  const canInvite = hasPermission('team.invite');
  const canRemove = hasPermission('team.remove');

  return (
    <div>
      <h1>Equipe</h1>

      {canInvite && (
        <button onClick={handleInvite}>
          Convidar Membro
        </button>
      )}

      <table>
        {members.map(member => (
          <tr key={member.id}>
            <td>{member.name}</td>
            <td>
              {canRemove && (
                <button onClick={() => handleRemove(member.id)}>
                  Remover
                </button>
              )}
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
};
```

---

## ✅ Checklist de Integração

- [x] ✅ Backend - Models criados
- [x] ✅ Backend - Controllers criados
- [x] ✅ Backend - Routes criados
- [x] ✅ Frontend - Config (plans, permissions)
- [x] ✅ Frontend - SubscriptionContext
- [x] ✅ Frontend - CompanySwitcher
- [x] ✅ Frontend - CreateCompanyModal
- [ ] ⏳ Integrar SubscriptionProvider no App
- [ ] ⏳ Adicionar CompanySwitcher na Sidebar
- [ ] ⏳ Adaptar páginas existentes
- [ ] ⏳ Criar página de Settings/Billing
- [ ] ⏳ Implementar webhooks
- [ ] ⏳ Testes E2E

---

## 📚 Documentação Completa

Para arquitetura detalhada, fluxos, e exemplos avançados, veja:

**[docs/SUBSCRIPTION-ARCHITECTURE.md](./SUBSCRIPTION-ARCHITECTURE.md)** (33 páginas)

---

**Criado em:** 2026-02-25
**Versão:** 1.0
**Status:** ✅ Arquitetura completa, pronto para integração
