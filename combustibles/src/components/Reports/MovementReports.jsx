/**
 * MovementReports.jsx - Reportes específicos de movimientos
 * Análisis de entradas, salidas, transferencias y tendencias operacionales
 */

import React, { useMemo, useState } from 'react';
import {
  calculateMovementsStats,
  calculateMovementCosts,
  calculatePeriodValue,
  formatCurrency,
  formatNumber,
} from '../../utils/calculations';
// ✅ SIMPLIFIED: Solo ENTRADA y SALIDA según decisiones CORE
const MOVEMENT_TYPES = {
  ENTRADA: 'entrada',
  SALIDA: 'salida',
};
import { FUEL_INFO } from '../../constants/combustibleTypes';

const MovementReports = ({ movements, dateRange, vehicles }) => {
  const [selectedType, setSelectedType] = useState('all');
  const [selectedFuelType, setSelectedFuelType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  // Filtrar movimientos por criterios seleccionados
  const filteredMovements = useMemo(() => {
    let filtered = movements;

    // Filtro por rango de fechas
    if (dateRange.start || dateRange.end) {
      filtered = filtered.filter((movement) => {
        const movementDate = new Date(movement.createdAt || movement.date);
        const startDate = dateRange.start ? new Date(dateRange.start) : new Date(0);
        const endDate = dateRange.end ? new Date(dateRange.end) : new Date();
        return movementDate >= startDate && movementDate <= endDate;
      });
    }

    // Filtro por tipo de movimiento
    if (selectedType !== 'all') {
      filtered = filtered.filter((movement) => movement.type === selectedType);
    }

    // Filtro por tipo de combustible
    if (selectedFuelType !== 'all') {
      // 🔧 Normalizar ambos lados de la comparación a mayúsculas
      const normalizedSelectedType = selectedFuelType.toUpperCase();
      filtered = filtered.filter(
        (movement) => movement.fuelType?.toUpperCase() === normalizedSelectedType
      );
    }

    // Filtro por ubicación
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(
        (movement) =>
          movement.location === selectedLocation ||
          movement.sourceLocation === selectedLocation ||
          movement.destinationLocation === selectedLocation
      );
    }

    return filtered;
  }, [movements, dateRange, selectedType, selectedFuelType, selectedLocation]);

  // Obtener valores únicos para filtros
  const uniqueValues = useMemo(() => {
    const fuelTypes = [...new Set(movements.map((m) => m.fuelType).filter(Boolean))];
    const locations = [
      ...new Set(
        movements.flatMap((m) =>
          [m.location, m.sourceLocation, m.destinationLocation].filter(Boolean)
        )
      ),
    ];

    return { fuelTypes, locations };
  }, [movements]);

  // Calcular estadísticas
  const movementsStats = useMemo(
    () => calculateMovementsStats(filteredMovements),
    [filteredMovements]
  );
  const costsAnalysis = useMemo(
    () => calculateMovementCosts(filteredMovements),
    [filteredMovements]
  );
  const _periodValue = useMemo(
    () => calculatePeriodValue(filteredMovements, dateRange),
    [filteredMovements, dateRange]
  );

  // Análisis por tipo de movimiento
  const movementTypeAnalysis = useMemo(() => {
    const types = Object.values(MOVEMENT_TYPES);
    return types.map((type) => {
      const typeMovements = filteredMovements.filter((m) => m.type === type);
      const totalQuantity = typeMovements.reduce(
        (sum, m) => sum + (parseFloat(m.quantity) || 0),
        0
      );
      const totalValue = typeMovements.reduce(
        (sum, m) => sum + (parseFloat(m.quantity) || 0) * (parseFloat(m.unitPrice) || 0),
        0
      );

      return {
        type,
        count: typeMovements.length,
        totalQuantity,
        totalValue,
        percentage:
          movementsStats.totalMovements > 0
            ? (typeMovements.length / movementsStats.totalMovements) * 100
            : 0,
      };
    });
  }, [filteredMovements, movementsStats.totalMovements]);

  // Análisis por combustible
  const fuelTypeAnalysis = useMemo(() => {
    const analysis = {};
    uniqueValues.fuelTypes.forEach((fuelType) => {
      // 🔧 Normalizar comparación de fuelType
      const normalizedFuelType = fuelType.toUpperCase();
      const fuelMovements = filteredMovements.filter(
        (m) => m.fuelType?.toUpperCase() === normalizedFuelType
      );
      const totalQuantity = fuelMovements.reduce(
        (sum, m) => sum + (parseFloat(m.quantity) || 0),
        0
      );
      const totalValue = fuelMovements.reduce(
        (sum, m) => sum + (parseFloat(m.quantity) || 0) * (parseFloat(m.unitPrice) || 0),
        0
      );
      const avgPrice =
        fuelMovements.length > 0
          ? fuelMovements.reduce((sum, m) => sum + (parseFloat(m.unitPrice) || 0), 0) /
            fuelMovements.length
          : 0;

      analysis[fuelType] = {
        count: fuelMovements.length,
        totalQuantity,
        totalValue,
        avgPrice,
        fuelInfo: FUEL_INFO[fuelType] || {},
      };
    });
    return analysis;
  }, [filteredMovements, uniqueValues.fuelTypes]);

  // Análisis temporal (por mes)
  const temporalAnalysis = useMemo(() => {
    const monthlyData = {};

    filteredMovements.forEach((movement) => {
      const date = new Date(movement.createdAt || movement.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthKey,
          entradas: 0,
          salidas: 0,
          totalQuantity: 0,
          totalValue: 0,
        };
      }

      const quantity = parseFloat(movement.quantity) || 0;
      const value = quantity * (parseFloat(movement.unitPrice) || 0);

      // ✅ SIMPLIFIED: Solo contar entradas y salidas
      if (movement.type === MOVEMENT_TYPES.ENTRADA) {
        monthlyData[monthKey].entradas++;
      } else if (movement.type === MOVEMENT_TYPES.SALIDA) {
        monthlyData[monthKey].salidas++;
      }
      monthlyData[monthKey].totalQuantity += quantity;
      monthlyData[monthKey].totalValue += value;
    });

    return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
  }, [filteredMovements]);

  // Top vehículos por consumo
  const topVehicles = useMemo(() => {
    const vehicleConsumption = {};

    filteredMovements
      .filter((m) => m.type === MOVEMENT_TYPES.SALIDA && m.vehicleId)
      .forEach((movement) => {
        const vehicleId = movement.vehicleId;
        const quantity = parseFloat(movement.quantity) || 0;

        if (!vehicleConsumption[vehicleId]) {
          vehicleConsumption[vehicleId] = {
            vehicleId,
            totalConsumption: 0,
            movementsCount: 0,
            vehicle: vehicles.find((v) => v.vehicleId === vehicleId),
          };
        }

        vehicleConsumption[vehicleId].totalConsumption += quantity;
        vehicleConsumption[vehicleId].movementsCount++;
      });

    return Object.values(vehicleConsumption)
      .sort((a, b) => b.totalConsumption - a.totalConsumption)
      .slice(0, 10);
  }, [filteredMovements, vehicles]);

  // Función para exportar
  const exportToCSV = () => {
    const headers = [
      'Fecha',
      'Tipo',
      'Combustible',
      'Cantidad',
      'Precio Unitario',
      'Valor Total',
      'Ubicación Origen',
      'Ubicación Destino',
      'Vehículo',
      'Estado',
    ];

    const csvData = filteredMovements.map((movement) => [
      new Date(movement.createdAt || movement.date).toLocaleDateString(),
      movement.type,
      movement.fuelType,
      formatNumber(movement.quantity),
      formatCurrency(movement.unitPrice),
      formatCurrency((parseFloat(movement.quantity) || 0) * (parseFloat(movement.unitPrice) || 0)),
      movement.sourceLocation || movement.location || '',
      movement.destinationLocation || '',
      movement.vehicleId || '',
      movement.status,
    ]);

    const csvContent = [headers, ...csvData].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `movimientos_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="apple-card">
      {/* KPIs de movimientos */}
      <div className="apple-stats-grid">
        <div className="apple-card">
          <div className="apple-stat-card-icon">📈</div>
          <div className="apple-form-input">{movementsStats.totalMovements}</div>
          <div className="apple-form-label">Movimientos Totales</div>
          <div className="apple-status-badge">
            <span className="apple-status-badge">✅</span>
            {movementsStats.completedMovements} completados
          </div>
        </div>

        <div className="apple-card">
          <div className="apple-stat-card-icon">🛢️</div>
          <div className="apple-form-input">{formatNumber(movementsStats.totalQuantity)}</div>
          <div className="apple-form-label">Cantidad Total (L)</div>
          <div className="apple-status-badge">
            <span className="apple-status-badge">📊</span>
            Promedio:{' '}
            {formatNumber(movementsStats.totalQuantity / (movementsStats.totalMovements || 1), 1)} L
          </div>
        </div>

        <div className="apple-card">
          <div className="apple-stat-card-icon">💰</div>
          <div className="apple-form-input">{formatCurrency(costsAnalysis.totalCost)}</div>
          <div className="apple-form-label">Valor Total</div>
          <div className="apple-status-badge">
            <span className="apple-status-badge">💵</span>
            {formatCurrency(costsAnalysis.averageCostPerMovement)} promedio
          </div>
        </div>

        <div className="apple-card">
          <div className="apple-stat-card-icon">⚠️</div>
          <div className="apple-form-input">{movementsStats.pendingMovements}</div>
          <div className="apple-form-label">Pendientes</div>
          <div
            className={`apple-status-badge ${movementsStats.pendingMovements > 0 ? 'negative' : 'positive'}`}
          >
            <span className="apple-status-badge">
              {movementsStats.pendingMovements > 0 ? '⏳' : '✅'}
            </span>
            {movementsStats.cancelledMovements} cancelados
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="apple-card">
        <div className="apple-card">
          <div className="apple-form-group">
            <label className="apple-form-label">Tipo de Movimiento</label>
            <select
              className="apple-form-input"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">Todos los tipos</option>
              <option value={MOVEMENT_TYPES.ENTRADA}>Entradas</option>
              <option value={MOVEMENT_TYPES.SALIDA}>Salidas</option>
            </select>
          </div>
          <div className="apple-form-group">
            <label className="apple-form-label">Tipo de Combustible</label>
            <select
              className="apple-form-input"
              value={selectedFuelType}
              onChange={(e) => setSelectedFuelType(e.target.value)}
            >
              <option value="all">Todos los combustibles</option>
              {uniqueValues.fuelTypes.map((fuelType) => (
                <option key={fuelType} value={fuelType}>
                  {fuelType}
                </option>
              ))}
            </select>
          </div>
          <div className="apple-form-group">
            <label className="apple-form-label">Ubicación</label>
            <select
              className="apple-form-input"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="all">Todas las ubicaciones</option>
              {uniqueValues.locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
          <div className="apple-action-buttons">
            <button className="apple-button apple-button-secondary" onClick={exportToCSV}>
              📊 Exportar CSV
            </button>
          </div>
        </div>
      </div>

      {/* Análisis por tipo de movimiento */}
      <div className="apple-card">
        <div className="apple-card">
          <h3 className="apple-form-label">📊 Movimientos por Tipo</h3>
        </div>
        <div className="apple-card">
          <div className="apple-stats-grid">
            {movementTypeAnalysis.map((typeData) => (
              <div key={typeData.type} className="apple-card">
                <h4>
                  {typeData.type === MOVEMENT_TYPES.ENTRADA && '📥 Entradas'}
                  {typeData.type === MOVEMENT_TYPES.SALIDA && '📤 Salidas'}
                </h4>
                <div className="apple-card">
                  <div className="apple-card">
                    <span className="apple-form-input">{typeData.count}</span>
                    <span className="apple-form-label">Movimientos</span>
                  </div>
                  <div className="apple-card">
                    <span className="apple-form-input">
                      {formatNumber(typeData.totalQuantity)} L
                    </span>
                    <span className="apple-form-label">Cantidad</span>
                  </div>
                  <div className="apple-card">
                    <span className="apple-form-input">
                      {formatCurrency(typeData.totalValue)}
                    </span>
                    <span className="apple-form-label">Valor</span>
                  </div>
                  <div className="apple-card">
                    <span className="apple-form-input">
                      {formatNumber(typeData.percentage, 1)}%
                    </span>
                    <span className="apple-form-label">Participación</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Análisis por combustible */}
      <div className="apple-card">
        <div className="apple-card">
          <h3 className="apple-form-label">⛽ Análisis por Tipo de Combustible</h3>
        </div>
        <div className="apple-card">
          <div className="apple-stats-grid">
            {Object.entries(fuelTypeAnalysis).map(([fuelType, analysis]) => (
              <div key={fuelType} className="apple-card">
                <h4>
                  <span style={{ marginRight: '0.5rem' }}>{analysis.fuelInfo.icon || '⛽'}</span>
                  {analysis.fuelInfo.name || fuelType.toUpperCase()}
                </h4>
                <div className="apple-card">
                  <div className="apple-card">
                    <span className="apple-form-label">Movimientos:</span>
                    <span className="apple-form-input">{analysis.count}</span>
                  </div>
                  <div className="apple-card">
                    <span className="apple-form-label">Cantidad:</span>
                    <span className="apple-form-input">
                      {formatNumber(analysis.totalQuantity)} {analysis.fuelInfo.unit || 'L'}
                    </span>
                  </div>
                  <div className="apple-card">
                    <span className="apple-form-label">Valor:</span>
                    <span className="apple-form-input">
                      {formatCurrency(analysis.totalValue)}
                    </span>
                  </div>
                  <div className="apple-card">
                    <span className="apple-form-label">Precio Promedio:</span>
                    <span className="apple-form-input">
                      {formatCurrency(analysis.avgPrice)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top vehículos consumidores */}
      {topVehicles.length > 0 && (
        <div className="apple-card">
          <div className="apple-card">
            <h3 className="apple-form-label">🚜 Top Vehículos por Consumo</h3>
          </div>
          <div className="apple-card">
            <div className="apple-card">
              {topVehicles.slice(0, 5).map((vehicleData, index) => (
                <div key={vehicleData.vehicleId} className="apple-card">
                  <div className="apple-status-badge">#{index + 1}</div>
                  <div className="apple-card">
                    <h4>{vehicleData.vehicleId}</h4>
                    <p>{vehicleData.vehicle?.name || 'Nombre no disponible'}</p>
                  </div>
                  <div className="apple-card">
                    <span className="apple-form-input">
                      {formatNumber(vehicleData.totalConsumption)} L
                    </span>
                    <span className="apple-form-label">
                      {vehicleData.movementsCount} movimientos
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tendencia temporal */}
      {temporalAnalysis.length > 0 && (
        <div className="apple-card">
          <div className="apple-card">
            <h3 className="apple-form-label">📈 Tendencia Temporal</h3>
          </div>
          <div className="apple-card">
            <div className="apple-card">
              {temporalAnalysis.map((monthData) => (
                <div key={monthData.month} className="apple-card">
                  <h4>{monthData.month}</h4>
                  <div className="apple-card">
                    <div className="apple-card">
                      <span className="apple-form-label">📥 Entradas:</span>
                      <span className="apple-form-input">{monthData.entradas}</span>
                    </div>
                    <div className="apple-card">
                      <span className="apple-form-label">📤 Salidas:</span>
                      <span className="apple-form-input">{monthData.salidas}</span>
                    </div>
                    <div className="apple-card">
                      <span className="apple-form-label">💰 Valor:</span>
                      <span className="apple-form-input">
                        {formatCurrency(monthData.totalValue)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tabla detallada */}
      <div className="apple-card">
        <div className="apple-card">
          <h3 className="apple-form-label">📋 Movimientos Detallados</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="apple-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Combustible</th>
                <th>Cantidad</th>
                <th>Precio Unit.</th>
                <th>Valor Total</th>
                <th>Origen</th>
                <th>Destino</th>
                <th>Vehículo</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {filteredMovements.slice(0, 100).map((movement, index) => (
                <tr key={index}>
                  <td>{new Date(movement.createdAt || movement.date).toLocaleDateString()}</td>
                  <td>
                    <span
                      className={`apple-status-badge ${
                        movement.type === MOVEMENT_TYPES.ENTRADA
                          ? 'success'
                          : movement.type === MOVEMENT_TYPES.SALIDA
                            ? 'warning'
                            : 'secondary'
                      }`}
                    >
                      {movement.type}
                    </span>
                  </td>
                  <td>{movement.fuelType}</td>
                  <td>{formatNumber(movement.quantity)} L</td>
                  <td>{formatCurrency(movement.unitPrice)}</td>
                  <td>
                    {formatCurrency(
                      (parseFloat(movement.quantity) || 0) * (parseFloat(movement.unitPrice) || 0)
                    )}
                  </td>
                  <td>{movement.sourceLocation || movement.location || '-'}</td>
                  <td>{movement.destinationLocation || '-'}</td>
                  <td>{movement.vehicleId || '-'}</td>
                  <td>
                    <span
                      className={`apple-status-badge ${
                        movement.status === 'completado'
                          ? 'success'
                          : movement.status === 'pendiente'
                            ? 'warning'
                            : 'danger'
                      }`}
                    >
                      {movement.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredMovements.length > 100 && (
          <div style={{ padding: '1rem', textAlign: 'center', color: '#64748b' }}>
            Mostrando los primeros 100 de {filteredMovements.length} movimientos. Use los filtros
            para refinar la búsqueda.
          </div>
        )}
      </div>
    </div>
  );
};

export default MovementReports;
