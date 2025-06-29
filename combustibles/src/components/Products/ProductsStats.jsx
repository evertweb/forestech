/**
 * ProductsStats - Estadísticas de productos/combustibles
 * Muestra métricas de stock, entradas, salidas por tipo de producto
 */

import React, { useState, useEffect } from 'react';
import { subscribeToMovements } from '../../services/movementsService';
import { PRODUCT_CATEGORIES } from '../../constants/productTypes';
import { formatCurrency, formatNumber } from '../../utils/calculations';

const ProductsStats = ({ products }) => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToMovements(
      (movementsData) => {
        setMovements(movementsData);
        setLoading(false);
      },
      (error) => {
        console.error('Error loading movements for stats:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Calcular estadísticas por producto
  const calculateProductStats = () => {
    const stats = products.map(product => {
      const productMovements = movements.filter(mov => 
        mov.fuelType === product.name || mov.fuelType === product.displayName
      );

      const entries = productMovements.filter(mov => mov.type === 'entrada');
      const exits = productMovements.filter(mov => mov.type === 'salida');
      
      const totalEntries = entries.reduce((sum, mov) => sum + (mov.quantity || 0), 0);
      const totalExits = exits.reduce((sum, mov) => sum + (mov.quantity || 0), 0);
      const totalValue = (product.currentStock || 0) * (product.defaultPrice || 0);

      return {
        ...product,
        totalEntries,
        totalExits,
        totalValue,
        entriesCount: entries.length,
        exitsCount: exits.length,
        stockStatus: getStockStatus(product)
      };
    });

    return stats;
  };

  const getStockStatus = (product) => {
    const stock = product.currentStock || 0;
    const minThreshold = product.minThreshold || 0;
    const maxCapacity = product.maxCapacity || 1000;

    if (stock === 0) return 'empty';
    if (stock <= minThreshold) return 'low';
    if (stock >= maxCapacity * 0.9) return 'high';
    return 'normal';
  };

  // Calcular estadísticas por categoría
  const calculateCategoryStats = (productStats) => {
    const categories = {};
    
    Object.values(PRODUCT_CATEGORIES).forEach(category => {
      const categoryProducts = productStats.filter(p => p.category === category);
      
      categories[category] = {
        totalProducts: categoryProducts.length,
        totalStock: categoryProducts.reduce((sum, p) => sum + (p.currentStock || 0), 0),
        totalValue: categoryProducts.reduce((sum, p) => sum + p.totalValue, 0),
        totalEntries: categoryProducts.reduce((sum, p) => sum + p.totalEntries, 0),
        totalExits: categoryProducts.reduce((sum, p) => sum + p.totalExits, 0),
        lowStockCount: categoryProducts.filter(p => p.stockStatus === 'low' || p.stockStatus === 'empty').length
      };
    });

    return categories;
  };

  if (loading) {
    return (
      <div className="products-stats loading">
        <div className="loading-spinner"></div>
        <p>Cargando estadísticas...</p>
      </div>
    );
  }

  const productStats = calculateProductStats();
  const categoryStats = calculateCategoryStats(productStats);

  // Estadísticas generales
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.isActive).length;
  const totalStockValue = productStats.reduce((sum, p) => sum + p.totalValue, 0);
  const lowStockProducts = productStats.filter(p => p.stockStatus === 'low' || p.stockStatus === 'empty').length;

  return (
    <div className="products-stats">
      <h2>📊 Estadísticas de Productos</h2>
      
      {/* Estadísticas Generales */}
      <div className="stats-general">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>{formatNumber(totalProducts)}</h3>
            <p>Total Productos</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{formatNumber(activeProducts)}</h3>
            <p>Productos Activos</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>{formatCurrency(totalStockValue)}</h3>
            <p>Valor Total Stock</p>
          </div>
        </div>
        
        <div className={`stat-card ${lowStockProducts > 0 ? 'alert' : ''}`}>
          <div className="stat-icon">⚠️</div>
          <div className="stat-info">
            <h3>{formatNumber(lowStockProducts)}</h3>
            <p>Stock Bajo</p>
          </div>
        </div>
      </div>

      {/* Estadísticas por Categoría */}
      <div className="stats-categories">
        <h3>📈 Por Categoría</h3>
        <div className="categories-grid">
          {Object.entries(categoryStats).map(([category, stats]) => (
            <div key={category} className="category-card">
              <h4>{category}</h4>
              <div className="category-stats">
                <div className="stat-row">
                  <span>Productos:</span>
                  <span>{formatNumber(stats.totalProducts)}</span>
                </div>
                <div className="stat-row">
                  <span>Stock Total:</span>
                  <span>{formatNumber(stats.totalStock)} unidades</span>
                </div>
                <div className="stat-row">
                  <span>Valor:</span>
                  <span>{formatCurrency(stats.totalValue)}</span>
                </div>
                <div className="stat-row">
                  <span>Entradas:</span>
                  <span className="positive">{formatNumber(stats.totalEntries)}</span>
                </div>
                <div className="stat-row">
                  <span>Salidas:</span>
                  <span className="negative">{formatNumber(stats.totalExits)}</span>
                </div>
                {stats.lowStockCount > 0 && (
                  <div className="stat-row alert">
                    <span>Stock Bajo:</span>
                    <span>{formatNumber(stats.lowStockCount)}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top 5 productos por stock */}
      <div className="stats-top-products">
        <h3>🏆 Top Productos por Stock</h3>
        <div className="top-products-list">
          {productStats
            .sort((a, b) => (b.currentStock || 0) - (a.currentStock || 0))
            .slice(0, 5)
            .map((product, index) => (
              <div key={product.id} className="top-product-item">
                <div className="rank">#{index + 1}</div>
                <div className="product-icon" style={{ color: product.color }}>
                  {product.icon}
                </div>
                <div className="product-info">
                  <span className="product-name">{product.displayName}</span>
                  <span className="product-stock">
                    {formatNumber(product.currentStock || 0)} {product.unit}
                  </span>
                </div>
                <div className="product-value">
                  {formatCurrency(product.totalValue)}
                </div>
              </div>
            ))
          }
        </div>
      </div>

      {/* Alertas de stock */}
      {lowStockProducts > 0 && (
        <div className="stats-alerts">
          <h3>⚠️ Alertas de Stock</h3>
          <div className="alerts-list">
            {productStats
              .filter(p => p.stockStatus === 'low' || p.stockStatus === 'empty')
              .map(product => (
                <div key={product.id} className={`alert-item ${product.stockStatus}`}>
                  <div className="alert-icon">
                    {product.stockStatus === 'empty' ? '🔴' : '🟡'}
                  </div>
                  <div className="alert-info">
                    <span className="alert-product">{product.displayName}</span>
                    <span className="alert-stock">
                      Stock: {formatNumber(product.currentStock || 0)} {product.unit}
                      {product.stockStatus === 'empty' && ' - ¡SIN STOCK!'}
                      {product.stockStatus === 'low' && ` - Mínimo: ${product.minThreshold}`}
                    </span>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsStats;