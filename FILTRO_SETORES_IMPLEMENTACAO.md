# Implementação de Filtro de Atalhos por Setor

## Resumo da Implementação

Sistema completo de filtros de atalhos por setor implementado com sucesso em `src/Shortcuts.jsx` e `src/contexts/AppContext.jsx`.

---

## Funcionalidades Implementadas

### 1. Campo "setor" em Atalhos
- ✅ Cada atalho agora possui um campo `setor`
- ✅ Valores possíveis: `vendas`, `suporte`, `financeiro`, `rh`, `geral`

### 2. Setores Definidos
- **Vendas** - Atalhos para equipe comercial (proposta, desconto, fechamento)
- **Suporte** - Atalhos para atendimento técnico (ticket, tutorial, resolvido)
- **Financeiro** - Atalhos para cobrança (boleto, cobrança, pagamento)
- **RH** - Atalhos para recursos humanos (férias, atestado, onboarding)
- **Geral** - Atalhos visíveis para todos os setores

### 3. Campo "setor" no userData (AppContext)
- ✅ Adicionado campo `setor` no `userData`
- ✅ Valor padrão: `'geral'`
- ✅ Persistido no localStorage

### 4. Filtro Automático por Setor

#### Lógica de Filtragem:
```javascript
// Admin vê TODOS os atalhos
if (userData.role === 'admin') {
  matchSetor = true; // Sem filtro
}
// Usuário comum vê apenas seu setor + Geral
else {
  const userSetor = userData.setor || 'geral';
  matchSetor = reply.setor === userSetor || reply.setor === 'geral';
}
```

**Exemplo:**
- Usuário do setor "Vendas" vê:
  - ✅ Todos os atalhos de "Vendas"
  - ✅ Todos os atalhos de "Geral"
  - ❌ NÃO vê atalhos de Suporte, Financeiro, RH

- Admin vê:
  - ✅ TODOS os atalhos de TODOS os setores

### 5. Dropdown de Filtro Manual
- ✅ Dropdown adicionado ao lado da barra de busca
- ✅ Permite filtrar manualmente por qualquer setor
- ✅ Opção "Todos os Setores" para admins
- ✅ Ícone de filtro (`FaFilter`)

### 6. Persistência no localStorage
- ✅ Todos os atalhos salvos em `localStorage` com chave `shortcutsData`
- ✅ Auto-save sempre que lista de atalhos muda
- ✅ Setor do usuário salvo em `userData`

---

## Mock Data Implementado

### Atalhos por Setor:

**Geral (2 atalhos):**
- `/ola` - Saudação Inicial
- `/horario` - Horário de Atendimento

**Vendas (3 atalhos):**
- `/proposta` - Envio de Proposta
- `/desconto` - Consulta Desconto
- `/fechamento` - Fechamento de Venda

**Suporte (3 atalhos):**
- `/ticket` - Abertura de Ticket
- `/tutorial` - Enviar Tutorial
- `/resolvido` - Problema Resolvido

**Financeiro (3 atalhos):**
- `/boleto` - Envio de Boleto
- `/cobranca` - Lembrete de Cobrança
- `/pagamento` - Confirmação de Pagamento

**RH (3 atalhos):**
- `/ferias` - Solicitação de Férias
- `/atestado` - Envio de Atestado
- `/onboarding` - Boas-vindas Novo Colaborador

**Individual (1 atalho):**
- `/meuatalho` - Atalho Pessoal

**Total: 15 atalhos**

---

## Interface Implementada

### 1. Banner Informativo
- Banner azul explicando o sistema de filtro
- Mensagem diferenciada para Admin vs Usuário comum
- Ícone de filtro

### 2. Dropdown de Filtro
- Localizado ao lado da busca
- Ícone de filtro à esquerda
- Seta dropdown personalizada
- Todas as opções de setores

### 3. Info Strip (quando usuário não é admin)
- Mostra setor atual do usuário
- Informa que também vê atalhos "Geral"

### 4. Badges nos Cards
- Badge de Scope (Global/Setor/Individual)
- Badge de Setor (colorido por setor)
- Cores:
  - Vendas: Azul
  - Suporte: Verde
  - Financeiro: Amarelo
  - RH: Rosa
  - Geral: Roxo

### 5. Formulário de Criação/Edição
- Campo "Setor do Atalho" com dropdown
- Texto de ajuda explicando visibilidade
- Valor padrão baseado no setor do usuário

---

## Arquivos Modificados

### 1. `src/contexts/AppContext.jsx`
**Mudança:**
```javascript
{
  name: 'Henrique de Oliveira',
  email: 'eu.henriquee2501@gmail.com',
  role: 'admin',
  cargo: 'Administrador',
  setor: 'geral', // ⬅️ NOVO CAMPO
  // ... outros campos
}
```

### 2. `src/Shortcuts.jsx`
**Mudanças principais:**
- Importação de `useAppContext`
- Estado `filterSetor` para filtro manual
- Função `getSetorBadge()` para cores dos badges
- Mock data inicial com 15 atalhos distribuídos
- `useEffect` para persistência no localStorage
- Lógica de filtragem por setor
- UI: banner, dropdown, badges

---

## Como Testar

### Teste 1: Usuário Comum (não-admin)
1. Altere `userData.role` para `'user'`
2. Altere `userData.setor` para `'vendas'`
3. Verifique que vê apenas atalhos de "Vendas" + "Geral"
4. Use o dropdown para ver outros setores

### Teste 2: Admin
1. Mantenha `userData.role` como `'admin'`
2. Verifique que vê TODOS os 15 atalhos
3. Use o dropdown para filtrar manualmente

### Teste 3: Criar Novo Atalho
1. Clique em "Nova Resposta"
2. Preencha shortcut, título, conteúdo
3. Selecione um setor no dropdown
4. Salve
5. Verifique que o badge de setor aparece corretamente

### Teste 4: Persistência
1. Crie ou edite atalhos
2. Recarregue a página (F5)
3. Verifique que os atalhos permanecem salvos

---

## Melhorias Futuras (Opcional)

- [ ] Adicionar contador de atalhos por setor
- [ ] Permitir múltiplos setores por atalho
- [ ] Sistema de permissões granulares (quem pode criar/editar)
- [ ] Importação/Exportação de atalhos por setor
- [ ] Analytics: atalhos mais usados por setor
- [ ] Sugestões de atalhos baseadas no setor do usuário

---

## Estrutura de Dados

### Atalho Completo
```javascript
{
  id: '1',
  shortcut: 'ola',
  title: 'Saudação Inicial',
  content: 'Olá! 👋 Seja bem-vindo...',
  scope: 'global',           // global | sector | individual
  user_id: null,             // ID do usuário (se individual)
  sector_id: null,           // ID do setor (legacy, se scope=sector)
  setor: 'geral'            // vendas | suporte | financeiro | rh | geral
}
```

### Setor
```javascript
{
  id: 'vendas',
  name: 'Vendas',
  color: 'text-blue-600',
  bg: 'bg-blue-50 dark:bg-blue-900/30'
}
```

---

**Status:** ✅ IMPLEMENTAÇÃO COMPLETA

**Desenvolvido por:** Backend/Frontend Engineer
**Data:** 2026-02-24
