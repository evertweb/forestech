// combustibles/src/components/Suppliers/SuppliersTable.jsx
// Vista en tabla para proveedores con el esquema simplificado de 10 campos
import React, { memo, useMemo, useState } from 'react';
import { UI_TOOLTIPS, UI_FORM_LABELS } from '../../constants';

const HEADERS = [
  { key: 'name', label: UI_FORM_LABELS.SUPPLIER, sortable: true },
  { key: 'taxId', label: 'NIT', sortable: true },
  { key: 'type', label: UI_FORM_LABELS.TYPE, sortable: true },
  { key: 'category', label: UI_FORM_LABELS.CATEGORY, sortable: true },
  { key: 'contactPerson', label: 'Contacto', sortable: true },
  { key: 'phone', label: 'Teléfono' },
  { key: 'email', label: 'Email' },
  { key: 'city', label: 'Ciudad', sortable: true },
  { key: 'paymentTerms', label: 'Términos de pago', sortable: true },
  { key: 'status', label: UI_FORM_LABELS.STATUS, sortable: true },
];

const SORT_LABELS = {
  name: 'Nombre',
  taxId: 'NIT',
  type: 'Tipo',
  category: 'Categoría',
  contactPerson: 'Contacto',
  phone: 'Teléfono',
  email: 'Email',
  city: 'Ciudad',
  paymentTerms: 'Términos de pago',
  status: 'Estado',
};

const normalize = (value) => {
  if (value === undefined || value === null) return '';
  if (typeof value === 'string') return value.toLowerCase();
  if (value instanceof Date) return value.getTime();
  return value;
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
      return terms || '-';
  }
};

const sortSuppliers = (suppliers, sortField, sortDirection) =>
  [...suppliers].sort((a, b) => {
    const aValue = normalize(a[sortField]);
    const bValue = normalize(b[sortField]);

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

const getStatusChip = (status) => {
  const baseClass = 'status-chip sap-theme';
  const label =
    status === 'active' ? 'Activo' : status === 'inactive' ? 'Inactivo' : 'Suspendido';

  let colorClass = 'status-default';
  if (status === 'active') colorClass = 'status-success';
  if (status === 'inactive') colorClass = 'status-error';
  if (status === 'suspended') colorClass = 'status-warning';

  return <span className={`${baseClass} ${colorClass}`}>{label}</span>;
};

const SuppliersTableComponent = ({
  suppliers = [],
  onEdit,
  onDelete,
  hasEditPermission,
  hasDeletePermission,
}) => {
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (!field) return;

    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedSuppliers = useMemo(
    () => sortSuppliers(suppliers, sortField, sortDirection),
    [suppliers, sortField, sortDirection]
  );

  return (
    <div className="suppliers-table-container sap-theme">
      <div className="table-wrapper sap-theme">
        <table className="suppliers-table sap-theme">
          <thead>
            <tr>
              {HEADERS.map(({ key, label, sortable }) => (
                <th
                  key={key}
                  className={`${sortable ? 'sortable' : ''} ${sortField === key ? 'active' : ''}`}
                  onClick={() => sortable && handleSort(key)}
                >
                  <span>{label}</span>
                  {sortable && (
                    <i
                      className={
                        sortField === key
                          ? sortDirection === 'asc'
                            ? 'icon-chevron-up'
                            : 'icon-chevron-down'
                          : 'icon-chevrons-up-down'
                      }
                    ></i>
                  )}
                </th>
              ))}
              <th className="actions-column sap-theme">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {sortedSuppliers.map((supplier) => (
              <tr key={supplier.id}>
                <td className="supplier-name sap-theme">
                  <div className="supplier-name-main sap-theme">{supplier.name || '-'}</div>
                  {supplier.taxId && <div className="supplier-tax-id sap-theme">NIT: {supplier.taxId}</div>}
                </td>
                <td>{supplier.taxId || '-'}</td>
                <td>{supplier.type || '-'}</td>
                <td>{supplier.category || '-'}</td>
                <td>{supplier.contactPerson || '-'}</td>
                <td>
                  {supplier.phone ? (
                    <a href={`tel:${supplier.phone}`} className="contact-link sap-theme">
                      {supplier.phone}
                    </a>
                  ) : (
                    '-'
                  )}
                </td>
                <td>
                  {supplier.email ? (
                    <a href={`mailto:${supplier.email}`} className="contact-link sap-theme">
                      {supplier.email}
                    </a>
                  ) : (
                    '-'
                  )}
                </td>
                <td>{supplier.city || '-'}</td>
                <td>{formatPaymentTerms(supplier.paymentTerms)}</td>
                <td>{getStatusChip(supplier.status)}</td>
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
                        title="Desactivar proveedor"
                      >
                        <i className="icon-x-circle sap-theme"></i>
                      </button>
                    )}
                    {(supplier.phone || supplier.email) && (
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
                    )}
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

      <div className="table-footer sap-theme">
        <div className="table-info sap-theme">
          <span>
            Mostrando {sortedSuppliers.length} proveedor{sortedSuppliers.length !== 1 ? 'es' : ''}
          </span>
        </div>
        <div className="table-actions sap-theme">
          <span className="sort-info sap-theme">
            Ordenado por {SORT_LABELS[sortField] || sortField} (
            {sortDirection === 'asc' ? 'Ascendente' : 'Descendente'})
          </span>
        </div>
      </div>
    </div>
  );
};

const propsAreEqual = (prevProps, nextProps) =>
  prevProps.suppliers === nextProps.suppliers &&
  prevProps.onEdit === nextProps.onEdit &&
  prevProps.onDelete === nextProps.onDelete &&
  prevProps.hasEditPermission === nextProps.hasEditPermission &&
  prevProps.hasDeletePermission === nextProps.hasDeletePermission;

const SuppliersTable = memo(SuppliersTableComponent, propsAreEqual);

export default SuppliersTable;
