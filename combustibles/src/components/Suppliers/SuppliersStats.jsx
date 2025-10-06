// combustibles/src/components/Suppliers/SuppliersStats.jsx
// Resumen simple de métricas para los proveedores en el nuevo esquema
import React from 'react';
import { formatNumber } from '../../utils/calculations';

const STATUS_LABELS = {
  active: { label: 'Activos', icon: '✅' },
  inactive: { label: 'Inactivos', icon: '❌' },
  suspended: { label: 'Suspendidos', icon: '⚠️' },
  other: { label: 'Otros', icon: 'ℹ️' },
};

const SuppliersStats = ({ stats, visibleCount }) => {
  if (!stats) {
    return null;
  }

  const topCategories = Object.entries(stats.byCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  const paymentTerms = Object.entries(stats.byPaymentTerms).sort(([, a], [, b]) => b - a);

  return (
    <div className="suppliers-stats sap-theme">
      <div className="stats-grid sap-theme">
        <div className="stat-card primary sap-theme">
          <div className="stat-icon sap-theme">🏢</div>
          <div className="stat-content sap-theme">
            <div className="stat-value sap-theme">{formatNumber(stats.total)}</div>
            <div className="stat-label sap-theme">Proveedores totales</div>
            <div className="stat-sublabel sap-theme">
              {formatNumber(visibleCount)} visibles en la vista actual
            </div>
          </div>
        </div>

        {Object.entries(stats.byStatus)
          .filter(([, count]) => count > 0)
          .map(([status, count]) => (
            <div key={status} className="stat-card sap-theme">
              <div className="stat-icon sap-theme">{STATUS_LABELS[status]?.icon || '📌'}</div>
              <div className="stat-content sap-theme">
                <div className="stat-value sap-theme">{formatNumber(count)}</div>
                <div className="stat-label sap-theme">
                  {STATUS_LABELS[status]?.label || 'Sin estado'}
                </div>
                <div className="stat-sublabel sap-theme">
                  {stats.total > 0 ? `${Math.round((count / stats.total) * 100)}%` : '0%'}
                </div>
              </div>
            </div>
          ))}
      </div>

      <div className="stats-accordion-content sap-theme expanded">
        <div className="stats-details sap-theme">
          <div className="stats-section sap-theme">
            <h3 className="sap-theme">Categorías principales</h3>
            {topCategories.length === 0 ? (
              <p className="sap-text">Sin categorías registradas.</p>
            ) : (
              <div className="stats-breakdown sap-theme">
                {topCategories.map(([category, count]) => (
                  <div key={category} className="breakdown-item sap-theme">
                    <div className="breakdown-label sap-theme">
                      {category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}
                    </div>
                    <div className="breakdown-value sap-theme">{formatNumber(count)}</div>
                    <div className="breakdown-percentage sap-theme">
                      {stats.total > 0 ? `${Math.round((count / stats.total) * 100)}%` : '0%'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="stats-section sap-theme">
            <h3 className="sap-theme">Términos de pago</h3>
            {paymentTerms.length === 0 ? (
              <p className="sap-text">Sin información de términos de pago.</p>
            ) : (
              <div className="stats-breakdown sap-theme">
                {paymentTerms.map(([term, count]) => (
                  <div key={term} className="breakdown-item sap-theme">
                    <div className="breakdown-label sap-theme">{term}</div>
                    <div className="breakdown-value sap-theme">{formatNumber(count)}</div>
                    <div className="breakdown-percentage sap-theme">
                      {stats.total > 0 ? `${Math.round((count / stats.total) * 100)}%` : '0%'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuppliersStats;
