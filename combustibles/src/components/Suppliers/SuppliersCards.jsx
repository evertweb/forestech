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
  hasDeletePermission,
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'var(--color-success-light)';
      case 'inactive':
        return 'var(--color-error)';
      case 'suspended':
        return 'var(--color-warning)';
      default:
        return 'var(--text-muted)';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'inactive':
        return 'Inactivo';
      case 'suspended':
        return 'Suspendido';
      default:
        return 'Desconocido';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'combustibles':
        return '⛽';
      case 'lubricantes':
        return '🛢️';
      case 'aditivos':
        return '🧪';
      default:
        return '📦';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'proveedor':
        return 'Proveedor';
      case 'distribuidor':
        return 'Distribuidor';
      case 'mayorista':
        return 'Mayorista';
      default:
        return 'Sin especificar';
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
        <span key={i} className={`star ${i <= rating ? 'filled' : ''}`}>
          ★
        </span>
      );
    }
    return <div className="rating-stars sap-theme">{stars}</div>;
  };

  const renderFuelTypes = (fuelTypes) => {
    if (!fuelTypes || fuelTypes.length === 0) {
      return <span className="no-fuels sap-theme">Sin combustibles especificados</span>;
    }

    return (
      <div className="fuel-types sap-theme">
        {fuelTypes.slice(0, 3).map((fuelType) => (
          <span key={fuelType} className="fuel-badge sap-theme" title={FUEL_TYPES[fuelType]}>
            {FUEL_TYPES[fuelType] || fuelType}
          </span>
        ))}
        {fuelTypes.length > 3 && (
          <span className="fuel-badge more sap-theme" title={`+${fuelTypes.length - 3} más`}>
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
        <div key="phone" className="contact-item sap-theme">
          <i className="icon-phone sap-theme"></i>
          <span>{supplier.phone}</span>
        </div>
      );
    }

    if (supplier.email) {
      contacts.push(
        <div key="email" className="contact-item sap-theme">
          <i className="icon-mail sap-theme"></i>
          <span>{supplier.email}</span>
        </div>
      );
    }

    if (supplier.city) {
      contacts.push(
        <div key="city" className="contact-item sap-theme">
          <i className="icon-map-pin sap-theme"></i>
          <span>{supplier.city}</span>
        </div>
      );
    }

    return contacts.length > 0 ? (
      contacts
    ) : (
      <div className="contact-item no-contact sap-theme">
        <i className="icon-info-circle sap-theme"></i>
        <span>Sin información de contacto</span>
      </div>
    );
  };

  return (
    <div className="suppliers-cards sap-theme">
      {suppliers.map((supplier) => (
        <div key={supplier.id} className={`supplier-card ${supplier.status}`}>
          {/* Header */}
          <div className="card-header sap-theme">
            <div className="header-left sap-theme">
              <div className="supplier-info sap-theme">
                <h3 className="supplier-name sap-theme">
                  {supplier.name}
                  {supplier.isPreferred && (
                    <span className="preferred-badge sap-theme" title="Proveedor Preferido">
                      <i className="icon-star sap-theme"></i>
                    </span>
                  )}
                </h3>
                {supplier.taxId && (
                  <div className="supplier-tax-id sap-theme">NIT: {supplier.taxId}</div>
                )}
              </div>
            </div>

            <div className="header-right sap-theme">
              <div className="supplier-status sap-theme">
                <span
                  className="status-dot sap-theme"
                  style={{ backgroundColor: getStatusColor(supplier.status) }}
                ></span>
                <span className="status-label sap-theme">{getStatusLabel(supplier.status)}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="card-content sap-theme">
            {/* Category and Type */}
            <div className="supplier-meta sap-theme">
              <div className="meta-item sap-theme">
                <span className="meta-icon sap-theme">{getCategoryIcon(supplier.category)}</span>
                <span className="meta-label sap-theme">
                  {supplier.category?.charAt(0).toUpperCase() + supplier.category?.slice(1) ||
                    'Sin categoría'}
                </span>
              </div>

              <div className="meta-item sap-theme">
                <i className="icon-building meta-icon sap-theme"></i>
                <span className="meta-label sap-theme">{getTypeLabel(supplier.type)}</span>
              </div>
            </div>

            {/* Contact Person */}
            {supplier.contactPerson && (
              <div className="contact-person sap-theme">
                <i className="icon-user sap-theme"></i>
                <span>{supplier.contactPerson}</span>
              </div>
            )}

            {/* Contact Information */}
            <div className="contact-info sap-theme">{renderContactInfo(supplier)}</div>

            {/* Fuel Types */}
            <div className="fuel-types-section sap-theme">
              <div className="section-label sap-theme">Combustibles Suministrados:</div>
              {renderFuelTypes(supplier.fuelTypes)}
            </div>

            {/* Rating and Evaluation */}
            <div className="rating-section sap-theme">
              <div className="rating-display sap-theme">
                {renderRating(supplier.rating || 0)}
                <span className="rating-value sap-theme">
                  {(supplier.rating || 0).toFixed(1)}/5
                </span>
              </div>
              {supplier.evaluationNotes && (
                <div className="evaluation-notes sap-theme" title={supplier.evaluationNotes}>
                  <i className="icon-message-square sap-theme"></i>
                  <span>Con evaluación</span>
                </div>
              )}
            </div>

            {/* Payment Terms */}
            {supplier.paymentTerms && (
              <div className="payment-terms sap-theme">
                <i className="icon-credit-card sap-theme"></i>
                <span>
                  Términos:{' '}
                  {supplier.paymentTerms === 'contado'
                    ? 'Contado'
                    : supplier.paymentTerms === '30dias'
                      ? '30 días'
                      : supplier.paymentTerms === '60dias'
                        ? '60 días'
                        : supplier.paymentTerms === '90dias'
                          ? '90 días'
                          : supplier.paymentTerms}
                </span>
              </div>
            )}

            {/* Statistics */}
            <div className="supplier-stats sap-theme">
              <div className="stat-item sap-theme">
                <span className="stat-label sap-theme">Órdenes:</span>
                <span className="stat-value sap-theme">{supplier.totalOrders || 0}</span>
              </div>

              <div className="stat-item sap-theme">
                <span className="stat-label sap-theme">Total Comprado:</span>
                <span className="stat-value sap-theme">
                  {formatCurrency(supplier.totalPurchased || 0)}
                </span>
              </div>

              {supplier.lastOrderDate && (
                <div className="stat-item sap-theme">
                  <span className="stat-label sap-theme">Última Orden:</span>
                  <span className="stat-value sap-theme">{formatDate(supplier.lastOrderDate)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Footer with Actions */}
          <div className="card-footer sap-theme">
            <div className="footer-info sap-theme">
              <span className="created-date sap-theme">
                Creado: {formatDate(supplier.createdAt)}
              </span>
            </div>

            <div className="card-actions sap-theme">
              {hasEditPermission && (
                <button
                  className="btn btn-sm btn-secondary sap-theme"
                  onClick={() => onEdit(supplier)}
                  title="Editar proveedor"
                >
                  <i className="icon-edit sap-theme"></i>
                  Editar
                </button>
              )}

              {hasDeletePermission && supplier.status === 'active' && (
                <button
                  className="btn btn-sm btn-danger sap-theme"
                  onClick={() => onDelete(supplier.id, supplier.name)}
                  title="Desactivar proveedor"
                >
                  <i className="icon-x-circle sap-theme"></i>
                  Desactivar
                </button>
              )}

              {/* Quick Actions */}
              <div className="quick-actions sap-theme">
                {supplier.phone && (
                  <a
                    href={`tel:${supplier.phone}`}
                    className="quick-action-btn sap-theme"
                    title="Llamar"
                  >
                    <i className="icon-phone sap-theme"></i>
                  </a>
                )}

                {supplier.email && (
                  <a
                    href={`mailto:${supplier.email}`}
                    className="quick-action-btn sap-theme"
                    title="Enviar email"
                  >
                    <i className="icon-mail sap-theme"></i>
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
