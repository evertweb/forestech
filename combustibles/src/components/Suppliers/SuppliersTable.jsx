// combustibles/src/components/Suppliers/SuppliersTable.jsx
// Componente de vista de tabla para proveedores
import React, { useState, memo } from 'react';
import { formatCurrency } from '../../utils/calculations';
import { FUEL_TYPES } from '../../constants/combustibleTypes';
import { UI_ACTIONS, UI_TOOLTIPS, UI_FORM_LABELS } from '../../constants';

const SuppliersTableComponent = ({
  suppliers,
  onEdit,
  onDelete,
  hasEditPermission,
  hasDeletePermission,
}) => {
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  console.log('🤝 SuppliersTable render', {
    suppliersCount: suppliers?.length || 0,
    hasEditPermission,
    hasDeletePermission,
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedSuppliers = [...suppliers].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    // Handle special cases
    switch (sortField) {
      case 'rating':
        aValue = aValue || 0;
        bValue = bValue || 0;
        break;
      case 'totalOrders':
      case 'totalPurchased':
        aValue = aValue || 0;
        bValue = bValue || 0;
        break;
      case 'createdAt':
      case 'lastOrderDate':
        aValue = aValue ? (aValue.toDate ? aValue.toDate() : new Date(aValue)) : new Date(0);
        bValue = bValue ? (bValue.toDate ? bValue.toDate() : new Date(bValue)) : new Date(0);
        break;
      default:
        aValue = (aValue || '').toString().toLowerCase();
        bValue = (bValue || '').toString().toLowerCase();
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

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

  const formatDate = (date) => {
    if (!date) return '-';
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
      return <span className="no-data sap-theme">-</span>;
    }

    return (
      <div className="fuel-types-cell sap-theme">
        {fuelTypes.slice(0, 2).map((fuelType) => (
          <span key={fuelType} className="fuel-badge-sm sap-theme">
            {FUEL_TYPES[fuelType] || fuelType}
          </span>
        ))}
        {fuelTypes.length > 2 && (
          <span
            className="fuel-badge-sm more sap-theme"
            title={fuelTypes
              .slice(2)
              .map((ft) => FUEL_TYPES[ft] || ft)
              .join(', ')}
          >
            +{fuelTypes.length - 2}
          </span>
        )}
      </div>
    );
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return 'icon-chevrons-up-down';
    return sortDirection === 'asc' ? 'icon-chevron-up' : 'icon-chevron-down';
  };

  return (
    <div className="suppliers-table-container sap-theme">
      <div className="table-wrapper sap-theme">
        <table className="suppliers-table sap-theme">
          <thead>
            <tr>
              <th
                className={`sortable ${sortField === 'name' ? 'active' : ''}`}
                onClick={() => handleSort('name')}
              >
                <span>{UI_FORM_LABELS.SUPPLIER}</span>
                <i className={getSortIcon('name')}></i>
              </th>

              <th
                className={`sortable ${sortField === 'status' ? 'active' : ''}`}
                onClick={() => handleSort('status')}
              >
                <span>{UI_FORM_LABELS.STATUS}</span>
                <i className={getSortIcon('status')}></i>
              </th>

              <th
                className={`sortable ${sortField === 'category' ? 'active' : ''}`}
                onClick={() => handleSort('category')}
              >
                <span>{UI_FORM_LABELS.CATEGORY}</span>
                <i className={getSortIcon('category')}></i>
              </th>

              <th>
                <span>Combustibles</span>
              </th>

              <th>
                <span>Contacto</span>
              </th>

              <th
                className={`sortable ${sortField === 'rating' ? 'active' : ''}`}
                onClick={() => handleSort('rating')}
              >
                <span>Rating</span>
                <i className={getSortIcon('rating')}></i>
              </th>

              <th
                className={`sortable ${sortField === 'totalOrders' ? 'active' : ''}`}
                onClick={() => handleSort('totalOrders')}
              >
                <span>Órdenes</span>
                <i className={getSortIcon('totalOrders')}></i>
              </th>

              <th
                className={`sortable ${sortField === 'totalPurchased' ? 'active' : ''}`}
                onClick={() => handleSort('totalPurchased')}
              >
                <span>Total Comprado</span>
                <i className={getSortIcon('totalPurchased')}></i>
              </th>

              <th
                className={`sortable ${sortField === 'createdAt' ? 'active' : ''}`}
                onClick={() => handleSort('createdAt')}
              >
                <span>Creado</span>
                <i className={getSortIcon('createdAt')}></i>
              </th>

              <th className="actions-column sap-theme">
                <span>Acciones</span>
              </th>
            </tr>
          </thead>

          <tbody>
            {sortedSuppliers.map((supplier) => (
              <tr key={supplier.id} className={`supplier-row ${supplier.status}`}>
                {/* Supplier Info */}
                <td className="supplier-info-cell sap-theme">
                  <div className="supplier-main-info sap-theme">
                    <div className="supplier-name sap-theme">
                      {supplier.name}
                      {supplier.isPreferred && (
                        <span className="preferred-badge sap-theme" title="Proveedor Preferido">
                          <i className="icon-star sap-theme"></i>
                        </span>
                      )}
                    </div>
                    {supplier.taxId && (
                      <div className="supplier-tax-id sap-theme">NIT: {supplier.taxId}</div>
                    )}
                    {supplier.type && (
                      <div className="supplier-type sap-theme">
                        {supplier.type.charAt(0).toUpperCase() + supplier.type.slice(1)}
                      </div>
                    )}
                  </div>
                </td>

                {/* Status */}
                <td className="status-cell sap-theme">
                  <div className="status-display sap-theme">
                    <span
                      className="status-dot sap-theme"
                      style={{ backgroundColor: getStatusColor(supplier.status) }}
                    ></span>
                    <span className="status-label sap-theme">
                      {getStatusLabel(supplier.status)}
                    </span>
                  </div>
                </td>

                {/* Category */}
                <td className="category-cell sap-theme">
                  <span className="category-label sap-theme">
                    {supplier.category?.charAt(0).toUpperCase() + supplier.category?.slice(1) ||
                      '-'}
                  </span>
                </td>

                {/* Fuel Types */}
                <td className="fuel-types-cell sap-theme">{renderFuelTypes(supplier.fuelTypes)}</td>

                {/* Contact Info */}
                <td className="contact-cell sap-theme">
                  <div className="contact-info sap-theme">
                    {supplier.contactPerson && (
                      <div className="contact-person sap-theme">
                        <i className="icon-user sap-theme"></i>
                        <span>{supplier.contactPerson}</span>
                      </div>
                    )}
                    {supplier.phone && (
                      <div className="contact-item sap-theme">
                        <i className="icon-phone sap-theme"></i>
                        <a href={`tel:${supplier.phone}`}>{supplier.phone}</a>
                      </div>
                    )}
                    {supplier.email && (
                      <div className="contact-item sap-theme">
                        <i className="icon-mail sap-theme"></i>
                        <a href={`mailto:${supplier.email}`}>{supplier.email}</a>
                      </div>
                    )}
                    {supplier.city && (
                      <div className="contact-item sap-theme">
                        <i className="icon-map-pin sap-theme"></i>
                        <span>{supplier.city}</span>
                      </div>
                    )}
                  </div>
                </td>

                {/* Rating */}
                <td className="rating-cell sap-theme">
                  <div className="rating-display sap-theme">
                    {renderRating(supplier.rating || 0)}
                    <span className="rating-value sap-theme">
                      {(supplier.rating || 0).toFixed(1)}
                    </span>
                  </div>
                </td>

                {/* Total Orders */}
                <td className="orders-cell sap-theme">
                  <span className="orders-count sap-theme">{supplier.totalOrders || 0}</span>
                </td>

                {/* Total Purchased */}
                <td className="purchased-cell sap-theme">
                  <span className="purchased-amount sap-theme">
                    {formatCurrency(supplier.totalPurchased || 0)}
                  </span>
                </td>

                {/* Created Date */}
                <td className="date-cell sap-theme">
                  <span className="date-value sap-theme">{formatDate(supplier.createdAt)}</span>
                </td>

                {/* Actions */}
                <td className="actions-cell sap-theme">
                  <div className="action-buttons sap-theme">
                    {hasEditPermission && (
                      <button
                        className="btn btn-sm btn-secondary sap-theme"
                        onClick={() => onEdit(supplier)}
                        title={UI_TOOLTIPS.EDIT}
                      >
                        <i className="icon-edit sap-theme"></i>
                      </button>
                    )}

                    {hasDeletePermission && supplier.status === 'active' && (
                      <button
                        className="btn btn-sm btn-danger sap-theme"
                        onClick={() => onDelete(supplier.id, supplier.name)}
                        title={UI_TOOLTIPS.DELETE}
                      >
                        <i className="icon-x-circle sap-theme"></i>
                      </button>
                    )}

                    {/* Quick contact actions */}
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sortedSuppliers.length === 0 && (
          <div className="table-empty-state sap-theme">
            <i className="icon-truck sap-theme"></i>
            <p>No hay proveedores para mostrar</p>
          </div>
        )}
      </div>

      {/* Table Footer */}
      <div className="table-footer sap-theme">
        <div className="table-info sap-theme">
          <span>
            Mostrando {sortedSuppliers.length} proveedor{sortedSuppliers.length !== 1 ? 'es' : ''}
          </span>
        </div>

        <div className="table-actions sap-theme">
          <span className="sort-info sap-theme">
            Ordenado por:{' '}
            {sortField === 'name'
              ? 'Nombre'
              : sortField === 'status'
                ? 'Estado'
                : sortField === 'category'
                  ? 'Categoría'
                  : sortField === 'rating'
                    ? 'Rating'
                    : sortField === 'totalOrders'
                      ? 'Órdenes'
                      : sortField === 'totalPurchased'
                        ? 'Total Comprado'
                        : sortField === 'createdAt'
                          ? 'Fecha de Creación'
                          : sortField}{' '}
            ({sortDirection === 'asc' ? 'Ascendente' : 'Descendente'})
          </span>
        </div>
      </div>
    </div>
  );
};

const propsAreEqual = (prevProps, nextProps) => {
  return (
    prevProps.suppliers === nextProps.suppliers &&
    prevProps.onEdit === nextProps.onEdit &&
    prevProps.onDelete === nextProps.onDelete &&
    prevProps.hasEditPermission === nextProps.hasEditPermission &&
    prevProps.hasDeletePermission === nextProps.hasDeletePermission
  );
};

const SuppliersTable = memo(SuppliersTableComponent, propsAreEqual);

export default SuppliersTable;
