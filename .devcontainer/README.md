# 🚀 Forestech GitHub Codespaces Setup

Este directorio contiene la configuración completa para el entorno de desarrollo de Forestech en GitHub Codespaces.

## 📁 Estructura

```
.devcontainer/
├── devcontainer.json      # Configuración principal del contenedor
├── setup.sh              # Script de configuración inicial
├── post-create.sh         # Script post-creación
├── post-start.sh          # Script que se ejecuta al iniciar
├── Dockerfile             # Imagen personalizada (opcional)
├── docker-compose.yml     # Servicios adicionales
└── README.md             # Esta documentación
```

## 🎯 Características Incluidas

### 🔧 Herramientas Base
- **Node.js 18** con npm y yarn
- **Firebase CLI** preinstalado
- **Git** con configuración optimizada
- **Zsh** con Oh My Zsh
- **Python 3** para scripts adicionales
- **Java** para herramientas Firebase

### 🚀 Extensions VS Code
- **Claude Code** para AI-powered development
- **Firebase Tools** para desarrollo en Firebase
- **GitHub Integration** completa
- **React/JavaScript** tools
- **Prettier & ESLint** para formatting
- **Tailwind CSS** IntelliSense

### 📦 NPM Globals
- `firebase-tools` - CLI de Firebase
- `@vitejs/create-vue` - Para proyectos Vue/Vite
- `create-react-app` - Para proyectos React
- `serve` - Servidor estático
- `concurrently` - Ejecutar múltiples comandos
- `eslint` & `prettier` - Code quality
- `typescript` - TypeScript compiler

### 🎨 UI/UX Enhancements
- **Tokyo Night Theme** preinstalado
- **Material Icon Theme** para archivos
- **Cascadia Code Font** para mejor legibilidad
- **Custom prompt** con branding Forestech

## ⚡ Scripts Automáticos

### 🏗️ `setup.sh`
- Instala herramientas del sistema
- Configura Git y SSH
- Instala Firebase CLI
- Configura aliases útiles
- Prepara el entorno base

### 📦 `post-create.sh`
- Instala dependencias del proyecto
- Configura Claude Code
- Crea scripts de desarrollo
- Configura VS Code workspace
- Genera documentación

### 🚀 `post-start.sh`
- Verifica estado del proyecto
- Muestra información útil
- Configura prompt personalizado
- Mensaje de bienvenida

## 🎮 Comandos Rápidos

Una vez en Codespaces:

```bash
# 🚀 Iniciar todos los servicios
./scripts/dev-all.sh

# ⛽ Solo combustibles
cd combustibles && npm run dev

# 🍽️ Solo alimentación
cd alimentacion && npm start

# 🔥 Firebase emulators
firebase emulators:start

# 🤖 Claude Code
claude --help

# 🧹 Limpiar todo
./scripts/clean-all.sh

# 🏗️ Build production
./scripts/build-all.sh
```

## 🔧 Configuración Personalizada

### Variables de Entorno
```bash
# En .devcontainer/devcontainer.json
"containerEnv": {
  "NODE_ENV": "development",
  "FIREBASE_CONFIG_PATH": "/workspace/.firebase/config.json",
  "CLAUDE_WORKSPACE": "/workspace"
}
```

### Puertos Expuestos
- `3000` - Alimentacion App (React)
- `5173` - Combustibles App (Vite)
- `5174` - Shared Components
- `8080` - Firebase Hosting Emulator
- `8081` - Firebase Functions Emulator
- `9005` - Firebase Emulator UI
- `9099` - Firebase Auth Emulator

### Servicios Adicionales (Opcional)
Usando perfiles de Docker Compose:

```bash
# Iniciar con base de datos
docker-compose --profile database up

# Iniciar con cache Redis
docker-compose --profile cache up

# Iniciar con monitoreo
docker-compose --profile monitoring up

# Todo junto
docker-compose --profile database --profile cache --profile monitoring up
```

## 🛠️ Personalización

### Agregar Extensiones
Edita `devcontainer.json`:
```json
"extensions": [
  "existing.extension",
  "new.extension"
]
```

### Agregar Herramientas
Modifica `setup.sh`:
```bash
# Instalar nueva herramienta
npm install -g nueva-herramienta
```

### Configurar VS Code
Edita `.vscode/settings.json`:
```json
{
  "nueva.configuracion": "valor"
}
```

## 🆘 Troubleshooting

### Claude Code no funciona
```bash
curl -sSL https://claude.ai/install.sh | bash
```

### Firebase no autentica
```bash
firebase login --no-localhost
```

### Permisos de scripts
```bash
chmod +x .devcontainer/*.sh
chmod +x scripts/*.sh
```

### Limpiar contenedor
```bash
# Reconstruir contenedor
Ctrl+Shift+P > "Codespaces: Rebuild Container"
```

### Performance lenta
```bash
# Limpiar node_modules
./scripts/clean-all.sh

# Reinstalar dependencias
npm ci --prefer-offline
```

## 📚 Recursos Adicionales

- [GitHub Codespaces Docs](https://docs.github.com/en/codespaces)
- [Dev Container Reference](https://containers.dev/)
- [Claude Code Documentation](https://claude.ai/docs)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)

## 🎯 Próximos Pasos

1. **Abrir en Codespaces**: Clic en "Code" > "Codespaces" > "Create codespace"
2. **Esperar setup**: Los scripts se ejecutarán automáticamente
3. **Verificar instalación**: Ejecutar `./scripts/dev-all.sh`
4. **Configurar Firebase**: `firebase login --no-localhost`
5. **Configurar Claude**: Seguir instrucciones de instalación
6. **¡Empezar a desarrollar!** 🚀

---

**📧 Soporte**: Si encuentras problemas, revisa los logs en `/workspace/logs/` o consulta la documentación del proyecto.