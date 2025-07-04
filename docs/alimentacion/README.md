# 🍽️ ALIMENTACION - App de Liquidaciones de Comidas

## Estado Actual: 100% FUNCIONAL Y OPERATIVO (2025)

**URL en producción**: https://forestechdecolombia.com.co/alimentacion/
**Firebase**: https://liquidacionapp-62962.web.app/alimentacion/

## Descripción

Sistema completo de liquidaciones de comidas para empleados de Forestech Colombia, con generación automática de PDFs, sistema de roles y notificaciones.

## Arquitectura

- **Frontend**: React 19 + Vite
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Generación PDF**: jsPDF con plugin auto-table
- **Analytics**: Firebase Analytics + Performance Monitoring
- **Notificaciones**: Firebase Cloud Messaging

## Comandos de Desarrollo

```bash
cd alimentacion
npm run dev         # Servidor desarrollo (puerto 5173)
npm run build       # Build producción
npm run lint        # ESLint
npm run preview     # Vista previa build
```

## Funcionalidades Implementadas

### 🔐 Sistema de Autenticación
- Google OAuth + Email/Password
- Verificación de email obligatoria
- Roles granulares: Admin, Contador, Cliente
- Admin automático: contacto.evert@gmail.com

### 📊 Sistema de Liquidaciones
- **Flujo completo**: GeneralData → Clients → Deductions → PDF
- **Cálculos automáticos**: Totales, deducciones, valores netos
- **Persistencia**: Firestore con rutas por usuario
- **Estado reactivo**: React useState con reset por prop key

### 👥 Panel de Administración
- Gestión completa de usuarios en tiempo real
- Sistema de invitaciones con códigos únicos
- Firebase Cloud Messaging operativo
- Notificaciones automáticas de liquidaciones y PDFs

### 📱 Notificaciones Automáticas
- Firebase Cloud Messaging configurado
- Service Worker para notificaciones
- Push notifications para liquidaciones completadas
- Notificaciones de PDFs generados

### 📄 Generación de PDFs
- jsPDF con auto-table para reportes profesionales
- Logos empresariales y firmas digitales
- Formato estandarizado para liquidaciones
- Descarga automática y almacenamiento Firebase

### 📈 Analytics y Monitoreo
- Firebase Analytics con eventos personalizados
- Performance Monitoring activo
- Seguimiento de uso y patrones de usuario
- Métricas de conversión y engagement

## Componentes Principales

- **MainApp**: Contenedor principal con gestión de estado
- **Auth**: Autenticación con Google OAuth + Email/Password
- **EmailVerificationBanner**: Verificación obligatoria de email
- **GeneralData**: Información básica de liquidación
- **Clients**: Lista de clientes con conteo de comidas
- **Deductions**: Deducciones fiscales y personales
- **ResultsModal**: Visualización de resultados finales
- **PaymentModal**: Subida de comprobantes de pago

## Estructura Firebase

```
artifacts/{VITE_FIREBASE_APP_ID}/users/{userId}/settlements/
├── generalData/        # Información básica
├── clients/           # Lista clientes y comidas
├── deductions/        # Deducciones aplicadas
└── results/           # Resultados finales
```

## Sistema de Roles y Permisos

- **Admin**: Acceso completo, gestión usuarios, invitaciones
- **Contador**: Crear liquidaciones, ver histórico, generar reportes
- **Cliente**: Ver solo sus propias liquidaciones

## Variables de Entorno

```
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_APP_ID=tu_app_id
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
```

## Integración con Monorepo

- Comparte Firebase con aplicación de combustibles
- Deploy automático con GitHub Actions
- Sistema de roles unificado en `/shared`
- Configuración multi-app en `firebase.json`

---

**Última actualización**: Julio 2025 - Sistema 100% operativo en producción