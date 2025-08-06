/**
 * ModalFooter - Footer consistente para modales
 * Incluye botones de acción primaria y secundaria
 */

import React from 'react';
import PropTypes from 'prop-types';

const ModalFooter = ({ 
  primaryAction,
  secondaryAction,
  isLoading = false,
  className = '',
  children 
}) => {
  return (
    <div className={`modal-footer ${className}`}>
      {/* Contenido personalizado si se proporciona */}
      {children}

      {/* Botones de acción estándar */}
      {(primaryAction || secondaryAction) && (
        <div className="modal-actions">
          {/* Botón secundario (normalmente Cancelar) */}
          {secondaryAction && (
            <button
              type="button"
              className={`btn-secondary ${secondaryAction.className || ''}`}
              onClick={secondaryAction.onClick}
              disabled={isLoading || secondaryAction.disabled}
            >
              {secondaryAction.label || 'Cancelar'}
            </button>
          )}

          {/* Botón primario (normalmente Guardar/Aceptar) */}
          {primaryAction && (
            <button
              type={primaryAction.type || 'button'}
              className={`btn-primary ${primaryAction.className || ''}`}
              onClick={primaryAction.onClick}
              disabled={isLoading || primaryAction.disabled}
            >
              {isLoading ? 'Guardando...' : (primaryAction.label || 'Guardar')}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

ModalFooter.propTypes = {
  primaryAction: PropTypes.shape({
    label: PropTypes.string,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    type: PropTypes.string,
    className: PropTypes.string
  }),
  secondaryAction: PropTypes.shape({
    label: PropTypes.string,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    className: PropTypes.string
  }),
  isLoading: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node
};

export default ModalFooter;
