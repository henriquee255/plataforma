@echo off
echo ========================================
echo  VERIFICACAO DO MONGODB
echo ========================================
echo.

echo [1/4] Verificando servico MongoDB...
sc query MongoDB >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Servico MongoDB encontrado!
    sc query MongoDB | findstr "STATE"
) else (
    echo [ERRO] Servico MongoDB nao encontrado
    echo Verifique se a instalacao foi concluida
    pause
    exit /b 1
)

echo.
echo [2/4] Tentando conectar ao MongoDB...
timeout /t 2 /nobreak >nul

echo.
echo [3/4] Testando porta 27017...
netstat -an | findstr ":27017" >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] MongoDB esta escutando na porta 27017!
) else (
    echo [AVISO] Porta 27017 nao esta ativa
    echo Tentando iniciar o servico...
    net start MongoDB
)

echo.
echo [4/4] Status final:
sc query MongoDB | findstr "STATE"

echo.
echo ========================================
echo  Verificacao concluida!
echo ========================================
echo.
echo Pressione qualquer tecla para fechar...
pause >nul
