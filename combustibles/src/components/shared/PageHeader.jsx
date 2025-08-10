/**
 * PageHeader - Header consistente con título y acciones
 * Compatible con theme SAP Fiori Corporate
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';

const PageHeader = ({ title, subtitle, actions }) => {
  return (
    <div className="products-header sap-theme sap-theme">
      <div className="header-title sap-theme sap-theme">
        <h1 className="sap-title sap-theme">{title}</h1>
        {subtitle && <p className="sap-subtitle sap-theme">{subtitle}</p>}
      </div>
      {actions && <div className="header-actions sap-theme sap-theme">{actions}</div>}
    </div>
  );
};

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  actions: PropTypes.node,
};

PageHeader.displayName = 'PageHeader';
export default memo(PageHeader);
