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
- Módulo inventario CRUD completado (Enero 2025)
- Dashboard operativo con navegación
- Próximos: Movimientos, Vehículos, Reportes
- URL: https://forestechdecolombia.com.co/combustibles/

### 🔧 **SHARED**
📖 **[Ver docs/shared/](./docs/shared/README.md)**
- Firebase compartido entre apps
- Sistema roles y permisos unificado
- Componentes UI reutilizables (planificado)

### 📋 **GENERAL**
📖 **[Ver docs/general/](./docs/general/README.md)**
- Configuración monorepo completa
- Multi-app Firebase hosting
- Scripts desarrollo y deploy

## Estructura Monorepo

```
forestech/                      # Monorepo principal
├── alimentacion/               # 🍽️ App liquidaciones ✅ FUNCIONAL
├── combustibles/               # ⛽ App combustibles 🔄 EN DESARROLLO
├── shared/                     # 🔧 Recursos compartidos
├── docs/                       # 📚 Documentación modular ✅ NUEVA
├── public/                     # 🌐 Build output Firebase
├── firebase.json               # Multi-app routing ✅
└── package.json               # Scripts monorepo ✅
```

## Comandos Esenciales

```bash
# Desarrollo
npm run dev:alimentacion    # Puerto 5173
npm run dev:combustibles    # Puerto 5174

# Build
npm run build:all           # Build ambas apps
npm run deploy              # Deploy Firebase

# Linting
npm run lint:alimentacion
npm run lint:combustibles
```

## URLs Activas

- 🍽️ **Alimentación**: https://forestechdecolombia.com.co/alimentacion/
- ⛽ **Combustibles**: https://forestechdecolombia.com.co/combustibles/
- 📋 **Firebase**: https://liquidacionapp-62962.web.app/

## 🚀 Mejores Prácticas Claude

### Flujo de Trabajo Obligatorio
1. **TodoWrite** para tareas complejas (3+ pasos)
2. **Búsqueda contexto** antes de implementar  
3. **Anuncio del plan** antes de ejecutar
4. **Verificación automática** (lint, build)
5. **Commit automático** con mensaje descriptivo

### Advertencias Críticas
- **NUNCA** crear usuarios Firebase Auth desde frontend
- **USAR** sistema invitaciones para nuevos usuarios
- **SEGUIR** patrones existentes del proyecto
- **EJECUTAR** lint/build antes de commits

### Comunicación Proactiva
```
🔄 Implementando: [descripción]
💡 Decisión técnica: Uso [patrón] porque [justificación]
📁 Archivos modificados: [lista]
✅ Verificaciones: lint ✅ build ✅
```

## 🔍 **PROTOCOLO SUPERVISIÓN GEMINI CLI**

### 📋 **Claude CLI como Supervisor**
**RESPONSABILIDADES:**
- **Análisis técnico** de cada implementación de Gemini CLI
- **Revisión de código** y mejores prácticas  
- **Evaluación de patrones** del proyecto
- **Implementación de mejoras** cuando sea necesario
- **Commits de supervisión** explicando cambios aplicados

### 🔄 **Flujo de Supervisión**
1. **Gemini CLI** hace cambios al proyecto
2. **Claude CLI** analiza la implementación 
3. **Evaluación técnica** con criterios:
   - Calidad técnica (/10)
   - Seguimiento de patrones (/10)
   - Performance (/10)
   - Mantenibilidad (/10)
4. **Implementar mejoras** si es necesario
5. **Commit supervisión** con mensaje: `refactor: Superviso trabajo Gemini CLI - [motivo específico]`

### 📊 **Criterios de Evaluación**
- ✅ **Aprobar**: Implementación correcta, sin cambios necesarios
- ⚠️ **Mejorar**: Implementación funcional, optimizaciones aplicadas  
- ❌ **Rehacer**: Implementación problemática, cambios mayores requeridos

### 🤝 **Protocolo de Commits**
```bash
# Formato commit de supervisión
git commit -m "refactor: Superviso trabajo Gemini CLI - [específica el motivo]

- Motivo del cambio: [explicación]
- Mejora aplicada: [descripción técnica] 
- Patrón seguido: [justificación]

Hecho con Claude CLI (supervisando Gemini CLI)"
```

## 📅 **REGISTRO DE IMPLEMENTACIONES RECIENTES**

### 🔥 **Enero 28, 2025 - Mejoras Combustibles**
**Commit:** `feat(combustibles): Implementar mejoras completas en vehículos y movimientos`

#### ✅ **Funcionalidades Implementadas:**
1. **Botón "Agregar Vehículo"** - Ahora visible para todos los roles permitidos
2. **Tipos de vehículos expandidos** - 16 categorías (motosierra, excavadora, etc.)
3. **Creación libre de tipos personalizados** - UI intuitiva con Enter/Escape
4. **Selector dinámico de vehículos** - Para movimientos de salida con dropdown

#### 🔧 **Correcciones Técnicas:**
- Permisos `userProfile?.role` en VehiclesMain y MovementsMain
- Integración completa con `getAllVehicles()` service
- UI optimizada con estados de carga y validaciones específicas
- Compatibilidad completa con funcionalidades existentes

#### 🌐 **URLs Actualizadas:**
- ⛽ **Combustibles**: https://forestechdecolombia.com.co/combustibles/ ✅ DESPLEGADO

---

**📌 IMPORTANTE**: Esta documentación modular mejora el rendimiento de Claude Code. Cada módulo contiene detalles específicos para evitar sobrecargar el contexto principal.