// combustibles/src/components/Suppliers/SuppliersMain.jsx
// Componente principal del módulo de proveedores
//
// MIGRADO A ZUSTAND (Fase 2 - Sprint 1)
// - Usa useAuthStore para user, userProfile, hasPermission
// ⚠️ PERMISOS DESHABILITADOS - Todos los usuarios tienen acceso total
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuthStore } from '../../stores';
import {
  subscribeToSuppliers,
  deleteSupplier,
  getSuppliersStats,
} from '../../services/FirebaseSuppliersService';
import { useFirebaseProgressContext } from '../../contexts/FirebaseProgressContext';
import SuppliersTable from './SuppliersTable';
import SuppliersCards from './SuppliersCards';
import SupplierModal from './SupplierModal';
import SuppliersStats from './SuppliersStats';
import SuppliersFilters from './SuppliersFilters';
import { PageLayout } from '../shared';
import './SuppliersMain-SAP.css';

const SuppliersMain = () => {
  // 🔐 Zustand Store - Auth (selectores individuales para evitar loops)
  // ⚠️ PERMISOS DESHABILITADOS - Ya no necesitamos hasPermission
  const userProfile = useAuthStore(state => state.userProfile);
  // const user = useAuthStore(state => state.user); // No usado actualmente

  // Hook para progreso transparente de Firebase
  const { executeWithProgress } = useFirebaseProgressContext();

  const [suppliers, setSuppliers] = useState([]);
  const [suppliersStats, setSuppliersStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  // Filter states
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'active' | 'inactive' | 'preferred'
  const [filterCategory, setFilterCategory] = useState('all'); // 'all' | 'combustibles' | 'lubricantes' | 'aditivos'
  const [filterFuelType, setFilterFuelType] = useState('all'); // 'all' | specific fuel type
  const [searchTerm, setSearchTerm] = useState('');

  // Real-time subscription
  useEffect(() => {
    let unsubscribe = null;

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

  // Load stats
  useEffect(() => {
    const loadStats = async () => {
      const result = await getSuppliersStats();
      if (result.success) {
        setSuppliersStats(result.data);
      }
    };

    if (suppliers.length > 0) {
      loadStats();
    }
  }, [suppliers]);

  // Filter suppliers
  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((supplier) => {
      const matchesSearch =
        !normalizedSearch ||
        supplier.name?.toLowerCase().includes(normalizedSearch) ||
        supplier.taxId?.toLowerCase().includes(normalizedSearch) ||
        supplier.contactPerson?.toLowerCase().includes(normalizedSearch) ||
        supplier.city?.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        filterStatus === 'all' ||
        (filterStatus === 'preferred' ? supplier.isPreferred : supplier.status === filterStatus);

      const matchesCategory = filterCategory === 'all' || supplier.category === filterCategory;

      const matchesFuelType =
        filterFuelType === 'all' ||
        (supplier.fuelTypes && supplier.fuelTypes.includes(filterFuelType));

      return matchesSearch && matchesStatus && matchesCategory && matchesFuelType;
    });
  }, [filterCategory, filterFuelType, filterStatus, normalizedSearch, suppliers]);

  const handleAddSupplier = useCallback(() => {
    // ⚠️ PERMISOS DESHABILITADOS - Todos tienen acceso
    setEditingSupplier(null);
    setShowModal(true);
    setError(null); // Clear any existing errors
  }, []);

  const handleEditSupplier = useCallback((supplier) => {
    // ⚠️ PERMISOS DESHABILITADOS - Todos tienen acceso
    setEditingSupplier(supplier);
    setShowModal(true);
    setError(null); // Clear any existing errors
  }, []);

  const handleDeleteSupplier = useCallback(async (supplierId, supplierName) => {
    // ⚠️ PERMISOS DESHABILITADOS - Todos tienen acceso

    if (
      !window.confirm(
        `¿Estás seguro de que deseas desactivar el proveedor "${supplierName}"?\n\nEsta acción se puede revertir cambiando su estado a activo.`
      )
    ) {
      return;
    }

    try {
      setError(null); // Clear any existing errors

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

      if (result.success) {
        // Show success message briefly
        setError(null);
        console.log('✅ Proveedor eliminado exitosamente');
        // The real-time subscription will update the list automatically
      } else {
        setError(result.error || 'Error al desactivar proveedor');
      }
    } catch (error) {
      console.error('Error deleting supplier:', error);
      setError('Error inesperado al eliminar proveedor');
    }
  }, [executeWithProgress, userProfile?.email]);

  const handleModalClose = useCallback(() => {
    setShowModal(false);
    setEditingSupplier(null);
    setError(null); // Clear any existing errors
  }, []);

  const handleModalSuccess = useCallback(() => {
    setShowModal(false);
    setEditingSupplier(null);
    setError(null); // Clear any existing errors
    // The real-time subscription will update the list automatically
  }, []);

  const clearFilters = useCallback(() => {
    setFilterStatus('all');
    setFilterCategory('all');
    setFilterFuelType('all');
    setSearchTerm('');
    setError(null); // Clear any existing errors
  }, []);

  const exportSuppliers = useCallback(() => {
    // ⚠️ PERMISOS DESHABILITADOS - Todos tienen acceso

    if (filteredSuppliers.length === 0) {
      setError('No hay proveedores para exportar');
      return;
    }

    try {
      setError(null); // Clear any existing errors

      const dataToExport = filteredSuppliers.map((supplier) => ({
        Nombre: supplier.name || '',
        'NIT/Documento': supplier.taxId || '',
        Tipo: supplier.type || '',
        Categoría: supplier.category || '',
        'Persona de Contacto': supplier.contactPerson || '',
        Teléfono: supplier.phone || '',
        Email: supplier.email || '',
        Ciudad: supplier.city || '',
        Combustibles: Array.isArray(supplier.fuelTypes) ? supplier.fuelTypes.join(', ') : '',
        Rating: supplier.rating || 0,
        Estado: supplier.status || '',
        Preferido: supplier.isPreferred ? 'Sí' : 'No',
        'Fecha Creación': supplier.createdAt?.toDate?.()?.toLocaleDateString('es-CO') || 'N/A',
      }));

      // Create CSV content with BOM for proper encoding
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

      // Show success message
      console.log(`✅ Exportados ${filteredSuppliers.length} proveedores exitosamente`);
    } catch (error) {
      console.error('Error exporting suppliers:', error);
      setError('Error al exportar proveedores: ' + error.message);
    }
  }, [filteredSuppliers]);

  // Componentes para PageLayout
  const headerActions = useMemo(() => (
    <div className="header-actions sap-theme">
      {/* ⚠️ PERMISOS DESHABILITADOS - Todos tienen acceso */}
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
  ), [
    exportSuppliers,
    filteredSuppliers.length,
    handleAddSupplier,
  ]);

  const statsComponent = useMemo(() => {
    if (!suppliersStats) {
      return null;
    }

    return (
      <SuppliersStats
        stats={suppliersStats}
        suppliersCount={filteredSuppliers.length}
        totalSuppliers={suppliers.length}
      />
    );
  }, [filteredSuppliers.length, suppliers.length, suppliersStats]);

  const filtersComponent = useMemo(() => (
    <SuppliersFilters
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      filterStatus={filterStatus}
      setFilterStatus={setFilterStatus}
      filterCategory={filterCategory}
      setFilterCategory={setFilterCategory}
      filterFuelType={filterFuelType}
      setFilterFuelType={setFilterFuelType}
      viewMode={viewMode}
      setViewMode={setViewMode}
      onClearFilters={clearFilters}
      resultsCount={filteredSuppliers.length}
    />
  ), [
    clearFilters,
    filterCategory,
    filterFuelType,
    filterStatus,
    filteredSuppliers.length,
    searchTerm,
    setFilterCategory,
    setFilterFuelType,
    setFilterStatus,
    setSearchTerm,
    setViewMode,
    viewMode,
  ]);

  const handleDismissError = useCallback(() => {
    setError(null);
  }, []);

  const mainContent = useMemo(() => (
    <>
      {/* Error Alert */}
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

      {/* Content */}
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
              ? 'Comienza agregando tu primer proveedor de combustibles para gestionar tu cadena de suministro.'
              : 'No se encontraron proveedores que coincidan con los filtros aplicados. Intenta ajustar los criterios de búsqueda.'}
          </p>
          {/* ⚠️ PERMISOS DESHABILITADOS - Todos tienen acceso */}
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
          {/* ⚠️ PERMISOS DESHABILITADOS - Todos tienen acceso de edición/eliminación */}
          {viewMode === 'cards' ? (
            <SuppliersCards
              suppliers={filteredSuppliers}
              onEdit={handleEditSupplier}
              onDelete={handleDeleteSupplier}
              hasEditPermission={true}
              hasDeletePermission={true}
            />
          ) : (
            <SuppliersTable
              suppliers={filteredSuppliers}
              onEdit={handleEditSupplier}
              onDelete={handleDeleteSupplier}
              hasEditPermission={true}
              hasDeletePermission={true}
            />
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <SupplierModal
          supplier={editingSupplier}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
          onError={setError}
        />
      )}
    </>
  ), [
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
  ]);

  return (
    <PageLayout
      title="Gestión de Proveedores"
      subtitle="Administra los proveedores de combustibles y materiales"
      actions={headerActions}
      stats={statsComponent}
      filters={filtersComponent}
      loading={loading}
    >
      {mainContent}
    </PageLayout>
  );
};

export default SuppliersMain;
