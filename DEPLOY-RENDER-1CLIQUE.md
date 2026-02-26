# 🚀 Deploy Render - UM CLIQUE SÓ!

## ✅ Status Atual
- ✅ Código no GitHub: `https://github.com/henriquee255/plataforma`
- ✅ Arquivo `render.yaml` pronto
- ✅ `.env` com variáveis padrão criado
- ⏳ **Próximo: Deploy no Render (30 segundos)**

---

## 🎯 PRÓXIMOS PASSOS (Só 3 cliques!)

### Passo 1: Ir para Render.com
```
https://dashboard.render.com/
```
- Clique em **"New +"**
- Clique em **"Blueprint"**

### Passo 2: Conectar GitHub
```
Colar URL: https://github.com/henriquee255/plataforma
```
- Render vai detectar `render.yaml` automaticamente
- Clique em **"Create from Blueprint"**

### Passo 3: Adicionar Variáveis de Ambiente
No Render Dashboard, vá para **Environment** e adicione:

```
NODE_ENV = production
PORT = 3000
MONGODB_URI = mongodb+srv://demo:demo@cluster0.mongodb.net/plataforma
JWT_SECRET = seu-jwt-secret-super-seguro-aqui-2026
KIWIFY_API_KEY = sua-kiwify-api-key
KIWIFY_CLIENT_ID = sua-kiwify-client-id
KIWIFY_CLIENT_SECRET = sua-kiwify-client-secret
KIWIFY_ACCOUNT_ID = sua-kiwify-account-id
HOTMART_CLIENT_ID = sua-hotmart-client-id
HOTMART_CLIENT_SECRET = sua-hotmart-client-secret
STRIPE_SECRET_KEY = sk_test_sua-stripe-key
STRIPE_WEBHOOK_SECRET = sua-stripe-webhook-secret
CORS_ORIGIN = https://plataforma-frontend.onrender.com
VITE_API_URL = https://plataforma-backend.onrender.com/api
```

### Passo 4: Deploy Automático
- Clique em **"Deploy"**
- Render vai:
  1. Fazer build do backend (2-3 min)
  2. Fazer build do frontend (2-3 min)
  3. Colocar online automaticamente

---

## 📊 Status Final (5-10 minutos)

Após o deploy, você terá:

```
✅ Backend:  https://plataforma-backend.onrender.com
✅ Frontend: https://plataforma-frontend.onrender.com
✅ Webhooks: Kiwify, Hotmart, Stripe funcionando
✅ Clients: Acessam de qualquer lugar 🌍
✅ Online: 24/7 no Render
```

---

## 🔧 Ajustar Variáveis de Ambiente

Depois de fazer deploy, você vai querer trocar as variáveis fake pelas reais:

| Variável | Obter em |
|----------|----------|
| `MONGODB_URI` | MongoDB Atlas (mongodb.com) |
| `KIWIFY_API_KEY` | Painel Kiwify |
| `STRIPE_SECRET_KEY` | Stripe Dashboard |
| `JWT_SECRET` | Qualquer string aleatória |

**Para atualizar no Render:**
1. Dashboard → Serviço → **Environment**
2. Edit variável
3. Render faz deploy automático em 2 min

---

## 📱 Testar Webhooks

### Kiwify
1. Ir para Painel Kiwify → Webhooks
2. Adicionar:
   ```
   https://plataforma-backend.onrender.com/api/webhooks/kiwify
   ```

### Hotmart
```
https://plataforma-backend.onrender.com/api/webhooks/hotmart
```

### Stripe
```
https://plataforma-backend.onrender.com/api/webhooks/stripe
```

---

## 🆘 Se algo der errado

### "Build Failed"
→ Ver logs no Render Dashboard:
1. Dashboard → Serviço → **Logs**
2. Procurar por erro (npm, webpack, etc)

### "Cannot connect to MongoDB"
→ Verificar `MONGODB_URI` (MongoDB Atlas IP whitelist)

### "CORS error"
→ Verificar `CORS_ORIGIN` (deve apontar pro seu frontend)

---

## 🎉 Pronto!

Seu servidor está **RODANDO 24/7** no Render!

**Seus clientes podem acessar de qualquer lugar:**
- WhatsApp integrado ✅
- Instagram integrado ✅
- Kiwify funcionando ✅
- Hotmart funcionando ✅

---

## 🚀 Depois: Migrar para Hostinger

Quando crescer para 50+ pessoas, migre:
1. Mesmo código
2. Mesmo MongoDB Atlas
3. Mais performance em Hostinger

**Mas por enquanto:** Render é gratuito e confiável! ✨
