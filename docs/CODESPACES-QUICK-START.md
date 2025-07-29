# 🚀 Forestech Codespaces - Guía Rápida

## ⚡ Inicio Rápido (5 minutos)

### 1. 🌟 Crear Codespace
```
GitHub → Code → Codespaces → Create codespace on main
```

### 2. ⏳ Esperar Setup Automático
- Los scripts se ejecutan automáticamente
- Toma ~3-5 minutos la primera vez
- Verás mensajes de progreso en terminal

### 3. 🔥 Configurar Firebase
```bash
firebase login --no-localhost
# Seguir instrucciones en pantalla
```

### 4. 🤖 Verificar Claude Code
```bash
claude --version
# Si no funciona: curl -sSL https://claude.ai/install.sh | bash
```

### 5. 🚀 ¡Empezar a Desarrollar!
```bash
./scripts/dev-all.sh
```

## 🎯 URLs Importantes

Una vez iniciado:
- **🍽️ Alimentación**: `http://localhost:3000`
- **⛽ Combustibles**: `http://localhost:5173`
- **🔥 Firebase UI**: `http://localhost:9005`
- **📱 Hosting**: `http://localhost:8080`

## 📋 Comandos Esenciales

```bash
# 🔍 Ver estado del proyecto
cat docs/CODESPACES.md

# 🚀 Iniciar todo
./scripts/dev-all.sh

# 🧹 Limpiar y reinstalar
./scripts/clean-all.sh && npm install

# 🏗️ Build para producción
./scripts/build-all.sh

# 🔥 Solo Firebase emulators
firebase emulators:start

# 🤖 Claude Code ayuda
claude --help

# 📊 Ver puertos activos
ports

# 🐙 Git status rápido
gs
```

## 🆘 Problemas Comunes

### ❌ "firebase: command not found"
```bash
npm install -g firebase-tools
```

### ❌ "claude: command not found"
```bash
curl -sSL https://claude.ai/install.sh | bash
source ~/.bashrc
```

### ❌ Puerto ocupado
```bash
# Ver qué está usando el puerto
netstat -tulpn | grep :3000

# Matar proceso
kill -9 <PID>
```

### ❌ Dependencias rotas
```bash
./scripts/clean-all.sh
npm install
```

### ❌ Firebase no autentica
```bash
firebase logout
firebase login --no-localhost
```

## 🎨 Personalización Rápida

### Cambiar tema
```
Ctrl+Shift+P → "Preferences: Color Theme" → Tokyo Night
```

### Configurar Git
```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

### Agregar alias personalizado
```bash
echo 'alias mialias="mi comando"' >> ~/.zshrc
source ~/.zshrc
```

## 🔧 Variables de Entorno

Crear `.env.local` en cada app:

```bash
# combustibles/.env.local
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_PROJECT_ID=tu_project_id

# alimentacion/.env.local  
REACT_APP_FIREBASE_API_KEY=tu_api_key
REACT_APP_FIREBASE_PROJECT_ID=tu_project_id
```

## 📱 Desarrollo Móvil

Para probar en móvil:
1. Usar el puerto forwarding automático de Codespaces
2. Acceder desde tu móvil usando la URL pública
3. O usar Firebase Hosting emulator

## 🚀 Deploy Rápido

```bash
# Build todo
./scripts/build-all.sh

# Deploy a Firebase
firebase deploy

# Deploy solo hosting
firebase deploy --only hosting

# Deploy solo funciones
firebase deploy --only functions
```

## 🎉 ¡Listo!

Tu entorno Forestech está configurado y listo para desarrollo productivo en GitHub Codespaces.

**💡 Tip**: Guarda este Codespace como template para proyectos futuros.

---

**🆘 ¿Necesitas ayuda?** Revisa la documentación completa en `docs/CODESPACES.md` o contacta al equipo de desarrollo.