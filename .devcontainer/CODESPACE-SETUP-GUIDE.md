# 🚀 GUÍA PASO A PASO - CODESPACE ENTERPRISE

## 📋 **PASOS OBLIGATORIOS DESPUÉS DE CREAR EL CODESPACE**

### ⚡ **1. PRIMERA VEZ - CONFIGURACIÓN INICIAL (5 min)**

```bash
# 🧪 Verificar que todo se instaló correctamente
./scripts/diagnose-enterprise.sh

# 🔧 Configurar Git (OBLIGATORIO)
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"

# 🔍 Verificar herramientas críticas
claude --version
gemini --version  
firebase --version
```

### ⚙️ **2. CONFIGURAR SECRETS EN GITHUB (Una sola vez)**

Ve a **GitHub → Settings → Codespaces → Repository secrets**:

1. **`GEMINI_API_KEY`**: Tu API key de Gemini (para Claude + IA tools)
   ```
   Valor: AIzaSyAOv--GyeK-ncVG-oyT1MKVXc0B3JASP8k
   ```

2. **`FIREBASE_TOKEN`**: Token para deployment automático
   ```bash
   # Para obtenerlo en tu local:
   firebase login:ci
   # Copia el token generado
   ```

### 🚀 **3. INICIAR STACK COMPLETO**

```bash
# 🎯 Comando principal - inicia TODO el stack
./scripts/dev-enterprise.sh
```

Esto inicia automáticamente:
- ⛽ **Combustibles**: http://localhost:5173
- 🍽️ **Alimentación**: http://localhost:3000  
- 🔥 **Firebase Emulators**: http://localhost:4000
- 🔥 **Auth Emulator**: http://localhost:9099

### 🔧 **4. COMANDOS ÚTILES DIARIOS**

```bash
# 🔍 Diagnóstico completo del sistema
./scripts/diagnose-enterprise.sh

# 🔨 Build de producción
./scripts/build-all.sh

# 🧹 Limpiar caches si hay problemas
./scripts/clean-cache.sh

# 🔄 Actualizar dependencias
./scripts/update-enterprise.sh
```

## 📱 **APPS Y PUERTOS**

| App | Puerto | URL | Descripción |
|-----|--------|-----|-------------|
| **Combustibles** | 5173 | http://localhost:5173 | App principal Vite |
| **Alimentación** | 3000 | http://localhost:3000 | App React |
| **Firebase UI** | 4000 | http://localhost:4000 | Panel admin Firebase |
| **Auth Emulator** | 9099 | http://localhost:9099 | Simulador autenticación |
| **Firestore** | 8080 | http://localhost:8080 | Base de datos local |
| **Functions** | 5001 | http://localhost:5001 | Cloud Functions |

## 🧠 **HERRAMIENTAS DISPONIBLES**

### ⚡ **AI Tools**
```bash
# Claude Code - Equivale a tu entorno local
claude

# Gemini CLI - IA de Google
gemini chat "pregunta sobre código"

# GitHub Copilot - En VS Code
# Ya configurado automáticamente
```

### 🔥 **Firebase**
```bash
# Login automático (si FIREBASE_TOKEN configurado)
firebase projects:list

# Emulators
firebase emulators:start
firebase emulators:export ./backups
```

### 📦 **Node.js & NPM**
```bash
# Workspaces configurados
npm run dev:combustibles
npm run dev:alimentacion
npm run build:all
npm run lint:all
```

## ⚠️ **TROUBLESHOOTING**

### 🚨 **Problema: Git no configurado**
```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

### 🚨 **Problema: Herramientas no encontradas**
```bash
# Verificar PATH
echo $PATH | grep npm-global

# Recargar shell
source ~/.bashrc

# Reinstalar herramientas globales
npm install -g @anthropic-ai/claude-code@latest
```

### 🚨 **Problema: Puertos ocupados**
```bash
# Ver procesos en puertos
lsof -i :5173
lsof -i :3000

# Matar procesos si es necesario
pkill -f "vite"
pkill -f "react-scripts"
```

### 🚨 **Problema: Dependencies obsoletas**
```bash
# Limpiar y reinstalar
./scripts/clean-cache.sh --deep
```

## 🎯 **FLUJO DE TRABAJO TÍPICO**

```bash
# 1. Abrir Codespace
# ✅ Setup automático ejecutándose...

# 2. Configuración inicial (solo primera vez)
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"

# 3. Verificar entorno
./scripts/diagnose-enterprise.sh

# 4. Iniciar desarrollo
./scripts/dev-enterprise.sh

# 5. Abrir apps en navegador
# - Combustibles: localhost:5173
# - Alimentación: localhost:3000
# - Firebase: localhost:4000

# 6. Desarrollar normalmente
# ✅ Hot reload automático
# ✅ Claude Code disponible
# ✅ GitHub Copilot activo
# ✅ Firebase emulators corriendo
```

## 🚀 **FEATURES ENTERPRISE ACTIVADAS**

### 🔧 **VS Code Extensions (15+)**
- ✅ GitHub Copilot + Chat
- ✅ Claude Code Extension
- ✅ TypeScript Next
- ✅ ESLint + Prettier
- ✅ Tailwind CSS
- ✅ Firebase tools
- ✅ Error Lens
- ✅ Auto-rename tag
- ✅ Path IntelliSense

### 🌍 **Herramientas Globales**
- ✅ Firebase CLI
- ✅ Claude Code CLI  
- ✅ Gemini CLI
- ✅ PM2 (process manager)
- ✅ HTTP Server
- ✅ Serve (static files)

### 💾 **Cache Persistente**
- ✅ npm cache persistente
- ✅ Yarn cache persistente  
- ✅ Firebase cache persistente
- ✅ Builds optimizados

---

## ⏱️ **TIEMPOS ESPERADOS**

- **Setup inicial**: ~8-10 minutos (solo primera vez)
- **Builds posteriores**: ~2-3 minutos (con cache)
- **Inicio de apps**: ~30-60 segundos
- **Hot reload**: Instantáneo

**🎉 ¡Codespace enterprise listo! Equivalente 95% a tu entorno local.**