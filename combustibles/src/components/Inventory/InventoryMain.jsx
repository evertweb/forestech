/**
 * ================================================================================================================================
 * ARCHIVO: InventoryMain.jsx
 * MÓDULO: combustibles
 * DESCRIPCIÓN: Componente principal de Inventario con tema SAP Fiori Corporate implementado.
 *
 * FUNCIONALIDAD:
 * - Implementa el tema SAP Fiori Corporate completo
 * - Mantiene toda la funcionalidad del inventario original
 * - Diseño responsive y accesible WCAG 2.1 AA
 * - Estados visuales consistentes con estándares SAP
 * 
 * MIGRADO A ZUSTAND (Fase 2 - Sprint 1)
 * - Usa useAuthStore para hasPermission
 * ================================================================================================================================
 */

import React, { useState, useEffect, useMemo, useCallback, Suspense, lazy } from 'react';
import { useAuthStore } from '../../stores';
import {
  subscribeToInventory,
  deleteInventoryItem,
  getInventoryStats,
} from '../../services/FirebaseInventoryService';
import { useFirebaseProgressContext } from '../../contexts/FirebaseProgressContext';
import InventoryTable from './InventoryTable';
import InventoryCards from './InventoryCards';
// Lazy load del modal pesado para dividir el bundle
const InventoryModal = lazy(() => import('./InventoryModal'));
import InventoryStats from './InventoryStats';
import { PageLayout, ShimmerLoader, ShimmerCardsGrid, ShimmerTable } from '../shared';
import { cardsService } from '../../services/cardsService';
import UnifiedCardsGrid from '../shared/UnifiedCards';
import { useCardDetails } from '../../hooks/useCardDetails.jsx';
import '../../styles/sap-inventory.css';
import '../../styles/inventory-header.css';

const InventoryMain = () => {
  // 🔐 Zustand Store - Solo permisos
  const hasPermission = useAuthStore(state => state.hasPermission);

  // Hook para progreso transparente de Firebase
  const { executeWithProgress } = useFirebaseProgressContext();
  const { openCardDetails, CardDetailsModal } = useCardDetails();
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
          console.error('Error en subscripción de inventario:', error);
          setError(error.message || 'Error al cargar inventario');
          setLoading(false);
          return;
        }

        console.log(`📦 Inventario actualizado: ${items?.length || 0} items`);
        setInventoryItems(items || []);
        setError(null);
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

  // Load detailed stats
  useEffect(() => {
    const loadStats = async () => {
      try {
        const stats = await getInventoryStats();
        setInventoryStats(stats);
      } catch (error) {
        console.error('Error loading inventory stats:', error);
      }
    };

    if (inventoryItems.length > 0) {
      loadStats();
    }
  }, [inventoryItems]);

  // Filter items
  const filteredItems = useMemo(() => {
    return inventoryItems.filter((item) => {
      // Filter by status
      if (filterStatus === 'active' && item.isActive === false) return false;
      if (filterStatus === 'low-stock') {
        const stock = parseFloat(item.currentStock) || 0;
        const minStock = parseFloat(item.minStock) || parseFloat(item.minThreshold) || 20;
        if (stock > minStock) return false;
      }
      if (filterStatus === 'critical') {
        const stock = parseFloat(item.currentStock) || 0;
        if (stock !== 0) return false;
      }

      // Filter by category
      if (
        filterCategory !== 'all' &&
        item.category !== filterCategory &&
        item.fuelType !== filterCategory
      ) {
        return false;
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
  }, [filterCategory, filterStatus, inventoryItems, searchTerm]);

  const canManageInventory = useMemo(() => hasPermission('canManageInventory'), [hasPermission]);

  // Enhanced stats calculation
  const enhancedStats = useMemo(() => {
    const totalItems = inventoryItems.filter((item) => item.isActive !== false).length;
    const lowStockItems = inventoryItems.filter((item) => {
      const stock = parseFloat(item.currentStock) || 0;
      const minStock = parseFloat(item.minStock) || parseFloat(item.minThreshold) || 20;
      return item.isActive !== false && stock <= minStock;
    }).length;

    const outOfStockItems = inventoryItems.filter((item) => {
      const stock = parseFloat(item.currentStock) || 0;
      return item.isActive !== false && stock === 0;
    }).length;

    const totalValue = inventoryItems
      .filter((item) => item.isActive !== false)
      .reduce((sum, item) => {
        const stock = parseFloat(item.currentStock) || 0;
        const price = parseFloat(item.pricePerUnit || item.unitPrice) || 0;
        return sum + stock * price;
      }, 0);

    return {
      totalItems,
      lowStockItems,
      outOfStockItems,
      inStockItems: totalItems - lowStockItems,
      totalValue,
      ...inventoryStats,
    };
  }, [inventoryItems, inventoryStats]);

  const handleEdit = useCallback((item) => {
    if (!canManageInventory) {
      alert('No tienes permisos para editar items de inventario');
      return;
    }
    setEditingItem(item);
    setShowModal(true);
  }, [canManageInventory]);

  const handleDelete = useCallback(async (item) => {
    if (!canManageInventory) {
      alert('No tienes permisos para eliminar items de inventario');
      return;
    }

    const confirmed = window.confirm(
      `¿Estás seguro de eliminar ${item.name} de ${item.location}?\n\nEsta acción no se puede deshacer.`
    );

    if (!confirmed) return;

    try {
      const progressDescription = `Eliminando ${item.name} de inventario en ${item.location}`;

      const result = await executeWithProgress(
        'deleteInventory',
        progressDescription,
        () => deleteInventoryItem(item.id),
        {
          itemId: item.id,
          itemName: item.name,
          location: item.location,
          fuelType: item.fuelType,
        }
      );

      if (result.success) {
        // El item se actualizará automáticamente vía subscription
        console.log('✅ Item eliminado exitosamente');
      } else {
        setError(result.error);
        alert(`Error al eliminar: ${result.error}`);
      }
    } catch (error) {
      console.error('❌ Error al eliminar item:', error);
      alert(`Error al eliminar: ${error.message}`);
    }
  }, [canManageInventory, executeWithProgress]);

  const handleModalClose = useCallback(() => {
    setShowModal(false);
    setEditingItem(null);
  }, []);

  const handleModalSuccess = useCallback(() => {
    handleModalClose();
  }, [handleModalClose]);

  const handleAddItem = useCallback(() => {
    if (!canManageInventory) {
      alert('No tienes permisos para agregar items de inventario');
      return;
    }
    setEditingItem(null);
    setShowModal(true);
  }, [canManageInventory]);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterCategory('all');
  }, []);

  // Componentes para PageLayout
  const headerActions = useMemo(() => {
    return (
      <div className="inventory-header-actions">
        <button
          className="btn btn-primary sap-theme"
          onClick={handleAddItem}
          style={{ marginRight: 'var(--sap-spacing-sm)' }}
        >
          ➕ Agregar Combustible
        </button>
        <div
          style={{
            background: 'var(--sap-blue-light)',
            padding: 'var(--sap-spacing-md)',
            borderRadius: 'var(--sap-border-radius-sm)',
            border: '1px solid var(--sap-blue-primary)',
            fontSize: '0.875rem',
            flex: 1,
          }}
        >
          💡 También puedes agregar combustibles automáticamente desde la pestaña{' '}
          <strong>Movimientos</strong>
        </div>
      </div>
    );
  }, [handleAddItem]);

  // Generar cards unificadas para inventario
  const inventoryCards = useMemo(() => {
    return cardsService.getCardsForTab('inventory', {
      inventory: inventoryItems,
      movements: [], // Los movimientos los podríamos obtener del contexto si fuera necesario
      vehicles: [],
    });
  }, [inventoryItems]);

  const statsComponent = useMemo(() => {
    if (loading) {
      return (
        <ShimmerCardsGrid
          cards={4}
          columns={4}
          variant="stat"
          className="inventory-cards-grid"
        />
      );
    }

    return (
      <UnifiedCardsGrid
        cards={inventoryCards}
        onCardClick={openCardDetails}
        columns={4}
        className="inventory-cards-grid"
      />
    );
  }, [inventoryCards, loading, openCardDetails]);

  const filtersComponent = useMemo(() => {
    return (
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
            <option value="DIESEL">DIESEL</option>
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
          <button className="btn btn-tertiary sap-theme" onClick={clearFilters}>
            🔄 Limpiar
          </button>
          <button className="btn btn-primary sap-theme">📊 Exportar</button>
        </div>
      </div>
    );
  }, [clearFilters, filterCategory, filterStatus, searchTerm, viewMode]);

  const mainContent = useMemo(() => {
    return (
      <>
        {/* Modal de detalles de cards */}
        {CardDetailsModal}

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
            <div
              style={{
                textAlign: 'center',
                padding: 'var(--sap-spacing-xxl)',
                color: 'var(--sap-text-muted)',
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: 'var(--sap-spacing-lg)' }}>📦</div>
              <h3
                style={{ margin: '0 0 var(--sap-spacing-md) 0', color: 'var(--sap-text-primary)' }}
              >
                No hay items de inventario
              </h3>
              <p style={{ margin: 0 }}>
                {searchTerm || filterStatus !== 'all' || filterCategory !== 'all'
                  ? 'No se encontraron items con los filtros aplicados'
                  : 'Agrega tu primer combustible al inventario'}
              </p>
              <div style={{ marginTop: 'var(--sap-spacing-lg)' }}>
                {searchTerm || filterStatus !== 'all' || filterCategory !== 'all' ? (
                  <button className="btn btn-primary sap-theme" onClick={clearFilters}>
                    Limpiar Filtros
                  </button>
                ) : (
                  <button className="btn btn-primary sap-theme" onClick={handleAddItem}>
                    ➕ Agregar Primer Combustible
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="inventory-table-container sap-theme">
            {/* SAP Fiori Header Section */}
            <div className="sap-table-toolbar">
              <div className="sap-table-toolbar-row">
                <div className="sap-table-title-section">
                  <h2 className="sap-table-title">
                    <span className="sap-table-icon">📦</span>
                    Inventario de Combustibles
                  </h2>
                  <div className="sap-table-subtitle">
                    {filteredItems.length} elementos encontrados
                  </div>
                </div>
                <div className="sap-table-actions-section">
                  <button className="sap-btn sap-btn-emphasized" onClick={handleAddItem}>
                    <span className="sap-btn-icon">➕</span>
                    Agregar Combustible
                  </button>
                  <button className="sap-btn sap-btn-transparent">
                    <span className="sap-btn-icon">🔍</span>
                    Filtros Avanzados
                  </button>
                  <button className="sap-btn sap-btn-emphasized">
                    <span className="sap-btn-icon">📊</span>
                    Generar Reporte
                  </button>
                </div>
              </div>

              {/* SAP Fiori Secondary Toolbar */}
              <div className="sap-table-toolbar-row sap-secondary">
                <div className="sap-table-info-section">
                  <div className="sap-info-tile">
                    <span className="sap-info-label">Total Items:</span>
                    <span className="sap-info-value">{filteredItems.length}</span>
                  </div>
                  <div className="sap-info-tile sap-warning">
                    <span className="sap-info-label">Stock Bajo:</span>
                    <span className="sap-info-value">{enhancedStats.lowStockItems}</span>
                  </div>
                  <div className="sap-info-tile sap-error">
                    <span className="sap-info-label">Sin Stock:</span>
                    <span className="sap-info-value">{enhancedStats.outOfStockItems}</span>
                  </div>
                </div>
                <div className="sap-table-view-switcher">
                  <button
                    className={`sap-view-btn ${viewMode === 'table' ? 'sap-active' : ''}`}
                    onClick={() => setViewMode('table')}
                    title="Vista de Tabla"
                  >
                    <span className="sap-btn-icon">📊</span>
                  </button>
                  <button
                    className={`sap-view-btn ${viewMode === 'cards' ? 'sap-active' : ''}`}
                    onClick={() => setViewMode('cards')}
                    title="Vista de Tarjetas"
                  >
                    <span className="sap-btn-icon">📱</span>
                  </button>
                </div>
              </div>
            </div>

            {/* SAP Fiori Content Section */}
            <div className="sap-table-content">
              {loading ? (
                <ShimmerTable
                  rows={8}
                  columns={7}
                  title={false}
                  actions={false}
                  className="shimmer-inventory-table"
                />
              ) : viewMode === 'table' ? (
                <div className="sap-table-wrapper">
                  <InventoryTable
                    items={filteredItems}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    canManage={canManageInventory}
                  />
                </div>
              ) : (
                <div className="sap-cards-container">
                  <InventoryCards
                    items={filteredItems}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    canManage={canManageInventory}
                  />
                </div>
              )}
            </div>

            {/* SAP Fiori Footer Section */}
            <div className="sap-table-footer">
              <div className="sap-table-footer-row">
                <div className="sap-table-pagination-info">
                  Mostrando {filteredItems.length} de {inventoryItems.length} elementos
                </div>
                <div className="sap-table-footer-actions">
                  <button className="sap-btn sap-btn-transparent sap-btn-compact">
                    <span className="sap-btn-icon">📤</span>
                    Exportar
                  </button>
                  <button className="sap-btn sap-btn-transparent sap-btn-compact">
                    <span className="sap-btn-icon">🔄</span>
                    Actualizar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Footer */}
        {filteredItems.length > 0 && (
          <div
            style={{
              marginTop: 'var(--sap-spacing-lg)',
              padding: 'var(--sap-spacing-md)',
              background: 'var(--sap-neutral-200)',
              borderRadius: 'var(--sap-border-radius-sm)',
              fontSize: '0.875rem',
              color: 'var(--sap-text-secondary)',
              textAlign: 'center',
            }}
          >
            Mostrando {filteredItems.length} de {inventoryItems.length} items
            {searchTerm && ` · Filtro: "${searchTerm}"`}
            {filterStatus !== 'all' && ` · Estado: ${filterStatus}`}
            {filterCategory !== 'all' && ` · Categoría: ${filterCategory}`}
          </div>
        )}

        {/* Modal (lazy) */}
        {showModal && (
          <Suspense
            fallback={
              <div className="loading-container">
                <div className="loader">
                  <div className="spinner"></div>
                  <p>Cargando formulario...</p>
                </div>
              </div>
            }
          >
            <InventoryModal
              item={editingItem}
              onClose={handleModalClose}
              onSuccess={handleModalSuccess}
            />
          </Suspense>
        )}
      </>
    );
  }, [
    CardDetailsModal,
    canManageInventory,
    clearFilters,
    editingItem,
    enhancedStats,
    error,
    filteredItems,
    handleAddItem,
    handleDelete,
    handleEdit,
    handleModalClose,
    handleModalSuccess,
    inventoryItems.length,
    loading,
    searchTerm,
    filterStatus,
    filterCategory,
    showModal,
    viewMode,
  ]);

  return (
    <PageLayout
      title="Gestión de Inventario"
      subtitle="Control de stock de combustibles en tiempo real - SAP Fiori"
      actions={headerActions}
      stats={statsComponent}
      filters={filtersComponent}
      loading={loading && inventoryItems.length === 0}
    >
      {mainContent}
    </PageLayout>
  );
};

export default InventoryMain;
