// combustibles/src/components/Suppliers/SuppliersMain.jsx
// Componente principal del módulo de proveedores
import React, { useState, useEffect } from 'react';
import { useCombustibles } from '../../contexts/CombustiblesContext';
import { 
  subscribeToSuppliers, 
  deleteSupplier,
  getSuppliersStats 
} from '../../services/suppliersService';
import { updateUserPermissions } from '../../firebase/userService';
import SuppliersTable from './SuppliersTable';
import SuppliersCards from './SuppliersCards';
import SupplierModal from './SupplierModal';
import SuppliersStats from './SuppliersStats';
import SuppliersFilters from './SuppliersFilters';
import './SuppliersMain-SAP.css';

const SuppliersMain = () => {
  const { hasPermission, userProfile, user } = useCombustibles();
  
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
  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = !searchTerm || 
      supplier.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.taxId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.city?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'preferred' ? supplier.isPreferred : supplier.status === filterStatus);

    const matchesCategory = filterCategory === 'all' || supplier.category === filterCategory;

    const matchesFuelType = filterFuelType === 'all' || 
      (supplier.fuelTypes && supplier.fuelTypes.includes(filterFuelType));

    return matchesSearch && matchesStatus && matchesCategory && matchesFuelType;
  });

  const handleAddSupplier = () => {
    if (!hasPermission('canManageSuppliers')) {
      setError('No tienes permisos para agregar proveedores');
      return;
    }
    setEditingSupplier(null);
    setShowModal(true);
    setError(null); // Clear any existing errors
  };

  const handleEditSupplier = (supplier) => {
    if (!hasPermission('canManageSuppliers')) {
      setError('No tienes permisos para editar proveedores');
      return;
    }
    setEditingSupplier(supplier);
    setShowModal(true);
    setError(null); // Clear any existing errors
  };

  const handleDeleteSupplier = async (supplierId, supplierName) => {
    if (!hasPermission('canManageSuppliers')) {
      setError('No tienes permisos para eliminar proveedores');
      return;
    }

    if (!window.confirm(`¿Estás seguro de que deseas desactivar el proveedor "${supplierName}"?\n\nEsta acción se puede revertir cambiando su estado a activo.`)) {
      return;
    }

    try {
      setError(null); // Clear any existing errors
      const result = await deleteSupplier(supplierId, userProfile?.email);
      if (result.success) {
        // Show success message briefly
        setError(null);
        // The real-time subscription will update the list automatically
      } else {
        setError(result.error || 'Error al desactivar proveedor');
      }
    } catch (error) {
      console.error('Error deleting supplier:', error);
      setError('Error inesperado al eliminar proveedor');
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingSupplier(null);
    setError(null); // Clear any existing errors
  };

  const handleModalSuccess = () => {
    setShowModal(false);
    setEditingSupplier(null);
    setError(null); // Clear any existing errors
    // The real-time subscription will update the list automatically
  };

  const clearFilters = () => {
    setFilterStatus('all');
    setFilterCategory('all');
    setFilterFuelType('all');
    setSearchTerm('');
    setError(null); // Clear any existing errors
  };

  const exportSuppliers = () => {
    if (!hasPermission('canExportReports')) {
      setError('No tienes permisos para exportar datos');
      return;
    }

    if (filteredSuppliers.length === 0) {
      setError('No hay proveedores para exportar');
      return;
    }

    try {
      setError(null); // Clear any existing errors
      
      const dataToExport = filteredSuppliers.map(supplier => ({
        'Nombre': supplier.name || '',
        'NIT/Documento': supplier.taxId || '',
        'Tipo': supplier.type || '',
        'Categoría': supplier.category || '',
        'Persona de Contacto': supplier.contactPerson || '',
        'Teléfono': supplier.phone || '',
        'Email': supplier.email || '',
        'Ciudad': supplier.city || '',
        'Combustibles': Array.isArray(supplier.fuelTypes) ? supplier.fuelTypes.join(', ') : '',
        'Rating': supplier.rating || 0,
        'Estado': supplier.status || '',
        'Preferido': supplier.isPreferred ? 'Sí' : 'No',
        'Fecha Creación': supplier.createdAt?.toDate?.()?.toLocaleDateString('es-CO') || 'N/A'
      }));

      // Create CSV content with BOM for proper encoding
      const BOM = '\uFEFF';
      const csvContent = BOM + [
        Object.keys(dataToExport[0]).join(','),
        ...dataToExport.map(row => 
          Object.values(row).map(value => 
            `"${String(value || '').replace(/"/g, '""')}"`
          ).join(',')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `proveedores_forestech_${new Date().toISOString().split('T')[0]}.csv`);
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
  };

  // Función temporal para actualizar permisos del usuario actual
  const upgradeUserPermissions = async () => {
    if (!user?.uid) {
      setError('No hay usuario logueado');
      return;
    }

    try {
      const result = await updateUserPermissions(user.uid, 'admin');
      if (result.success) {
        setError('Permisos actualizados. Recarga la página para ver los cambios.');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setError('Error actualizando permisos: ' + result.error);
      }
    } catch (error) {
      setError('Error inesperado al actualizar permisos');
      console.error('Error upgrading permissions:', error);
    }
  };

  if (loading) {
    return (
      <div className="suppliers-main sap-theme">
        <div className="loading-container sap-theme">
          <div className="loading-spinner sap-theme"></div>
          <p className="sap-text">Cargando proveedores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="suppliers-main sap-theme">
      {/* Header */}
      <div className="suppliers-header sap-theme">
        <div className="header-content sap-theme">
          <h1 className="sap-title">Gestión de Proveedores</h1>
          <p className="header-subtitle sap-theme sap-subtitle">
            Administra los proveedores de combustibles y materiales
          </p>
        </div>
        
        <div className="header-actions sap-theme">
          {/* Botón temporal para desarrollo - actualizar permisos */}
          {(!hasPermission('canManageSuppliers') || !hasPermission('canExportReports')) && (
            <button 
              className="btn btn-warning sap-theme"
              onClick={upgradeUserPermissions}
              title="Actualizar permisos de usuario (solo desarrollo)"
              style={{ backgroundColor: '#ff9800', borderColor: '#ff9800' }}
            >
              <span>🔑</span>
              <span>Obtener Permisos</span>
            </button>
          )}
          
          {hasPermission('canManageSuppliers') && (
            <button 
              className="btn btn-primary sap-theme sap-button sap-button-primary"
              onClick={handleAddSupplier}
              title="Agregar nuevo proveedor"
            >
              <span>➕</span>
              <span>Agregar Proveedor</span>
            </button>
          )}
          
          {hasPermission('canExportReports') && (
            <button 
              className="btn btn-secondary sap-theme sap-button sap-button-secondary"
              onClick={exportSuppliers}
              disabled={filteredSuppliers.length === 0}
              title={filteredSuppliers.length === 0 ? 'No hay proveedores para exportar' : 'Exportar proveedores a CSV'}
            >
              <span>📊</span>
              <span>Exportar ({filteredSuppliers.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-error sap-theme sap-message-error">
          <span>⚠️</span>
          <span className="sap-text">{error}</span>
          <button 
            onClick={() => setError(null)} 
            className="alert-close sap-button"
            title="Cerrar alerta"
          >
            ✕
          </button>
        </div>
      )}

      {/* Stats */}
      {suppliersStats && (
        <SuppliersStats 
          stats={suppliersStats}
          suppliersCount={filteredSuppliers.length}
          totalSuppliers={suppliers.length}
        />
      )}

      {/* Filters */}
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

      {/* Content */}
      {filteredSuppliers.length === 0 ? (
        <div className="empty-state sap-theme">
          <div className="empty-icon sap-theme">
            🏢
          </div>
          <h3 className="sap-title">
            {suppliers.length === 0 ? 'No hay proveedores registrados' : 'No se encontraron proveedores'}
          </h3>
          <p className="sap-text">
            {suppliers.length === 0 
              ? 'Comienza agregando tu primer proveedor de combustibles para gestionar tu cadena de suministro.'
              : 'No se encontraron proveedores que coincidan con los filtros aplicados. Intenta ajustar los criterios de búsqueda.'
            }
          </p>
          {suppliers.length === 0 && hasPermission('canManageSuppliers') && (
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
              hasEditPermission={hasPermission('canManageSuppliers')}
              hasDeletePermission={hasPermission('canManageSuppliers')}
            />
          ) : (
            <SuppliersTable
              suppliers={filteredSuppliers}
              onEdit={handleEditSupplier}
              onDelete={handleDeleteSupplier}
              hasEditPermission={hasPermission('canManageSuppliers')}
              hasDeletePermission={hasPermission('canManageSuppliers')}
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
    </div>
  );
};

export default SuppliersMain;