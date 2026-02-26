# 🚀 Deploy no Render - Guia Completo

## ✅ Pré-requisitos
- GitHub (repositório com seu código)
- Conta no Render (render.com)
- Variáveis de ambiente do seu `.env`

---

## 📝 Passo 1: Preparar o Repositório

### 1.1 - Criar `.env.production` (ou adicionar vars no Render)
Na raiz do projeto:
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=sua_url_mongo_atlas
JWT_SECRET=seu_jwt_secret_aqui
KIWIFY_API_KEY=sua_api_key
KIWIFY_CLIENT_ID=seu_client_id
KIWIFY_CLIENT_SECRET=seu_client_secret
KIWIFY_ACCOUNT_ID=seu_account_id
HOTMART_CLIENT_ID=seu_client_id
HOTMART_CLIENT_SECRET=seu_client_secret
STRIPE_SECRET_KEY=sua_stripe_key
STRIPE_WEBHOOK_SECRET=seu_webhook_secret
```

### 1.2 - Ajustar Backend para Production
No `backend/server.js`, adicione:
```javascript
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
```

### 1.3 - Subir para GitHub
```bash
cd C:\Users\dinnh\Desktop\plataforma
git init
git add .
git commit -m "Initial commit - ready for production"
git branch -M main
git remote add origin https://github.com/seu-usuario/plataforma.git
git push -u origin main
```

---

## 🌐 Passo 2: Deploy no Render

### Opção A: Deploy Automático (RECOMENDADO)

1. Vá para **render.com**
2. Clique em **New +** → **Blueprint**
3. Cole a URL do seu GitHub
4. Render vai detectar `render.yaml` automaticamente
5. Configure as variáveis de ambiente:
   - `MONGODB_URI` (MongoDB Atlas)
   - `JWT_SECRET` (qualquer string aleatória)
   - `KIWIFY_*` (suas credenciais)
   - `HOTMART_*` (suas credenciais)
   - `STRIPE_*` (suas credenciais)

### Opção B: Deploy Manual

#### Para o Backend:
1. **New Web Service**
2. Conectar GitHub
3. Nome: `plataforma-backend`
4. Build Command: `cd backend && npm install`
5. Start Command: `cd backend && npm start`
6. Plan: **Free** ✅
7. Adicionar variáveis de ambiente

#### Para o Frontend:
1. **New Web Service**
2. Nome: `plataforma-frontend`
3. Build Command: `npm install && npm run build`
4. Start Command: `npm install -g serve && serve -s dist -l 3000`
5. Plan: **Free** ✅

---

## 🔧 Passo 3: Configurar Webhooks

### Para Kiwify:
```
https://plataforma-backend.onrender.com/api/webhooks/kiwify
```

### Para Hotmart:
```
https://plataforma-backend.onrender.com/api/webhooks/hotmart
```

### Para Stripe:
```
https://plataforma-backend.onrender.com/api/webhooks/stripe
```

---

## 🧪 Passo 4: Testar o Deploy

### 1. Verificar Backend
```bash
curl https://plataforma-backend.onrender.com/health
```
Deve retornar: `{ "status": "ok" }`

### 2. Verificar Frontend
Acesse: `https://plataforma-frontend.onrender.com`

### 3. Testar Login
- Email: `eu.henriquee2501@gmail.com`
- Senha: `admin@2026`

### 4. Testar Webhook (Kiwify)
Vá para **Render Dashboard** → Backend → **Logs** → procure por:
```
✅ Webhook Kiwify recebido
```

---

## 📊 Monitoramento

### Ver Logs em Tempo Real
1. Render Dashboard
2. Clique no serviço
3. Abra **Logs**
4. Procure por erros

### Variáveis de Ambiente (Render)
1. Dashboard → Serviço
2. **Environment** → editar variáveis
3. Render vai fazer deploy automático

---

## ⚡ Otimizações para Free Tier

### Para não cair o servidor (Render destrói serviços inativos por 15min)
Use um **Monitor Externo**:
```bash
# Criar cron job que acessa seu backend a cada 5 min
# Usando: https://cron-job.org ou https://uptimerobot.com
```

### URLs do seu Deploy:
- **Backend**: `https://plataforma-backend.onrender.com`
- **Frontend**: `https://plataforma-frontend.onrender.com`

---

## 🆘 Troubleshooting

### "Port already in use"
→ Backend não pode rodar na porta 5000, mude para `process.env.PORT`

### "MongoDB connection failed"
→ Verifique `MONGODB_URI` no Render (MongoDB Atlas IP whitelist)

### "CORS error"
→ No backend, adicione `CORS_ORIGIN=https://plataforma-frontend.onrender.com`

### Webhook não recebe dados
→ Verifique URL no painel Kiwify/Hotmart (use https://)

---

## 💡 Próximas Etapas

1. ✅ Deploy backend + frontend
2. ✅ Testar login
3. ✅ Testar webhooks Kiwify
4. 🚀 Quando crescer → migrar para **Hostinger** com mais recursos

**Migração para Hostinger depois:**
- Mesmo código (basta copiar para cPanel ou SSH)
- Mesmo MongoDB Atlas
- Mais confiabilidade e performance

---

## 📞 Suporte Render

- Docs: https://docs.render.com
- Status: https://status.render.com
- Chat: Render Dashboard → Help
