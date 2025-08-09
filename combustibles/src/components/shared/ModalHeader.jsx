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
  className = ''
}) => {
  return (
    <div className={`modal-header ${className}`}>
      <div className="modal-header-content">
        {/* Icono y título */}
        <div className="modal-title-section">
          {icon && <span className="modal-icon">{icon}</span>}
          <div className="modal-title-text">
            <h2 className="modal-title">{title}</h2>
            {subtitle && <p className="modal-subtitle">{subtitle}</p>}
          </div>
        </div>

        {/* Botón de cerrar */}
        {showCloseButton && onClose && (
          <button
            className="modal-close"
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
  className: PropTypes.string
};

ModalHeader.displayName = 'ModalHeader';
export default memo(ModalHeader);
