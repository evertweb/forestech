/**
 * PageLayout - Layout principal reutilizable para componentes Main
 * Estructura consistente: Header + Stats + Filters + Table
 */

import React from 'react';
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
  loading = false,
  className = "",
  showStats = true,
  showFilters = true
}) => {
  return (
    <div className={`min-h-screen bg-gray-50 sap-theme ${className}`}>
      <PageHeader
        title={title}
        subtitle={subtitle}
        actions={actions}
      />

      {stats && showStats && (
        <StatsSection>
          {stats}
        </StatsSection>
      )}

      {filters && showFilters && (
        <FiltersSection>
          {filters}
        </FiltersSection>
      )}

      <TableSection loading={loading}>
        {table}
      </TableSection>
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
  loading: PropTypes.bool,
  className: PropTypes.string,
  showStats: PropTypes.bool,
  showFilters: PropTypes.bool
};

export default PageLayout;