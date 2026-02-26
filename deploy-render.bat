@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo ██████╗ ███████╗██████╗ ██╗      ██████╗ ██╗   ██╗
echo ██╔══██╗██╔════╝██╔══██╗██║     ██╔═══██╗╚██╗ ██╔╝
echo ██║  ██║█████╗  ██████╔╝██║     ██║   ██║ ╚████╔╝
echo ██║  ██║██╔══╝  ██╔═══╝ ██║     ██║   ██║  ╚██╔╝
echo ██████╔╝███████╗██║     ███████╗╚██████╔╝   ██║
echo ╚═════╝ ╚══════╝╚═╝     ╚══════╝ ╚═════╝    ╚═╝
echo.
echo  DEPLOY AUTOMATICO - RENDER
echo.

REM Pedir GitHub username
set /p GITHUB_USER="Seu GitHub username (ex: seu-usuario): "

REM Criar .env
echo [*] Criando .env...
(
  echo NODE_ENV=production
  echo PORT=3000
  echo MONGODB_URI=mongodb+srv://demo:demo@cluster0.mongodb.net/plataforma
  echo JWT_SECRET=seu-jwt-secret-super-seguro-aqui-2026
  echo KIWIFY_API_KEY=sua-kiwify-api-key
  echo KIWIFY_CLIENT_ID=sua-kiwify-client-id
  echo KIWIFY_CLIENT_SECRET=sua-kiwify-client-secret
  echo KIWIFY_ACCOUNT_ID=sua-kiwify-account-id
  echo HOTMART_CLIENT_ID=sua-hotmart-client-id
  echo HOTMART_CLIENT_SECRET=sua-hotmart-client-secret
  echo STRIPE_SECRET_KEY=sk_test_sua-stripe-key
  echo STRIPE_WEBHOOK_SECRET=sua-stripe-webhook-secret
  echo CORS_ORIGIN=https://plataforma-frontend.onrender.com
  echo VITE_API_URL=https://plataforma-backend.onrender.com/api
) > .env

echo [OK] .env criado!

REM Git config
echo [*] Configurando Git...
git config user.name "Plataforma Deploy"
git config user.email "deploy@plataforma.com"

echo [*] Adicionando arquivos...
git add .
git add .env -f

echo [*] Fazendo commit...
git commit -m "Deploy automatico para Render"

echo.
echo ============================================================
echo [OK] REPOSITORIO PRONTO!
echo ============================================================
echo.
echo PROXIMOS PASSOS:
echo.
echo [1] Crie repositorio em GitHub:
echo     https://github.com/new
echo     Nome: plataforma
echo     Type: Public
echo.
echo [2] Execute NO TERMINAL:
echo     git remote add origin https://github.com/!GITHUB_USER!/plataforma.git
echo     git branch -M main
echo     git push -u origin main
echo.
echo [3] Vá para https://dashboard.render.com
echo     New + → Blueprint
echo     Cole: https://github.com/!GITHUB_USER!/plataforma.git
echo     Render vai fazer tudo sozinho!
echo.
echo [4] Adicione variáveis de ambiente no Render:
echo     MONGODB_URI, JWT_SECRET, KIWIFY_*, STRIPE_*, etc
echo.
echo RESULTADO: Seu servidor 24/7 online!
echo     Backend:  https://plataforma-backend.onrender.com
echo     Frontend: https://plataforma-frontend.onrender.com
echo.
pause
