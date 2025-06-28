// combustibles/src/components/Suppliers/SuppliersTable.jsx
// Componente de vista de tabla para proveedores
import React, { useState } from 'react';
import { formatCurrency } from '../../utils/calculations';
import { FUEL_TYPES } from '../../constants/combustibleTypes';

const SuppliersTable = ({ 
  suppliers, 
  onEdit, 
  onDelete, 
  hasEditPermission, 
  hasDeletePermission 
}) => {
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

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

  const formatDate = (date) => {
    if (!date) return '-';
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
      return <span className="no-data">-</span>;
    }

    return (
      <div className="fuel-types-cell">
        {fuelTypes.slice(0, 2).map(fuelType => (
          <span key={fuelType} className="fuel-badge-sm">
            {FUEL_TYPES[fuelType] || fuelType}
          </span>
        ))}
        {fuelTypes.length > 2 && (
          <span className="fuel-badge-sm more" title={fuelTypes.slice(2).map(ft => FUEL_TYPES[ft] || ft).join(', ')}>
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
    <div className="suppliers-table-container">
      <div className="table-wrapper">
        <table className="suppliers-table">
          <thead>
            <tr>
              <th 
                className={`sortable ${sortField === 'name' ? 'active' : ''}`}
                onClick={() => handleSort('name')}
              >
                <span>Proveedor</span>
                <i className={getSortIcon('name')}></i>
              </th>
              
              <th 
                className={`sortable ${sortField === 'status' ? 'active' : ''}`}
                onClick={() => handleSort('status')}
              >
                <span>Estado</span>
                <i className={getSortIcon('status')}></i>
              </th>
              
              <th 
                className={`sortable ${sortField === 'category' ? 'active' : ''}`}
                onClick={() => handleSort('category')}
              >
                <span>Categoría</span>
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
              
              <th className="actions-column">
                <span>Acciones</span>
              </th>
            </tr>
          </thead>
          
          <tbody>
            {sortedSuppliers.map(supplier => (
              <tr key={supplier.id} className={`supplier-row ${supplier.status}`}>
                {/* Supplier Info */}
                <td className="supplier-info-cell">
                  <div className="supplier-main-info">
                    <div className="supplier-name">
                      {supplier.name}
                      {supplier.isPreferred && (
                        <span className="preferred-badge" title="Proveedor Preferido">
                          <i className="icon-star"></i>
                        </span>
                      )}
                    </div>
                    {supplier.taxId && (
                      <div className="supplier-tax-id">
                        NIT: {supplier.taxId}
                      </div>
                    )}
                    {supplier.type && (
                      <div className="supplier-type">
                        {supplier.type.charAt(0).toUpperCase() + supplier.type.slice(1)}
                      </div>
                    )}
                  </div>
                </td>

                {/* Status */}
                <td className="status-cell">
                  <div className="status-display">
                    <span 
                      className="status-dot"
                      style={{ backgroundColor: getStatusColor(supplier.status) }}
                    ></span>
                    <span className="status-label">
                      {getStatusLabel(supplier.status)}
                    </span>
                  </div>
                </td>

                {/* Category */}
                <td className="category-cell">
                  <span className="category-label">
                    {supplier.category?.charAt(0).toUpperCase() + supplier.category?.slice(1) || '-'}
                  </span>
                </td>

                {/* Fuel Types */}
                <td className="fuel-types-cell">
                  {renderFuelTypes(supplier.fuelTypes)}
                </td>

                {/* Contact Info */}
                <td className="contact-cell">
                  <div className="contact-info">
                    {supplier.contactPerson && (
                      <div className="contact-person">
                        <i className="icon-user"></i>
                        <span>{supplier.contactPerson}</span>
                      </div>
                    )}
                    {supplier.phone && (
                      <div className="contact-item">
                        <i className="icon-phone"></i>
                        <a href={`tel:${supplier.phone}`}>{supplier.phone}</a>
                      </div>
                    )}
                    {supplier.email && (
                      <div className="contact-item">
                        <i className="icon-mail"></i>
                        <a href={`mailto:${supplier.email}`}>{supplier.email}</a>
                      </div>
                    )}
                    {supplier.city && (
                      <div className="contact-item">
                        <i className="icon-map-pin"></i>
                        <span>{supplier.city}</span>
                      </div>
                    )}
                  </div>
                </td>

                {/* Rating */}
                <td className="rating-cell">
                  <div className="rating-display">
                    {renderRating(supplier.rating || 0)}
                    <span className="rating-value">
                      {(supplier.rating || 0).toFixed(1)}
                    </span>
                  </div>
                </td>

                {/* Total Orders */}
                <td className="orders-cell">
                  <span className="orders-count">
                    {supplier.totalOrders || 0}
                  </span>
                </td>

                {/* Total Purchased */}
                <td className="purchased-cell">
                  <span className="purchased-amount">
                    {formatCurrency(supplier.totalPurchased || 0)}
                  </span>
                </td>

                {/* Created Date */}
                <td className="date-cell">
                  <span className="date-value">
                    {formatDate(supplier.createdAt)}
                  </span>
                </td>

                {/* Actions */}
                <td className="actions-cell">
                  <div className="action-buttons">
                    {hasEditPermission && (
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => onEdit(supplier)}
                        title="Editar proveedor"
                      >
                        <i className="icon-edit"></i>
                      </button>
                    )}

                    {hasDeletePermission && supplier.status === 'active' && (
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => onDelete(supplier.id, supplier.name)}
                        title="Desactivar proveedor"
                      >
                        <i className="icon-x-circle"></i>
                      </button>
                    )}

                    {/* Quick contact actions */}
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sortedSuppliers.length === 0 && (
          <div className="table-empty-state">
            <i className="icon-truck"></i>
            <p>No hay proveedores para mostrar</p>
          </div>
        )}
      </div>

      {/* Table Footer */}
      <div className="table-footer">
        <div className="table-info">
          <span>
            Mostrando {sortedSuppliers.length} proveedor{sortedSuppliers.length !== 1 ? 'es' : ''}
          </span>
        </div>
        
        <div className="table-actions">
          <span className="sort-info">
            Ordenado por: {sortField === 'name' ? 'Nombre' :
                         sortField === 'status' ? 'Estado' :
                         sortField === 'category' ? 'Categoría' :
                         sortField === 'rating' ? 'Rating' :
                         sortField === 'totalOrders' ? 'Órdenes' :
                         sortField === 'totalPurchased' ? 'Total Comprado' :
                         sortField === 'createdAt' ? 'Fecha de Creación' :
                         sortField} ({sortDirection === 'asc' ? 'Ascendente' : 'Descendente'})
          </span>
        </div>
      </div>
    </div>
  );
};

export default SuppliersTable;