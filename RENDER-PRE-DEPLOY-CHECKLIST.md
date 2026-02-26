# ✅ Render Pre-Deploy Checklist

## 📋 Antes de Fazer Deploy

### Backend (Render pronto?)
- [ ] `backend/server.js` usa `process.env.PORT`
- [ ] `backend/package.json` tem script `start: node server.js`
- [ ] `.env` tem todas as variáveis de senha
- [ ] MongoDB Atlas está acessível (IP whitelist: 0.0.0.0/0)
- [ ] Testou localmente: `npm run dev` (frontend) + `npm run dev` (backend)

### Frontend (Render pronto?)
- [ ] `package.json` tem script `build: vite build`
- [ ] `.env` ou `vite.config.js` tem `VITE_API_URL` apontando pro backend
- [ ] Testou build localmente: `npm run build`
- [ ] Testou servidor: `npm run preview`

### GitHub (Render precisa)
- [ ] Código está em GitHub público
- [ ] Arquivo `render.yaml` na raiz
- [ ] `.gitignore` ignora `node_modules` e `.env`
- [ ] `main` branch está atualizada

---

## 🔍 Verificações Rápidas

### 1. Backend está pronto?
```bash
cd backend
npm install
npm start
# Deve rodar na porta 3000 (ou PORT do .env)
```

### 2. Frontend está pronto?
```bash
npm install
npm run build
npm run preview
# Deve servir o site em http://localhost:4173
```

### 3. Variáveis de Ambiente
```bash
# Verifique que tem tudo isso no .env:
echo "NODE_ENV: $NODE_ENV"
echo "MONGODB_URI: $MONGODB_URI"
echo "JWT_SECRET: $JWT_SECRET"
echo "KIWIFY_API_KEY: $KIWIFY_API_KEY"
echo "STRIPE_SECRET_KEY: $STRIPE_SECRET_KEY"
```

---

## 🚀 Próximo Passo

1. **Fazer GitHub**: Criar repositório e subir código
2. **Ir para render.com**: Conectar GitHub
3. **Clicar "New +"** → **"Blueprint"** → Copiar link do GitHub
4. **Render detecta `render.yaml`** e faz deploy automático
5. **Adicionar variáveis de ambiente** no Render Dashboard
6. **Testar**: `https://plataforma-backend.onrender.com/health`

---

## 📝 Variáveis para Copiar no Render

```
NODE_ENV = production
PORT = 3000
MONGODB_URI = mongodb+srv://seu-user:senha@cluster.mongodb.net/plataforma
JWT_SECRET = aleatorio123456789
KIWIFY_API_KEY = sua_api_key
KIWIFY_CLIENT_ID = seu_client_id
KIWIFY_CLIENT_SECRET = seu_client_secret
KIWIFY_ACCOUNT_ID = seu_account_id
HOTMART_CLIENT_ID = seu_client_id
HOTMART_CLIENT_SECRET = seu_client_secret
STRIPE_SECRET_KEY = sk_live_seu_secret_key
STRIPE_WEBHOOK_SECRET = seu_webhook_secret
CORS_ORIGIN = https://plataforma-frontend.onrender.com
VITE_API_URL = https://plataforma-backend.onrender.com/api
```

---

## ⚠️ Erros Comuns

| Erro | Solução |
|------|---------|
| "Cannot find module 'express'" | Rodar `npm install` no backend |
| "Port 3000 already in use" | Mudar PORT no `backend/server.js` |
| "CORS error" | Adicionar `CORS_ORIGIN` no Render |
| "Webpack build failed" | Rodar `npm run build` localmente e verificar erros |
| "MongoDB connect timeout" | Whitelist IP no MongoDB Atlas (0.0.0.0/0) |

---

## 🎯 Status Atual

**Backend:** ✅ Pronto (OAuth 2.0, Webhooks, MongoDB)
**Frontend:** ✅ Pronto (Build Vite, Dark Mode, Componentes)
**Deploy:** 🔄 Pronto para Render

**Tempo estimado de deploy:** 10 minutos (automático)
**Custo:** R$ 0,00 (free tier)

---

Bora fazer o deploy? 🚀
