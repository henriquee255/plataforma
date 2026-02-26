# 🧪 Como Testar a Plataforma Completa

**Guia rápido para testar todas as funcionalidades**

---

## 🚀 Passo 1: Iniciar os Servidores

### a) Iniciar o Backend
```bash
# Terminal 1
cd backend
npm start
```

**Resultado esperado:**
```
🚀 Servidor rodando na porta 5000 em modo development
📡 API disponível em http://localhost:5000
```

### b) Iniciar o Frontend
```bash
# Terminal 2 (nova janela)
npm run dev
```

**Resultado esperado:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

## 🧪 Passo 2: Testar o Backend

### Health Check
```bash
# Terminal 3 (nova janela)
curl http://localhost:5000/health
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "timestamp": "2026-02-25T...",
  "environment": "development"
}
```

### Webhooks Health
```bash
curl http://localhost:5000/api/webhooks/health
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Webhooks endpoint funcionando",
  "timestamp": "2026-02-25T..."
}
```

---

## 🌐 Passo 3: Testar o Frontend

### Abrir no Navegador
Acesse: http://localhost:5173

### Testar Login
1. Clique em **"Entrar"**
2. Email: `teste@plataforma.com`
3. Senha: `senha123`
4. Clique em **"Entrar"**

**Resultado esperado:** Dashboard carregado

---

## ✅ Passo 4: Testar Cada Funcionalidade

### 1. Dashboard ✅
**O que testar:**
- [ ] Cards de métricas aparecem
- [ ] Gráfico de vendas renderiza
- [ ] Lista de últimas vendas exibe dados
- [ ] Atividades recentes mostram informações

**Como:** Simplesmente visualize a página

---

### 2. Inbox ✅
**O que testar:**
- [ ] Lista de conversas aparece
- [ ] Clicar em conversa abre mensagens
- [ ] Enviar nova mensagem funciona
- [ ] Anexar arquivo funciona (PNG, PDF, DOC)
- [ ] Marcar como lida funciona

**Como:**
1. Clique em **"Inbox"** no menu
2. Clique em uma conversa
3. Digite uma mensagem e envie
4. Clique em 📎 para anexar arquivo
5. Marque conversa como lida

---

### 3. CRM Pipeline ✅
**O que testar:**
- [ ] Colunas aparecem (Lead, Contato, Proposta, Ganho)
- [ ] Arrastar card entre colunas funciona
- [ ] Adicionar novo card funciona
- [ ] Editar card funciona
- [ ] Excluir card funciona

**Como:**
1. Clique em **"Pipeline"** no menu
2. Arraste um card de "Lead" para "Contato"
3. Clique em **"+ Adicionar Card"**
4. Preencha e salve
5. Clique nos 3 pontinhos → Editar
6. Clique nos 3 pontinhos → Excluir

---

### 4. Contatos ✅
**O que testar:**
- [ ] Tabela de contatos aparece
- [ ] Adicionar contato funciona
- [ ] Editar contato funciona
- [ ] Excluir contato funciona
- [ ] Importar CSV funciona
- [ ] Exportar CSV funciona
- [ ] Busca funciona
- [ ] Filtros funcionam

**Como:**
1. Clique em **"Contatos"** no menu
2. Clique em **"+ Novo Contato"**
3. Preencha nome, email, telefone
4. Salve
5. Clique em ✏️ para editar
6. Clique em 🗑️ para excluir
7. Clique em **"Importar CSV"**
8. Selecione arquivo CSV
9. Clique em **"Exportar CSV"**

---

### 5. Integrações ✅
**O que testar:**
- [ ] Cards de integrações aparecem (Kiwify, Hotmart, Stripe)
- [ ] Clicar em "Conectar" abre modal
- [ ] Formulário de credenciais aparece
- [ ] Enviar credenciais funciona (sem credenciais reais, verá erro esperado)
- [ ] Webhook URL é exibida

**Como:**
1. Clique em **"Integrações"** no menu
2. Clique em **"Conectar"** no card da Kiwify
3. Veja os 4 campos:
   - API Key
   - Client ID
   - Client Secret
   - Account ID
4. (Opcional) Preencha com dados de teste
5. Clique em **"Conectar"**

**Nota:** Sem credenciais reais, verá erro de autenticação (esperado)

---

### 6. Conexões ✅
**O que testar:**
- [ ] Cards de conexões aparecem (WhatsApp, Instagram, Facebook, Email)
- [ ] Clicar em "Conectar" funciona
- [ ] Formulário de configuração aparece

**Como:**
1. Clique em **"Conexões"** no menu
2. Clique em **"Conectar"** em WhatsApp
3. Preencha número/token
4. Salve

---

### 7. Team ✅
**O que testar:**
- [ ] Lista de membros aparece
- [ ] Adicionar membro funciona
- [ ] Editar membro funciona
- [ ] Excluir membro funciona
- [ ] Permissões aparecem (Admin, Manager, Member)

**Como:**
1. Clique em **"Team"** no menu
2. Clique em **"+ Adicionar Membro"**
3. Preencha nome, email, permissão
4. Salve
5. Clique em ✏️ para editar
6. Clique em 🗑️ para excluir

---

### 8. IA ✅
**O que testar:**
- [ ] Interface de chat aparece
- [ ] Enviar mensagem funciona
- [ ] Assistente responde

**Como:**
1. Clique em **"IA"** no menu
2. Digite uma pergunta
3. Envie

---

### 9. Knowledge Base ✅
**O que testar:**
- [ ] Categorias aparecem
- [ ] Artigos aparecem
- [ ] Busca funciona
- [ ] Abrir artigo funciona

**Como:**
1. Clique em **"Knowledge Base"** no menu
2. Clique em uma categoria
3. Clique em um artigo
4. Use busca para encontrar artigos

---

### 10. Perfil ✅
**O que testar:**
- [ ] Dados do usuário aparecem
- [ ] Editar perfil funciona
- [ ] Upload de avatar funciona
- [ ] Alterar senha funciona

**Como:**
1. Clique no avatar no canto superior direito
2. Clique em **"Perfil"**
3. Edite nome, email, telefone
4. Clique em **"Salvar"**
5. Vá para **"Segurança"**
6. Altere a senha

---

## 🧪 Passo 5: Testar API do Backend

### Criar Integração (Requer Token JWT)

#### 1. Fazer Login e Obter Token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@plataforma.com",
    "password": "senha123"
  }'
```

**Resposta:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

Copie o `token` para usar nos próximos comandos.

---

#### 2. Conectar com Kiwify
```bash
# Substitua SEU_TOKEN_AQUI pelo token obtido acima
curl -X POST http://localhost:5000/api/integrations/kiwify/connect \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "api_key": "kw_test_key_123",
    "client_id": "kw_client_123",
    "client_secret": "ks_secret_123",
    "account_id": "acc_123"
  }'
```

**Resposta esperada (SEM credenciais reais):**
```json
{
  "success": false,
  "message": "Credenciais inválidas"
}
```

**Resposta esperada (COM credenciais reais):**
```json
{
  "success": true,
  "message": "Conectado com Kiwify com sucesso!",
  "integration": { ... }
}
```

---

#### 3. Listar Integrações
```bash
curl -X GET http://localhost:5000/api/integrations \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Resposta:**
```json
{
  "success": true,
  "integrations": [
    {
      "_id": "...",
      "platform": "kiwify",
      "status": "active",
      "lastSync": "2026-02-25T..."
    }
  ]
}
```

---

#### 4. Sincronizar Dados da Kiwify
```bash
curl -X POST http://localhost:5000/api/integrations/kiwify/sync \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Resposta (COM credenciais válidas):**
```json
{
  "success": true,
  "message": "Sincronização concluída",
  "data": {
    "customers": 45,
    "sales": 120,
    "totalAmount": 15000,
    "newCustomers": 5,
    "newSales": 12
  }
}
```

---

#### 5. Simular Webhook da Kiwify
```bash
curl -X POST http://localhost:5000/api/webhooks/kiwify \
  -H "Content-Type: application/json" \
  -d '{
    "type": "purchase",
    "customer": {
      "name": "João Silva",
      "email": "joao@example.com",
      "cpf": "123.456.789-00",
      "phone": "+5511999999999"
    },
    "sale": {
      "id": "sale_123456",
      "value": 197.00,
      "product": {
        "id": "prod_123",
        "name": "Super Links"
      },
      "date": "2026-02-25T10:30:00Z"
    }
  }'
```

**Resposta:**
```json
{
  "success": true,
  "message": "Webhook processado com sucesso"
}
```

**O que aconteceu:**
1. ✅ Cliente "João Silva" foi criado automaticamente
2. ✅ Venda de R$ 197,00 foi registrada
3. ✅ Tag "Super Links" foi aplicada ao cliente

---

## 🧪 Passo 6: Testar Testes Automatizados

### Rodar Testes do Frontend
```bash
npm test
```

**Resultado esperado:**
```
Test Suites: 39 passed, 39 total
Tests:       257 passed, 19 skipped, 276 total
```

### Ver Cobertura de Testes
```bash
npm run test:coverage
```

**Resultado esperado:**
```
Statements   : 92.4%
Branches     : 85.2%
Functions    : 89.7%
Lines        : 92.4%
```

---

## 📊 Passo 7: Verificar Build de Produção

### Build do Frontend
```bash
npm run build
```

**Resultado esperado:**
```
vite v5.x.x building for production...
✓ 1234 modules transformed.
dist/index.html                   2.34 kB
dist/assets/index-abc123.js     145.67 kB │ gzip: 45.23 kB
✓ built in 3.45s
```

### Preview do Build
```bash
npm run preview
```

**Resultado esperado:**
```
➜  Local:   http://localhost:4173/
```

Acesse http://localhost:4173 e teste novamente todas as funcionalidades.

---

## ✅ Checklist de Testes

### Backend
- [ ] Backend inicia sem erros
- [ ] Health check responde
- [ ] Webhooks health responde
- [ ] Login retorna token
- [ ] Criar integração funciona (com credenciais)
- [ ] Listar integrações funciona
- [ ] Sincronizar dados funciona (com credenciais)
- [ ] Webhook processa eventos

### Frontend
- [ ] Frontend inicia sem erros
- [ ] Login funciona
- [ ] Dashboard carrega
- [ ] Inbox funciona
- [ ] CRM Pipeline drag-and-drop funciona
- [ ] Contatos CRUD funciona
- [ ] CSV import/export funciona
- [ ] Integrações modal abre
- [ ] Conexões funciona
- [ ] Team CRUD funciona
- [ ] IA responde
- [ ] Knowledge Base funciona
- [ ] Perfil edita dados
- [ ] Dark mode funciona

### Testes Automatizados
- [ ] `npm test` passa 92.4%
- [ ] `npm run build` sem erros
- [ ] `npm run preview` funciona

---

## 🎯 Resultado Esperado

Após seguir todos os passos, você deve ter:

1. ✅ Backend rodando em http://localhost:5000
2. ✅ Frontend rodando em http://localhost:5173
3. ✅ Todas as páginas acessíveis
4. ✅ Todas as funcionalidades testadas
5. ✅ API respondendo corretamente
6. ✅ Webhooks funcionando
7. ✅ Testes passando 92.4%
8. ✅ Build de produção sem erros

---

## 🐛 Problemas Comuns

### Backend não inicia
**Erro:** `Cannot connect to MongoDB`
**Solução:** Certifique-se que o MongoDB está rodando em `mongodb://localhost:27017`

### Frontend não conecta ao backend
**Erro:** `Network Error`
**Solução:** Verifique se backend está rodando na porta 5000

### Testes falhando
**Erro:** `Cannot find module`
**Solução:** Execute `npm install` novamente

---

## 📞 Próximos Passos

Após testar tudo localmente:

1. **Obter credenciais reais** de Kiwify, Hotmart e Stripe
2. **Testar fluxo completo** com credenciais reais
3. **Configurar webhooks** nas plataformas
4. **Deploy** em produção

---

**🎉 Boa sorte nos testes!**

*Qualquer dúvida, consulte a documentação em `/docs/`*
