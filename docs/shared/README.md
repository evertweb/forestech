# 🔧 SHARED - Recursos Compartidos Entre Apps

## Estado Actual: ARQUITECTURA COMPARTIDA OPERATIVA (2025)

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

## Estructura Implementada

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
└── components/ (futuro)
    ├── Layout/             # Layout base apps
    ├── Auth/               # Componentes auth
    └── Common/             # UI reutilizable
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

## Funcionalidades Implementadas

- ✅ **Autenticación unificada** - Firebase Auth compartido
- ✅ **Sistema de roles** - Permisos granulares cross-app
- ✅ **Constantes compartidas** - Tipos de datos unificados
- ✅ **Configuración Firebase** - Un solo setup para todas las apps

## Escalabilidad

La arquitectura shared permite:
- Agregar nuevas apps usando la misma autenticación
- Expandir roles y permisos sin afectar apps existentes
- Reutilizar componentes UI entre aplicaciones
- Mantener consistencia de datos entre módulos

---

**Última actualización**: Julio 2025 - Arquitectura compartida operativa