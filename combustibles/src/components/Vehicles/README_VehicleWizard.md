# 🚗 VehicleWizard - Formulario Wizard para Vehículos

## 📋 Descripción

Nuevo formulario wizard estilo **Typeform** para crear y editar vehículos en la app de combustibles. Basado en el componente reutilizable `ForestechFormWizard`.

## ✨ Características Principales

### 🎨 **Diseño Visual**
- **Fullscreen wizard** con animaciones suaves
- **Tema azul** específico para vehículos
- **Barra de progreso** animada estilo Typeform
- **Navegación por teclado** integrada
- **Feedback visual** en tiempo real

### 📝 **Pasos del Wizard**

1. **Información Básica** - ID, nombre, marca, modelo, año
2. **Categoría** - Selección visual de categoría de vehículo
3. **Especificaciones Técnicas** - Combustible, placa, potencia, capacidad
4. **Información Operacional** - Estado, ubicación, horómetro, fechas
5. **Resumen** - Vista previa antes de guardar

### 🔧 **Funcionalidades**

- **Validación por paso** con mensajes específicos
- **Vista previa** en cada paso
- **Autocompletado** y sugerencias
- **Navegación flexible** (anterior/siguiente)
- **Guardado automático** de progreso

## 🏗️ Arquitectura

### 📁 **Estructura de Archivos**
```
combustibles/src/components/
├── Shared/
│   ├── ForestechFormWizard.jsx     # Componente base reutilizable
│   └── ForestechFormWizard.css     # Estilos base
├── Vehicles/
│   ├── VehicleWizard.jsx           # Wrapper específico para vehículos
│   ├── VehicleWizardDemo.jsx       # Demo component
│   └── WizardSteps/
│       ├── Step1_BasicInfo.jsx     # Información básica
│       ├── Step2_Category.jsx      # Categoría del vehículo
│       ├── Step3_Technical.jsx     # Especificaciones técnicas
│       ├── Step4_Operational.jsx   # Info operacional
│       ├── Step5_Summary.jsx       # Resumen final
│       └── VehicleWizardSteps.css  # Estilos específicos
```

### 🔄 **Flujo de Datos**
```
VehicleWizard → ForestechFormWizard → Step Components
     ↓                    ↓                 ↓
  Validaciones        Navegación       Campos específicos
     ↓                    ↓                 ↓
  Guardar datos      Manejar estado    Actualizar formData
```

## 🚀 **Uso**

### Básico
```jsx
import VehicleWizard from './VehicleWizard';

function MyComponent() {
  const [showWizard, setShowWizard] = useState(false);

  return (
    <VehicleWizard
      isOpen={showWizard}
      onClose={() => setShowWizard(false)}
      onSuccess={(vehicleData) => {
        console.log('Vehículo creado:', vehicleData);
      }}
    />
  );
}
```

### Con vehículo existente (editar)
```jsx
<VehicleWizard
  isOpen={showWizard}
  onClose={() => setShowWizard(false)}
  vehicle={existingVehicle}  // Para editar
  onSuccess={(vehicleData) => {
    console.log('Vehículo actualizado:', vehicleData);
  }}
/>
```

## 🎯 **Ventajas vs Modal Tradicional**

| Aspecto | Modal Tradicional | Wizard Nuevo |
|---------|------------------|--------------|
| **UX** | Formulario denso | Paso a paso conversacional |
| **Validación** | Al final | En tiempo real por paso |
| **Complejidad** | Abrumador | Digestible y guiado |
| **Animaciones** | Básicas | Fluidas y modernas |
| **Navegación** | Solo scroll | Teclado + mouse |
| **Responsive** | Limitado | Optimizado móvil/desktop |

## 🔧 **Integración**

El wizard ya está integrado en `VehiclesMain.jsx` reemplazando `VehicleModalNew`. Para volver al modal anterior temporalmente:

```jsx
// En VehiclesMain.jsx
import VehicleModalNew from './VehicleModalNew';  // Cambiar por VehicleWizard
```

## 🎨 **Personalización**

### Temas disponibles
- `forestech` - Verde (por defecto)
- `vehicles` - Azul 
- `products` - Naranja

### Variables CSS personalizables
```css
:root {
  --vehicles-primary: #3b82f6;
  --vehicles-primary-dark: #2563eb;
  --vehicles-primary-light: #60a5fa;
  /* ... más variables */
}
```

## 🧪 **Testing**

Para probar el wizard usa el componente demo:

```jsx
import VehicleWizardDemo from './VehicleWizardDemo';

// Renderizar en tu app de desarrollo
<VehicleWizardDemo />
```

## 🚧 **Próximos Pasos**

- [ ] Migrar formulario de productos al mismo estilo
- [ ] Migrar formulario de categorías
- [ ] Añadir validaciones avanzadas
- [ ] Integrar con sistema de notificaciones
- [ ] Añadir guardado automático en borrador

## 🐛 **Debugging**

### Console logs importantes:
- `🔄 Paso X:` - Cambio de paso
- `💾 Guardando vehículo:` - Inicio guardado
- `✅ Vehículo guardado exitosamente` - Éxito
- `❌ Error al guardar vehículo:` - Error

### Eventos de teclado:
- `Enter` - Siguiente paso / Completar
- `Escape` - Cerrar wizard
- `1-9` - Selección rápida en opciones múltiples

---

## 📞 **Soporte**

Si encuentras problemas con el wizard, revisa:

1. **Categorías de vehículos** - El wizard necesita al menos una categoría
2. **Servicios** - Verifica que `vehiclesService` esté funcionando
3. **Contexto** - El contexto `CombustiblesContext` debe estar disponible

¡El wizard está listo para usar! 🎉
