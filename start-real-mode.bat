@echo off
echo ========================================
echo  ATIVANDO MODO REAL - KIWIFY
echo ========================================
echo.

echo [1/3] Verificando MongoDB...
sc query MongoDB | findstr "RUNNING" >nul 2>&1
if %errorlevel% neq 0 (
    echo MongoDB nao esta rodando. Iniciando...
    net start MongoDB
    timeout /t 3 /nobreak >nul
)

echo [OK] MongoDB rodando!
echo.

echo [2/3] Configurando backend para modo REAL...
cd backend
echo KIWIFY_USE_MOCK=false >> .env.temp
echo Backend configurado!
echo.

echo [3/3] Instrucoes finais:
echo.
echo PROXIMO PASSO:
echo 1. Va para a aplicacao (http://localhost:5173)
echo 2. Desconecte a Kiwify atual
echo 3. Reconecte com suas credenciais REAIS
echo 4. Clique em "Dados" para ver seus dados verdadeiros!
echo.
echo ========================================
echo  Configuracao concluida!
echo ========================================
pause
