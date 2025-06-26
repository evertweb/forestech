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
  viewMode,
  onViewModeChange,
  totalResults
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Tipos de combustible disponibles
  const fuelTypes = [
    { value: 'Diesel', label: 'Diesel 🚛' },
    { value: 'Gasolina', label: 'Gasolina 🚗' },
    { value: 'ACPM', label: 'ACPM 🚚' },
    { value: 'Lubricante', label: 'Lubricante 🛢️' }
  ];

  // Rangos de fecha
  const dateRanges = [
    { value: 'all', label: 'Todos los períodos' },
    { value: 'today', label: 'Hoy' },
    { value: 'week', label: 'Esta semana' },
    { value: 'month', label: 'Este mes' },
    { value: 'quarter', label: 'Este trimestre' },
    { value: 'year', label: 'Este año' }
  ];

  // Contar filtros activos
  const activeFiltersCount = Object.values(filters).filter(value => 
    value && value !== '' && value !== 'all'
  ).length;

  const handleFilterChange = (field, value) => {
    onFilterChange({ [field]: value });
  };

  const handleQuickFilter = (filterSet) => {
    onFilterChange(filterSet);
  };

  return (
    <div className="movements-filters">
      {/* Barra de búsqueda y controles principales */}
      <div className="filters-main">
        <div className="search-section">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar por combustible, vehículo, referencia..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button 
                className="search-clear"
                onClick={() => onSearchChange('')}
                title="Limpiar búsqueda"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="filters-controls">
          {/* Filtros rápidos */}
          <div className="quick-filters">
            <button
              className={`quick-filter ${filters.type === MOVEMENT_TYPES.ENTRADA ? 'active' : ''}`}
              onClick={() => handleQuickFilter({ type: MOVEMENT_TYPES.ENTRADA })}
            >
              📥 Entradas
            </button>
            <button
              className={`quick-filter ${filters.type === MOVEMENT_TYPES.SALIDA ? 'active' : ''}`}
              onClick={() => handleQuickFilter({ type: MOVEMENT_TYPES.SALIDA })}
            >
              📤 Salidas
            </button>
            <button
              className={`quick-filter ${filters.status === MOVEMENT_STATUS.PENDIENTE ? 'active' : ''}`}
              onClick={() => handleQuickFilter({ status: MOVEMENT_STATUS.PENDIENTE })}
            >
              ⏳ Pendientes
            </button>
          </div>

          {/* Toggle filtros avanzados */}
          <button
            className={`btn-advanced-filters ${showAdvancedFilters ? 'active' : ''}`}
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            🎛️ Filtros 
            {activeFiltersCount > 0 && (
              <span className="filters-count">{activeFiltersCount}</span>
            )}
          </button>

          {/* Modos de vista */}
          <div className="view-modes">
            <button
              className={`view-mode ${viewMode === 'cards' ? 'active' : ''}`}
              onClick={() => onViewModeChange('cards')}
              title="Vista en tarjetas"
            >
              🎴
            </button>
            <button
              className={`view-mode ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => onViewModeChange('table')}
              title="Vista en tabla"
            >
              📋
            </button>
          </div>
        </div>
      </div>

      {/* Filtros avanzados */}
      {showAdvancedFilters && (
        <div className="filters-advanced">
          <div className="filters-grid">
            {/* Tipo de movimiento */}
            <div className="filter-group">
              <label>Tipo de Movimiento</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="filter-select"
              >
                <option value="">Todos los tipos</option>
                <option value={MOVEMENT_TYPES.ENTRADA}>📥 Entrada</option>
                <option value={MOVEMENT_TYPES.SALIDA}>📤 Salida</option>
                <option value={MOVEMENT_TYPES.TRANSFERENCIA}>🔄 Transferencia</option>
                <option value={MOVEMENT_TYPES.AJUSTE}>⚖️ Ajuste</option>
              </select>
            </div>

            {/* Estado */}
            <div className="filter-group">
              <label>Estado</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="filter-select"
              >
                <option value="">Todos los estados</option>
                <option value={MOVEMENT_STATUS.PENDIENTE}>⏳ Pendiente</option>
                <option value={MOVEMENT_STATUS.COMPLETADO}>✅ Completado</option>
                <option value={MOVEMENT_STATUS.CANCELADO}>❌ Cancelado</option>
              </select>
            </div>

            {/* Tipo de combustible */}
            <div className="filter-group">
              <label>Tipo de Combustible</label>
              <select
                value={filters.fuelType}
                onChange={(e) => handleFilterChange('fuelType', e.target.value)}
                className="filter-select"
              >
                <option value="">Todos los combustibles</option>
                {fuelTypes.map(fuel => (
                  <option key={fuel.value} value={fuel.value}>
                    {fuel.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Rango de fechas */}
            <div className="filter-group">
              <label>Período</label>
              <select
                value={filters.dateRange}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                className="filter-select"
              >
                {dateRanges.map(range => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Vehículo */}
            <div className="filter-group">
              <label>Vehículo/Equipo</label>
              <input
                type="text"
                placeholder="ID del vehículo..."
                value={filters.vehicleId}
                onChange={(e) => handleFilterChange('vehicleId', e.target.value)}
                className="filter-input"
              />
            </div>
          </div>

          {/* Acciones de filtros */}
          <div className="filters-actions">
            <button
              className="btn-clear-filters"
              onClick={onClearFilters}
              disabled={activeFiltersCount === 0}
            >
              🗑️ Limpiar Filtros
            </button>
            <div className="filters-info">
              <span className="results-count">
                {totalResults} resultado{totalResults !== 1 ? 's' : ''}
              </span>
              {activeFiltersCount > 0 && (
                <span className="active-filters-text">
                  ({activeFiltersCount} filtro{activeFiltersCount !== 1 ? 's' : ''} activo{activeFiltersCount !== 1 ? 's' : ''})
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