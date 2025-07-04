# ⛽ COMBUSTIBLES - Sistema de Gestión de Combustibles

## Estado Actual: 100% COMPLETADO Y OPERATIVO (2025)

**URL en producción**: https://forestechdecolombia.com.co/combustibles/  
**Estado**: Sistema completo funcionando en producción

## Descripción

Sistema integral de gestión y control de inventario de combustibles para equipos forestales de Forestech Colombia.

## Comandos de Desarrollo

```bash
cd combustibles
npm run dev         # Servidor desarrollo (puerto 5174)
npm run build       # Build producción
npm run lint        # ESLint
```

## Arquitectura

- **Frontend**: React 19 + Vite 7
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Charts**: Chart.js + react-chartjs-2
- **Tema**: Verde forestal responsive
- **Deploy**: Automático con GitHub Actions

## Funcionalidades Implementadas

### 🛢️ Gestión de Inventario
- CRUD completo de combustibles (Diésel, Gasolina, ACPM, Lubricantes)
- Alertas automáticas de stock bajo
- Seguimiento en tiempo real de niveles

### 📊 Control de Movimientos
- 4 tipos: Entrada, Salida, Transferencia, Ajuste
- Validación de stock en tiempo real
- Wizard guiado para creación de movimientos
- Integración automática con inventario

### 🚜 Gestión de Vehículos
- Catálogo completo de 25 vehículos específicos
- Sistema de horómetros para tractores (TR1, TR2, TR3)
- Seguimiento de consumo y eficiencia
- Estados operativos y de mantenimiento

### 📦 Productos Dinámicos
- 9 productos predefinidos (ACPM, Gasolina, Aceites, etc.)
- Integración con sistema de precios
- Categorización automática

### 🏪 Proveedores
- Base de datos completa de proveedores
- Sistema de evaluación y rating
- Integración con movimientos de entrada
- Exportación de datos CSV

### 🔧 Mantenimiento
- Programación de mantenimientos por vehículo
- Seguimiento de horómetros
- Alertas automáticas
- Historial completo

### 🔐 Autenticación y Administración
- Sistema de invitaciones con códigos únicos
- Roles granulares (Admin, Empleado, Cliente)
- Panel de administración completo
- Seguridad Firebase integrada

## Estructura de Archivos

```
combustibles/
├── src/
│   ├── components/
│   │   ├── Dashboard/          # Dashboard principal
│   │   ├── Inventory/          # Gestión inventario
│   │   ├── Movements/          # Control movimientos
│   │   ├── Vehicles/           # Gestión vehículos
│   │   ├── Products/           # Productos dinámicos
│   │   ├── Suppliers/          # Proveedores
│   │   ├── Maintenance/        # Mantenimiento
│   │   └── Admin/              # Panel administración
│   ├── services/               # Servicios Firebase
│   ├── contexts/               # Context providers
│   └── constants/              # Constantes del sistema
```

## URLs Operativas

- **Producción**: https://forestechdecolombia.com.co/combustibles/
- **Firebase**: https://liquidacionapp-62962.web.app/combustibles/

## Integración con Monorepo

- Comparte Firebase con aplicación de alimentación
- Deploy automático con GitHub Actions
- Configuración multi-app en `firebase.json`
- Sistema de roles unificado

---

**Última actualización**: Julio 2025 - Sistema 100% operativo en producción