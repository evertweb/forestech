/**
 * ProductsMain - Gestión dinámica de productos/combustibles
 * Permite ver, crear, editar y eliminar productos con estadísticas
 */

import React, { useState, useEffect } from 'react';
import {
  subscribeToProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../services/productsService';
import { useFirebaseProgressContext } from '../../contexts/FirebaseProgressContext';
import { PRODUCT_INFO, PRODUCT_CATEGORIES } from '../../constants/productTypes';
import ProductModal from './ProductModal';
import ProductsStats from './ProductsStats';
import ProductCategoriesManager from './ProductCategoriesManager';
import { PageLayout } from '../shared';
import './ProductsMain-SAP.css';

const ProductsMain = ({ userProfile }) => {
  // Hook para progreso transparente de Firebase
  const { executeWithProgress } = useFirebaseProgressContext();

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

  // Permisos de usuario
  const canManageProducts = ['admin', 'supervisor'].includes(userProfile?.role);

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

  // Inicializar productos predefinidos si no existen
  useEffect(() => {
    const initializePredefinedProducts = async () => {
      console.log('🔍 Debug - Inicializando productos:', {
        productsLength: products.length,
        loading,
        canManageProducts,
      });

      if (products.length === 0 && !loading && canManageProducts) {
        try {
          console.log('🚀 Creando productos predefinidos...');
          const predefinedProducts = getAllProducts();
          console.log('📦 Productos predefinidos:', predefinedProducts);

          for (const productInfo of predefinedProducts) {
            console.log('➕ Creando producto:', productInfo.name);
            await createProduct({
              name: productInfo.name,
              displayName: productInfo.displayName,
              category: productInfo.category,
              unit: productInfo.unit,
              defaultPrice: productInfo.defaultPrice,
              color: productInfo.color,
              icon: productInfo.icon,
              description: productInfo.description,
              isActive: true,
              currentStock: 0,
              minThreshold: 10,
              maxCapacity: 1000,
            });
          }
          console.log('✅ Productos predefinidos creados exitosamente');
        } catch (error) {
          console.error('❌ Error inicializando productos:', error);
        }
      } else {
        console.log('ℹ️ No se inicializan productos:', {
          reason:
            products.length > 0
              ? 'Ya existen productos'
              : loading
                ? 'Está cargando'
                : !canManageProducts
                  ? 'Sin permisos'
                  : 'Otra razón',
        });
      }
    };

    initializePredefinedProducts();
  }, [products.length, loading, canManageProducts]);

  const handleCreateProduct = () => {
    setSelectedProduct(null);
    setModalMode('create');
    setIsModalOpen(true);
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
    <div className="header-actions sap-theme">
      <button
        className="btn-primary sap-theme sap-button sap-button-primary"
        onClick={handleCreateProduct}
      >
        ➕ Nuevo producto
      </button>

      <button
        className="btn-secondary sap-theme sap-button sap-button-secondary"
        onClick={() => setShowCategoriesManager(!showCategoriesManager)}
        style={{ marginLeft: '10px' }}
      >
        🏷️ Gestionar Categorías
      </button>
      <button
        className="btn-secondary sap-theme sap-button sap-button-secondary"
        onClick={async () => {
          try {
            console.log('🧪 Forzando creación de productos predefinidos...');
            const predefinedProducts = getAllProducts();
            for (const productInfo of predefinedProducts) {
              await createProduct({
                name: productInfo.name,
                displayName: productInfo.displayName,
                category: productInfo.category,
                unit: productInfo.unit,
                defaultPrice: productInfo.defaultPrice,
                color: productInfo.color,
                icon: productInfo.icon,
                description: productInfo.description,
                isActive: true,
                currentStock: 0,
                minThreshold: 10,
                maxCapacity: 1000,
              });
            }
            alert('Productos predefinidos creados exitosamente');
          } catch (error) {
            console.error('Error:', error);
            alert('Error creando productos: ' + error.message);
          }
        }}
        style={{ marginLeft: '10px' }}
      >
        🧪 Crear Predefinidos
      </button>
    </div>
  ) : null;

  const filtersComponent = (
    <div className="products-filters sap-theme">
      <div className="filter-group sap-theme">
        <input
          type="text"
          placeholder="🔍 Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input sap-theme sap-input"
        />
      </div>

      <div className="filter-group sap-theme">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="filter-select sap-theme sap-select"
        >
          <option value="">🏷️ Todas las categorías</option>
          {Object.values(PRODUCT_CATEGORIES).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group sap-theme">
        <button
          className={`toggle-btn sap-theme sap-button ${showStats ? 'active sap-button-primary' : 'sap-button-secondary'}`}
          onClick={() => setShowStats(!showStats)}
        >
          📊 Estadísticas
        </button>
      </div>
    </div>
  );

  const tableContent = (
    <>
      {error && <div className="error-message sap-theme sap-message-error">⚠️ {error}</div>}

      <div className="products-grid sap-theme">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-card sap-theme sap-card">
            <div className="product-icon sap-theme" style={{ color: product.color }}>
              {product.icon}
            </div>

            <div className="product-info sap-theme">
              <h3 className="sap-title">{product.displayName}</h3>
              <p className="product-category sap-theme sap-text-secondary">{product.category}</p>
              <p className="product-description sap-theme sap-text">{product.description}</p>

              <div className="product-stats sap-theme">
                <div className="stat sap-theme">
                  <span className="stat-label sap-theme sap-text-secondary">Stock:</span>
                  <span className="stat-value sap-theme sap-text-primary">
                    {product.currentStock || 0} {product.unit}
                  </span>
                </div>
                <div className="stat sap-theme">
                  <span className="stat-label sap-theme sap-text-secondary">Precio:</span>
                  <span className="stat-value sap-theme sap-text-primary">
                    ${new Intl.NumberFormat('es-CO').format(product.defaultPrice || 0)}
                  </span>
                </div>
              </div>

              <div
                className={`product-status sap-theme sap-badge ${product.isActive ? 'active sap-badge-success' : 'inactive sap-badge-error'}`}
              >
                {product.isActive ? '✅ Activo' : '❌ Inactivo'}
              </div>
            </div>

            <div className="product-actions sap-theme">
              <button
                className="btn-secondary sap-theme sap-button sap-button-secondary"
                onClick={() => handleViewProduct(product)}
              >
                👁️ Ver
              </button>

              {canManageProducts && (
                <>
                  <button
                    className="btn-primary sap-theme sap-button sap-button-primary"
                    onClick={() => handleEditProduct(product)}
                  >
                    ✏️ Editar
                  </button>

                  <button
                    className="btn-danger sap-theme sap-button sap-button-danger"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    🗑️ Eliminar
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="empty-state sap-theme sap-message-info">
          <div className="empty-icon sap-theme">📦</div>
          <h3 className="sap-title">No hay productos</h3>
          <p className="sap-text">
            {searchTerm || selectedCategory
              ? 'No se encontraron productos con los filtros aplicados.'
              : 'Aún no hay productos registrados.'}
          </p>
          {canManageProducts && !searchTerm && !selectedCategory && (
            <button
              className="btn-primary sap-theme sap-button sap-button-primary"
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
      stats={showStats && <ProductsStats products={products} />}
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
