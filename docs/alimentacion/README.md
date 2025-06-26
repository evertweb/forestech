# 🍽️ ALIMENTACION - App de Liquidaciones de Comidas

## Estado Actual: COMPLETAMENTE FUNCIONAL (Enero 2025)

**URL en vivo**: https://liquidacionapp-62962.web.app/alimentacion/
**Dominio personalizado**: https://forestechdecolombia.com.co/alimentacion/

## Arquitectura

- **Frontend**: React 19 + Vite
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Generación PDF**: jsPDF con plugin auto-table
- **Analytics**: Firebase Analytics + Performance Monitoring

## Comandos de Desarrollo

```bash
cd alimentacion
npm run dev         # Servidor desarrollo
npm run build       # Build producción
npm run lint        # ESLint
npm run preview     # Vista previa build
```

## Estado de Implementación

### ✅ Fase 1 - Analytics y Auth (COMPLETADO)
- Firebase Analytics con eventos personalizados
- Google OAuth + Email/Password
- Performance Monitoring activo
- Verificación de email con banner UI

### ✅ Fase 2 - Sistema de Roles (COMPLETADO)
- Roles: Admin, Contador, Cliente
- Protección de rutas granular
- Admin automático: contacto.evert@gmail.com
- Context API con permisos

### ✅ Fase 2B - Panel Admin + FCM (COMPLETADO)
- Panel administración completo
- Firebase Cloud Messaging funcional
- Service Worker para notificaciones
- Gestión usuarios en tiempo real

### ✅ Fase 2C - Invitaciones + Notificaciones Automáticas (COMPLETADO)
- Sistema códigos invitación únicos
- Registro seguro con validación email
- Notificaciones automáticas: liquidaciones y PDFs
- Gestión completa invitaciones activas/usadas/expiradas

## Funcionalidades Core

### Sistema de Liquidaciones
- **Flujo**: GeneralData → Clients → Deductions → PDF
- **Cálculos**: `src/utils/calculations.js`
- **Estado**: React useState con reset por prop key
- **Persistencia**: Firestore con rutas por usuario

### Componentes Principales
- **MainApp**: Contenedor con gestión estado
- **Auth**: Google OAuth + Email/Password
- **EmailVerificationBanner**: Verificación email
- **GeneralData**: Información básica liquidación
- **Clients**: Lista clientes con conteo comidas
- **Deductions**: Deducciones fiscales/personales
- **ResultsModal**: Visualización resultados
- **PaymentModal**: Subida comprobantes

## Estructura Firebase
```
artifacts/{VITE_FIREBASE_APP_ID}/users/{userId}/settlements/
```

## Variables de Entorno
```
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_APP_ID=tu_app_id
```

Ver más detalles en:
- [Funcionalidades](./features.md)
- [Arquitectura](./architecture.md)  
- [Deploy](./deployment.md)