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
    <div className={`sap-theme min-h-screen bg-gray-50 ${className}`}>
      <PageHeader title={title} subtitle={subtitle} actions={actions} />

      {stats && showStats && <StatsSection>{stats}</StatsSection>}

      {filters && showFilters && <FiltersSection>{filters}</FiltersSection>}

      <TableSection loading={loading}>{content}</TableSection>
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
