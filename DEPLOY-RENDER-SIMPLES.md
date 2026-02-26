# 🚀 Deploy Render - VERSÃO LIMPA

## ✅ Funcionalidades Ativas

```
✅ Login (Email + Senha)
✅ Criar/Gerenciar Empresas
✅ Admin de Usuários
✅ WhatsApp (Conexão)
✅ Widget
✅ Inbox (Mensagens)
✅ CRM (Pipeline)
✅ Equipe (Permissões)
✅ Dashboard (Métricas)
```

## ❌ Desativadas (Podem ativar depois)

- Kiwify (webhooks, integrações)
- Hotmart (webhooks, integrações)
- Stripe (webhooks, integrações)

---

## 🎯 Fazer Agora (Render Deploy)

### 1️⃣ Vá para Render
```
https://dashboard.render.com/
```

### 2️⃣ Clique em "New +" → "Blueprint"

### 3️⃣ Cole a URL do Repositório
```
https://github.com/henriquee255/plataforma
```

### 4️⃣ Render detecta automaticamente `render.yaml`
- Backend (Node.js + Express)
- Frontend (React + Vite)
- Build automático

### 5️⃣ Adicione Variáveis de Ambiente

No painel do Render, em **Environment**, copie e cole:

```
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://demo:demo@cluster0.mongodb.net/plataforma
JWT_SECRET=seu-jwt-secret-super-seguro-2026
FRONTEND_URL=https://plataforma-frontend.onrender.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 6️⃣ Clique em "Deploy"

---

## ⏱️ Timing

```
Deploy iniciado
   ↓
2-3 min: Backend buildando
   ↓
2-3 min: Frontend buildando
   ↓
5-10 min TOTAL: ONLINE! 🎉
```

---

## 📍 URLs Finais

Após deploy:

```
🌐 Frontend:  https://plataforma-frontend.onrender.com
🔌 Backend:   https://plataforma-backend.onrender.com
💪 API:       https://plataforma-backend.onrender.com/api
✅ Health:    https://plataforma-backend.onrender.com/health
```

---

## 🔐 Login Padrão

Use qualquer email + senha. Backend cria automaticamente.

Ou use o admin:
```
Email: eu.henriquee2501@gmail.com
Senha: admin@2026
```

---

## 🎁 O que Você Tem

✨ Servidor 24/7 online
✨ Múltiplas empresas
✨ Usuários com permissões
✨ WhatsApp integrado
✨ Inbox para mensagens
✨ CRM com pipeline
✨ Dashboard com métricas
✨ Sem precisar de Kiwify/Hotmart/Stripe agora

---

## 🚀 Depois: Adicionar Integrações

Se quiser Kiwify/Hotmart/Stripe depois:
1. Me avisa
2. Ativo as rotas de webhooks
3. Você adiciona credenciais no Render
4. Pronto!

---

## 🆘 Problemas?

**"Deploy Failed"**
→ Render Dashboard → Logs → procure por erro

**"Cannot connect to MongoDB"**
→ MongoDB Atlas whitelist IP (0.0.0.0/0)

**"Frontend não carrega"**
→ Verificar `FRONTEND_URL` no Render (deve apontar pro backend)

---

## ✨ Próximos Passos

1. ✅ Deploy no Render (agora)
2. ✅ Testar login
3. ✅ Criar empresa
4. ✅ Adicionar usuários
5. ✅ Conectar WhatsApp
6. 🚀 Seus clientes acessam!

**Tudo online e funcionando!**
