# 🔐 Guia de Implementação de Permissões por Plano

## 📋 Visão Geral

O sistema de permissões por plano garante que cada usuário tenha acesso apenas às funcionalidades do plano que escolheu.

## 🎯 Planos Disponíveis

### 1. **Trial** (Modo Visualização)
- ❌ Não pode editar nada
- ✅ Pode visualizar todas as páginas
- ✅ Pode editar apenas o próprio perfil

### 2. **Starter** (R$ 97/mês)
- ✅ Até 2 integrações de pagamento
- ✅ 1 canal de atendimento
- ✅ Até 3 membros na equipe
- ✅ CRM básico
- ✅ Relatórios básicos
- ❌ Sem IA
- ❌ Sem WhatsApp API
- ❌ Sem Widget

### 3. **Professional** (R$ 197/mês)
- ✅ Integrações ilimitadas (Kiwify, Hotmart, etc)
- ✅ Todos os canais de atendimento
- ✅ WhatsApp Business API
- ✅ Widget de atendimento
- ✅ Equipe ilimitada
- ✅ Relatórios avançados
- ❌ Sem IA
- ❌ Sem Help Center
- ❌ 1 empresa apenas

### 4. **Enterprise** (R$ 397/mês)
- ✅ Tudo do Professional +
- ✅ IA com automação inteligente
- ✅ Tags automáticas
- ✅ Help Center completo
- ✅ Múltiplas empresas
- ✅ Webhooks e API
- ✅ Suporte VIP

---

## 🛠️ Como Implementar

### 1. **Importar o Context**

```javascript
import { useAppContext } from './contexts/AppContext';
import UpgradeBanner from './components/UpgradeBanner';
```

### 2. **Obter o Plano Atual**

```javascript
const { getCurrentPlan, hasFeature } = useAppContext();
const currentPlan = getCurrentPlan();
```

### 3. **Verificar Acesso a Features**

```javascript
// Verificar se pode editar
if (!currentPlan.canEdit) {
  // Mostrar mensagem de trial
}

// Verificar feature específica
if (!hasFeature('ia_automation')) {
  // Mostrar upgrade banner
}

// Verificar limites
if (!currentPlan.hasIA) {
  // Bloquear acesso à página de IA
}
```

### 4. **Adicionar Upgrade Banner**

```javascript
const [showUpgradeBanner, setShowUpgradeBanner] = useState(!currentPlan.hasIA);

// No return do componente:
{showUpgradeBanner && (
  <UpgradeBanner
    feature="Nome da Feature"
    requiredPlan="Professional" // ou "Enterprise"
    onClose={() => setShowUpgradeBanner(false)}
    onNavigate={onNavigate}
  />
)}
```

---

## 📄 Exemplos de Implementação por Página

### **Página de IA** ✅ (Já implementado)
```javascript
const IA = ({ onNavigate }) => {
  const { getCurrentPlan } = useAppContext();
  const currentPlan = getCurrentPlan();
  const [showUpgradeBanner, setShowUpgradeBanner] = useState(!currentPlan.hasIA);

  return (
    <div>
      {/* Conteúdo da página */}

      {showUpgradeBanner && (
        <UpgradeBanner
          feature="IA com Automação Inteligente"
          requiredPlan="Enterprise"
          onClose={() => setShowUpgradeBanner(false)}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
};
```

### **Página de Integrações** (A implementar)
```javascript
const Integrations = ({ onNavigate }) => {
  const { getCurrentPlan, canAddIntegration, integrationsData } = useAppContext();
  const currentPlan = getCurrentPlan();

  const handleAddIntegration = () => {
    const currentCount = integrationsData.integrations.length;

    if (!canAddIntegration(currentCount)) {
      setShowUpgradeBanner(true);
      return;
    }

    // Adicionar integração...
  };

  return (
    <div>
      <button onClick={handleAddIntegration}>
        Adicionar Integração
      </button>

      {showUpgradeBanner && (
        <UpgradeBanner
          feature="Integrações Ilimitadas"
          requiredPlan="Professional"
          onClose={() => setShowUpgradeBanner(false)}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
};
```

### **Página de Help Center** (A implementar)
```javascript
const HelpCenter = ({ onNavigate }) => {
  const { getCurrentPlan } = useAppContext();
  const currentPlan = getCurrentPlan();
  const [showUpgradeBanner, setShowUpgradeBanner] = useState(!currentPlan.hasHelpCenter);

  return (
    <div>
      {showUpgradeBanner && (
        <UpgradeBanner
          feature="Help Center Profissional"
          requiredPlan="Enterprise"
          onClose={() => setShowUpgradeBanner(false)}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
};
```

### **Página de Companies** (A implementar)
```javascript
const Companies = ({ onNavigate }) => {
  const { getCurrentPlan, companiesData } = useAppContext();
  const currentPlan = getCurrentPlan();

  const handleAddCompany = () => {
    if (!currentPlan.hasMultipleCompanies && companiesData.companies.length >= 1) {
      setShowUpgradeBanner(true);
      return;
    }

    // Adicionar empresa...
  };

  return (
    <div>
      <button onClick={handleAddCompany}>
        Adicionar Empresa
      </button>

      {showUpgradeBanner && (
        <UpgradeBanner
          feature="Múltiplas Empresas"
          requiredPlan="Enterprise"
          onClose={() => setShowUpgradeBanner(false)}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
};
```

### **Página de Team** (A implementar)
```javascript
const Team = ({ onNavigate }) => {
  const { getCurrentPlan, canAddTeamMember, teamData } = useAppContext();
  const currentPlan = getCurrentPlan();

  const handleAddMember = () => {
    const currentCount = teamData.members.length;

    if (!canAddTeamMember(currentCount)) {
      setShowUpgradeBanner(true);
      return;
    }

    // Adicionar membro...
  };

  return (
    <div>
      <button onClick={handleAddMember}>
        Adicionar Membro
      </button>

      {showUpgradeBanner && (
        <UpgradeBanner
          feature="Equipe Ilimitada"
          requiredPlan="Professional"
          onClose={() => setShowUpgradeBanner(false)}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
};
```

### **Página de Connections** (A implementar)
```javascript
const Connections = ({ onNavigate }) => {
  const { getCurrentPlan, canAddChannel } = useAppContext();
  const currentPlan = getCurrentPlan();

  const connectedChannels = ['whatsapp']; // exemplo

  const handleAddChannel = (channelType) => {
    if (!canAddChannel(connectedChannels.length)) {
      setShowUpgradeBanner(true);
      return;
    }

    // Adicionar canal...
  };

  return (
    <div>
      {showUpgradeBanner && (
        <UpgradeBanner
          feature="Todos os Canais de Atendimento"
          requiredPlan="Professional"
          onClose={() => setShowUpgradeBanner(false)}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
};
```

---

## 🔑 Funções Disponíveis no Context

### `getCurrentPlan()`
Retorna objeto com todas as permissões do plano atual:
```javascript
{
  canEdit: true/false,
  maxIntegrations: number (-1 = ilimitado),
  maxChannels: number (-1 = ilimitado),
  maxTeamMembers: number (-1 = ilimitado),
  hasAdvancedReports: true/false,
  hasIA: true/false,
  hasWhatsAppAPI: true/false,
  hasWidget: true/false,
  hasHelpCenter: true/false,
  hasAutoTags: true/false,
  hasMultipleCompanies: true/false,
  hasWebhooks: true/false,
  hasPrioritySupport: true/false,
  hasVIPSupport: true/false,
  features: ['feature1', 'feature2', ...]
}
```

### `hasFeature(featureName)`
Verifica se o plano tem acesso a uma feature específica:
```javascript
if (hasFeature('ia_automation')) {
  // Usuário tem acesso
}
```

### `canAddIntegration(currentCount)`
Verifica se pode adicionar mais uma integração:
```javascript
if (canAddIntegration(integrationsData.integrations.length)) {
  // Pode adicionar
}
```

### `canAddChannel(currentCount)`
Verifica se pode adicionar mais um canal:
```javascript
if (canAddChannel(connectedChannels.length)) {
  // Pode adicionar
}
```

### `canAddTeamMember(currentCount)`
Verifica se pode adicionar mais um membro:
```javascript
if (canAddTeamMember(teamData.members.length)) {
  // Pode adicionar
}
```

### `canEdit()`
Verifica se pode editar (false apenas no trial):
```javascript
if (canEdit()) {
  // Pode editar
}
```

---

## 📌 Checklist de Implementação

- [x] AppContext com mapeamento de features
- [x] UpgradeBanner component criado
- [x] Subscription page salvando plano escolhido
- [x] Página de IA com verificação ✅
- [ ] Página de Integrações com verificação
- [ ] Página de Connections com verificação
- [ ] Página de Team com verificação
- [ ] Página de Companies com verificação
- [ ] Página de Help Center com verificação
- [ ] Dashboard mostrando features bloqueadas
- [ ] Sidebar mostrando badges de upgrade em features bloqueadas

---

## 🎨 Customizar UpgradeBanner

Você pode customizar o UpgradeBanner passando diferentes props:

```javascript
<UpgradeBanner
  feature="Nome da Feature" // Título
  requiredPlan="Professional" // ou "Enterprise" ou "Starter"
  onClose={() => setShowUpgradeBanner(false)} // Opcional - permite fechar
  onNavigate={onNavigate} // Função de navegação
/>
```

---

## 🚀 Próximos Passos

1. Implementar verificações nas páginas restantes
2. Adicionar indicadores visuais (badges) em botões bloqueados
3. Criar página de comparação de planos
4. Adicionar analytics de features mais requisitadas
5. Implementar sistema de trial com data de expiração

---

**Desenvolvido com ❤️ para a plataforma**
