/**
 * MovementsFilters - Componente de filtros y búsqueda para movimientos
 * Proporciona filtros avanzados y opciones de vista
 */

import React, { useState } from 'react';
import { MOVEMENT_TYPES, MOVEMENT_STATUS } from '../../services/movementsService';

const MovementsFilters = ({
  filters,
  onFilterChange,
  onClearFilters,
  searchTerm,
  onSearchChange,
  totalResults,
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Tipos de combustible disponibles
  const fuelTypes = [
    { value: 'DIESEL', label: 'DIESEL 🚛' },
    { value: 'GASOLINA', label: 'GASOLINA 🚗' },
    { value: 'LUBRICANTE', label: 'LUBRICANTE 🛢️' },
  ];

  // Rangos de fecha
  const dateRanges = [
    { value: 'all', label: 'Todos los períodos' },
    { value: 'today', label: 'Hoy' },
    { value: 'week', label: 'Esta semana' },
    { value: 'month', label: 'Este mes' },
    { value: 'quarter', label: 'Este trimestre' },
    { value: 'year', label: 'Este año' },
  ];

  // Contar filtros activos
  const activeFiltersCount = Object.values(filters).filter(
    (value) => value && value !== '' && value !== 'all'
  ).length;

  const handleFilterChange = (field, value) => {
    onFilterChange({ [field]: value });
  };

  const handleQuickFilter = (filterSet) => {
    onFilterChange(filterSet);
  };

  return (
    <div className="movements-filters sap-theme">
      {/* Barra de búsqueda y controles principales */}
      <div className="filters-main sap-theme">
        <div className="search-section sap-theme">
          <div className="search-box sap-theme">
            <span className="search-icon sap-theme">🔍</span>
            <input
              type="text"
              placeholder="Buscar por combustible, vehículo, referencia..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="search-input sap-theme"
            />
            {searchTerm && (
              <button
                className="search-clear sap-theme"
                onClick={() => onSearchChange('')}
                title="Limpiar búsqueda"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="filters-controls sap-theme">
          {/* Filtros rápidos */}
          <div className="quick-filters sap-theme">
            <button
              className={`quick-filter sap-theme ${filters.type === MOVEMENT_TYPES.ENTRADA ? 'active' : ''}`}
              onClick={() => handleQuickFilter({ type: MOVEMENT_TYPES.ENTRADA })}
            >
              📥 Entradas
            </button>
            <button
              className={`quick-filter sap-theme ${filters.type === MOVEMENT_TYPES.SALIDA ? 'active' : ''}`}
              onClick={() => handleQuickFilter({ type: MOVEMENT_TYPES.SALIDA })}
            >
              📤 Salidas
            </button>
            <button
              className={`quick-filter sap-theme ${filters.type === MOVEMENT_TYPES.MANTENIMIENTO ? 'active' : ''}`}
              onClick={() => handleQuickFilter({ type: MOVEMENT_TYPES.MANTENIMIENTO })}
            >
              🔧 Mantenimiento
            </button>
            <button
              className={`quick-filter sap-theme ${filters.status === MOVEMENT_STATUS.PENDIENTE ? 'active' : ''}`}
              onClick={() => handleQuickFilter({ status: MOVEMENT_STATUS.PENDIENTE })}
            >
              ⏳ Pendientes
            </button>
          </div>

          {/* Toggle filtros avanzados */}
          <button
            className={`btn-advanced-filters sap-theme ${showAdvancedFilters ? 'active' : ''}`}
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            🎛️ Filtros
            {activeFiltersCount > 0 && (
              <span className="filters-count sap-theme">{activeFiltersCount}</span>
            )}
          </button>

          {/* Vista única tabla - selector removido */}
          <div className="view-indicator sap-theme">
            <span className="view-info sap-theme">📋 Vista Tabla</span>
          </div>
        </div>
      </div>

      {/* Filtros avanzados */}
      {showAdvancedFilters && (
        <div className="filters-advanced sap-theme">
          <div className="filters-grid sap-theme">
            {/* Tipo de movimiento */}
            <div className="filter-group sap-theme">
              <label>Tipo de Movimiento</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="filter-select sap-theme"
              >
                <option value="">Todos los tipos</option>
                <option value={MOVEMENT_TYPES.ENTRADA}>📥 Entrada</option>
                <option value={MOVEMENT_TYPES.SALIDA}>📤 Salida</option>
                <option value={MOVEMENT_TYPES.TRANSFERENCIA}>🔄 Transferencia</option>
                <option value={MOVEMENT_TYPES.AJUSTE}>⚖️ Ajuste</option>
                <option value={MOVEMENT_TYPES.MANTENIMIENTO}>🔧 Mantenimiento</option>
              </select>
            </div>

            {/* Estado */}
            <div className="filter-group sap-theme">
              <label>Estado</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="filter-select sap-theme"
              >
                <option value="">Todos los estados</option>
                <option value={MOVEMENT_STATUS.PENDIENTE}>⏳ Pendiente</option>
                <option value={MOVEMENT_STATUS.COMPLETADO}>✅ Completado</option>
                <option value={MOVEMENT_STATUS.CANCELADO}>❌ Cancelado</option>
              </select>
            </div>

            {/* Tipo de combustible */}
            <div className="filter-group sap-theme">
              <label>Tipo de Combustible</label>
              <select
                value={filters.fuelType}
                onChange={(e) => handleFilterChange('fuelType', e.target.value)}
                className="filter-select sap-theme"
              >
                <option value="">Todos los combustibles</option>
                {fuelTypes.map((fuel) => (
                  <option key={fuel.value} value={fuel.value}>
                    {fuel.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Rango de fechas */}
            <div className="filter-group sap-theme">
              <label>Período</label>
              <select
                value={filters.dateRange}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                className="filter-select sap-theme"
              >
                {dateRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Vehículo */}
            <div className="filter-group sap-theme">
              <label>Vehículo/Equipo</label>
              <input
                type="text"
                placeholder="ID del vehículo..."
                value={filters.vehicleId}
                onChange={(e) => handleFilterChange('vehicleId', e.target.value)}
                className="filter-input sap-theme"
              />
            </div>
          </div>

          {/* Acciones de filtros */}
          <div className="filters-actions sap-theme">
            <button
              className="btn-clear-filters sap-theme"
              onClick={onClearFilters}
              disabled={activeFiltersCount === 0}
            >
              🗑️ Limpiar Filtros
            </button>
            <div className="filters-info sap-theme">
              <span className="results-count sap-theme">
                {totalResults} resultado{totalResults !== 1 ? 's' : ''}
              </span>
              {activeFiltersCount > 0 && (
                <span className="active-filters-text sap-theme">
                  ({activeFiltersCount} filtro{activeFiltersCount !== 1 ? 's' : ''} activo
                  {activeFiltersCount !== 1 ? 's' : ''})
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Atajos de teclado (opcional) */}
      <div className="keyboard-shortcuts" style={{ display: 'none' }}>
        <small>
          💡 Atajos: Ctrl+F (buscar), Ctrl+1 (entradas), Ctrl+2 (salidas), Ctrl+3 (pendientes)
        </small>
      </div>
    </div>
  );
};

export default MovementsFilters;
