/**
 * VehicleIcon - Componente para mostrar el icono de un vehículo
 * Renderiza el icono personalizado seleccionado o el icono por defecto
 */

import React from 'react';
import { getVehicleIcon, DEFAULT_VEHICLE_ICON } from '../../constants/vehicleIcons';

const VehicleIcon = ({
  iconId,
  size = 'medium',
  className = '',
  style = {},
  showBorder = true,
  onClick = null,
}) => {
  // Obtener datos del icono
  const iconData = getVehicleIcon(iconId) || DEFAULT_VEHICLE_ICON;
  const emoji = iconData.customEmoji || iconData.emoji;

  // Tamaños predefinidos
  const sizes = {
    small: { width: 24, height: 24, fontSize: 12 },
    medium: { width: 32, height: 32, fontSize: 16 },
    large: { width: 48, height: 48, fontSize: 24 },
    xlarge: { width: 64, height: 64, fontSize: 32 },
  };

  const sizeStyle = sizes[size] || sizes.medium;

  // Estilos del contenedor
  const containerStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    backgroundColor: iconData.color === '#FFFFFF' ? '#f5f5f5' : `${iconData.color}20`,
    border: showBorder ? `2px solid ${iconData.color}` : 'none',
    color: iconData.color === '#FFFFFF' ? '#333' : iconData.color,
    transition: 'all 0.2s ease',
    cursor: onClick ? 'pointer' : 'default',
    ...sizeStyle,
    ...style,
  };

  // Estilos del emoji
  const emojiStyle = {
    lineHeight: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: sizeStyle.fontSize,
  };

  return (
    <div
      className={`vehicle-icon ${className}`}
      style={containerStyle}
      title={iconData.name}
      onClick={onClick}
    >
      <span style={emojiStyle}>{emoji}</span>
    </div>
  );
};

export default VehicleIcon;
