/**
 * Ejemplo de integración: MovementsList con SQL Server
 * Muestra cómo migrar un componente existente
 */

import React, { useState, useEffect } from 'react';

// ❌ ANTES: Usando Firestore
// import { movementsService } from '../services/movementsService.js';

// ✅ DESPUÉS: Usando SQL Server
import sqlMovementsService from '../services/SqlMovementsService.js';

const MovementsList = () => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMovements();
  }, []);

  const loadMovements = async () => {
    try {
      setLoading(true);
      setError(null);

      // ✅ MISMA LLAMADA - implementación diferente
      const result = await sqlMovementsService.getAllMovements({
        limit: 20,
        orderBy: 'createdAt',
        orderDirection: 'DESC'
      });

      if (result.success) {
        setMovements(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error al cargar movimientos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const createMovement = async (movementData) => {
    try {
      // ✅ MISMA LLAMADA - implementación diferente
      const result = await sqlMovementsService.createMovement(movementData, {
        email: 'usuario@ejemplo.com',
        uid: 'user123'
      });

      if (result.success) {
        console.log('✅ Movimiento creado:', result.id);
        loadMovements(); // Recargar lista
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error al crear movimiento: ' + err.message);
    }
  };

  const deleteMovement = async (movementId) => {
    if (!confirm('¿Estás seguro de eliminar este movimiento?')) return;

    try {
      // ✅ MISMA LLAMADA - implementación diferente
      const result = await sqlMovementsService.deleteMovement(movementId);

      if (result.success) {
        console.log('✅ Movimiento eliminado');
        loadMovements(); // Recargar lista
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error al eliminar movimiento: ' + err.message);
    }
  };

  if (loading) {
    return <div className="loading">Cargando movimientos...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="movements-list">
      <h2>Movimientos de Combustible</h2>

      <div className="movements-grid">
        {movements.map(movement => (
          <div key={movement.id} className="movement-card">
            <div className="movement-header">
              <span className="movement-type">{movement.type}</span>
              <span className="movement-fuel">{movement.fuelType}</span>
            </div>

            <div className="movement-details">
              <p>Cantidad: {movement.quantity} galones</p>
              <p>Precio: ${movement.unitPrice}</p>
              <p>Total: ${movement.totalValue}</p>
              <p>Vehículo: {movement.vehicleId || 'N/A'}</p>
              <p>Fecha: {new Date(movement.createdAt).toLocaleDateString()}</p>
            </div>

            <div className="movement-actions">
              <button
                onClick={() => deleteMovement(movement.id)}
                className="btn-delete"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {movements.length === 0 && (
        <p className="no-data">No hay movimientos registrados</p>
      )}
    </div>
  );
};

export default MovementsList;