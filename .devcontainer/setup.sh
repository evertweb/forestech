#!/bin/bash

# 🚀 Forestech Development Environment Setup
# Este script se ejecuta al crear el contenedor

set -e

echo "🌟 Iniciando configuración del entorno de desarrollo Forestech..."

# 📦 Actualizar sistema
echo "📦 Actualizando sistema..."
sudo apt-get update -y
sudo apt-get upgrade -y

# 🔧 Instalar herramientas esenciales
echo "🔧 Instalando herramientas esenciales..."
sudo apt-get install -y \
    curl \
    git \
    vim \
    nano \
    jq \
    unzip \
    tree \
    htop \
    build-essential \
    python3 \
    python3-pip \
    default-jdk

# 🌟 Configurar Git (usar configuración del usuario si existe)
echo "🌟 Configurando Git..."
if [ -n "$GITHUB_USER" ]; then
    git config --global user.name "$GITHUB_USER"
fi
if [ -n "$GITHUB_EMAIL" ]; then
    git config --global user.email "$GITHUB_EMAIL"
fi
git config --global init.defaultBranch main
git config --global pull.rebase false

# 📱 Instalar Firebase CLI
echo "📱 Instalando Firebase CLI..."
npm install -g firebase-tools@latest

# 🔥 Configurar Firebase Emulators
echo "🔥 Configurando Firebase Emulators..."
# Crear directorios para emuladores
mkdir -p /home/vscode/.cache/firebase
mkdir -p /workspace/.firebase

# ⚡ Instalar herramientas globales de Node
echo "⚡ Instalando herramientas globales de Node..."
npm install -g \
    @vitejs/create-vue@latest \
    create-react-app \
    serve \
    http-server \
    nodemon \
    concurrently \
    npm-check-updates \
    eslint \
    prettier

# 🐍 Configurar Python para herramientas adicionales
echo "🐍 Configurando Python..."
pip3 install --user \
    firebase-admin \
    google-cloud-firestore \
    requests

# 📁 Crear estructura de directorios
echo "📁 Creando estructura de directorios..."
mkdir -p /workspace/{logs,temp,scripts,docs/.vscode}

# 🎨 Configurar Zsh (si está instalado)
if command -v zsh &> /dev/null; then
    echo "🎨 Configurando Zsh..."
    # Instalar Oh My Zsh plugins adicionales
    git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions || true
    git clone https://github.com/zsh-users/zsh-syntax-highlighting ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting || true
    
    # Configurar plugins en .zshrc
    sed -i 's/plugins=(git)/plugins=(git node npm docker zsh-autosuggestions zsh-syntax-highlighting)/' ~/.zshrc || true
fi

# 🔑 Configurar SSH (si hay claves disponibles)
echo "🔑 Configurando SSH..."
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# 📝 Crear alias útiles
echo "📝 Configurando aliases..."
cat >> ~/.bashrc << 'EOF'

# 🚀 Forestech Aliases
alias ll='ls -alF'
alias la='ls -A'
alias l='ls -CF'
alias ..='cd ..'
alias cls='clear'

# 📦 NPM/Yarn shortcuts
alias ni='npm install'
alias ns='npm start'
alias nb='npm run build'
alias nt='npm test'
alias nrd='npm run dev'

# 🔥 Firebase shortcuts
alias fb='firebase'
alias fbe='firebase emulators:start'
alias fbd='firebase deploy'
alias fbl='firebase login'

# 📁 Project navigation
alias combustibles='cd /workspace/combustibles'
alias alimentacion='cd /workspace/alimentacion' 
alias shared='cd /workspace/shared'
alias root='cd /workspace'

# 🐙 Git shortcuts
alias gs='git status'
alias ga='git add'
alias gc='git commit'
alias gp='git push'
alias gl='git pull'
alias gd='git diff'
alias gb='git branch'
alias gco='git checkout'

# 🔧 Development utilities
alias ports='netstat -tulpn'
alias processes='ps aux'
EOF

# También para zsh si existe
if [ -f ~/.zshrc ]; then
    cat >> ~/.zshrc << 'EOF'

# 🚀 Forestech Aliases (same as above)
alias ll='ls -alF'
alias la='ls -A'
alias l='ls -CF'
alias ..='cd ..'
alias cls='clear'
alias ni='npm install'
alias ns='npm start'
alias nb='npm run build'
alias nt='npm test'
alias nrd='npm run dev'
alias fb='firebase'
alias fbe='firebase emulators:start'
alias fbd='firebase deploy'
alias fbl='firebase login'
alias combustibles='cd /workspace/combustibles'
alias alimentacion='cd /workspace/alimentacion' 
alias shared='cd /workspace/shared'
alias root='cd /workspace'
alias gs='git status'
alias ga='git add'
alias gc='git commit'
alias gp='git push'
alias gl='git pull'
alias gd='git diff'
alias gb='git branch'
alias gco='git checkout'
alias ports='netstat -tulpn'
alias processes='ps aux'
EOF
fi

echo "✅ Configuración inicial completada!"