/**
 * Ejemplo de Migración: Firestore → Azure SQL Server
 * Demuestra cómo migrar servicios existentes
 * Forestech Combustibles App
 */

// ===========================================
// DEPENDENCIAS NECESARIAS (agregar a package.json)
// ===========================================

/*
"dependencies": {
  "mssql": "^10.0.1",
  // ... otras dependencias
}
*/

// ===========================================
// EJEMPLO DE MIGRACIÓN DE SERVICIO
// ===========================================

// ❌ ANTES: Usando Firestore
/*
import { movementsService } from './movementsService.js';

// Crear movimiento con Firestore
const result = await movementsService.createMovement(movementData, userInfo);
*/

// ✅ DESPUÉS: Usando Azure SQL Server
/*
import sqlMovementsService from './SqlMovementsService.js';

// Crear movimiento con SQL Server (misma interfaz)
const result = await sqlMovementsService.createMovement(movementData, userInfo);
*/

// ===========================================
// COMPARACIÓN DE INTERFACES
// ===========================================

// Interfaz Firestore (original)
const firestoreInterface = {
  createMovement: async (_data, _user) => { /* ... */ },
  getAllMovements: async (_filters) => { /* ... */ },
  getMovement: async (_id) => { /* ... */ },
  updateMovement: async (_id, _data) => { /* ... */ },
  deleteMovement: async (_id) => { /* ... */ },
};

// Interfaz SQL Server (nueva - compatible)
const sqlInterface = {
  createMovement: async (_data, _user) => { /* ... */ },
  getAllMovements: async (_filters) => { /* ... */ },
  getMovement: async (_id) => { /* ... */ },
  updateMovement: async (_id, _data) => { /* ... */ },
  deleteMovement: async (_id) => { /* ... */ },
};

// ✅ MISMA INTERFAZ = FÁCIL MIGRACIÓN

// ===========================================
// EJEMPLO DE USO EN COMPONENTE REACT
// ===========================================

/*
// En tu componente React - solo cambia el import
import sqlMovementsService from '../services/SqlMovementsService.js';
// import { movementsService } from '../services/movementsService.js'; // ❌ Viejo

const MovementsComponent = () => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMovements();
  }, []);

  const loadMovements = async () => {
    setLoading(true);
    try {
      // ✅ MISMA LLAMADA - diferente implementación
      const result = await sqlMovementsService.getAllMovements({
        type: 'entrada',
        limit: 10
      });

      if (result.success) {
        setMovements(result.data);
      }
    } catch (error) {
      console.error('Error cargando movimientos:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNewMovement = async (movementData) => {
    try {
      // ✅ MISMA LLAMADA - diferente implementación
      const result = await sqlMovementsService.createMovement(movementData, {
        email: 'user@example.com',
        uid: 'user123'
      });

      if (result.success) {
        console.log('Movimiento creado:', result.id);
        loadMovements(); // Recargar lista
      }
    } catch (error) {
      console.error('Error creando movimiento:', error);
    }
  };

  return (
    <div>
      <h2>Movimientos de Combustible</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <ul>
          {movements.map(movement => (
            <li key={movement.id}>
              {movement.type} - {movement.fuelType} - {movement.quantity} galones
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
*/

// ===========================================
// CONFIGURACIÓN DE ENTORNO
// ===========================================

/*
// .env.local
VITE_AZURE_SQL_SERVER=oilforestech.database.windows.net
VITE_AZURE_SQL_DATABASE=forestechCombus
VITE_AZURE_SQL_USER=oil
VITE_AZURE_SQL_PASSWORD=271202ev
*/

// ===========================================
// SCRIPT DE INICIALIZACIÓN DE BASE DE DATOS
// ===========================================

/*
// Ejecutar una sola vez en Azure SQL Server
const initDatabase = async () => {
  try {
    // Conectar a master database primero
    const masterConfig = {
      ...sqlConfig,
      database: 'master'
    };

    const masterPool = await sql.connect(masterConfig);

    // Crear base de datos si no existe
    await masterPool.request().query(`
      IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'forestechCombus')
      CREATE DATABASE forestechCombus;
    `);

    await masterPool.close();

    // Conectar a la base de datos específica
    const pool = await sql.connect(sqlConfig);

    // Ejecutar scripts de creación de tablas
    await pool.request().query(createTablesScript);

    console.log('✅ Base de datos inicializada correctamente');
  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error);
  }
};
*/

// ===========================================
// VENTAJAS DE LA MIGRACIÓN
// ===========================================

/*
VENTAJAS TÉCNICAS:
✅ Consultas SQL optimizadas vs NoSQL
✅ ACID completo vs eventual consistency
✅ Joins nativos vs documentos anidados
✅ Mejor manejo de datos relacionales
✅ Índices avanzados para búsquedas complejas

VENTAJAS OPERATIVAS:
✅ Costo potencialmente menor (Azure SQL vs Firebase)
✅ Mejor control de datos y backups
✅ Integración con otras herramientas Microsoft
✅ Escalabilidad horizontal y vertical
✅ Monitoreo avanzado con Azure Monitor

VENTAJAS DE DESARROLLO:
✅ Misma interfaz = migración transparente
✅ Mejor debugging con queries SQL
✅ Transacciones más robustas
✅ Validaciones a nivel de base de datos
✅ Stored procedures para lógica compleja
*/

// ===========================================
// PASOS PARA COMPLETAR LA MIGRACIÓN
// ===========================================

/*
1. ✅ Crear scripts SQL de tablas
2. ✅ Implementar capa de conexión SQL
3. ✅ Crear servicios base SQL
4. 🔄 Migrar servicios específicos (uno por uno)
5. 🔄 Actualizar componentes para usar nuevos servicios
6. 🔄 Probar funcionalidad
7. 🔄 Desplegar a producción
8. 🔄 Monitorear rendimiento

ESTRATEGIA RECOMENDADA:
- Migrar por módulos (movements, inventory, vehicles, etc.)
- Mantener ambos sistemas en paralelo durante transición
- Probar exhaustivamente cada módulo antes de pasar al siguiente
- Tener plan de rollback si algo falla
*/

export default {
  firestoreInterface,
  sqlInterface,
  // Otras utilidades de migración...
};