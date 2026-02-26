# 🎭 Modo Demonstração Kiwify

## ✅ Solução Implementada

Como as credenciais da Kiwify estão retornando `TOKEN_INVALID`, implementei um **Modo de Demonstração** que permite você usar a plataforma AGORA com dados realistas enquanto investigamos o problema de autenticação.

---

## 🔧 Como Funciona

### Modo Mock Ativado

Arquivo: `backend/.env`
```bash
KIWIFY_USE_MOCK=true  # ✅ JÁ ATIVADO
```

Quando ativado, o backend usa **dados mockados realistas** ao invés de chamar a API real da Kiwify.

---

## 📊 Dados Disponíveis no Modo Demo

### Produtos (3 produtos)
1. **Super Links - Gerador de Links**
   - Preço: R$ 197,00
   - Tipo: Vitalícia
   - Vendas: 145

2. **Super Presell - Landing Pages**
   - Preço: R$ 297,00
   - Tipo: Mensal
   - Vendas: 87

3. **Pack Completo - Links + Presell**
   - Preço: R$ 397,00
   - Tipo: Anual
   - Vendas: 234

### Clientes (5 clientes)
- João Silva (joao.silva@email.com)
- Maria Santos (maria.santos@email.com)
- Pedro Costa (pedro.costa@email.com)
- Ana Oliveira (ana.oliveira@email.com) - **REEMBOLSO**
- Carlos Mendes (carlos.mendes@email.com)

### Vendas (5 vendas)
- **Total de vendas:** R$ 1.385,00
- **Total de reembolsos:** R$ 197,00
- **Receita líquida:** R$ 1.188,00
- **Ticket médio:** R$ 277,00
- **Taxa de conversão:** 15,5%

Cada venda inclui:
- ✅ Nome completo do cliente
- ✅ Email
- ✅ CPF
- ✅ Telefone
- ✅ Tipo de compra (vitalícia/mensal/anual)
- ✅ Data e hora da compra
- ✅ Status (approved/refunded)

---

## 🧪 Como Testar

### 1. Iniciar o Backend
```bash
cd backend
npm start
```

**Você verá:**
```
🚀 Servidor rodando na porta 5000 em modo development
📡 API disponível em http://localhost:5000
```

### 2. Iniciar o Frontend
```bash
npm run dev
```

### 3. Conectar com Kiwify (Modo Demo)

1. Acesse: http://localhost:5173
2. Vá em **Integrações**
3. Clique em **Conectar** no card da Kiwify
4. Cole as credenciais:
   ```
   Client ID: cc13db1a-0efd-4389-9f4e-38f9d3182ca0
   Client Secret: 56548fe6d3a11662d536e7e9d857a946ef16c02c8581ee327b794e8bfd120153
   Account ID: fxnGQAJZPSK2y6f
   ```
5. Clique em **Conectar**

**Resultado esperado:**
```
✅ Conectado com Kiwify com sucesso! (MODO DEMO)
```

### 4. Sincronizar Dados

1. Clique em **Sincronizar**
2. Veja os dados mockados aparecerem:
   - 3 produtos criados
   - 5 clientes criados
   - 5 vendas registradas
   - Tags automáticas aplicadas

---

## 📁 Arquivos do Modo Mock

### `backend/services/kiwifyMockService.js` ✅ CRIADO
Serviço que simula a API da Kiwify com dados realistas.

**Métodos disponíveis:**
- `authenticate()` - Retorna sucesso sempre
- `getProducts()` - Retorna 3 produtos
- `getSales()` - Retorna 5 vendas
- `getStats()` - Retorna estatísticas
- `processWebhook()` - Simula webhooks

### `backend/services/kiwifyService.js` ✅ ATUALIZADO
Agora verifica a flag `KIWIFY_USE_MOCK` e usa o mock service quando ativado.

```javascript
const USE_MOCK = process.env.KIWIFY_USE_MOCK === 'true';

async authenticate(client_id, client_secret, account_id) {
  if (USE_MOCK) {
    return await kiwifyMockService.authenticate(...);
  }
  // API real...
}
```

---

## 🔄 Trocar para Modo Real (quando funcionar)

Quando as credenciais da Kiwify começarem a funcionar:

1. Edite `backend/.env`:
   ```bash
   KIWIFY_USE_MOCK=false  # Desativa mock
   ```

2. Reinicie o backend:
   ```bash
   cd backend
   npm start
   ```

3. **Pronto!** O sistema automaticamente usará a API real.

---

## ✨ Vantagens do Modo Demo

1. ✅ **Testar AGORA** - Não precisa esperar a API funcionar
2. ✅ **Dados Realistas** - Simula situação real com 5 clientes
3. ✅ **Todas as Funcionalidades** - Tags, produtos, vendas, reembolsos
4. ✅ **Sem Erros** - Nunca falha, sempre retorna dados
5. ✅ **Fácil de Trocar** - Uma flag no .env

---

## 🎯 O Que Você Pode Testar

### Dashboard
- ✅ Total de vendas: R$ 1.385,00
- ✅ Total de clientes: 5
- ✅ Taxa de conversão: 15,5%
- ✅ Últimas vendas aparecem

### Contatos
- ✅ 5 clientes criados automaticamente
- ✅ Tags aplicadas (Super Links, Super Presell, Pack Completo)
- ✅ Emails, CPFs e telefones

### Relatórios
- ✅ Últimos compradores
- ✅ O que cada um comprou
- ✅ Hora e data da compra
- ✅ Tipo de compra (vitalícia/mensal/anual)
- ✅ Total de reembolsos

---

## 🐛 Investigando o Problema Real

Enquanto usa o modo demo, você pode:

1. **Entrar em contato com suporte da Kiwify**
   - Informar que a API retorna `TOKEN_INVALID`
   - Enviar as credenciais para validação
   - Perguntar se há configurações adicionais

2. **Verificar no painel da Kiwify**
   - Status da API Key
   - Permissões configuradas
   - Whitelist de IPs (se houver)

3. **Testar endpoints individuais**
   - Usar Postman com as credenciais
   - Ver se algum endpoint funciona

---

## 📝 Resumo

| Item | Status |
|------|--------|
| Modo Mock criado | ✅ Implementado |
| Dados realistas | ✅ 3 produtos, 5 vendas |
| Flag no .env | ✅ KIWIFY_USE_MOCK=true |
| Backend atualizado | ✅ Usa mock quando ativado |
| Pronto para usar | ✅ SIM! |

---

**🎉 Agora você pode usar a plataforma normalmente com dados da Kiwify enquanto investigamos o problema de autenticação!**

Quando as credenciais funcionarem, é só mudar `KIWIFY_USE_MOCK=false` e tudo passará a usar a API real automaticamente.
