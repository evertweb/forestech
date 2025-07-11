// combustibles/src/hooks/usePageData.js
// Hook para suscripción por demanda según la página - NIVEL 2 OPTIMIZACIÓN
import { useEffect } from 'react';
import { useInventory, useMovements, useVehicles, useSuppliers } from './useFirestoreData';

// Hook para suscribirse solo a los datos que necesita cada página
export const usePageData = (page) => {
  const inventory = useInventory();
  const movements = useMovements();
  const vehicles = useVehicles();
  const suppliers = useSuppliers();

  useEffect(() => {
    // Suscribirse solo a los datos necesarios para cada página
    switch (page) {
      case 'dashboard':
        // Dashboard necesita un resumen de todo
        inventory.subscribe();
        movements.subscribe();
        vehicles.subscribe();
        break;

      case 'inventory':
        inventory.subscribe();
        break;

      case 'movements':
        movements.subscribe();
        inventory.subscribe(); // Para validar stock
        vehicles.subscribe(); // Para mostrar vehículos en movimientos
        break;

      case 'vehicles':
        vehicles.subscribe();
        break;

      case 'suppliers':
        suppliers.subscribe();
        break;

      case 'reports':
        // Reportes necesita todos los datos
        inventory.subscribe();
        movements.subscribe();
        vehicles.subscribe();
        suppliers.subscribe();
        break;

      default:
        // No suscribirse a nada por defecto
        break;
    }

    // Cleanup se maneja automáticamente por los hooks individuales
  }, [page, inventory, movements, vehicles, suppliers]);

  return {
    inventory: inventory.data,
    movements: movements.data,
    vehicles: vehicles.data,
    suppliers: suppliers.data,
    loading: inventory.loading || movements.loading || vehicles.loading || suppliers.loading,
    error: inventory.error || movements.error || vehicles.error || suppliers.error
  };
};
