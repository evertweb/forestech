/**
 * ================================================================================================================================
 * ARCHIVO: InventoryMain-SAP.jsx
 * MÓDULO: combustibles
 * DESCRIPCIÓN: Componente principal de Inventario con tema SAP Fiori Corporate implementado.
 *
 * FUNCIONALIDAD:
 * - Implementa el tema SAP Fiori Corporate completo
 * - Mantiene toda la funcionalidad del inventario original
 * - Diseño responsive y accesible WCAG 2.1 AA
 * - Estados visuales consistentes con estándares SAP
 * ================================================================================================================================
 */

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
import '../../styles/sap-inventory.css';

const InventoryMainSAP = () => {
  const { hasPermission } = useCombustibles();
  const [inventoryItems, setInventoryItems] = useState([]);
  const [inventoryStats, setInventoryStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // Defaultear a tabla en SAP
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // Filter states
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
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
  }, [inventoryItems]);

  // Filter items based on current filters
  const filteredItems = inventoryItems.filter(item => {
    // Filter by status
    if (filterStatus === 'active' && item.status !== 'active') return false;
    if (filterStatus === 'low-stock' && !item.needsRestock) return false;
    if (filterStatus === 'critical') {
      const stock = parseFloat(item.currentStock) || 0;
      const minStock = parseFloat(item.minStock) || parseFloat(item.minThreshold) || 20;
      if (stock > minStock) return false;
    }
    
    // Filter by category
    if (filterCategory !== 'all') {
      const category = item.category || item.fuelType || 'other';
      if (category.toLowerCase() !== filterCategory.toLowerCase()) return false;
    }
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        (item.name || '').toLowerCase().includes(searchLower) ||
        (item.location || '').toLowerCase().includes(searchLower) ||
        (item.fuelType || '').toLowerCase().includes(searchLower) ||
        (item.category || '').toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  // Enhanced stats calculation
  const enhancedStats = React.useMemo(() => {
    const totalItems = inventoryItems.filter(item => item.isActive !== false).length;
    const lowStockItems = inventoryItems.filter(item => {
      const stock = parseFloat(item.currentStock) || 0;
      const minStock = parseFloat(item.minStock) || parseFloat(item.minThreshold) || 20;
      return item.isActive !== false && stock <= minStock;
    }).length;
    
    const outOfStockItems = inventoryItems.filter(item => {
      const stock = parseFloat(item.currentStock) || 0;
      return item.isActive !== false && stock === 0;
    }).length;

    const totalValue = inventoryItems
      .filter(item => item.isActive !== false)
      .reduce((sum, item) => {
        const stock = parseFloat(item.currentStock) || 0;
        const price = parseFloat(item.pricePerUnit || item.unitPrice) || 0;
        return sum + (stock * price);
      }, 0);

    return {
      totalItems,
      lowStockItems,
      outOfStockItems,
      inStockItems: totalItems - lowStockItems,
      totalValue,
      ...inventoryStats
    };
  }, [inventoryItems, inventoryStats]);

  // Event handlers
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
    handleModalClose();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterCategory('all');
  };

  // Loading state
  if (loading && inventoryItems.length === 0) {
    return (
      <div className="inventory-container sap-theme">
        <div className="inventory-header sap-theme">
          <div>
            <h1 className="inventory-title sap-theme">Gestión de Inventario</h1>
            <p>Cargando datos en tiempo real...</p>
          </div>
        </div>
        <div className="dashboard-loading sap-theme">
          <div className="loading-spinner sap-theme"></div>
          <span>Cargando inventario...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="inventory-container sap-theme">
      {/* Header */}
      <div className="inventory-header sap-theme">
        <div>
          <h1 className="inventory-title sap-theme">Gestión de Inventario</h1>
          <p style={{ color: 'var(--sap-text-secondary)', margin: 'var(--sap-spacing-xs) 0 0 0' }}>
            Control de stock de combustibles en tiempo real - SAP Fiori
          </p>
        </div>
        <div style={{ 
          background: 'var(--sap-blue-light)', 
          padding: 'var(--sap-spacing-md)', 
          borderRadius: 'var(--sap-border-radius-sm)',
          border: '1px solid var(--sap-blue-primary)',
          fontSize: '0.875rem'
        }}>
          💡 Los combustibles se agregan automáticamente desde la pestaña <strong>Movimientos</strong>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="inventory-stats sap-theme">
        <div className="inventory-stat-card sap-theme in-stock">
          <div className="inventory-stat-value sap-theme">{enhancedStats.inStockItems}</div>
          <div className="inventory-stat-label sap-theme">En Stock</div>
        </div>
        
        <div className="inventory-stat-card sap-theme low-stock">
          <div className="inventory-stat-value sap-theme">{enhancedStats.lowStockItems}</div>
          <div className="inventory-stat-label sap-theme">Stock Bajo</div>
        </div>
        
        <div className="inventory-stat-card sap-theme out-of-stock">
          <div className="inventory-stat-value sap-theme">{enhancedStats.outOfStockItems}</div>
          <div className="inventory-stat-label sap-theme">Sin Stock</div>
        </div>
        
        <div className="inventory-stat-card sap-theme">
          <div className="inventory-stat-value sap-theme">
            ${enhancedStats.totalValue.toLocaleString('es-CO')}
          </div>
          <div className="inventory-stat-label sap-theme">Valor Total</div>
        </div>
      </div>

      {/* Filters */}
      <div className="inventory-filters sap-theme">
        <div className="filter-group sap-theme">
          <label className="filter-label sap-theme">Buscar</label>
          <input
            type="text"
            placeholder="Nombre, ubicación, tipo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filter-input sap-theme"
          />
        </div>
        
        <div className="filter-group sap-theme">
          <label className="filter-label sap-theme">Estado</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select sap-theme"
          >
            <option value="all">Todos</option>
            <option value="active">Activos</option>
            <option value="low-stock">Stock Bajo</option>
            <option value="critical">Crítico</option>
          </select>
        </div>
        
        <div className="filter-group sap-theme">
          <label className="filter-label sap-theme">Categoría</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select sap-theme"
          >
            <option value="all">Todas</option>
            <option value="diesel">Diesel</option>
            <option value="gasolina">Gasolina</option>
            <option value="lubricantes">Lubricantes</option>
            <option value="aditivos">Aditivos</option>
          </select>
        </div>

        <div className="filter-group sap-theme">
          <label className="filter-label sap-theme">Vista</label>
          <div style={{ display: 'flex', gap: 'var(--sap-spacing-xs)' }}>
            <button
              className={`btn sap-theme ${viewMode === 'table' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('table')}
              style={{ padding: 'var(--sap-spacing-sm)' }}
            >
              📊
            </button>
            <button
              className={`btn sap-theme ${viewMode === 'cards' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('cards')}
              style={{ padding: 'var(--sap-spacing-sm)' }}
            >
              📱
            </button>
          </div>
        </div>
        
        <div className="filter-actions sap-theme">
          <button
            className="btn btn-tertiary sap-theme"
            onClick={clearFilters}
          >
            🔄 Limpiar
          </button>
          <button className="btn btn-primary sap-theme">
            📊 Exportar
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-banner sap-theme">
          <div>
            <strong>Error:</strong> {error}
          </div>
          <button 
            className="btn btn-tertiary sap-theme"
            onClick={() => setError(null)}
            style={{ minHeight: 'auto', padding: 'var(--sap-spacing-xs)' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Content */}
      {filteredItems.length === 0 ? (
        <div className="inventory-table-container sap-theme">
          <div style={{ 
            textAlign: 'center', 
            padding: 'var(--sap-spacing-xxl)',
            color: 'var(--sap-text-muted)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--sap-spacing-lg)' }}>📦</div>
            <h3 style={{ margin: '0 0 var(--sap-spacing-md) 0', color: 'var(--sap-text-primary)' }}>
              No hay items de inventario
            </h3>
            <p style={{ margin: 0 }}>
              {searchTerm || filterStatus !== 'all' || filterCategory !== 'all'
                ? 'No se encontraron items con los filtros aplicados'
                : 'Ve a la pestaña Movimientos para crear una ENTRADA de combustible'
              }
            </p>
            {(searchTerm || filterStatus !== 'all' || filterCategory !== 'all') && (
              <button 
                className="btn btn-primary sap-theme"
                onClick={clearFilters}
                style={{ marginTop: 'var(--sap-spacing-lg)' }}
              >
                Limpiar Filtros
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="inventory-table-container sap-theme">
          <div className="inventory-table-header sap-theme">
            <h2 className="inventory-table-title sap-theme">
              Inventario ({filteredItems.length} items)
            </h2>
            <div className="inventory-table-actions sap-theme">
              <button className="btn btn-tertiary sap-theme">
                🔍 Filtros Avanzados
              </button>
              <button className="btn btn-secondary sap-theme">
                📋 Reporte
              </button>
            </div>
          </div>
          
          {viewMode === 'table' ? (
            <table className="inventory-table sap-theme">
              <thead>
                <tr>
                  <th role="columnheader">Producto</th>
                  <th role="columnheader">Categoría</th>
                  <th role="columnheader">Ubicación</th>
                  <th role="columnheader">Stock Actual</th>
                  <th role="columnheader">Stock Mínimo</th>
                  <th role="columnheader">Capacidad</th>
                  <th role="columnheader">Nivel</th>
                  <th role="columnheader">Precio/Unidad</th>
                  <th role="columnheader">Valor Total</th>
                  <th role="columnheader">Estado</th>
                  <th role="columnheader">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => {
                  const currentStock = parseFloat(item.currentStock) || 0;
                  const maxCapacity = parseFloat(item.maxCapacity) || 0;
                  const minStock = parseFloat(item.minStock) || parseFloat(item.minThreshold) || 20;
                  const pricePerUnit = parseFloat(item.pricePerUnit || item.unitPrice) || 0;
                  const percentage = maxCapacity > 0 ? (currentStock / maxCapacity) * 100 : 0;
                  const totalValue = currentStock * pricePerUnit;
                  
                  let stockStatus = 'in-stock';
                  let stockLabel = 'Normal';
                  if (currentStock === 0) {
                    stockStatus = 'out-of-stock';
                    stockLabel = 'Sin Stock';
                  } else if (currentStock <= minStock) {
                    stockStatus = 'low-stock';
                    stockLabel = 'Crítico';
                  } else if (percentage > 80) {
                    stockStatus = 'in-stock';
                    stockLabel = 'Alto';
                  }
                  
                  return (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.name || item.fuelType}</strong>
                      </td>
                      <td>
                        <span className="category-badge sap-theme fuel">
                          {item.category || item.fuelType || 'N/A'}
                        </span>
                      </td>
                      <td>{item.location || 'N/A'}</td>
                      <td>
                        <div className="quantity-display sap-theme">
                          <span className="quantity-current sap-theme">
                            {currentStock.toLocaleString('es-CO', { maximumFractionDigits: 1 })}
                          </span>
                          <span className="quantity-unit sap-theme">gal</span>
                        </div>
                      </td>
                      <td>
                        <span className="quantity-minimum sap-theme">
                          {minStock.toLocaleString('es-CO')} gal
                        </span>
                      </td>
                      <td>{maxCapacity.toLocaleString('es-CO')} gal</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                            {Math.round(percentage)}%
                          </span>
                          <div style={{ 
                            width: '60px', 
                            height: '8px', 
                            background: 'var(--sap-neutral-300)', 
                            borderRadius: '4px',
                            overflow: 'hidden'
                          }}>
                            <div style={{ 
                              width: `${Math.min(percentage, 100)}%`, 
                              height: '100%',
                              background: stockStatus === 'out-of-stock' || stockStatus === 'low-stock' ? 'var(--sap-error)' : 
                                         percentage > 80 ? 'var(--sap-warning)' : 'var(--sap-success)',
                              transition: 'width 0.3s ease'
                            }} />
                          </div>
                        </div>
                      </td>
                      <td>${pricePerUnit.toLocaleString('es-CO')}</td>
                      <td>
                        <strong>${totalValue.toLocaleString('es-CO')}</strong>
                      </td>
                      <td>
                        <span className={`stock-indicator sap-theme ${stockStatus}`}>
                          {stockLabel}
                        </span>
                      </td>
                      <td>
                        <div className="inventory-actions sap-theme">
                          <button 
                            className="action-button sap-theme view" 
                            title="Ver detalles"
                            onClick={() => handleEdit(item)}
                          >
                            👁️
                          </button>
                          <button 
                            className="action-button sap-theme edit" 
                            title="Editar"
                            onClick={() => handleEdit(item)}
                            disabled={!hasPermission('canManageInventory')}
                          >
                            ✏️
                          </button>
                          <button 
                            className="action-button sap-theme restock" 
                            title="Reabastecer"
                          >
                            📦
                          </button>
                          <button 
                            className="action-button sap-theme delete" 
                            title="Eliminar"
                            onClick={() => handleDelete(item)}
                            disabled={!hasPermission('canManageInventory')}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div style={{ padding: 'var(--sap-spacing-lg)' }}>
              <InventoryCards
                items={filteredItems}
                onEdit={handleEdit}
                onDelete={handleDelete}
                canManage={hasPermission('canManageInventory')}
              />
            </div>
          )}
        </div>
      )}

      {/* Results Footer */}
      {filteredItems.length > 0 && (
        <div style={{ 
          marginTop: 'var(--sap-spacing-lg)',
          padding: 'var(--sap-spacing-md)',
          background: 'var(--sap-neutral-200)',
          borderRadius: 'var(--sap-border-radius-sm)',
          fontSize: '0.875rem',
          color: 'var(--sap-text-secondary)',
          textAlign: 'center'
        }}>
          Mostrando {filteredItems.length} de {inventoryItems.length} items
          {searchTerm && ` · Filtro: "${searchTerm}"`}
          {filterStatus !== 'all' && ` · Estado: ${filterStatus}`}
          {filterCategory !== 'all' && ` · Categoría: ${filterCategory}`}
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

export default InventoryMainSAP;