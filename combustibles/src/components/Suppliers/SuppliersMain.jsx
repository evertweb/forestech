// combustibles/src/components/Suppliers/SuppliersMain.jsx
// Componente principal del módulo de proveedores
import React, { useState, useEffect } from 'react';
import { useCombustibles } from '../../contexts/CombustiblesContext';
import { 
  subscribeToSuppliers, 
  deleteSupplier,
  getSuppliersStats 
} from '../../services/suppliersService';
import SuppliersTable from './SuppliersTable';
import SuppliersCards from './SuppliersCards';
import SupplierModal from './SupplierModal';
import SuppliersStats from './SuppliersStats';
import SuppliersFilters from './SuppliersFilters';
import './Suppliers.css';

const SuppliersMain = () => {
  const { hasPermission, userProfile } = useCombustibles();
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
  };

  const handleEditSupplier = (supplier) => {
    if (!hasPermission('canManageSuppliers')) {
      setError('No tienes permisos para editar proveedores');
      return;
    }
    setEditingSupplier(supplier);
    setShowModal(true);
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
      const result = await deleteSupplier(supplierId, userProfile?.email);
      if (result.success) {
        setError(null);
        // La suscripción en tiempo real actualizará la lista automáticamente
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
    setError(null);
  };

  const handleModalSuccess = () => {
    setShowModal(false);
    setEditingSupplier(null);
    setError(null);
    // La suscripción en tiempo real actualizará la lista automáticamente
  };

  const clearFilters = () => {
    setFilterStatus('all');
    setFilterCategory('all');
    setFilterFuelType('all');
    setSearchTerm('');
  };

  const exportSuppliers = () => {
    if (!hasPermission('canExportReports')) {
      setError('No tienes permisos para exportar datos');
      return;
    }

    try {
      const dataToExport = filteredSuppliers.map(supplier => ({
        'Nombre': supplier.name,
        'NIT/Documento': supplier.taxId,
        'Tipo': supplier.type,
        'Categoría': supplier.category,
        'Persona de Contacto': supplier.contactPerson,
        'Teléfono': supplier.phone,
        'Email': supplier.email,
        'Ciudad': supplier.city,
        'Combustibles': supplier.fuelTypes?.join(', '),
        'Rating': supplier.rating,
        'Estado': supplier.status,
        'Preferido': supplier.isPreferred ? 'Sí' : 'No',
        'Fecha Creación': supplier.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'
      }));

      const csvContent = [
        Object.keys(dataToExport[0]).join(','),
        ...dataToExport.map(row => Object.values(row).map(value => `"${value || ''}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `proveedores_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting suppliers:', error);
      setError('Error al exportar proveedores');
    }
  };

  if (loading) {
    return (
      <div className="suppliers-main">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando proveedores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="suppliers-main">
      {/* Header */}
      <div className="suppliers-header">
        <div className="header-content">
          <h1>Gestión de Proveedores</h1>
          <p className="header-subtitle">
            Administra los proveedores de combustibles y materiales
          </p>
        </div>
        
        <div className="header-actions">
          {hasPermission('canManageSuppliers') && (
            <button 
              className="btn btn-primary"
              onClick={handleAddSupplier}
            >
              <i className="icon-plus"></i>
              Agregar Proveedor
            </button>
          )}
          
          {hasPermission('canExportReports') && (
            <button 
              className="btn btn-secondary"
              onClick={exportSuppliers}
              disabled={filteredSuppliers.length === 0}
            >
              <i className="icon-download"></i>
              Exportar
            </button>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-error">
          <i className="icon-alert-circle"></i>
          <span>{error}</span>
          <button onClick={() => setError(null)} className="alert-close">
            <i className="icon-x"></i>
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
        <div className="empty-state">
          <div className="empty-icon">
            <i className="icon-truck"></i>
          </div>
          <h3>No hay proveedores</h3>
          <p>
            {suppliers.length === 0 
              ? 'Comienza agregando tu primer proveedor de combustibles.'
              : 'No se encontraron proveedores que coincidan con los filtros aplicados.'
            }
          </p>
          {suppliers.length === 0 && hasPermission('canManageSuppliers') && (
            <button 
              className="btn btn-primary"
              onClick={handleAddSupplier}
            >
              <i className="icon-plus"></i>
              Agregar Primer Proveedor
            </button>
          )}
          {suppliers.length > 0 && (
            <button 
              className="btn btn-secondary"
              onClick={clearFilters}
            >
              <i className="icon-filter-x"></i>
              Limpiar Filtros
            </button>
          )}
        </div>
      ) : (
        <div className="suppliers-content">
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