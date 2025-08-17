/**
 * CardDetails.jsx - Componente para mostrar detalles de cards
 */

import React from 'react';

const CardDetails = ({ card, onClose }) => {
  if (!card || !card.details) return null;

  const renderDetails = () => {
    if (Array.isArray(card.details)) {
      return (
        <div className="card-details-list">
          {card.details.map((item, index) => (
            <div key={index} className="detail-item">
              {typeof item === 'object' ? (
                <pre>{JSON.stringify(item, null, 2)}</pre>
              ) : (
                <span>{item}</span>
              )}
            </div>
          ))}
        </div>
      );
    }

    if (typeof card.details === 'object') {
      return (
        <div className="card-details-object">
          {Object.entries(card.details).map(([key, value]) => (
            <div key={key} className="detail-row">
              <span className="detail-key">{key}:</span>
              <span className="detail-value">
                {typeof value === 'number' ? value.toLocaleString('es-CO') : String(value)}
              </span>
            </div>
          ))}
        </div>
      );
    }

    return <div className="card-details-simple">{String(card.details)}</div>;
  };

  return (
    <div className="card-details-modal-overlay" onClick={onClose}>
      <div className="card-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{card.title} - Detalles</h3>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-content">
          <div className="card-summary">
            <div className="summary-value">{card.value}</div>
            <div className="summary-subtitle">{card.subtitle}</div>
            {card.trend && (
              <div className={`summary-trend trend-${card.trend.type}`}>
                <span>{card.trend.icon}</span>
                <span>{card.trend.text}</span>
              </div>
            )}
          </div>

          <div className="card-details-content">{renderDetails()}</div>
        </div>
      </div>
    </div>
  );
};

export default CardDetails;
