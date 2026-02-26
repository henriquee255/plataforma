# 🚀 Backend - Plataforma CRM

> API REST completa para gerenciar integrações com Kiwify, Hotmart e Stripe

---

## 📋 Índice

- [Instalação](#instalação)
- [Configuração](#configuração)
- [Executar](#executar)
- [API Endpoints](#api-endpoints)
- [Webhooks](#webhooks)
- [Autenticação](#autenticação)
- [Models](#models)
- [Testes](#testes)

---

## 🔧 Instalação

### **Pré-requisitos:**
- Node.js 18+ instalado
- MongoDB rodando (local ou remoto)
- Git

### **Passo a Passo:**

```bash
# 1. Navegar até a pasta do backend
cd backend/

# 2. Instalar dependências
npm install

# 3. Copiar arquivo de exemplo e configurar
cp .env.example .env

# 4. Editar .env com suas configurações
# (ver seção Configuração abaixo)

# 5. Iniciar servidor em modo desenvolvimento
npm run dev
```

---

## ⚙️ Configuração

Edite o arquivo `.env` com suas configurações:

```env
# Servidor
NODE_ENV=development
PORT=5000

# Frontend
FRONTEND_URL=http://localhost:5173

# MongoDB
MONGODB_URI=mongodb://localhost:27017/plataforma-crm

# JWT
JWT_SECRET=seu_jwt_secret_aqui_mude_em_producao
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# Kiwify (opcional no início)
KIWIFY_API_KEY=sua_api_key_kiwify
KIWIFY_API_SECRET=seu_secret_kiwify

# Hotmart (opcional no início)
HOTMART_CLIENT_ID=seu_client_id
HOTMART_CLIENT_SECRET=seu_client_secret

# Stripe (opcional no início)
STRIPE_SECRET_KEY=sk_test_...
```

---

## 🚀 Executar

### **Desenvolvimento:**
```bash
npm run dev
```
Servidor rodará em `http://localhost:5000` com reload automático.

### **Produção:**
```bash
npm start
```

### **Health Check:**
```bash
curl http://localhost:5000/health
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "timestamp": "2026-02-25T10:30:00.000Z",
  "environment": "development"
}
```

---

## 📡 API Endpoints

### **Base URL:** `http://localhost:5000/api`

---

### 🔐 **Autenticação** (`/api/auth`)

#### **1. Registrar Usuário**
```http
POST /api/auth/register
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@email.com",
  "password": "senha123",
  "role": "user"
}
```

**Resposta (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1...",
  "user": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "nome": "João Silva",
    "email": "joao@email.com",
    "role": "user"
  }
}
```

#### **2. Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "joao@email.com",
  "password": "senha123"
}
```

**Resposta (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1...",
  "user": { ... }
}
```

#### **3. Obter Usuário Atual**
```http
GET /api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1...
```

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "nome": "João Silva",
    "email": "joao@email.com",
    "role": "user",
    "createdAt": "2026-02-25T10:00:00.000Z"
  }
}
```

---

### 🔗 **Integrações** (`/api/integrations`)

Todas as rotas requerem autenticação (`Authorization: Bearer <token>`).

#### **1. Listar Integrações**
```http
GET /api/integrations
Authorization: Bearer <token>
```

#### **2. Criar Integração**
```http
POST /api/integrations
Authorization: Bearer <token>
Content-Type: application/json

{
  "platform": "kiwify",
  "status": "active",
  "credentials": {
    "apiKey": "sua_api_key",
    "apiSecret": "seu_secret"
  }
}
```

#### **3. Atualizar Integração**
```http
PUT /api/integrations/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "connected"
}
```

#### **4. Deletar Integração**
```http
DELETE /api/integrations/:id
Authorization: Bearer <token>
```

---

### 👥 **Clientes** (`/api/customers`)

#### **1. Listar Clientes**
```http
GET /api/customers?integrationId=65f1a2b3c4d5e6f7g8h9i0j1
Authorization: Bearer <token>
```

**Resposta:**
```json
{
  "success": true,
  "count": 8,
  "data": [
    {
      "_id": "...",
      "nome": "João Pedro Silva",
      "email": "joao.pedro@email.com",
      "cpf": "123.456.789-00",
      "telefone": "+55 (11) 98765-4321",
      "tags": ["Super Links"]
    }
  ]
}
```

---

### 📊 **Vendas** (`/api/sales`)

#### **1. Listar Vendas**
```http
GET /api/sales?integrationId=xxx&status=approved
Authorization: Bearer <token>
```

#### **2. Estatísticas**
```http
GET /api/sales/stats?integrationId=xxx
Authorization: Bearer <token>
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "totalVendas": 3476.00,
    "totalVendasCount": 8,
    "totalReembolsos": 594.00,
    "totalReembolsosCount": 2,
    "porTipo": [
      { "_id": "vitalicia", "total": 2000, "count": 4 },
      { "_id": "mensal", "total": 1000, "count": 2 }
    ]
  }
}
```

---

## 🔔 Webhooks

### **URLs dos Webhooks:**

```
Kiwify:  https://seu-dominio.com/api/webhooks/kiwify
Hotmart: https://seu-dominio.com/api/webhooks/hotmart
Stripe:  https://seu-dominio.com/api/webhooks/stripe
```

### **Kiwify Webhook - Exemplo de Payload:**

```json
{
  "event": "sale.approved",
  "data": {
    "customer": {
      "id": "cust_123",
      "name": "João Silva",
      "email": "joao@email.com",
      "cpf": "123.456.789-00",
      "phone": "+55 11 98765-4321"
    },
    "product": {
      "id": "prod_456",
      "name": "Super Links",
      "price": 97.00
    },
    "sale": {
      "id": "sale_789",
      "status": "approved",
      "type": "vitalicia",
      "created_at": "2026-02-25T10:30:00Z"
    }
  }
}
```

### **O que o webhook faz:**

1. ✅ Cria/atualiza cliente
2. ✅ Adiciona tag automática do produto
3. ✅ Cria/atualiza produto
4. ✅ Registra venda
5. ✅ Processa reembolso (se aplicável)

---

## 🗄️ Models

### **User**
```javascript
{
  nome: String,
  email: String (unique),
  password: String (hashed),
  role: 'user' | 'manager' | 'admin',
  telefone: String,
  empresa: String
}
```

### **Integration**
```javascript
{
  userId: ObjectId,
  platform: 'kiwify' | 'hotmart' | 'stripe',
  status: 'active' | 'inactive' | 'connected',
  credentials: { apiKey, apiSecret, ... },
  lastSync: Date
}
```

### **Customer**
```javascript
{
  integrationId: ObjectId,
  nome: String,
  email: String,
  cpf: String,
  telefone: String,
  tags: [String]
}
```

### **Sale**
```javascript
{
  integrationId: ObjectId,
  customerId: ObjectId,
  productId: ObjectId,
  valor: Number,
  tipoPagamento: 'vitalicia' | 'mensal' | 'anual',
  status: 'approved' | 'refunded',
  dataCompra: Date,
  reembolsado: Boolean
}
```

---

## 🧪 Testes

```bash
# Rodar todos os testes
npm test

# Rodar com coverage
npm run test:coverage
```

---

## 📚 Documentação Completa

Ver pasta `docs/backend/` para documentação detalhada:
- `00-ARQUITETURA.md` - Arquitetura completa
- `01-INSTALACAO.md` - Guia de instalação
- `02-API-REFERENCE.md` - Referência completa da API

---

## 🔐 Segurança

- ✅ Senhas hasheadas com bcrypt (10 rounds)
- ✅ JWT com expiração configurável
- ✅ Helmet para headers seguros
- ✅ CORS configurado
- ✅ Rate limiting (100 req/15min)
- ✅ Validação de input com express-validator
- ✅ MongoDB injection protection

---

## 🐛 Troubleshooting

### **Erro: "Cannot connect to MongoDB"**
```bash
# Verificar se MongoDB está rodando
sudo systemctl status mongod

# Ou iniciar MongoDB
sudo systemctl start mongod
```

### **Erro: "Port 5000 already in use"**
Alterar porta no `.env`:
```env
PORT=5001
```

---

## 📝 TODO

- [ ] Implementar cache com Redis
- [ ] Adicionar logs com Winston
- [ ] Implementar fila de jobs
- [ ] Documentação Swagger/OpenAPI
- [ ] CI/CD com GitHub Actions

---

## 👨‍💻 Autor

**Henrique de Oliveira**  
Desenvolvido com ❤️ usando Node.js, Express e MongoDB

---

## 📄 Licença

MIT License - Copyright (c) 2026
