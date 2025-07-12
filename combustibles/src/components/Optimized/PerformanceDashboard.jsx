// combustibles/src/components/Optimized/PerformanceDashboard.jsx
// Dashboard de métricas de performance - FASE 3 MONITOREO
/* eslint-disable react-refresh/only-export-components */
import React, { useContext, useEffect, useState } from 'react';
import { PerformanceContext } from '../../contexts/PerformanceContext';
import { withOptimization } from '../../hooks/useOptimizedComponents';
import './PerformanceDashboard.css';

const PerformanceDashboard = ({ isVisible = true }) => {
  const { globalMetrics, logOptimizationStats } = useContext(PerformanceContext);
  const [isExpanded, setIsExpanded] = useState(false);

  // Calcular métricas derivadas
  const cacheEfficiency = globalMetrics.totalCacheHits /
    (globalMetrics.totalFirebaseReads + globalMetrics.totalCacheHits) * 100 || 0;

  const optimizationRatio = globalMetrics.optimizedComponents /
    (globalMetrics.optimizedComponents + globalMetrics.unoptimizedComponents) * 100 || 0;

  useEffect(() => {
    // Log automático cada 30 segundos en desarrollo
    if (import.meta.env.DEV) {
      const interval = setInterval(logOptimizationStats, 30000);
      return () => clearInterval(interval);
    }
  }, [logOptimizationStats]);

  // Debug: Log para verificar que el componente se está renderizando
  useEffect(() => {
    console.log('🔍 PerformanceDashboard renderizado:', {
      isVisible,
      MODE: import.meta.env.MODE,
      globalMetrics
    });
  }, [isVisible, globalMetrics]);

  // Siempre mostrar en desarrollo, o cuando isVisible sea true
  if (!isVisible && import.meta.env.PROD) {
    return null;
  }

  return (
    <div className="performance-dashboard">
      <div className="dashboard-toggle">
        <button
          className="toggle-btn"
          onClick={() => setIsExpanded(!isExpanded)}
          title="Toggle Performance Dashboard"
        >
          📊 Performance {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      {isExpanded && (
        <div className="dashboard-content">
          <div className="metrics-grid">
            {/* Renders */}
            <div className="metric-card">
              <div className="metric-icon">🔄</div>
              <div className="metric-info">
                <div className="metric-value">{globalMetrics.totalRenders}</div>
                <div className="metric-label">Total Renders</div>
              </div>
            </div>

            {/* Firebase Reads */}
            <div className="metric-card">
              <div className="metric-icon">🔥</div>
              <div className="metric-info">
                <div className="metric-value">{globalMetrics.totalFirebaseReads}</div>
                <div className="metric-label">Firebase Reads</div>
              </div>
            </div>

            {/* Cache Hits */}
            <div className="metric-card">
              <div className="metric-icon">⚡</div>
              <div className="metric-info">
                <div className="metric-value">{globalMetrics.totalCacheHits}</div>
                <div className="metric-label">Cache Hits</div>
              </div>
            </div>

            {/* Cache Efficiency */}
            <div className="metric-card">
              <div className="metric-icon">📈</div>
              <div className="metric-info">
                <div className="metric-value">{cacheEfficiency.toFixed(1)}%</div>
                <div className="metric-label">Cache Efficiency</div>
              </div>
            </div>

            {/* Optimized Components */}
            <div className="metric-card">
              <div className="metric-icon">✨</div>
              <div className="metric-info">
                <div className="metric-value">{globalMetrics.optimizedComponents}</div>
                <div className="metric-label">Optimized</div>
              </div>
            </div>

            {/* Optimization Ratio */}
            <div className="metric-card">
              <div className="metric-icon">🎯</div>
              <div className="metric-info">
                <div className="metric-value">{optimizationRatio.toFixed(1)}%</div>
                <div className="metric-label">Optimization Ratio</div>
              </div>
            </div>
          </div>

          {/* Performance Status */}
          <div className="performance-status">
            <div className="status-item">
              <span className="status-label">Estado General:</span>
              <span className={`status-badge ${getPerformanceStatus(optimizationRatio, cacheEfficiency)}`}>
                {getPerformanceStatusText(optimizationRatio, cacheEfficiency)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="dashboard-actions">
            <button
              className="btn btn-secondary"
              onClick={logOptimizationStats}
            >
              📝 Log Stats
            </button>
            <button
              className="btn btn-primary"
              onClick={() => console.log('📊 Métricas detalladas:', globalMetrics)}
            >
              🔍 Detalles
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper functions
const getPerformanceStatus = (optimizationRatio, cacheEfficiency) => {
  const score = (optimizationRatio + cacheEfficiency) / 2;
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'fair';
  return 'poor';
};

const getPerformanceStatusText = (optimizationRatio, cacheEfficiency) => {
  const score = (optimizationRatio + cacheEfficiency) / 2;
  if (score >= 80) return 'Excelente';
  if (score >= 60) return 'Bueno';
  if (score >= 40) return 'Regular';
  return 'Necesita Mejora';
};

export default withOptimization(PerformanceDashboard);
