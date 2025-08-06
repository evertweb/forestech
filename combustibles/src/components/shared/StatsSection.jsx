/**
 * StatsSection - Sección para estadísticas/métricas
 * Compatible con componentes Stats existentes
 */

import React from 'react';
import PropTypes from 'prop-types';

const StatsSection = ({ children, className = "" }) => {
  if (!children) return null;

  return (
    <div className={`stats-section sap-theme ${className}`}>
      {children}
    </div>
  );
};

StatsSection.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

export default StatsSection;