# 🔄 Enviar Contato para CRM

> **Funcionalidade:** Converta conversas do Inbox em leads do CRM com um clique

---

## 📋 Visão Geral

Esta funcionalidade permite que atendentes transfiram contatos do Inbox diretamente para o pipeline de vendas do CRM, criando um lead/card automaticamente com todas as informações do contato.

---

## 🎯 Fluxo de Uso

```
Inbox Conversation
     ↓
  (⋮ Menu)
     ↓
"Enviar para CRM"
     ↓
Selecionar Pipeline
     ↓
Selecionar Stage
     ↓
✅ Lead Criado no CRM!
```

---

## 🚀 Como Usar

### **Passo a Passo**

#### **1. Abrir Menu de Opções**
1. Vá para [[05-Inbox|Inbox]]
2. Selecione uma conversa
3. Clique no ícone **⋮** (3 pontinhos) no header

#### **2. Selecionar "Enviar para CRM"**
- Aparecerá submenu com opção "Enviar para CRM >"
- Clique para abrir lista de pipelines

#### **3. Escolher Pipeline**
- Visualize todas as pipelines disponíveis
- Exemplo: "Pipeline de Vendas", "Pipeline de Suporte"
- Clique na pipeline desejada

#### **4. Escolher Stage**
- Visualize todos os stages da pipeline selecionada
- Exemplo: "LEADS (Entrada)", "CONTATO INICIADO", "QUALIFICADO"
- Clique no stage desejado

#### **5. Confirmação**
- ✅ Card criado com sucesso!
- Mensagem de confirmação aparece
- Você pode ir ao CRM para ver o novo lead

---

## 📊 Dados Transferidos

### **Informações do Contato → Lead**

| Campo Inbox | Campo CRM | Exemplo |
|-------------|-----------|---------|
| Nome | nome | "João Silva" |
| Telefone | telefone | "+55 (11) 98765-4321" |
| Email | email | "joao@example.com" |
| Origem | origem | "Inbox" |
| Tags | tags | ["VIP", "Urgente"] |
| - | observacoes | "Contato enviado do Inbox em 24/02/2026 10:30" |
| - | dataEntrada | "2026-02-24T10:30:00.000Z" |
| - | prioridade | "media" |

### **Campos Adicionais Criados**
```javascript
{
  id: Date.now(),  // ID único
  valor: '',  // Deixado vazio para preencher depois
  empresa: '',  // Deixado vazio
  atribuidoPara: null,  // Não atribuído inicialmente
  ultimaInteracao: new Date().toISOString(),
  prioridade: 'media'
}
```

---

## 💻 Implementação Técnica

### **Componentes Envolvidos**

#### **1. Estados (Inbox.jsx)**
```javascript
const [showHeaderMenu, setShowHeaderMenu] = useState(false);
const [showCRMPipelinesMenu, setShowCRMPipelinesMenu] = useState(false);
const [showCRMStagesMenu, setShowCRMStagesMenu] = useState(false);
const [selectedCRMPipeline, setSelectedCRMPipeline] = useState(null);
const [crmPipelines, setCrmPipelines] = useState([]);
```

#### **2. Carregar Pipelines**
```javascript
useEffect(() => {
  const savedPipelines = localStorage.getItem('crm_pipelines');
  if (savedPipelines) {
    try {
      const parsed = JSON.parse(savedPipelines);
      setCrmPipelines(parsed);
    } catch (error) {
      console.error('Erro ao carregar pipelines:', error);
      setCrmPipelines([]);
    }
  }
}, []);
```

#### **3. Função Principal**
```javascript
const handleSendToCRM = (pipelineId, stageId) => {
  if (!selectedConversation || !contactInfo) return;

  // Criar novo lead
  const newLead = {
    id: Date.now(),
    nome: contactInfo.nome,
    telefone: contactInfo.telefone || '+55 (11) 98765-4321',
    email: contactInfo.email || 'contato@exemplo.com',
    valor: '',
    empresa: '',
    origem: contactInfo.origem || 'Inbox',
    tags: contactInfo.tags || [],
    atribuidoPara: null,
    dataEntrada: new Date().toISOString(),
    ultimaInteracao: new Date().toISOString(),
    prioridade: 'media',
    observacoes: `Contato enviado do Inbox em ${new Date().toLocaleString('pt-BR')}`
  };

  // Atualizar localStorage
  const savedPipelines = localStorage.getItem('crm_pipelines');
  if (savedPipelines) {
    const pipelines = JSON.parse(savedPipelines);
    const updatedPipelines = pipelines.map(pipeline => {
      if (pipeline.id === pipelineId) {
        return {
          ...pipeline,
          stages: pipeline.stages.map(stage => {
            if (stage.id === stageId) {
              return {
                ...stage,
                leads: [...(stage.leads || []), newLead]
              };
            }
            return stage;
          })
        };
      }
      return pipeline;
    });

    localStorage.setItem('crm_pipelines', JSON.stringify(updatedPipelines));
    alert(`${contactInfo.nome} foi adicionado ao CRM com sucesso!`);

    // Fechar menus
    setShowHeaderMenu(false);
    setShowCRMPipelinesMenu(false);
    setShowCRMStagesMenu(false);
  }
};
```

---

## 🎨 Interface do Menu

### **Estrutura Visual**
```
┌─────────────────────────┐
│    Mais opções (⋮)      │
├─────────────────────────┤
│ Enviar para CRM      ▸  │ ← Hover aqui
└─────────────────────────┘
            ↓
    ┌─────────────────────┐
    │  Pipeline de Vendas ▸│ ← Selecionar
    │  Pipeline Suporte  ▸ │
    └─────────────────────┘
                ↓
        ┌──────────────────┐
        │ LEADS (Entrada)  │ ← Criar card aqui
        │ CONTATO INICIADO │
        │ QUALIFICADO      │
        │ FOLLOW-UP        │
        │ FECHADO          │
        └──────────────────┘
```

### **Código do Menu**
```jsx
<div className="relative">
  <button onClick={() => setShowHeaderMenu(!showHeaderMenu)}>
    <FaEllipsisV />
  </button>

  {showHeaderMenu && (
    <div className="menu">
      <button onClick={() => setShowCRMPipelinesMenu(!showCRMPipelinesMenu)}>
        Enviar para CRM <FaChevronRight />
      </button>

      {showCRMPipelinesMenu && (
        <div className="submenu pipelines">
          {crmPipelines.map(pipeline => (
            <button onClick={() => {
              setSelectedCRMPipeline(pipeline);
              setShowCRMStagesMenu(true);
            }}>
              {pipeline.name} <FaChevronRight />
            </button>
          ))}
        </div>
      )}

      {showCRMStagesMenu && selectedCRMPipeline && (
        <div className="submenu stages">
          {selectedCRMPipeline.stages.map(stage => (
            <button onClick={() => handleSendToCRM(selectedCRMPipeline.id, stage.id)}>
              {stage.nome}
            </button>
          ))}
        </div>
      )}
    </div>
  )}
</div>
```

---

## ✅ Casos de Uso

### **Caso 1: Lead de Vendas**
**Contexto:** Cliente interessado em produto
1. Conversa no Inbox
2. Enviar para "Pipeline de Vendas" > "LEADS (Entrada)"
3. Equipe de vendas recebe lead qualificado

### **Caso 2: Suporte Técnico**
**Contexto:** Cliente com problema
1. Conversa no Inbox
2. Enviar para "Pipeline Suporte" > "TRIAGEM"
3. Equipe de suporte analisa ticket

### **Caso 3: Follow-up Comercial**
**Contexto:** Cliente já contactado antes
1. Nova conversa no Inbox
2. Enviar para "Pipeline de Vendas" > "FOLLOW-UP"
3. Vendedor retoma negociação

---

## 🐛 Tratamento de Erros

### **Nenhuma Pipeline Encontrada**
```
┌──────────────────────────────┐
│ Nenhuma pipeline encontrada. │
│ Crie uma pipeline no CRM     │
│ primeiro.                    │
└──────────────────────────────┘
```

### **Pipeline Sem Stages**
```
┌──────────────────────────────┐
│ Nenhum estágio nesta pipeline│
└──────────────────────────────┘
```

### **Erro ao Salvar**
```javascript
try {
  // Salvar no localStorage
  localStorage.setItem('crm_pipelines', JSON.stringify(updatedPipelines));
} catch (error) {
  console.error('Erro ao enviar contato para o CRM:', error);
  alert('Erro ao enviar contato para o CRM. Por favor, tente novamente.');
}
```

---

## 🔗 Integrações

### **Com [[05-Inbox|Inbox]]**
- Lê dados do contato selecionado
- Usa informações da conversa ativa
- Fecha menus após sucesso

### **Com [[06-CRM|CRM]]**
- Escreve no localStorage do CRM
- Respeita estrutura de pipelines/stages
- Adiciona ao array de leads do stage

### **Com [[18-ToastSystem|Toast]]** (Futuro)
```javascript
toast.success(`${contactInfo.nome} foi adicionado ao CRM!`);
```

---

## 🚀 Melhorias Futuras

### **Curto Prazo**
- [ ] Usar [[18-ToastSystem]] em vez de `alert()`
- [ ] Animação ao enviar
- [ ] Ícone de loading durante processamento
- [ ] Confirmação visual no Inbox

### **Médio Prazo**
- [ ] Pré-preencher valor estimado
- [ ] Sugerir stage baseado em histórico
- [ ] Auto-atribuir ao atendente atual
- [ ] Copiar histórico de mensagens para observações

### **Longo Prazo**
- [ ] API backend real
- [ ] Sincronização em tempo real
- [ ] Webhooks para notificar equipe de vendas
- [ ] Analytics de conversão Inbox → CRM

---

## 📦 Arquivos Relacionados

- `src/Inbox.jsx` - Implementação principal (linhas 66-73, 155-169, 540-590, 903-989)
- `src/CRM.jsx` - Estrutura de pipelines e stages
- [[05-Inbox]] - Documentação completa do Inbox
- [[06-CRM]] - Documentação completa do CRM

---

## 🎓 Recursos de Aprendizado

### **Como Funciona o localStorage**
```javascript
// Ler
const data = localStorage.getItem('key');
const parsed = JSON.parse(data);

// Escrever
localStorage.setItem('key', JSON.stringify(data));

// Remover
localStorage.removeItem('key');
```

### **Estrutura de Dados**
```javascript
{
  pipelines: [
    {
      id: 'pipeline-1',
      name: 'Pipeline de Vendas',
      stages: [
        {
          id: 'leads',
          nome: 'LEADS (Entrada)',
          leads: [
            {
              id: 1234567890,
              nome: 'João Silva',
              telefone: '+55 (11) 98765-4321',
              // ... outros campos
            }
          ]
        }
      ]
    }
  ]
}
```

---

[[05-Inbox|← Voltar para Inbox]] | [[06-CRM|Ir para CRM]] | [[00-INDEX|Índice]]
