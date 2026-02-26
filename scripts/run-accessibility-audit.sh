#!/bin/bash

# ============================================
# Script de Audit de Acessibilidade Completo
# WCAG 2.1 AA - Plataforma CRM
# ============================================

set -e

echo "🚀 Iniciando Audit de Acessibilidade WCAG 2.1 AA"
echo "================================================="
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Diretórios
REPORT_DIR="./docs/accessibility/audit-reports"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Criar diretório de relatórios
mkdir -p "$REPORT_DIR"

echo "📁 Relatórios serão salvos em: $REPORT_DIR"
echo ""

# ============================================
# 1. Verificar dependências
# ============================================
echo "${BLUE}📦 Verificando dependências...${NC}"

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "${RED}❌ Node.js não encontrado. Instale: https://nodejs.org${NC}"
    exit 1
fi

# Verificar npm
if ! command -v npm &> /dev/null; then
    echo "${RED}❌ npm não encontrado${NC}"
    exit 1
fi

echo "${GREEN}✅ Node.js $(node --version)${NC}"
echo "${GREEN}✅ npm $(npm --version)${NC}"
echo ""

# ============================================
# 2. Instalar ferramentas se necessário
# ============================================
echo "${BLUE}📥 Instalando ferramentas de audit...${NC}"

# Lighthouse CLI
if ! command -v lighthouse &> /dev/null; then
    echo "${YELLOW}⚠️  Lighthouse não instalado. Instalando...${NC}"
    npm install -g lighthouse
fi

# axe-core CLI
if ! command -v axe &> /dev/null; then
    echo "${YELLOW}⚠️  axe-cli não instalado. Instalando...${NC}"
    npm install -g @axe-core/cli
fi

echo "${GREEN}✅ Ferramentas instaladas${NC}"
echo ""

# ============================================
# 3. Verificar servidor dev rodando
# ============================================
echo "${BLUE}🌐 Verificando servidor de desenvolvimento...${NC}"

# URL base (ajuste conforme necessário)
BASE_URL="http://localhost:5173"

# Verificar se servidor está rodando
if ! curl -s --head "$BASE_URL" > /dev/null; then
    echo "${YELLOW}⚠️  Servidor não está rodando em $BASE_URL${NC}"
    echo "${YELLOW}   Inicie o servidor com: npm run dev${NC}"
    echo ""
    read -p "Pressione Enter quando o servidor estiver rodando..."
fi

echo "${GREEN}✅ Servidor acessível em $BASE_URL${NC}"
echo ""

# ============================================
# 4. Lighthouse Audit
# ============================================
echo "${BLUE}🏠 Executando Lighthouse Audit...${NC}"
echo "================================================="

# Páginas para testar
PAGES=(
    ""
    "#/dashboard"
    "#/crm"
    "#/inbox"
    "#/integrations"
    "#/contacts"
    "#/team"
    "#/companies"
)

PAGE_NAMES=(
    "home"
    "dashboard"
    "crm"
    "inbox"
    "integrations"
    "contacts"
    "team"
    "companies"
)

# Desktop Audit
echo ""
echo "${YELLOW}📊 Lighthouse Desktop Audit...${NC}"
for i in "${!PAGES[@]}"; do
    PAGE="${PAGES[$i]}"
    NAME="${PAGE_NAMES[$i]}"

    echo "   Testing: $NAME"

    lighthouse "$BASE_URL/$PAGE" \
        --only-categories=accessibility \
        --preset=desktop \
        --output=html \
        --output=json \
        --output-path="$REPORT_DIR/lighthouse-desktop-$NAME-$TIMESTAMP" \
        --quiet \
        --chrome-flags="--headless" || true
done

# Mobile Audit
echo ""
echo "${YELLOW}📱 Lighthouse Mobile Audit...${NC}"
for i in "${!PAGES[@]}"; do
    PAGE="${PAGES[$i]}"
    NAME="${PAGE_NAMES[$i]}"

    echo "   Testing: $NAME"

    lighthouse "$BASE_URL/$PAGE" \
        --only-categories=accessibility \
        --preset=mobile \
        --output=html \
        --output=json \
        --output-path="$REPORT_DIR/lighthouse-mobile-$NAME-$TIMESTAMP" \
        --quiet \
        --chrome-flags="--headless" || true
done

echo "${GREEN}✅ Lighthouse Audit completo${NC}"
echo ""

# ============================================
# 5. axe-core Audit
# ============================================
echo "${BLUE}🪓 Executando axe-core Audit...${NC}"
echo "================================================="

for i in "${!PAGES[@]}"; do
    PAGE="${PAGES[$i]}"
    NAME="${PAGE_NAMES[$i]}"

    echo "   Testing: $NAME"

    axe "$BASE_URL/$PAGE" \
        --tags wcag2a,wcag2aa,wcag21a,wcag21aa \
        --save "$REPORT_DIR/axe-$NAME-$TIMESTAMP.json" \
        --disable color-contrast \
        --timeout 30000 || true
done

echo "${GREEN}✅ axe-core Audit completo${NC}"
echo ""

# ============================================
# 6. Gerar Resumo
# ============================================
echo "${BLUE}📊 Gerando resumo consolidado...${NC}"

# Contar arquivos gerados
LIGHTHOUSE_REPORTS=$(find "$REPORT_DIR" -name "lighthouse-*-$TIMESTAMP.report.html" | wc -l)
AXE_REPORTS=$(find "$REPORT_DIR" -name "axe-*-$TIMESTAMP.json" | wc -l)

echo ""
echo "================================================="
echo "${GREEN}✅ AUDIT COMPLETO!${NC}"
echo "================================================="
echo ""
echo "📊 Relatórios gerados:"
echo "   - Lighthouse Desktop: $(find "$REPORT_DIR" -name "lighthouse-desktop-*-$TIMESTAMP.report.html" | wc -l) páginas"
echo "   - Lighthouse Mobile: $(find "$REPORT_DIR" -name "lighthouse-mobile-*-$TIMESTAMP.report.html" | wc -l) páginas"
echo "   - axe-core: $AXE_REPORTS páginas"
echo ""
echo "📁 Localização: $REPORT_DIR"
echo ""
echo "🌐 Para visualizar os relatórios:"
echo "   cd $REPORT_DIR"
echo "   open lighthouse-desktop-dashboard-$TIMESTAMP.report.html"
echo ""

# ============================================
# 7. Análise Rápida (opcional)
# ============================================
echo "${BLUE}🔍 Análise rápida dos resultados...${NC}"
echo ""

# Extrair scores do Lighthouse
echo "📊 Lighthouse Accessibility Scores:"
for file in "$REPORT_DIR"/lighthouse-desktop-*-$TIMESTAMP.report.json; do
    if [ -f "$file" ]; then
        FILENAME=$(basename "$file")
        PAGE_NAME=$(echo "$FILENAME" | sed 's/lighthouse-desktop-//g' | sed 's/-'$TIMESTAMP'.report.json//g')
        SCORE=$(cat "$file" | grep -o '"accessibility":[^}]*"score":[0-9.]*' | grep -o '[0-9.]*$' | head -1)

        if [ ! -z "$SCORE" ]; then
            SCORE_PERCENT=$(echo "$SCORE * 100" | bc)
            if (( $(echo "$SCORE >= 0.9" | bc -l) )); then
                echo "   ${GREEN}✅ $PAGE_NAME: ${SCORE_PERCENT}%${NC}"
            elif (( $(echo "$SCORE >= 0.7" | bc -l) )); then
                echo "   ${YELLOW}⚠️  $PAGE_NAME: ${SCORE_PERCENT}%${NC}"
            else
                echo "   ${RED}❌ $PAGE_NAME: ${SCORE_PERCENT}%${NC}"
            fi
        fi
    fi
done

echo ""
echo "${GREEN}🎉 Audit de Acessibilidade concluído com sucesso!${NC}"
echo ""
echo "📋 Próximos passos:"
echo "   1. Revisar relatórios HTML do Lighthouse"
echo "   2. Analisar violations do axe-core"
echo "   3. Corrigir issues encontrados"
echo "   4. Re-executar audit para validar correções"
echo ""
