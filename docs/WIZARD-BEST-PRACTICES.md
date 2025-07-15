# Mejores Prácticas para Componentes de Wizard

## Problemas Resueltos: "Cannot access before initialization"

### ❌ Problema Original
Los componentes de pasos del wizard tenían errores de tipo `ReferenceError: Cannot access 'handleFunction' before initialization` debido a que las funciones se usaban en `useEffect` antes de ser declaradas.

### ✅ Solución Aplicada

#### Patrón Problemático (EVITAR):
```jsx
// ❌ MAL: useEffect usa la función antes de que sea declarada
useEffect(() => {
  const handleKeyPress = (e) => {
    // Usa handleSelection antes de que sea declarada
    handleSelection(someValue);
  };
  // ...
}, [handleSelection]); // ❌ Función en dependencias pero no declarada aún

// Función declarada DESPUÉS del useEffect que la usa
const handleSelection = (value) => {
  // lógica
};
```

#### Patrón Correcto (USAR):
```jsx
// ✅ BIEN: Función declarada primero con useCallback
const handleSelection = useCallback((value) => {
  // lógica
}, [updateFormData, setError]); // Dependencias correctas

// useEffect que usa la función
useEffect(() => {
  const handleKeyPress = (e) => {
    handleSelection(someValue); // ✅ Función ya está declarada
  };
  // ...
}, [handleSelection]); // ✅ Dependencia válida
```

## Reglas de Oro para React Hooks

### 1. **Orden de Declaración**
```jsx
// ✅ Orden correcto:
const Component = () => {
  // 1. Estados
  const [state, setState] = useState();
  
  // 2. Funciones con useCallback (si se usan en useEffect)
  const handleFunction = useCallback(() => {
    // lógica
  }, [dependencies]);
  
  // 3. useEffect que usan las funciones
  useEffect(() => {
    // usa handleFunction
  }, [handleFunction]);
  
  // 4. Funciones que NO se usan en useEffect
  const localFunction = () => {
    // lógica local
  };
  
  // 5. Render
  return <div>...</div>;
};
```

### 2. **Uso de useCallback**
```jsx
// ✅ Usar useCallback para funciones en dependencias de useEffect
const handleSelection = useCallback((value) => {
  updateFormData('field', value);
  setError('');
}, [updateFormData, setError]);

// ❌ NO usar const para funciones en useEffect
const handleSelection = (value) => {
  // Esta función causará el error si se usa en useEffect
};
```

### 3. **Dependencias Completas**
```jsx
// ✅ Incluir todas las dependencias
const handleFunction = useCallback((value) => {
  updateFormData(field, value);
  setError('');
  someOtherFunction();
}, [updateFormData, setError, field, someOtherFunction]);
```

## Archivos Corregidos

### ✅ Step1_MovementType.jsx
- **Problema**: `handleSelection` usado en useEffect antes de declaración
- **Solución**: Movido a `useCallback` antes del `useEffect`

### ✅ Step2_FuelType.jsx  
- **Problema**: `handleFuelSelection` usado en useEffect antes de declaración
- **Solución**: Movido a `useCallback` antes del `useEffect`

### ✅ Step3_Location.jsx
- **Problema**: `handleLocationSelection` usado en useEffect antes de declaración  
- **Solución**: Movido a `useCallback` antes del `useEffect`

### ✅ Step5_Vehicle.jsx
- **Problema**: `handleVehicleSelection` usado en useEffect antes de declaración
- **Solución**: Movido a `useCallback` antes del `useEffect`

## Checklist de Revisión

Antes de crear o modificar componentes de wizard:

- [ ] ¿Las funciones usadas en `useEffect` están declaradas con `useCallback`?
- [ ] ¿Las funciones están declaradas ANTES de los `useEffect` que las usan?
- [ ] ¿Todas las dependencias están incluidas en el array de dependencias?
- [ ] ¿No hay "temporal dead zone" issues?

## Temporal Dead Zone Explicación

En JavaScript, las variables declaradas con `const` y `let` están en la "temporal dead zone" desde el inicio del scope hasta que son inicializadas:

```jsx
// ❌ Error: Cannot access 'myFunction' before initialization
console.log(myFunction); // Temporal dead zone
const myFunction = () => {};

// ✅ Funciona: var es hoisted
console.log(myVar); // undefined, pero no error
var myVar = "value";
```

En React, `useCallback` resuelve esto porque se ejecuta inmediatamente y "registra" la función.

## Testing

Para probar que los componentes no tienen este error:

1. Navegar a la app de combustibles
2. Ir a "Movimientos" → "Nuevo Movimiento"
3. Seleccionar tipo de movimiento: "Entrada"
4. Verificar que el paso 2 (selección de combustible) funciona sin errores en consola
5. Continuar con todos los pasos verificando la consola

---

**Fecha de creación**: 14 de julio de 2025  
**Última actualización**: 14 de julio de 2025  
**Estado**: ✅ Todos los errores de inicialización resueltos
