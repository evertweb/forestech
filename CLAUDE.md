# CLAUDE.md

Este archivo proporciona orientación a Claude Code (claude.ai/code) cuando trabaja con código en este repositorio.

## Estructura del Proyecto

Esta es una aplicación web React llamada "Forestech" que ayuda a calcular liquidaciones de servicios de alimentación. La aplicación principal se encuentra en el subdirectorio `alimentacion/`.

### Arquitectura Principal

- **Frontend**: React 19 + servidor de desarrollo Vite
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Despliegue**: Firebase Hosting con enrutamiento personalizado
- **Generación PDF**: jsPDF con plugin auto-table
- **Gráficos**: Chart.js con react-chartjs-2

### Estructura de Directorios

```
forestech/
├── alimentacion/          # Aplicación principal React
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── firebase/      # Configuración y servicios Firebase
│   │   ├── utils/         # Funciones utilitarias (cálculos, PDF)
│   │   └── App.jsx        # Componente principal de la app
│   ├── public/            # Assets estáticos
│   └── package.json       # Dependencias y scripts
├── public/                # Directorio público de Firebase hosting
└── firebase.json          # Configuración de Firebase
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
- **Integración Total**: FCM + Roles + Analytics funcionando conjuntamente

### 🔄 Próximas Fases Planificadas
- **Fase 3**: Dashboard de Analytics + PWA completa + Sistema de comentarios
- **Fase 4**: Email automático + Backup automático + Integración Google Sheets
- **Fase 5**: Modo offline + Temas personalizables + Portal clientes independiente

### 📁 Archivos Clave Implementados

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

### 🔧 Configuraciones Firebase Activas
- Authentication: Email/Password + Google OAuth configurado
- Analytics: Eventos personalizados y seguimiento automático activo  
- Performance: Monitoreo en tiempo real en producción
- Firestore: Reglas de seguridad por usuario implementadas
- Hosting: Deploy automático configurado con build optimizado

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
