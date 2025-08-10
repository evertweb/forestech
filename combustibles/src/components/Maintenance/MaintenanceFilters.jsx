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
  totalResults,
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
    return Object.values(filters).some((value) => value !== '') || searchTerm;
  };

  return (
    <div className="maintenance-filters sap-theme">
      <div className="filters-main">
        {/* Búsqueda */}
        <div className="search-section">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input sap-theme"
              placeholder="Buscar mantenimientos..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchTerm && (
              <button className="search-clear sap-theme" onClick={() => onSearchChange('')}>
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
              className={`quick-filter sap-theme ${!hasActiveFilters() ? 'active' : ''}`}
              onClick={() => onClearFilters()}
            >
              Todos
            </button>
            <button
              className={`quick-filter sap-theme ${filters.type === MAINTENANCE_TYPES.OIL_CHANGE ? 'active' : ''}`}
              onClick={() => handleQuickFilter({ type: MAINTENANCE_TYPES.OIL_CHANGE })}
            >
              🛢️ Aceite
            </button>
            <button
              className={`quick-filter sap-theme ${filters.type === MAINTENANCE_TYPES.BATTERY_CHANGE ? 'active' : ''}`}
              onClick={() => handleQuickFilter({ type: MAINTENANCE_TYPES.BATTERY_CHANGE })}
            >
              🔋 Baterías
            </button>
            <button
              className={`quick-filter sap-theme ${filters.status === MAINTENANCE_STATUS.PENDING ? 'active' : ''}`}
              onClick={() => handleQuickFilter({ status: MAINTENANCE_STATUS.PENDING })}
            >
              ⏰ Pendientes
            </button>
          </div>

          {/* Botón filtros avanzados */}
          <button
            className={`btn-advanced-filters sap-theme ${hasActiveFilters() ? 'active' : ''}`}
            onClick={() => {
              const advancedFilters = document.querySelector('.filters-advanced');
              advancedFilters.classList.toggle('active');
            }}
          >
            🔧 Filtros Avanzados
            {hasActiveFilters() && (
              <span className="filters-count">
                {Object.values(filters).filter((v) => v !== '').length}
              </span>
            )}
          </button>

          {/* Modo de vista */}
          <div className="view-modes">
            <button
              className={`view-mode sap-theme ${viewMode === 'cards' ? 'active' : ''}`}
              onClick={() => onViewModeChange('cards')}
            >
              📋 Cards
            </button>
            <button
              className={`view-mode sap-theme ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => onViewModeChange('table')}
            >
              📊 Tabla
            </button>
          </div>
        </div>

        {/* Filtros avanzados */}
        <div className="filters-advanced sap-theme">
          <div className="filters-grid">
            {/* Tipo de mantenimiento */}
            <div className="filter-group">
              <label>Tipo de Mantenimiento</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="sap-theme"
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
                className="sap-theme"
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
                className="sap-theme"
              />
            </div>

            {/* Fecha hasta */}
            <div className="filter-group">
              <label>Fecha Hasta</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="sap-theme"
              />
            </div>
          </div>

          {/* Acciones de filtros */}
          <div className="filters-actions">
            <button
              className="btn-clear-filters sap-theme"
              onClick={onClearFilters}
              disabled={!hasActiveFilters()}
            >
              🗑️ Limpiar Filtros
            </button>
          </div>
        </div>

        {/* Información de resultados */}
        <div className="filters-info sap-theme">
          <div className="results-count">
            {totalResults} mantenimiento{totalResults !== 1 ? 's' : ''} encontrado
            {totalResults !== 1 ? 's' : ''}
          </div>

          {hasActiveFilters() && (
            <div className="active-filters">
              <span className="filters-label">Filtros activos:</span>
              <div className="filter-tags">
                {filters.type && (
                  <span className="filter-tag sap-theme">
                    Tipo: {getMaintenanceTypeName(filters.type)}
                    <button
                      className="filter-tag-remove sap-theme"
                      onClick={() => handleFilterChange('type', '')}
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.status && (
                  <span className="filter-tag sap-theme">
                    Estado: {getStatusName(filters.status)}
                    <button
                      className="filter-tag-remove sap-theme"
                      onClick={() => handleFilterChange('status', '')}
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.dateFrom && (
                  <span className="filter-tag sap-theme">
                    Desde: {filters.dateFrom}
                    <button
                      className="filter-tag-remove sap-theme"
                      onClick={() => handleFilterChange('dateFrom', '')}
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.dateTo && (
                  <span className="filter-tag sap-theme">
                    Hasta: {filters.dateTo}
                    <button
                      className="filter-tag-remove sap-theme"
                      onClick={() => handleFilterChange('dateTo', '')}
                    >
                      ×
                    </button>
                  </span>
                )}
                {searchTerm && (
                  <span className="filter-tag sap-theme">
                    Búsqueda: "{searchTerm}"
                    <button
                      className="filter-tag-remove sap-theme"
                      onClick={() => onSearchChange('')}
                    >
                      ×
                    </button>
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
