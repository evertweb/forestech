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

### 🔄 Próximas Fases Planificadas
- **Fase 2**: Sistema de roles (Admin/Contador/Cliente) + Push Notifications (FCM)
- **Fase 3**: Dashboard de Analytics + PWA completa + Sistema de comentarios
- **Fase 4**: Email automático + Backup automático + Integración Google Sheets
- **Fase 5**: Modo offline + Temas personalizables + Portal clientes independiente

### 📁 Archivos Clave Nuevos Implementados
- `src/firebase/analytics.js` - Servicio de Analytics con eventos personalizados
- `src/firebase/authService.js` - Servicio de autenticación abstraído
- `src/components/Auth.jsx` - Componente actualizado con Google Sign-in
- `src/components/EmailVerificationBanner.jsx` - Banner de verificación de email
- `src/App.jsx` - Integración de Analytics y verificación email

### 🔧 Configuraciones Firebase Activas
- Authentication: Email/Password + Google OAuth configurado
- Analytics: Eventos personalizados y seguimiento automático activo  
- Performance: Monitoreo en tiempo real en producción
- Firestore: Reglas de seguridad por usuario implementadas
- Hosting: Deploy automático configurado con build optimizado




