# 🧠 Arquitectura del Proyecto `combustibles` (Análisis de Gemini)

**Última actualización:** 10 de Julio de 2025

Este documento es una referencia técnica generada por Gemini sobre la arquitectura y el funcionamiento interno del subproyecto `forestech/combustibles`. Está diseñado para ser mi base de conocimiento para cualquier tarea futura.

## 1. Visión General y Stack Tecnológico

La aplicación `combustibles` es una Single Page Application (SPA) moderna construida con **React 19** y **Vite**. Está diseñada para ser una herramienta interna de Forestech para la gestión integral de combustibles.

- **Framework:** React 19
- **Enrutamiento:** React Router DOM v7
- **Backend y Base de Datos:** Firebase (Authentication, Firestore)
- **Bundler:** Vite
- **Estilos:** CSS plano con una arquitectura modular (un `.css` por componente).
- **Linting:** ESLint

## 2. Estructura de Directorios (`src`)

La estructura del proyecto es modular y está organizada por funcionalidades, lo cual facilita la mantenibilidad y escalabilidad.

```
/src
├── assets/         # Imágenes y otros recursos estáticos
├── components/     # Componentes React, organizados por módulo
│   ├── Admin/
│   ├── Auth/
│   ├── Dashboard/    # Layout principal y vista de inicio
│   ├── Inventory/
│   ├── Maintenance/
│   ├── Migration/    # Componentes para la migración de datos (Selector, etc.)
│   ├── MigrationWizard/ # Asistente de migración de archivos
│   ├── Movements/   # Gestión de entradas/salidas de combustible
│   └── ...           # Otros módulos (Vehicles, Products, etc.)
├── constants/      # Constantes de la aplicación (roles, tipos, etc.)
├── contexts/       # Gestión de estado global con React Context
│   └── CombustiblesContext.jsx # El "cerebro" de la app
├── data/           # Datos estáticos o mocks
├── firebase/       # Configuración de Firebase y servicios base
├── services/       # Lógica de negocio y comunicación con Firestore
└── utils/          # Funciones de utilidad reutilizables
```

## 3. Gestión de Estado: `CombustiblesContext.jsx`

El contexto global es el pilar de la aplicación y gestiona:

- **Autenticación:** Mantiene el estado del usuario (`user`, `userProfile`).
- **Datos en Tiempo Real:** Se suscribe a las colecciones principales de Firestore (`inventory`, `movements`, `vehicles`, `suppliers`) y actualiza la UI automáticamente cuando los datos cambian.
- **Permisos:** Proporciona funciones (`isAdmin`, `hasPermission`) para implementar control de acceso basado en roles en toda la aplicación.
- **Acciones CRUD:** Centraliza la lógica para interactuar con la base de datos (ej. `deleteMovement`).

## 4. Flujo de Datos y Arquitectura de Componentes

- **Enrutamiento:** `App.jsx` define las rutas principales usando `react-router-dom`. El componente `Dashboard.jsx` actúa como un layout anidado (`<Outlet />`) que envuelve a la mayoría de las vistas.
- **Navegación:** `DashboardLayout.jsx` contiene la barra lateral de navegación, que utiliza componentes `<Link>` para cambiar de vista.
- **Componentización:** La UI está dividida en componentes modulares y reutilizables. Cada módulo principal (ej. `MovementsMain.jsx`) suele orquestar otros sub-componentes más pequeños (ej. `MovementsTable`, `MovementsFilters`, `MovementsStats`).

## 5. Capa de Servicios

La carpeta `services/` abstrae toda la comunicación con Firestore. Cada archivo corresponde a una colección o dominio de negocio:

- `inventoryService.js`: Gestiona el stock de combustible.
- `movementsService.js`: Maneja las entradas y salidas.
- `vehiclesService.js`: Administra los vehículos.
- **Servicios de Migración:**
    - `migrationManager.js`: Orquesta el proceso de migración.
    - `fileParsingService.js`: Lee y procesa archivos Excel/CSV (`xlsx`).
    - `aliasService.js`: Gestiona los alias para el mapeo de valores.
    - `realDataMigrationService.js`: Contiene lógica para migrar desde Google Sheets (un hallazgo importante del historial de git).

## 6. Puntos Clave y Flujos de Trabajo

- **Migración de Datos:** Es una funcionalidad crítica. El `MigrationWizard.jsx` guía al usuario a través de un proceso de 5 pasos para importar datos desde archivos. Existe también una funcionalidad para migrar desde Google Sheets.
- **Permisos:** El acceso a las funcionalidades está estrictamente controlado por los permisos definidos en el perfil del usuario en Firestore.
- **Reactividad:** La UI se actualiza en tiempo real gracias a las suscripciones de Firestore, proporcionando una experiencia de usuario fluida.

---

## 7. Estrategias de Optimización Implementadas

Esta sección documenta las mejoras de rendimiento aplicadas a la aplicación.

### 7.1. Code Splitting (Lazy Loading) a Nivel de Ruta

- **Fecha:** 10 de Julio de 2025
- **Archivos Modificados:** `combustibles/src/App.jsx`
- **Descripción:**
  - Se implementó `React.lazy()` y `React.Suspense` para cargar de forma dinámica los componentes principales de cada ruta (`DashboardMain`, `InventoryMain`, `MovementsMain`, etc.).
  - Anteriormente, todo el código de la aplicación se empaquetaba en un único archivo JavaScript, lo que aumentaba el tiempo de carga inicial.
  - Ahora, el código de cada vista solo se descarga del servidor cuando el usuario navega explícitamente a ella.
- **Impacto:**
  - **Reducción significativa del tamaño del paquete inicial.**
  - **Mejora drástica del tiempo de carga inicial (Time to Interactive).**
  - La aplicación se siente más rápida y responsiva para el usuario final.

Este documento me servirá como guía para entender rápidamente el contexto en futuras sesiones y realizar cambios de manera más segura y eficiente.