# API REST - Documentação Completa

**Versão:** 1.0.0
**Base URL:** `http://localhost:5000/api`
**Autenticação:** JWT Bearer Token

---

## 📋 Índice

1. [Autenticação](#autenticação) (5 endpoints)
2. [Integrações](#integrações) (5 endpoints)
3. [Webhooks](#webhooks) (3 endpoints)
4. [Clientes](#clientes) (2 endpoints)
5. [Produtos](#produtos) (1 endpoint)
6. [Vendas](#vendas) (2 endpoints)
7. [Health Check](#health-check) (1 endpoint)

**Total:** 19 endpoints

---

## 🔐 Autenticação

Todos os endpoints protegidos requerem um token JWT no header:

```http
Authorization: Bearer <token>
```

O token é retornado nos endpoints de `login` e `register`.

---

## 1. Autenticação

### 1.1. Registrar Usuário

**`POST /api/auth/register`**

Cria uma nova conta de usuário.

**Request Body:**
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "password": "senha123",
  "role": "user"  // opcional: "user" | "manager" | "admin"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "nome": "João Silva",
    "email": "joao@email.com",
    "role": "user",
    "createdAt": "2026-02-25T12:00:00.000Z"
  }
}
```

**Erros:**
- `400` - Email já cadastrado
- `400` - Dados inválidos (validação)

---

### 1.2. Login

**`POST /api/auth/login`**

Autentica um usuário existente.

**Request Body:**
```json
{
  "email": "joao@email.com",
  "password": "senha123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "nome": "João Silva",
    "email": "joao@email.com",
    "role": "user"
  }
}
```

**Erros:**
- `401` - Credenciais inválidas
- `400` - Email ou senha não fornecidos

---

### 1.3. Logout

**`POST /api/auth/logout`** 🔒

Invalida o token atual (blacklist).

**Headers:**
```http
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Logout realizado com sucesso"
}
```

**Erros:**
- `401` - Token inválido ou expirado

---

### 1.4. Obter Usuário Atual

**`GET /api/auth/me`** 🔒

Retorna os dados do usuário autenticado.

**Headers:**
```http
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "nome": "João Silva",
    "email": "joao@email.com",
    "role": "user",
    "createdAt": "2026-02-25T12:00:00.000Z",
    "updatedAt": "2026-02-25T12:00:00.000Z"
  }
}
```

**Erros:**
- `401` - Token inválido ou expirado
- `404` - Usuário não encontrado

---

### 1.5. Atualizar Perfil

**`PUT /api/auth/me`** 🔒

Atualiza os dados do usuário autenticado.

**Headers:**
```http
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "nome": "João Pedro Silva",
  "email": "joao.pedro@email.com"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "nome": "João Pedro Silva",
    "email": "joao.pedro@email.com",
    "role": "user",
    "updatedAt": "2026-02-25T13:00:00.000Z"
  }
}
```

**Erros:**
- `401` - Token inválido
- `400` - Email já em uso por outro usuário
- `400` - Dados inválidos

---

## 2. Integrações

Todos os endpoints de integrações são protegidos (🔒).

### 2.1. Listar Integrações

**`GET /api/integrations`** 🔒

Retorna todas as integrações do usuário autenticado.

**Headers:**
```http
Authorization: Bearer <token>
```

**Query Parameters:**
```
?platform=kiwify     # Filtrar por plataforma
?status=connected    # Filtrar por status: connected | disconnected | error
?page=1              # Paginação (padrão: 1)
?limit=10            # Itens por página (padrão: 10)
```

**Response:** `200 OK`
```json
{
  "success": true,
  "count": 2,
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "pages": 1
  },
  "data": [
    {
      "id": "507f1f77bcf86cd799439012",
      "platform": "kiwify",
      "status": "connected",
      "credentials": {
        "apiKey": "kw_***************xyz" // masked
      },
      "lastSync": "2026-02-25T12:30:00.000Z",
      "createdAt": "2026-02-20T10:00:00.000Z",
      "updatedAt": "2026-02-25T12:30:00.000Z"
    },
    {
      "id": "507f1f77bcf86cd799439013",
      "platform": "hotmart",
      "status": "connected",
      "credentials": {
        "clientId": "hm_***************abc",
        "clientSecret": "***************"
      },
      "lastSync": "2026-02-25T11:00:00.000Z",
      "createdAt": "2026-02-18T14:00:00.000Z",
      "updatedAt": "2026-02-25T11:00:00.000Z"
    }
  ]
}
```

**Erros:**
- `401` - Token inválido

---

### 2.2. Obter Integração Específica

**`GET /api/integrations/:id`** 🔒

Retorna detalhes de uma integração específica.

**Headers:**
```http
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "platform": "kiwify",
    "status": "connected",
    "credentials": {
      "apiKey": "kw_***************xyz"
    },
    "settings": {
      "autoSync": true,
      "syncInterval": 3600000,
      "webhookUrl": "https://api.plataforma.com/webhooks/kiwify"
    },
    "stats": {
      "totalCustomers": 150,
      "totalSales": 45000.00,
      "lastSyncDuration": 2345
    },
    "lastSync": "2026-02-25T12:30:00.000Z",
    "createdAt": "2026-02-20T10:00:00.000Z",
    "updatedAt": "2026-02-25T12:30:00.000Z"
  }
}
```

**Erros:**
- `401` - Token inválido
- `404` - Integração não encontrada
- `403` - Integração pertence a outro usuário

---

### 2.3. Criar Integração

**`POST /api/integrations`** 🔒

Cria uma nova integração com uma plataforma de pagamento.

**Headers:**
```http
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "platform": "kiwify",  // "kiwify" | "hotmart" | "stripe"
  "credentials": {
    "apiKey": "kw_1234567890abcdefghijklmnopqrstuvwxyz"
  },
  "settings": {
    "autoSync": true,
    "syncInterval": 3600000  // em ms (1 hora)
  }
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439014",
    "platform": "kiwify",
    "status": "connected",
    "credentials": {
      "apiKey": "kw_***************xyz"
    },
    "settings": {
      "autoSync": true,
      "syncInterval": 3600000
    },
    "createdAt": "2026-02-25T14:00:00.000Z",
    "updatedAt": "2026-02-25T14:00:00.000Z"
  }
}
```

**Erros:**
- `401` - Token inválido
- `400` - Credenciais inválidas ou incompletas
- `400` - Integração já existe para esta plataforma
- `503` - Falha ao conectar com a plataforma

---

### 2.4. Atualizar Integração

**`PUT /api/integrations/:id`** 🔒

Atualiza uma integração existente.

**Headers:**
```http
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "credentials": {
    "apiKey": "kw_nova_chave_api_aqui"
  },
  "settings": {
    "autoSync": false,
    "syncInterval": 7200000
  },
  "status": "connected"  // "connected" | "disconnected" | "error"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "platform": "kiwify",
    "status": "connected",
    "credentials": {
      "apiKey": "kw_***************new"
    },
    "settings": {
      "autoSync": false,
      "syncInterval": 7200000
    },
    "updatedAt": "2026-02-25T15:00:00.000Z"
  }
}
```

**Erros:**
- `401` - Token inválido
- `404` - Integração não encontrada
- `403` - Integração pertence a outro usuário
- `400` - Dados inválidos

---

### 2.5. Deletar Integração

**`DELETE /api/integrations/:id`** 🔒

Remove uma integração permanentemente.

**Headers:**
```http
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Integração removida com sucesso"
}
```

**Erros:**
- `401` - Token inválido
- `404` - Integração não encontrada
- `403` - Integração pertence a outro usuário

---

## 3. Webhooks

Endpoints públicos para receber eventos das plataformas de pagamento.

**⚠️ Atenção:** Webhooks são validados por assinatura criptográfica.

### 3.1. Webhook Kiwify

**`POST /api/webhooks/kiwify`**

Recebe eventos da Kiwify (vendas, reembolsos, etc.).

**Headers:**
```http
X-Kiwify-Signature: sha256=abc123...
Content-Type: application/json
```

**Request Body:**
```json
{
  "event": "sale.approved",
  "data": {
    "order_id": "KW-12345",
    "customer": {
      "name": "Maria Santos",
      "email": "maria@email.com",
      "cpf": "123.456.789-00",
      "phone": "+5511987654321"
    },
    "product": {
      "id": "prod_123",
      "name": "Super Links",
      "price": 97.00
    },
    "payment": {
      "type": "vitalicia",
      "status": "approved",
      "paid_at": "2026-02-25T14:30:00Z"
    }
  }
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Webhook processado com sucesso"
}
```

**Eventos suportados:**
- `sale.approved` - Venda aprovada
- `sale.refunded` - Venda reembolsada
- `sale.cancelled` - Venda cancelada
- `subscription.created` - Assinatura criada
- `subscription.cancelled` - Assinatura cancelada

**Erros:**
- `400` - Assinatura inválida
- `400` - Dados inválidos
- `404` - Integração não encontrada

---

### 3.2. Webhook Hotmart

**`POST /api/webhooks/hotmart`**

Recebe eventos da Hotmart.

**Headers:**
```http
X-Hotmart-Hottok: your-hot-token-here
Content-Type: application/json
```

**Request Body:**
```json
{
  "event": "PURCHASE_COMPLETE",
  "data": {
    "purchase": {
      "order_id": "HM-98765",
      "buyer": {
        "name": "Carlos Lima",
        "email": "carlos@email.com",
        "cpf": "987.654.321-00",
        "phone": "+5521999888777"
      },
      "product": {
        "id": 123456,
        "name": "Mentoria Elite",
        "price": 497.00
      },
      "payment": {
        "type": "CREDIT_CARD",
        "status": "approved",
        "recurrence": "MONTHLY"
      }
    }
  }
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Webhook processado com sucesso"
}
```

**Eventos suportados:**
- `PURCHASE_COMPLETE` - Compra finalizada
- `PURCHASE_REFUNDED` - Compra reembolsada
- `PURCHASE_CANCELLED` - Compra cancelada
- `SUBSCRIPTION_CANCELLATION` - Assinatura cancelada

**Erros:**
- `400` - Token inválido
- `400` - Dados inválidos
- `404` - Integração não encontrada

---

### 3.3. Webhook Stripe

**`POST /api/webhooks/stripe`**

Recebe eventos do Stripe.

**Headers:**
```http
Stripe-Signature: t=1234567890,v1=abc123...
Content-Type: application/json
```

**Request Body:**
```json
{
  "type": "charge.succeeded",
  "data": {
    "object": {
      "id": "ch_1234567890",
      "amount": 49700,
      "currency": "brl",
      "customer": {
        "id": "cus_ABC123",
        "name": "Ana Costa",
        "email": "ana@email.com"
      },
      "metadata": {
        "product_name": "Pack Completo",
        "payment_type": "anual"
      }
    }
  }
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Webhook processado com sucesso"
}
```

**Eventos suportados:**
- `charge.succeeded` - Pagamento bem-sucedido
- `charge.refunded` - Pagamento reembolsado
- `customer.subscription.created` - Assinatura criada
- `customer.subscription.deleted` - Assinatura cancelada

**Erros:**
- `400` - Assinatura inválida
- `400` - Dados inválidos
- `404` - Integração não encontrada

---

## 4. Clientes

Todos os endpoints de clientes são protegidos (🔒).

### 4.1. Listar Clientes

**`GET /api/customers`** 🔒

Retorna todos os clientes sincronizados das integrações.

**Headers:**
```http
Authorization: Bearer <token>
```

**Query Parameters:**
```
?integrationId=507f...  # Filtrar por integração
?tags=Super Links       # Filtrar por tag
?search=maria           # Buscar por nome/email
?page=1                 # Paginação
?limit=50               # Itens por página
```

**Response:** `200 OK`
```json
{
  "success": true,
  "count": 150,
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 150,
    "pages": 3
  },
  "data": [
    {
      "id": "507f1f77bcf86cd799439015",
      "integrationId": "507f1f77bcf86cd799439012",
      "integration": {
        "platform": "kiwify",
        "name": "Kiwify Integration"
      },
      "nome": "Maria Santos",
      "email": "maria@email.com",
      "cpf": "123.456.789-00",
      "telefone": "+5511987654321",
      "tags": ["Super Links", "VIP"],
      "totalPurchases": 197.00,
      "purchasesCount": 2,
      "lastPurchaseAt": "2026-02-25T14:30:00.000Z",
      "createdAt": "2026-02-20T10:00:00.000Z",
      "updatedAt": "2026-02-25T14:30:00.000Z"
    }
  ]
}
```

**Erros:**
- `401` - Token inválido

---

### 4.2. Obter Cliente Específico

**`GET /api/customers/:id`** 🔒

Retorna detalhes completos de um cliente.

**Headers:**
```http
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439015",
    "integrationId": "507f1f77bcf86cd799439012",
    "integration": {
      "platform": "kiwify",
      "name": "Kiwify Integration"
    },
    "nome": "Maria Santos",
    "email": "maria@email.com",
    "cpf": "123.456.789-00",
    "telefone": "+5511987654321",
    "tags": ["Super Links", "VIP"],
    "totalPurchases": 197.00,
    "purchasesCount": 2,
    "lastPurchaseAt": "2026-02-25T14:30:00.000Z",
    "purchases": [
      {
        "id": "507f1f77bcf86cd799439020",
        "productName": "Super Links",
        "amount": 97.00,
        "type": "vitalicia",
        "status": "approved",
        "purchasedAt": "2026-02-20T10:30:00.000Z"
      },
      {
        "id": "507f1f77bcf86cd799439021",
        "productName": "Super Presell",
        "amount": 147.00,
        "type": "vitalicia",
        "status": "approved",
        "purchasedAt": "2026-02-25T14:30:00.000Z"
      }
    ],
    "createdAt": "2026-02-20T10:00:00.000Z",
    "updatedAt": "2026-02-25T14:30:00.000Z"
  }
}
```

**Erros:**
- `401` - Token inválido
- `404` - Cliente não encontrado
- `403` - Cliente pertence a outro usuário

---

## 5. Produtos

### 5.1. Listar Produtos

**`GET /api/products`** 🔒

Retorna todos os produtos das integrações.

**Headers:**
```http
Authorization: Bearer <token>
```

**Query Parameters:**
```
?integrationId=507f...  # Filtrar por integração
?active=true            # Filtrar por status ativo
?page=1                 # Paginação
?limit=50               # Itens por página
```

**Response:** `200 OK`
```json
{
  "success": true,
  "count": 12,
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 12,
    "pages": 1
  },
  "data": [
    {
      "id": "507f1f77bcf86cd799439030",
      "integrationId": "507f1f77bcf86cd799439012",
      "integration": {
        "platform": "kiwify"
      },
      "externalId": "prod_123",
      "name": "Super Links",
      "description": "Plataforma de links inteligentes",
      "price": 97.00,
      "currency": "BRL",
      "type": "vitalicia",
      "active": true,
      "salesCount": 45,
      "revenue": 4365.00,
      "createdAt": "2026-02-15T10:00:00.000Z",
      "updatedAt": "2026-02-25T14:00:00.000Z"
    }
  ]
}
```

**Erros:**
- `401` - Token inválido

---

## 6. Vendas

Todos os endpoints de vendas são protegidos (🔒).

### 6.1. Listar Vendas

**`GET /api/sales`** 🔒

Retorna todas as vendas das integrações.

**Headers:**
```http
Authorization: Bearer <token>
```

**Query Parameters:**
```
?integrationId=507f...    # Filtrar por integração
?customerId=507f...       # Filtrar por cliente
?productId=507f...        # Filtrar por produto
?status=approved          # Filtrar por status
?refunded=false           # Apenas não reembolsadas
?startDate=2026-02-01     # Data inicial
?endDate=2026-02-28       # Data final
?page=1                   # Paginação
?limit=50                 # Itens por página
```

**Response:** `200 OK`
```json
{
  "success": true,
  "count": 243,
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 243,
    "pages": 5
  },
  "data": [
    {
      "id": "507f1f77bcf86cd799439040",
      "integrationId": "507f1f77bcf86cd799439012",
      "customerId": "507f1f77bcf86cd799439015",
      "productId": "507f1f77bcf86cd799439030",
      "customer": {
        "nome": "Maria Santos",
        "email": "maria@email.com"
      },
      "product": {
        "name": "Super Links",
        "price": 97.00
      },
      "valor": 97.00,
      "currency": "BRL",
      "tipoPagamento": "vitalicia",
      "status": "approved",
      "reembolsado": false,
      "refundedAt": null,
      "orderId": "KW-12345",
      "purchasedAt": "2026-02-25T14:30:00.000Z",
      "createdAt": "2026-02-25T14:31:00.000Z",
      "updatedAt": "2026-02-25T14:31:00.000Z"
    }
  ]
}
```

**Erros:**
- `401` - Token inválido

---

### 6.2. Estatísticas de Vendas

**`GET /api/sales/stats`** 🔒

Retorna estatísticas agregadas de vendas.

**Headers:**
```http
Authorization: Bearer <token>
```

**Query Parameters:**
```
?integrationId=507f...    # Filtrar por integração
?startDate=2026-02-01     # Data inicial
?endDate=2026-02-28       # Data final
?groupBy=day              # Agrupar por: day | week | month
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalSales": 243,
      "totalRevenue": 45678.00,
      "totalRefunds": 12,
      "totalRefundAmount": 1844.00,
      "netRevenue": 43834.00,
      "averageTicket": 187.90,
      "conversionRate": 12.5
    },
    "byType": {
      "vitalicia": {
        "count": 180,
        "revenue": 32100.00
      },
      "mensal": {
        "count": 45,
        "revenue": 10080.00
      },
      "anual": {
        "count": 18,
        "revenue": 3498.00
      }
    },
    "byProduct": [
      {
        "productId": "507f1f77bcf86cd799439030",
        "productName": "Super Links",
        "count": 120,
        "revenue": 11640.00
      },
      {
        "productId": "507f1f77bcf86cd799439031",
        "productName": "Mentoria Elite",
        "count": 78,
        "revenue": 38766.00
      }
    ],
    "timeline": [
      {
        "date": "2026-02-25",
        "sales": 15,
        "revenue": 2456.00,
        "refunds": 1,
        "refundAmount": 97.00
      }
    ]
  }
}
```

**Erros:**
- `401` - Token inválido

---

## 7. Health Check

### 7.1. Verificar Status da API

**`GET /health`**

Verifica se a API está online e operacional.

**Response:** `200 OK`
```json
{
  "status": "ok",
  "timestamp": "2026-02-25T15:00:00.000Z",
  "environment": "production"
}
```

---

## 🔒 Autenticação e Segurança

### JWT Token

O token JWT é retornado nos endpoints de `login` e `register` e deve ser incluído em todas as requisições protegidas:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Expiração

- **Access Token:** 7 dias (configurável via `JWT_EXPIRE`)
- **Refresh Token:** Não implementado ainda

### Rate Limiting

A API implementa rate limiting para prevenir abuso:

- **Limite:** 100 requisições por 15 minutos por IP
- **Header de resposta:** `X-RateLimit-Remaining`, `X-RateLimit-Reset`

**Response quando limite excedido:** `429 Too Many Requests`
```json
{
  "success": false,
  "message": "Muitas requisições deste IP, tente novamente mais tarde."
}
```

---

## 📊 Paginação

Endpoints de listagem suportam paginação via query parameters:

```
?page=1       # Página atual (padrão: 1)
?limit=10     # Itens por página (padrão: 10, máximo: 100)
```

**Resposta com paginação:**
```json
{
  "success": true,
  "count": 50,
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 243,
    "pages": 25
  },
  "data": [...]
}
```

---

## ❌ Tratamento de Erros

Todos os erros seguem o formato padrão:

```json
{
  "success": false,
  "message": "Mensagem de erro descritiva",
  "error": "CODIGO_ERRO"
}
```

### Códigos de Status HTTP

| Código | Significado |
|--------|-------------|
| `200` | Sucesso |
| `201` | Criado com sucesso |
| `400` | Requisição inválida |
| `401` | Não autenticado |
| `403` | Não autorizado (sem permissão) |
| `404` | Recurso não encontrado |
| `409` | Conflito (recurso já existe) |
| `429` | Limite de requisições excedido |
| `500` | Erro interno do servidor |
| `503` | Serviço indisponível |

---

## 🔧 Variáveis de Ambiente

Configure as seguintes variáveis no arquivo `.env`:

```env
# Servidor
NODE_ENV=production
PORT=5000
FRONTEND_URL=http://localhost:5173

# Banco de Dados
MONGO_URI=mongodb://localhost:27017/plataforma

# JWT
JWT_SECRET=seu_secret_super_seguro_aqui
JWT_EXPIRE=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Webhooks (validação de assinatura)
KIWIFY_WEBHOOK_SECRET=seu_secret_kiwify
HOTMART_HOT_TOKEN=seu_hot_token_hotmart
STRIPE_WEBHOOK_SECRET=whsec_seu_secret_stripe
```

---

## 📚 Exemplos de Uso

### Exemplo 1: Autenticação e Obter Perfil

```bash
# 1. Fazer login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "password": "senha123"
  }'

# Response: { "success": true, "token": "eyJ...", "user": {...} }

# 2. Usar token para obter perfil
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer eyJ..."

# Response: { "success": true, "user": {...} }
```

### Exemplo 2: Criar Integração com Kiwify

```bash
curl -X POST http://localhost:5000/api/integrations \
  -H "Authorization: Bearer eyJ..." \
  -H "Content-Type: application/json" \
  -d '{
    "platform": "kiwify",
    "credentials": {
      "apiKey": "kw_1234567890abcdefghijklmnopqrstuvwxyz"
    },
    "settings": {
      "autoSync": true,
      "syncInterval": 3600000
    }
  }'

# Response: { "success": true, "data": {...} }
```

### Exemplo 3: Listar Vendas do Último Mês

```bash
curl -X GET "http://localhost:5000/api/sales?startDate=2026-02-01&endDate=2026-02-28&limit=50" \
  -H "Authorization: Bearer eyJ..."

# Response: { "success": true, "count": 243, "data": [...] }
```

### Exemplo 4: Obter Estatísticas de Vendas

```bash
curl -X GET "http://localhost:5000/api/sales/stats?groupBy=day" \
  -H "Authorization: Bearer eyJ..."

# Response: { "success": true, "data": { "summary": {...}, "timeline": [...] } }
```

---

## 🧪 Testes

Para testar a API, recomendamos:

1. **Postman** - Coleção disponível em `backend/docs/Postman_Collection.json`
2. **Insomnia** - Workspace disponível em `backend/docs/Insomnia_Workspace.json`
3. **curl** - Exemplos nesta documentação
4. **Jest** - Testes automatizados (ver `backend/tests/`)

---

## 📞 Suporte

Para dúvidas ou problemas com a API:

- **Documentação técnica:** `backend/README.md`
- **Schemas do banco:** `backend/docs/DATABASE-SCHEMAS.md`
- **Webhooks:** `backend/docs/WEBHOOKS-GUIDE.md`

---

**Documentado por:** Claude Sonnet 4.5
**Data:** 2026-02-25
**Versão da API:** 1.0.0
