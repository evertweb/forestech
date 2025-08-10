/**
 * ModalHeader - Header consistente para modales
 * Incluye título y botón de cerrar opcional
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';

const ModalHeader = ({
  title,
  onClose,
  showCloseButton = true,
  subtitle,
  icon,
  className = '',
}) => {
  return (
    <div className={`modal-header ${className}`}>
      <div className="modal-header-content sap-theme">
        {/* Icono y título */}
        <div className="modal-title-section sap-theme">
          {icon && <span className="modal-icon sap-theme">{icon}</span>}
          <div className="modal-title-text sap-theme">
            <h2 className="modal-title sap-theme">{title}</h2>
            {subtitle && <p className="modal-subtitle sap-theme">{subtitle}</p>}
          </div>
        </div>

        {/* Botón de cerrar */}
        {showCloseButton && onClose && (
          <button
            className="modal-close sap-theme"
            onClick={onClose}
            type="button"
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

ModalHeader.propTypes = {
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  showCloseButton: PropTypes.bool,
  subtitle: PropTypes.string,
  icon: PropTypes.node,
  className: PropTypes.string,
};

ModalHeader.displayName = 'ModalHeader';
export default memo(ModalHeader);
