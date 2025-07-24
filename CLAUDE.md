# CLAUDE.md

Este archivo proporciona orientación a Claude Code (claude.ai/code) cuando trabaja con código en este repositorio.

## ⚡ **EJECUTAR HERRAMIENTAS EN PARALELO - CRÍTICO**

**Claude DEBE usar múltiples herramientas en paralelo cuando sea posible:**
```
✅ CORRECTO - Llamadas paralelas:
Read + Grep + LS simultáneamente
Bash múltiples comandos en paralelo
Analizar varios archivos a la vez

❌ INCORRECTO - Secuencial innecesario:
Read → esperar → Grep → esperar → LS
Un comando por vez cuando podrían ser paralelos
```

**EJEMPLOS DE EJECUCIÓN PARALELA:**
- **Análisis de código**: Read múltiples archivos + Grep patrones + LS estructura
- **Git operations**: git status + git diff + git log en paralelo
- **Build verification**: lint + test + build checks simultáneos
- **Firebase queries**: Múltiples colecciones + usuarios + reglas a la vez

## 🚨 **IMPORTANTE - ACTUALIZACIÓN 15/07/2025**

### ⚡ **Auto-Context Loading ACTIVO**
El contexto completo del proyecto ahora se carga **automáticamente** vía `.github/copilot-instructions.md`.

### 🤖 **MCPs Configurados Automáticamente**
**Prioridad:** github-cli > github > memory > filesystem > firebase
1. **📂 github-forestech**: Gestión inteligente repositorio
2. **⏰ time-bogota**: Zona horaria América/Bogotá  
3. **🧠 sequential-thinking-es**: Análisis paso a paso español
4. **💾 memory-forestech**: Memoria específica proyecto
5. **🔥 firebase**: Firebase MCP server oficial
6. **🐙 github-cli**: Wrapper GitHub CLI automático

### 🔧 **Configuración AI Permanente**
- **Usar MCP wrappers automáticamente** como parte de procesos internos
- **Evitar comandos directos** - preferir herramientas MCP
- **Firebase**: Proyecto liquidacionapp-62962 (cardenasever072@gmail.com) ✅ ACTIVO## 🎯 **SELECTOR DE PROYECTO - IMPORTANTE**

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

### ⚡ **COMPORTAMIENTO AUTOMÁTICO**
- **Análisis profundo automático** sin solicitudes específicas
- **Herramientas en paralelo** cuando sea posible
- **MCPs integrados** automáticamente en flujo
- **Firebase datos reales** de producción disponibles

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

### 🔄 **ÚLTIMA ACTUALIZACIÓN: 16/07/2025**
- ✅ **Auto-context loading** implementado en `.github/copilot-instructions.md`
- ✅ **Superprompt manual** migrado y obsoleto
- ✅ **MCPs priority system** establecido automáticamente
- ✅ **AI preferences** configuración persistente activa
- ✅ **Documentation sync** protocolo activo
- ✅ **Control total categorías** - Sistema administrativo completo implementado

### ✅ **Aplicaciones Completadas**
- **🍽️ Alimentación**: Sistema de liquidaciones 100% funcional
- **⛽ Combustibles**: Sistema completo + módulo reportes

### 🔧 **Infraestructura**
- **Firebase**: Multi-app hosting (liquidacionapp-62962) ✅
- **Dominio**: forestechdecolombia.com.co operativo ✅  
- **CI/CD**: Sistema dual AI agents activo ✅
- **MCPs**: 13 herramientas integradas ✅

### 📊 **Estado Actual**
- ✅ **Control total categorías** - Sistema administrativo completo implementado
- ✅ **Auto-context loading** - Contexto automático activo
- ✅ **Sistema Combustibles** - 100% operativo en producción

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

**📌 Documentación optimizada - Julio 2025**