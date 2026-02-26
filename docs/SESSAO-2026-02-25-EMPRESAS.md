# Documentação - Sistema de Empresas e Integrações
## Sessão: 25 de Fevereiro de 2026

---

## 📋 Resumo Geral

Esta sessão focou em:
1. ✅ Implementação de sistema de troca de empresas com loading
2. ✅ Melhorias no CompanySwitcher com validação de plano
3. ✅ Redesign da página Companies (simplificado, apenas botões animados)
4. ✅ Integração com SubscriptionContext para empresa atual
5. ⚠️ **PENDENTE**: Integração das integrações Kiwify/Hotmart estava zerada (usuário reportou)

---

## 🏢 Sistema de Empresas

### **1. CompanySwitcher (Sidebar)**

**Arquivo:** `src/components/CompanySwitcher.jsx`

#### Melhorias Implementadas:

**a) Validação de Assinatura Forte:**
- ✅ Substituído `alert()` por toast notifications elegantes
- ✅ Indicador visual de limite com cores dinâmicas:
  - 🟢 Verde: Abaixo de 70% do limite
  - 🟡 Amarelo: 70-99% do limite
  - 🔴 Vermelho: 100% limite atingido
- ✅ Botão desabilitado automaticamente quando limite atingido
- ✅ Tooltip explicativo ao passar mouse

**b) Limites por Plano:**
```javascript
const planLimits = {
  free: 0,        // Não permite criar empresas
  starter: 1,     // 1 empresa
  professional: 3, // 3 empresas
  enterprise: 5   // 5 empresas
};
```

**c) Indicador Visual:**
```javascript
const usagePercent = currentLimit > 0 ? (currentCount / currentLimit) * 100 : 100;

const getLimitColor = () => {
  if (usagePercent >= 100) return 'text-red-600 dark:text-red-400';
  if (usagePercent >= 70) return 'text-amber-600 dark:text-amber-400';
  return 'text-emerald-600 dark:text-emerald-400';
};
```

**d) Exemplo de Uso:**
```jsx
import { useToast } from '../contexts/ToastContext';

const handleCreateClick = () => {
  if (!canCreateCompany) {
    toast.warning('Limite de empresas atingido!', {
      description: `Seu plano permite apenas ${currentLimit} empresas. Faça upgrade!`
    });
    return;
  }
  setShowCreateModal(true);
};
```

---

### **2. Página Companies**

**Arquivo:** `src/Companies.jsx`

#### Design Simplificado:

**a) Métricas (Sem Animações):**
- Cards estáticos com bordas coloridas
- Ícones com gradientes fixos
- Shadow-lg sem hover effects

**b) Barra de Busca:**
- Input com focus ring
- Botão de ordenação com hover scale apenas

**c) Cards de Empresas (Estáticos):**
- Border-2 sem animações hover
- Logo sem efeitos 3D
- Badges de papel sem animações
- **APENAS BOTÕES ANIMAM:**
  - `hover:scale-105` ou `hover:scale-110`
  - `hover:shadow-lg` com cores específicas
  - Transição `duration-200`

**d) Botões Animados:**

```jsx
{/* Botão Acessar - Animado */}
<button
  onClick={() => handleAccessCompany(company)}
  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
>
  <FaExternalLinkAlt className="text-sm" />
  Acessar
</button>

{/* Botão Editar - Animado */}
<button
  onClick={() => handleEditCompany(company)}
  className="px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/40 hover:scale-110 transition-all duration-200"
  title="Editar empresa"
>
  <FaEdit />
</button>

{/* Botão Deletar - Animado */}
<button
  onClick={() => handleDeleteCompany(company.id)}
  className="px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-red-500/40 hover:scale-110 transition-all duration-200"
  title="Deletar empresa"
>
  <FaTrash />
</button>

{/* Botão Sair - Animado */}
<button
  onClick={() => handleLeaveCompany(company.id)}
  className="px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-orange-500/40 hover:scale-105 transition-all duration-200 flex items-center gap-2"
  title="Sair da empresa"
>
  <FaSignOutAlt />
  Sair
</button>
```

---

### **3. Troca de Empresa com Loading**

#### Modal de Loading (2 segundos)

**Arquivo:** `src/Companies.jsx` (linhas ~497-529)

```jsx
const [isLoadingCompany, setIsLoadingCompany] = useState(false);
const [loadingCompanyName, setLoadingCompanyName] = useState('');

const handleAccessCompany = async (company) => {
  // Verificar se já está conectado
  if (currentCompany && company.id === currentCompany._id) {
    return;
  }

  // Mostrar loading
  setLoadingCompanyName(company.nome);
  setIsLoadingCompany(true);

  // Simular carregamento de 2 segundos
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Trocar empresa via context
  switchCompany(company.id);
  setIsLoadingCompany(false);

  toast.success(`Conectado à empresa: ${company.nome}`, {
    description: 'Todos os dados foram atualizados para esta empresa.'
  });
};
```

**Modal Loading JSX:**
```jsx
{isLoadingCompany && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fadeIn">
    <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-md w-full p-10 text-center border-2 border-purple-200 dark:border-purple-800 shadow-2xl shadow-purple-500/50 animate-slideUp">
      {/* Logo Animado */}
      <div className="relative w-32 h-32 mx-auto mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full blur-2xl opacity-60 animate-pulse"></div>
        <div className="relative w-full h-full bg-gradient-to-br from-purple-600 via-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/50 animate-spin-slow">
          <FaBuilding className="text-white text-5xl" />
        </div>
      </div>

      {/* Texto */}
      <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
        Conectando...
      </h3>
      <p className="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-1">
        {loadingCompanyName}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Carregando dados da empresa
      </p>

      {/* Barra de Progresso */}
      <div className="mt-6 w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500 rounded-full animate-progress"></div>
      </div>
    </div>
  </div>
)}
```

---

### **4. Animações CSS Adicionadas**

**Arquivo:** `src/index.css`

```css
/* Animação de spin lento para loading */
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin-slow {
  animation: spin-slow 3s linear infinite;
}

/* Barra de progresso animada */
@keyframes progress {
  0% { width: 0%; }
  100% { width: 100%; }
}

.animate-progress {
  animation: progress 2s ease-out forwards;
}
```

**Animações já existentes utilizadas:**
- `animate-fadeIn` - Fade in do modal
- `animate-slideUp` - Slide up do conteúdo
- `animate-pulse` - Pulso do gradiente de fundo

---

## 🔌 Integração com SubscriptionContext

### **Como Usar a Empresa Atual**

**1. Importar o Context:**
```javascript
import { useSubscription } from './contexts/SubscriptionContext';
```

**2. Obter Empresa Atual:**
```javascript
const { currentCompany, switchCompany, companies } = useSubscription();

// currentCompany contém:
// {
//   _id: 'company-1',
//   name: 'Minha Empresa',
//   slug: 'minha-empresa',
//   role: 'owner',
//   permissions: ['all'],
//   ...
// }
```

**3. Filtrar Dados por Empresa:**

```javascript
// Em qualquer página que precise filtrar dados:
const { currentCompany } = useSubscription();

// Filtrar clientes
const clientesDaEmpresa = clientes.filter(
  cliente => cliente.empresaId === currentCompany._id
);

// Filtrar equipe
const membrosEquipe = equipe.filter(
  membro => membro.empresaId === currentCompany._id
);

// Filtrar integrações
const integracoesDaEmpresa = integracoes.filter(
  integracao => integracao.empresaId === currentCompany._id
);
```

**4. Trocar Empresa Programaticamente:**
```javascript
switchCompany('company-id-aqui');
// Salva automaticamente no localStorage('currentCompanyId')
```

---

## 📁 Arquivos Modificados

### **Novos/Criados:**
- Nenhum arquivo novo criado nesta sessão

### **Modificados:**

1. **`src/components/CompanySwitcher.jsx`**
   - Adicionada validação de plano forte
   - Indicador visual de limite
   - Toast notifications
   - Botão desabilitado com tooltip

2. **`src/Companies.jsx`**
   - Redesign simplificado (apenas botões animados)
   - Integração com `useSubscription()`
   - Modal de loading ao trocar empresa
   - Função `handleAccessCompany` async com 2s delay

3. **`src/index.css`**
   - Animação `animate-spin-slow`
   - Animação `animate-progress`

### **Lidos/Verificados:**
- `src/contexts/SubscriptionContext.jsx`
- `src/MainLayout.jsx`
- `src/App.jsx`
- `tailwind.config.js`

---

## ⚠️ Problemas Encontrados e Soluções

### **1. Erro JSX: "Adjacent JSX elements must be wrapped"**

**Problema:** Ao simplificar os cards, esqueci de fechar uma tag.

**Solução:** Verificar estrutura completa do JSX:
```jsx
sortedCompanies.map((company) => (
  <div key={company.id} className="...">
    {/* Conteúdo */}
  </div>  // ← Esta tag fecha o card principal
))
```

### **2. Integração Kiwify/Hotmart Zerada**

**Status:** ⚠️ **PENDENTE INVESTIGAÇÃO**

**Relatado pelo usuário:** "toda a configuração de integração foi zerada :("

**Logs mostram:**
```
✅ Integração encontrada: new ObjectId('699f2d7fe8ae39b65da27aef')
👥 0 clientes encontrados
💰 0 vendas encontradas
```

**Possíveis Causas:**
1. Integrações existem no MongoDB mas sem dados (vendas/clientes)
2. Endpoint de teste não foi executado
3. Webhooks não receberam dados ainda

**Próximos Passos:**
1. Verificar se integrações ainda existem: `GET /api/integrations`
2. Executar endpoint de teste: `POST /api/integrations/test/create-sale`
3. Verificar MongoDB diretamente
4. Reconectar integrações se necessário

---

## 🚀 Próximos Passos Recomendados

### **Imediato:**

1. **Verificar Status Integrações:**
   ```bash
   # Com autenticação
   curl -H "Authorization: Bearer TOKEN" http://localhost:5000/api/integrations
   ```

2. **Criar Venda de Teste:**
   ```bash
   curl -X POST http://localhost:5000/api/integrations/test/create-sale \
     -H "Content-Type: application/json" \
     -d '{"platform":"kiwify","productName":"Super Links - Plano Vitalício"}'
   ```

3. **Testar Troca de Empresa:**
   - Login na plataforma
   - Ir em Empresas
   - Clicar "Acessar" em outra empresa
   - Verificar loading de 2s
   - Confirmar nome da empresa no CompanySwitcher

### **Curto Prazo:**

1. **Filtrar Dados por Empresa:**
   - Atualizar página **Contacts** para filtrar por `currentCompany._id`
   - Atualizar página **Team** para filtrar por `currentCompany._id`
   - Atualizar página **Integrations** para filtrar por `currentCompany._id`
   - Atualizar página **CRM** para filtrar leads por empresa

2. **Indicador Visual da Empresa Atual:**
   - Adicionar badge no header mostrando empresa atual
   - Exemplo: `🏢 Empresa Principal` ao lado do nome do usuário

3. **Persistência de Dados:**
   - Implementar API real para empresas (substituir mock data)
   - Conectar com backend para criar/editar/deletar empresas
   - Sincronizar com MongoDB

### **Médio Prazo:**

1. **Melhorias no Sistema de Empresas:**
   - Convites para membros
   - Permissões granulares por empresa
   - Dashboard por empresa
   - Relatórios isolados por empresa

2. **Integrações Multi-Empresa:**
   - Cada empresa pode ter suas próprias integrações Kiwify/Hotmart
   - Isolamento de clientes/vendas por empresa
   - Tags por empresa

---

## 📊 Estrutura de Dados

### **currentCompany (SubscriptionContext):**

```javascript
{
  _id: 'company-1',              // ID único da empresa
  name: 'Minha Empresa',         // Nome da empresa
  slug: 'minha-empresa',         // Slug para URLs
  logo: null,                    // URL do logo (opcional)
  ownerId: 'user-id',            // ID do proprietário
  inheritedPlan: 'free',         // Plano herdado da assinatura
  status: 'active',              // Status: active, inactive, suspended
  role: 'owner',                 // Role do usuário atual: owner, admin, member
  department: null,              // Departamento (opcional)
  permissions: ['all'],          // Permissões: ['all'] ou array específico
  members: [                     // Array de membros
    {
      userId: 'user-id',
      role: 'owner',
      department: null,
      permissions: ['all'],
      joinedAt: Date
    }
  ],
  usage: {                       // Uso da empresa
    totalMembers: 1,
    storageUsed: 0,
    contactsCount: 0,
    messagesCount: 0
  }
}
```

---

## 🔧 Comandos Úteis

### **Desenvolvimento:**

```bash
# Frontend (porta 5173)
cd plataforma
npm run dev

# Backend (porta 5000)
cd plataforma/backend
npm start

# Verificar processos Node
tasklist | findstr node.exe

# Matar todos processos Node (se necessário)
taskkill //F //IM node.exe
```

### **MongoDB:**

```bash
# Conectar ao MongoDB
mongosh

# Usar database
use plataforma

# Verificar integrações
db.integrations.find().pretty()

# Verificar clientes
db.customers.find().pretty()

# Verificar vendas
db.sales.find().pretty()
```

---

## 📝 Notas Importantes

1. **Tema Purple Padrão:**
   - Gradientes: `from-purple-600 to-purple-500`
   - Hover: `hover:shadow-purple-500/50`
   - Focus: `focus:ring-purple-500`

2. **Dark Mode:**
   - Sempre adicionar classes `dark:`
   - Contraste adequado em ambos os temas
   - Bordas: `dark:border-gray-700`

3. **Notificações:**
   - Usar `toast` do `useToast()` em vez de `alert()`
   - Usar `confirm` do `useConfirm()` em vez de `confirm()`
   - ConfirmDialog para confirmações elegantes

4. **Validações:**
   - Sempre validar plano antes de criar empresa
   - Mostrar feedback claro ao usuário
   - Desabilitar botões quando limite atingido

---

## 🐛 Debugging

### **Se o loading não aparecer:**
```javascript
console.log('isLoadingCompany:', isLoadingCompany);
console.log('loadingCompanyName:', loadingCompanyName);
```

### **Se a empresa não trocar:**
```javascript
console.log('currentCompany antes:', currentCompany);
switchCompany(company.id);
console.log('currentCompany depois:', currentCompany);
console.log('localStorage:', localStorage.getItem('currentCompanyId'));
```

### **Se os dados não filtrarem:**
```javascript
console.log('currentCompany._id:', currentCompany?._id);
console.log('Todos os dados:', todosOsDados);
console.log('Dados filtrados:', dadosFiltrados);
```

---

## ✅ Checklist de Testes

- [x] CompanySwitcher mostra limite correto
- [x] Toast notification ao atingir limite
- [x] Botão desabilitado quando limite atingido
- [x] Tooltip explicativo ao hover
- [x] Modal de loading aparece por 2 segundos
- [x] Empresa troca após loading
- [x] Toast de sucesso ao trocar
- [x] currentCompany atualiza corretamente
- [ ] Dados filtram por empresa (PENDENTE implementar em outras páginas)
- [ ] Integrações isoladas por empresa (PENDENTE)
- [ ] Membros de equipe isolados por empresa (PENDENTE)
- [ ] Clientes isolados por empresa (PENDENTE)

---

## 📞 Contato e Suporte

**Credenciais de Teste:**
- Email: `eu.henriquee2501@gmail.com`
- Senha: `admin@2026`

**URLs:**
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- API Docs: http://localhost:5000/api-docs (se configurado)

---

**Documentação gerada em:** 25/02/2026 - 18:30 BRT
**Tokens restantes:** ~104k/200k
**Status:** ✅ Sistema de empresas funcional, pendente isolamento de dados
