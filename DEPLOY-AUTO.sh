#!/bin/bash

echo ""
echo "====================================================="
echo "  DEPLOY AUTOMÁTICO - Plataforma Render"
echo "====================================================="
echo ""

# Pedir dados
read -p "[1] GitHub username (ex: seu-usuario): " GITHUB_USER
read -p "[2] GitHub Token (deixe em branco se não tiver): " GITHUB_TOKEN
read -p "[3] Render Token (deixe em branco se não tiver): " RENDER_TOKEN

# Se não tiver token, mostrar como gerar
if [ -z "$GITHUB_TOKEN" ]; then
    echo ""
    echo "[!] Gere seu GitHub Token em:"
    echo "    https://github.com/settings/tokens"
    echo "    - Marque: repo, workflow"
    echo "    - Copie o token e execute novamente"
    echo ""
    exit 1
fi

echo ""
echo "[*] Criando .env com variáveis..."
cat > .env << ENVFILE
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://demo:demo@cluster0.mongodb.net/plataforma
JWT_SECRET=seu-jwt-secret-super-seguro-aqui-2026
KIWIFY_API_KEY=sua-kiwify-api-key
KIWIFY_CLIENT_ID=sua-kiwify-client-id
KIWIFY_CLIENT_SECRET=sua-kiwify-client-secret
KIWIFY_ACCOUNT_ID=sua-kiwify-account-id
HOTMART_CLIENT_ID=sua-hotmart-client-id
HOTMART_CLIENT_SECRET=sua-hotmart-client-secret
STRIPE_SECRET_KEY=sk_test_sua-stripe-key
STRIPE_WEBHOOK_SECRET=sua-stripe-webhook-secret
CORS_ORIGIN=https://plataforma-frontend.onrender.com
VITE_API_URL=https://plataforma-backend.onrender.com/api
ENVFILE

echo "[✓] .env criado!"

echo ""
echo "[*] Configurando Git..."
git config user.name "Plataforma Bot"
git config user.email "deploy@plataforma.com"

echo "[*] Adicionando arquivos..."
git add .
git add .env -f

echo "[*] Criando commit..."
git commit -m "Deploy automático para Render"

echo ""
echo "[✓] Repositório pronto para sincronizar!"
echo ""
echo "[PRÓXIMO PASSO 1] Crie repo no GitHub:"
echo "    https://github.com/new"
echo "    Nome: plataforma"
echo "    Type: Public"
echo ""
echo "[PRÓXIMO PASSO 2] Depois execute:"
echo "    git remote add origin https://github.com/$GITHUB_USER/plataforma.git"
echo "    git branch -M main"
echo "    git push -u origin main"
echo ""
echo "[PRÓXIMO PASSO 3] Depois vá para:"
echo "    https://dashboard.render.com/"
echo "    Clique em 'New +' - 'Blueprint'"
echo "    Cole a URL do seu repo"
echo "    Render detecta render.yaml automaticamente!"
echo ""
