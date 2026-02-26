# Próximos Passos - Plataforma Multi-Tenant

## 🚨 CRÍTICO - Implementar Primeiro

### 1. Isolamento de Dados por Empresa

**Problema:** Atualmente, todas as páginas mostram dados de TODAS as empresas misturadas.

**Solução:** Filtrar dados usando `currentCompany._id` do SubscriptionContext.

**Páginas a Atualizar:**

#### **a) Contacts (src/Contacts.jsx)**
```javascript
import { useSubscription } from './contexts/SubscriptionContext';

const Contacts = () => {
  const { currentCompany } = useSubscription();

  // Filtrar contatos
  const contatosDaEmpresa = contactsData.filter(
    contact => contact.empresaId === currentCompany?._id
  );

  // Usar contatosDaEmpresa em vez de contactsData
};
```

#### **b) Team (src/Team.jsx)**
```javascript
const Team = () => {
  const { currentCompany } = useSubscription();

  const membrosDaEmpresa = teamMembers.filter(
    member => member.empresaId === currentCompany?._id
  );
};
```

#### **c) Integrations (src/Integrations.jsx)**
```javascript
const Integrations = () => {
  const { currentCompany } = useSubscription();

  const integracoesDaEmpresa = integrations.filter(
    integration => integration.empresaId === currentCompany?._id
  );
};
```

#### **d) CRM (src/CRM.jsx)**
```javascript
const CRM = () => {
  const { currentCompany } = useSubscription();

  // Filtrar pipelines
  const pipelinesDaEmpresa = pipelines.filter(
    pipeline => pipeline.empresaId === currentCompany?._id
  );

  // Filtrar leads
  const leadsDaEmpresa = leads.filter(
    lead => lead.empresaId === currentCompany?._id
  );
};
```

#### **e) Inbox (src/Inbox.jsx)**
```javascript
const Inbox = () => {
  const { currentCompany } = useSubscription();

  const conversasDaEmpresa = conversas.filter(
    conv => conv.empresaId === currentCompany?._id
  );
};
```

---

### 2. Indicador Visual da Empresa Atual

**Criar Badge no Header/Sidebar**

**Opção 1: Badge no Topo da Sidebar**
```jsx
// Em Sidebar.jsx
import { useSubscription } from './contexts/SubscriptionContext';

const Sidebar = () => {
  const { currentCompany } = useSubscription();

  return (
    <aside>
      {/* Logo/Header */}

      {/* Badge Empresa Atual */}
      {currentCompany && (
        <div className="px-4 py-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl mx-4 mb-4">
          <div className="flex items-center gap-2">
            <FaBuilding className="text-purple-600 dark:text-purple-400" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                Empresa Atual
              </p>
              <p className="text-sm font-bold text-purple-600 dark:text-purple-400 truncate">
                {currentCompany.name}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CompanySwitcher */}
      {/* Menu Items */}
    </aside>
  );
};
```

**Opção 2: Badge no Header de Cada Página**
```jsx
// Em cada página (Dashboard, Contacts, etc)
const PageHeader = () => {
  const { currentCompany } = useSubscription();

  return (
    <header className="mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Título da Página</h1>
          {currentCompany && (
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
              <FaBuilding className="text-purple-500" />
              <span>{currentCompany.name}</span>
            </p>
          )}
        </div>
      </div>
    </header>
  );
};
```

---

### 3. Verificar Status das Integrações

**Problema Reportado:** "toda a configuração de integração foi zerada :("

**Passos para Investigar:**

#### **a) Verificar MongoDB:**
```bash
mongosh
use plataforma
db.integrations.find().pretty()
db.customers.find().count()
db.sales.find().count()
```

#### **b) Verificar API:**
```bash
# Com autenticação (pegar token do localStorage)
curl -H "Authorization: Bearer SEU_TOKEN" \
  http://localhost:5000/api/integrations
```

#### **c) Criar Dados de Teste:**
```bash
curl -X POST http://localhost:5000/api/integrations/test/create-sale \
  -H "Content-Type: application/json" \
  -d '{
    "platform": "kiwify",
    "productName": "Super Links - Plano Vitalício"
  }'
```

#### **d) Verificar Logs do Backend:**
- Verificar se integração existe: `✅ Integração encontrada`
- Verificar clientes: `👥 X clientes encontrados`
- Verificar vendas: `💰 X vendas encontradas`

---

## 📋 Backlog - Funcionalidades Futuras

### Curto Prazo (1-2 semanas)

1. **API Real para Empresas**
   - Substituir mock data por API
   - CRUD completo: Create, Read, Update, Delete
   - Validação de permissões por role

2. **Convites para Membros**
   - Enviar convite por email
   - Token de convite único
   - Aceitar/Recusar convite
   - Definir role ao convidar

3. **Permissões Granulares**
   - Definir permissões específicas por membro
   - Exemplo: `['contacts.read', 'contacts.write', 'crm.read']`
   - Middleware de validação de permissões

4. **Upload de Logo da Empresa**
   - Upload para cloud storage (AWS S3, Cloudinary)
   - Crop/resize automático
   - Preview antes de salvar

### Médio Prazo (1-2 meses)

1. **Dashboard por Empresa**
   - Métricas isoladas por empresa
   - Gráficos de vendas por empresa
   - Performance comparativa

2. **Relatórios por Empresa**
   - Exportar dados (CSV, Excel, PDF)
   - Filtros avançados
   - Agendamento de relatórios

3. **Departamentos**
   - Criar departamentos dentro da empresa
   - Atribuir membros a departamentos
   - Permissões por departamento

4. **Auditoria**
   - Log de todas as ações
   - Quem fez o quê e quando
   - Filtro por usuário/ação/data

### Longo Prazo (3-6 meses)

1. **Multi-Idioma**
   - Suporte para pt-BR, en-US, es-ES
   - Traduções completas
   - Seletor de idioma

2. **Webhooks Customizáveis**
   - Configurar webhooks por empresa
   - Eventos customizados
   - Retry automático

3. **API Pública**
   - API REST para integração externa
   - Documentação Swagger
   - Rate limiting por empresa

4. **White Label**
   - Customizar cores/logo por empresa
   - Domínio customizado
   - Branding completo

---

## 🧪 Checklist de Testes

### Antes de Marcar como Completo:

- [ ] Login funciona
- [ ] Criar empresa respeitando limite do plano
- [ ] Trocar empresa mostra loading de 2s
- [ ] Nome da empresa atual aparece visível
- [ ] Contatos filtram por empresa
- [ ] Equipe filtra por empresa
- [ ] Integrações filtram por empresa
- [ ] CRM filtra leads por empresa
- [ ] Inbox filtra conversas por empresa
- [ ] Dados não "vazam" entre empresas
- [ ] Plano Free não permite criar empresas
- [ ] Plano Starter permite 1 empresa
- [ ] Plano Pro permite 3 empresas
- [ ] Plano Enterprise permite 5 empresas
- [ ] Toast ao atingir limite
- [ ] Botão desabilitado quando limite atingido
- [ ] Sair de empresa funciona
- [ ] Deletar empresa funciona (apenas owner)
- [ ] Editar empresa funciona (apenas owner)

---

## 🐛 Bugs Conhecidos

1. **Integrações Zeradas** (CRÍTICO)
   - Status: Em investigação
   - Logs: Integração existe mas 0 dados
   - Próximo passo: Verificar MongoDB

2. **currentCompany pode ser null**
   - Adicionar verificação: `currentCompany?._id`
   - Mostrar mensagem: "Selecione uma empresa"

3. **localStorage não sincroniza entre abas**
   - Usar `window.addEventListener('storage')`
   - Atualizar currentCompany quando mudar

---

## 📞 Como Continuar

### Se for outro desenvolvedor:

1. **Ler documentação completa:**
   - `docs/SESSAO-2026-02-25-EMPRESAS.md`
   - Este arquivo (`docs/PROXIMOS-PASSOS.md`)

2. **Verificar estado atual:**
   ```bash
   cd plataforma
   npm run dev  # Frontend (porta 5173)

   cd backend
   npm start    # Backend (porta 5000)
   ```

3. **Login de teste:**
   - Email: `eu.henriquee2501@gmail.com`
   - Senha: `admin@2026`

4. **Começar pelo CRÍTICO:**
   - Implementar isolamento de dados (seção 1 deste arquivo)
   - Adicionar indicador visual (seção 2 deste arquivo)
   - Verificar integrações (seção 3 deste arquivo)

### Se for continuar na próxima sessão:

1. **Verificar MEMORY.md:**
   - Ler o histórico completo
   - Ver pendências

2. **Rodar comandos de verificação:**
   ```bash
   # Verificar se backend está rodando
   curl http://localhost:5000/api/health

   # Verificar integrações
   curl http://localhost:5000/api/integrations
   ```

3. **Priorizar:**
   - ✅ Sistema de empresas funcional
   - ⚠️ Isolamento de dados (PENDENTE)
   - ⚠️ Integrações (verificar status)

---

**Última atualização:** 25/02/2026 - 18:35 BRT
