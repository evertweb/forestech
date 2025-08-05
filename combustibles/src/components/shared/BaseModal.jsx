/**
 * BaseModal - Componente modal base reutilizable
 * Maneja overlay, animaciones, escape key y estructura base
 */
import React, { useEffect, useCallback } from 'react';
import './BaseModal.css';

const BaseModal = ({
  isOpen,
  onClose,
  size = 'md',
  preventCloseOnOverlay = false,
  className = '',
  children
}) => {
  // Manejar tecla Escape
  const handleEscape = useCallback((e) => {
    if (e.key === 'Escape' && isOpen && onClose) {
      onClose();
    }
  }, [isOpen, onClose]);

  // Manejar clic en overlay
  const handleOverlayClick = useCallback((e) => {
    if (!preventCloseOnOverlay && e.target === e.currentTarget && onClose) {
      onClose();
    }
  }, [preventCloseOnOverlay, onClose]);

  // Configurar eventos globales
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  // No renderizar si no está abierto
  if (!isOpen) return null;

  // Clases de tamaño
  const sizeClasses = {
    sm: 'base-modal-sm',
    md: 'base-modal-md',
    lg: 'base-modal-lg',
    xl: 'base-modal-xl',
    full: 'base-modal-full'
  };

  return (
    <div className="base-modal-overlay" onClick={handleOverlayClick}>
      <div className={`base-modal-content ${sizeClasses[size]} ${className}`}>
        {children}
      </div>
    </div>
  );
};

export default BaseModal;