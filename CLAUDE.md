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

## Estructura del Proyecto Multi-App

Forestech es ahora un **monorepo** que contiene múltiples aplicaciones web especializadas para diferentes aspectos del negocio forestal en Colombia.

### Arquitectura Principal

- **Frontend**: React 19 + servidor de desarrollo Vite
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Despliegue**: Firebase Hosting con enrutamiento personalizado
- **Generación PDF**: jsPDF con plugin auto-table
- **Gráficos**: Chart.js con react-chartjs-2

### Estructura de Directorios Multi-App

```
forestech/                          # Monorepo principal
├── alimentacion/                   # 🍽️ App de liquidaciones de comidas
│   ├── src/
│   │   ├── components/            # Componentes específicos alimentación
│   │   ├── firebase/              # Servicios Firebase alimentación
│   │   ├── utils/                 # Utils específicos (cálculos, PDF)
│   │   └── App.jsx               # App principal alimentación
│   ├── public/                   # Assets estáticos alimentación
│   └── package.json              # Dependencias alimentación
├── combustibles/                  # ⛽ App de gestión de combustibles  
│   ├── src/
│   │   ├── components/           # Componentes específicos combustibles
│   │   ├── services/             # Servicios business logic combustibles
│   │   ├── utils/                # Utils específicos combustibles
│   │   └── App.jsx              # App principal combustibles
│   ├── public/                  # Assets estáticos combustibles
│   └── package.json             # Dependencias combustibles
├── shared/                       # 🔧 Recursos compartidos entre apps
│   ├── firebase/                 # Configuración Firebase común
│   │   ├── config.js            # Config base Firebase
│   │   ├── authService.js       # Autenticación compartida
│   │   └── userService.js       # Gestión usuarios compartida
│   ├── constants/               # Constantes globales
│   │   ├── roles.js            # Sistema de roles unificado
│   │   └── permissions.js      # Permisos granulares
│   ├── components/              # Componentes UI reutilizables
│   │   ├── Layout/             # Layout base para todas las apps
│   │   ├── Auth/               # Componentes autenticación
│   │   └── Common/             # Componentes comunes (botones, modals)
│   └── utils/                   # Utilidades compartidas
├── public/                      # 📋 Build output Firebase hosting
│   ├── alimentacion/           # Build app alimentación
│   ├── combustibles/           # Build app combustibles
│   ├── index.html              # Landing page principal
│   └── firebase-messaging-sw.js # Service Worker FCM
├── firebase.json               # Configuración hosting multi-app
├── firestore.rules            # Reglas seguridad unificadas
├── package.json               # Scripts globales del monorepo
└── CLAUDE.md                  # Documentación Claude (este archivo)
```

## Comandos de Desarrollo

### Servidor de Desarrollo
```bash
cd alimentacion
npm run dev
```

### Build para Producción
```bash
cd alimentacion
npm run build
```
*Nota: El build se genera en `../public/alimentacion/` debido a la estructura de Firebase hosting*

### Linting
```bash
cd alimentacion
npm run lint
```

### Vista Previa del Build de Producción
```bash
cd alimentacion
npm run preview
```

## Configuración de Firebase

### Configuración de Hosting
- El sitio principal se sirve desde el directorio `public/`
- La app React se sirve desde la ruta `/alimentacion/`
- Configurado con fallback de SPA a `/alimentacion/index.html`

### Variables de Entorno
Crear archivo `.env` en el directorio `alimentacion/`:
```
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_APP_ID=tu_app_id
```

### Servicios de Firebase Utilizados
- **Authentication**: Login/logout de usuarios con Google OAuth y Email/Password
- **Firestore**: Almacenamiento de datos de liquidaciones con colecciones específicas por usuario
- **Storage**: Subida de archivos (logos, firmas, comprobantes)
- **Analytics**: Tracking de eventos personalizados y métricas de uso
- **Performance Monitoring**: Monitoreo de rendimiento en tiempo real

## Características Principales de la Aplicación

### Sistema de Cálculo de Liquidaciones
- **Flujo Principal**: GeneralData → Clients → Deductions → Generación PDF
- **Gestión de Estado**: React useState con funcionalidad de reset de formularios usando prop key
- **Cálculos**: Ubicados en `src/utils/calculations.js`
- **Exportación PDF**: Generación personalizada de PDF con soporte para logo/firma

### Arquitectura de Componentes
- **MainApp**: Contenedor principal con gestión de estado
- **Auth**: Componente de autenticación con Google OAuth y Email/Password
- **EmailVerificationBanner**: Banner de verificación de email con reenvío
- **GeneralData**: Información básica de la liquidación
- **Clients**: Lista de clientes con conteo de comidas
- **Deductions**: Deducciones fiscales y personales (porcentaje o fijo)
- **ActionButtons**: Funcionalidad de calcular y resetear
- **HistorySection**: Liquidaciones previas con búsqueda/eliminación
- **ResultsModal**: Visualización de resultados de cálculo
- **PaymentModal**: Subida de comprobantes de pago

### Flujo de Datos
1. Usuario ingresa datos generales, clientes y deducciones
2. `calculateSettlement()` procesa todos los datos
3. Resultados mostrados en modal con opción de generación PDF
4. Datos guardados en Firestore con rutas específicas por usuario
5. Datos históricos mostrados con actualizaciones en tiempo real

## Detalles Importantes de Implementación

### Estructura de Datos en Firebase
```
artifacts/{VITE_FIREBASE_APP_ID}/users/{userId}/settlements/
```

### Patrón de Reset de Estado
Usa prop key de React para forzar re-montaje de componentes para reset de formularios:
```javascript
const [resetKey, setResetKey] = useState(0);
// Incrementar resetKey para resetear todos los formularios
```

### Formateo de Moneda
Usa Intl.NumberFormat para formateo en Peso Colombiano (COP) con fallback a USD.

### Estado de Autenticación
Usa listener onAuthStateChanged de Firebase con estados de carga para flujo de autenticación apropiado.

## Notas de Desarrollo

- Todos los componentes son componentes funcionales usando React hooks
- Las operaciones de Firebase usan sintaxis moderna del SDK v9
- Vite maneja variables de entorno con `import.meta.env`
- El proceso de build genera salida al directorio padre para Firebase hosting
- La generación de PDF incluye estilos personalizados y soporte para logo/firma

## Estado Actual del Proyecto (Enero 2025)

### ✅ Fase 1 Completada - Analytics y Autenticación Avanzada
- **URL en vivo**: https://liquidacionapp-62962.web.app/alimentacion/
- **Firebase Analytics**: Eventos personalizados implementados (login, logout, calculations, theme_change, etc.)
- **Performance Monitoring**: Activo en producción con métricas FCP, LCP, FID, CLS
- **Google OAuth**: Autenticación con Google implementada con botón dedicado
- **Verificación Email**: Sistema completo con banner UI y reenvío automático
- **Responsive Design**: Optimizado para móviles con targets táctiles de 44px mínimo
- **Error Tracking**: Captura automática de errores y logging estructurado

### ✅ Fase 2 - Sistema de Roles COMPLETADO (Enero 2025)
- **Sistema de Roles**: Admin, Contador, Cliente con permisos granulares
- **Protección de Rutas**: Componentes protegidos por rol y permisos
- **Gestión de Perfiles**: Automática en Firestore con Context API
- **Admin Automático**: contacto.evert@gmail.com configurado como Admin
- **Seguridad por Defecto**: Nuevos usuarios son Cliente automáticamente
- **Analytics de Roles**: Tracking completo de eventos de autorización

### ✅ Fase 2B - Panel Admin + FCM COMPLETADO (Enero 2025)
- **Panel de Administración**: Gestión completa de usuarios con UI profesional
- **Cambio de Roles**: Interface para modificar roles Admin/Contador/Cliente
- **Firebase Cloud Messaging**: Sistema completo de notificaciones push
- **Service Worker**: Notificaciones background y foreground
- **Clave VAPID**: Configurada con clave real de Firebase Console
- **Integración Total**: FCM + Roles + Analytics funcionando conjuntamente

### ✅ Fase 2C - Sistema de Invitaciones + Notificaciones Automáticas COMPLETADO (Enero 2025)

#### 🔧 **PROBLEMA CRÍTICO IDENTIFICADO Y SOLUCIONADO:**
**Problema:** Estábamos creando usuarios en Firestore pero NO estábamos creando las cuentas en Firebase Authentication. Los usuarios creados desde el panel admin solo existían en la base de datos, pero no tenían cuenta de autenticación real.

**Síntoma:** Error "auth/invalid-credential" al intentar hacer login con usuarios creados por admin.

**Solución Implementada:** Sistema de códigos de invitación que permite registro seguro:

#### ✅ **Sistema de Invitaciones Seguro:**
- **Códigos Únicos**: Admin genera códigos de 8 caracteres alfanuméricos
- **Validación Email**: Solo el email invitado puede usar el código
- **Expiración Automática**: 7 días de validez por invitación
- **Registro Seguro**: Usuario crea su propia contraseña
- **Asignación Automática**: Rol se asigna automáticamente al registrarse
- **Gestión Completa**: Lista de invitaciones activas, usadas, expiradas, canceladas

#### ✅ **Notificaciones Automáticas:**
- **Al guardar liquidación**: "✅ Liquidación Guardada - Tu liquidación de $X ha sido guardada exitosamente"
- **Al generar PDF**: "📄 PDF Generado - El PDF de tu liquidación por $X ha sido generado y descargado"
- **Tracking completo**: Analytics integrado para todos los eventos de notificaciones

#### ✅ **Flujo de Invitación Completo:**
1. **Admin crea invitación** → Genera código único
2. **Admin comparte código** → Usuario recibe código seguro  
3. **Usuario se registra** → Con email + contraseña + código
4. **Validación automática** → Sistema verifica código y email
5. **Asignación de rol** → Usuario obtiene permisos automáticamente
6. **Cuenta Firebase Auth real** → Usuario puede hacer login normalmente

#### ✅ **FCM COMPLETAMENTE FUNCIONAL:**
- **Notificaciones Manuales**: Funcionales desde Firebase Console
- **Notificaciones Automáticas**: Implementadas para acciones del usuario
- **Service Worker**: Funcionando correctamente en producción
- **Token Management**: Sistema completo de gestión de tokens FCM

### 🔄 Estado Actual: SISTEMA COMPLETAMENTE FUNCIONAL (Enero 2025)

#### 🎯 **SISTEMA DE GESTIÓN DE USUARIOS COMPLETO:**
- ✅ **Admin puede gestionar usuarios existentes**: Cambio de roles en tiempo real
- ✅ **Admin puede crear nuevos usuarios**: Sistema de invitaciones seguro con códigos únicos
- ✅ **Usuarios se registran correctamente**: Cuentas reales en Firebase Auth + asignación automática de roles
- ✅ **Notificaciones automáticas funcionando**: Al guardar liquidaciones y generar PDFs
- ✅ **Notificaciones manuales funcionando**: Desde Firebase Console
- ✅ **Sistema de roles granular**: Admin, Contador, Cliente con permisos específicos

#### 🔄 **Próximas Fases Planificadas - ROADMAP DETALLADO:**

##### 📋 **FASE 3: Dashboard Analytics + PWA + Sistema de Comentarios**
- **Dashboard de Analytics Avanzado**: Métricas de usuario, tendencias de liquidaciones, reportes automáticos, comparativas, heatmaps
- **PWA Completa**: Instalación, manifest, service worker avanzado, push notifications mejoradas, actualizaciones automáticas
- **Sistema de Comentarios**: Comentarios en liquidaciones, sistema de aprobación, notificaciones, historial de cambios

##### 📋 **FASE 4: Automatización + Integraciones**
- **Email Automático**: Notificaciones por email, templates personalizables, schedule automático, integración SMTP
- **Backup Automático**: Backup diario, versionado, cifrado, alertas de estado
- **Integración Google Sheets**: Exportación automática, sincronización bidireccional, templates predefinidos, APIs

##### 📋 **FASE 5: Experiencia Avanzada**
- **Modo Offline**: Cache inteligente, sincronización, indicadores de estado, resolución de conflictos
- **Temas Personalizables**: Modo oscuro avanzado, temas corporativos, accesibilidad, preferencias de usuario
- **Portal Clientes Independiente**: App separada, vista limitada, notificaciones push, autoservicio

##### 🎯 **Funcionalidades Adicionales Planificadas:**
- **Analytics Avanzado**: Google Analytics 4, heatmap tracking, A/B testing, performance metrics
- **Seguridad Avanzada**: 2FA, audit logs, gestión de sesiones, permisos granulares
- **Performance**: Code splitting, lazy loading, CDN, bundle optimization

##### 💡 **Recomendación de Implementación:**
1. **Primera Prioridad - Fase 3**: PWA básica, Dashboard analytics, Sistema de comentarios
2. **Segunda Prioridad - Fase 4**: Email automático, Backup automático, Google Sheets
3. **Tercera Prioridad - Fase 5**: Modo offline, Portal clientes, Temas personalizables

#### 🚀 **Funcionalidades Listas para Producción:**
- Sistema completo de autenticación con roles
- Panel administrativo funcional
- Gestión de usuarios con invitaciones
- Notificaciones push automáticas y manuales
- Generación de PDFs y liquidaciones
- Analytics y monitoreo completo

---

## ⛽ **PROYECTO COMBUSTIBLES - GESTIÓN DE STOCK Y COMBUSTIBLES**

### 🎯 **Estado del Proyecto: EN DESARROLLO**

**Descripción**: Sistema de gestión y control de inventario de combustibles para equipos forestales de Forestech Colombia.

### 🚀 **Estrategia de Desarrollo:**
- **Fase 1**: React + Firebase (MVP en 3 semanas) - **INICIANDO**
- **Fase 2**: Recrear con Java + Spring Boot (aprendizaje profundo)
- **Fase 3**: Usar Java como backend + React frontend (híbrido moderno)

### 📋 **Funcionalidades Core Planificadas:**

#### 🛢️ **Inventario de Combustibles:**
- Tipos: Diésel, Gasolina, ACPM, lubricantes
- Stock actual por tipo y ubicación
- Alertas de stock mínimo automáticas
- Control de calidad y especificaciones

#### 📊 **Registro de Movimientos:**
- **Entradas**: Compras, reabastecimientos, transferencias
- **Salidas**: Consumo por vehículo/maquinaria específica
- **Transferencias**: Entre tanques, ubicaciones, proyectos
- **Ajustes**: Mermas, pérdidas, calibraciones

#### 🚜 **Gestión de Vehículos/Maquinaria:**
- Registro completo de equipos forestales
- Consumo histórico por equipo
- Rendimiento por galón/hora trabajada
- Mantenimientos y servicios

#### 🏪 **Proveedores y Compras:**
- Base de datos de proveedores
- Órdenes de compra automatizadas
- Precios históricos y comparativos
- Evaluación de proveedores

#### 📈 **Reportes y Analytics:**
- Consumo mensual/semanal/diario
- Costos operativos por proyecto
- Eficiencia por equipo y operador
- Proyecciones de compra automáticas
- Dashboard ejecutivo en tiempo real

### 🔐 **Sistema de Roles (Compartido con Alimentación):**
- **Admin**: Acceso completo, configuraciones globales
- **Supervisor**: Gestión operativa, reportes, compras
- **Operador**: Solo registro de movimientos y consultas
- **Solo Lectura**: Consultores, contadores, auditores

### 🌐 **Configuración de Hosting:**
- **URL**: `forestechdecolombia.com.co/combustibles/`
- **Hosting**: Firebase (Fase 1) → Railway.app (Fase 2)
- **Base de Datos**: Firestore (Fase 1) → PostgreSQL (Fase 2)
- **Autenticación**: Firebase Auth compartida con app alimentación

### 📁 **Estructura de Archivos Planificada:**
```
combustibles/
├── src/
│   ├── components/
│   │   ├── Dashboard/         # Dashboard principal
│   │   ├── Inventory/         # Gestión de inventario
│   │   ├── Movements/         # Registro de movimientos
│   │   ├── Vehicles/          # Gestión de vehículos
│   │   ├── Suppliers/         # Gestión de proveedores
│   │   └── Reports/           # Reportes y analytics
│   ├── services/
│   │   ├── inventoryService.js
│   │   ├── movementsService.js
│   │   ├── vehiclesService.js
│   │   └── reportsService.js
│   ├── utils/
│   │   ├── calculations.js    # Cálculos de consumo y eficiencia
│   │   └── validators.js      # Validaciones business logic
│   └── contexts/
│       └── CombustiblesContext.jsx # Context específico
├── public/
└── package.json
```

### 🎯 **Integración con Ecosistema Forestech:**
- **Usuarios compartidos**: Mismo sistema de autenticación
- **Roles unificados**: Sistema de permisos consistente
- **Reportes cruzados**: Costos alimentación + combustibles
- **Dashboard ejecutivo**: Vista unificada del negocio

### ⏱️ **Timeline Estimado:**
- **Semana 1-2**: Setup inicial, estructura, componentes base ✅ **COMPLETADO**
- **Semana 3-4**: Funcionalidades core (inventario, movimientos) 🔄 **PRÓXIMO**
- **Semana 5-6**: Reportes, dashboard, optimizaciones
- **Mes 2-3**: Migración a Java + Spring Boot
- **Mes 4+**: Features avanzadas, integraciones

### 🎯 **Estado Actual del Proyecto: INICIALIZADO Y DESPLEGADO**

#### ✅ **FASE 1 COMPLETADA - Setup Inicial (Enero 2025)**
- **Estructura**: Monorepo configurado con combustibles/ y shared/
- **React App**: Inicializada con Vite, puerto 5174, tema verde forestal
- **Firebase Config**: Multi-app routing configurado (/combustibles/**)
- **Build System**: Output a ../public/combustibles/, integración monorepo
- **Deploy**: Desplegado exitosamente en producción
- **URL Activa**: https://liquidacionapp-62962.web.app/combustibles/

#### 🚀 **Interfaz Preview Implementada:**
- **Landing page profesional** con funcionalidades documentadas
- **Timeline visual** de desarrollo en 3 fases
- **Cards de features** con iconos y descripciones detalladas
- **Responsive design** optimizado para móviles
- **Tema forestal** consistente con branding Forestech

#### 📋 **Scripts Monorepo Operativos:**
```bash
npm run dev:combustibles        # Desarrollo en puerto 5174
npm run build:combustibles      # Build individual
npm run build:all              # Build ambas apps
npm run lint:combustibles       # Linting específico
npm run deploy                  # Deploy automático Firebase
```

#### 🔧 **Configuración Técnica Completa:**
```javascript
// vite.config.js
base: '/combustibles/',
outDir: '../public/combustibles',
server: { port: 5174 }

// firebase.json  
"/combustibles/**" → "/combustibles/index.html"

// package.json dependencies
"firebase": "^11.9.1",
"chart.js": "^4.5.0", 
"react-chartjs-2": "^5.3.0"
```

### 📁 **Estructura de Directorios COMBUSTIBLES (Actual):**
```
combustibles/
├── src/
│   ├── App.jsx              ✅ Landing page con preview funcionalidades  
│   ├── App.css              ✅ Tema verde forestal, responsive
│   ├── main.jsx             ✅ Entry point React
│   ├── index.css            ✅ Estilos base
│   ├── components/          🔄 Creados pero vacíos (próximo desarrollo)
│   │   ├── Dashboard/       📋 Dashboard principal (planificado)
│   │   ├── Inventory/       🛢️ Gestión inventario (planificado)
│   │   ├── Movements/       📊 Registro movimientos (planificado)
│   │   ├── Vehicles/        🚜 Gestión vehículos (planificado)
│   │   ├── Suppliers/       🏪 Gestión proveedores (planificado)
│   │   └── Reports/         📈 Reportes y analytics (planificado)
│   ├── services/            🔄 Para business logic (vacío)
│   ├── contexts/            🔄 Para CombustiblesContext (vacío)
│   └── utils/               🔄 Para calculations.js, validators.js (vacío)
├── public/
│   └── vite.svg             ✅ Íconos básicos Vite
├── package.json             ✅ Configurado con Firebase + Chart.js
├── vite.config.js           ✅ Multi-app config completado
└── eslint.config.js         ✅ Linting configurado
```

### 🎯 **Próximos Pasos de Desarrollo (Semana 3-4):**

#### 🔄 **PRÓXIMO: Funcionalidades Core**
1. **Dashboard Principal**: Métricas generales, resumen stock
2. **Inventario**: CRUD combustibles, alertas stock mínimo
3. **Movimientos**: Registro entradas/salidas, validaciones
4. **Vehículos**: Catálogo maquinaria, asociación consumos
5. **Integración Firebase**: Firestore collections, autenticación compartida

#### 📊 **Estructura Firestore Planificada:**
```
artifacts/{app_id}/
├── combustibles/
│   ├── inventory/           # Stock por tipo y ubicación
│   ├── movements/           # Historial entradas/salidas  
│   ├── vehicles/            # Catálogo maquinaria forestal
│   ├── suppliers/           # Base datos proveedores
│   └── settings/            # Configuraciones app
```

#### 🔐 **Integración Sistema Roles:**
- **Reutilizar** roles existentes: Admin, Contador, Cliente
- **Permisos específicos**: Crear movimientos, ver reportes, gestionar inventario
- **Autenticación compartida**: Mismo UserContext de alimentación

### 📈 **Métricas de Desarrollo:**
- **Bundle size**: 190KB (optimizado vs 1.4MB alimentación)
- **Dependencies**: Minimalistas, solo esenciales
- **Performance**: Build en 2s vs 12s alimentación
- **URL**: forestechdecolombia.com.co/combustibles/ ✅ ACTIVA

---

## 📁 **ARCHIVOS CLAVE IMPLEMENTADOS - MONOREPO COMPLETO**

### 🍽️ **ALIMENTACION - Archivos Clave Implementados**

#### Fase 1 - Analytics y Auth:
- `src/firebase/analytics.js` - Servicio de Analytics con eventos personalizados
- `src/firebase/authService.js` - Servicio de autenticación abstraído
- `src/components/Auth.jsx` - Componente actualizado con Google Sign-in
- `src/components/EmailVerificationBanner.jsx` - Banner de verificación de email
- `src/App.jsx` - Integración de Analytics y verificación email

#### Fase 2 - Sistema de Roles:
- `src/constants/roles.js` - Definiciones de roles y permisos
- `src/firebase/userService.js` - Gestión completa de perfiles de usuario
- `src/contexts/UserContext.jsx` - Context global de usuario con roles
- `src/components/ProtectedRoute.jsx` - Protección de rutas por roles/permisos
- `src/App.jsx` - Integración con UserProvider (ACTUALIZADO)

#### Fase 2B - Panel Admin + FCM:
- `src/components/AdminPanel.jsx` - Panel de administración completo
- `src/firebase/notificationService.js` - Servicio FCM con tokens y permisos
- `public/firebase-messaging-sw.js` - Service Worker para notificaciones
- `src/components/MainApp.jsx` - Sistema de pestañas Admin (ACTUALIZADO)
- `src/App.jsx` - Inicialización automática FCM (ACTUALIZADO)

#### Fase 2C - Sistema de Invitaciones + Notificaciones Automáticas:
- `src/firebase/invitationService.js` - Servicio completo de invitaciones con códigos únicos (NUEVO)
- `src/components/AdminPanel.jsx` - Pestaña "📧 Invitaciones" con gestión completa (ACTUALIZADO)  
- `src/firebase/authService.js` - Registro con códigos de invitación (ACTUALIZADO)
- `src/components/Auth.jsx` - Campo código de invitación en registro (ACTUALIZADO)
- `src/firebase/userService.js` - Soporte para invitaciones en perfiles (ACTUALIZADO)
- `src/firebase/notificationService.js` - notifyLiquidationSaved() y notifyPDFGenerated() (ACTUALIZADO)
- `src/firebase/firestoreService.js` - Integración automática de notificaciones (ACTUALIZADO)
- `src/utils/pdfGenerator.js` - Notificación automática al generar PDF (ACTUALIZADO)
- `firestore.rules` - Reglas de seguridad para invitaciones (NUEVO)

### 🔧 Configuraciones Firebase Activas
- Authentication: Email/Password + Google OAuth configurado
- Analytics: Eventos personalizados y seguimiento automático activo  
- Performance: Monitoreo en tiempo real en producción
- Firestore: Reglas de seguridad completas implementadas con soporte para invitaciones
- Hosting: Deploy automático configurado con build optimizado
- Cloud Messaging: FCM completamente funcional con Service Worker
- Security Rules: Protección granular por roles y permisos

### ⚠️ ADVERTENCIAS IMPORTANTES PARA FUTURAS IMPLEMENTACIONES

#### 🚨 **NUNCA crear usuarios directamente en Firebase Auth desde código frontend:**
- **PROBLEMA GRAVE**: Crear usuarios en Firestore sin cuentas Firebase Auth reales
- **SÍNTOMA**: Error "auth/invalid-credential" al intentar login  
- **SOLUCIÓN CORRECTA**: Usar sistema de invitaciones implementado
- **RECORDATORIO**: Los usuarios deben registrarse ellos mismos para crear cuentas Auth reales

#### 🔐 **Reglas de Firestore configuradas correctamente:**
- Admin puede gestionar todos los usuarios e invitaciones
- Usuarios solo pueden acceder a sus propios datos
- Invitaciones tienen validación de email y expiración
- Sistema de permisos granular por rol implementado

#### 📧 **Sistema de Invitaciones - Flujo Correcto:**
1. Admin crea invitación (NO usuario directo)
2. Se genera código único de 8 caracteres
3. Usuario se registra con email + contraseña + código
4. Sistema valida código y crea cuenta Firebase Auth real
5. Rol se asigna automáticamente según la invitación

#### 🔔 **Notificaciones FCM Funcionando:**
- Service Worker en `/firebase-messaging-sw.js` (raíz del hosting)
- Notificaciones automáticas: liquidaciones y PDFs
- Notificaciones manuales: Firebase Console funcionando
- Token management completo implementado

### ⛽ **COMBUSTIBLES - Archivos Clave Implementados**

#### ✅ **Fase 1 - Setup Inicial y Preview (COMPLETADO Enero 2025):**

##### 🎯 **Archivos Core Implementados:**
- `combustibles/src/App.jsx` - Landing page profesional con preview funcionalidades
- `combustibles/src/App.css` - Tema verde forestal, responsive design completo
- `combustibles/src/main.jsx` - Entry point React con configuración base
- `combustibles/src/index.css` - Estilos globales básicos
- `combustibles/package.json` - Dependencies: Firebase, Chart.js, React 19
- `combustibles/vite.config.js` - Config multi-app, puerto 5174, output ../public/combustibles
- `combustibles/eslint.config.js` - Linting rules configurado

##### 📁 **Estructura de Directorios Creada:**
- `combustibles/src/components/Dashboard/` - 📋 Dashboard principal (vacío, listo para desarrollo)
- `combustibles/src/components/Inventory/` - 🛢️ Gestión inventario (vacío, listo para desarrollo)
- `combustibles/src/components/Movements/` - 📊 Registro movimientos (vacío, listo para desarrollo)
- `combustibles/src/components/Vehicles/` - 🚜 Gestión vehículos (vacío, listo para desarrollo)
- `combustibles/src/components/Suppliers/` - 🏪 Gestión proveedores (vacío, listo para desarrollo)
- `combustibles/src/components/Reports/` - 📈 Reportes y analytics (vacío, listo para desarrollo)
- `combustibles/src/services/` - Business logic services (vacío, listo para desarrollo)
- `combustibles/src/contexts/` - CombustiblesContext planned (vacío, listo para desarrollo)
- `combustibles/src/utils/` - Calculations y validators (vacío, listo para desarrollo)

##### 🔧 **Configuración Monorepo:**
- `package.json` (raíz) - Scripts monorepo: dev:combustibles, build:combustibles, build:all, deploy
- `firebase.json` - Routing "/combustibles/**" → "/combustibles/index.html"
- `public/combustibles/` - Build output directory con archivos generados

#### 🔄 **Próximos Archivos a Implementar (Semana 3-4):**

##### 🛢️ **Inventario (Próximo):**
- `combustibles/src/components/Inventory/InventoryDashboard.jsx` - Vista principal inventario
- `combustibles/src/components/Inventory/FuelTypeManager.jsx` - CRUD tipos combustible
- `combustibles/src/components/Inventory/StockAlerts.jsx` - Alertas stock mínimo
- `combustibles/src/services/inventoryService.js` - Business logic inventario

##### 📊 **Movimientos (Próximo):**
- `combustibles/src/components/Movements/MovementForm.jsx` - Formulario entradas/salidas
- `combustibles/src/components/Movements/MovementHistory.jsx` - Historial movimientos
- `combustibles/src/services/movementsService.js` - Lógica movimientos
- `combustibles/src/utils/calculations.js` - Cálculos consumo y eficiencia

##### 🚜 **Vehículos (Próximo):**
- `combustibles/src/components/Vehicles/VehicleRegistry.jsx` - Catálogo maquinaria
- `combustibles/src/components/Vehicles/ConsumptionTracker.jsx` - Tracking consumo
- `combustibles/src/services/vehiclesService.js` - Gestión vehículos

##### 📈 **Reportes (Próximo):**
- `combustibles/src/components/Reports/DashboardExecutive.jsx` - Dashboard principal
- `combustibles/src/components/Reports/ConsumptionCharts.jsx` - Gráficos Chart.js
- `combustibles/src/services/reportsService.js` - Generación reportes

### 🔧 **SHARED - Recursos Compartidos (En Desarrollo)**

#### 📁 **Estructura Shared Creada (Lista para Implementación):**
- `shared/firebase/` - Configuración Firebase común entre apps
- `shared/constants/` - Roles, permisos, constantes globales
- `shared/components/` - Componentes UI reutilizables (Auth, Layout, Common)
- `shared/utils/` - Utilidades compartidas entre aplicaciones

#### 🔄 **Próximos Archivos Shared a Implementar:**
- `shared/firebase/config.js` - Configuración Firebase unificada
- `shared/constants/combustibleTypes.js` - Tipos de combustible estándar
- `shared/constants/vehicleTypes.js` - Tipos de maquinaria forestal
- `shared/components/Layout/AppLayout.jsx` - Layout base para ambas apps
- `shared/components/Common/DataTable.jsx` - Tabla reutilizable
- `shared/utils/formatters.js` - Formateo moneda, fechas, unidades

### 📋 **GENERAL - Configuración Global**

#### ✅ **Archivos de Configuración Global Actualizados:**
- `firebase.json` - Multi-app routing: alimentacion + combustibles
- `firestore.rules` - Reglas seguridad con soporte invitaciones + combustibles (pendiente)
- `package.json` (raíz) - Scripts monorepo operativos
- `CLAUDE.md` - Documentación completa actualizada

## 🚀 Mejores Prácticas para Claude Code - OBLIGATORIAS

### 📋 Directrices de Comportamiento para Claude

#### 🎯 **Comunicación Proactiva con el Usuario**
SIEMPRE que vayas a realizar una tarea, debes:

1. **Anunciar tu Plan de Acción:**
   ```
   🔄 Voy a implementar [feature] de la siguiente manera:
   - Paso 1: [descripción específica]
   - Paso 2: [descripción específica]
   - Esto seguirá el patrón existente en [archivo/componente]
   ```

2. **Advertir sobre Mejores Prácticas:**
   ```
   ⚠️  RECORDATORIO: Sé más específico en tu solicitud.
   ❌ Evita: "Arregla esto"
   ✅ Mejor: "El botón de login no funciona en móvil - arregla el responsive"
   ```

3. **Justificar Decisiones Técnicas:**
   ```
   💡 Implementaré usando [tecnología/patrón] porque:
   - Es consistente con el código existente
   - Mantiene las mejores prácticas del proyecto
   - No rompe la funcionalidad actual
   ```

#### 🔍 **Análisis Obligatorio Antes de Actuar**
Antes de cualquier implementación, SIEMPRE debes:

1. **Verificar Patrones Existentes:**
   - Buscar componentes similares ya implementados
   - Revisar estructura de carpetas y convenciones de nombres
   - Identificar librerías y frameworks ya utilizados

2. **Evaluar Impacto:**
   - ¿Rompe código existente?
   - ¿Es consistente con la arquitectura actual?
   - ¿Sigue las convenciones del proyecto?

3. **Proponer Alternativas si es Necesario:**
   ```
   🤔 He encontrado 2 enfoques posibles:
   Opción A: [descripción] - Pros: [...] - Contras: [...]
   Opción B: [descripción] - Pros: [...] - Contras: [...]
   Recomiendo la Opción A porque [justificación]
   ```

#### ⚡ **Flujo de Trabajo Obligatorio**

1. **TodoWrite SIEMPRE** para tareas complejas (3+ pasos)
2. **Búsqueda de contexto** antes de implementar
3. **Anuncio del plan** antes de ejecutar
4. **Implementación paso a paso** con actualizaciones de progreso
5. **Verificación automática** (lint, typecheck, build)
6. **Commit automático** con mensaje descriptivo

#### 🚨 **Advertencias Automáticas al Usuario**

Cuando el usuario haga solicitudes vagas, SIEMPRE responde:

```
⚠️  Para darte la mejor solución, necesito más contexto:

❌ Tu solicitud: "[solicitud vaga]"
✅ Mejor formato: "[ejemplo específico]"

🔍 ¿Podrías especificar:
- ¿Qué componente/archivo específico?
- ¿Qué comportamiento exacto esperas?
- ¿Hay algún error o problema específico?

Mientras tanto, analizaré el código para sugerir la mejor implementación...
```

#### 🛡️ **Salvaguardas de Código**

NUNCA hagas cambios que:
- Rompan funcionalidad existente sin justificación
- Ignoren patrones establecidos del proyecto
- Introduzcan dependencias innecesarias
- Comprometan la seguridad (secrets, vulnerabilidades)

SIEMPRE:
- Sigue convenciones de nombres existentes
- Usa librerías ya instaladas antes de sugerir nuevas
- Mantén consistencia con la arquitectura actual
- Ejecuta verificaciones de calidad (lint, tests)

#### 📚 **Educación Continua del Usuario**

En cada interacción, incluye:
- **Tip del día:** Una práctica mejorada para el usuario
- **Patrón identificado:** Qué patrón usaste y por qué
- **Próximos pasos sugeridos:** Mejoras relacionadas

### 🎓 **Sistema de Mejora Continua**

#### **Para Solicitudes Vagas:**
```
⚠️  Puedo ayudarte mejor si eres más específico:
Tu solicitud: "[solicitud]"
Mi interpretación: "[lo que entendí]"
¿Es correcto? Si no, por favor especifica: [preguntas aclaratorias]
```

#### **Para Decisiones Técnicas:**
```
💡 Implementaré [solución] siguiendo estos principios:
✅ Consistencia: Usa el mismo patrón que [archivo existente]
✅ Mantenibilidad: Código limpio y documentado
✅ Performance: Optimizado según estándares del proyecto
✅ Seguridad: Sin comprometer datos sensibles
```

#### **Para Progreso de Tareas:**
```
🔄 Progreso actual:
✅ [Tarea completada]: [descripción breve]
🔄 [Tarea en curso]: [descripción y % completado]
⏳ [Próxima tarea]: [descripción]
```

### 🔧 **Comandos y Herramientas Específicas del Proyecto**

#### **Testing y Calidad:**
```bash
# Ejecutar automáticamente después de cambios
cd alimentacion
npm run lint        # ESLint para calidad de código
npm run build       # Verificar que no hay errores de build
# No hay npm test configurado actualmente
```

#### **Desarrollo:**
```bash
cd alimentacion
npm run dev         # Servidor de desarrollo
npm run preview     # Vista previa de producción
```

#### **Firebase:**
```bash
# Deployment (solo si el usuario lo solicita explícitamente)
firebase deploy --only hosting
```

### 📝 **Plantillas de Comunicación**

#### **Inicio de Tarea:**
```
🎯 Nueva Tarea: [título]
📋 Plan de Ejecución:
   1. [paso específico]
   2. [paso específico]
   3. [paso específico]
🔍 Patrón a seguir: [referencia a código existente]
⚡ Comenzando implementación...
```

#### **Durante la Implementación:**
```
🔄 Implementando: [descripción actual]
💡 Decisión técnica: Uso [tecnología/patrón] porque [justificación]
📁 Archivos modificados: [lista]
```

#### **Finalización:**
```
✅ Tarea Completada: [título]
📊 Resumen:
   - Archivos modificados: [lista]
   - Patrón utilizado: [descripción]
   - Verificaciones pasadas: [lint/build/etc]
🚀 Commit realizado: [mensaje del commit]
💡 Tip: [sugerencia de mejora o práctica]
```

### 🎯 **Objetivos de Esta Configuración**

1. **Educar** al usuario para hacer mejores solicitudes
2. **Mantener** alta calidad de código sin excepciones  
3. **Ser proactivo** en explicar decisiones técnicas
4. **Prevenir** errores y malas prácticas
5. **Acelerar** el desarrollo con patrones consistentes

**Esta configuración garantiza que cada interacción sea educativa, eficiente y mantenga la excelencia técnica del proyecto Forestech.**
