# 🕐 IMPLEMENTACIÓN SISTEMA DE HORÓMETROS - FORESTECH COMBUSTIBLES

## 🎯 PROBLEMA IDENTIFICADO

Tu aplicación tiene la estructura básica para horómetros pero **NO está implementada la lógica de cálculo**. Para vehículos que comienzan con horómetros avanzados (ej: 7764 horas), la aplicación actual:

❌ Guarda `currentHours` como texto no funcional
❌ `totalHoursWorked` siempre inicia en 0
❌ No actualiza horas en movimientos
❌ Sin validaciones de incremento de horómetro

## 🚀 SOLUCIÓN COMPLETA

### 📊 1. ESTRUCTURA DE DATOS MEJORADA

```javascript
// Estructura completa para vehículos con horómetro
const vehicleWithHourMeter = {
  // Datos básicos existentes...
  hasHourMeter: true,

  // 🆕 NUEVOS CAMPOS NECESARIOS:
  initialHourMeter: 7764, // Lectura inicial del horómetro
  currentHourMeter: 7764, // Lectura actual del horómetro
  totalHoursWorked: 0, // Horas trabajadas desde registro (currentHourMeter - initialHourMeter)
  lastHourMeterUpdate: new Date(), // Última actualización del horómetro

  // 🆕 HISTORIAL DE LECTURAS:
  hourMeterHistory: [
    {
      reading: 7764,
      date: new Date(),
      movementId: null, // null para lectura inicial
      previousReading: null,
      hoursWorked: 0,
      recordedBy: 'user@example.com',
    },
  ],

  // 🆕 MÉTRICAS AUTOMÁTICAS:
  averageHoursPerDay: 0, // Calculado automáticamente
  fuelConsumptionPerHour: 0, // Galones/hora real
  efficiencyRating: 'A', // A, B, C, D basado en consumo vs. estimado
};
```

### ⚙️ 2. SERVICIOS ACTUALIZADOS

```javascript
// combustibles/src/services/hourMeterService.js
export const HourMeterService = {
  /**
   * Registrar nueva lectura de horómetro
   */
  async recordHourMeterReading(vehicleId, newReading, movementId = null, userId) {
    return await runTransaction(db, async (transaction) => {
      const vehicleRef = doc(db, 'combustibles_vehicles', vehicleId);
      const vehicle = await transaction.get(vehicleRef);

      if (!vehicle.exists()) {
        throw new Error('Vehículo no encontrado');
      }

      const vehicleData = vehicle.data();
      const currentReading = vehicleData.currentHourMeter || vehicleData.initialHourMeter || 0;

      // 🔒 VALIDACIONES CRÍTICAS
      if (newReading < currentReading) {
        throw new Error(
          `Nueva lectura (${newReading}) no puede ser menor que la actual (${currentReading})`
        );
      }

      if (newReading - currentReading > 24) {
        throw new Error(
          `Incremento muy alto (${newReading - currentReading} horas). Máximo permitido: 24 horas`
        );
      }

      const hoursWorked = newReading - currentReading;
      const totalHoursWorked = (vehicleData.totalHoursWorked || 0) + hoursWorked;

      // 📝 CREAR REGISTRO EN HISTORIAL
      const historyEntry = {
        reading: newReading,
        date: new Date(),
        movementId,
        previousReading: currentReading,
        hoursWorked,
        recordedBy: userId,
        id: generateId(),
      };

      const updatedHistory = [...(vehicleData.hourMeterHistory || []), historyEntry];

      // 🔄 ACTUALIZAR VEHÍCULO
      transaction.update(vehicleRef, {
        currentHourMeter: newReading,
        totalHoursWorked,
        lastHourMeterUpdate: serverTimestamp(),
        hourMeterHistory: updatedHistory,
        // 📊 ACTUALIZAR MÉTRICAS
        averageHoursPerDay: this.calculateAverageHoursPerDay(vehicleData, totalHoursWorked),
        fuelConsumptionPerHour: this.calculateFuelConsumptionPerHour(vehicleData, totalHoursWorked),
      });

      return {
        hoursWorked,
        totalHoursWorked,
        newReading,
        previousReading: currentReading,
      };
    });
  },

  /**
   * Calcular consumo real por hora
   */
  calculateFuelConsumptionPerHour(vehicleData, totalHoursWorked) {
    if (totalHoursWorked === 0) return 0;

    const totalFuelConsumed = vehicleData.totalFuelConsumed || 0;
    return totalFuelConsumed / totalHoursWorked;
  },

  /**
   * Calcular promedio de horas por día
   */
  calculateAverageHoursPerDay(vehicleData, totalHoursWorked) {
    if (!vehicleData.createdAt || totalHoursWorked === 0) return 0;

    const daysActive = (new Date() - vehicleData.createdAt.toDate()) / (1000 * 60 * 60 * 24);
    return totalHoursWorked / daysActive;
  },

  /**
   * Validar lectura de horómetro antes de movimiento
   */
  async validateHourMeterForMovement(vehicleId, requiredReading) {
    const vehicle = await getVehicle(vehicleId);

    if (!vehicle.hasHourMeter) {
      return { valid: true, message: 'Vehículo sin horómetro' };
    }

    const currentReading = vehicle.currentHourMeter || vehicle.initialHourMeter || 0;

    if (!requiredReading) {
      return {
        valid: false,
        message: 'Debe proporcionar lectura actual del horómetro',
        currentReading,
      };
    }

    if (requiredReading < currentReading) {
      return {
        valid: false,
        message: `Lectura no puede ser menor que la actual (${currentReading})`,
        currentReading,
      };
    }

    return { valid: true, hoursWorked: requiredReading - currentReading };
  },
};
```

### 🔄 3. INTEGRACIÓN CON MOVIMIENTOS

```javascript
// Actualización en movementsService.js - función createMovement
export const createMovement = async (movementData, userInfo = null) => {
  try {
    // ... validaciones existentes ...

    // 🆕 VALIDAR HORÓMETRO SI ES NECESARIO
    if (movementData.vehicleId && movementData.type === MOVEMENT_TYPES.SALIDA) {
      const hourMeterValidation = await HourMeterService.validateHourMeterForMovement(
        movementData.vehicleId,
        movementData.hourMeterReading
      );

      if (!hourMeterValidation.valid) {
        throw new Error(hourMeterValidation.message);
      }

      // Agregar horas trabajadas al movimiento
      movement.hoursWorked = hourMeterValidation.hoursWorked || 0;
    }

    const result = await runTransaction(db, async (transaction) => {
      const movementRef = doc(collection(db, COLLECTION_NAME));
      transaction.set(movementRef, movement);

      // Actualizar inventario
      await updateInventoryFromMovement(transaction, movement, movementRef.id);

      // 🆕 ACTUALIZAR HORÓMETRO SI APLICA
      if (movement.vehicleId && movement.hourMeterReading && movement.hoursWorked > 0) {
        await HourMeterService.recordHourMeterReading(
          movement.vehicleId,
          movement.hourMeterReading,
          movementRef.id,
          userInfo?.email || 'sistema'
        );
      }

      return movementRef.id;
    });

    // ... resto de la función ...
  } catch (error) {
    // ... manejo de errores ...
  }
};
```

### 🎨 4. COMPONENTES UI ACTUALIZADOS

```javascript
// Componente para captura de horómetro en MovementWizard
const HourMeterInput = ({ vehicleId, value, onChange, error }) => {
  const [vehicleInfo, setVehicleInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (vehicleId) {
      setLoading(true);
      getVehicle(vehicleId).then((vehicle) => {
        setVehicleInfo(vehicle);
        setLoading(false);
      });
    }
  }, [vehicleId]);

  if (!vehicleInfo?.hasHourMeter) {
    return null; // No mostrar para vehículos sin horómetro
  }

  const currentReading = vehicleInfo.currentHourMeter || vehicleInfo.initialHourMeter || 0;
  const hoursWorked = value ? parseInt(value) - currentReading : 0;

  return (
    <div className="hour-meter-input">
      <label>Lectura Actual del Horómetro *</label>
      <div className="input-group">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={currentReading}
          placeholder={`Mínimo: ${currentReading}`}
          className={error ? 'error' : ''}
        />
        <span className="unit">horas</span>
      </div>

      {value && (
        <div className="hour-meter-info">
          <p>📊 Lectura anterior: {currentReading} horas</p>
          <p>⏱️ Horas trabajadas: {hoursWorked} horas</p>
          {hoursWorked > 12 && (
            <p className="warning">⚠️ Más de 12 horas de trabajo - Verificar lectura</p>
          )}
        </div>
      )}

      {error && <span className="error-message">{error}</span>}
    </div>
  );
};
```

### 📊 5. REPORTES DE HORÓMETROS

```javascript
// Nuevos reportes específicos para horómetros
export const HourMeterReports = {
  /**
   * Reporte de eficiencia por vehículo
   */
  async getEfficiencyReport(dateRange) {
    const vehicles = await getAllVehicles({ hasHourMeter: true });

    return vehicles.map((vehicle) => {
      const estimatedConsumption = vehicle.estimatedConsumptionPerHour || 0;
      const actualConsumption = vehicle.fuelConsumptionPerHour || 0;
      const efficiency = estimatedConsumption > 0 ? actualConsumption / estimatedConsumption : 0;

      return {
        vehicleId: vehicle.vehicleId,
        name: vehicle.name,
        totalHoursWorked: vehicle.totalHoursWorked || 0,
        estimatedConsumption,
        actualConsumption,
        efficiency: efficiency * 100, // Porcentaje
        rating: this.getEfficiencyRating(efficiency),
        lastReading: vehicle.currentHourMeter || 0,
        averageHoursPerDay: vehicle.averageHoursPerDay || 0,
      };
    });
  },

  getEfficiencyRating(efficiency) {
    if (efficiency <= 0.8) return 'A'; // Muy eficiente
    if (efficiency <= 1.0) return 'B'; // Eficiente
    if (efficiency <= 1.2) return 'C'; // Normal
    return 'D'; // Ineficiente
  },

  /**
   * Historial detallado de horómetro
   */
  async getHourMeterHistory(vehicleId, limit = 50) {
    const vehicle = await getVehicle(vehicleId);
    if (!vehicle?.hourMeterHistory) return [];

    return vehicle.hourMeterHistory
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit)
      .map((entry) => ({
        ...entry,
        date: new Date(entry.date),
        dailyAverage: this.calculateDailyAverage(entry, vehicle.hourMeterHistory),
      }));
  },
};
```

## 🎯 IMPLEMENTACIÓN PARA TU CASO (7764 horas)

```javascript
// Al crear vehículo con horómetro avanzado:
const newVehicle = {
  vehicleId: 'EXC001',
  name: 'Excavadora CAT 320',
  hasHourMeter: true,
  initialHourMeter: 7764, // 🎯 Valor inicial real
  currentHourMeter: 7764, // 🎯 Mismo valor al crear
  totalHoursWorked: 0, // ✅ Correcto: 0 horas trabajadas desde registro
  hourMeterHistory: [
    {
      reading: 7764,
      date: new Date(),
      movementId: null,
      previousReading: null,
      hoursWorked: 0,
      recordedBy: 'admin@forestech.com',
      note: 'Lectura inicial al registrar vehículo',
    },
  ],
};

// Primer movimiento (ej: 8 horas después):
const firstMovement = {
  vehicleId: 'EXC001',
  type: 'SALIDA',
  hourMeterReading: 7772, // 🎯 Nueva lectura
  // Sistema calculará automáticamente:
  // hoursWorked: 8 (7772 - 7764)
  // totalHoursWorked: 8
};
```

## ⚡ PASOS PARA IMPLEMENTAR

1. **Crear `hourMeterService.js`** con la lógica completa
2. **Actualizar `vehiclesService.js`** para usar nuevos campos
3. **Modificar `movementsService.js`** para capturar horómetros
4. **Actualizar componentes UI** para mostrar campos de horómetro
5. **Crear componentes de reportes** específicos para horómetros
6. **Migrar datos existentes** agregando campos faltantes

## 🚨 MIGRACIÓN DE DATOS EXISTENTES

```javascript
// Script para migrar vehículos existentes
const migrateExistingVehicles = async () => {
  const vehicles = await getAllVehicles();

  for (const vehicle of vehicles) {
    if (vehicle.hasHourMeter && !vehicle.initialHourMeter) {
      const currentHours = parseInt(vehicle.currentHours) || 0;

      await updateVehicle(vehicle.id, {
        initialHourMeter: currentHours,
        currentHourMeter: currentHours,
        totalHoursWorked: 0,
        hourMeterHistory: [
          {
            reading: currentHours,
            date: new Date(),
            movementId: null,
            previousReading: null,
            hoursWorked: 0,
            recordedBy: 'sistema_migracion',
            note: 'Migración automática - lectura inicial',
          },
        ],
      });
    }
  }
};
```

**¿Quieres que implemente esta solución completa en tu aplicación?**
