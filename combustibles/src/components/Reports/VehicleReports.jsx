/**
 * VehicleReports.jsx - Reportes específicos de vehículos
 * Análisis de consumo, eficiencia, horómetros y rendimiento operacional
 */

import React, { useMemo, useState } from 'react';
import {
  calculateVehicleConsumption,
  calculateFuelEfficiency,
  calculateOperationalCosts,
  calculateVehiclesStats,
  formatCurrency,
  formatNumber,
} from '../../utils/calculations';
import { VEHICLE_INFO } from '../../constants/vehicleTypes';

const VehicleReports = ({ vehicles, movements, dateRange }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFuelType, setSelectedFuelType] = useState('all');
  const [sortBy, setSortBy] = useState('efficiency');

  // Filtrar vehículos
  const filteredVehicles = useMemo(() => {
    let filtered = vehicles.filter((vehicle) => vehicle.status === 'activo');

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((vehicle) => vehicle.category === selectedCategory);
    }

    if (selectedFuelType !== 'all') {
      // 🔧 Normalizar comparación de fuelType
      const normalizedSelectedType = selectedFuelType.toUpperCase();
      filtered = filtered.filter(
        (vehicle) => vehicle.fuelType?.toUpperCase() === normalizedSelectedType
      );
    }

    return filtered;
  }, [vehicles, selectedCategory, selectedFuelType]);

  // Filtrar movimientos por rango de fechas
  const filteredMovements = useMemo(() => {
    if (!dateRange.start && !dateRange.end) return movements;

    return movements.filter((movement) => {
      const movementDate = new Date(movement.createdAt || movement.date);
      const startDate = dateRange.start ? new Date(dateRange.start) : new Date(0);
      const endDate = dateRange.end ? new Date(dateRange.end) : new Date();

      return movementDate >= startDate && movementDate <= endDate;
    });
  }, [movements, dateRange]);

  // Obtener categorías y tipos de combustible únicos
  const categories = useMemo(() => {
    return [...new Set(vehicles.map((v) => v.category).filter(Boolean))];
  }, [vehicles]);

  const fuelTypes = useMemo(() => {
    return [...new Set(vehicles.map((v) => v.fuelType).filter(Boolean))];
  }, [vehicles]);

  // Calcular estadísticas generales
  const vehiclesStats = useMemo(
    () => calculateVehiclesStats(filteredVehicles, filteredMovements),
    [filteredVehicles, filteredMovements]
  );

  // Análisis detallado por vehículo
  const vehicleAnalysis = useMemo(() => {
    const analysis = filteredVehicles.map((vehicle) => {
      const consumption = calculateVehicleConsumption(vehicle, filteredMovements);
      const efficiency = calculateFuelEfficiency(vehicle, filteredMovements);
      const costs = calculateOperationalCosts(vehicle, filteredMovements);
      const vehicleInfo = VEHICLE_INFO[vehicle.type] || {};

      // Análisis de horómetro para vehículos diesel
      const hasHourMeter = vehicle.fuelType === 'DIESEL';
      const currentHours = parseFloat(vehicle.currentHours) || 0;
      const totalHoursWorked = parseFloat(vehicle.totalHoursWorked) || 0;

      // Calcular consumo por hora real vs estimado
      const actualConsumptionPerHour =
        totalHoursWorked > 0 ? consumption.totalConsumption / totalHoursWorked : 0;
      const estimatedConsumption = vehicleInfo.avgConsumption || 0;
      const efficiencyRating =
        estimatedConsumption > 0 && actualConsumptionPerHour > 0
          ? ((estimatedConsumption - actualConsumptionPerHour) / estimatedConsumption) * 100
          : 0;

      return {
        ...vehicle,
        vehicleInfo,
        consumption,
        efficiency,
        costs,
        hasHourMeter,
        currentHours,
        totalHoursWorked,
        actualConsumptionPerHour,
        estimatedConsumption,
        efficiencyRating,
        // Proyección próximo mantenimiento (cada 250 horas para diesel)
        nextMaintenanceHours: hasHourMeter ? Math.ceil(currentHours / 250) * 250 : null,
        hoursToMaintenance: hasHourMeter
          ? Math.ceil(currentHours / 250) * 250 - currentHours
          : null,
      };
    });

    // Ordenar según criterio
    return analysis.sort((a, b) => {
      switch (sortBy) {
        case 'efficiency':
          return b.efficiencyRating - a.efficiencyRating;
        case 'consumption':
          return b.consumption.totalConsumption - a.consumption.totalConsumption;
        case 'cost':
          return b.costs.totalCost - a.costs.totalCost;
        case 'hours':
          return b.currentHours - a.currentHours;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }, [filteredVehicles, filteredMovements, sortBy]);

  // Top performers y alertas
  const topPerformers = useMemo(() => {
    const sorted = [...vehicleAnalysis].sort((a, b) => b.efficiencyRating - a.efficiencyRating);
    return {
      mostEfficient: sorted[0],
      leastEfficient: sorted[sorted.length - 1],
      highestConsumption: [...vehicleAnalysis].sort(
        (a, b) => b.consumption.totalConsumption - a.consumption.totalConsumption
      )[0],
      nearMaintenance: vehicleAnalysis.filter((v) => v.hasHourMeter && v.hoursToMaintenance <= 50),
    };
  }, [vehicleAnalysis]);

  // Análisis por tipo de combustible
  const fuelAnalysis = useMemo(() => {
    const analysis = {};
    fuelTypes.forEach((fuelType) => {
      // 🔧 Normalizar comparación de fuelType
      const normalizedFuelType = fuelType.toUpperCase();
      const vehiclesOfType = vehicleAnalysis.filter(
        (v) => v.fuelType?.toUpperCase() === normalizedFuelType
      );
      const totalConsumption = vehiclesOfType.reduce(
        (sum, v) => sum + v.consumption.totalConsumption,
        0
      );
      const totalCost = vehiclesOfType.reduce((sum, v) => sum + v.costs.totalCost, 0);
      const avgEfficiency =
        vehiclesOfType.length > 0
          ? vehiclesOfType.reduce((sum, v) => sum + v.efficiencyRating, 0) / vehiclesOfType.length
          : 0;

      analysis[fuelType] = {
        vehicleCount: vehiclesOfType.length,
        totalConsumption,
        totalCost,
        avgEfficiency,
        avgConsumptionPerVehicle:
          vehiclesOfType.length > 0 ? totalConsumption / vehiclesOfType.length : 0,
      };
    });
    return analysis;
  }, [vehicleAnalysis, fuelTypes]);

  // Función para exportar
  const exportToCSV = () => {
    const headers = [
      'Vehículo',
      'Tipo',
      'Combustible',
      'Horas Actuales',
      'Consumo Total (L)',
      'Consumo/Hora',
      'Eficiencia (%)',
      'Costo Total',
      'Próximo Mantenimiento',
    ];

    const csvData = vehicleAnalysis.map((vehicle) => [
      vehicle.vehicleId,
      vehicle.type,
      vehicle.fuelType,
      vehicle.hasHourMeter ? formatNumber(vehicle.currentHours) : 'N/A',
      formatNumber(vehicle.consumption.totalConsumption),
      formatNumber(vehicle.actualConsumptionPerHour, 2),
      formatNumber(vehicle.efficiencyRating, 1) + '%',
      formatCurrency(vehicle.costs.totalCost),
      vehicle.hasHourMeter ? `${vehicle.nextMaintenanceHours}h` : 'N/A',
    ]);

    const csvContent = [headers, ...csvData].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vehiculos_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="apple-card">
      {/* KPIs de vehículos */}
      <div className="apple-stats-grid">
        <div className="apple-card">
          <div className="apple-stat-card-icon">🚜</div>
          <div className="apple-form-input">{vehiclesStats.activeVehicles}</div>
          <div className="apple-form-label">Vehículos Activos</div>
          <div className="apple-status-badge">
            <span className="apple-status-badge">📊</span>
            {formatNumber(vehiclesStats.totalHours)} horas total
          </div>
        </div>

        <div className="apple-card">
          <div className="apple-stat-card-icon">⛽</div>
          <div className="apple-form-input">{formatNumber(vehiclesStats.totalConsumption)}</div>
          <div className="apple-form-label">Consumo Total (L)</div>
          <div className="apple-status-badge">
            <span className="apple-status-badge">📈</span>
            {formatNumber(vehiclesStats.averageEfficiency, 1)} L/h promedio
          </div>
        </div>

        <div className="apple-card">
          <div className="apple-stat-card-icon">⚡</div>
          <div className="apple-form-input">
            {formatNumber(topPerformers.mostEfficient?.efficiencyRating || 0, 1)}%
          </div>
          <div className="apple-form-label">Mejor Eficiencia</div>
          <div className="apple-status-badge">
            <span className="apple-status-badge">🏆</span>
            {topPerformers.mostEfficient?.vehicleId || 'N/A'}
          </div>
        </div>

        <div className="apple-card">
          <div className="apple-stat-card-icon">🔧</div>
          <div className="apple-form-input">{topPerformers.nearMaintenance.length}</div>
          <div className="apple-form-label">Próximo Mantenimiento</div>
          <div
            className={`apple-status-badge ${topPerformers.nearMaintenance.length > 0 ? 'negative' : 'positive'}`}
          >
            <span className="apple-status-badge">⚠️</span>≤ 50 horas
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="apple-card">
        <div className="apple-card">
          <div className="apple-form-group">
            <label className="apple-form-label">Categoría</label>
            <select
              className="apple-form-input"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">Todas las categorías</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
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
              {fuelTypes.map((fuelType) => (
                <option key={fuelType} value={fuelType}>
                  {fuelType}
                </option>
              ))}
            </select>
          </div>
          <div className="apple-form-group">
            <label className="apple-form-label">Ordenar por</label>
            <select
              className="apple-form-input"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="efficiency">Eficiencia</option>
              <option value="consumption">Consumo</option>
              <option value="cost">Costo</option>
              <option value="hours">Horas</option>
              <option value="name">Nombre</option>
            </select>
          </div>
          <div className="apple-action-buttons">
            <button className="apple-button apple-button-secondary" onClick={exportToCSV}>
              📊 Exportar CSV
            </button>
          </div>
        </div>
      </div>

      {/* Alertas de mantenimiento */}
      {topPerformers.nearMaintenance.length > 0 && (
        <div className="apple-card">
          {topPerformers.nearMaintenance.map((vehicle, index) => (
            <div key={index} className="apple-card">
              <span className="apple-stat-card-icon">🔧</span>
              <div className="apple-card">
                <div className="apple-form-label">
                  Mantenimiento Próximo: {vehicle.vehicleId}
                </div>
                <div className="apple-form-input">
                  Horas actuales: {formatNumber(vehicle.currentHours)}h | Próximo mantenimiento:{' '}
                  {vehicle.nextMaintenanceHours}h | Faltan:{' '}
                  {formatNumber(vehicle.hoursToMaintenance)}h
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Análisis por tipo de combustible */}
      <div className="apple-card">
        <div className="apple-card">
          <h3 className="apple-form-label">⛽ Análisis por Tipo de Combustible</h3>
        </div>
        <div className="apple-card">
          <div className="apple-stats-grid">
            {Object.entries(fuelAnalysis).map(([fuelType, analysis]) => (
              <div key={fuelType} className="apple-card">
                <h4>{fuelType.toUpperCase()}</h4>
                <div className="apple-card">
                  <div className="apple-card">
                    <span className="apple-form-label">Vehículos:</span>
                    <span className="apple-form-input">{analysis.vehicleCount}</span>
                  </div>
                  <div className="apple-card">
                    <span className="apple-form-label">Consumo Total:</span>
                    <span className="apple-form-input">
                      {formatNumber(analysis.totalConsumption)} L
                    </span>
                  </div>
                  <div className="apple-card">
                    <span className="apple-form-label">Costo Total:</span>
                    <span className="apple-form-input">
                      {formatCurrency(analysis.totalCost)}
                    </span>
                  </div>
                  <div className="apple-card">
                    <span className="apple-form-label">Eficiencia Promedio:</span>
                    <span
                      className={`apple-status-badge ${analysis.avgEfficiency > 10 ? 'success' : analysis.avgEfficiency > 0 ? 'warning' : 'danger'}`}
                    >
                      {formatNumber(analysis.avgEfficiency, 1)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top performers */}
      <div className="apple-card">
        <div className="apple-card">
          <h3 className="apple-form-label">🏆 Análisis de Rendimiento</h3>
        </div>
        <div className="apple-card">
          <div className="apple-stats-grid">
            <div className="apple-card">
              <h4>🥇 Más Eficiente</h4>
              <div className="apple-form-input">
                {topPerformers.mostEfficient?.vehicleId || 'N/A'}
              </div>
              <div className="apple-form-label">
                {formatNumber(topPerformers.mostEfficient?.efficiencyRating || 0, 1)}% eficiencia
              </div>
              <div className="apple-form-input">
                {formatNumber(topPerformers.mostEfficient?.actualConsumptionPerHour || 0, 2)} L/h
              </div>
            </div>

            <div className="apple-card">
              <h4>⚠️ Mayor Consumo</h4>
              <div className="apple-form-input">
                {topPerformers.highestConsumption?.vehicleId || 'N/A'}
              </div>
              <div className="apple-form-label">
                {formatNumber(topPerformers.highestConsumption?.consumption.totalConsumption || 0)}{' '}
                L total
              </div>
              <div className="apple-form-input">
                {formatNumber(topPerformers.highestConsumption?.actualConsumptionPerHour || 0, 2)}{' '}
                L/h
              </div>
            </div>

            <div className="apple-card">
              <h4>📉 Menos Eficiente</h4>
              <div className="apple-form-input">
                {topPerformers.leastEfficient?.vehicleId || 'N/A'}
              </div>
              <div className="apple-form-label">
                {formatNumber(topPerformers.leastEfficient?.efficiencyRating || 0, 1)}% eficiencia
              </div>
              <div className="apple-form-input">
                {formatNumber(topPerformers.leastEfficient?.actualConsumptionPerHour || 0, 2)} L/h
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla detallada */}
      <div className="apple-card">
        <div className="apple-card">
          <h3 className="apple-form-label">🚜 Análisis Detallado de Vehículos</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="apple-table">
            <thead>
              <tr>
                <th>Vehículo</th>
                <th>Tipo</th>
                <th>Combustible</th>
                <th>Horas Actuales</th>
                <th>Horas Trabajadas</th>
                <th>Consumo Total</th>
                <th>L/Hora Real</th>
                <th>L/Hora Estimado</th>
                <th>Eficiencia</th>
                <th>Costo Total</th>
                <th>Próximo Mantenimiento</th>
              </tr>
            </thead>
            <tbody>
              {vehicleAnalysis.map((vehicle, index) => (
                <tr key={index}>
                  <td>
                    <strong>{vehicle.vehicleId}</strong>
                    <br />
                    <small>{vehicle.name}</small>
                  </td>
                  <td>{vehicle.type}</td>
                  <td>
                    <span
                      className={`apple-status-badge ${vehicle.fuelType === 'DIESEL' ? 'info' : 'secondary'}`}
                    >
                      {vehicle.fuelType}
                    </span>
                  </td>
                  <td>
                    {vehicle.hasHourMeter ? (
                      <span>{formatNumber(vehicle.currentHours)}h</span>
                    ) : (
                      <span className="apple-form-input">N/A</span>
                    )}
                  </td>
                  <td>{formatNumber(vehicle.totalHoursWorked)}h</td>
                  <td>{formatNumber(vehicle.consumption.totalConsumption)} L</td>
                  <td>{formatNumber(vehicle.actualConsumptionPerHour, 2)}</td>
                  <td>{formatNumber(vehicle.estimatedConsumption, 2)}</td>
                  <td>
                    <span
                      className={`apple-status-badge ${vehicle.efficiencyRating > 10 ? 'success' : vehicle.efficiencyRating > 0 ? 'warning' : 'danger'}`}
                    >
                      {formatNumber(vehicle.efficiencyRating, 1)}%
                    </span>
                  </td>
                  <td>{formatCurrency(vehicle.costs.totalCost)}</td>
                  <td>
                    {vehicle.hasHourMeter ? (
                      <span
                        className={
                          vehicle.hoursToMaintenance <= 50 ? 'apple-status-badge' : 'apple-form-input'
                        }
                      >
                        {vehicle.nextMaintenanceHours}h
                        <br />
                        <small>({formatNumber(vehicle.hoursToMaintenance)}h restantes)</small>
                      </span>
                    ) : (
                      <span className="apple-form-input">N/A</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VehicleReports;
