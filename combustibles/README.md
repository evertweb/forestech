# Combustibles App - Forestech

Aplicación de gestión de combustibles construida con React + Vite para el monorepo Forestech.

## ⚠️ Issues Conocidos

### Firebase Analytics & Performance - DESHABILITADO
**Estado**: Temporalmente deshabilitado en `src/firebase/config.js:29-52`
**Razón**: Error CORB (Cross-Origin Read Blocking) causando fallos en componentes
**Ubicación**: `combustibles/src/firebase/config.js`
**Funcionalidad afectada**: Métricas y analytics no se registran
**TODO**: Reactivar con configuración CORS adecuada en producción

## Configuración

### Firebase
- **Proyecto**: liquidacionapp-62962
- **Servicios activos**: Auth, Firestore, Storage
- **Servicios deshabilitados**: Analytics, Performance
- **Usuario**: cardenasever072@gmail.com

### Variables de Entorno
Archivo: `.env.local`
```
VITE_FIREBASE_API_KEY=AIzaSyCbU834quCY8hjSffRwljJLgZrcxK8i2F4
VITE_FIREBASE_PROJECT_ID=liquidacionapp-62962
```

## Desarrollo

```bash
npm run dev    # http://localhost:5174/combustibles/
npm run build
npm run preview
```

## Estructura Principal
```
src/
├── components/
│   ├── Suppliers/     # Gestión de proveedores
│   ├── Vehicles/      # Gestión de vehículos
│   └── Maintenance/   # Mantenimiento
├── firebase/          # Configuración Firebase
└── services/          # Servicios API
```

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
