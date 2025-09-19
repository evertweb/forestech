/**
 * ================================================================================================================================
 * ARCHIVO: AdminSSRBanner.jsx
 * MÓDULO: combustibles
 * DESCRIPCIÓN: Banner exclusivo para administradores que proporciona acceso directo a los endpoints de monitoreo SSR.
 *
 * FUNCIONALIDAD:
 * - Muestra enlaces directos a los endpoints de monitoreo SSR implementados en Fase 4
 * - Solo visible para usuarios con permisos de administrador
 * - Proporciona acceso rápido a reportes, alertas, optimización y cobertura SSR
 * - Diseño responsive y consistente con el theme del dashboard
 *
 * ENDPOINTS INCLUIDOS:
 * - /ssr-reports: Dashboard de reportes y métricas SSR
 * - /ssr-alerts: Sistema de alertas y notificaciones SSR
 * - /ssr-optimization: Panel de optimización de performance SSR
 * - /ssr-coverage: Monitoreo de cobertura SSR (45% target)
 * ================================================================================================================================
 */

import React, { useState } from 'react';
import { useCombustibles } from '../../contexts/CombustiblesContext';

const AdminSSRBanner = () => {
  const { isAdmin } = useCombustibles();
  const [isExpanded, setIsExpanded] = useState(false);

  // Solo mostrar para administradores
  if (!isAdmin()) {
    return null;
  }

  const ssrEndpoints = [
    {
      id: 'reports',
      url: 'https://forestechdecolombia.com.co/ssr-reports',
      title: 'SSR Reports',
      description: 'Dashboard de reportes y métricas SSR',
      icon: '📊',
      color: 'var(--color-verdigris)',
      status: 'active',
    },
    {
      id: 'alerts',
      url: 'https://forestechdecolombia.com.co/ssr-alerts',
      title: 'SSR Alerts',
      description: 'Sistema de alertas y notificaciones',
      icon: '🚨',
      color: 'var(--color-rusty-red)',
      status: 'active',
    },
    {
      id: 'optimization',
      url: 'https://forestechdecolombia.com.co/ssr-optimization',
      title: 'SSR Optimization',
      description: 'Panel de optimización de performance',
      icon: '⚡',
      color: 'var(--color-teal)',
      status: 'active',
    },
    {
      id: 'coverage',
      url: 'https://forestechdecolombia.com.co/ssr-coverage',
      title: 'SSR Coverage',
      description: 'Monitoreo de cobertura SSR (45% target)',
      icon: '📈',
      color: 'var(--color-violet-jtc)',
      status: 'active',
    },
  ];

  const handleEndpointClick = (endpoint) => {
    // Abrir en nueva pestaña
    window.open(endpoint.url, '_blank', 'noopener,noreferrer');

    // Log de auditoría
    console.log(`🔧 Admin accedió a endpoint SSR: ${endpoint.title}`, {
      endpoint: endpoint.id,
      url: endpoint.url,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <div className="admin-ssr-banner">
      <div className="banner-header">
        <div className="banner-title">
          <span className="admin-icon">👑</span>
          <h3>Panel de Administración SSR</h3>
          <span className="phase-badge">Fase 4 Completa</span>
        </div>

        <button
          className="banner-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
          title={isExpanded ? 'Contraer panel' : 'Expandir panel'}
        >
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      {isExpanded && (
        <div className="banner-content">
          <div className="banner-description">
            <p>
              Acceso directo a los sistemas de monitoreo SSR implementados en la Fase 4. Estos
              endpoints proporcionan métricas detalladas, alertas en tiempo real y herramientas de
              optimización para el sistema SSR.
            </p>
          </div>

          <div className="endpoints-grid">
            {ssrEndpoints.map((endpoint) => (
              <div
                key={endpoint.id}
                className="endpoint-card"
                onClick={() => handleEndpointClick(endpoint)}
                style={{ '--accent-color': endpoint.color }}
              >
                <div className="endpoint-header">
                  <span className="endpoint-icon">{endpoint.icon}</span>
                  <div className="endpoint-status">
                    <span className={`status-indicator ${endpoint.status}`}></span>
                  </div>
                </div>

                <div className="endpoint-info">
                  <h4 className="endpoint-title">{endpoint.title}</h4>
                  <p className="endpoint-description">{endpoint.description}</p>
                </div>

                <div className="endpoint-actions">
                  <span className="endpoint-url">
                    {endpoint.url.replace('https://forestechdecolombia.com.co', '')}
                  </span>
                  <span className="external-icon">🔗</span>
                </div>
              </div>
            ))}
          </div>

          <div className="banner-footer">
            <div className="coverage-info">
              <span className="coverage-label">Cobertura SSR Actual:</span>
              <div className="coverage-bar">
                <div className="coverage-progress" style={{ width: '45%' }}></div>
              </div>
              <span className="coverage-value">45% ✅</span>
            </div>

            <div className="quick-actions">
              <button
                className="quick-action"
                onClick={() =>
                  window.open(
                    'https://console.firebase.google.com/project/liquidacionapp-62962/functions',
                    '_blank'
                  )
                }
                title="Abrir Firebase Functions Console"
              >
                🔥 Functions
              </button>

              <button
                className="quick-action"
                onClick={() =>
                  window.open(
                    'https://console.firebase.google.com/project/liquidacionapp-62962/performance',
                    '_blank'
                  )
                }
                title="Abrir Firebase Performance Console"
              >
                📊 Performance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSSRBanner;
