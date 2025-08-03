import React from 'react';
import './SuppliersFilters.css';

export const SuppliersFilters = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  filterCategory,
  setFilterCategory,
  filterFuelType,
  setFilterFuelType,
  viewMode,
  setViewMode,
  onClearFilters,
  resultsCount = 0
}) => {
  const statusOptions = [
    { value: 'all', label: 'Todos los Estados' },
    { value: 'active', label: 'Activos' },
    { value: 'inactive', label: 'Inactivos' },
    { value: 'suspended', label: 'Suspendidos' },
    { value: 'preferred', label: 'Preferidos' },
    { value: 'under_review', label: 'En Revisión' },
    { value: 'blacklisted', label: 'Bloqueados' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'Todas las Categorías' },
    { value: 'fuel_supplier', label: 'Proveedor de Combustible' },
    { value: 'transport', label: 'Transporte' },
    { value: 'maintenance', label: 'Mantenimiento' },
    { value: 'parts', label: 'Repuestos' },
    { value: 'equipment', label: 'Equipos' },
    { value: 'services', label: 'Servicios' },
    { value: 'other', label: 'Otros' }
  ];

  const fuelTypeOptions = [
    { value: 'all', label: 'Todos los Combustibles' },
    { value: 'diesel', label: 'Diésel' },
    { value: 'gasoline', label: 'Gasolina' },
    { value: 'acpm', label: 'ACPM' },
    { value: 'lubricants', label: 'Lubricantes' },
    { value: 'other', label: 'Otros' }
  ];

  const hasActiveFilters = searchTerm || 
    filterStatus !== 'all' || 
    filterCategory !== 'all' || 
    filterFuelType !== 'all';

  return (
    <div className="suppliers-filters sap-theme">
      <div className="filters-main">
        {/* Search Section */}
        <div className="search-section">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar por nombre, NIT, contacto, ciudad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input sap-theme"
            />
            {searchTerm && (
              <button
                className="search-clear sap-theme"
                onClick={() => setSearchTerm('')}
                title="Limpiar búsqueda"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls */}
        <div className="filters-controls">
          {/* Quick Filters */}
          <div className="quick-filters">
            {statusOptions.slice(0, 5).map(option => (
              <button
                key={option.value}
                className={`quick-filter sap-theme ${filterStatus === option.value ? 'active' : ''}`}
                onClick={() => setFilterStatus(option.value)}
                title={option.label}
              >
                <span>{option.value === 'all' ? '📋' : 
                      option.value === 'active' ? '✅' : 
                      option.value === 'inactive' ? '❌' :
                      option.value === 'suspended' ? '⚠️' : '⭐'}</span>
                <span>{option.label}</span>
              </button>
            ))}
          </div>

          {/* Advanced Filters Toggle */}
          <button
            className={`btn-advanced-filters sap-theme ${hasActiveFilters ? 'active' : ''}`}
            onClick={() => {
              const advancedSection = document.querySelector('.filters-advanced');
              if (advancedSection) {
                advancedSection.classList.toggle('active');
              }
            }}
          >
            <span>🔧</span>
            <span>Filtros Avanzados</span>
            {hasActiveFilters && (
              <span className="filters-count">{
                [filterStatus, filterCategory, filterFuelType].filter(f => f !== 'all').length + 
                (searchTerm ? 1 : 0)
              }</span>
            )}
          </button>

          {/* View Mode Toggle */}
          <div className="view-modes">
            <button
              className={`view-mode sap-theme ${viewMode === 'cards' ? 'active' : ''}`}
              onClick={() => setViewMode('cards')}
              title="Vista de tarjetas"
            >
              <span>📋</span>
              <span>Cards</span>
            </button>
            <button
              className={`view-mode sap-theme ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Vista de tabla"
            >
              <span>📊</span>
              <span>Tabla</span>
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="filters-advanced sap-theme">
          <div className="filters-grid">
            {/* Category Filter */}
            <div className="filter-group">
              <label>Categoría</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="sap-theme"
              >
                {categoryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Fuel Type Filter */}
            <div className="filter-group">
              <label>Tipo de Combustible</label>
              <select
                value={filterFuelType}
                onChange={(e) => setFilterFuelType(e.target.value)}
                className="sap-theme"
              >
                {fuelTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="filter-group">
              <label>Estado Detallado</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="sap-theme"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <div className="filter-group">
              <label>Acciones</label>
              <button
                className="btn-clear-filters sap-theme"
                onClick={onClearFilters}
                disabled={!hasActiveFilters}
                title="Limpiar todos los filtros"
              >
                <span>🗑️</span>
                <span>Limpiar Filtros</span>
              </button>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="filters-info sap-theme">
          <div className="results-count">
            {resultsCount} proveedor{resultsCount !== 1 ? 'es' : ''} encontrado{resultsCount !== 1 ? 's' : ''}
          </div>
          
          {hasActiveFilters && (
            <div className="active-filters">
              <span className="filters-label">Filtros activos:</span>
              <div className="filter-tags">
                {searchTerm && (
                  <span className="filter-tag sap-theme">
                    Búsqueda: "{searchTerm}"
                    <button 
                      className="filter-tag-remove sap-theme"
                      onClick={() => setSearchTerm('')}
                    >×</button>
                  </span>
                )}
                {filterStatus !== 'all' && (
                  <span className="filter-tag sap-theme">
                    Estado: {statusOptions.find(s => s.value === filterStatus)?.label}
                    <button 
                      className="filter-tag-remove sap-theme"
                      onClick={() => setFilterStatus('all')}
                    >×</button>
                  </span>
                )}
                {filterCategory !== 'all' && (
                  <span className="filter-tag sap-theme">
                    Categoría: {categoryOptions.find(c => c.value === filterCategory)?.label}
                    <button 
                      className="filter-tag-remove sap-theme"
                      onClick={() => setFilterCategory('all')}
                    >×</button>
                  </span>
                )}
                {filterFuelType !== 'all' && (
                  <span className="filter-tag sap-theme">
                    Combustible: {fuelTypeOptions.find(f => f.value === filterFuelType)?.label}
                    <button 
                      className="filter-tag-remove sap-theme"
                      onClick={() => setFilterFuelType('all')}
                    >×</button>
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

export default SuppliersFilters;
