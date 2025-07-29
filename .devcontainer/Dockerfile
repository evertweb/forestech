# 🚀 Forestech Development Container
# Dockerfile personalizado para optimizar el entorno de desarrollo

FROM mcr.microsoft.com/devcontainers/javascript-node:1-18-bullseye

# 🏷️ Metadata
LABEL maintainer="Forestech Development Team"
LABEL description="Entorno de desarrollo completo para el proyecto Forestech"
LABEL version="1.0.0"

# 🌍 Variables de entorno
ENV DEBIAN_FRONTEND=noninteractive
ENV NODE_ENV=development
ENV LANG=C.UTF-8
ENV LC_ALL=C.UTF-8

# 🔧 Actualizar sistema e instalar dependencias básicas
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        # Herramientas de desarrollo
        curl \
        wget \
        git \
        vim \
        nano \
        tree \
        htop \
        jq \
        unzip \
        zip \
        # Compilación y build tools
        build-essential \
        python3 \
        python3-pip \
        python3-dev \
        # Java para herramientas Firebase
        default-jdk \
        # Herramientas de red
        netcat \
        telnet \
        iputils-ping \
        # Herramientas de imagen (para optimización)
        imagemagick \
        # Herramientas de texto
        ripgrep \
        fd-find \
        # Limpieza
    && apt-get autoremove -y \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 🐍 Configurar Python y herramientas
RUN pip3 install --no-cache-dir \
    firebase-admin \
    google-cloud-firestore \
    google-cloud-storage \
    requests \
    beautifulsoup4 \
    Pillow

# 📦 Instalar herramientas globales de Node.js específicas para Forestech
RUN npm install -g \
    firebase-tools@latest \
    @vitejs/create-vue@latest \
    create-react-app \
    serve \
    http-server \
    nodemon \
    concurrently \
    npm-check-updates \
    eslint \
    prettier \
    typescript \
    @typescript-eslint/cli \
    vite \
    # Herramientas de análisis
    webpack-bundle-analyzer \
    lighthouse \
    # Utilidades de desarrollo
    cross-env \
    rimraf \
    copyfiles

# 🎨 Configurar Zsh con Oh My Zsh (si no existe)
RUN if [ ! -d "/home/vscode/.oh-my-zsh" ]; then \
        su vscode -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" || true; \
    fi

# 🔌 Configurar plugins adicionales de Zsh
RUN su vscode -c "git clone https://github.com/zsh-users/zsh-autosuggestions /home/vscode/.oh-my-zsh/custom/plugins/zsh-autosuggestions" || true \
    && su vscode -c "git clone https://github.com/zsh-users/zsh-syntax-highlighting /home/vscode/.oh-my-zsh/custom/plugins/zsh-syntax-highlighting" || true

# 📁 Crear directorios de trabajo
RUN mkdir -p /workspace/{logs,temp,scripts,docs,cache} \
    && chown -R vscode:vscode /workspace

# 🎯 Configurar Git con mejores defaults
RUN git config --system init.defaultBranch main \
    && git config --system pull.rebase false \
    && git config --system core.autocrlf input \
    && git config --system core.editor "code --wait"

# 🔧 Configurar npm para mejor rendimiento
RUN npm config set fund false \
    && npm config set audit-level moderate \
    && npm config set progress false

# 🚀 Pre-calentar cache de Node modules comunes
RUN mkdir -p /tmp/warm-cache \
    && cd /tmp/warm-cache \
    && npm init -y \
    && npm install --no-save \
        react \
        react-dom \
        @vitejs/plugin-react \
        vite \
        firebase \
        @types/react \
        @types/react-dom \
        tailwindcss \
        postcss \
        autoprefixer \
        eslint \
        prettier \
    && rm -rf /tmp/warm-cache

# 🎨 Configurar fuentes para mejor experiencia de desarrollo
RUN mkdir -p /usr/share/fonts/truetype/cascadia \
    && wget -q https://github.com/microsoft/cascadia-code/releases/download/v2111.01/CascadiaCode-2111.01.zip -O /tmp/cascadia.zip \
    && unzip -q /tmp/cascadia.zip -d /tmp/cascadia \
    && cp /tmp/cascadia/ttf/*.ttf /usr/share/fonts/truetype/cascadia/ \
    && fc-cache -f -v \
    && rm -rf /tmp/cascadia* \
    || echo "No se pudieron instalar las fuentes Cascadia Code"

# 🔒 Configurar permisos y ownership
RUN chown -R vscode:vscode /home/vscode \
    && chmod -R 755 /home/vscode

# 🎭 Cambiar al usuario vscode
USER vscode

# 📝 Configurar shell personalizado
RUN echo 'export PATH="$PATH:/home/vscode/.local/bin"' >> ~/.bashrc \
    && echo 'export EDITOR="code --wait"' >> ~/.bashrc \
    && echo 'export BROWSER="none"' >> ~/.bashrc

# 🌟 Configurar mensaje de bienvenida
RUN echo 'echo "🚀 Forestech Development Environment Ready!"' >> ~/.bashrc \
    && echo 'echo "📋 Quick start: ./scripts/dev-all.sh"' >> ~/.bashrc

# 🎯 Configurar directorio de trabajo
WORKDIR /workspace

# 🔧 Health check para verificar que el contenedor está listo
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node --version && npm --version && firebase --version || exit 1

# 📋 Documentar puertos expuestos
EXPOSE 3000 5173 5174 8080 8081 9005 9099

# 🎉 Mensaje final
RUN echo "✅ Forestech Development Container está listo!"