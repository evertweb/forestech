// combustibles/src/components/Suppliers/SuppliersMain.jsx
// Componente principal del módulo de proveedores adaptado al modelo de 10 campos
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useAuthStore } from '../../stores';
import FirebaseSuppliersService, {
  subscribeToSuppliers,
  deleteSupplier,
} from '../../services/FirebaseSuppliersService';
import { useFirebaseProgressContext } from '../../contexts/FirebaseProgressContext';
import SuppliersTable from './SuppliersTable';
import SuppliersCards from './SuppliersCards';
import SupplierModal from './SupplierModal';
import SuppliersStats from './SuppliersStats';
import SuppliersFilters from './SuppliersFilters';
import { PageLayout } from '../shared';
import './SuppliersMain-SAP.css';

const computeSuppliersStats = (suppliers) => {
  const stats = {
    total: suppliers.length,
    byStatus: { active: 0, inactive: 0, suspended: 0, other: 0 },
    byCategory: {},
    byType: {},
    byPaymentTerms: {},
  };

  suppliers.forEach((supplier) => {
    const status = supplier.status || 'other';
    if (stats.byStatus[status] !== undefined) {
      stats.byStatus[status] += 1;
    } else {
      stats.byStatus.other += 1;
    }

    const category = supplier.category || 'sin_categoria';
    stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;

    const type = supplier.type || 'sin_tipo';
    stats.byType[type] = (stats.byType[type] || 0) + 1;

    const payment = supplier.paymentTerms || 'undefined';
    stats.byPaymentTerms[payment] = (stats.byPaymentTerms[payment] || 0) + 1;
  });

  return stats;
};

const SuppliersMain = () => {
  const userProfile = useAuthStore((state) => state.userProfile);
  const { executeWithProgress } = useFirebaseProgressContext();

  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('cards');

  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPaymentTerms, setFilterPaymentTerms] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const suppliersServiceRef = useRef(null);

  const ensureSuppliersService = useCallback(() => {
    if (!suppliersServiceRef.current) {
      suppliersServiceRef.current = new FirebaseSuppliersService();
    }
    return suppliersServiceRef.current;
  }, []);

  useEffect(() => {
    let unsubscribe;

    const setupSubscription = () => {
      unsubscribe = subscribeToSuppliers((items) => {
        setSuppliers(items || []);
        setLoading(false);
      });
    };

    setupSubscription();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((supplier) => {
      const matchesSearch =
        !normalizedSearch ||
        supplier.name?.toLowerCase().includes(normalizedSearch) ||
        supplier.taxId?.toLowerCase().includes(normalizedSearch) ||
        supplier.contactPerson?.toLowerCase().includes(normalizedSearch) ||
        supplier.city?.toLowerCase().includes(normalizedSearch);

      const matchesStatus = filterStatus === 'all' || supplier.status === filterStatus;
      const matchesCategory = filterCategory === 'all' || supplier.category === filterCategory;
      const matchesPayment =
        filterPaymentTerms === 'all' || supplier.paymentTerms === filterPaymentTerms;

      return matchesSearch && matchesStatus && matchesCategory && matchesPayment;
    });
  }, [filterCategory, filterPaymentTerms, filterStatus, normalizedSearch, suppliers]);

  const handleAddSupplier = useCallback(() => {
    setEditingSupplier(null);
    setShowModal(true);
    setError(null);
  }, []);

  const handleEditSupplier = useCallback((supplier) => {
    setEditingSupplier(supplier);
    setShowModal(true);
    setError(null);
  }, []);

  const handleDeleteSupplier = useCallback(
    async (supplierId, supplierName) => {
      if (
        !window.confirm(
          `¿Estás seguro de que deseas desactivar el proveedor "${supplierName}"?\n\nEsta acción se puede revertir cambiando su estado a activo.`
        )
      ) {
        return;
      }

      try {
        setError(null);
        const progressDescription = `Eliminando proveedor ${supplierName}`;

        const result = await executeWithProgress(
          'deleteSupplier',
          progressDescription,
          () => deleteSupplier(supplierId, userProfile?.email),
          {
            supplierId,
            supplierName,
          }
        );

        if (!result.success) {
          setError(result.error || 'Error al desactivar proveedor');
        }
      } catch (operationError) {
        console.error('Error deleting supplier:', operationError);
        setError('Error inesperado al eliminar proveedor');
      }
    },
    [executeWithProgress, userProfile?.email]
  );

  const handleModalClose = useCallback(() => {
    setShowModal(false);
    setEditingSupplier(null);
    setError(null);
  }, []);

  const handleModalSuccess = useCallback(
    async (savedSupplier, metadata = {}) => {
      const normalizedSupplier =
        (savedSupplier && savedSupplier.id && savedSupplier) ||
        (savedSupplier?.data?.id && savedSupplier.data) ||
        (metadata?.rawResult?.data?.id && metadata.rawResult.data) ||
        (metadata?.rawResult?.data?.data?.id && metadata.rawResult.data.data) ||
        null;

      if (normalizedSupplier && normalizedSupplier.id) {
        setSuppliers((prevSuppliers) => {
          const index = prevSuppliers.findIndex((item) => item.id === normalizedSupplier.id);

          if (index !== -1) {
            const updatedSuppliers = [...prevSuppliers];
            updatedSuppliers[index] = { ...prevSuppliers[index], ...normalizedSupplier };
            return updatedSuppliers;
          }

          return [normalizedSupplier, ...prevSuppliers];
        });
      } else {
        try {
          const service = ensureSuppliersService();
          const refreshedSuppliers = await service.getSuppliers();
          if (Array.isArray(refreshedSuppliers)) {
            setSuppliers(refreshedSuppliers);
          }
        } catch (refreshError) {
          console.error('Error refreshing suppliers after modal success:', refreshError);
        }
      }

      setShowModal(false);
      setEditingSupplier(null);
      setError(null);
    },
    [ensureSuppliersService]
  );

  const clearFilters = useCallback(() => {
    setFilterStatus('all');
    setFilterCategory('all');
    setFilterPaymentTerms('all');
    setSearchTerm('');
    setError(null);
  }, []);

  const exportSuppliers = useCallback(() => {
    if (filteredSuppliers.length === 0) {
      setError('No hay proveedores para exportar');
      return;
    }

    try {
      setError(null);

      const dataToExport = filteredSuppliers.map((supplier) => ({
        Nombre: supplier.name || '',
        'NIT/Documento': supplier.taxId || '',
        Tipo: supplier.type || '',
        Categoría: supplier.category || '',
        'Persona de Contacto': supplier.contactPerson || '',
        Teléfono: supplier.phone || '',
        Email: supplier.email || '',
        Ciudad: supplier.city || '',
        Estado: supplier.status || '',
        'Términos de Pago': supplier.paymentTerms || '',
      }));

      const BOM = '\uFEFF';
      const csvContent =
        BOM +
        [
          Object.keys(dataToExport[0]).join(','),
          ...dataToExport.map((row) =>
            Object.values(row)
              .map((value) => `"${String(value || '').replace(/"/g, '""')}"`)
              .join(',')
          ),
        ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute(
        'download',
        `proveedores_forestech_${new Date().toISOString().split('T')[0]}.csv`
      );
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (exportError) {
      console.error('Error exporting suppliers:', exportError);
      setError('Error al exportar proveedores: ' + exportError.message);
    }
  }, [filteredSuppliers]);

  const headerActions = useMemo(
    () => (
      <div className="header-actions sap-theme">
        <button
          className="btn btn-primary sap-theme sap-button sap-button-primary"
          onClick={handleAddSupplier}
          title="Agregar nuevo proveedor"
        >
          <span>➕</span>
          <span>Agregar Proveedor</span>
        </button>

        <button
          className="btn btn-secondary sap-theme sap-button sap-button-secondary"
          onClick={exportSuppliers}
          disabled={filteredSuppliers.length === 0}
          title={
            filteredSuppliers.length === 0
              ? 'No hay proveedores para exportar'
              : 'Exportar proveedores a CSV'
          }
        >
          <span>📊</span>
          <span>Exportar ({filteredSuppliers.length})</span>
        </button>
      </div>
    ),
    [exportSuppliers, filteredSuppliers.length, handleAddSupplier]
  );

  const statsOverview = useMemo(
    () => computeSuppliersStats(suppliers),
    [suppliers]
  );

  const filtersComponent = useMemo(
    () => (
      <SuppliersFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        filterPaymentTerms={filterPaymentTerms}
        setFilterPaymentTerms={setFilterPaymentTerms}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onClearFilters={clearFilters}
        resultsCount={filteredSuppliers.length}
      />
    ),
    [
      clearFilters,
      filterCategory,
      filterPaymentTerms,
      filterStatus,
      filteredSuppliers.length,
      searchTerm,
      setFilterCategory,
      setFilterPaymentTerms,
      setFilterStatus,
      setSearchTerm,
      setViewMode,
      viewMode,
    ]
  );

  const handleDismissError = useCallback(() => {
    setError(null);
  }, []);

  const mainContent = useMemo(
    () => (
      <>
        {error && (
          <div className="alert alert-error sap-theme sap-message-error">
            <span>⚠️</span>
            <span className="sap-text">{error}</span>
            <button
              onClick={handleDismissError}
              className="alert-close sap-button"
              title="Cerrar alerta"
            >
              ✕
            </button>
          </div>
        )}

        {filteredSuppliers.length === 0 ? (
          <div className="empty-state sap-theme">
            <div className="empty-icon sap-theme">🏢</div>
            <h3 className="sap-title">
              {suppliers.length === 0
                ? 'No hay proveedores registrados'
                : 'No se encontraron proveedores'}
            </h3>
            <p className="sap-text">
              {suppliers.length === 0
                ? 'Comienza agregando tu primer proveedor para gestionar tu cadena de suministro.'
                : 'No se encontraron proveedores que coincidan con los filtros aplicados. Intenta ajustar los criterios de búsqueda.'}
            </p>
            {suppliers.length === 0 && (
              <button
                className="btn btn-primary sap-theme sap-button sap-button-primary sap-mt-lg"
                onClick={handleAddSupplier}
              >
                <span>➕</span>
                <span>Agregar Primer Proveedor</span>
              </button>
            )}
            {suppliers.length > 0 && (
              <button
                className="btn btn-secondary sap-theme sap-button sap-button-secondary sap-mt-lg"
                onClick={clearFilters}
              >
                <span>🔄</span>
                <span>Limpiar Filtros</span>
              </button>
            )}
          </div>
        ) : (
          <div className="suppliers-content sap-theme">
            {viewMode === 'cards' ? (
              <SuppliersCards
                suppliers={filteredSuppliers}
                onEdit={handleEditSupplier}
                onDelete={handleDeleteSupplier}
                hasEditPermission
                hasDeletePermission
              />
            ) : (
              <SuppliersTable
                suppliers={filteredSuppliers}
                onEdit={handleEditSupplier}
                onDelete={handleDeleteSupplier}
                hasEditPermission
                hasDeletePermission
              />
            )}
          </div>
        )}

        {showModal && (
          <SupplierModal
            supplier={editingSupplier}
            onClose={handleModalClose}
            onSuccess={handleModalSuccess}
            onError={setError}
          />
        )}
      </>
    ),
    [
      clearFilters,
      editingSupplier,
      error,
      filteredSuppliers,
      handleAddSupplier,
      handleDeleteSupplier,
      handleDismissError,
      handleEditSupplier,
      handleModalClose,
      handleModalSuccess,
      setError,
      showModal,
      suppliers.length,
      viewMode,
    ]
  );

  return (
    <PageLayout
      title="Gestión de Proveedores"
      subtitle="Administra tus proveedores estratégicos de combustibles"
      isLoading={loading}
      headerActions={headerActions}
      filters={filtersComponent}
      stats={<SuppliersStats stats={statsOverview} visibleCount={filteredSuppliers.length} />}
    >
      {mainContent}
    </PageLayout>
  );
};

export default SuppliersMain;
