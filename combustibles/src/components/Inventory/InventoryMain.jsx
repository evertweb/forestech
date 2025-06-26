// combustibles/src/components/Inventory/InventoryMain.jsx
// Componente principal del módulo de inventario
import React, { useState, useEffect } from 'react';
import { useCombustibles } from '../../contexts/CombustiblesContext';
import { 
  subscribeToInventory, 
  deleteInventoryItem,
  getInventoryStats 
} from '../../services/inventoryService';
import InventoryTable from './InventoryTable';
import InventoryCards from './InventoryCards';
import InventoryModal from './InventoryModal';
import InventoryStats from './InventoryStats';
import './Inventory.css';

const InventoryMain = () => {
  const { hasPermission } = useCombustibles();
  const [inventoryItems, setInventoryItems] = useState([]);
  const [inventoryStats, setInventoryStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // Filter states
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'active' | 'low-stock'
  const [searchTerm, setSearchTerm] = useState('');

  // Real-time subscription
  useEffect(() => {
    let unsubscribe = null;

    const setupSubscription = () => {
      unsubscribe = subscribeToInventory((items, error) => {
        if (error) {
          console.error('Error in inventory subscription:', error);
          setError('Error cargando inventario en tiempo real');
          return;
        }
        
        setInventoryItems(items || []);
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

  // Load statistics
  useEffect(() => {
    const loadStats = async () => {
      const result = await getInventoryStats();
      if (result.success) {
        setInventoryStats(result.data);
      }
    };

    loadStats();
  }, [inventoryItems]); // Recalcular cuando cambien los items

  // Filter items based on current filters
  const filteredItems = inventoryItems.filter(item => {
    // Filter by status
    if (filterStatus === 'active' && item.status !== 'active') return false;
    if (filterStatus === 'low-stock' && !item.needsRestock) return false;
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        item.name.toLowerCase().includes(searchLower) ||
        item.location.toLowerCase().includes(searchLower) ||
        item.fuelType.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  // Handlers
  const handleCreateNew = () => {
    if (!hasPermission('canManageInventory')) {
      alert('No tienes permisos para crear items de inventario');
      return;
    }
    setEditingItem(null);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    if (!hasPermission('canManageInventory')) {
      alert('No tienes permisos para editar items de inventario');
      return;
    }
    setEditingItem(item);
    setShowModal(true);
  };

  const handleDelete = async (item) => {
    if (!hasPermission('canManageInventory')) {
      alert('No tienes permisos para eliminar items de inventario');
      return;
    }

    const confirmed = window.confirm(
      `¿Estás seguro de eliminar ${item.name} de ${item.location}?\n\nEsta acción no se puede deshacer.`
    );
    
    if (!confirmed) return;

    setLoading(true);
    const result = await deleteInventoryItem(item.id);
    
    if (result.success) {
      // El item se actualizará automáticamente vía subscription
      alert('Item eliminado exitosamente');
    } else {
      setError(result.error);
      alert(`Error al eliminar: ${result.error}`);
    }
    setLoading(false);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const handleModalSuccess = () => {
    // Los datos se actualizarán automáticamente vía subscription
    handleModalClose();
  };

  if (loading && inventoryItems.length === 0) {
    return (
      <div className="inventory-loading">
        <div className="loading-spinner"></div>
        <p>Cargando inventario...</p>
      </div>
    );
  }

  return (
    <div className="inventory-main">
      {/* Header */}
      <div className="inventory-header">
        <div className="header-title">
          <h2>🛢️ Gestión de Inventario</h2>
          <p>Control de stock de combustibles en tiempo real</p>
        </div>
        
        {hasPermission('canManageInventory') && (
          <button 
            className="btn btn-primary"
            onClick={handleCreateNew}
          >
            ➕ Agregar Combustible
          </button>
        )}
      </div>

      {/* Statistics */}
      {inventoryStats && (
        <InventoryStats stats={inventoryStats} />
      )}

      {/* Filters and Controls */}
      <div className="inventory-controls">
        <div className="search-filters">
          <input
            type="text"
            placeholder="Buscar por nombre, ubicación o tipo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">Todos los items</option>
            <option value="active">Solo activos</option>
            <option value="low-stock">Stock bajo</option>
          </select>
        </div>
        
        <div className="view-toggle">
          <button
            className={`toggle-btn ${viewMode === 'cards' ? 'active' : ''}`}
            onClick={() => setViewMode('cards')}
          >
            📱 Cards
          </button>
          <button
            className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => setViewMode('table')}
          >
            📊 Tabla
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {/* Content */}
      <div className="inventory-content">
        {filteredItems.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>No hay items de inventario</h3>
            <p>
              {searchTerm || filterStatus !== 'all' 
                ? 'No se encontraron items con los filtros aplicados'
                : 'Comienza agregando tu primer tipo de combustible al inventario'
              }
            </p>
            {hasPermission('canManageInventory') && (
              <button 
                className="btn btn-primary"
                onClick={handleCreateNew}
              >
                ➕ Agregar Primer Combustible
              </button>
            )}
          </div>
        ) : (
          <>
            {viewMode === 'cards' ? (
              <InventoryCards
                items={filteredItems}
                onEdit={handleEdit}
                onDelete={handleDelete}
                canManage={hasPermission('canManageInventory')}
              />
            ) : (
              <InventoryTable
                items={filteredItems}
                onEdit={handleEdit}
                onDelete={handleDelete}
                canManage={hasPermission('canManageInventory')}
              />
            )}
          </>
        )}
      </div>

      {/* Results count */}
      {filteredItems.length > 0 && (
        <div className="results-footer">
          <p>
            Mostrando {filteredItems.length} de {inventoryItems.length} items
            {searchTerm && ` · Filtro: "${searchTerm}"`}
            {filterStatus !== 'all' && ` · Estado: ${filterStatus}`}
          </p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <InventoryModal
          item={editingItem}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
};

export default InventoryMain;