/**
 * PageHeader - Header consistente con título y acciones
 * Compatible con theme SAP Fiori Corporate
 */

import React from 'react';
import PropTypes from 'prop-types';

const PageHeader = ({ title, subtitle, actions }) => {
  return (
    <div className="products-header sap-theme">
      <div className="header-title sap-theme">
        <h1 className="sap-title">{title}</h1>
        {subtitle && (
          <p className="sap-subtitle">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="header-actions sap-theme">
          {actions}
        </div>
      )}
    </div>
  );
};

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  actions: PropTypes.node
};

export default PageHeader;