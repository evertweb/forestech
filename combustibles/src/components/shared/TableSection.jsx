/**
 * TableSection - Sección para tabla de datos
 * Incluye loading states y manejo de contenido
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';

const TableSection = ({ children, loading = false, className = "" }) => {
  return (
    <div className={`table-section sap-theme ${className}`}>
      {loading ? (
        <div className="loading-container sap-theme">
          <div className="loading-spinner sap-theme"></div>
          <p className="sap-text">Cargando datos...</p>
        </div>
      ) : (
        children
      )}
    </div>
  );
};

TableSection.propTypes = {
  children: PropTypes.node,
  loading: PropTypes.bool,
  className: PropTypes.string
};

TableSection.displayName = 'TableSection';
export default memo(TableSection);