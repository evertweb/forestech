/**
 * ================================================================================================================================
 * ARCHIVO: ShimmerLoader.jsx
 * MÓDULO: combustibles/shared
 * DESCRIPCIÓN: Componente de carga shimmer reutilizable para simular contenido mientras carga.
 *
 * FUNCIONALIDAD:
 * - Efectos shimmer (brillo animado) para diferentes tipos de contenido
 * - Componentes especializados para cards, tablas, estadísticas
 * - Compatible con tema SAP Fiori
 * - Responsive y accesible
 * ================================================================================================================================
 */

import React from 'react';
import './ShimmerLoader.css';

// Shimmer básico
export const ShimmerBase = ({
  width = '100%',
  height = '16px',
  className = '',
  borderRadius = '4px',
}) => (
  <div
    className={`shimmer-base ${className}`}
    style={{
      width,
      height,
      borderRadius,
      '--shimmer-width': width,
      '--shimmer-height': height,
    }}
    aria-label="Cargando contenido..."
    role="progressbar"
    aria-valuemin="0"
    aria-valuemax="100"
  />
);

// Shimmer para cards de estadísticas
export const ShimmerCard = ({ variant = 'stat' }) => {
  if (variant === 'stat') {
    return (
      <div className="shimmer-card stat-card">
        <div className="shimmer-card-header">
          <ShimmerBase width="40px" height="40px" borderRadius="8px" className="shimmer-icon" />
          <div className="shimmer-card-info">
            <ShimmerBase width="80%" height="14px" className="shimmer-title" />
            <ShimmerBase width="60%" height="12px" className="shimmer-subtitle" />
          </div>
        </div>
        <div className="shimmer-card-value">
          <ShimmerBase width="120px" height="32px" className="shimmer-value" />
        </div>
        <div className="shimmer-card-footer">
          <ShimmerBase width="100%" height="8px" className="shimmer-progress" />
          <ShimmerBase width="70%" height="12px" className="shimmer-change" />
        </div>
      </div>
    );
  }

  return (
    <div className="shimmer-card default-card">
      <ShimmerBase width="100%" height="180px" borderRadius="8px" />
    </div>
  );
};

// Shimmer para filas de tabla
export const ShimmerTableRow = ({ columns = 5 }) => (
  <tr className="shimmer-table-row">
    {Array.from({ length: columns }, (_, index) => (
      <td key={index} className="shimmer-table-cell">
        <ShimmerBase
          width={index === 0 ? '80%' : index === columns - 1 ? '60px' : '90%'}
          height="16px"
        />
      </td>
    ))}
  </tr>
);

// Shimmer completo para tabla
export const ShimmerTable = ({
  rows = 5,
  columns = 5,
  title = true,
  actions = true,
  className = '',
}) => (
  <div className={`shimmer-table-container ${className}`}>
    {title && (
      <div className="shimmer-table-header">
        <ShimmerBase width="200px" height="24px" className="shimmer-table-title" />
        {actions && (
          <div className="shimmer-table-actions">
            <ShimmerBase width="80px" height="32px" borderRadius="6px" />
            <ShimmerBase width="100px" height="32px" borderRadius="6px" />
          </div>
        )}
      </div>
    )}

    <div className="shimmer-table-wrapper">
      <table className="shimmer-table">
        <thead>
          <tr>
            {Array.from({ length: columns }, (_, index) => (
              <th key={index} className="shimmer-table-header-cell">
                <ShimmerBase width="80%" height="16px" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }, (_, index) => (
            <ShimmerTableRow key={index} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Shimmer para grid de cards
export const ShimmerCardsGrid = ({ cards = 4, columns = 4, variant = 'stat', className = '' }) => (
  <div
    className={`shimmer-cards-grid ${className}`}
    style={{
      '--shimmer-columns': columns,
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: 'var(--sap-spacing-md, 16px)',
    }}
  >
    {Array.from({ length: cards }, (_, index) => (
      <ShimmerCard key={index} variant={variant} />
    ))}
  </div>
);

// Shimmer específico para dashboard
export const ShimmerDashboard = () => (
  <div className="shimmer-dashboard">
    {/* Cards de estadísticas */}
    <div className="shimmer-dashboard-section">
      <ShimmerCardsGrid cards={4} columns={4} variant="stat" />
    </div>

    {/* Tabla principal */}
    <div className="shimmer-dashboard-section">
      <ShimmerTable
        rows={8}
        columns={8}
        title={true}
        actions={true}
        className="shimmer-inventory-table"
      />
    </div>

    {/* Tabla de actividad reciente */}
    <div className="shimmer-dashboard-section">
      <ShimmerTable
        rows={5}
        columns={5}
        title={true}
        actions={true}
        className="shimmer-activity-table"
      />
    </div>

    {/* Footer con estadísticas */}
    <div className="shimmer-dashboard-footer">
      <div className="shimmer-footer-stats">
        <ShimmerBase width="120px" height="16px" />
        <ShimmerBase width="140px" height="16px" />
        <ShimmerBase width="130px" height="16px" />
      </div>
      <ShimmerBase width="180px" height="14px" className="shimmer-timestamp" />
    </div>
  </div>
);

// Componente principal exportado
const ShimmerLoader = {
  Base: ShimmerBase,
  Card: ShimmerCard,
  Table: ShimmerTable,
  TableRow: ShimmerTableRow,
  CardsGrid: ShimmerCardsGrid,
  Dashboard: ShimmerDashboard,
};

export default ShimmerLoader;
