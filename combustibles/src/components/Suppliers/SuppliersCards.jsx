// combustibles/src/components/Suppliers/SuppliersCards.jsx
// Componente de vista de tarjetas para proveedores usando el nuevo esquema mínimo
import React from 'react';

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

  const formatPaymentTerms = (terms) => {
    switch (terms) {
      case 'contado':
        return 'Contado';
      case '30dias':
        return '30 días';
      case '60dias':
        return '60 días';
      case '90dias':
        return '90 días';
      default:
        return terms || 'Sin definir';
    }
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
                <i className="icon-tag meta-icon sap-theme"></i>
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

            {/* Payment Terms */}
            {supplier.paymentTerms && (
              <div className="payment-terms sap-theme">
                <i className="icon-credit-card sap-theme"></i>
                <span>Términos: {formatPaymentTerms(supplier.paymentTerms)}</span>
              </div>
            )}

          </div>

          {/* Footer with Actions */}
          <div className="card-footer sap-theme">
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
