/**
 * FiltersSection - Sección para filtros y búsqueda
 * Compatible con componentes de filtros existentes
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';

const FiltersSection = ({ children, className = '' }) => {
  if (!children) return null;

  return <div className={`filters-section sap-theme ${className}`}>{children}</div>;
};

FiltersSection.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

FiltersSection.displayName = 'FiltersSection';
export default memo(FiltersSection);
