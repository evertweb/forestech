# Forestech - Instrucciones para GitHub Copilot Agent

## 🏢 Contexto del Proyecto

Forestech es una aplicación empresarial para la gestión de recursos operativos con dos módulos principales:
- **Alimentación**: Sistema de liquidaciones de comidas para empleados
- **Combustibles**: Sistema de gestión de inventario, vehículos y movimientos

## 📁 Estructura del Monorepo

```
forestech/
├── alimentacion/           # 🍽️ App liquidaciones (React + Vite)
├── combustibles/          # ⛽ App combustibles (React + Vite)
├── shared/               # 🔧 Recursos compartidos
├── docs/                 # 📚 Documentación modular
└── .github/              # 🤖 Workflows y configuraciones
```

## 🔥 Backend y Servicios

- **Firebase Project**: liquidacionapp-62962
- **Database**: Cloud Firestore
- **Authentication**: Firebase Auth con roles granulares
- **Hosting**: Multi-site Firebase hosting
- **Domain**: forestechdecolombia.com.co

## 🛠️ Stack Tecnológico

- **Frontend**: React 18 + Vite + TailwindCSS
- **State Management**: Context API + Custom Hooks
- **UI Components**: Headless UI + Heroicons
- **Forms**: React Hook Form + Zod validation
- **Database**: Cloud Firestore
- **Authentication**: Firebase Auth
- **Notifications**: Firebase Cloud Messaging (FCM)
- **Analytics**: Firebase Analytics

## 📋 Patrones de Código Obligatorios

### Estructura de Componentes
```jsx
// Siempre usar hooks personalizados
const useComponentName = () => {
  // Lógica del componente
  return { state, actions };
};

// Componentes funcionales con props tipadas
const ComponentName = ({ prop1, prop2 }) => {
  const { state, actions } = useComponentName();
  
  return (
    <div className="responsive-classes">
      {/* JSX */}
    </div>
  );
};
```

### Hooks Personalizados
```jsx
// Ubicación: src/hooks/useHookName.js
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export const useHookName = () => {
  const { user } = useAuth();
  // Lógica del hook
  return { data, loading, error, actions };
};
```

### Servicios Firebase
```jsx
// Ubicación: src/services/
import { db } from '../firebase/config';
import { collection, doc, addDoc, updateDoc, deleteDoc, getDocs, query, where } from 'firebase/firestore';

export const serviceName = {
  create: async (data) => {
    // Implementación con manejo de errores
  },
  update: async (id, data) => {
    // Implementación con manejo de errores
  },
  // ... más métodos
};
```

## 🎨 Estilos y Diseño

### TailwindCSS Guidelines
- **Responsive First**: Siempre usar `sm:`, `md:`, `lg:`, `xl:` para responsividad
- **Colores**: Usar palette consistente (`blue-600`, `green-500`, `red-500`)
- **Spacing**: Usar escala de Tailwind (`p-4`, `m-6`, `gap-4`)
- **Typography**: Usar utilidades de texto (`text-lg`, `font-semibold`)

### Componentes Reutilizables
```jsx
// Botones
<Button variant="primary" size="md" onClick={handleClick}>
  Texto del botón
</Button>

// Inputs
<Input
  label="Etiqueta"
  type="text"
  value={value}
  onChange={handleChange}
  error={error}
/>

// Cards
<Card className="custom-classes">
  <CardHeader>Título</CardHeader>
  <CardBody>Contenido</CardBody>
</Card>
```

## 🔐 Seguridad y Permisos

### Roles de Usuario
- **admin**: Acceso completo a todas las funcionalidades
- **operator**: Acceso a operaciones básicas
- **viewer**: Solo lectura

### Validaciones
```jsx
// Siempre validar permisos
const { hasPermission } = useAuth();

if (!hasPermission('admin')) {
  return <UnauthorizedComponent />;
}
```

### Firestore Rules
```javascript
// Ejemplo de reglas granulares
allow read, write: if request.auth != null 
  && request.auth.token.role in ['admin', 'operator'];
```

## 🚀 Flujo de Desarrollo

### Comandos Esenciales
```bash
# Desarrollo
npm run dev:alimentacion  # Puerto 5173
npm run dev:combustibles  # Puerto 5174

# Linting (OBLIGATORIO antes de commit)
npm run lint:alimentacion
npm run lint:combustibles
```

### GitHub Actions
- **Deploy automático**: Solo commit + push
- **Build y linting**: Automático en CI/CD
- **Tests**: Ejecutar antes de merge

## 📊 Módulos Específicos

### Combustibles
**Colecciones Firestore:**
- `products`: Productos de combustible
- `vehicles`: Vehículos de la empresa
- `movements`: Movimientos de inventario
- `suppliers`: Proveedores
- `maintenance`: Mantenimientos

**Funcionalidades clave:**
- Gestión de inventario en tiempo real
- Tracking de horómetros
- Reportes financieros
- Alertas de stock mínimo

### Alimentación
**Colecciones Firestore:**
- `employees`: Empleados
- `liquidations`: Liquidaciones
- `deductions`: Deducciones
- `notifications`: Notificaciones FCM

**Funcionalidades clave:**
- Cálculo automático de liquidaciones
- Sistema de notificaciones
- Panel administrativo
- Reportes de consumo

## 🧪 Testing

### Estructura de Tests
```jsx
// Ubicación: src/__tests__/
import { render, screen, fireEvent } from '@testing-library/react';
import ComponentName from '../ComponentName';

describe('ComponentName', () => {
  test('should render correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText('Expected text')).toBeInTheDocument();
  });
});
```

## 🔄 Integración con Claude Code

Este proyecto está optimizado para trabajar con Claude Code que tiene acceso a:
- **9 MCPs**: memory, gemini, filesystem, sequential-thinking, etc.
- **Firebase MCP**: Para queries directas a producción
- **Hooks automáticos**: Sistema de validación y limpieza

## 🚨 Reglas Importantes

1. **NUNCA** romper la estructura del monorepo
2. **SIEMPRE** seguir los patrones de componentes establecidos
3. **OBLIGATORIO** usar hooks personalizados para lógica compleja
4. **REQUERIDO** responsive design en todos los componentes
5. **CRÍTICO** validar permisos antes de operaciones sensibles
6. **ESENCIAL** manejar errores en todas las operaciones Firebase

## 🎯 Casos de Uso Típicos

### Nuevo Componente
1. Crear hook personalizado en `src/hooks/`
2. Implementar componente siguiendo patrones
3. Agregar validaciones de permisos
4. Implementar responsive design
5. Crear tests unitarios

### Nueva Funcionalidad
1. Analizar impacto en Firestore
2. Implementar servicio Firebase
3. Crear componentes necesarios
4. Actualizar documentación
5. Probar integración completa

### Refactoring
1. Mantener compatibilidad con código existente
2. Seguir patrones establecidos
3. Actualizar tests afectados
4. Validar funcionamiento en ambos módulos

---

**Última actualización**: Julio 2025
**Versión**: 1.0.0
**Compatibilidad**: React 18, Firebase 10, Vite 5