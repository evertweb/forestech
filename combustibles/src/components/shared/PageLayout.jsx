/**
 * PageLayout - Layout principal reutilizable para componentes Main
 * Estructura consistente: Header + Stats + Filters + Table
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import PageHeader from './PageHeader';
import StatsSection from './StatsSection';
import FiltersSection from './FiltersSection';
import TableSection from './TableSection';

const PageLayout = ({
  title,
  subtitle,
  actions,
  stats,
  filters,
  table,
  children,
  loading = false,
  className = '',
  showStats = true,
  showFilters = true,
}) => {
  // Contenido principal: priorizar 'table' si está definido; de lo contrario, usar 'children'.
  const content = table !== undefined ? table : children;
  return (
    <div className={`apple-dashboard-main ${className}`}>
      {/* Header Apple */}
      <div className="apple-dashboard-header">
        <h1 className="apple-dashboard-title">{title}</h1>
        {subtitle && <p className="apple-dashboard-subtitle">{subtitle}</p>}
        {actions && <div className="apple-content-actions">{actions}</div>}
      </div>

      {/* Stats Apple */}
      {stats && showStats && (
        <div className="apple-stats-grid">
          {stats}
        </div>
      )}

      {/* Filters Apple */}
      {filters && showFilters && (
        <div className="apple-content-section">
          <div className="apple-content-body">
            {filters}
          </div>
        </div>
      )}

      {/* Content Apple */}
      <div className="apple-content-grid">
        {loading ? (
          <div className="apple-loading-state">
            <div className="apple-loading-spinner"></div>
            <div className="apple-loading-text">Cargando...</div>
          </div>
        ) : (
          content
        )}
      </div>
    </div>
  );
};

PageLayout.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  actions: PropTypes.node,
  stats: PropTypes.node,
  filters: PropTypes.node,
  table: PropTypes.node,
  children: PropTypes.node,
  loading: PropTypes.bool,
  className: PropTypes.string,
  showStats: PropTypes.bool,
  showFilters: PropTypes.bool,
};

PageLayout.displayName = 'PageLayout';
export default memo(PageLayout);
