// combustibles/src/components/Suppliers/SuppliersStats.jsx
// Componente de estadísticas de proveedores
import React, { useState } from 'react';
import { formatNumber, formatPercentage } from '../../utils/calculations';
import { useSupplierStatusColors } from '../../hooks/useStatusColors';

const SuppliersStats = ({ stats, suppliersCount, totalSuppliers }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { getStatusColor } = useSupplierStatusColors();
  
  if (!stats) return null;

  const toggleAccordion = () => {
    setIsExpanded(!isExpanded);
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
    <div className="suppliers-stats sap-theme">
      {/* Main Stats */}
      <div className="stats-grid sap-theme">
        <div className="stat-card primary sap-theme">
          <div className="stat-icon sap-theme">
            🏢
          </div>
          <div className="stat-content sap-theme">
            <div className="stat-value sap-theme">{formatNumber(stats.total)}</div>
            <div className="stat-label sap-theme">Total Proveedores</div>
            {totalSuppliers !== suppliersCount && (
              <div className="stat-sublabel sap-theme">
                {formatNumber(suppliersCount)} mostrados
              </div>
            )}
          </div>
        </div>

        <div className="stat-card success sap-theme">
          <div className="stat-icon sap-theme">
            ✅
          </div>
          <div className="stat-content sap-theme">
            <div className="stat-value sap-theme">{formatNumber(stats.active)}</div>
            <div className="stat-label sap-theme">Activos</div>
            <div className="stat-sublabel sap-theme">
              {formatPercentage(stats.total > 0 ? stats.active / stats.total : 0)}
            </div>
          </div>
        </div>

        <div className="stat-card warning sap-theme">
          <div className="stat-icon sap-theme">
            ⭐
          </div>
          <div className="stat-content sap-theme">
            <div className="stat-value sap-theme">{formatNumber(stats.preferred)}</div>
            <div className="stat-label sap-theme">Preferidos</div>
            <div className="stat-sublabel sap-theme">
              {formatPercentage(stats.active > 0 ? stats.preferred / stats.active : 0)}
            </div>
          </div>
        </div>

        <div className="stat-card info sap-theme">
          <div className="stat-icon sap-theme">
            🏆
          </div>
          <div className="stat-content sap-theme">
            <div className="stat-value sap-theme">{stats.averageRating.toFixed(1)}</div>
            <div className="stat-label sap-theme">Rating Promedio</div>
            <div className="stat-sublabel sap-theme">
              <div className="rating-stars sap-theme">{[1, 2, 3, 4, 5].map(star => (
                  <span 
                    key={star} 
                    className={`star sap-theme ${star <= Math.round(stats.averageRating) ? 'filled' : ''}`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Accordion Toggle Button */}
      <div className="stats-accordion-header sap-theme">
        <button 
          className="accordion-toggle-btn sap-theme"
          onClick={toggleAccordion}
          aria-expanded={isExpanded}
          aria-controls="detailed-stats"
        >
          <span className="accordion-title sap-theme">Estadísticas Detalladas</span>
          <span className={`accordion-icon sap-theme ${isExpanded ? 'expanded' : ''}`}>
            📊
          </span>
          <span className={`accordion-chevron sap-theme ${isExpanded ? 'expanded' : ''}`}>
            ▼
          </span>
        </button>
      </div>

      {/* Detailed Stats - Accordion Content */}
      <div 
        id="detailed-stats"
        className={`stats-accordion-content sap-theme ${isExpanded ? 'expanded' : 'collapsed'}`}
        aria-hidden={!isExpanded}
      >
      <div className="stats-details sap-theme">
        {/* Status Distribution */}
        <div className="stats-section sap-theme">
          <h3 className="sap-theme">Estado de Proveedores</h3>
          <div className="stats-breakdown sap-theme">
            <div className="breakdown-item sap-theme">
              <div className="breakdown-label sap-theme">
                <span 
                  className="status-dot sap-theme" 
                  style={{ backgroundColor: getStatusColor('active') }}
                ></span>
                Activos
              </div>
              <div className="breakdown-value sap-theme">{stats.active}</div>
              <div className="breakdown-percentage sap-theme">
                {formatPercentage(stats.total > 0 ? stats.active / stats.total : 0)}
              </div>
            </div>

            {stats.inactive > 0 && (
              <div className="breakdown-item sap-theme">
                <div className="breakdown-label sap-theme">
                  <span 
                    className="status-dot sap-theme" 
                    style={{ backgroundColor: getStatusColor('inactive') }}
                  ></span>
                  Inactivos
                </div>
                <div className="breakdown-value sap-theme">{stats.inactive}</div>
                <div className="breakdown-percentage sap-theme">
                  {formatPercentage(stats.total > 0 ? stats.inactive / stats.total : 0)}
                </div>
              </div>
            )}

            {stats.suspended > 0 && (
              <div className="breakdown-item sap-theme">
                <div className="breakdown-label sap-theme">
                  <span 
                    className="status-dot sap-theme" 
                    style={{ backgroundColor: getStatusColor('suspended') }}
                  ></span>
                  Suspendidos
                </div>
                <div className="breakdown-value sap-theme">{stats.suspended}</div>
                <div className="breakdown-percentage sap-theme">
                  {formatPercentage(stats.total > 0 ? stats.suspended / stats.total : 0)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Category Distribution */}
        {Object.keys(stats.byCategory).length > 0 && (
          <div className="stats-section sap-theme">
            <h3 className="sap-theme">Por Categoría</h3>
            <div className="stats-breakdown sap-theme">
              {Object.entries(stats.byCategory)
                .sort(([,a], [,b]) => b - a)
                .map(([category, count]) => (
                <div key={category} className="breakdown-item sap-theme">
                  <div className="breakdown-label sap-theme">
                    <span className="category-icon sap-theme">
                      {getCategoryIcon(category)}
                    </span>
                    {category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}
                  </div>
                  <div className="breakdown-value sap-theme">{count}</div>
                  <div className="breakdown-percentage sap-theme">
                    {formatPercentage(stats.total > 0 ? count / stats.total : 0)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Type Distribution */}
        {Object.keys(stats.byType).length > 0 && (
          <div className="stats-section sap-theme">
            <h3 className="sap-theme">Por Tipo</h3>
            <div className="stats-breakdown sap-theme">
              {Object.entries(stats.byType)
                .sort(([,a], [,b]) => b - a)
                .map(([type, count]) => (
                <div key={type} className="breakdown-item sap-theme">
                  <div className="breakdown-label sap-theme">
                    <span className="type-icon sap-theme">
                      {getTypeIcon(type)}
                    </span>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </div>
                  <div className="breakdown-value sap-theme">{count}</div>
                  <div className="breakdown-percentage sap-theme">
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
    </div>
  );
};

export default SuppliersStats;