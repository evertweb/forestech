/**
 * VehiclesFilters - Componente de filtros y búsqueda para vehículos
 * Proporciona filtros avanzados y opciones de vista
 */

import React, { useState } from 'react';
import { VEHICLE_STATUS, FUEL_COMPATIBILITY } from '../../services/vehiclesService';

const VehiclesFilters = ({
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

  // Ubicaciones comunes
  const commonLocations = [
    'Oficina Principal',
    'Bodega Norte',
    'Bodega Sur',
    'Campo Operativo',
    'Taller Mecánico',
    'Proyecto A',
    'Proyecto B',
    'En Reparación',
    'Otros'
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
    <div className="vehicles-filters">
      {/* Barra de búsqueda y controles principales */}
      <div className="filters-main">
        <div className="search-section">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar por ID, nombre, marca, modelo, ubicación..."
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
              className={`quick-filter ${filters.status === 'activo' ? 'active' : ''}`}
              onClick={() => handleQuickFilter({ status: 'activo' })}
            >
              ✅ Activos
            </button>
            <button
              className={`quick-filter ${filters.status === 'mantenimiento' ? 'active' : ''}`}
              onClick={() => handleQuickFilter({ status: 'mantenimiento' })}
            >
              🔧 Mantenimiento
            </button>
            <button
              className={`quick-filter ${filters.type === 'excavadora' ? 'active' : ''}`}
              onClick={() => handleQuickFilter({ type: 'excavadora' })}
            >
              🚚 Excavadoras
            </button>
            <button
              className={`quick-filter ${filters.type === 'tractor' ? 'active' : ''}`}
              onClick={() => handleQuickFilter({ type: 'tractor' })}
            >
              🚜 Tractores
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
            {/* Tipo de vehículo */}
            <div className="filter-group">
              <label>Tipo de Vehículo</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="filter-select"
              >
                <option value="">Todos los tipos</option>
                <option value="excavadora">🚚 Excavadora</option>
                <option value="bulldozer">🚜 Bulldozer</option>
                <option value="cargador">🏗️ Cargador</option>
                <option value="camion">🚛 Camión</option>
                <option value="grua">🏗️ Grúa</option>
                <option value="motosierra">🪚 Motosierra</option>
                <option value="tractor">🚜 Tractor</option>
                <option value="volqueta">🚛 Volqueta</option>
                <option value="otros">🚗 Otros</option>
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
                <option value={VEHICLE_STATUS.ACTIVO}>✅ Activo</option>
                <option value={VEHICLE_STATUS.MANTENIMIENTO}>🔧 Mantenimiento</option>
                <option value={VEHICLE_STATUS.INACTIVO}>⏸️ Inactivo</option>
                <option value={VEHICLE_STATUS.REPARACION}>🔴 Reparación</option>
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
                <option value={FUEL_COMPATIBILITY.DIESEL}>🚛 Diesel</option>
                <option value={FUEL_COMPATIBILITY.GASOLINA}>🚗 Gasolina</option>
                <option value={FUEL_COMPATIBILITY.MIXTO}>⛽ Mixto</option>
              </select>
            </div>

            {/* Ubicación */}
            <div className="filter-group">
              <label>Ubicación Actual</label>
              <select
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="filter-select"
              >
                <option value="">Todas las ubicaciones</option>
                {commonLocations.map(location => (
                  <option key={location} value={location}>
                    📍 {location}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro de mantenimiento */}
            <div className="filter-group">
              <label>Mantenimiento</label>
              <select
                value={filters.maintenance}
                onChange={(e) => handleFilterChange('maintenance', e.target.value)}
                className="filter-select"
              >
                <option value="all">Todos</option>
                <option value="due">Mantenimiento debido</option>
                <option value="overdue">Mantenimiento vencido</option>
                <option value="recent">Mantenimiento reciente</option>
              </select>
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

      {/* Resumen de filtros activos */}
      {activeFiltersCount > 0 && (
        <div className="active-filters-summary">
          <div className="summary-content">
            <span className="summary-label">Filtros activos:</span>
            <div className="summary-tags">
              {filters.type && (
                <span className="summary-tag" onClick={() => handleFilterChange('type', '')}>
                  Tipo: {filters.type} ✕
                </span>
              )}
              {filters.status && (
                <span className="summary-tag" onClick={() => handleFilterChange('status', '')}>
                  Estado: {filters.status} ✕
                </span>
              )}
              {filters.fuelType && (
                <span className="summary-tag" onClick={() => handleFilterChange('fuelType', '')}>
                  Combustible: {filters.fuelType} ✕
                </span>
              )}
              {filters.location && (
                <span className="summary-tag" onClick={() => handleFilterChange('location', '')}>
                  Ubicación: {filters.location} ✕
                </span>
              )}
              {filters.maintenance !== 'all' && (
                <span className="summary-tag" onClick={() => handleFilterChange('maintenance', 'all')}>
                  Mantenimiento: {filters.maintenance} ✕
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Atajos de teclado (opcional) */}
      <div className="keyboard-shortcuts" style={{ display: 'none' }}>
        <small>
          💡 Atajos: Ctrl+F (buscar), Ctrl+1 (activos), Ctrl+2 (mantenimiento), Ctrl+T (tractores)
        </small>
      </div>
    </div>
  );
};

export default VehiclesFilters;