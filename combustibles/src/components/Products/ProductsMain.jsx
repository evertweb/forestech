/**
 * ProductsMain - Gestión dinámica de productos/combustibles
 * Permite ver, crear, editar y eliminar productos con estadísticas
 * 
 * MIGRADO A ZUSTAND (Fase 2 - Sprint 1)
 * - Usa useAuthStore para userProfile
 */

import React, { useState, useEffect } from 'react';
import {
  subscribeToProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../services/FirebaseProductsService';
import { useFirebaseProgressContext } from '../../contexts/FirebaseProgressContext';
import { useAuthStore } from '../../stores';
import { PRODUCT_CATEGORIES } from '../../constants/productTypes';
import { openProductWizardPopup } from '../Popups/PopupManager';
import { POPUP_EVENTS } from '../../services/popupCommunication';
import ProductModal from './ProductModal';
import ProductsStats from './ProductsStats';
import ProductCategoriesManager from './ProductCategoriesManager';
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
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showStats, setShowStats] = useState(true);
  const [showCategoriesManager, setShowCategoriesManager] = useState(false);

  // Permisos de usuario - permitir más roles para gestionar productos
  const canManageProducts = ['admin', 'supervisor', 'manager', 'operator'].includes(
    userProfile?.role
  );

  // Debug: Mostrar información del usuario y permisos en consola
  console.log('🔍 ProductsMain Debug:', {
    userProfile,
    userRole: userProfile?.role,
    canManageProducts,
    allRoles: ['admin', 'supervisor', 'manager', 'operator'],
  });

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToProducts(
      (productsData) => {
        setProducts(productsData);
        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error('Error loading products:', error);
        setError('Error cargando productos');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Inicialización automática de productos DESHABILITADA
  // La app comienza sin productos predefinidos - se crean desde la interfaz
  useEffect(() => {
    console.log('ℹ️ App iniciada sin productos predefinidos - estado limpio:', {
      productsLength: products.length,
      loading,
      canManageProducts,
    });
  }, [products.length, loading, canManageProducts]);

  const handleCreateProduct = () => {
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
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (productId) => {
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
  };

  const handleModalSave = async (productData) => {
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
  };

  // Filtrar productos
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const headerActions = canManageProducts ? (
    <div className="apple-content-actions">
      <button
        className="apple-button apple-button-primary"
        onClick={handleCreateProduct}
      >
        ➕ Nuevo producto
      </button>

      <button
        className="apple-button apple-button-secondary"
        onClick={() => setShowCategoriesManager(!showCategoriesManager)}
        style={{ marginLeft: '10px' }}
      >
        🏷️ Gestionar Categorías
      </button>
    </div>
  ) : null;

  const filtersComponent = (
    <div className="apple-content-section">
      <div className="apple-form-row">
        <div className="apple-form-group">
          <input
            type="text"
            placeholder="🔍 Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="apple-form-input"
          />
        </div>

        <div className="apple-form-group">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="apple-form-select"
          >
            <option value="">🏷️ Todas las categorías</option>
            {Object.values(PRODUCT_CATEGORIES).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="apple-form-group">
          <button
            className={`apple-button ${showStats ? 'apple-button-primary' : 'apple-button-secondary'}`}
            onClick={() => setShowStats(!showStats)}
          >
            📊 Estadísticas
          </button>
        </div>
      </div>
    </div>
  );

  const tableContent = (
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
                <p className="apple-card-subtitle">{product.category}</p>
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

                  {canManageProducts && (
                    <>
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
                    </>
                  )}
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
            {searchTerm || selectedCategory
              ? 'No se encontraron productos con los filtros aplicados.'
              : 'Aún no hay productos registrados.'}
          </p>
          {canManageProducts && !searchTerm && !selectedCategory && (
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
  );

  return (
    <PageLayout
      title="🛢️ Gestión de Productos"
      subtitle="Administra los tipos de combustibles y productos disponibles"
      actions={headerActions}
      stats={
        showStats &&
        (loading ? (
          <ShimmerCardsGrid cards={4} columns={4} variant="stat" className="products-cards-grid" />
        ) : (
          <ProductsStats products={products} />
        ))
      }
      filters={filtersComponent}
      loading={loading}
    >
      {tableContent}

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        mode={modalMode}
        onSave={handleModalSave}
        userRole={userProfile?.role}
      />

      {/* Gestor de Categorías */}
      {showCategoriesManager && (
        <ProductCategoriesManager
          onClose={() => setShowCategoriesManager(false)}
          onCategoryCreated={() => {
            // Refrescar productos si es necesario
            console.log('Nueva categoría creada');
          }}
        />
      )}
    </PageLayout>
  );
};

export default ProductsMain;
