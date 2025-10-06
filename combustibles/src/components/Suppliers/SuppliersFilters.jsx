import React from 'react';
import './SuppliersFilters.css';

const STATUS_OPTIONS = [
  { value: 'all', label: 'Todos los estados', icon: '📋' },
  { value: 'active', label: 'Activos', icon: '✅' },
  { value: 'inactive', label: 'Inactivos', icon: '❌' },
  { value: 'suspended', label: 'Suspendidos', icon: '⚠️' },
];

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'Todas las categorías' },
  { value: 'combustibles', label: 'Combustibles' },
  { value: 'lubricantes', label: 'Lubricantes' },
  { value: 'aditivos', label: 'Aditivos' },
];

const PAYMENT_TERMS_OPTIONS = [
  { value: 'all', label: 'Todos los términos' },
  { value: 'contado', label: 'Contado' },
  { value: '30dias', label: '30 días' },
  { value: '60dias', label: '60 días' },
  { value: '90dias', label: '90 días' },
];

export const SuppliersFilters = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  filterCategory,
  setFilterCategory,
  filterPaymentTerms,
  setFilterPaymentTerms,
  viewMode,
  setViewMode,
  onClearFilters,
  resultsCount = 0,
}) => {
  const hasActiveFilters =
    searchTerm ||
    filterStatus !== 'all' ||
    filterCategory !== 'all' ||
    filterPaymentTerms !== 'all';

  const activeFiltersCount = [filterStatus, filterCategory, filterPaymentTerms]
    .filter((value) => value !== 'all')
    .length + (searchTerm ? 1 : 0);

  const toggleAdvancedFilters = () => {
    const advancedSection = document.querySelector('.filters-advanced');
    if (advancedSection) {
      advancedSection.classList.toggle('active');
    }
  };

  return (
    <div className="suppliers-filters sap-theme">
      <div className="filters-main">
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

        <div className="filters-controls">
          <div className="quick-filters">
            {STATUS_OPTIONS.map((option) => (
              <button
                key={option.value}
                className={`quick-filter sap-theme ${filterStatus === option.value ? 'active' : ''}`}
                onClick={() => setFilterStatus(option.value)}
                title={option.label}
              >
                <span>{option.icon}</span>
                <span>{option.label}</span>
              </button>
            ))}
          </div>

          <button
            className={`btn-advanced-filters sap-theme ${hasActiveFilters ? 'active' : ''}`}
            onClick={toggleAdvancedFilters}
          >
            <span>🔧</span>
            <span>Filtros avanzados</span>
            {hasActiveFilters && <span className="filters-count">{activeFiltersCount}</span>}
          </button>

          <div className="view-modes">
            <button
              className={`view-mode sap-theme ${viewMode === 'cards' ? 'active' : ''}`}
              onClick={() => setViewMode('cards')}
              title="Vista de tarjetas"
            >
              <span>🗂️</span>
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

        <div className="filters-advanced sap-theme">
          <div className="filters-grid">
            <div className="filter-group">
              <label>Categoría</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="sap-theme"
              >
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Términos de pago</label>
              <select
                value={filterPaymentTerms}
                onChange={(e) => setFilterPaymentTerms(e.target.value)}
                className="sap-theme"
              >
                {PAYMENT_TERMS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Estado detallado</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="sap-theme"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Acciones</label>
              <button
                className="btn-clear-filters sap-theme"
                onClick={onClearFilters}
                disabled={!hasActiveFilters}
                title="Limpiar todos los filtros"
              >
                <span>🗑️</span>
                <span>Limpiar filtros</span>
              </button>
            </div>
          </div>
        </div>

        <div className="filters-info sap-theme">
          <div className="results-count">
            {resultsCount} proveedor{resultsCount !== 1 ? 'es' : ''} encontrado
            {resultsCount !== 1 ? 's' : ''}
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
                    >
                      ×
                    </button>
                  </span>
                )}
                {filterStatus !== 'all' && (
                  <span className="filter-tag sap-theme">
                    Estado: {STATUS_OPTIONS.find((option) => option.value === filterStatus)?.label}
                    <button
                      className="filter-tag-remove sap-theme"
                      onClick={() => setFilterStatus('all')}
                    >
                      ×
                    </button>
                  </span>
                )}
                {filterCategory !== 'all' && (
                  <span className="filter-tag sap-theme">
                    Categoría: {CATEGORY_OPTIONS.find((option) => option.value === filterCategory)?.label}
                    <button
                      className="filter-tag-remove sap-theme"
                      onClick={() => setFilterCategory('all')}
                    >
                      ×
                    </button>
                  </span>
                )}
                {filterPaymentTerms !== 'all' && (
                  <span className="filter-tag sap-theme">
                    Términos: {
                      PAYMENT_TERMS_OPTIONS.find((option) => option.value === filterPaymentTerms)?.label
                    }
                    <button
                      className="filter-tag-remove sap-theme"
                      onClick={() => setFilterPaymentTerms('all')}
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

export default SuppliersFilters;
