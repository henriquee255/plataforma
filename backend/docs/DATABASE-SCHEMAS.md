# MongoDB - Schemas e Relacionamentos

**Banco de Dados:** plataforma
**ODM:** Mongoose 8.x
**Total de Collections:** 5

---

## 📋 Índice

1. [User](#1-user) - Usuários e autenticação
2. [Integration](#2-integration) - Integrações com plataformas
3. [Customer](#3-customer) - Clientes das integrações
4. [Product](#4-product) - Produtos vendidos
5. [Sale](#5-sale) - Vendas realizadas
6. [Relacionamentos](#6-relacionamentos)
7. [Índices e Performance](#7-índices-e-performance)

---

## 1. User

**Collection:** `users`
**Propósito:** Armazenar dados de usuários e autenticação.

### Schema

```javascript
{
  _id: ObjectId,
  nome: String,           // required, max 100 chars
  email: String,          // required, unique, lowercase, validated
  password: String,       // required, min 6 chars, hashed (select: false)
  role: String,           // enum: ['user', 'manager', 'admin'], default: 'user'
  avatar: String,         // URL do avatar (nullable)
  telefone: String,       // Telefone do usuário (nullable)
  empresa: String,        // Nome da empresa (nullable)
  isActive: Boolean,      // Usuário ativo, default: true
  resetPasswordToken: String,    // Token para reset de senha (nullable)
  resetPasswordExpire: Date,     // Expiração do token (nullable)
  createdAt: Date,        // Timestamp de criação (auto)
  updatedAt: Date         // Timestamp de atualização (auto)
}
```

### Validações

| Campo | Validação | Mensagem de Erro |
|-------|-----------|------------------|
| `nome` | required, maxlength: 100 | "Por favor, insira o nome" / "Nome não pode ter mais de 100 caracteres" |
| `email` | required, unique, regex | "Por favor, insira o email" / "Por favor, insira um email válido" |
| `password` | required, minlength: 6 | "Por favor, insira a senha" / "Senha deve ter no mínimo 6 caracteres" |
| `role` | enum: ['user', 'manager', 'admin'] | Valor inválido |

### Middlewares

**Pre-save:** Encriptação de senha com bcrypt
```javascript
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
```

### Métodos de Instância

**matchPassword(enteredPassword):** Compara senha fornecida com hash
```javascript
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
```

**getSignedJwtToken():** Gera JWT token
```javascript
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};
```

### Exemplo de Documento

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "nome": "João Silva",
  "email": "joao@email.com",
  "password": "$2a$10$abcdefghijklmnopqrstuvwxyz123456",
  "role": "user",
  "avatar": "https://cdn.plataforma.com/avatars/joao.jpg",
  "telefone": "+5511987654321",
  "empresa": "Tech Solutions",
  "isActive": true,
  "resetPasswordToken": null,
  "resetPasswordExpire": null,
  "createdAt": "2026-02-20T10:00:00.000Z",
  "updatedAt": "2026-02-20T10:00:00.000Z"
}
```

### Índices

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `_id` | Primary | Índice padrão do MongoDB |
| `email` | Unique | Garante emails únicos |

---

## 2. Integration

**Collection:** `integrations`
**Propósito:** Armazenar configurações de integrações com plataformas de pagamento.

### Schema

```javascript
{
  _id: ObjectId,
  userId: ObjectId,       // ref: 'User', required
  platform: String,       // enum: ['kiwify', 'hotmart', 'stripe'], required
  status: String,         // enum: ['active', 'inactive', 'error', 'connected'], default: 'inactive'
  credentials: {
    apiKey: String,       // select: false
    apiSecret: String,    // select: false
    clientId: String,     // select: false
    clientSecret: String, // select: false
    basicToken: String,   // select: false
    webhookSecret: String
  },
  lastSync: Date,         // Última sincronização (nullable)
  syncStatus: String,     // enum: ['success', 'error', 'pending'], default: 'pending'
  syncError: String,      // Mensagem de erro da sync (nullable)
  createdAt: Date,        // Timestamp de criação (auto)
  updatedAt: Date         // Timestamp de atualização (auto)
}
```

### Validações

| Campo | Validação | Mensagem de Erro |
|-------|-----------|------------------|
| `userId` | required, ObjectId | "userId é obrigatório" |
| `platform` | required, enum: ['kiwify', 'hotmart', 'stripe'] | "Plataforma é obrigatória" |
| `status` | enum: ['active', 'inactive', 'error', 'connected'] | Valor inválido |
| `syncStatus` | enum: ['success', 'error', 'pending'] | Valor inválido |

### Campos Sensíveis (select: false)

Os seguintes campos de `credentials` são marcados como `select: false` e **NÃO são retornados** por padrão em queries:

- `apiKey`
- `apiSecret`
- `clientId`
- `clientSecret`
- `basicToken`

Para retorná-los, use: `Integration.findById(id).select('+credentials.apiKey')`

### Exemplo de Documento

```json
{
  "_id": "507f1f77bcf86cd799439012",
  "userId": "507f1f77bcf86cd799439011",
  "platform": "kiwify",
  "status": "connected",
  "credentials": {
    "apiKey": "kw_1234567890abcdefghijklmnopqrstuvwxyz",
    "webhookSecret": "whsec_kiwify_abc123"
  },
  "lastSync": "2026-02-25T12:30:00.000Z",
  "syncStatus": "success",
  "syncError": null,
  "createdAt": "2026-02-20T10:00:00.000Z",
  "updatedAt": "2026-02-25T12:30:00.000Z"
}
```

### Índices

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `_id` | Primary | Índice padrão do MongoDB |
| `userId + platform` | Compound | Busca rápida de integração por usuário e plataforma |

```javascript
IntegrationSchema.index({ userId: 1, platform: 1 });
```

---

## 3. Customer

**Collection:** `customers`
**Propósito:** Armazenar dados de clientes sincronizados das integrações.

### Schema

```javascript
{
  _id: ObjectId,
  integrationId: ObjectId, // ref: 'Integration', required
  externalId: String,      // ID do cliente na plataforma externa (nullable)
  nome: String,            // required
  email: String,           // required, lowercase
  cpf: String,             // CPF do cliente (nullable)
  telefone: String,        // Telefone do cliente (nullable)
  tags: [String],          // Tags automáticas (produtos comprados)
  createdAt: Date,         // Timestamp de criação (auto)
  updatedAt: Date          // Timestamp de atualização (auto)
}
```

### Validações

| Campo | Validação | Mensagem de Erro |
|-------|-----------|------------------|
| `integrationId` | required, ObjectId | "integrationId é obrigatório" |
| `nome` | required, trim | "Nome é obrigatório" |
| `email` | required, lowercase | "Email é obrigatório" |

### Tags Automáticas

Tags são adicionadas automaticamente quando um webhook de venda é processado:

```javascript
// Exemplo: Cliente compra "Super Links"
customer.tags.push("Super Links");

// Resultado:
tags: ["Super Links", "VIP", "Mentoria Elite"]
```

### Exemplo de Documento

```json
{
  "_id": "507f1f77bcf86cd799439015",
  "integrationId": "507f1f77bcf86cd799439012",
  "externalId": "cus_kiwify_abc123",
  "nome": "Maria Santos",
  "email": "maria@email.com",
  "cpf": "123.456.789-00",
  "telefone": "+5511987654321",
  "tags": ["Super Links", "VIP"],
  "createdAt": "2026-02-20T10:00:00.000Z",
  "updatedAt": "2026-02-25T14:30:00.000Z"
}
```

### Índices

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `_id` | Primary | Índice padrão do MongoDB |
| `integrationId + email` | Compound | Busca rápida de cliente por integração e email |
| `integrationId + cpf` | Compound | Busca rápida de cliente por integração e CPF |

```javascript
CustomerSchema.index({ integrationId: 1, email: 1 });
CustomerSchema.index({ integrationId: 1, cpf: 1 });
```

---

## 4. Product

**Collection:** `products`
**Propósito:** Armazenar produtos sincronizados das integrações.

### Schema

```javascript
{
  _id: ObjectId,
  integrationId: ObjectId, // ref: 'Integration', required
  externalId: String,      // ID do produto na plataforma externa, required
  name: String,            // required, trim
  price: Number,           // required, min: 0
  type: String,            // enum: ['vitalicia', 'mensal', 'anual'], required
  description: String,     // Descrição do produto (nullable)
  createdAt: Date,         // Timestamp de criação (auto)
  updatedAt: Date          // Timestamp de atualização (auto)
}
```

### Validações

| Campo | Validação | Mensagem de Erro |
|-------|-----------|------------------|
| `integrationId` | required, ObjectId | "integrationId é obrigatório" |
| `externalId` | required | "externalId é obrigatório" |
| `name` | required, trim | "Nome do produto é obrigatório" |
| `price` | required, min: 0 | "Preço é obrigatório" / "Preço deve ser maior que 0" |
| `type` | required, enum: ['vitalicia', 'mensal', 'anual'] | "Tipo é obrigatório" / Valor inválido |

### Tipos de Pagamento

- **vitalicia:** Pagamento único, acesso vitalício
- **mensal:** Assinatura mensal recorrente
- **anual:** Assinatura anual recorrente

### Exemplo de Documento

```json
{
  "_id": "507f1f77bcf86cd799439030",
  "integrationId": "507f1f77bcf86cd799439012",
  "externalId": "prod_kiwify_123",
  "name": "Super Links",
  "price": 97.00,
  "type": "vitalicia",
  "description": "Plataforma completa de links inteligentes",
  "createdAt": "2026-02-15T10:00:00.000Z",
  "updatedAt": "2026-02-15T10:00:00.000Z"
}
```

### Índices

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `_id` | Primary | Índice padrão do MongoDB |
| `integrationId + externalId` | Compound Unique | Garante produto único por integração |

```javascript
ProductSchema.index({ integrationId: 1, externalId: 1 }, { unique: true });
```

---

## 5. Sale

**Collection:** `sales`
**Propósito:** Armazenar vendas realizadas através das integrações.

### Schema

```javascript
{
  _id: ObjectId,
  integrationId: ObjectId, // ref: 'Integration', required
  customerId: ObjectId,    // ref: 'Customer', required
  productId: ObjectId,     // ref: 'Product', required
  externalId: String,      // ID da venda na plataforma externa, required
  valor: Number,           // required, min: 0
  tipoPagamento: String,   // enum: ['vitalicia', 'mensal', 'anual'], required
  status: String,          // enum: ['approved', 'refunded', 'pending', 'cancelled'], default: 'pending'
  dataCompra: Date,        // required
  reembolsado: Boolean,    // default: false
  dataReembolso: Date,     // Data do reembolso (nullable)
  createdAt: Date,         // Timestamp de criação (auto)
  updatedAt: Date          // Timestamp de atualização (auto)
}
```

### Validações

| Campo | Validação | Mensagem de Erro |
|-------|-----------|------------------|
| `integrationId` | required, ObjectId | "integrationId é obrigatório" |
| `customerId` | required, ObjectId | "customerId é obrigatório" |
| `productId` | required, ObjectId | "productId é obrigatório" |
| `externalId` | required | "externalId é obrigatório" |
| `valor` | required, min: 0 | "Valor é obrigatório" / "Valor deve ser maior que 0" |
| `tipoPagamento` | required, enum: ['vitalicia', 'mensal', 'anual'] | "Tipo de pagamento é obrigatório" |
| `status` | enum: ['approved', 'refunded', 'pending', 'cancelled'] | Valor inválido |
| `dataCompra` | required | "Data de compra é obrigatória" |

### Status de Venda

- **pending:** Aguardando aprovação de pagamento
- **approved:** Pagamento aprovado e confirmado
- **refunded:** Venda reembolsada
- **cancelled:** Venda cancelada

### Fluxo de Reembolso

Quando uma venda é reembolsada:
```javascript
sale.status = 'refunded';
sale.reembolsado = true;
sale.dataReembolso = new Date();
```

### Exemplo de Documento

```json
{
  "_id": "507f1f77bcf86cd799439040",
  "integrationId": "507f1f77bcf86cd799439012",
  "customerId": "507f1f77bcf86cd799439015",
  "productId": "507f1f77bcf86cd799439030",
  "externalId": "order_kiwify_xyz789",
  "valor": 97.00,
  "tipoPagamento": "vitalicia",
  "status": "approved",
  "dataCompra": "2026-02-25T14:30:00.000Z",
  "reembolsado": false,
  "dataReembolso": null,
  "createdAt": "2026-02-25T14:31:00.000Z",
  "updatedAt": "2026-02-25T14:31:00.000Z"
}
```

### Índices

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `_id` | Primary | Índice padrão do MongoDB |
| `integrationId + status` | Compound | Busca rápida de vendas por integração e status |
| `integrationId + dataCompra` | Compound (desc) | Busca rápida de vendas recentes |
| `customerId` | Simple | Busca todas as vendas de um cliente |

```javascript
SaleSchema.index({ integrationId: 1, status: 1 });
SaleSchema.index({ integrationId: 1, dataCompra: -1 });
SaleSchema.index({ customerId: 1 });
```

---

## 6. Relacionamentos

Diagrama de relacionamentos entre collections:

```
User (1) ─────── (N) Integration
                      │
                      ├── (N) Customer
                      │        │
                      │        └── (N) Sale ──── (N) Product
                      │
                      └── (N) Product
```

### Detalhamento

**User → Integration (1:N)**
- Um usuário pode ter múltiplas integrações (Kiwify, Hotmart, Stripe)
- Cada integração pertence a um único usuário

**Integration → Customer (1:N)**
- Uma integração pode ter múltiplos clientes
- Cada cliente pertence a uma única integração

**Integration → Product (1:N)**
- Uma integração pode ter múltiplos produtos
- Cada produto pertence a uma única integração

**Customer → Sale (1:N)**
- Um cliente pode ter múltiplas compras
- Cada venda pertence a um único cliente

**Product → Sale (1:N)**
- Um produto pode ter múltiplas vendas
- Cada venda é de um único produto

**Integration → Sale (1:N)**
- Uma integração pode ter múltiplas vendas
- Cada venda pertence a uma única integração

### Queries com Population

**Exemplo 1: Listar vendas com dados do cliente e produto**
```javascript
const sales = await Sale.find({ integrationId })
  .populate('customerId', 'nome email')
  .populate('productId', 'name price')
  .sort({ dataCompra: -1 });
```

**Exemplo 2: Obter cliente com todas as suas compras**
```javascript
const customer = await Customer.findById(customerId)
  .populate({
    path: 'sales',
    populate: {
      path: 'productId',
      select: 'name price type'
    }
  });
```

**Exemplo 3: Obter integração com estatísticas**
```javascript
const integration = await Integration.findById(integrationId);

const stats = {
  totalCustomers: await Customer.countDocuments({ integrationId }),
  totalProducts: await Product.countDocuments({ integrationId }),
  totalSales: await Sale.countDocuments({ integrationId, status: 'approved' }),
  totalRevenue: await Sale.aggregate([
    { $match: { integrationId: mongoose.Types.ObjectId(integrationId), status: 'approved' } },
    { $group: { _id: null, total: { $sum: '$valor' } } }
  ])
};
```

---

## 7. Índices e Performance

### Resumo de Índices

**users:**
- `_id` (primary)
- `email` (unique)

**integrations:**
- `_id` (primary)
- `userId + platform` (compound)

**customers:**
- `_id` (primary)
- `integrationId + email` (compound)
- `integrationId + cpf` (compound)

**products:**
- `_id` (primary)
- `integrationId + externalId` (compound unique)

**sales:**
- `_id` (primary)
- `integrationId + status` (compound)
- `integrationId + dataCompra` (compound desc)
- `customerId` (simple)

### Estratégias de Otimização

**1. Use índices compostos para queries frequentes:**
```javascript
// BAD: Busca sem índice
Sale.find({ integrationId: id, status: 'approved' })

// GOOD: Usa índice composto (integrationId + status)
SaleSchema.index({ integrationId: 1, status: 1 });
```

**2. Evite retornar campos sensíveis:**
```javascript
// BAD: Retorna senha hasheada
User.find()

// GOOD: Senha já está marcada como select: false
UserSchema.password.select = false;
```

**3. Use aggregation para estatísticas:**
```javascript
// BAD: Buscar todas as vendas e somar no código
const sales = await Sale.find({ integrationId });
const total = sales.reduce((sum, sale) => sum + sale.valor, 0);

// GOOD: Usar aggregation no banco
const [result] = await Sale.aggregate([
  { $match: { integrationId: mongoose.Types.ObjectId(integrationId) } },
  { $group: { _id: null, total: { $sum: '$valor' } } }
]);
```

**4. Limite resultados com pagination:**
```javascript
// BAD: Buscar todos os clientes
Customer.find({ integrationId })

// GOOD: Paginar resultados
Customer.find({ integrationId })
  .limit(50)
  .skip((page - 1) * 50)
  .sort({ createdAt: -1 });
```

**5. Use lean() para queries read-only:**
```javascript
// BAD: Retorna documentos Mongoose completos
Customer.find({ integrationId })

// GOOD: Retorna objetos JavaScript simples (mais rápido)
Customer.find({ integrationId }).lean()
```

### Monitoramento de Performance

**Ver explain de uma query:**
```javascript
Sale.find({ integrationId })
  .explain('executionStats')
  .then(stats => console.log(stats));
```

**Criar índice faltante:**
```javascript
// Se uma query estiver lenta, verifique se há índice
db.sales.getIndexes()

// Criar índice manualmente se necessário
db.sales.createIndex({ integrationId: 1, dataCompra: -1 })
```

---

## 🔧 Configuração do Banco

### String de Conexão

```env
MONGO_URI=mongodb://localhost:27017/plataforma
```

**Para MongoDB Atlas (cloud):**
```env
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/plataforma?retryWrites=true&w=majority
```

### Conectar ao Banco

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log(`MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Erro ao conectar MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### Seed Data (Desenvolvimento)

Para popular o banco com dados de teste:

```javascript
// backend/scripts/seed.js
const User = require('../models/User');
const Integration = require('../models/Integration');

const seedData = async () => {
  // Criar usuário de teste
  const user = await User.create({
    nome: 'Admin User',
    email: 'admin@plataforma.com',
    password: 'admin123',
    role: 'admin'
  });

  // Criar integração de teste
  await Integration.create({
    userId: user._id,
    platform: 'kiwify',
    status: 'connected',
    credentials: {
      apiKey: 'test_key_123'
    }
  });

  console.log('✅ Seed data criado com sucesso');
};
```

---

## 📚 Referências

- **Mongoose Docs:** https://mongoosejs.com/docs/guide.html
- **MongoDB Indexes:** https://www.mongodb.com/docs/manual/indexes/
- **Aggregation Pipeline:** https://www.mongodb.com/docs/manual/core/aggregation-pipeline/

---

**Documentado por:** Claude Sonnet 4.5
**Data:** 2026-02-25
**Versão:** 1.0
