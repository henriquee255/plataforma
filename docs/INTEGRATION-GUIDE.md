# 🔌 Guia Completo de Integração com Plataformas

**Data:** 2026-02-25
**Versão:** 1.0

---

## 📋 Índice

1. [Kiwify](#-kiwify)
2. [Hotmart](#-hotmart)
3. [Stripe](#-stripe)
4. [Como Implementar](#-como-implementar-na-plataforma)

---

## 🥝 Kiwify

### Credenciais Necessárias

A API Kiwify requer **3 credenciais OAuth 2.0**:

| Campo | Descrição | Obrigatório |
|-------|-----------|-------------|
| **client_id** | ID do cliente OAuth | ✅ Sim |
| **client_secret** | Chave secreta OAuth | ✅ Sim |
| **account_id** | ID da conta Kiwify | ✅ Sim |

### Como Obter as Credenciais

1. **Acesse sua conta Kiwify**
   - Entre em https://dashboard.kiwify.com.br/

2. **Navegue até Apps > API**
   - No menu lateral, clique em **"Apps"**
   - Em seguida, clique em **"API"**

3. **Crie uma API Key**
   - Clique em **"Criar API Key"**
   - Preencha os campos solicitados

4. **Copie as 3 credenciais geradas**
   - **client_id**: Identificador único do cliente OAuth
   - **client_secret**: Chave secreta (guardar com segurança!)
   - **account_id**: ID da sua conta Kiwify

**Importante:** Essas credenciais são exibidas apenas uma vez. Guarde-as em local seguro!

### Autenticação

A Kiwify usa **OAuth 2.0** para autenticação:

```javascript
// 1. Obter Access Token
POST https://api.kiwify.com.br/oauth/token
Content-Type: application/json

{
  "client_id": "seu_client_id",
  "client_secret": "seu_client_secret",
  "grant_type": "client_credentials"
}

// Resposta:
{
  "access_token": "eyJ...",
  "token_type": "Bearer",
  "expires_in": 3600
}

// 2. Usar Token nas Requisições
GET https://api.kiwify.com.br/v1/purchases
Authorization: Bearer eyJ...
```

### Webhooks

Configure o webhook para receber notificações em tempo real:

```
URL do Webhook: https://sua-plataforma.com/api/webhooks/kiwify
Eventos: purchase, subscription, refund
```

### Dados Disponíveis

- ✅ **Clientes**: Nome, email, CPF, telefone
- ✅ **Produtos**: Nome, preço, tipo (vitalício/mensal/anual)
- ✅ **Vendas**: Valor, data, hora, status
- ✅ **Reembolsos**: Total e quantidade

### Links Úteis

- 📚 [Documentação Oficial Kiwify](https://docs.kiwify.com.br/)
- 🔗 [Como realizar integração - Notazz](https://suporte.notazz.com/como-realizar-a-integracao-com-a-kiwify-api/)

---

## 🔥 Hotmart

### Credenciais Necessárias

A API Hotmart requer **3 credenciais principais**:

| Campo | Descrição | Obrigatório |
|-------|-----------|-------------|
| **client_id** | ID do cliente OAuth | ✅ Sim |
| **client_secret** | Chave secreta OAuth | ✅ Sim |
| **basic_token** | Token básico de autenticação | ✅ Sim |

### Como Obter as Credenciais

1. **Acesse sua conta Hotmart**
   - Entre em https://app.hotmart.com/

2. **Vá até "Gerenciar meu negócio"**
   - No menu lateral esquerdo, clique em **"Gerenciar meu negócio"**

3. **Acesse Produtos > Ferramentas**
   - Navegue até **Produtos > Ferramentas**

4. **Crie uma credencial**
   - Na seção "Todas as ferramentas", clique em **"Credenciais Hotmart"**
   - Clique em **"Criar Credencial"**
   - Selecione **"API Hotmart"**
   - Clique em **"Criar Credencial"**

5. **Copie as 3 credenciais**
   - **client_id**: ID do cliente
   - **client_secret**: Chave secreta
   - **basic_token**: Token básico (tipo Basic)

### ⚠️ Importante sobre Segurança

- O **access_token** expira periodicamente
- As **credenciais (client_id, client_secret, basic)** NÃO expiram
- Guarde as credenciais em local seguro
- **NUNCA** compartilhe o client_secret

### Autenticação

A Hotmart usa **OAuth 2.0** com 2 etapas:

```javascript
// 1. Obter Access Token
POST https://api-sec-vlc.hotmart.com/security/oauth/token
Content-Type: application/json
Authorization: Basic {basic_token}

{
  "grant_type": "client_credentials",
  "client_id": "seu_client_id",
  "client_secret": "seu_client_secret"
}

// Resposta:
{
  "access_token": "abc123...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "read write"
}

// 2. Usar Token nas Requisições HotConnect
GET https://developers.hotmart.com/payments/api/v1/sales
Authorization: Bearer abc123...
```

### Webhooks (Postback)

Configure o webhook para receber notificações:

```
URL do Webhook: https://sua-plataforma.com/api/webhooks/hotmart
Eventos: PURCHASE_COMPLETE, PURCHASE_REFUNDED, SUBSCRIPTION_CANCELLATION
```

### Dados Disponíveis

- ✅ **Clientes**: Nome, email, telefone, documento
- ✅ **Produtos**: Nome, ID, preço, comissão
- ✅ **Vendas**: Valor, data, status, tipo de pagamento
- ✅ **Assinaturas**: Status, próximo pagamento, cancelamentos
- ✅ **Reembolsos**: Valor, motivo, data

### Links Úteis

- 📚 [Documentação Oficial Hotmart](https://developers.hotmart.com/docs/en/start/app-auth/)
- 📚 [Documentação em Português](https://developers.hotmart.com/docs/pt-BR/start/app-auth/)
- 🔗 [Como configurar webhooks](https://help.hotmart.com/en/article/360001491352/)

---

## 💳 Stripe

### Credenciais Necessárias

A API Stripe requer **3 credenciais principais**:

| Campo | Descrição | Obrigatório |
|-------|-----------|-------------|
| **secret_key** | Chave secreta (server-side) | ✅ Sim |
| **publishable_key** | Chave pública (client-side) | ⚠️ Opcional |
| **webhook_secret** | Segredo do webhook | ✅ Sim |

### Tipos de Chaves

#### Secret Key (Chave Secreta)
- 🔐 **NUNCA** expor no frontend
- 📍 Usar apenas no backend/servidor
- 🏷️ Prefixo: `sk_test_` (test) ou `sk_live_` (produção)
- 🎯 **Esta é a chave principal para integração**

#### Publishable Key (Chave Pública)
- ✅ Pode ser exposta no frontend
- 📍 Usar em formulários de pagamento
- 🏷️ Prefixo: `pk_test_` (test) ou `pk_live_` (produção)
- 🎯 Opcional para integrações simples

#### Webhook Secret
- 🔐 Segredo único para cada webhook endpoint
- 📍 Usado para verificar assinaturas de webhooks
- 🏷️ Prefixo: `whsec_`
- 🎯 **Essencial** para segurança dos webhooks

### Como Obter as Credenciais

1. **Acesse sua conta Stripe**
   - Entre em https://dashboard.stripe.com/

2. **Navegue até Developers > API Keys**
   - No menu superior, clique em **"Developers"**
   - No submenu, clique em **"API keys"**

3. **Copie as chaves**
   - **Secret key**: Clique em "Reveal live key" ou "Reveal test key"
   - **Publishable key**: Já visível na página
   - ⚠️ **IMPORTANTE**: Você só pode ver a secret key **UMA VEZ**

4. **Configure o Webhook**
   - Ainda em "Developers", clique em **"Webhooks"**
   - Clique em **"Add endpoint"**
   - URL: `https://sua-plataforma.com/api/webhooks/stripe`
   - Selecione eventos: `charge.succeeded`, `charge.refunded`, `customer.subscription.created`, etc.
   - Copie o **Signing secret** (webhook_secret)

### ⚠️ Segurança Crítica

```
❌ NUNCA faça isso:
- Expor secret_key no frontend
- Commitar secret_key no Git
- Compartilhar secret_key

✅ SEMPRE faça isso:
- Guardar secret_key em variáveis de ambiente
- Usar KMS (Key Management System)
- Rotacionar chaves periodicamente
- Usar chaves de teste durante desenvolvimento
```

### Autenticação

A Stripe usa **Bearer Token** direto (não OAuth):

```javascript
// Requisição de Exemplo
GET https://api.stripe.com/v1/customers
Authorization: Bearer sk_live_abc123...
```

### Webhooks

Configure múltiplos eventos para receber notificações:

```javascript
// Eventos Recomendados
[
  'charge.succeeded',           // Pagamento aprovado
  'charge.refunded',            // Reembolso processado
  'customer.created',           // Cliente criado
  'customer.subscription.created', // Assinatura criada
  'customer.subscription.deleted', // Assinatura cancelada
  'invoice.payment_succeeded',  // Pagamento de invoice
  'invoice.payment_failed'      // Falha no pagamento
]

// Verificação de Assinatura do Webhook
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const sig = req.headers['stripe-signature'];

try {
  const event = stripe.webhooks.constructEvent(
    req.body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET
  );
  // Webhook autêntico!
} catch (err) {
  // Webhook inválido!
}
```

### Dados Disponíveis

- ✅ **Clientes**: Nome, email, telefone, endereço, metadados
- ✅ **Produtos**: Nome, descrição, preços (one-time, subscription)
- ✅ **Pagamentos**: Valor, moeda, status, método de pagamento
- ✅ **Assinaturas**: Status, período, próxima cobrança
- ✅ **Reembolsos**: Valor, razão, status
- ✅ **Invoices**: Faturas, itens, status de pagamento

### Links Úteis

- 📚 [Documentação de API Keys](https://docs.stripe.com/keys)
- 📚 [Best Practices - Secret Keys](https://docs.stripe.com/keys-best-practices)
- 📚 [Webhooks Documentation](https://docs.stripe.com/webhooks)
- 🔗 [Como obter chaves Stripe](https://support.stripe.com/questions/what-are-stripe-api-keys-and-how-to-find-them)

---

## 🛠️ Como Implementar na Plataforma

### 1. Atualizar AppContext.jsx

Ajustar os campos das integrações para usar as credenciais corretas:

#### Kiwify

```javascript
{
  id: 'kiwify',
  name: 'Kiwify',
  category: 'payments',
  status: 'inactive',
  description: 'Plataforma completa de vendas digitais',
  fields: [
    {
      name: 'api_key',
      label: 'API Key',
      type: 'text',
      required: true,
      placeholder: 'Ex: kw_key_abc123...'
    },
    {
      name: 'client_id',
      label: 'Client ID',
      type: 'text',
      required: true,
      placeholder: 'Ex: kw_abc123...'
    },
    {
      name: 'client_secret',
      label: 'Client Secret',
      type: 'password',
      required: true,
      placeholder: 'Ex: ks_secret_...'
    },
    {
      name: 'account_id',
      label: 'Account ID',
      type: 'text',
      required: true,
      placeholder: 'Ex: acc_123456...'
    },
    {
      name: 'webhookUrl',
      label: 'Webhook URL',
      type: 'text',
      readonly: true,
      value: 'https://api.plataforma.com/webhooks/kiwify'
    }
  ],
  instructions: [
    'Acesse o painel da Kiwify',
    'Clique em "Apps" no menu lateral',
    'Entre em "API"',
    'Copie client_id, client_secret e account_id',
    'Configure o Webhook URL no painel da Kiwify'
  ]
}
```

#### Hotmart

```javascript
{
  id: 'hotmart',
  name: 'Hotmart',
  category: 'payments',
  status: 'inactive',
  description: 'Maior plataforma de infoprodutos da América Latina',
  fields: [
    {
      name: 'client_id',
      label: 'Client ID',
      type: 'text',
      required: true,
      placeholder: 'Ex: abc123-def456...'
    },
    {
      name: 'client_secret',
      label: 'Client Secret',
      type: 'password',
      required: true,
      placeholder: 'Ex: secret_...'
    },
    {
      name: 'basic_token',
      label: 'Basic Token',
      type: 'password',
      required: true,
      placeholder: 'Ex: Basic abc123...'
    },
    {
      name: 'webhookUrl',
      label: 'Webhook URL',
      type: 'text',
      readonly: true,
      value: 'https://api.plataforma.com/webhooks/hotmart'
    }
  ],
  instructions: [
    'Faça login na Hotmart',
    'Vá em "Gerenciar meu negócio"',
    'Acesse Produtos > Ferramentas',
    'Clique em "Credenciais Hotmart"',
    'Clique em "Criar Credencial" > "API Hotmart"',
    'Copie client_id, client_secret e basic_token',
    'Configure o Postback (webhook) com a URL fornecida'
  ]
}
```

#### Stripe

```javascript
{
  id: 'stripe',
  name: 'Stripe',
  category: 'payments',
  status: 'inactive',
  description: 'Plataforma global de pagamentos online',
  fields: [
    {
      name: 'secret_key',
      label: 'Secret Key',
      type: 'password',
      required: true,
      placeholder: 'Ex: sk_live_...'
    },
    {
      name: 'webhook_secret',
      label: 'Webhook Secret',
      type: 'password',
      required: true,
      placeholder: 'Ex: whsec_...'
    },
    {
      name: 'publishable_key',
      label: 'Publishable Key (Opcional)',
      type: 'text',
      required: false,
      placeholder: 'Ex: pk_live_...'
    },
    {
      name: 'webhookUrl',
      label: 'Webhook URL',
      type: 'text',
      readonly: true,
      value: 'https://api.plataforma.com/webhooks/stripe'
    }
  ],
  instructions: [
    'Acesse o Dashboard da Stripe',
    'Vá em Developers > API keys',
    'Copie a Secret Key (clique em "Reveal")',
    'Vá em Developers > Webhooks',
    'Clique em "Add endpoint"',
    'Cole a Webhook URL',
    'Selecione os eventos desejados',
    'Copie o Signing secret (webhook_secret)'
  ]
}
```

### 2. Implementar Backend de Autenticação

Criar rotas no backend para autenticar com cada plataforma:

#### `/api/integrations/kiwify/auth`

```javascript
const axios = require('axios');

async function authenticateKiwify(client_id, client_secret) {
  try {
    const response = await axios.post('https://api.kiwify.com.br/oauth/token', {
      client_id,
      client_secret,
      grant_type: 'client_credentials'
    });

    return {
      success: true,
      access_token: response.data.access_token,
      expires_in: response.data.expires_in
    };
  } catch (error) {
    return {
      success: false,
      message: 'Credenciais inválidas'
    };
  }
}
```

#### `/api/integrations/hotmart/auth`

```javascript
async function authenticateHotmart(client_id, client_secret, basic_token) {
  try {
    const response = await axios.post(
      'https://api-sec-vlc.hotmart.com/security/oauth/token',
      {
        grant_type: 'client_credentials',
        client_id,
        client_secret
      },
      {
        headers: {
          'Authorization': `Basic ${basic_token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      success: true,
      access_token: response.data.access_token,
      expires_in: response.data.expires_in
    };
  } catch (error) {
    return {
      success: false,
      message: 'Credenciais inválidas'
    };
  }
}
```

#### `/api/integrations/stripe/auth`

```javascript
const stripe = require('stripe');

async function authenticateStripe(secret_key) {
  try {
    const stripeClient = stripe(secret_key);

    // Testar a chave fazendo uma requisição simples
    await stripeClient.balance.retrieve();

    return {
      success: true,
      message: 'Chave válida'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Secret key inválida'
    };
  }
}
```

### 3. Implementar Webhooks

Criar rotas para receber notificações:

```javascript
// /api/webhooks/kiwify
app.post('/api/webhooks/kiwify', async (req, res) => {
  const event = req.body;

  // Processar evento
  switch (event.type) {
    case 'purchase':
      await handleKiwifyPurchase(event.data);
      break;
    case 'refund':
      await handleKiwifyRefund(event.data);
      break;
  }

  res.status(200).send('OK');
});

// /api/webhooks/hotmart
app.post('/api/webhooks/hotmart', async (req, res) => {
  const event = req.body;

  switch (event.event) {
    case 'PURCHASE_COMPLETE':
      await handleHotmartPurchase(event.data);
      break;
    case 'PURCHASE_REFUNDED':
      await handleHotmartRefund(event.data);
      break;
  }

  res.status(200).send('OK');
});

// /api/webhooks/stripe
app.post('/api/webhooks/stripe', async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case 'charge.succeeded':
        await handleStripePayment(event.data.object);
        break;
      case 'charge.refunded':
        await handleStripeRefund(event.data.object);
        break;
    }

    res.status(200).send('OK');
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});
```

---

## 📊 Resumo Comparativo

| Plataforma | Credenciais | OAuth | Webhooks | Documentação |
|------------|-------------|-------|----------|--------------|
| **Kiwify** | client_id, client_secret, account_id | ✅ OAuth 2.0 | ✅ Sim | [docs.kiwify.com.br](https://docs.kiwify.com.br/) |
| **Hotmart** | client_id, client_secret, basic_token | ✅ OAuth 2.0 | ✅ Postback | [developers.hotmart.com](https://developers.hotmart.com/docs/en/start/app-auth/) |
| **Stripe** | secret_key, webhook_secret | ❌ Bearer Token | ✅ Webhooks | [docs.stripe.com/keys](https://docs.stripe.com/keys) |

---

## 🔐 Melhores Práticas de Segurança

1. **Nunca expor credenciais no frontend**
   - Apenas secret_key/client_secret no backend
   - Usar variáveis de ambiente

2. **Usar HTTPS**
   - Webhooks devem usar HTTPS obrigatoriamente

3. **Validar webhooks**
   - Verificar assinaturas dos webhooks
   - Stripe: stripe-signature header
   - Kiwify/Hotmart: validar origem

4. **Rotacionar credenciais periodicamente**
   - Especialmente se houver suspeita de vazamento

5. **Usar modo de teste durante desenvolvimento**
   - Stripe: sk_test_
   - Nunca usar credenciais de produção em dev

6. **Implementar rate limiting**
   - Limitar tentativas de autenticação
   - Prevenir ataques de força bruta

---

## 📝 Checklist de Implementação

### Frontend

- [ ] Atualizar campos das integrações no AppContext.jsx
- [ ] Ajustar validação de formulários
- [ ] Atualizar instruções de conexão
- [ ] Testar fluxo de autenticação na UI

### Backend

- [ ] Criar rotas de autenticação para cada plataforma
- [ ] Implementar validação de credenciais
- [ ] Configurar webhooks endpoints
- [ ] Implementar processamento de eventos
- [ ] Adicionar logs de auditoria
- [ ] Configurar variáveis de ambiente

### Segurança

- [ ] Implementar HTTPS
- [ ] Validar assinaturas de webhooks
- [ ] Adicionar rate limiting
- [ ] Configurar CORS adequadamente
- [ ] Implementar rotação de tokens
- [ ] Adicionar monitoramento de falhas

### Testes

- [ ] Testar autenticação com cada plataforma
- [ ] Testar webhooks com eventos reais
- [ ] Testar fluxo completo de sincronização
- [ ] Testar tratamento de erros
- [ ] Verificar performance

---

**Documentado por:** Claude Sonnet 4.5
**Data:** 2026-02-25
**Versão:** 1.0

---

## Sources

- [Informações Gerais - Kiwify API](https://docs.kiwify.com.br/)
- [Como realizar a integração com a Kiwify - API](https://suporte.notazz.com/como-realizar-a-integracao-com-a-kiwify-api/)
- [Authentication - Hotmart Developers](https://developers.hotmart.com/docs/en/start/app-auth/)
- [Hotmart - Documentação em Português](https://developers.hotmart.com/docs/pt-BR/start/app-auth/)
- [API keys | Stripe Documentation](https://docs.stripe.com/keys)
- [Best practices for managing secret API keys](https://docs.stripe.com/keys-best-practices)
- [What are Stripe API keys and how to find them](https://support.stripe.com/questions/what-are-stripe-api-keys-and-how-to-find-them)
