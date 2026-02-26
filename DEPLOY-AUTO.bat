@echo off
setlocal enabledelayedexpansion

echo.
echo =====================================================
echo   DEPLOY AUTOMÁTICO - Plataforma Render
echo =====================================================
echo.

REM Pedir dados
set /p GITHUB_USER="[1] GitHub username (ex: seu-usuario): "
set /p GITHUB_TOKEN="[2] GitHub Token (deixe em branco para gerar depois): "
set /p RENDER_TOKEN="[3] Render Token (deixe em branco para gerar depois): "

REM Se não tiver tokens, mostrar como gerar
if "!GITHUB_TOKEN!"=="" (
    echo.
    echo [!] Gere seu GitHub Token em:
    echo    https://github.com/settings/tokens
    echo    - Marque: repo, workflow
    echo    - Copie o token e execute novamente
    echo.
    pause
    exit /b 1
)

if "!RENDER_TOKEN!"=="" (
    echo.
    echo [!] Gere seu Render Token em:
    echo    https://dashboard.render.com/account/tokens
    echo    - Copie o token
    echo.
    pause
)

echo.
echo [*] Criando .env com variáveis padrão...
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

echo [✓] .env criado!

echo.
echo [*] Configurando Git...
git config user.name "Deploy Bot"
git config user.email "deploy@plataforma.com"

echo [*] Adicionando arquivos...
git add .
git add .env -f

echo [*] Criando commit...
git commit -m "Deploy automático para Render"

echo [*] Criando repositório no GitHub...
REM Usar GitHub CLI se disponível
where /q gh
if !errorlevel! equ 0 (
    echo Repositório criado via GitHub CLI
    gh repo create plataforma --public --source=. --remote=origin --push
) else (
    echo [!] GitHub CLI não encontrado
    echo Crie manualmente o repo em https://github.com/new
    echo Nome: plataforma
    echo Depois execute:
    echo   git remote add origin https://github.com/!GITHUB_USER!/plataforma.git
    echo   git push -u origin main
    pause
    exit /b 1
)

echo.
echo [✓] Deploy iniciado no Render...
echo.
echo [!] Próximos passos:
echo    1. Ir para: https://dashboard.render.com/
echo    2. Clicar em "New +" - "Blueprint"
echo    3. Colar: https://github.com/!GITHUB_USER!/plataforma.git
echo    4. Render vai detectar render.yaml automaticamente
echo    5. Adicionar variáveis de ambiente no Render
echo    6. Deploy automático em 2-3 minutos
echo.
echo [✓] URLs finais:
echo    Backend:  https://plataforma-backend.onrender.com
echo    Frontend: https://plataforma-frontend.onrender.com
echo.
pause
