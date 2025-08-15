/**
 * SimpleVehicleCategoryModal - Modal simple y funcional para crear categorías
 * Solución temporal para el problema del modal original
 */

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { createCategory } from '../../services/vehicleCategoriesService';
import { FUEL_TYPES } from '../../data/vehicleCategories';

const SimpleVehicleCategoryModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '🚗',
    color: '#3b82f6',
    fuelTypes: [FUEL_TYPES.DIESEL],
    fields: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  console.log('🆕 SimpleVehicleCategoryModal - Render ejecutado!');
  console.log('🆕 Props: isOpen =', isOpen, '| type:', typeof isOpen);
  console.log('🆕 onClose type:', typeof onClose, '| onSuccess type:', typeof onSuccess);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError('El nombre es requerido');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const categoryData = {
        ...formData,
        uniqueCode: formData.name.toLowerCase().replace(/\s+/g, '_'),
        createdAt: new Date().toISOString(),
      };

      const result = await createCategory(categoryData);

      if (result.success) {
        console.log('✅ Categoría creada exitosamente:', result.data);
        onSuccess && onSuccess(result.data);
        onClose();

        // Reset form
        setFormData({
          name: '',
          description: '',
          icon: '🚗',
          color: '#3b82f6',
          fuelTypes: [FUEL_TYPES.DIESEL],
          fields: [],
        });
      } else {
        setError(result.error || 'Error al crear la categoría');
      }
    } catch (error) {
      console.error('❌ Error creando categoría:', error);
      setError('Error inesperado al crear la categoría');
    } finally {
      setLoading(false);
    }
  };

  const handleFuelTypeToggle = (fuelType) => {
    setFormData((prev) => ({
      ...prev,
      fuelTypes: prev.fuelTypes.includes(fuelType)
        ? prev.fuelTypes.filter((f) => f !== fuelType)
        : [...prev.fuelTypes, fuelType],
    }));
  };

  if (!isOpen) {
    console.log('🚫 SimpleVehicleCategoryModal: No renderizando (isOpen = false)');
    return null;
  }

  console.log('✅ SimpleVehicleCategoryModal: Renderizando modal con Portal');

  const modalContent = (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 0, 0, 0.8)', // ROJO para debug
        zIndex: 99999, // Z-index muy alto
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Banner de debug visible */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'yellow',
          color: 'black',
          padding: '10px 20px',
          borderRadius: '5px',
          fontWeight: 'bold',
          zIndex: 100000,
        }}
      >
        🧪 MODAL SIMPLE FUNCIONANDO - DEBUG MODE
      </div>

      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          width: '100%',
          maxWidth: '500px',
          maxHeight: '80vh',
          overflow: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
            paddingBottom: '16px',
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          <h2 style={{ margin: 0, color: '#1f2937', fontSize: '20px' }}>
            ➕ Nueva Categoría de Vehículos
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6b7280',
              padding: '4px',
            }}
          >
            ✕
          </button>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '6px',
              padding: '12px',
              marginBottom: '16px',
              color: '#dc2626',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Nombre */}
          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '6px',
                fontWeight: '500',
                color: '#374151',
              }}
            >
              Nombre de la categoría *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Ej: Excavadoras, Tractores, Camiones..."
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
              }}
              required
            />
          </div>

          {/* Descripción */}
          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '6px',
                fontWeight: '500',
                color: '#374151',
              }}
            >
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Descripción opcional de la categoría..."
              rows={3}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                resize: 'vertical',
              }}
            />
          </div>

          {/* Ícono y Color */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              marginBottom: '16px',
            }}
          >
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontWeight: '500',
                  color: '#374151',
                }}
              >
                Ícono
              </label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData((prev) => ({ ...prev, icon: e.target.value }))}
                placeholder="🚗"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '20px',
                  textAlign: 'center',
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontWeight: '500',
                  color: '#374151',
                }}
              >
                Color
              </label>
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData((prev) => ({ ...prev, color: e.target.value }))}
                style={{
                  width: '100%',
                  height: '42px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              />
            </div>
          </div>

          {/* Tipos de combustible */}
          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                color: '#374151',
              }}
            >
              Tipos de combustible compatibles
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {Object.values(FUEL_TYPES).map((fuelType) => (
                <label
                  key={fuelType}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: '6px',
                    backgroundColor: formData.fuelTypes.includes(fuelType) ? '#eff6ff' : '#f9fafb',
                    border: `1px solid ${formData.fuelTypes.includes(fuelType) ? '#3b82f6' : '#e5e7eb'}`,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={formData.fuelTypes.includes(fuelType)}
                    onChange={() => handleFuelTypeToggle(fuelType)}
                    style={{ marginRight: '8px' }}
                  />
                  <span style={{ fontSize: '14px' }}>{fuelType}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              paddingTop: '16px',
              borderTop: '1px solid #e5e7eb',
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                padding: '10px 20px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                backgroundColor: 'white',
                color: '#374151',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !formData.name.trim()}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: loading ? '#9ca3af' : '#3b82f6',
                color: 'white',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
              }}
            >
              {loading ? 'Creando...' : 'Crear Categoría'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Usar Portal para renderizar fuera del DOM normal
  return createPortal(modalContent, document.body);
};

export default SimpleVehicleCategoryModal;
