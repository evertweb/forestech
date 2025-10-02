# Combustibles App - Forestech

Aplicación de gestión de combustibles construida con React + Vite para el monorepo Forestech.

## 🧪 Testing & Quality

![Tests](https://img.shields.io/badge/tests-298%20passing-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-95%25-brightgreen)
![E2E Tests](https://img.shields.io/badge/e2e--tests-77%20passing-blue)
![Unit Tests](https://img.shields.io/badge/unit--tests-221%20passing-blue)
![Browsers](https://img.shields.io/badge/browsers-Chromium%20%7C%20Firefox-orange)
![CI/CD](https://img.shields.io/badge/ci%2Fcd-automated-success)

### Test Suite

- **Unit Tests**: 221 tests (Stores + Hooks)
  - 122 tests para stores (100% coverage)
  - 99 tests para hooks (estructura completa)
- **E2E Tests**: 77 tests (Playwright)
  - 6 tests de login
  - 10 tests de dashboard
  - 11 tests de productos
  - 26 tests de movimientos (entrada/salida)
  - 17 tests de reportes
  - 7 tests de smoke/flow
- **Total**: 298 tests automatizados

### Running Tests

```bash
# Unit tests
npm run test              # Run unit tests
npm run test:ui           # Run with UI
npm run test:coverage     # With coverage report

# E2E tests
npm run test:e2e          # Run E2E tests
npm run test:e2e:ui       # Run with Playwright UI
npm run test:e2e:headed   # Run in headed mode

# All tests
npm run test:all          # Run unit + E2E
```

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

- Copia `./.env.example` a `./.env.local` y coloca los valores reales del proyecto.
- Requeridas: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_APP_ID`
- Opcionales (con defaults): `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_MEASUREMENT_ID`

Ejemplo (`.env.example`):

```
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=liquidacionapp-62962.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=liquidacionapp-62962
VITE_FIREBASE_STORAGE_BUCKET=liquidacionapp-62962.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=851382130132
VITE_FIREBASE_APP_ID=tu_app_id
VITE_FIREBASE_MEASUREMENT_ID=
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
