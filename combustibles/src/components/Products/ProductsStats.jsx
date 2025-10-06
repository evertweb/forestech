/**
 * ProductsStats - Estadísticas de productos/combustibles
 * Muestra métricas de stock, entradas, salidas por tipo de producto
 */

import React, { useState, useEffect, memo } from 'react';
import { subscribeToMovements } from '../../services/FirebaseMovementsService';
import { formatCurrency, formatNumber } from '../../utils/calculations';
import './ProductsStats-SAP.css';

const ProductsStatsComponent = ({ products }) => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log('📈 ProductsStats render', {
    productsCount: products?.length || 0,
  });

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
    const stats = products.map((product) => {
      // 🔧 Normalizar comparaciones de fuelType
      const normalizedProductName = product.name?.toUpperCase();
      const normalizedDisplayName = product.displayName?.toUpperCase();

      const productMovements = movements.filter((mov) => {
        const movFuelType = mov.fuelType?.toUpperCase();
        return movFuelType === normalizedProductName || movFuelType === normalizedDisplayName;
      });

      const entries = productMovements.filter((mov) => mov.type === 'entrada');
      const exits = productMovements.filter((mov) => mov.type === 'salida');

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
        stockStatus: getStockStatus(product),
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

  if (loading) {
    return (
      <div className="products-stats sap-theme loading">
        <div className="loading-spinner sap-theme" />
        <p className="sap-text">Cargando estadísticas...</p>
      </div>
    );
  }

  const productStats = calculateProductStats();

  // Estadísticas generales
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.isActive).length;
  const totalStockValue = productStats.reduce((sum, p) => sum + p.totalValue, 0);
  const lowStockProducts = productStats.filter(
    (p) => p.stockStatus === 'low' || p.stockStatus === 'empty'
  ).length;

  // Porcentajes para KPIs
  const percentActive = totalProducts > 0 ? Math.round((activeProducts / totalProducts) * 100) : 0;
  const percentLow = totalProducts > 0 ? Math.round((lowStockProducts / totalProducts) * 100) : 0;

  return (
    <div className="products-stats sap-theme">
      <h2 className="sap-title">📊 Estadísticas de Productos</h2>

      {/* 1) KPIs (nuevo orden y estilo) */}
      <div className="sap-kpi-grid">
        {/* Activos */}
        <div className="sap-card sap-kpi-card">
          <div className="kpi-header">
            <span className="kpi-icon">✅</span>
            <span className="kpi-title">Productos Activos</span>
          </div>
          <div className="kpi-value">{formatNumber(activeProducts)}</div>
          <div className="kpi-sub">de {formatNumber(totalProducts)} totales</div>
          <div className="kpi-progress">
            <div className="kpi-bar success" style={{ width: `${percentActive}%` }} />
          </div>
        </div>

        {/* Total */}
        <div className="sap-card sap-kpi-card">
          <div className="kpi-header">
            <span className="kpi-icon">📦</span>
            <span className="kpi-title">Total de Productos</span>
          </div>
          <div className="kpi-value">{formatNumber(totalProducts)}</div>
          <div className="kpi-sub">Registrados</div>
          <div className="kpi-progress ghost">
            <div className="kpi-bar neutral" style={{ width: '100%' }} />
          </div>
        </div>

        {/* Stock Bajo */}
        <div className="sap-card sap-kpi-card">
          <div className="kpi-header">
            <span className="kpi-icon">⚠️</span>
            <span className="kpi-title">Stock Bajo</span>
          </div>
          <div className={`kpi-value ${percentLow > 0 ? 'warning' : ''}`}>
            {formatNumber(lowStockProducts)}
          </div>
          <div className="kpi-sub">{percentLow}% del total</div>
          <div className="kpi-progress">
            <div
              className={`kpi-bar ${percentLow > 0 ? 'warning' : 'neutral'}`}
              style={{ width: `${percentLow}%` }}
            />
          </div>
        </div>

        {/* Valor total */}
        <div className="sap-card sap-kpi-card">
          <div className="kpi-header">
            <span className="kpi-icon">💰</span>
            <span className="kpi-title">Valor Total Stock</span>
          </div>
          <div className="kpi-value">{formatCurrency(totalStockValue)}</div>
          <div className="kpi-sub">Estimado</div>
          <div className="kpi-progress ghost">
            <div className="kpi-bar info" style={{ width: '60%' }} />
          </div>
        </div>
      </div>

      {/* 2) Top productos por stock */}
      <div className="stats-top-products sap-card">
        <h3 className="sap-title">🏆 Top Productos por Stock</h3>
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
                <div className="product-value">{formatCurrency(product.totalValue)}</div>
              </div>
            ))}
        </div>
      </div>

      {/* 4) Alertas */}
      {lowStockProducts > 0 && (
        <div className="stats-alerts sap-card">
          <h3 className="sap-title">⚠️ Alertas de Stock</h3>
          <div className="alerts-list">
            {productStats
              .filter((p) => p.stockStatus === 'low' || p.stockStatus === 'empty')
              .map((product) => (
                <div key={product.id} className={`alert-item ${product.stockStatus}`}>
                  <div className="alert-icon">{product.stockStatus === 'empty' ? '🔴' : '🟡'}</div>
                  <div className="alert-info">
                    <span className="alert-product">{product.displayName}</span>
                    <span className="alert-stock">
                      Stock: {formatNumber(product.currentStock || 0)} {product.unit}
                      {product.stockStatus === 'empty' && ' - ¡SIN STOCK!'}
                      {product.stockStatus === 'low' && ` - Mínimo: ${product.minThreshold}`}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

const propsAreEqual = (prevProps, nextProps) => {
  return prevProps.products === nextProps.products;
};

const ProductsStats = memo(ProductsStatsComponent, propsAreEqual);

export default ProductsStats;
