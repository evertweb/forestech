// combustibles/src/components/Suppliers/SuppliersStats.jsx
// Componente de estadísticas de proveedores
import React from 'react';
import { formatNumber, formatPercentage } from '../../utils/calculations';

const SuppliersStats = ({ stats, suppliersCount, totalSuppliers }) => {
  if (!stats) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#22c55e';
      case 'inactive': return '#ef4444';
      case 'suspended': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'combustibles': return '⛽';
      case 'lubricantes': return '🛢️';
      case 'aditivos': return '🧪';
      default: return '📦';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'proveedor': return '🏪';
      case 'distribuidor': return '🚛';
      case 'mayorista': return '🏭';
      default: return '🏢';
    }
  };

  return (
    <div className="suppliers-stats">
      {/* Main Stats */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">
            <i className="icon-truck"></i>
          </div>
          <div className="stat-content">
            <div className="stat-value">{formatNumber(stats.total)}</div>
            <div className="stat-label">Total Proveedores</div>
            {totalSuppliers !== suppliersCount && (
              <div className="stat-sublabel">
                {formatNumber(suppliersCount)} mostrados
              </div>
            )}
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">
            <i className="icon-check-circle"></i>
          </div>
          <div className="stat-content">
            <div className="stat-value">{formatNumber(stats.active)}</div>
            <div className="stat-label">Activos</div>
            <div className="stat-sublabel">
              {formatPercentage(stats.total > 0 ? stats.active / stats.total : 0)}
            </div>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">
            <i className="icon-star"></i>
          </div>
          <div className="stat-content">
            <div className="stat-value">{formatNumber(stats.preferred)}</div>
            <div className="stat-label">Preferidos</div>
            <div className="stat-sublabel">
              {formatPercentage(stats.active > 0 ? stats.preferred / stats.active : 0)}
            </div>
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon">
            <i className="icon-award"></i>
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.averageRating.toFixed(1)}</div>
            <div className="stat-label">Rating Promedio</div>
            <div className="stat-sublabel">
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map(star => (
                  <span 
                    key={star} 
                    className={`star ${star <= Math.round(stats.averageRating) ? 'filled' : ''}`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="stats-details">
        {/* Status Distribution */}
        <div className="stats-section">
          <h3>Estado de Proveedores</h3>
          <div className="stats-breakdown">
            <div className="breakdown-item">
              <div className="breakdown-label">
                <span 
                  className="status-dot" 
                  style={{ backgroundColor: getStatusColor('active') }}
                ></span>
                Activos
              </div>
              <div className="breakdown-value">{stats.active}</div>
              <div className="breakdown-percentage">
                {formatPercentage(stats.total > 0 ? stats.active / stats.total : 0)}
              </div>
            </div>

            {stats.inactive > 0 && (
              <div className="breakdown-item">
                <div className="breakdown-label">
                  <span 
                    className="status-dot" 
                    style={{ backgroundColor: getStatusColor('inactive') }}
                  ></span>
                  Inactivos
                </div>
                <div className="breakdown-value">{stats.inactive}</div>
                <div className="breakdown-percentage">
                  {formatPercentage(stats.total > 0 ? stats.inactive / stats.total : 0)}
                </div>
              </div>
            )}

            {stats.suspended > 0 && (
              <div className="breakdown-item">
                <div className="breakdown-label">
                  <span 
                    className="status-dot" 
                    style={{ backgroundColor: getStatusColor('suspended') }}
                  ></span>
                  Suspendidos
                </div>
                <div className="breakdown-value">{stats.suspended}</div>
                <div className="breakdown-percentage">
                  {formatPercentage(stats.total > 0 ? stats.suspended / stats.total : 0)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Category Distribution */}
        {Object.keys(stats.byCategory).length > 0 && (
          <div className="stats-section">
            <h3>Por Categoría</h3>
            <div className="stats-breakdown">
              {Object.entries(stats.byCategory)
                .sort(([,a], [,b]) => b - a)
                .map(([category, count]) => (
                <div key={category} className="breakdown-item">
                  <div className="breakdown-label">
                    <span className="category-icon">
                      {getCategoryIcon(category)}
                    </span>
                    {category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}
                  </div>
                  <div className="breakdown-value">{count}</div>
                  <div className="breakdown-percentage">
                    {formatPercentage(stats.total > 0 ? count / stats.total : 0)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Type Distribution */}
        {Object.keys(stats.byType).length > 0 && (
          <div className="stats-section">
            <h3>Por Tipo</h3>
            <div className="stats-breakdown">
              {Object.entries(stats.byType)
                .sort(([,a], [,b]) => b - a)
                .map(([type, count]) => (
                <div key={type} className="breakdown-item">
                  <div className="breakdown-label">
                    <span className="type-icon">
                      {getTypeIcon(type)}
                    </span>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </div>
                  <div className="breakdown-value">{count}</div>
                  <div className="breakdown-percentage">
                    {formatPercentage(stats.total > 0 ? count / stats.total : 0)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Insights */}
      <div className="stats-insights">
        <h3>Información Rápida</h3>
        <div className="insights-grid">
          <div className="insight-item">
            <div className="insight-label">Nivel de Satisfacción</div>
            <div className="insight-value">
              {stats.averageRating >= 4.5 ? 'Excelente' :
               stats.averageRating >= 4.0 ? 'Muy Bueno' :
               stats.averageRating >= 3.5 ? 'Bueno' :
               stats.averageRating >= 3.0 ? 'Regular' : 'Necesita Mejora'}
            </div>
          </div>

          <div className="insight-item">
            <div className="insight-label">Estado General</div>
            <div className="insight-value">
              {stats.active / stats.total >= 0.9 ? 'Excelente' :
               stats.active / stats.total >= 0.8 ? 'Bueno' :
               stats.active / stats.total >= 0.7 ? 'Regular' : 'Revisar'}
            </div>
          </div>

          <div className="insight-item">
            <div className="insight-label">Proveedores Preferidos</div>
            <div className="insight-value">
              {stats.preferred === 0 ? 'Ninguno' :
               stats.preferred / stats.active >= 0.3 ? 'Suficientes' :
               stats.preferred / stats.active >= 0.2 ? 'Buenos' : 'Pocos'}
            </div>
          </div>

          <div className="insight-item">
            <div className="insight-label">Diversificación</div>
            <div className="insight-value">
              {Object.keys(stats.byCategory).length >= 3 ? 'Alta' :
               Object.keys(stats.byCategory).length >= 2 ? 'Media' : 'Baja'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuppliersStats;