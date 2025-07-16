# CLAUDE.md

Este archivo proporciona orientación a Claude Code (claude.ai/code) cuando trabaja con código en este repositorio.

## 🚨 **IMPORTANTE - ACTUALIZACIÓN 15/07/2025**

### ⚡ **Auto-Context Loading ACTIVO**
El contexto completo del proyecto ahora se carga **automáticamente** vía `.github/copilot-instructions.md`. 

**EL SUPERPROMPT MANUAL YA NO ES NECESARIO:**
```bash
# ❌ OBSOLETO - Ya no usar:
🎯 Cargar contexto Forestech completo: MCPs + Wrappers + CLAUDE.md + Git

# ✅ NUEVO - Automático al abrir repo:
Contexto se carga automáticamente desde .github/copilot-instructions.md
```

### 🔄 **Migración Completada**
- ✅ **MCPs**: Configuraciones migradas a copilot-instructions.md
- ✅ **AI Preferences**: github-cli wrapper prioridad establecida
- ✅ **Project Context**: Arquitectura y patrones integrados
- ✅ **Firebase Integration**: liquidacionapp-62962 access automático
- ✅ **Git Workflow**: Branch management y CI/CD patterns incluidos

### 🎯 **Nuevo Flujo de Trabajo**
1. **Abrir repositorio** → Contexto se carga automáticamente
2. **Usar MCPs** → Prioridad github-cli > github > memory > filesystem > firebase
3. **Evitar comandos directos** → Usar MCP wrappers internamente
4. **Documentación sync** → Preguntar por actualizaciones a claude.md

#### 🤖 **MCPs GitHub Copilot Agent**
1. **📂 github-forestech**: Gestión inteligente repositorio
2. **⏰ time-bogota**: Zona horaria América/Bogotá
3. **🧠 sequential-thinking-es**: Análisis paso a paso español
4. **💾 memory-forestech**: Memoria específica proyecto
5. **🔥 firebase**: Integración Firebase MCP server ⭐ **NUEVO**
6. **🐙 github-cli**: Wrapper GitHub CLI automático ⭐ **CONFIGURADO**

#### 🔧 **PREFERENCIAS PERMANENTES DEL AI** ⭐ **CRÍTICO**
**CONFIGURACIÓN ESTABLECIDA EL 14/07/2025:**
- **SIEMPRE usar github-cli MCP wrapper** para operaciones GitHub
- **NUNCA ejecutar comandos gh** directamente en terminal
- **Usar herramientas MCP automáticamente** como parte de procesos internos
- **Evitar comandos directos en terminal** - preferir herramientas MCP
- **Configuración persistente** entre sesiones en `.vscode/ai-preferences.json`

**PRIORIDAD MCPs:** github-cli > github > memory > filesystem > firebase > notion

#### 🚀 **COMANDO MAESTRO - ESTADO MIGRADO** ⚠️ **OBSOLETO**
**SUPERPROMPT ANTERIOR (Ya no necesario):**
```
🎯 Cargar contexto Forestech completo: MCPs + Wrappers + CLAUDE.md + Git
```

**✅ MIGRACIÓN COMPLETADA AL 15/07/2025:**
- ❌ **Comando manual obsoleto** - Ya no usar
- ✅ **Auto-loading activo** - Contexto se carga automáticamente vía `.github/copilot-instructions.md`
- ✅ **MCPs configurados** - Prioridad github-cli > github > memory > filesystem > firebase > notion
- ✅ **AI Preferences** - Configuración persistente establecida
- ✅ **Firebase Integration** - liquidacionapp-62962 acceso automático

**NUEVO FLUJO:**
1. Abrir repositorio → Contexto automático
2. Usar MCPs → Prioridad establecida
3. Sync documentación → Preguntar por actualizaciones a claude.md

**NOTA:** `scripts/master-context-loader.sh` disponible como fallback legacy

#### 🔥 **Firebase MCP Server - Integración Completa** ⭐ **IMPLEMENTADO**
- **Proyecto**: liquidacionapp-62962 ✅ CONFIGURADO
- **Usuario**: cardenasever072@gmail.com ✅ AUTENTICADO  
- **Características**: firestore, auth, storage
- **Estado**: Integrado en VS Code Copilot workflow

**Capacidades disponibles:**
- ✅ Gestión proyectos Firebase
- ✅ Consultas Firestore en tiempo real
- ✅ Gestión usuarios Authentication
- ✅ Reglas de seguridad Firestore/Storage
- ✅ Firebase Cloud Messaging
- ✅ Consultas a Gemini in Firebase

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

### 📋 **SYNC DOCUMENTACIÓN - NUEVO PROTOCOLO**
**Claude debe preguntar activamente:**
```
📝 ¿Debo actualizar la documentación en CLAUDE.md con los cambios/patrones identificados en esta sesión?

✅ Sí - Actualizar claude.md con nuevos patrones
❌ No - Solo aplicar cambios al código
🔄 Parcial - Solo aspectos específicos
```

**Aspectos a sincronizar:**
- 🏗️ **Nuevos patrones arquitectura** identificados
- 🔧 **Configuraciones MCP** actualizadas  
- 🚀 **Workflows CI/CD** modificados
- 📊 **Estado del proyecto** actualizado
- 🐛 **Problemas resueltos** documentados

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

### 📋 **Historial de Cambios Recientes - Julio 2025**

#### 🔓 **16/07/2025 - Control Total Administrativo**
- **Commit**: `70e4f7d6` - "🔓 Dar control total de categorías al administrador"
- **Funcionalidad**: Sistema de control total de categorías implementado
- **Impacto**: Administrador tiene libertad completa para configurar sistema
- **Archivos**: 33 archivos modificados, +3,298 líneas, -292 líneas
- **Características**: Edición/eliminación sin restricciones, botón "Eliminar Todas"

#### 🔧 **15/07/2025 - Auto-Context Loading**
- **Migración**: Contexto automático vía `.github/copilot-instructions.md`
- **Obsolescencia**: Superprompt manual ya no necesario
- **Configuración**: MCPs priority system establecido automáticamente

#### 🐛 **14/07/2025 - Fix InventoryCards**
- **PR #21**: Error InventoryCards undefined color resuelto
- **Estado**: Sistema Combustibles 100% operativo en producción

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
5. **🔥 firebase**: Firebase MCP server oficial

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

## 🔓 **SISTEMA DE CONTROL ADMINISTRATIVO TOTAL**

### ⚡ **Implementación Completada - 16/07/2025**

**Commit**: `70e4f7d6` - "🔓 Dar control total de categorías al administrador"

### 🎯 **Características Principales**

#### 🗑️ **Eliminación de Restricciones**
- **Categorías predeterminadas**: Eliminadas completamente - no hay categorías intocables
- **DEFAULT_VEHICLE_CATEGORIES**: Convertido en array vacío `[]`
- **Validaciones restrictivas**: Removidas de servicios y componentes
- **Badges "Predeterminada"**: Eliminados de la interfaz

#### ✏️ **Edición Completa**
- **Todas las categorías**: Completamente editables por administrador
- **Campos personalizados**: Sin restricciones de modificación
- **Tipos de combustible**: Configurables libremente
- **Íconos y colores**: Personalizables sin límites

#### 🗑️ **Eliminación Flexible**
- **Eliminación individual**: Disponible para todas las categorías
- **Única restricción**: Solo se bloquea si hay vehículos asignados
- **Botón "Eliminar Todas"**: Reset completo del sistema de categorías
- **Confirmación de seguridad**: Modal de confirmación antes de eliminar

### 📂 **Archivos Modificados**

#### 🔧 **Core System**
- `src/data/vehicleCategories.js`: DEFAULT_VEHICLE_CATEGORIES = []
- `src/services/vehicleCategoriesService.js`: Restricciones eliminadas
- `src/services/resetVehicleCategoriesService.js`: Reset completo implementado

#### 🖥️ **UI Components**
- `src/components/Vehicles/VehicleCategoriesManager.jsx`: Control total habilitado
- Interfaz simplificada sin badges restrictivos
- Botones siempre activos para edición/eliminación

### 🎮 **Funcionalidades Disponibles**

1. **✨ Crear categorías**: Desde cero con total libertad
2. **✏️ Editar cualquier categoría**: Sin restricciones de "predeterminadas"
3. **🗑️ Eliminar categorías**: Individuales o todas de una vez
4. **🔧 Configurar campos**: Personalizados sin limitaciones
5. **⛽ Definir combustibles**: Tipos configurables libremente
6. **🎨 Personalizar apariencia**: Íconos y colores sin límites

### 🚀 **Impacto en el Sistema**

#### ✅ **Beneficios**
- **Flexibilidad máxima**: Administrador tiene control total
- **Configuración libre**: Sin restricciones artificiales
- **Mantenimiento simplificado**: Menos código condicional
- **UX mejorada**: Interfaz más limpia y consistente

#### ⚠️ **Consideraciones**
- **Responsabilidad del admin**: Mayor libertad requiere más cuidado
- **Backup recomendado**: Antes de hacer cambios masivos
- **Vehículos existentes**: Verificar asignaciones antes de eliminar categorías

---

**📌 Documentación completa actualizada y optimizada - Julio 2025**

## 🔥 Firebase MCP Server Integration

### ✅ Estado: CONFIGURADO Y LISTO

**Configuración Completada:**
- ✅ Firebase CLI autenticado (cardenasever072@gmail.com)
- ✅ Proyecto configurado: liquidacionapp-62962 (LiquidacionApp)
- ✅ MCP server configurado en `.vscode/mcp.json`
- ✅ Scripts de verificación y mantenimiento creados

**Archivos Configurados:**
```
.vscode/mcp.json              # Configuración MCP para VS Code Copilot
scripts/test-firebase-mcp.sh  # Script de verificación del sistema
scripts/restart-vscode-mcp.sh # Script para reiniciar VS Code con MCP
```

**Capacidades Habilitadas:**
- 🔥 Consultas directas a Firestore desde Copilot
- 👤 Gestión de usuarios de Authentication
- 📦 Operaciones con Firebase Storage
- 🤖 Gemini in Firebase para asistencia avanzada

**Comandos de Mantenimiento:**
```bash
# Verificar estado del sistema
./scripts/test-firebase-mcp.sh

# Reiniciar VS Code con MCP
./scripts/restart-vscode-mcp.sh
```

**Uso en VS Code Copilot:**
```
@firebase ¿cuáles son las colecciones en mi Firestore?
@firebase lista los usuarios autenticados
@firebase ayúdame con las reglas de seguridad
@firebase optimiza esta consulta: [tu consulta]
```

## 📄 Notion Integration

### ✅ Estado: CONFIGURADO PARA AUTOMATIZACIÓN

**Token de Integración Configurado:**
- ✅ Token: `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`
- ✅ Cliente instalado: @notionhq/client
- ✅ Scripts de automatización creados
- ✅ Contenido preparado para subida

**Archivos de Automatización:**
```
scripts/notion-integration.js   # Script completo de integración
scripts/notion-simple.js        # Script simplificado
scripts/notion-manual.js        # Helper para copia manual
scripts/setup-notion.sh         # Setup automático
NOTION-READY-Combustibles.md    # Contenido listo para Notion
```

**Estado Actual:**
- ✅ API configurada y funcional
- ⚠️  Requiere permisos adicionales en Notion workspace
- ✅ Alternativa manual funcionando perfectamente

**Comandos Disponibles:**
```bash
# Automatización completa (requiere permisos workspace)
node scripts/notion-integration.js

# Preparar contenido para copia manual
node scripts/notion-manual.js

# Setup inicial
./scripts/setup-notion.sh
```

**Uso Recomendado:**
1. **Manual inmediato**: Copiar contenido de `NOTION-READY-Combustibles.md`
2. **Automatización futura**: Configurar permisos completos en notion.so/my-integrations