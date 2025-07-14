/**
 * Step3_Location - Tercer paso del wizard: Selección de ubicación origen
 * Diseño estilo Typeform: conversacional y centrado en la ubicación
 */

import React, { useState, useEffect } from 'react';
import { MOVEMENT_TYPES } from '../../../services/movementsService';
import { OPERATIONAL_LOCATIONS, formatLocationName } from '../../../constants/locations';

const Step3_Location = ({ formData, updateFormData, systemData, setError, isActive }) => {
  const [loading, setLoading] = useState(false);
  const [stockInfo, setStockInfo] = useState({});
  const [validatingStock, setValidatingStock] = useState(false);

  const { suppliers, inventory } = systemData;
  const isEntrada = formData.type === MOVEMENT_TYPES.ENTRADA;

  // Navegación por teclado
  useEffect(() => {
    if (!isActive) return;

    const handleKeyPress = (e) => {
      const num = parseInt(e.key);
      
      if (isEntrada) {
        const activeSuppliers = suppliers.filter(s => s.status === 'active');
        if (num >= 1 && num <= activeSuppliers.length) {
          const selectedSupplier = activeSuppliers[num - 1];
          handleLocationSelection(selectedSupplier.name);
        }
      } else {
        if (num >= 1 && num <= OPERATIONAL_LOCATIONS.length) {
          const selectedLocation = OPERATIONAL_LOCATIONS[num - 1];
          handleLocationSelection(selectedLocation);
        }
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [isActive, suppliers, isEntrada, handleLocationSelection]);

  // Validar stock disponible en tiempo real para salidas/transferencias
  useEffect(() => {
    const validateLocationStock = async () => {
      if (!isEntrada && formData.fuelType && inventory.length > 0) {
        setValidatingStock(true);
        
        await new Promise(resolve => setTimeout(resolve, 600));
        
        const stockByLocation = {};

        OPERATIONAL_LOCATIONS.forEach(location => {
          const itemsEncontrados = inventory.filter(item => 
            item.fuelType === formData.fuelType && 
            item.location?.toLowerCase() === location.toLowerCase() &&
            item.status === 'active'
          );

          const availableStock = itemsEncontrados
            .reduce((total, item) => total + (parseFloat(item.currentStock) || 0), 0);
          
          const maxCapacity = itemsEncontrados
            .reduce((total, item) => total + (parseFloat(item.maxCapacity) || 0), 0);
          
          let status = 'available';
          let message = `${availableStock.toFixed(0)} galones disponibles`;
          
          if (availableStock === 0) {
            status = 'empty';
            message = 'Sin combustible disponible';
          } else if (availableStock < (maxCapacity * 0.2)) {
            status = 'low';
            message = `${availableStock.toFixed(0)} gal (stock bajo)`;
          }
          
          stockByLocation[location] = {
            available: availableStock,
            maxCapacity,
            status,
            message,
            percentage: maxCapacity > 0 ? (availableStock / maxCapacity) * 100 : 0
          };
        });
        
        setStockInfo(stockByLocation);
        setValidatingStock(false);
      }
    };

    validateLocationStock();
  }, [formData.fuelType, isEntrada, inventory]);

  const handleLocationSelection = async (location) => {
    setLoading(true);
    setError('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      if (isEntrada) {
        updateFormData('supplierName', location);
      } else {
        updateFormData('location', location);
      }
      
    } catch {
      setError('Error al validar la ubicación');
    } finally {
      setLoading(false);
    }
  };

  const getLocationIcon = (location) => {
    switch (location.toLowerCase()) {
      case 'oficina principal': return '🏢';
      case 'tanque central': return '⛽';
      case 'almacén norte': return '🏭';
      case 'zona sur': return '🌎';
      case 'taller mecánico': return '🔧';
      default: return '📍';
    }
  };

  const getMovementLocationQuestion = () => {
    switch (formData.type) {
      case MOVEMENT_TYPES.ENTRADA:
        return '¿De dónde viene el combustible?';
      case MOVEMENT_TYPES.SALIDA:
        return '¿De qué ubicación tomarás el combustible?';
      case MOVEMENT_TYPES.TRANSFERENCIA:
        return '¿Desde dónde quieres transferir?';
      case MOVEMENT_TYPES.AJUSTE:
        return '¿En qué ubicación harás el ajuste?';
      default:
        return '¿Cuál es la ubicación?';
    }
  };

  // Renderizar opciones para entradas (proveedores)
  if (isEntrada) {
    const activeSuppliers = suppliers.filter(s => s.status === 'active');
    
    // Debug para entender el problema
    console.log('🔍 [Step3 DEBUG] Suppliers data:', {
      suppliersLength: suppliers.length,
      activeSuppliersLength: activeSuppliers.length,
      suppliers: suppliers
    });
    
    return (
      <div className={`wizard-step step-location ${isActive ? 'active' : ''}`}>
        <div className="typeform-layout">
          <div className="typeform-question">
            <h2>🏪 {getMovementLocationQuestion()}</h2>
            <p>Selecciona el proveedor que está enviando el combustible</p>
          </div>

          {loading && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
              <p>🔄 Validando proveedor...</p>
            </div>
          )}

          {suppliers.length === 0 ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>🔄 Cargando proveedores...</p>
            </div>
          ) : activeSuppliers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏪</div>
              <h3>No hay proveedores disponibles</h3>
              <p>No se encontraron proveedores activos en el sistema.</p>
              <p>Contacta al administrador para agregar proveedores.</p>
            </div>
          ) : (
            <div className="typeform-options">
              {activeSuppliers.map((supplier) => (
                <div
                  key={supplier.id}
                  className={`typeform-option ${formData.supplierName === supplier.name ? 'selected' : ''} ${loading ? 'disabled' : ''}`}
                  onClick={() => !loading && handleLocationSelection(supplier.name)}
                >
                  <div className="typeform-option-icon">🏪</div>
                  <div className="typeform-option-content">
                    <h4>{supplier.name}</h4>
                    <p>{supplier.location || 'Proveedor de combustibles'}</p>
                    {supplier.contact && (
                      <small className="supplier-contact">📞 {supplier.contact}</small>
                    )}
                  </div>
                  <div className="typeform-option-selector">
                    <div className="typeform-check">
                      <span className="typeform-check-icon">✓</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {formData.supplierName && (
            <div className="selection-confirmation">
              <div className="confirmation-card">
                <span className="confirmation-icon">🏪</span>
                <div className="confirmation-text">
                  <strong>Genial! Recibirás combustible de {formData.supplierName}</strong>
                  <br />
                  <small>El combustible será registrado en el inventario</small>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Renderizar opciones para salidas/transferencias (ubicaciones operativas)
  return (
    <div className={`wizard-step step-location ${isActive ? 'active' : ''}`}>
      <div className="typeform-layout">
        <div className="typeform-question">
          <h2>📍 {getMovementLocationQuestion()}</h2>
          <p>Elige la ubicación donde está almacenado el combustible</p>
        </div>

        {validatingStock && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>⚙️ Verificando stock por ubicación...</p>
          </div>
        )}

        <div className="typeform-options">
          {OPERATIONAL_LOCATIONS.map((location) => {
            const stockData = stockInfo[location] || {};
            const isLocationSelected = formData.location === location;
            
            return (
              <div
                key={location}
                className={`typeform-option ${isLocationSelected ? 'selected' : ''} ${stockData.status || ''} ${loading ? 'disabled' : ''}`}
                onClick={() => !loading && handleLocationSelection(location)}
              >
                <div className="typeform-option-icon">
                  {getLocationIcon(location)}
                </div>
                <div className="typeform-option-content">
                  <h4>{formatLocationName(location)}</h4>
                  <p>{stockData.message || 'Verificando disponibilidad...'}</p>
                  
                  {stockData.available > 0 && (
                    <div className="stock-indicator">
                      <div className="stock-bar-mini">
                        <div 
                          className="stock-fill-mini"
                          style={{ width: `${Math.min(stockData.percentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="typeform-option-selector">
                  <div className="typeform-check">
                    <span className="typeform-check-icon">✓</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {formData.location && stockInfo[formData.location] && (
          <div className="selection-confirmation">
            <div className="confirmation-card">
              <span className="confirmation-icon">{getLocationIcon(formData.location)}</span>
              <div className="confirmation-text">
                <strong>Excelente! Usarás {formatLocationName(formData.location)}</strong>
                <br />
                <small>{stockInfo[formData.location].message}</small>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step3_Location;