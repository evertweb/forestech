# 🔧 SHARED - Recursos Compartidos Entre Apps

## Descripción

Recursos, componentes y servicios compartidos entre todas las aplicaciones del monorepo Forestech.

## Arquitectura Compartida

### 🔐 Sistema de Autenticación Unificado
- **Firebase Auth**: Una sola configuración para todas las apps
- **Usuarios compartidos**: Mismo login funciona en alimentación y combustibles
- **Roles granulares**: Admin, Contador, Cliente con permisos específicos

### 🔥 Firebase Compartido
```javascript
// shared/firebase/config.js - Configuración unificada
// shared/firebase/authService.js - Autenticación cross-app
// shared/firebase/userService.js - Gestión usuarios global
```

### 📋 Sistema de Roles y Permisos
```javascript
// shared/constants/roles.js
const ROLES = {
  ADMIN: 'admin',           // Acceso completo todas las apps
  CONTADOR: 'contador',     // Acceso reportes y liquidaciones
  CLIENTE: 'cliente'        // Acceso limitado solo consultas
};

// Permisos granulares por app
const PERMISSIONS = {
  ALIMENTACION: {
    CREATE_SETTLEMENT: ['admin', 'contador'],
    VIEW_HISTORY: ['admin', 'contador', 'cliente'],
    MANAGE_USERS: ['admin']
  },
  COMBUSTIBLES: {
    MANAGE_INVENTORY: ['admin', 'contador'],
    VIEW_REPORTS: ['admin', 'contador'],
    CREATE_MOVEMENT: ['admin', 'contador']
  }
};
```

## Estructura Actual

```
shared/
├── firebase/
│   ├── config.js           # Config Firebase unificada
│   ├── authService.js      # Auth compartida
│   └── userService.js      # Gestión usuarios
├── constants/
│   ├── roles.js            # Roles y permisos
│   ├── combustibleTypes.js # Tipos combustible
│   └── vehicleTypes.js     # Tipos maquinaria
├── components/ (planificado)
│   ├── Layout/             # Layout base apps
│   ├── Auth/               # Componentes auth
│   └── Common/             # UI reutilizable
└── utils/ (planificado)
    ├── formatters.js       # Formateo moneda/fechas
    └── validators.js       # Validaciones comunes
```

## Componentes Reutilizables (Planificado)

### Layout Compartido
```javascript
// shared/components/Layout/AppLayout.jsx
// Layout base con header, navigation, footer
// Tema consistent entre apps
```

### Componentes UI Comunes
```javascript
// shared/components/Common/DataTable.jsx - Tabla reutilizable
// shared/components/Common/Modal.jsx - Modal estándar
// shared/components/Common/Button.jsx - Botones consistentes
```

## Integración en Apps

### Uso en Alimentación
```javascript
import { useAuth } from '../shared/firebase/authService';
import { ROLES, PERMISSIONS } from '../shared/constants/roles';
```

### Uso en Combustibles
```javascript
import { CombustibleTypes } from '../shared/constants/combustibleTypes';
import { VehicleTypes } from '../shared/constants/vehicleTypes';
```

## Próximas Implementaciones

1. **Componentes UI reutilizables**
2. **Utilities de formateo común**
3. **Hooks customizados compartidos**
4. **Validadores business logic**
5. **Theme provider unificado**

Ver más detalles en:
- [Firebase](./firebase.md)
- [Roles](./roles.md)