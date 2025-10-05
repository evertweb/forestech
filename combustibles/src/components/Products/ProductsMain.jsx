/**
 * ProductsMain - Gestión dinámica de productos/combustibles
 * Permite ver, crear, editar y eliminar productos con estadísticas
 * 
 * MIGRADO A ZUSTAND (Fase 2 - Sprint 1)
 * - Usa useAuthStore para userProfile
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  subscribeToProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../services/FirebaseProductsService';
import { useFirebaseProgressContext } from '../../contexts/FirebaseProgressContext';
import { useAuthStore } from '../../stores';
import { openProductWizardPopup } from '../Popups/PopupManager';
import { POPUP_EVENTS } from '../../services/popupCommunication';
import ProductModal from './ProductModal';
import ProductsStats from './ProductsStats';
import { PageLayout, ShimmerLoader, ShimmerCardsGrid, ShimmerTable } from '../shared';
import './ProductsMain-SAP.css';

const ProductsMain = () => {
  // Hook para progreso transparente de Firebase
  const { executeWithProgress } = useFirebaseProgressContext();

  // 🔐 Zustand Store - Auth
  const userProfile = useAuthStore(state => state.userProfile);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalMode, setModalMode] = useState('create');
  const [searchTerm, setSearchTerm] = useState('');
  // category removed globally
  const [showStats, setShowStats] = useState(true);


  const toggleShowStats = useCallback(() => {
    setShowStats((prev) => !prev);
  }, []);

  const handleSearchChange = useCallback((event) => {
    setSearchTerm(event.target.value);
  }, []);

  // category filter removed

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setModalMode('create');
  }, []);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToProducts((data, err) => {
      if (err) {
        console.error('Error subscribing to products:', err);
        setError(err?.message || String(err));
        setLoading(false);
        return;
      }

      // data expected to be an array of products
      if (Array.isArray(data)) {
        setProducts(data);
      } else if (data && Array.isArray(data.data)) {
        // compat with service wrapper returning { data }
        setProducts(data.data);
      } else {
        setProducts([]);
      }

      setError(null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Inicialización automática de productos DESHABILITADA
  // La app comienza sin productos predefinidos - se crean desde la interfaz
  useEffect(() => {
    console.log('ℹ️ App iniciada sin productos predefinidos - estado limpio:', {
      productsLength: products.length,
      loading,
    });
  }, [products.length, loading]);

  const handleCreateProduct = useCallback(() => {
    // Datos iniciales para el popup
    const initialData = {
      theme: 'sap-fiori',
      user: userProfile,
      inventory: [], // No necesario para productos
      vehicles: [], // No necesario para productos
      suppliers: [], // No necesario para productos
    };

    // Abrir popup de wizard para crear producto
    const result = openProductWizardPopup(initialData, ({ type, payload }) => {
      switch (type) {
        case POPUP_EVENTS.WIZARD_SUCCESS:
          console.log('✅ Producto creado exitosamente:', payload);
          // El producto se agregará automáticamente por la suscripción a Firestore
          break;
        case POPUP_EVENTS.WIZARD_CANCEL:
        case POPUP_EVENTS.WIZARD_CLOSED:
          console.log('❌ Creación de producto cancelada');
          break;
        case POPUP_EVENTS.WIZARD_ERROR:
          console.error('💥 Error en wizard de producto:', payload);
          break;
        default:
          break;
      }
    });

    if (!result.success) {
      alert(result.error || 'No se pudo abrir el popup. Verifica que no esté bloqueado.');
    }
  }, [userProfile]);

  const handleEditProduct = useCallback((product) => {
    setSelectedProduct(product);
    setModalMode('edit');
    setIsModalOpen(true);
  }, []);

  const handleViewProduct = useCallback((product) => {
    setSelectedProduct(product);
    setModalMode('view');
    setIsModalOpen(true);
  }, []);

  const handleDeleteProduct = useCallback(async (productId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        const progressDescription = `Eliminando producto ${productId}`;

        await executeWithProgress(
          'deleteProduct',
          progressDescription,
          () => deleteProduct(productId),
          { productId }
        );

        console.log('✅ Producto eliminado exitosamente');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error al eliminar el producto');
      }
    }
  }, [executeWithProgress]);

  const handleModalSave = useCallback(async (productData) => {
    try {
      // Generar descripción para el progreso
      const progressDescription =
        modalMode === 'create'
          ? `Creando producto ${productData.name}`
          : `Actualizando producto ${productData.name}`;

      const operationType = modalMode === 'create' ? 'createProduct' : 'updateProduct';

      // Ejecutar con progreso transparente
      await executeWithProgress(
        operationType,
        progressDescription,
        () =>
          modalMode === 'create'
            ? createProduct(productData)
            : updateProduct(selectedProduct.id, productData),
        {
          productName: productData.name,
          isUpdate: modalMode === 'edit',
        }
      );

      setIsModalOpen(false);
      console.log(`✅ Producto ${modalMode === 'create' ? 'creado' : 'actualizado'} exitosamente`);
    } catch (error) {
      console.error('Error saving product:', error);
      throw error;
    }
  }, [executeWithProgress, modalMode, selectedProduct]);

  // Filtrar productos por búsqueda (category eliminado)
  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !normalizedSearch ||
        product.displayName?.toLowerCase().includes(normalizedSearch) ||
        product.name?.toLowerCase().includes(normalizedSearch);

      return matchesSearch;
    });
  }, [products, searchTerm]);

  const headerActions = useMemo(() => (
    <div className="apple-content-actions">
      <button
        className="apple-button apple-button-primary"
        onClick={handleCreateProduct}
      >
        ➕ Nuevo producto
      </button>

    </div>
  ), [handleCreateProduct]);

  const filtersComponent = useMemo(() => (
    <div className="apple-content-section">
      <div className="apple-form-row">
        <div className="apple-form-group">
          <input
            type="text"
            placeholder="🔍 Buscar productos..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="apple-form-input"
          />
        </div>

        <div className="apple-form-group">
          <button
            className={`apple-button ${showStats ? 'apple-button-primary' : 'apple-button-secondary'}`}
            onClick={toggleShowStats}
          >
            📊 Estadísticas
          </button>
        </div>
      </div>
    </div>
  ), [handleSearchChange, searchTerm, showStats, toggleShowStats]);

  const tableContent = useMemo(() => (
    <>
      {error && <div className="apple-form-error">⚠️ {error}</div>}

      <div className="apple-stats-grid">
        {filteredProducts.map((product) => (
          <div key={product.id} className="apple-card">
            <div className="apple-card-header">
              <div className="product-icon" style={{ color: product.color }}>
                {product.icon}
              </div>
              <div className="product-info">
                <h3 className="apple-card-title">{product.displayName}</h3>
                {/* category removed from product display */}
                <p className="apple-body-small text-secondary">{product.description}</p>
              </div>
            </div>

            <div className="apple-card-content">
              <div className="product-stats">
                <div className="stat">
                  <span className="apple-body-small text-secondary">Stock:</span>
                  <span className="apple-body-medium">
                    {product.currentStock || 0} {product.unit}
                  </span>
                </div>
                <div className="stat">
                  <span className="apple-body-small text-secondary">Precio:</span>
                  <span className="apple-body-medium">
                    ${new Intl.NumberFormat('es-CO').format(product.defaultPrice || 0)}
                  </span>
                </div>
              </div>

              <div className="apple-card-footer">
                <div
                  className={`apple-status-badge ${product.isActive ? 'active' : 'inactive'}`}
                >
                  {product.isActive ? '✅ Activo' : '❌ Inactivo'}
                </div>

                <div className="apple-action-buttons">
                  <button
                    className="apple-action-button"
                    onClick={() => handleViewProduct(product)}
                    title="Ver detalles"
                  >
                    👁️
                  </button>

                  <button
                    className="apple-action-button primary"
                    onClick={() => handleEditProduct(product)}
                    title="Editar producto"
                  >
                    ✏️
                  </button>

                  <button
                    className="apple-action-button"
                    onClick={() => handleDeleteProduct(product.id)}
                    title="Eliminar producto"
                    style={{ color: 'var(--interactive-error)' }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="apple-empty-state">
          <div className="apple-empty-icon">📦</div>
          <h3 className="apple-empty-title">No hay productos</h3>
          <p className="apple-empty-description">
            {searchTerm
              ? 'No se encontraron productos con los filtros aplicados.'
              : 'Aún no hay productos registrados.'}
          </p>
          {!searchTerm && (
            <button
              className="apple-button apple-button-primary"
              onClick={handleCreateProduct}
            >
              ➕ Crear primer producto
            </button>
          )}
        </div>
      )}
    </>
  ), [
    error,
    filteredProducts,
    handleCreateProduct,
    handleDeleteProduct,
    handleEditProduct,
    handleViewProduct,
    searchTerm,
  ]);

  const statsComponent = useMemo(() => {
    if (!showStats) {
      return null;
    }

    if (loading) {
      return (
        <ShimmerCardsGrid cards={4} columns={4} variant="stat" className="products-cards-grid" />
      );
    }

    return <ProductsStats products={products} />;
  }, [loading, products, showStats]);

  return (
    <PageLayout
      title="🛢️ Gestión de Productos"
      subtitle="Administra los tipos de combustibles y productos disponibles"
      actions={headerActions}
      stats={statsComponent}
      filters={filtersComponent}
      loading={loading}
    >
      {tableContent}

      <ProductModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        product={selectedProduct}
        mode={modalMode}
        onSave={handleModalSave}
      />
    </PageLayout>
  );
};

export default ProductsMain;
