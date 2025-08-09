/**
 * BaseModal - Componente modal base reutilizable
 * Incluye overlay, animaciones, gestión de escape key y responsive design
 */

import React, { useEffect, useCallback, memo } from 'react';
import PropTypes from 'prop-types';

const BaseModal = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  showCloseButton = true,
  preventCloseOnOverlay = false,
  className = '',
  children
}) => {
  // Gestión de escape key
  const handleEscapeKey = useCallback((event) => {
    if (event.key === 'Escape' && isOpen && onClose) {
      onClose();
    }
  }, [isOpen, onClose]);

  // Gestión de clic en overlay
  const handleOverlayClick = useCallback((event) => {
    if (event.target === event.currentTarget && !preventCloseOnOverlay && onClose) {
      onClose();
    }
  }, [preventCloseOnOverlay, onClose]);

  // Efectos para keyboard navigation y body scroll
  useEffect(() => {
    if (isOpen) {
      // Agregar listener para escape key
      document.addEventListener('keydown', handleEscapeKey);
      
      // Prevenir scroll del body
      document.body.style.overflow = 'hidden';
      
      // Focus management - enfocar el modal
      const modalElement = document.querySelector('.modal-content');
      if (modalElement) {
        modalElement.focus();
      }
    } else {
      // Restaurar scroll del body
      document.body.style.overflow = 'unset';
    }

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscapeKey]);

  // No renderizar si el modal no está abierto
  if (!isOpen) return null;

  // Determinar tamaño del modal
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-7xl'
  };

  const modalSizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <div 
      className="modal-overlay" 
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div 
        className={`modal-content ${modalSizeClass} ${className}`}
        role="document"
        tabIndex="-1"
      >
        {/* Header opcional con título y botón de cerrar */}
        {(title || showCloseButton) && (
          <div className="modal-header">
            {title && (
              <h2 id="modal-title" className="modal-title">
                {title}
              </h2>
            )}
            {showCloseButton && (
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
        )}

        {/* Contenido del modal */}
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

BaseModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'full']),
  showCloseButton: PropTypes.bool,
  preventCloseOnOverlay: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};

BaseModal.displayName = 'BaseModal';
export default memo(BaseModal);
