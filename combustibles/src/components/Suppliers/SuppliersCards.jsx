// combustibles/src/components/Suppliers/SuppliersCards.jsx
// Componente de vista de tarjetas para proveedores
import React from 'react';
import { formatCurrency } from '../../utils/calculations';
import { FUEL_TYPES } from '../../constants/combustibleTypes';

const SuppliersCards = ({ 
  suppliers, 
  onEdit, 
  onDelete, 
  hasEditPermission, 
  hasDeletePermission 
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#22c55e';
      case 'inactive': return '#ef4444';
      case 'suspended': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'inactive': return 'Inactivo';
      case 'suspended': return 'Suspendido';
      default: return 'Desconocido';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'combustibles': return '⛽';
      case 'lubricantes': return '🛢️';
      case 'aditivos': return '🧪';
      default: return '📦';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'proveedor': return 'Proveedor';
      case 'distribuidor': return 'Distribuidor';
      case 'mayorista': return 'Mayorista';
      default: return 'Sin especificar';
    }
  };

  const formatDate = (date) => {
    if (!date) return 'No disponible';
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleDateString('es-CO');
  };

  const renderRating = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span 
          key={i} 
          className={`star ${i <= rating ? 'filled' : ''}`}
        >
          ★
        </span>
      );
    }
    return <div className="rating-stars">{stars}</div>;
  };

  const renderFuelTypes = (fuelTypes) => {
    if (!fuelTypes || fuelTypes.length === 0) {
      return <span className="no-fuels">Sin combustibles especificados</span>;
    }

    return (
      <div className="fuel-types">
        {fuelTypes.slice(0, 3).map(fuelType => (
          <span key={fuelType} className="fuel-badge" title={FUEL_TYPES[fuelType]}>
            {FUEL_TYPES[fuelType] || fuelType}
          </span>
        ))}
        {fuelTypes.length > 3 && (
          <span className="fuel-badge more" title={`+${fuelTypes.length - 3} más`}>
            +{fuelTypes.length - 3}
          </span>
        )}
      </div>
    );
  };

  const renderContactInfo = (supplier) => {
    const contacts = [];
    
    if (supplier.phone) {
      contacts.push(
        <div key="phone" className="contact-item">
          <i className="icon-phone"></i>
          <span>{supplier.phone}</span>
        </div>
      );
    }
    
    if (supplier.email) {
      contacts.push(
        <div key="email" className="contact-item">
          <i className="icon-mail"></i>
          <span>{supplier.email}</span>
        </div>
      );
    }
    
    if (supplier.city) {
      contacts.push(
        <div key="city" className="contact-item">
          <i className="icon-map-pin"></i>
          <span>{supplier.city}</span>
        </div>
      );
    }

    return contacts.length > 0 ? contacts : (
      <div className="contact-item no-contact">
        <i className="icon-info-circle"></i>
        <span>Sin información de contacto</span>
      </div>
    );
  };

  return (
    <div className="suppliers-cards">
      {suppliers.map(supplier => (
        <div key={supplier.id} className={`supplier-card ${supplier.status}`}>
          {/* Header */}
          <div className="card-header">
            <div className="header-left">
              <div className="supplier-info">
                <h3 className="supplier-name">
                  {supplier.name}
                  {supplier.isPreferred && (
                    <span className="preferred-badge" title="Proveedor Preferido">
                      <i className="icon-star"></i>
                    </span>
                  )}
                </h3>
                {supplier.taxId && (
                  <div className="supplier-tax-id">
                    NIT: {supplier.taxId}
                  </div>
                )}
              </div>
            </div>

            <div className="header-right">
              <div className="supplier-status">
                <span 
                  className="status-dot"
                  style={{ backgroundColor: getStatusColor(supplier.status) }}
                ></span>
                <span className="status-label">
                  {getStatusLabel(supplier.status)}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="card-content">
            {/* Category and Type */}
            <div className="supplier-meta">
              <div className="meta-item">
                <span className="meta-icon">{getCategoryIcon(supplier.category)}</span>
                <span className="meta-label">
                  {supplier.category?.charAt(0).toUpperCase() + supplier.category?.slice(1) || 'Sin categoría'}
                </span>
              </div>
              
              <div className="meta-item">
                <i className="icon-building meta-icon"></i>
                <span className="meta-label">
                  {getTypeLabel(supplier.type)}
                </span>
              </div>
            </div>

            {/* Contact Person */}
            {supplier.contactPerson && (
              <div className="contact-person">
                <i className="icon-user"></i>
                <span>{supplier.contactPerson}</span>
              </div>
            )}

            {/* Contact Information */}
            <div className="contact-info">
              {renderContactInfo(supplier)}
            </div>

            {/* Fuel Types */}
            <div className="fuel-types-section">
              <div className="section-label">Combustibles Suministrados:</div>
              {renderFuelTypes(supplier.fuelTypes)}
            </div>

            {/* Rating and Evaluation */}
            <div className="rating-section">
              <div className="rating-display">
                {renderRating(supplier.rating || 0)}
                <span className="rating-value">
                  {(supplier.rating || 0).toFixed(1)}/5
                </span>
              </div>
              {supplier.evaluationNotes && (
                <div className="evaluation-notes" title={supplier.evaluationNotes}>
                  <i className="icon-message-square"></i>
                  <span>Con evaluación</span>
                </div>
              )}
            </div>

            {/* Payment Terms */}
            {supplier.paymentTerms && (
              <div className="payment-terms">
                <i className="icon-credit-card"></i>
                <span>
                  Términos: {supplier.paymentTerms === 'contado' ? 'Contado' : 
                           supplier.paymentTerms === '30dias' ? '30 días' :
                           supplier.paymentTerms === '60dias' ? '60 días' :
                           supplier.paymentTerms === '90dias' ? '90 días' :
                           supplier.paymentTerms}
                </span>
              </div>
            )}

            {/* Statistics */}
            <div className="supplier-stats">
              <div className="stat-item">
                <span className="stat-label">Órdenes:</span>
                <span className="stat-value">{supplier.totalOrders || 0}</span>
              </div>
              
              <div className="stat-item">
                <span className="stat-label">Total Comprado:</span>
                <span className="stat-value">
                  {formatCurrency(supplier.totalPurchased || 0)}
                </span>
              </div>
              
              {supplier.lastOrderDate && (
                <div className="stat-item">
                  <span className="stat-label">Última Orden:</span>
                  <span className="stat-value">
                    {formatDate(supplier.lastOrderDate)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Footer with Actions */}
          <div className="card-footer">
            <div className="footer-info">
              <span className="created-date">
                Creado: {formatDate(supplier.createdAt)}
              </span>
            </div>

            <div className="card-actions">
              {hasEditPermission && (
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => onEdit(supplier)}
                  title="Editar proveedor"
                >
                  <i className="icon-edit"></i>
                  Editar
                </button>
              )}

              {hasDeletePermission && supplier.status === 'active' && (
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => onDelete(supplier.id, supplier.name)}
                  title="Desactivar proveedor"
                >
                  <i className="icon-x-circle"></i>
                  Desactivar
                </button>
              )}

              {/* Quick Actions */}
              <div className="quick-actions">
                {supplier.phone && (
                  <a
                    href={`tel:${supplier.phone}`}
                    className="quick-action-btn"
                    title="Llamar"
                  >
                    <i className="icon-phone"></i>
                  </a>
                )}
                
                {supplier.email && (
                  <a
                    href={`mailto:${supplier.email}`}
                    className="quick-action-btn"
                    title="Enviar email"
                  >
                    <i className="icon-mail"></i>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SuppliersCards;