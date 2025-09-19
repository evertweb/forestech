/**
 * UnifiedCards.jsx - Componente universal para renderizar cards de métricas
 * Centraliza la presentación visual de todas las cards del sistema
 * Actualizado con diseño Apple inspirado en Health app
 */

import React from 'react';
import './UnifiedCards.css';
import '../../styles/apple-cards.css';

const UnifiedCard = ({ card, onClick, className = '', size = 'normal' }) => {
  if (!card) return null;

  const handleClick = () => {
    if (onClick) {
      onClick(card);
    }
  };

  const getCardThemeClass = () => {
    // Mantener compatibilidad con categorías existentes pero usar clases Apple
    switch (card.category) {
      case 'financial':
        return 'card-financial';
      case 'inventory':
        return 'card-inventory';
      case 'operations':
        return 'card-operations';
      case 'alerts':
        return 'card-alerts';
      case 'locations':
        return 'card-locations';
      case 'maintenance':
        return 'card-maintenance';
      case 'trends':
        return 'card-trends';
      case 'efficiency':
        return 'card-efficiency';
      default:
        return 'card-default';
    }
  };

  const getTrendClass = () => {
    switch (card.trend?.type) {
      case 'positive':
        return 'status-normal';
      case 'negative':
        return 'status-critical';
      case 'warning':
        return 'status-warning';
      case 'info':
        return 'status-high';
      default:
        return 'status-normal';
    }
  };

  return (
    <div
      className={`apple-card ${getCardThemeClass()} ${size} ${className} ${onClick ? 'clickable' : ''}`}
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyPress={onClick ? (e) => e.key === 'Enter' && handleClick() : undefined}
    >
      {/* Header de la card */}
      <div className="apple-card-header">
        <span className="apple-stat-card-icon" role="img" aria-label={card.title}>
          {card.icon}
        </span>
        <h3 className="apple-card-title">{card.title}</h3>
      </div>

      {/* Contenido principal */}
      <div className="apple-card-content">
        <div className="apple-form-input">{card.value}</div>
        <div className="apple-form-label">{card.subtitle}</div>
      </div>

      {/* Trend/Estado */}
      {card.trend && (
        <div className={`apple-status-badge ${getTrendClass()}`}>
          <span>{card.trend.icon}</span>
          <span>{card.trend.text}</span>
        </div>
      )}

      {/* Indicador interactivo */}
      {onClick && (
        <div className="card-interactive-indicator">
          <span>👁️</span>
        </div>
      )}
    </div>
  );
};

const UnifiedCardsGrid = ({
  cards = [],
  onCardClick,
  className = '',
  columns = 'auto',
  size = 'normal',
  showEmpty = true,
}) => {
  console.log('🃏 UnifiedCardsGrid renderizado con:', cards.length, 'cards');
  console.log(
    '📋 Cards recibidas:',
    cards.map((c) => ({ id: c.id, title: c.title, value: c.value }))
  );

  if (!Array.isArray(cards) || cards.length === 0) {
    console.log('⚠️ UnifiedCardsGrid: No hay cards para mostrar');
    if (!showEmpty) return null;

    return (
      <div className={`unified-cards-empty ${className}`}>
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <p>No hay métricas disponibles</p>
        </div>
      </div>
    );
  }

  const getGridClass = () => {
    if (typeof columns === 'number') {
      return `grid-columns-${Math.min(Math.max(columns, 1), 6)}`;
    }
    return 'grid-columns-auto';
  };

  return (
    <div className={`apple-stats-grid ${getGridClass()} ${className}`}>
      {cards.map((card, index) => (
        <UnifiedCard key={card.id || index} card={card} onClick={onCardClick} size={size} />
      ))}
    </div>
  );
};

// Componente para mostrar cards categorizadas
const CategorizedCards = ({ cards = [], onCardClick, className = '', showCategories = true }) => {
  if (!Array.isArray(cards) || cards.length === 0) {
    return (
      <div className={`categorized-cards-empty ${className}`}>
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <p>No hay métricas disponibles</p>
        </div>
      </div>
    );
  }

  // Agrupar cards por categoría
  const cardsByCategory = cards.reduce((acc, card) => {
    const category = card.category || 'general';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(card);
    return acc;
  }, {});

  const getCategoryTitle = (category) => {
    switch (category) {
      case 'financial':
        return 'Financiero';
      case 'inventory':
        return 'Inventario';
      case 'operations':
        return 'Operaciones';
      case 'alerts':
        return 'Alertas';
      case 'locations':
        return 'Ubicaciones';
      case 'maintenance':
        return 'Mantenimiento';
      case 'trends':
        return 'Tendencias';
      case 'efficiency':
        return 'Eficiencia';
      default:
        return 'General';
    }
  };

  return (
    <div className={`apple-section ${className}`}>
      {Object.entries(cardsByCategory).map(([category, categoryCards]) => (
        <div key={category} className="apple-section">
          {showCategories && <h2 className="apple-section-title">{getCategoryTitle(category)}</h2>}
          <UnifiedCardsGrid
            cards={categoryCards}
            onCardClick={onCardClick}
            columns="auto"
            showEmpty={false}
          />
        </div>
      ))}
    </div>
  );
};

// Componente para cards con detalles expandibles
const ExpandableCard = ({ card, children, defaultExpanded = false }) => {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`expandable-card ${isExpanded ? 'expanded' : ''}`}>
      <UnifiedCard card={card} onClick={toggleExpanded} className="expandable-card-header" />

      {isExpanded && children && <div className="expandable-card-content">{children}</div>}
    </div>
  );
};

// Componente para mostrar detalles de una card específica (movido a hooks/useCardDetails.js)

// Exportar componentes principales
export default UnifiedCardsGrid;
export { UnifiedCard, CategorizedCards, ExpandableCard };
