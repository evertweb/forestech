/**
 * MaintenanceFilters - Componente de filtros para mantenimientos
 * Permite filtrar por tipo, estado, vehículo y fechas
 */

import React from 'react';
import { MAINTENANCE_TYPES, MAINTENANCE_STATUS } from '../../services/maintenanceService';

const MaintenanceFilters = ({
  filters,
  onFilterChange,
  onClearFilters,
  searchTerm,
  onSearchChange,
  viewMode,
  onViewModeChange,
  totalResults
}) => {
  const getMaintenanceTypeName = (type) => {
    switch (type) {
      case MAINTENANCE_TYPES.OIL_CHANGE:
        return 'Cambio de Aceite';
      case MAINTENANCE_TYPES.BATTERY_CHANGE:
        return 'Cambio de Batería';
      case MAINTENANCE_TYPES.FILTER_CHANGE:
        return 'Cambio de Filtros';
      case MAINTENANCE_TYPES.GENERAL_MAINTENANCE:
        return 'Mantenimiento General';
      default:
        return type;
    }
  };

  const getStatusName = (status) => {
    switch (status) {
      case MAINTENANCE_STATUS.COMPLETED:
        return 'Completado';
      case MAINTENANCE_STATUS.PENDING:
        return 'Pendiente';
      case MAINTENANCE_STATUS.CANCELLED:
        return 'Cancelado';
      default:
        return status;
    }
  };

  const handleFilterChange = (field, value) => {
    onFilterChange({ [field]: value });
  };

  const handleQuickFilter = (filterSet) => {
    onFilterChange(filterSet);
  };

  const hasActiveFilters = () => {
    return Object.values(filters).some(value => value !== '') || searchTerm;
  };

  return (
    <div className="maintenance-filters">
      <div className="filters-main">
        {/* Búsqueda */}
        <div className="search-section">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Buscar mantenimientos..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchTerm && (
              <button
                className="search-clear"
                onClick={() => onSearchChange('')}
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Controles de filtros */}
        <div className="filters-controls">
          {/* Filtros rápidos */}
          <div className="quick-filters">
            <button
              className={`quick-filter ${!hasActiveFilters() ? 'active' : ''}`}
              onClick={() => onClearFilters()}
            >
              Todos
            </button>
            <button
              className={`quick-filter ${filters.type === MAINTENANCE_TYPES.OIL_CHANGE ? 'active' : ''}`}
              onClick={() => handleQuickFilter({ type: MAINTENANCE_TYPES.OIL_CHANGE })}
            >
              🛢️ Aceite
            </button>
            <button
              className={`quick-filter ${filters.type === MAINTENANCE_TYPES.BATTERY_CHANGE ? 'active' : ''}`}
              onClick={() => handleQuickFilter({ type: MAINTENANCE_TYPES.BATTERY_CHANGE })}
            >
              🔋 Baterías
            </button>
            <button
              className={`quick-filter ${filters.status === MAINTENANCE_STATUS.PENDING ? 'active' : ''}`}
              onClick={() => handleQuickFilter({ status: MAINTENANCE_STATUS.PENDING })}
            >
              ⏰ Pendientes
            </button>
          </div>

          {/* Botón filtros avanzados */}
          <button
            className={`btn-advanced-filters ${hasActiveFilters() ? 'active' : ''}`}
            onClick={() => document.querySelector('.filters-advanced').classList.toggle('show')}
          >
            🔧 Filtros Avanzados
            {hasActiveFilters() && (
              <span className="filters-count">
                {Object.values(filters).filter(v => v !== '').length}
              </span>
            )}
          </button>

          {/* Modo de vista */}
          <div className="view-modes">
            <button
              className={`view-mode ${viewMode === 'cards' ? 'active' : ''}`}
              onClick={() => onViewModeChange('cards')}
            >
              📋 Cards
            </button>
            <button
              className={`view-mode ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => onViewModeChange('table')}
            >
              📊 Tabla
            </button>
          </div>
        </div>

        {/* Filtros avanzados */}
        <div className="filters-advanced">
          <div className="filters-grid">
            {/* Tipo de mantenimiento */}
            <div className="filter-group">
              <label>Tipo de Mantenimiento</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <option value="">Todos los tipos</option>
                <option value={MAINTENANCE_TYPES.OIL_CHANGE}>
                  {getMaintenanceTypeName(MAINTENANCE_TYPES.OIL_CHANGE)}
                </option>
                <option value={MAINTENANCE_TYPES.BATTERY_CHANGE}>
                  {getMaintenanceTypeName(MAINTENANCE_TYPES.BATTERY_CHANGE)}
                </option>
                <option value={MAINTENANCE_TYPES.FILTER_CHANGE}>
                  {getMaintenanceTypeName(MAINTENANCE_TYPES.FILTER_CHANGE)}
                </option>
                <option value={MAINTENANCE_TYPES.GENERAL_MAINTENANCE}>
                  {getMaintenanceTypeName(MAINTENANCE_TYPES.GENERAL_MAINTENANCE)}
                </option>
              </select>
            </div>

            {/* Estado */}
            <div className="filter-group">
              <label>Estado</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">Todos los estados</option>
                <option value={MAINTENANCE_STATUS.COMPLETED}>
                  {getStatusName(MAINTENANCE_STATUS.COMPLETED)}
                </option>
                <option value={MAINTENANCE_STATUS.PENDING}>
                  {getStatusName(MAINTENANCE_STATUS.PENDING)}
                </option>
                <option value={MAINTENANCE_STATUS.CANCELLED}>
                  {getStatusName(MAINTENANCE_STATUS.CANCELLED)}
                </option>
              </select>
            </div>

            {/* Fecha desde */}
            <div className="filter-group">
              <label>Fecha Desde</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              />
            </div>

            {/* Fecha hasta */}
            <div className="filter-group">
              <label>Fecha Hasta</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              />
            </div>
          </div>

          {/* Acciones de filtros */}
          <div className="filters-actions">
            <button
              className="btn-clear-filters"
              onClick={onClearFilters}
              disabled={!hasActiveFilters()}
            >
              🗑️ Limpiar Filtros
            </button>
          </div>
        </div>

        {/* Información de resultados */}
        <div className="filters-info">
          <div className="results-count">
            {totalResults} mantenimiento{totalResults !== 1 ? 's' : ''} encontrado{totalResults !== 1 ? 's' : ''}
          </div>
          
          {hasActiveFilters() && (
            <div className="active-filters">
              <span className="filters-label">Filtros activos:</span>
              <div className="filter-tags">
                {filters.type && (
                  <span className="filter-tag">
                    Tipo: {getMaintenanceTypeName(filters.type)}
                    <button onClick={() => handleFilterChange('type', '')}>×</button>
                  </span>
                )}
                {filters.status && (
                  <span className="filter-tag">
                    Estado: {getStatusName(filters.status)}
                    <button onClick={() => handleFilterChange('status', '')}>×</button>
                  </span>
                )}
                {filters.dateFrom && (
                  <span className="filter-tag">
                    Desde: {filters.dateFrom}
                    <button onClick={() => handleFilterChange('dateFrom', '')}>×</button>
                  </span>
                )}
                {filters.dateTo && (
                  <span className="filter-tag">
                    Hasta: {filters.dateTo}
                    <button onClick={() => handleFilterChange('dateTo', '')}>×</button>
                  </span>
                )}
                {searchTerm && (
                  <span className="filter-tag">
                    Búsqueda: "{searchTerm}"
                    <button onClick={() => onSearchChange('')}>×</button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaintenanceFilters;
