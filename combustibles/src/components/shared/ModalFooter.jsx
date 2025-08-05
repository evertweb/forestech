/**
 * ModalFooter - Footer con botones de acción para modales
 * Maneja acciones primarias y secundarias con estados de loading
 */
import React from 'react';
import './ModalFooter.css';

const ModalFooter = ({
  primaryAction,
  secondaryAction,
  isLoading = false,
  className = '',
  children,
  layout = 'end' // 'start', 'center', 'end', 'between', 'around'
}) => {
  const layoutClasses = {
    start: 'modal-footer-start',
    center: 'modal-footer-center',
    end: 'modal-footer-end',
    between: 'modal-footer-between',
    around: 'modal-footer-around'
  };

  return (
    <div className={`modal-footer-base ${layoutClasses[layout]} ${className}`}>
      {children}
      
      <div className="modal-footer-actions">
        {secondaryAction && (
          <button
            type="button"
            className={`modal-footer-button modal-footer-secondary ${secondaryAction.className || ''}`}
            onClick={secondaryAction.onClick}
            disabled={isLoading || secondaryAction.disabled}
            {...(secondaryAction.props || {})}
          >
            {secondaryAction.icon && <span className="button-icon">{secondaryAction.icon}</span>}
            {secondaryAction.label || 'Cancelar'}
          </button>
        )}
        
        {primaryAction && (
          <button
            type={primaryAction.type || 'button'}
            className={`modal-footer-button modal-footer-primary ${primaryAction.className || ''}`}
            onClick={primaryAction.onClick}
            disabled={isLoading || primaryAction.disabled}
            {...(primaryAction.props || {})}
          >
            {isLoading ? (
              <>
                <span className="button-spinner"></span>
                {primaryAction.loadingLabel || 'Guardando...'}
              </>
            ) : (
              <>
                {primaryAction.icon && <span className="button-icon">{primaryAction.icon}</span>}
                {primaryAction.label || 'Guardar'}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default ModalFooter;