# CLAUDE.md

Este archivo proporciona orientación a Claude Code (claude.ai/code) cuando trabaja con código en este repositorio.

## 🎯 **SELECTOR DE PROYECTO - IMPORTANTE**

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

## 🧠 **PENSAMIENTO PASO A PASO OBLIGATORIO - MÁXIMA PRIORIDAD**

**PARA CADA PROMPT/CONSULTA/TAREA, CLAUDE DEBE SEGUIR ESTE ANÁLISIS PROFUNDO:**

### 📋 **TEMPLATE OBLIGATORIO DE ANÁLISIS**

1. **🎯 CONTEXTO FORESTECH**: 
   - ¿Es ALIMENTACION/COMBUSTIBLES/SHARED/GENERAL?
   - ¿Qué módulos/componentes específicos están involucrados?
   - ¿Cuál es el impacto en el sistema general?

2. **📊 ANÁLISIS CUANTITATIVO**:
   - Números específicos, métricas, datos medibles
   - Performance actual vs esperado
   - Cálculos de capacidad, stock, usuarios, tiempos
   - Costos/beneficios cuantificables

3. **🔧 EVALUACIÓN TÉCNICA**:
   - Arquitectura actual y limitaciones
   - Patrones de código existentes a seguir
   - Dependencias e integraciones afectadas
   - Compatibilidad con Firebase/React/Vite

4. **⚖️ ESCENARIOS MÚLTIPLES**:
   - Mínimo 2-3 enfoques diferentes comparados
   - Pros y contras de cada opción
   - Complejidad de implementación vs beneficios
   - Impacto a corto/mediano/largo plazo

5. **🚨 ANÁLISIS RIESGO-BENEFICIO**:
   - ¿Qué puede fallar? ¿Probabilidad de fallo?
   - ¿Cómo afecta la disponibilidad del sistema?
   - ¿Impacto en usuarios finales?
   - ¿Reversibilidad de cambios?

6. **💡 RECOMENDACIÓN JUSTIFICADA**:
   - Decisión final basada en análisis completo
   - Justificación cuantificada y técnica
   - Pasos específicos de implementación
   - Métricas de éxito para validar decisión

### ⚡ **INTEGRACIÓN CON MÁXIMA EFICIENCIA**
- Usar múltiples MCPs simultáneamente para análisis
- Búsquedas paralelas de contexto y datos
- Validaciones simultáneas de múltiples escenarios
- Operaciones concurrentes siempre que sea posible

## 📚 Documentación Modular

La documentación completa está organizada en módulos para mejor rendimiento:

### 🍽️ **ALIMENTACION** 
📖 **[Ver docs/alimentacion/](./docs/alimentacion/README.md)**
- Sistema de liquidaciones completamente funcional
- Firebase Analytics + FCM + Sistema roles
- Panel admin con invitaciones + notificaciones automáticas
- URL: https://forestechdecolombia.com.co/alimentacion/

### ⛽ **COMBUSTIBLES**
📖 **[Ver docs/combustibles/](./docs/combustibles/README.md)**
- **SISTEMA 100% COMPLETADO** 
- ✅ Inventario, Movimientos, Vehículos, Productos, Proveedores, Mantenimiento, Auth/Admin
- ✅ **MÓDULO REPORTES COMPLETO** ⭐ **NUEVO**
  - Dashboard ejecutivo con KPIs en tiempo real
  - Reportes de inventario y alertas de stock
  - Análisis de vehículos y consumo por horómetro
  - Reportes financieros y proyecciones
  - Exportación CSV/JSON y filtros avanzados
- ✅ Sistema completo operativo y desplegado
- URL: https://forestechdecolombia.com.co/combustibles/

### 🔧 **SHARED**
📖 **[Ver docs/shared/](./docs/shared/README.md)**
- Firebase compartido entre apps
- Sistema roles y permisos unificado
- Componentes UI reutilizables

### 📋 **GENERAL**
📖 **[Ver docs/general/](./docs/general/README.md)**
- Configuración monorepo completa
- Multi-app Firebase hosting
- Scripts desarrollo y deploy

### 🏢 **EMPRESARIAL** ⭐ **NUEVO**
📖 **[Ver docs/empresarial/](./docs/empresarial/README.md)**
- Documentación empresarial completa de Forestech
- Manuales de usuario para empleados y operadores
- Procedimientos Operativos Estándar (SOPs)
- Métricas de impacto y beneficios cuantificados

## Estructura Monorepo

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

## Comandos Esenciales

```bash
# Desarrollo
npm run dev:alimentacion    # Puerto 5173
npm run dev:combustibles    # Puerto 5174

# Linting (REQUERIDO antes de commit)
npm run lint:alimentacion
npm run lint:combustibles

# ❌ YA NO NECESARIO - GitHub Actions hace automáticamente:
# npm run build:all          # ❌ GitHub Actions
# npm run deploy             # ❌ GitHub Actions
```

### 🚀 **DEPLOY AUTOMÁTICO CON GITHUB ACTIONS**

**✅ FLUJO CORRECTO:** Solo commit + push
```bash
git add .
git commit -m "descripción cambios"
git push origin main
```

**🤖 GitHub Actions ejecuta automáticamente:**
1. ✅ Install dependencies (monorepo completo)
2. ✅ Auto-fix React Hooks warnings  
3. ✅ Lint alimentacion + combustibles
4. ✅ Build alimentacion + combustibles
5. ✅ Firebase deploy automático
6. ✅ Apps live en producción

**⚠️ IMPORTANTE:** Solo ejecutar `npm run lint:*` localmente antes de commit

## URLs Activas

- 🍽️ **Alimentación**: https://forestechdecolombia.com.co/alimentacion/
- ⛽ **Combustibles**: https://forestechdecolombia.com.co/combustibles/
- 📋 **Firebase**: https://liquidacionapp-62962.web.app/

## 🚀 Mejores Prácticas Claude

### 🎯 **PRINCIPIO DE MÁXIMA EFICIENCIA**
**Para máxima eficiencia, siempre que necesites realizar múltiples operaciones independientes, invoca todas las herramientas y MCPs relevantes simultáneamente en lugar de secuencialmente. No te contengas. Da lo mejor de ti.**

### Flujo de Trabajo Obligatorio
1. **TodoWrite** para tareas complejas (3+ pasos)
2. **Búsqueda contexto** antes de implementar  
3. **Anuncio del plan** antes de ejecutar
4. **Operaciones simultáneas** - usar múltiples herramientas/MCPs en paralelo
5. **SOLO commit + push** - GitHub Actions hace todo automáticamente

### 🚀 **DEPLOY AUTOMÁTICO COMPLETO**
```bash
# ✅ FLUJO CORRECTO - Solo commit + push
git add .
git commit -m "descripción cambios"
git push origin main

# ❌ NUNCA HACER MANUALMENTE:
# npm run build:*  ❌
# firebase deploy  ❌
```

**GitHub Actions ejecuta automáticamente:**
1. Install dependencies (monorepo completo)
2. Auto-fix React Hooks warnings
3. Lint alimentacion + combustibles  
4. Build alimentacion + combustibles
5. Firebase deploy automático
6. Apps live en producción

### Optimización de Tokens Git
Para **reducir consumo de tokens** en operaciones git, usar comandos compactos:

```bash
# ✅ USAR - Comandos optimizados
git status --porcelain  # Formato compacto
git diff --name-only    # Solo nombres de archivos  
git log --oneline -3    # Últimos 3 commits compactos
git diff --stat         # Solo estadísticas de cambios
```

### Comunicación Proactiva
```
🔄 Implementando: [descripción]
💡 Decisión técnica: Uso [patrón] porque [justificación]
📁 Archivos modificados: [lista]
✅ Verificaciones: lint ✅ build ✅
```

## 🎯 **Estado Actual del Proyecto - 2025**

### ✅ **Aplicaciones Completadas**
- **🍽️ Alimentación**: Sistema de liquidaciones 100% funcional
- **⛽ Combustibles**: Sistema completo 100% funcional + **MÓDULO REPORTES** ⭐

### 🔧 **Infraestructura**
- **Firebase**: Multi-app hosting configurado
- **Dominio**: forestechdecolombia.com.co operativo
- **CI/CD**: Deploy automático funcional con GitHub Actions
- **MCPs**: 8 herramientas integradas con Claude Code

### 🤖 **MCPs CONFIGURADOS - ANÁLISIS COMPLETO**

**📍 Archivo de configuración**: `/home/evert/.claude.json` → sección `mcpServers`
**📊 Total MCPs activos**: 8 (optimizados para Forestech) ⭐ **NUEVO: Time MCP**

#### 🔧 **MCPs Principales y Sus Beneficios**

1. **🧠 memory** - *Memoria Persistente*
   - **Configuración**: `@modelcontextprotocol/server-memory`
   - **Beneficio Forestech**: Almacena patrones de bugs, decisiones arquitectónicas, contexto entre sesiones
   - **Uso específico**: Recordar configuraciones Firebase, patrones de componentes React, historiales de refactoring

2. **🤖 gemini-advanced** - *Análisis Avanzado IA*
   - **Configuración**: `git+https://github.com/DiversioTeam/gemini-cli-mcp.git`
   - **Beneficio Forestech**: Análisis profundo de código, optimización de consultas Firestore, debugging complejo
   - **Uso específico**: Optimizar cálculos de liquidaciones, análisis de performance en reportes

3. **🔍 gemini-server** - *Búsqueda y Chat IA*
   - **Configuración**: `@choplin/mcp-gemini-cli`
   - **Beneficio Forestech**: Research técnico, soluciones a problemas específicos, documentación actualizada
   - **Uso específico**: Investigar nuevas funcionalidades, resolver errores de integración Firebase

4. **📁 filesystem-server** - *Gestión Avanzada de Archivos*
   - **Configuración**: `@modelcontextprotocol/server-filesystem`
   - **Beneficio Forestech**: Refactoring masivo, búsqueda de código, gestión de componentes
   - **Uso específico**: Migrar componentes entre módulos, búsqueda de patrones en el monorepo

5. **🧩 sequential-thinking** - *Análisis Paso a Paso*
   - **Configuración**: `@modelcontextprotocol/server-sequential-thinking`
   - **Beneficio Forestech**: Planificación de funcionalidades complejas, diseño de arquitectura
   - **Uso específico**: Diseñar nuevos módulos, planificar migraciones de datos

6. **📚 notion** - *Documentación Empresarial*
   - **Configuración**: `@notionhq/notion-mcp-server`
   - **Estado**: ⚠️ Funcional (requiere token actualizado)
   - **Beneficio Forestech**: Manuales de usuario, SOPs, documentación empresarial
   - **Uso específico**: Crear guías para operadores, documentar procesos de negocio

7. **📦 package-helper** - *Gestión de Dependencias*
   - **Configuración**: Filesystem especializado en `package.json`
   - **Beneficio Forestech**: Gestión eficiente de dependencias del monorepo
   - **Uso específico**: Actualizar dependencias, resolver conflictos de versiones

8. **⏰ time** - *Funciones de Tiempo* ⭐ **NUEVO**
   - **Configuración**: `uvx mcp-server-time`
   - **Beneficio Forestech**: Timestamps precisos, conversión de zonas horarias, análisis temporal
   - **Uso específico**: Logs de movimientos con horarios exactos, reportes por períodos, cálculos de horómetro
   - **Funciones**: `get_current_time`, `convert_time` con soporte IANA timezone

#### 🎯 **CASOS DE USO POR MÓDULO**

**⛽ COMBUSTIBLES:**
- **memory**: Recordar patrones de cálculo de consumo, configuraciones de horómetro
- **gemini-advanced**: Optimizar algoritmos de inventario, análisis de reportes
- **filesystem-server**: Gestionar componentes de vehículos, productos, movimientos
- **sequential-thinking**: Planificar nuevas funcionalidades de reportes

**🍽️ ALIMENTACIÓN:**
- **memory**: Mantener historial de fórmulas de liquidación, configuraciones
- **gemini-advanced**: Optimizar cálculos de deducción, validar lógica de negocio
- **filesystem-server**: Gestionar componentes de dashboard, liquidaciones
- **sequential-thinking**: Diseñar mejoras en notificaciones automáticas

**🔧 SHARED:**
- **filesystem-server**: Gestionar componentes reutilizables, utilidades
- **package-helper**: Mantener dependencias compartidas entre módulos
- **memory**: Almacenar patrones de configuración Firebase
- **time**: Timestamps consistentes en logs y utilidades compartidas

#### 🚀 **OPTIMIZACIONES RECOMENDADAS**

1. **Uso Simultáneo**: Invocar múltiples MCPs en paralelo para máxima eficiencia
2. **Memoria Específica**: Almacenar patrones específicos de Forestech en memory MCP
3. **Análisis Regular**: Usar gemini-advanced semanalmente para optimización de código
4. **Búsqueda Eficiente**: Aprovechar filesystem-server para refactoring masivo
5. **Planificación Estructurada**: Usar sequential-thinking para funcionalidades complejas

#### 📝 **CONFIGURACIÓN MANUAL DE NUEVOS MCPs**

Para agregar nuevos MCPs manualmente:

```bash
# Ubicación del archivo de configuración
nano /home/evert/.claude.json

# Agregar en la sección "mcpServers":
{
  "mcpServers": {
    "nuevo-mcp": {
      "type": "stdio",
      "command": "comando",
      "args": ["argumentos"],
      "env": {
        "VARIABLE": "valor"
      }
    }
  }
}
```

**⚠️ IMPORTANTE**: Reiniciar Claude Code después de modificar la configuración

#### 🔮 **MCP FIREBASE - PRÓXIMA MEJORA REVOLUCIONARIA**

**🎯 Potencial más alto para optimizar Forestech**

**⚠️ Estado actual**: No implementado (requiere configuración previa)

**📋 Requisitos de instalación**:
```bash
# 1. Instalar Firebase CLI globalmente
npm install -g firebase-tools

# 2. Autenticar con Firebase
firebase login

# 3. Configurar proyecto (usar ID del proyecto Forestech)
firebase use liquidacionapp-62962
```

**⚙️ Configuración MCP Firebase**:
```json
{
  "firebase": {
    "type": "stdio", 
    "command": "npx",
    "args": ["-y", "firebase-tools@latest", "experimental:mcp"],
    "env": {}
  }
}
```

**🚀 Beneficios REVOLUCIONARIOS para Forestech**:
- **Consultas directas Firestore**: Sin escribir código temporal
- **Gestión usuarios Auth**: Verificar roles, permisos, estado usuarios
- **Debugging en tiempo real**: Inspeccionar colecciones, documentos
- **Análisis de datos**: Queries complejas desde conversación natural
- **Reglas de seguridad**: Validar y testear reglas Firestore
- **Métricas operativas**: Acceso directo a Analytics, Performance

**💡 Casos de uso específicos**:
- "¿Cuántos movimientos de combustible hubo esta semana?"
- "Mostrar últimos usuarios registrados en alimentación"
- "Verificar stock actual de diesel en todas las ubicaciones"
- "Listar vehículos con horómetro > 1000 horas"

**🔧 Recomendación**: Configurar Firebase CLI para desbloquear esta capacidad

### 📚 **Testing Notion MCP - Resultados (Julio 2025)**

**Estado**: ⚠️ Requiere configuración adicional

#### ✅ **Funcionalidades Testeadas**
- Conexión básica al workspace establecida
- APIs de usuario y búsqueda operativas
- Integración MCP correctamente configurada

#### ❌ **Limitaciones Identificadas**
- Token de autorización inválido o expirado
- Permisos de integración insuficientes
- Workspace vacío requiere página padre inicial

#### 💡 **Utilidades Potenciales para Forestech**
- **Documentación Empresarial**: Manuales SOPs y procedimientos
- **Reportes Ejecutivos**: Dashboards consolidados
- **Colaboración**: Comunicación inter-departamental
- **Gestión Operativa**: Calendarios y tracking proyectos

#### 🔧 **Pasos para Activación Completa**
1. Regenerar token de integración válido
2. Configurar permisos: Read, Update, Insert content
3. Crear página inicial como contenedor principal
4. Migrar documentación local creada a Notion

**Alternativa implementada**: Documentación empresarial local en `/docs/empresarial/`

---

**📌 IMPORTANTE**: Esta documentación se mantiene actualizada. Cualquier cambio en el proyecto debe reflejarse aquí para mantener continuidad entre sesiones de Claude Code.

**Última actualización**: Enero 2025 - **CONFIGURACIÓN MCPs MEJORADA** ⭐ 
- **MCP Time agregado exitosamente** - Funciones temporales y timestamps precisos
- 8 MCPs configurados y optimizados para máxima eficiencia en Forestech
- Documentación detallada de casos de uso específicos por módulo  
- **MCP Firebase evaluado** - Próxima mejora revolucionaria identificada
- Guía completa para configuración manual de nuevos MCPs
- Sistema de combustibles 100% funcional con módulo de reportes completo