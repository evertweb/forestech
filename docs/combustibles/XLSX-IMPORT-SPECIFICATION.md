# Especificación para Importación XLSX - Movimientos de Salida

## 📊 Estructura de Columnas Optimizada

Para facilitar la carga de datos históricos, los archivos XLSX deben seguir este orden de columnas que coincide con el nuevo flujo del wizard:

### 🔄 Orden de Columnas para SALIDA:

| Columna | Campo Firebase | Descripción | Ejemplo |
|---------|----------------|-------------|---------|
| **A** | `effectiveDate` | Fecha y hora del movimiento | `2025-07-15 14:30` |
| **B** | `type` | Tipo de movimiento (fijo: "salida") | `salida` |
| **C** | `fuelType` | Tipo de combustible | `diesel`, `gasolina`, `acpm` |
| **D** | `vehicleId` | Identificador del vehículo | `TR1`, `CAM2`, `EXC1` |
| **E** | `quantity` | Cantidad en galones/litros | `150.5` |
| **F** | `unitPrice` | Precio por unidad | `12500` |
| **G** | `currentHours` | Horómetro actual (opcional) | `1250.5` |
| **H** | `description` | Descripción del movimiento | `Consumo diario tractor` |
| **I** | `reference` | Referencia o número de orden | `ORD-2025-001` |

### 📝 Template de Encabezados XLSX:

```
Fecha | Tipo | Producto | Vehículo | Cantidad | Precio | Horómetro | Descripción | Referencia
```

### ✅ Validaciones Automáticas:

1. **Fecha**: No puede ser futura ni anterior a 1 año
2. **Tipo**: Debe ser exactamente "salida"
3. **Producto**: Debe existir en el catálogo (`diesel`, `gasolina`, `acpm`, `lubricantes`)
4. **Vehículo**: Debe existir en la base de datos de vehículos
5. **Cantidad**: Debe ser un número positivo
6. **Precio**: Debe ser un número no negativo
7. **Horómetro**: Opcional, debe ser mayor al último registrado para el vehículo

### 🎯 Beneficios del Nuevo Orden:

1. **Cronológico**: Fecha al inicio facilita ordenamiento temporal
2. **Contexto**: Tipo y producto proporcionan contexto inmediato
3. **Responsable**: Vehículo identifica el consumidor
4. **Medición**: Cantidad y precio son las métricas principales
5. **Detalle**: Información adicional al final

### 🔧 Ejemplo de Fila de Datos:

```
2025-07-15 14:30 | salida | diesel | TR1 | 150.5 | 12500 | 1250.5 | Trabajo cultivo | ORD-2025-001
```

### 🚀 Importación Automática:

El sistema de migración wizard podrá procesar archivos con esta estructura:

```javascript
const columnMapping = {
  A: 'effectiveDate',
  B: 'type', 
  C: 'fuelType',
  D: 'vehicleId',
  E: 'quantity',
  F: 'unitPrice',
  G: 'currentHours',
  H: 'description',
  I: 'reference'
};
```

### 📋 Notas Importantes:

- Las columnas G, H, I son opcionales
- El sistema auto-calculará `totalValue` (quantity × unitPrice)
- Se asignará automáticamente `location: 'principal'` si no se especifica
- Los timestamps del sistema (`createdAt`, `updatedAt`) se generan automáticamente
- El `status` se establece como 'completado' automáticamente
