/**
 * ProductsMain - Gestión dinámica de productos/combustibles
 * Permite ver, crear, editar y eliminar productos con estadísticas
 */

import React, { useState, useEffect } from 'react';
import { subscribeToProducts, createProduct, updateProduct, deleteProduct } from '../../services/productsService';
import { PRODUCT_INFO, PRODUCT_CATEGORIES, getAllProducts } from '../../constants/productTypes';
import ProductModal from './ProductModal';
import ProductsStats from './ProductsStats';
import './Products.css';

const ProductsMain = ({ userProfile }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalMode, setModalMode] = useState('create');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showStats, setShowStats] = useState(true);

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
      if (products.length === 0 && !loading && canManageProducts) {
        try {
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
              maxCapacity: 1000
            });
          }
        } catch (error) {
          console.error('Error inicializando productos:', error);
        }
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
        await deleteProduct(productId);
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error al eliminar el producto');
      }
    }
  };

  const handleModalSave = async (productData) => {
    try {
      if (modalMode === 'create') {
        await createProduct(productData);
      } else if (modalMode === 'edit') {
        await updateProduct(selectedProduct.id, productData);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving product:', error);
      throw error;
    }
  };

  // Filtrar productos
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="products-main">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando productos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-main">
        <div className="error-container">
          <p>⚠️ {error}</p>
          <button onClick={() => window.location.reload()}>Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="products-main">
      <div className="products-header">
        <div className="header-title">
          <h1>🛢️ Gestión de Productos</h1>
          <p>Administra los tipos de combustibles y productos disponibles</p>
        </div>
        
        {canManageProducts && (
          <div className="header-actions">
            <button 
              className="btn-primary"
              onClick={handleCreateProduct}
            >
              ➕ Agregar Producto
            </button>
          </div>
        )}
      </div>

      {showStats && <ProductsStats products={products} />}

      <div className="products-filters">
        <div className="filter-group">
          <input
            type="text"
            placeholder="🔍 Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-group">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            <option value="">🏷️ Todas las categorías</option>
            {Object.values(PRODUCT_CATEGORIES).map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <button
            className={`toggle-btn ${showStats ? 'active' : ''}`}
            onClick={() => setShowStats(!showStats)}
          >
            📊 Estadísticas
          </button>
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-icon" style={{ color: product.color }}>
              {product.icon}
            </div>
            
            <div className="product-info">
              <h3>{product.displayName}</h3>
              <p className="product-category">{product.category}</p>
              <p className="product-description">{product.description}</p>
              
              <div className="product-stats">
                <div className="stat">
                  <span className="stat-label">Stock:</span>
                  <span className="stat-value">{product.currentStock || 0} {product.unit}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Precio:</span>
                  <span className="stat-value">
                    ${new Intl.NumberFormat('es-CO').format(product.defaultPrice || 0)}
                  </span>
                </div>
              </div>
              
              <div className={`product-status ${product.isActive ? 'active' : 'inactive'}`}>
                {product.isActive ? '✅ Activo' : '❌ Inactivo'}
              </div>
            </div>

            <div className="product-actions">
              <button
                className="btn-secondary"
                onClick={() => handleViewProduct(product)}
              >
                👁️ Ver
              </button>
              
              {canManageProducts && (
                <>
                  <button
                    className="btn-primary"
                    onClick={() => handleEditProduct(product)}
                  >
                    ✏️ Editar
                  </button>
                  
                  <button
                    className="btn-danger"
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
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No hay productos</h3>
          <p>
            {searchTerm || selectedCategory 
              ? 'No se encontraron productos con los filtros aplicados.'
              : 'Aún no hay productos registrados.'
            }
          </p>
          {canManageProducts && !searchTerm && !selectedCategory && (
            <button className="btn-primary" onClick={handleCreateProduct}>
              ➕ Crear primer producto
            </button>
          )}
        </div>
      )}

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        mode={modalMode}
        onSave={handleModalSave}
        userRole={userProfile?.role}
      />
    </div>
  );
};

export default ProductsMain;