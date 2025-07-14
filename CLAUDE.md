# CLAUDE.md

Este archivo proporciona orientación a Claude Code (claude.ai/code) cuando trabaja con código en este repositor#### 🤖 **MCPs GitHub Copilot Agent**
1. **📂 github-forestech**: Gestión inteligente repositorio
2. **⏰ time-bogota**: Zona horaria América/Bogotá
3. **🧠 sequential-thinking-es**: Análisis paso a paso español
4. **💾 memory-forestech**: Memoria específica proyecto

#### ⚠️ **Fix Memory MCP - Julio 2025**
**Problema**: GitHub Copilot Agent bloquea herramientas memory MCP
**Solución**: Agregar lista explícita de `tools` en configuración JSON:
```json
"memory-forestech": {
  "tools": [
    "create_entities", "create_relations", "add_observations",
    "delete_entities", "delete_observations", "delete_relations", 
    "read_graph", "search_nodes", "open_nodes"
  ]
}
```## 🎯 **SELECTOR DE PROYECTO - IMPORTANTE**

**AL INICIAR CADA SESIÓN, CLAUDE DEBE PREGUNTAR:**
```
🔍 ¿En qué proyecto de Forestech trabajamos hoy?

🍽️  1. ALIMENTACION - App de liquidaciones de comidas
⛽  2. COMBUSTIBLES - App de gestión de combustibles  
🔧  3. SHARED - Recursos compartidos entre apps
📋  4. GENERAL - Configuración global del monorepo

Responde con el número (1-4) para establecer el contexto correcto.
```

**CONTEXTOS DE TRABAJO:**
- **[ALIMENTACION]**: Archivos en `forestech/alimentacion/src/...`
- **[COMBUSTIBLES]**: Archivos en `forestech/combustibles/src/...` 
- **[SHARED]**: Archivos en `forestech/shared/...`
- **[GENERAL]**: Configuración Firebase, hosting, documentación

## 🤖 **COMPORTAMIENTO AUTOMÁTICO DE CLAUDE**

**⚡ ANÁLISIS AUTOMÁTICO:** Claude ejecuta automáticamente análisis profundo sin necesidad de solicitudes específicas.

### 🔥 **FIREBASE MCP - INTEGRACIÓN PRODUCCIÓN**
- **Proyecto**: liquidacionapp-62962 ✅ ACTIVO
- **Usuario**: cardenasever072@gmail.com ✅ AUTENTICADO  
- **Estado**: 6 colecciones combustibles + 10+ usuarios registrados

### 🚫 **PROMPTS AUTOMÁTICOS** (No necesarios)
- ❌ "usa todos los MCPs" → **AUTOMÁTICO**
- ❌ "piensa paso a paso" → **AUTOMÁTICO**
- ❌ "analiza con profundidad" → **AUTOMÁTICO**
- ❌ "usa firebase MCP" → **AUTOMÁTICO**

### ⚡ **FLUJO AUTOMÁTICO ESTABLECIDO**
1. **🧩 Sequential Thinking**: Análisis profundo multi-paso
2. **🔥 Firebase MCP**: Datos reales de producción  
3. **📁 Filesystem**: Contexto del código existente
4. **🧠 Memory**: Patrones y decisiones previas
5. **🤖 Gemini Advanced**: Análisis técnico profundo

## 📚 **DOCUMENTACIÓN Y ESTRUCTURA**

### �️ **Estructura Monorepo**
```
forestech/                      # Monorepo principal
├── alimentacion/               # 🍽️ App liquidaciones ✅ FUNCIONAL
├── combustibles/               # ⛽ App combustibles ✅ FUNCIONAL
├── shared/                     # 🔧 Recursos compartidos
├── docs/                       # 📚 Documentación modular
├── public/                     # 🌐 Build output Firebase
├── firebase.json               # Multi-app routing
└── package.json               # Scripts monorepo
```

### 📖 **Apps y Documentación**
- **🍽️ ALIMENTACION**: Sistema liquidaciones completo → [docs/alimentacion/](./docs/alimentacion/README.md)
- **⛽ COMBUSTIBLES**: Sistema completo + módulo reportes → [docs/combustibles/](./docs/combustibles/README.md)  
- **🔧 SHARED**: Recursos compartidos → [docs/shared/](./docs/shared/README.md)
- **🏢 EMPRESARIAL**: Manuales y SOPs → [docs/empresarial/](./docs/empresarial/README.md)

## ⚙️ **COMANDOS Y DESARROLLO**

### 🚀 **Comandos Esenciales**
```bash
# Desarrollo
npm run dev:alimentacion    # Puerto 5173
npm run dev:combustibles    # Puerto 5174

# Linting (REQUERIDO antes de commit)
npm run lint:alimentacion
npm run lint:combustibles

# Deploy automático con GitHub Actions
git add .
git commit -m "descripción cambios"
git push origin main
```

### 🌐 **URLs Activas**
- 🍽️ **Alimentación**: https://forestechdecolombia.com.co/alimentacion/
- ⛽ **Combustibles**: https://forestechdecolombia.com.co/combustibles/
- 📋 **Firebase**: https://liquidacionapp-62962.web.app/

### 🔍 **Testing PRs con GitHub CLI**
```bash
# Flujo para analizar PRs antes de merge
gh pr list                    # Ver PRs disponibles
gh pr checkout [NUMERO]      # Descargar PR para testing local
npm run dev                  # Probar funcionamiento  
gh pr merge [NUMERO] --merge --delete-branch
```

## 📊 **ESTADO ACTUAL DEL PROYECTO - JULIO 2025**

### ✅ **Aplicaciones Completadas**
- **🍽️ Alimentación**: Sistema de liquidaciones 100% funcional
- **⛽ Combustibles**: Sistema completo + módulo reportes

### 🔧 **Infraestructura**
- **Firebase**: Multi-app hosting (liquidacionapp-62962) ✅
- **Dominio**: forestechdecolombia.com.co operativo ✅  
- **CI/CD**: Sistema dual AI agents activo ✅
- **MCPs**: 13 herramientas integradas ✅

### 🐛 **Fix Reciente**
- **PR #21**: Error InventoryCards undefined color resuelto ✅ **14/07/2025**
- **Sistema**: Combustibles 100% operativo en producción

### 🤖 **MCPs CONFIGURADOS**

#### 🔧 **MCPs Principales (Claude Code)**
1. **🧠 memory**: Memoria persistente de patrones y decisiones
2. **🤖 gemini-advanced**: Análisis profundo de código  
3. **📁 filesystem-server**: Gestión avanzada archivos
4. **🧩 sequential-thinking**: Análisis paso a paso
5. **⏰ time**: Funciones de tiempo zona Colombia
6. **🌐 google-workspace**: Gmail, Drive, Calendar, Sheets

#### 🤖 **MCPs GitHub Copilot Agent**
1. **📂 github-forestech**: Gestión inteligente repositorio
2. **⏰ time-bogota**: Zona horaria América/Bogotá
3. **🧠 sequential-thinking-es**: Análisis en español
4. **💾 memory-forestech**: Memoria específica proyecto

## 🚀 **CI/CD Y WORKFLOWS**

### 🏆 **Sistema Dual AI Agents + Build Optimizado**

**🔗 Arquitectura "Defense in Depth" con 5 workflows coordinados:**

1. **🚀 deploy-firebase.yml** - Pipeline optimizado principal
   - **Performance**: 83% reducción tiempo build (8-12min → 2min)
   - **Workspace Monorepo**: Single npm install, builds paralelos
   - **Cache Multi-Layer**: Dependencies + Build artifacts + Vite cache

2. **📋 claude-check-resolver.yml** - Monitor PRs inteligente
3. **🌉 copilot-bridge.yml** - Sistema puente revolucionario 
4. **🛡️ monitor-bucles.yml** - Vigilancia preventiva
5. **🔧 deploy-firebase-old.yml** - Backup emergency (manual)

### ⚡ **Flujo Optimizado**
```
🚀 Push → Deploy-Firebase (2min) → ✅ Success
    ↓ (si falla)
🌉 Copilot-Bridge → 🤖 Agent crea PR → 📊 Claude-Check-Resolver → ✅ Fix
```

### 🎯 **Ventajas Competitivas**
- **🧠 Dual AI Coordination**: Copilot + Claude sin conflictos
- **⚡ Zero-logic Architecture**: Adaptabilidad infinita  
- **🛡️ Defense in Depth**: 5 capas de protección
- **📈 ROI Verificado**: 50+ horas/mes ahorradas

---

**📌 Documentación completa actualizada y optimizada - Julio 2025**