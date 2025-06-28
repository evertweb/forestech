// combustibles/src/components/Suppliers/SuppliersFilters.jsx
// Componente de filtros para proveedores
import React from 'react';
import { FUEL_TYPES } from '../../constants/combustibleTypes';

const SuppliersFilters = ({
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
  resultsCount
}) => {
  const statusOptions = [
    { value: 'all', label: 'Todos los Estados', icon: 'list' },
    { value: 'active', label: 'Activos', icon: 'check-circle' },
    { value: 'inactive', label: 'Inactivos', icon: 'x-circle' },
    { value: 'suspended', label: 'Suspendidos', icon: 'alert-circle' },
    { value: 'preferred', label: 'Preferidos', icon: 'star' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'Todas las Categorías', icon: 'grid' },
    { value: 'combustibles', label: 'Combustibles', icon: 'fuel' },
    { value: 'lubricantes', label: 'Lubricantes', icon: 'droplets' },
    { value: 'aditivos', label: 'Aditivos', icon: 'flask' }
  ];

  const fuelTypeOptions = [
    { value: 'all', label: 'Todos los Combustibles', icon: 'fuel' },
    ...Object.entries(FUEL_TYPES).map(([key, value]) => ({
      value: key,
      label: value,
      icon: 'droplet'
    }))
  ];

  const hasActiveFilters = 
    searchTerm || 
    filterStatus !== 'all' || 
    filterCategory !== 'all' || 
    filterFuelType !== 'all';

  return (
    <div className="suppliers-filters">
      {/* Search and View Controls */}
      <div className="filters-top">
        <div className="search-container">
          <div className="search-input-wrapper">
            <i className="icon-search search-icon"></i>
            <input
              type="text"
              placeholder="Buscar por nombre, NIT, contacto, ciudad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button
                className="search-clear"
                onClick={() => setSearchTerm('')}
                title="Limpiar búsqueda"
              >
                <i className="icon-x"></i>
              </button>
            )}
          </div>
        </div>

        <div className="view-controls">
          <div className="view-mode-toggle">
            <button
              className={`view-btn ${viewMode === 'cards' ? 'active' : ''}`}
              onClick={() => setViewMode('cards')}
              title="Vista de tarjetas"
            >
              <i className="icon-grid"></i>
            </button>
            <button
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Vista de tabla"
            >
              <i className="icon-list"></i>
            </button>
          </div>

          {hasActiveFilters && (
            <button
              className="btn btn-secondary clear-filters"
              onClick={onClearFilters}
              title="Limpiar todos los filtros"
            >
              <i className="icon-filter-x"></i>
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Filter Dropdowns */}
      <div className="filters-dropdowns">
        {/* Status Filter */}
        <div className="filter-group">
          <label className="filter-label">Estado</label>
          <div className="select-wrapper">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <i className="icon-chevron-down select-arrow"></i>
          </div>
        </div>

        {/* Category Filter */}
        <div className="filter-group">
          <label className="filter-label">Categoría</label>
          <div className="select-wrapper">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="filter-select"
            >
              {categoryOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <i className="icon-chevron-down select-arrow"></i>
          </div>
        </div>

        {/* Fuel Type Filter */}
        <div className="filter-group">
          <label className="filter-label">Tipo de Combustible</label>
          <div className="select-wrapper">
            <select
              value={filterFuelType}
              onChange={(e) => setFilterFuelType(e.target.value)}
              className="filter-select"
            >
              {fuelTypeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <i className="icon-chevron-down select-arrow"></i>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="filters-summary">
        <div className="results-count">
          <i className="icon-info-circle"></i>
          <span>
            {resultsCount === 0 
              ? 'No se encontraron proveedores'
              : `Mostrando ${resultsCount} proveedor${resultsCount !== 1 ? 'es' : ''}`
            }
          </span>
        </div>

        {hasActiveFilters && (
          <div className="active-filters">
            <span className="filters-label">Filtros activos:</span>
            <div className="filter-tags">
              {searchTerm && (
                <span className="filter-tag">
                  <i className="icon-search"></i>
                  {searchTerm}
                  <button onClick={() => setSearchTerm('')}>
                    <i className="icon-x"></i>
                  </button>
                </span>
              )}
              
              {filterStatus !== 'all' && (
                <span className="filter-tag">
                  <i className="icon-filter"></i>
                  {statusOptions.find(opt => opt.value === filterStatus)?.label}
                  <button onClick={() => setFilterStatus('all')}>
                    <i className="icon-x"></i>
                  </button>
                </span>
              )}
              
              {filterCategory !== 'all' && (
                <span className="filter-tag">
                  <i className="icon-tag"></i>
                  {categoryOptions.find(opt => opt.value === filterCategory)?.label}
                  <button onClick={() => setFilterCategory('all')}>
                    <i className="icon-x"></i>
                  </button>
                </span>
              )}
              
              {filterFuelType !== 'all' && (
                <span className="filter-tag">
                  <i className="icon-droplet"></i>
                  {fuelTypeOptions.find(opt => opt.value === filterFuelType)?.label}
                  <button onClick={() => setFilterFuelType('all')}>
                    <i className="icon-x"></i>
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quick Filter Buttons */}
      <div className="quick-filters">
        <span className="quick-filters-label">Acceso rápido:</span>
        <div className="quick-filter-buttons">
          <button
            className={`quick-filter-btn ${filterStatus === 'preferred' ? 'active' : ''}`}
            onClick={() => setFilterStatus(filterStatus === 'preferred' ? 'all' : 'preferred')}
          >
            <i className="icon-star"></i>
            Preferidos
          </button>
          
          <button
            className={`quick-filter-btn ${filterStatus === 'active' ? 'active' : ''}`}
            onClick={() => setFilterStatus(filterStatus === 'active' ? 'all' : 'active')}
          >
            <i className="icon-check-circle"></i>
            Activos
          </button>
          
          <button
            className={`quick-filter-btn ${filterCategory === 'combustibles' ? 'active' : ''}`}
            onClick={() => setFilterCategory(filterCategory === 'combustibles' ? 'all' : 'combustibles')}
          >
            <i className="icon-fuel"></i>
            Combustibles
          </button>
          
          <button
            className={`quick-filter-btn ${filterFuelType === 'diesel' ? 'active' : ''}`}
            onClick={() => setFilterFuelType(filterFuelType === 'diesel' ? 'all' : 'diesel')}
          >
            <i className="icon-droplet"></i>
            Diésel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuppliersFilters;