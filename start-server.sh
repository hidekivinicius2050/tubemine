#!/bin/bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "========================================"
echo "    🚀 TUBEMINE PLATFORM"
echo "========================================"
echo -e "${NC}"

echo -e "${YELLOW}Iniciando servidor...${NC}"
echo

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js não está instalado!${NC}"
    echo "Por favor, instale o Node.js primeiro: https://nodejs.org/"
    exit 1
fi

# Verificar se o npm está instalado
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm não está instalado!${NC}"
    exit 1
fi

# Executar o script de inicialização
node start-server.js
