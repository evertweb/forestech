/**
 * VehicleIconSelector - Componente para seleccionar iconos de vehículos
 * Permite elegir entre iconos predefinidos organizados por categorías
 */

import React, { useState, useMemo } from 'react';
import {
  getIconsGroupedByCategory,
  getVehicleIcon,
  DEFAULT_VEHICLE_ICON,
  searchIcons,
} from '../../constants/vehicleIcons';
import './VehicleIconSelector.css';

const VehicleIconSelector = ({
  selectedIconId,
  onIconSelect,
  disabled = false,
  compact = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Obtener iconos agrupados por categoría
  const iconsByCategory = useMemo(() => getIconsGroupedByCategory(), []);

  // Obtener icono seleccionado actual
  const selectedIcon = useMemo(() => {
    const icon = getVehicleIcon(selectedIconId) || DEFAULT_VEHICLE_ICON;
    return icon;
  }, [selectedIconId]);

  // Filtrar iconos según búsqueda y categoría
  const filteredIcons = useMemo(() => {
    let icons = searchTerm
      ? searchIcons(searchTerm)
      : Object.values(iconsByCategory).flatMap((cat) => cat.icons);

    if (activeCategory !== 'all' && !searchTerm) {
      icons = iconsByCategory[activeCategory]?.icons || [];
    }

    return icons;
  }, [searchTerm, activeCategory, iconsByCategory]);

  const handleIconSelect = (icon) => {
    onIconSelect(icon.id);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const renderIcon = (icon, size = 'medium') => {
    const emoji = icon.customEmoji || icon.emoji;
    const sizeClass = `icon-${size}`;

    return (
      <div
        className={`vehicle-icon ${sizeClass}`}
        style={{
          backgroundColor: icon.color === '#FFFFFF' ? '#f5f5f5' : `${icon.color}20`,
          borderColor: icon.color,
          color: icon.color === '#FFFFFF' ? '#333' : icon.color,
        }}
      >
        <span className="icon-emoji">{emoji}</span>
      </div>
    );
  };

  return (
    <div
      className={`vehicle-icon-selector ${compact ? 'compact' : ''} ${disabled ? 'disabled' : ''}`}
    >
      {/* Botón selector actual */}
      <button
        type="button"
        className={`icon-selector-button ${isOpen ? 'open' : ''}`}
        onClick={handleToggle}
        disabled={disabled}
      >
        <div className="selected-icon">
          {renderIcon(selectedIcon, compact ? 'small' : 'medium')}
          <span className="selected-name">{selectedIcon.name}</span>
        </div>
        <span className="dropdown-arrow">{isOpen ? '🔼' : '🔽'}</span>
      </button>

      {/* Panel de selección */}
      {isOpen && (
        <div className="icon-selector-panel">
          {/* Barra de búsqueda */}
          <div className="search-section">
            <input
              type="text"
              placeholder="Buscar icono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="icon-search"
            />
          </div>

          {/* Filtros por categoría */}
          {!searchTerm && (
            <div className="category-filters">
              <button
                className={`category-btn ${activeCategory === 'all' ? 'active' : ''}`}
                onClick={() => setActiveCategory('all')}
              >
                Todos
              </button>
              {Object.entries(iconsByCategory).map(([categoryId, category]) => (
                <button
                  key={categoryId}
                  className={`category-btn ${activeCategory === categoryId ? 'active' : ''}`}
                  onClick={() => setActiveCategory(categoryId)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}

          {/* Grid de iconos */}
          <div className="icons-grid">
            {filteredIcons.length > 0 ? (
              filteredIcons.map((icon) => (
                <button
                  key={icon.id}
                  type="button"
                  className={`icon-option ${selectedIconId === icon.id ? 'selected' : ''}`}
                  onClick={() => handleIconSelect(icon)}
                  title={icon.name}
                >
                  {renderIcon(icon, 'medium')}
                  <span className="icon-label">{icon.name}</span>
                </button>
              ))
            ) : (
              <div className="no-icons">
                <span>No se encontraron iconos</span>
              </div>
            )}
          </div>

          {/* Información de categoría actual */}
          {!searchTerm && activeCategory !== 'all' && iconsByCategory[activeCategory] && (
            <div className="category-info">
              <small>{iconsByCategory[activeCategory].description}</small>
            </div>
          )}
        </div>
      )}

      {/* Overlay para cerrar */}
      {isOpen && <div className="icon-selector-overlay" onClick={() => setIsOpen(false)} />}
    </div>
  );
};

export default VehicleIconSelector;
