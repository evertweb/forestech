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
- **SISTEMA 100% COMPLETADO** - Enero 2025
- ✅ Inventario, Movimientos, Vehículos, Productos, Proveedores, Mantenimiento, Auth/Admin
- ✅ Sistema completo operativo y desplegado
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

### Optimización de Tokens Git
Para **reducir consumo de tokens** en operaciones git, usar comandos compactos:

```bash
# ❌ EVITAR - Consume muchos tokens
git diff          # Salida masiva de cambios
git status        # Salida verbose
git log           # Log detallado

# ✅ USAR - Comandos optimizados
git status --porcelain  # Formato compacto
git diff --name-only    # Solo nombres de archivos  
git log --oneline -3    # Últimos 3 commits compactos
git diff --stat         # Solo estadísticas de cambios

# 🔧 Para commits, ejecutar en paralelo:
# git status --porcelain && git diff --name-only && git log --oneline -3
```

**Ahorro**: De ~4000 líneas a ~10 líneas por operación git

### Comunicación Proactiva
```
🔄 Implementando: [descripción]
💡 Decisión técnica: Uso [patrón] porque [justificación]
📁 Archivos modificados: [lista]
✅ Verificaciones: lint ✅ build ✅
```

## 🎯 **Estado Actual del Proyecto**

### ✅ **Aplicaciones Completadas**
- **🍽️ Alimentación**: Sistema de liquidaciones 100% funcional
- **⛽ Combustibles**: Sistema de gestión de stock 100% funcional

### 🔧 **Infraestructura**
- **Firebase**: Multi-app hosting configurado
- **Dominio**: forestechdecolombia.com.co operativo
- **CI/CD**: Deploy automático funcional

---

**📌 IMPORTANTE**: Esta documentación modular mejora el rendimiento de Claude Code. Cada módulo contiene detalles específicos para evitar sobrecargar el contexto principal.

## 📝 **Últimas Actualizaciones**

### ⛽ **COMBUSTIBLES - Enero 30, 2025**
#### 🚀 **Nueva Funcionalidad: Cuadro de Stock en Tiempo Real**

**📍 Ubicación**: `combustibles/src/components/Movements/MovementModal.jsx`

#### ✨ **Funcionalidades Implementadas**:

1. **📊 Cuadro de Stock Visual**:
   - Muestra stock disponible en tiempo real para salidas/transferencias
   - Información visual con iconos y colores según estado (✅ disponible, ⚠️ bajo, 🚫 insuficiente)
   - Barra de progreso de capacidad utilizada
   - Cálculo automático de stock restante después del movimiento

2. **🔍 Validación Inteligente**:
   - Validación en tiempo real de cantidad vs stock disponible
   - Prevención de movimientos con stock insuficiente
   - Alertas cuando el stock quedará bajo (< 20% del stock actual)
   - Mensajes contextuales según la situación de stock

3. **🎨 Interfaz Mejorada**:
   - Cuadro responsive con gradientes y colores dinámicos
   - Estados visuales: `available` (verde), `warning` (amarillo), `critical` (rojo)
   - Información detallada: stock disponible, stock restante, porcentaje de capacidad
   - Solo visible para movimientos de salida y transferencia

#### 📁 **Archivos Modificados**:
- `combustibles/src/components/Movements/MovementModal.jsx` - Lógica principal y renderizado
- `combustibles/src/components/Movements/Movements.css` - Estilos CSS del cuadro de stock
- `combustibles/src/services/inventoryService.js` - Corrección de variable no utilizada

#### ✅ **Verificaciones Completadas**:
- Lint: ✅ (solo advertencias menores de dependencias)
- Build: ✅ Construcción exitosa
- Funcionalidad: ✅ Cuadro de stock operativo en tiempo real

#### 🔧 **Integración Técnica**:
- Utiliza función existente `validateStockAvailability` de `calculations.js`
- Cálculo automático en tiempo real cuando cambian: tipo, combustible, ubicación, cantidad
- Estados reactivos con `useState` y `useEffect`
- CSS responsive con variables CSS y gradientes

---

### ⛽ **COMBUSTIBLES - Enero 31, 2025**
#### 🔧 **CORRECCIÓN CRÍTICA: Sistema de Transferencias Completo**

**📍 Problema Solucionado**: Transferencias de combustible no funcionaban correctamente - solo restaban del origen pero NO sumaban al destino, causando pérdida de stock en el sistema.

#### ✅ **Funcionalidades Implementadas**:

1. **🔄 Lógica Completa de Transferencias**:
   - Implementación automática de suma al destino durante transferencias
   - Transacciones atómicas para garantizar consistencia origen→destino
   - Creación automática de inventario destino si no existe
   - Auditoría completa con registro detallado de movimientos

2. **🔍 Validaciones Robustas**:
   - Validación de ubicaciones válidas según `OPERATIONAL_LOCATIONS`
   - Prevención de transferencias a la misma ubicación
   - Validación de stock suficiente antes de transferir
   - Mensajes de error específicos y descriptivos

3. **↩️ Sistema de Reversión Mejorado**:
   - Reversión completa de transferencias (origen + destino)
   - Estrategias de fallback para inventario huérfano
   - Logging detallado para auditoría de reversiones
   - Manejo robusto de casos edge

4. **🛡️ Funciones de Utilidad**:
   - `handleTransferToDestination()` - Manejo de suma al destino
   - `revertTransferFromDestination()` - Reversión de destino
   - `isValidLocation()` - Validación de ubicaciones
   - Integración con `OPERATIONAL_LOCATIONS` centralizado

#### 📁 **Archivos Modificados**:
- `combustibles/src/services/movementsService.js` - Lógica principal corregida
- Importación de `constants/locations.js` para validaciones

#### ✅ **Verificaciones Completadas**:
- Lint: ✅ (solo warnings menores de dependencias)
- Build: ✅ Construcción exitosa sin errores
- Validación funcional: ✅ Sistema de transferencias operativo

#### 🔧 **Mejoras Técnicas**:
- Uso de aritmética precisa (`preciseAdd`, `preciseSubtract`, `preciseRound`)
- Transacciones Firestore atómicas para consistencia
- Logging detallado para debugging y auditoría
- Validaciones preventivas antes de operaciones

#### 🎯 **Resultado Final**:
**PROBLEMA RESUELTO**: Las transferencias ahora funcionan correctamente:
- ✅ Se resta del origen
- ✅ Se suma al destino automáticamente
- ✅ Stock total del sistema se mantiene balanceado
- ✅ Auditoría completa de todos los movimientos

---

### ⛽ **COMBUSTIBLES - Febrero 1, 2025**
#### 🧙‍♂️ **NUEVA FUNCIONALIDAD: Formulario Wizard Progresivo para Movimientos**

**📍 Implementación Completada**: Sistema de asistente guiado paso a paso para crear movimientos de combustibles con validaciones en tiempo real y experiencia de usuario optimizada.

#### ✨ **Funcionalidades Implementadas**:

1. **🧙‍♂️ MovementWizard.jsx - Asistente Principal**:
   - Sistema de pasos progresivos con navegación inteligente
   - Barra de progreso visual con animaciones
   - Validaciones en tiempo real con feedback inmediato
   - Lógica condicional según tipo de movimiento (saltas pasos no aplicables)
   - Estados de loading contextuales: "Calculando...", "Solicitando...", "Verificando..."

2. **📁 WizardSteps/ - 8 Pasos Específicos**:
   - **Step1**: Selección tipo movimiento con iconos y descripciones
   - **Step2**: Combustible con precios automáticos desde productos
   - **Step3**: Ubicación origen con validación de stock en tiempo real
   - **Step4**: Cantidad con cuadro de stock dinámico y sugerencias
   - **Step5**: Vehículo (solo salidas) con validación horómetros tractores
   - **Step6**: Destino (solo transferencias) con validación capacidad
   - **Step7**: Detalles con auto-completado y cálculo valor total
   - **Step8**: Resumen final con confirmación obligatoria

3. **🎨 Experiencia de Usuario Mejorada**:
   - Validaciones en tiempo real con consultas a Firestore
   - Cuadro de stock dinámico con colores según estado (disponible/bajo/crítico)
   - Estados visuales para cada opción de selección
   - Animaciones suaves entre pasos y confirmaciones
   - Diseño responsive para móviles y desktop

4. **🔗 Integración Dual**:
   - Botón principal: "🧙‍♂️ Asistente Guiado" (recomendado)
   - Botón secundario: "📝 Formulario Clásico" (usuarios avanzados)
   - Coexistencia sin conflictos con modal existente
   - Misma funcionalidad final, diferentes experiencias UX

#### 📁 **Archivos Creados**:
- `combustibles/src/components/Movements/MovementWizard.jsx` - Componente principal
- `combustibles/src/components/Movements/WizardSteps.css` - Estilos tema forestal
- `combustibles/src/components/Movements/WizardSteps/Step[1-8]_*.jsx` - 8 pasos individuales

#### 📁 **Archivos Modificados**:
- `combustibles/src/components/Movements/MovementsMain.jsx` - Integración botones duales
- `combustibles/src/components/Movements/Movements.css` - Estilos botones nuevos

#### ✅ **Verificaciones Completadas**:
- Lint: ✅ (errores corregidos, solo warnings menores existentes)
- Build: ✅ Construcción exitosa con optimizaciones
- Funcionalidad: ✅ Wizard operativo con validaciones en tiempo real
- Integración: ✅ Coexistencia con formulario clásico

#### 🔧 **Mejoras Técnicas**:
- Reutilización completa de servicios existentes (movementsService, inventoryService, etc.)
- Validaciones en tiempo real con `validateStockAvailability()`
- Estados de loading contextuales para mejor feedback usuario
- Navegación condicional inteligente según tipo de movimiento
- Manejo robusto de errores con fallbacks

#### 🎯 **Resultado Final**:
**FUNCIONALIDAD AÑADIDA**: Los usuarios ahora tienen dos opciones para crear movimientos:
- ✅ **Asistente Guiado**: Experiencia paso a paso optimizada para nuevos usuarios
- ✅ **Formulario Clásico**: Interfaz completa para usuarios experimentados
- ✅ **Validaciones en Tiempo Real**: Stock, capacidad, precios, horómetros
- ✅ **UX Mejorada**: Loading states, animaciones, feedback visual

---

---

### ⛽ **COMBUSTIBLES - Febrero 1, 2025**
#### 🧹 **LIMPIEZA MAYOR: Eliminación Completa del Formulario Clásico**

**📍 Simplificación Completada**: Se eliminó completamente el formulario clásico de movimientos, dejando únicamente el asistente wizard como método optimizado para crear movimientos de combustible.

#### ✅ **Cambios Implementados**:

1. **🗑️ Archivo Eliminado**:
   - **MovementModal.jsx** (906 líneas) - Eliminado completamente del proyecto
   - Formulario clásico con todas sus validaciones y estados removido

2. **🔧 MovementsMain.jsx - Limpieza Integral**:
   - ❌ Botón "📝 Formulario Clásico" eliminado
   - ✅ Botón "🧙‍♂️ Asistente Guiado" renombrado a "➕ Nuevo Movimiento"
   - ❌ Import de MovementModal removido
   - ❌ Estados `showModal`, `modalMode` eliminados
   - ❌ Handlers `handleCreateMovement`, `handleEditMovement`, `handleModalClose` removidos
   - ❌ JSX del modal clásico eliminado
   - ✅ Función de edición deshabilitada (solo vista de lectura)

3. **🎯 Interfaz Simplificada**:
   - Un solo botón "➕ Nuevo Movimiento" para crear movimientos
   - Experiencia unificada usando exclusivamente el wizard paso a paso
   - Vista simplificada de movimientos existentes (solo lectura)
   - UX limpia sin opciones duplicadas o confusas

4. **🛡️ Validaciones de Código**:
   - Lint: ✅ Sin errores (solo warnings menores pre-existentes)
   - Build: ✅ Compilación exitosa optimizada
   - Variables no utilizadas removidas completamente

#### 📁 **Archivos Modificados**:
- ❌ `combustibles/src/components/Movements/MovementModal.jsx` - **ELIMINADO**
- ✏️ `combustibles/src/components/Movements/MovementsMain.jsx` - Limpieza integral

#### ✅ **Verificaciones Completadas**:
- Búsqueda de referencias residuales: ✅ Sin referencias al formulario clásico
- Lint: ✅ Sin errores críticos (0 errors, 7 warnings pre-existentes)
- Build: ✅ Construcción exitosa con optimizaciones
- Funcionalidad: ✅ Wizard operativo como única opción

#### 🎯 **Resultado Final**:
**SIMPLIFICACIÓN EXITOSA**: 
- ✅ **Wizard Único**: Solo el asistente guiado está disponible para crear movimientos
- ✅ **UX Mejorada**: Experiencia unificada sin opciones duplicadas
- ✅ **Código Limpio**: -906 líneas de código eliminadas
- ✅ **Mantenibilidad**: Un solo flujo de creación de movimientos a mantener

---

### ⛽ **COMBUSTIBLES - Febrero 1, 2025**
#### 🔧 **CORRECCIONES CRÍTICAS: Wizard Movimientos y Visualización Profesional**

**📍 Actualización Mayor**: Corrección completa de bugs críticos en wizard de movimientos y rediseño total de la visualización con interfaz profesional.

#### 🚨 **Problemas Críticos Solucionados**:

1. **🔧 Wizard SALIDAS - Error "Campo requerido: fuelType"**:
   - **Problema**: Movimientos tipo SALIDA fallaban con error de validación
   - **Causa**: Navegación inconsistente y mapeo de pasos problemático
   - **Solución**: Mapeo específico para SALIDAS similar al de ENTRADAS
   - **Archivos**: `MovementWizard.jsx`, `Step5_Vehicle.jsx`

2. **🔧 Wizard ENTRADAS - Ubicación Incorrecta Step4**:
   - **Problema**: Step4 mostraba ubicación vacía para entradas
   - **Causa**: Usaba `formData.location` en lugar de `destinationLocation`
   - **Solución**: Lógica condicional según tipo de movimiento
   - **Archivo**: `Step4_Quantity.jsx:278`

3. **🔧 Visualización - Bug Ubicación "principal"**:
   - **Problema**: Entradas mostraban "principal" en lugar de ubicación real
   - **Causa**: Tabla usaba campo incorrecto para entradas
   - **Solución**: Lógica condicional `ENTRADA ? destinationLocation : location`
   - **Archivo**: `MovementsTable.jsx:225-229`

#### ✨ **Funcionalidades Implementadas**:

1. **🧙‍♂️ Wizard SALIDAS - Mejoras Completas**:
   - ✅ Confirmación visual Step4: "Se restará del inventario de [ubicación]"
   - ✅ Mapeo específico navegación: `1→2→3→4→5→7→8` (7 pasos)
   - ✅ Debug logs específicos en Step5 y submit final
   - ✅ Validación robusta horómetros tractores

2. **📊 Visualización Profesional - Rediseño Total**:
   - ✅ **Vista única tabla**: Eliminada vista tarjetas completamente
   - ✅ **CSS profesional**: +400 líneas estilos especializados
   - ✅ **Header gradiente**: Tema forestal con tipografía mejorada
   - ✅ **Espaciado generoso**: Padding aumentado, filas hover effects
   - ✅ **Celdas especializadas**: Formato específico por tipo contenido
   - ✅ **Responsive optimizado**: Perfecto móvil/desktop

3. **🎨 Arquitectura Simplificada**:
   - ✅ **MovementsList**: Eliminada lógica dual, solo tabla
   - ✅ **MovementsFilters**: Removido selector vista, indicador "📋 Vista Tabla"
   - ✅ **MovementsMain**: Sin estado `viewMode`, interfaz limpia
   - ✅ **Consistencia UX**: Flujo único sin opciones confusas

#### 📁 **Archivos Modificados**:
- 🔧 `MovementWizard.jsx` - Mapeo navegación específico SALIDAS + debug
- 🔧 `Step4_Quantity.jsx` - Confirmaciones visuales ENTRADAS/SALIDAS
- 🔧 `Step5_Vehicle.jsx` - Debug específico selección vehículo
- 🔧 `MovementsTable.jsx` - Fix ubicación condicional ENTRADA
- 🔧 `MovementsList.jsx` - Simplificación vista única tabla
- 🔧 `MovementsMain.jsx` - Eliminación estado viewMode
- 🔧 `MovementsFilters.jsx` - Removido selector vista
- 🎨 `Movements.css` - +400 líneas estilos tabla profesional

#### ✅ **Verificaciones Completadas**:
- **Lint**: ✅ Sin errores críticos (solo warnings pre-existentes)
- **Build**: ✅ Construcción exitosa en 8.57s
- **Deploy**: ✅ Firebase deploy exitoso
- **Funcionalidad**: ✅ Wizard ENTRADA/SALIDA 100% funcional

#### 🎯 **Resultado Final**:
**SISTEMA COMPLETAMENTE FUNCIONAL**:
- ✅ **Wizard Universal**: ENTRADAS y SALIDAS funcionando perfectamente
- ✅ **Visualización Premium**: Tabla profesional espaciosa y clara  
- ✅ **UX Coherente**: Interfaz unificada sin duplicaciones
- ✅ **Mantenibilidad**: Código limpio y documentado

#### 🌐 **URLs Actualizadas**:
- **Combustibles**: https://forestechdecolombia.com.co/combustibles/
- **Firebase**: https://liquidacionapp-62962.web.app/

---

**Febrero 1, 2025**: Sistema wizard y visualización completamente corregidos. Experiencia profesional 100% funcional.