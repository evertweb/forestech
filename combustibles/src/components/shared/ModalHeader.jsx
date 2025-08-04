/**
 * ModalHeader - Header consistente para modales
 * Incluye título y botón de cerrar opcional
 */
import React from 'react';
import './ModalHeader.css';

const ModalHeader = ({ 
  title, 
  onClose, 
  showCloseButton = true,
  className = '',
  children 
}) => {
  return (
    <div className={`modal-header-base ${className}`}>
      <div className="modal-header-content">
        {typeof title === 'string' ? (
          <h2 className="modal-header-title">{title}</h2>
        ) : (
          title
        )}
        {children}
      </div>
      
      {showCloseButton && onClose && (
        <button
          type="button"
          className="modal-header-close"
          onClick={onClose}
          aria-label="Cerrar modal"
          title="Cerrar"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default ModalHeader;