/**
 * ProductsStats - Estadísticas de productos/combustibles
 * Muestra métricas de stock, entradas, salidas por tipo de producto
 */

import React, { useState, useEffect, useMemo } from 'react';
import { subscribeToMovements } from '../../services/movementsService';
import { PRODUCT_CATEGORIES } from '../../constants/productTypes';
import { formatCurrency, formatNumber } from '../../utils/calculations';
import './ProductsStats-SAP.css';

const ProductsStats = ({ products }) => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState(new Set());

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
      const productMovements = movements.filter(
        (mov) => mov.fuelType === product.name || mov.fuelType === product.displayName
      );

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

  // Calcular estadísticas por categoría
  const calculateCategoryStats = (productStats) => {
    const categories = {};

    Object.values(PRODUCT_CATEGORIES).forEach((category) => {
      const categoryProducts = productStats.filter((p) => p.category === category);

      categories[category] = {
        totalProducts: categoryProducts.length,
        totalStock: categoryProducts.reduce((sum, p) => sum + (p.currentStock || 0), 0),
        totalValue: categoryProducts.reduce((sum, p) => sum + p.totalValue, 0),
        totalEntries: categoryProducts.reduce((sum, p) => sum + p.totalEntries, 0),
        totalExits: categoryProducts.reduce((sum, p) => sum + p.totalExits, 0),
        lowStockCount: categoryProducts.filter(
          (p) => p.stockStatus === 'low' || p.stockStatus === 'empty'
        ).length,
      };
    });

    return categories;
  };

  // Sparkline simple (SVG) para tendencias mensuales
  const Sparkline = ({
    values = [],
    width = 120,
    height = 28,
    color = 'var(--sap-information)',
  }) => {
    if (!values.length) return <svg width={width} height={height} />;
    const max = Math.max(...values, 1);
    const stepX = width / (values.length - 1 || 1);
    const points = values
      .map((v, i) => {
        const x = i * stepX;
        const y = height - (v / max) * (height - 4) - 2; // paddings
        return `${x},${y}`;
      })
      .join(' ');
    return (
      <svg width={width} height={height} className="sparkline" aria-hidden="true">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          points={points}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    );
  };

  // Serie por categoría: total movimientos (entradas + salidas) últimos 6 meses
  const categorySeries = useMemo(() => {
    const byCategory = {};
    const now = new Date();
    const months = Array.from({ length: 6 }).map(
      (_, i) => new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    );

    // Map de producto -> categoría para filtrar rápido
    const productToCategory = products.reduce((acc, p) => {
      acc[p.name] = p.category;
      acc[p.displayName] = p.category;
      return acc;
    }, {});

    months.forEach((m) => {
      const key = `${m.getFullYear()}-${m.getMonth()}`;
      movements.forEach((mov) => {
        const cat = productToCategory[mov.fuelType];
        if (!cat) return;
        const dt = mov.createdAt?.toDate
          ? mov.createdAt.toDate()
          : mov.createdAt
            ? new Date(mov.createdAt)
            : null;
        if (!dt) return;
        if (dt.getFullYear() === m.getFullYear() && dt.getMonth() === m.getMonth()) {
          byCategory[cat] = byCategory[cat] || {};
          byCategory[cat][key] = (byCategory[cat][key] || 0) + 1;
        }
      });
    });

    const series = {};
    Object.keys(PRODUCT_CATEGORIES).forEach(() => {}); // mantener orden de importación
    Object.values(PRODUCT_CATEGORIES).forEach((cat) => {
      const values = months.map((m) => {
        const k = `${m.getFullYear()}-${m.getMonth()}`;
        return byCategory[cat]?.[k] || 0;
      });
      series[cat] = values;
    });
    return { months, series };
  }, [movements, products]);

  // Función para toggle del acordeón
  const toggleCategory = (category) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
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
  const categoryStats = calculateCategoryStats(productStats);

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

      {/* 3) Por Categoría - Estilo Acordeón */}
      <div className="stats-categories">
        <h3 className="sap-title">📈 Distribución por Categoría</h3>
        <div className="categories-accordion">
          {Object.values(PRODUCT_CATEGORIES)
            .sort() // Ordenar alfabéticamente
            .map((category) => {
              const stats = categoryStats[category];
              if (!stats) return null;

              const isExpanded = expandedCategories.has(category);
              const hasData = stats.totalProducts > 0;

              return (
                <div key={category} className={`accordion-item ${isExpanded ? 'expanded' : ''}`}>
                  <button
                    className={`accordion-header ${hasData ? 'has-data' : 'no-data'}`}
                    onClick={() => toggleCategory(category)}
                    aria-expanded={isExpanded}
                  >
                    <div className="accordion-title">
                      <span className="category-name">{category}</span>
                      <span className="category-summary">
                        {hasData
                          ? `${stats.totalProducts} productos • ${formatCurrency(stats.totalValue)}`
                          : 'Sin productos'}
                      </span>
                    </div>
                    <div className="accordion-icons">
                      <div className="category-sparkline">
                        <Sparkline
                          values={categorySeries.series[category] || []}
                          width={80}
                          height={20}
                        />
                      </div>
                      <span className={`accordion-arrow ${isExpanded ? 'rotated' : ''}`}>▼</span>
                    </div>
                  </button>

                  <div className={`accordion-content ${isExpanded ? 'expanded' : 'collapsed'}`}>
                    <div className="category-stats">
                      <div className="stats-grid">
                        <div className="stat-item">
                          <span className="stat-label">Productos</span>
                          <span className="stat-value">{formatNumber(stats.totalProducts)}</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Stock Total</span>
                          <span className="stat-value">{formatNumber(stats.totalStock)}</span>
                          <span className="stat-unit">unidades</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Valor Total</span>
                          <span className="stat-value">{formatCurrency(stats.totalValue)}</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Entradas</span>
                          <span className="stat-value positive">
                            {formatNumber(stats.totalEntries)}
                          </span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Salidas</span>
                          <span className="stat-value negative">
                            {formatNumber(stats.totalExits)}
                          </span>
                        </div>
                        {stats.lowStockCount > 0 && (
                          <div className="stat-item alert">
                            <span className="stat-label">Stock Bajo</span>
                            <span className="stat-value">{formatNumber(stats.lowStockCount)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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

export default ProductsStats;
