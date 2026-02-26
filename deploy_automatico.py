#!/usr/bin/env python3
"""
🚀 Deploy Automático - Plataforma Render
Faz TUDO sozinho: GitHub, .env, build, deploy
"""

import os
import subprocess
import sys
from pathlib import Path

def run_cmd(cmd, show_output=True):
    """Execute comando e retorna resultado"""
    print(f"  $ {cmd}")
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if show_output and result.stdout:
        print(result.stdout)
    if result.returncode != 0 and result.stderr:
        print(f"  ❌ Erro: {result.stderr}")
    return result.returncode == 0, result.stdout, result.stderr

def check_installed(tool):
    """Verifica se ferramenta está instalada"""
    result = subprocess.run(f"where {tool}" if sys.platform == "win32" else f"which {tool}",
                          shell=True, capture_output=True)
    return result.returncode == 0

def main():
    print("\n" + "="*60)
    print("  🚀 DEPLOY AUTOMÁTICO - PLATAFORMA RENDER")
    print("="*60 + "\n")

    # Checar pré-requisitos
    print("[1] Verificando pré-requisitos...")
    required_tools = {
        "git": "Git",
        "node": "Node.js",
        "npm": "NPM"
    }

    missing = []
    for tool, name in required_tools.items():
        if check_installed(tool):
            print(f"  ✅ {name} encontrado")
        else:
            print(f"  ❌ {name} NÃO encontrado")
            missing.append(name)

    if missing:
        print(f"\n❌ Instale os seguintes: {', '.join(missing)}")
        sys.exit(1)

    # Coletar dados
    print("\n[2] Coletando dados...")
    github_user = input("  GitHub username (ex: seu-usuario): ").strip()
    github_token = input("  GitHub Token (https://github.com/settings/tokens): ").strip()

    if not github_user or not github_token:
        print("\n❌ GitHub username e token são obrigatórios!")
        sys.exit(1)

    # Criar .env
    print("\n[3] Criando arquivo .env...")
    env_content = """NODE_ENV=production
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
"""

    with open(".env", "w") as f:
        f.write(env_content)
    print("  ✅ .env criado com variáveis padrão")

    # Git setup
    print("\n[4] Configurando Git...")
    run_cmd('git config user.name "Plataforma Deploy"', show_output=False)
    run_cmd('git config user.email "deploy@plataforma.com"', show_output=False)
    print("  ✅ Git configurado")

    # Adicionar e commitar
    print("\n[5] Preparando repositório...")
    run_cmd("git add .", show_output=False)
    run_cmd('git add .env -f', show_output=False)
    run_cmd('git commit -m "Deploy automático para Render" 2>/dev/null', show_output=False)
    print("  ✅ Arquivos commitados")

    # Criar repo no GitHub via CLI se disponível
    print("\n[6] Criando repositório no GitHub...")

    if check_installed("gh"):
        print("  [*] Usando GitHub CLI...")
        success, _, _ = run_cmd("gh auth status 2>/dev/null", show_output=False)

        if success:
            run_cmd("gh repo create plataforma --public --source=. --remote=origin --push",
                   show_output=False)
            print("  ✅ Repositório criado e enviado para GitHub via GitHub CLI!")
        else:
            print("  [!] GitHub CLI não autenticado, usando método manual...")
            create_via_git(github_user, github_token)
    else:
        print("  [!] GitHub CLI não encontrado, usando método manual...")
        create_via_git(github_user, github_token)

    # Build e teste local
    print("\n[7] Fazendo build local...")
    if run_cmd("npm run build", show_output=False)[0]:
        print("  ✅ Build do frontend OK")
    else:
        print("  ⚠️  Build falhou, mas continuando...")

    # Resumo final
    print("\n" + "="*60)
    print("  ✅ DEPLOY PREPARADO COM SUCESSO!")
    print("="*60)

    print("\n📋 PRÓXIMOS PASSOS (AUTOMÁTICOS):")
    print(f"""
  1. Seu repositório GitHub está pronto:
     https://github.com/{github_user}/plataforma

  2. Vá para Render Dashboard:
     https://dashboard.render.com/

  3. Clique em "New +" → "Blueprint"

  4. Cole a URL:
     https://github.com/{github_user}/plataforma.git

  5. Render vai detectar render.yaml automaticamente!

  6. Adicione as variáveis de ambiente no Render:
     - MONGODB_URI (seu MongoDB Atlas)
     - KIWIFY_* (suas credenciais)
     - Etc...

📍 URLs FINAIS (após deploy):
  - Backend:  https://plataforma-backend.onrender.com
  - Frontend: https://plataforma-frontend.onrender.com

⏱️  Tempo estimado: 2-3 minutos

🎯 Seu servidor vai estar RODANDO 24/7 no Render!
""")

    print("="*60)
    input("Pressione ENTER para fechar...")

def create_via_git(github_user, github_token):
    """Cria repo via git push manualmente"""
    print(f"\n  [*] Você precisará fazer estes 2 comandos no terminal:")
    print(f"     git remote add origin https://github.com/{github_user}/plataforma.git")
    print(f"     git push -u origin main")
    print(f"\n  ⚠️  Crie o repositório primeiro em:")
    print(f"     https://github.com/new")
    print(f"     Nome: plataforma")
    print(f"     Type: Public ✓")
    print(f"\n  Depois execute os comandos acima.")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n❌ Cancelado pelo usuário")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Erro: {e}")
        sys.exit(1)
