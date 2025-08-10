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
import { MOVEMENT_TYPES } from '../../services/movementsService';
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
      filtered = filtered.filter((movement) => movement.fuelType === selectedFuelType);
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
      const fuelMovements = filteredMovements.filter((m) => m.fuelType === fuelType);
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
          transferencias: 0,
          ajustes: 0,
          totalQuantity: 0,
          totalValue: 0,
        };
      }

      const quantity = parseFloat(movement.quantity) || 0;
      const value = quantity * (parseFloat(movement.unitPrice) || 0);

      monthlyData[monthKey][movement.type]++;
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
    <div className="movement-reports sap-theme">
      {/* KPIs de movimientos */}
      <div className="kpis-grid sap-theme">
        <div className="kpi-card sap-theme">
          <div className="kpi-icon movements sap-theme">📈</div>
          <div className="kpi-value sap-theme">{movementsStats.totalMovements}</div>
          <div className="kpi-label sap-theme">Movimientos Totales</div>
          <div className="kpi-trend positive sap-theme">
            <span className="trend-icon sap-theme">✅</span>
            {movementsStats.completedMovements} completados
          </div>
        </div>

        <div className="kpi-card sap-theme">
          <div className="kpi-icon movements sap-theme">🛢️</div>
          <div className="kpi-value sap-theme">{formatNumber(movementsStats.totalQuantity)}</div>
          <div className="kpi-label sap-theme">Cantidad Total (L)</div>
          <div className="kpi-trend neutral sap-theme">
            <span className="trend-icon sap-theme">📊</span>
            Promedio:{' '}
            {formatNumber(movementsStats.totalQuantity / (movementsStats.totalMovements || 1), 1)} L
          </div>
        </div>

        <div className="kpi-card sap-theme">
          <div className="kpi-icon financial sap-theme">💰</div>
          <div className="kpi-value sap-theme">{formatCurrency(costsAnalysis.totalCost)}</div>
          <div className="kpi-label sap-theme">Valor Total</div>
          <div className="kpi-trend positive sap-theme">
            <span className="trend-icon sap-theme">💵</span>
            {formatCurrency(costsAnalysis.averageCostPerMovement)} promedio
          </div>
        </div>

        <div className="kpi-card sap-theme">
          <div className="kpi-icon movements sap-theme">⚠️</div>
          <div className="kpi-value sap-theme">{movementsStats.pendingMovements}</div>
          <div className="kpi-label sap-theme">Pendientes</div>
          <div
            className={`kpi-trend ${movementsStats.pendingMovements > 0 ? 'negative' : 'positive'}`}
          >
            <span className="trend-icon sap-theme">
              {movementsStats.pendingMovements > 0 ? '⏳' : '✅'}
            </span>
            {movementsStats.cancelledMovements} cancelados
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="reports-filters sap-theme">
        <div className="filters-grid sap-theme">
          <div className="filter-group sap-theme">
            <label className="filter-label sap-theme">Tipo de Movimiento</label>
            <select
              className="filter-select sap-theme"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">Todos los tipos</option>
              <option value={MOVEMENT_TYPES.ENTRADA}>Entradas</option>
              <option value={MOVEMENT_TYPES.SALIDA}>Salidas</option>
              <option value={MOVEMENT_TYPES.TRANSFERENCIA}>Transferencias</option>
              <option value={MOVEMENT_TYPES.AJUSTE}>Ajustes</option>
            </select>
          </div>
          <div className="filter-group sap-theme">
            <label className="filter-label sap-theme">Tipo de Combustible</label>
            <select
              className="filter-select sap-theme"
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
          <div className="filter-group sap-theme">
            <label className="filter-label sap-theme">Ubicación</label>
            <select
              className="filter-select sap-theme"
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
          <div className="filter-actions sap-theme">
            <button className="filter-btn secondary sap-theme" onClick={exportToCSV}>
              📊 Exportar CSV
            </button>
          </div>
        </div>
      </div>

      {/* Análisis por tipo de movimiento */}
      <div className="chart-container sap-theme">
        <div className="chart-header sap-theme">
          <h3 className="chart-title sap-theme">📊 Movimientos por Tipo</h3>
        </div>
        <div className="chart-content sap-theme">
          <div className="movement-types-grid sap-theme">
            {movementTypeAnalysis.map((typeData) => (
              <div key={typeData.type} className="movement-type-item sap-theme">
                <h4>
                  {typeData.type === MOVEMENT_TYPES.ENTRADA && '📥 Entradas'}
                  {typeData.type === MOVEMENT_TYPES.SALIDA && '📤 Salidas'}
                  {typeData.type === MOVEMENT_TYPES.TRANSFERENCIA && '🔄 Transferencias'}
                  {typeData.type === MOVEMENT_TYPES.AJUSTE && '⚙️ Ajustes'}
                </h4>
                <div className="type-metrics sap-theme">
                  <div className="metric sap-theme">
                    <span className="metric-value sap-theme">{typeData.count}</span>
                    <span className="metric-label sap-theme">Movimientos</span>
                  </div>
                  <div className="metric sap-theme">
                    <span className="metric-value sap-theme">
                      {formatNumber(typeData.totalQuantity)} L
                    </span>
                    <span className="metric-label sap-theme">Cantidad</span>
                  </div>
                  <div className="metric sap-theme">
                    <span className="metric-value sap-theme">
                      {formatCurrency(typeData.totalValue)}
                    </span>
                    <span className="metric-label sap-theme">Valor</span>
                  </div>
                  <div className="metric sap-theme">
                    <span className="metric-value sap-theme">
                      {formatNumber(typeData.percentage, 1)}%
                    </span>
                    <span className="metric-label sap-theme">Participación</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Análisis por combustible */}
      <div className="chart-container sap-theme">
        <div className="chart-header sap-theme">
          <h3 className="chart-title sap-theme">⛽ Análisis por Tipo de Combustible</h3>
        </div>
        <div className="chart-content sap-theme">
          <div className="fuel-analysis-grid sap-theme">
            {Object.entries(fuelTypeAnalysis).map(([fuelType, analysis]) => (
              <div key={fuelType} className="fuel-analysis-item sap-theme">
                <h4>
                  <span style={{ marginRight: '0.5rem' }}>{analysis.fuelInfo.icon || '⛽'}</span>
                  {analysis.fuelInfo.name || fuelType.toUpperCase()}
                </h4>
                <div className="analysis-metrics sap-theme">
                  <div className="metric sap-theme">
                    <span className="metric-label sap-theme">Movimientos:</span>
                    <span className="metric-value sap-theme">{analysis.count}</span>
                  </div>
                  <div className="metric sap-theme">
                    <span className="metric-label sap-theme">Cantidad:</span>
                    <span className="metric-value sap-theme">
                      {formatNumber(analysis.totalQuantity)} {analysis.fuelInfo.unit || 'L'}
                    </span>
                  </div>
                  <div className="metric sap-theme">
                    <span className="metric-label sap-theme">Valor:</span>
                    <span className="metric-value sap-theme">
                      {formatCurrency(analysis.totalValue)}
                    </span>
                  </div>
                  <div className="metric sap-theme">
                    <span className="metric-label sap-theme">Precio Promedio:</span>
                    <span className="metric-value sap-theme">
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
        <div className="chart-container sap-theme">
          <div className="chart-header sap-theme">
            <h3 className="chart-title sap-theme">🚜 Top Vehículos por Consumo</h3>
          </div>
          <div className="chart-content sap-theme">
            <div className="top-vehicles-list sap-theme">
              {topVehicles.slice(0, 5).map((vehicleData, index) => (
                <div key={vehicleData.vehicleId} className="top-vehicle-item sap-theme">
                  <div className="vehicle-rank sap-theme">#{index + 1}</div>
                  <div className="vehicle-info sap-theme">
                    <h4>{vehicleData.vehicleId}</h4>
                    <p>{vehicleData.vehicle?.name || 'Nombre no disponible'}</p>
                  </div>
                  <div className="vehicle-consumption sap-theme">
                    <span className="consumption-value sap-theme">
                      {formatNumber(vehicleData.totalConsumption)} L
                    </span>
                    <span className="consumption-movements sap-theme">
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
        <div className="chart-container sap-theme">
          <div className="chart-header sap-theme">
            <h3 className="chart-title sap-theme">📈 Tendencia Temporal</h3>
          </div>
          <div className="chart-content sap-theme">
            <div className="temporal-analysis sap-theme">
              {temporalAnalysis.map((monthData) => (
                <div key={monthData.month} className="month-data sap-theme">
                  <h4>{monthData.month}</h4>
                  <div className="month-metrics sap-theme">
                    <div className="metric small sap-theme">
                      <span className="metric-label sap-theme">📥 Entradas:</span>
                      <span className="metric-value sap-theme">{monthData.entradas}</span>
                    </div>
                    <div className="metric small sap-theme">
                      <span className="metric-label sap-theme">📤 Salidas:</span>
                      <span className="metric-value sap-theme">{monthData.salidas}</span>
                    </div>
                    <div className="metric small sap-theme">
                      <span className="metric-label sap-theme">🔄 Transferencias:</span>
                      <span className="metric-value sap-theme">{monthData.transferencias}</span>
                    </div>
                    <div className="metric small sap-theme">
                      <span className="metric-label sap-theme">💰 Valor:</span>
                      <span className="metric-value sap-theme">
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
      <div className="report-table-container sap-theme">
        <div className="report-table-header sap-theme">
          <h3 className="report-table-title sap-theme">📋 Movimientos Detallados</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="report-table sap-theme">
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
                      className={`badge ${
                        movement.type === MOVEMENT_TYPES.ENTRADA
                          ? 'success'
                          : movement.type === MOVEMENT_TYPES.SALIDA
                            ? 'warning'
                            : movement.type === MOVEMENT_TYPES.TRANSFERENCIA
                              ? 'info'
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
                      className={`badge ${
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
