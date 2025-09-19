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
    <div className={`apple-modal-header ${className}`}>
      {/* Icono y título */}
      <div className="apple-modal-title-section">
        {icon && <span className="apple-modal-icon">{icon}</span>}
        <div className="apple-modal-title-text">
          <h2 className="apple-modal-title">{title}</h2>
          {subtitle && <p className="apple-modal-subtitle">{subtitle}</p>}
        </div>
      </div>

      {/* Botón de cerrar */}
      {showCloseButton && onClose && (
        <button
          className="apple-modal-close"
          onClick={onClose}
          type="button"
          aria-label="Cerrar modal"
        >
          ✕
        </button>
      )}
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
