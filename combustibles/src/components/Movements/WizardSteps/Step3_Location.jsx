/**
 * Step3_Location - Tercer paso del wizard: Selección de ubicación origen
 * Para entradas: selecciona proveedor
 * Para salidas/transferencias: selecciona ubicación con validación de stock en tiempo real
 */

import React, { useState, useEffect } from 'react';
import { MOVEMENT_TYPES } from '../../../services/movementsService';
import { OPERATIONAL_LOCATIONS, formatLocationName } from '../../../constants/locations';

const Step3_Location = ({ formData, updateFormData, systemData, setError }) => {
  const [loading, setLoading] = useState(false);
  const [stockInfo, setStockInfo] = useState({});
  const [validatingStock, setValidatingStock] = useState(false);

  const { suppliers, inventory } = systemData;
  const isEntrada = formData.type === MOVEMENT_TYPES.ENTRADA;

  // Validar stock disponible en tiempo real para salidas/transferencias
  useEffect(() => {
    const validateLocationStock = async () => {
      if (!isEntrada && formData.fuelType && inventory.length > 0) {
        setValidatingStock(true);
        
        // Simular validación en tiempo real
        await new Promise(resolve => setTimeout(resolve, 600));
        
        const stockByLocation = {};
        
        // ✅ Debug: Log inventario completo y filtros aplicados
        console.log('🔍 DEBUG Step3 - Datos para validación:', {
          fuelType: formData.fuelType,
          inventoryTotal: inventory.length,
          inventarioMuestra: inventory.slice(0, 2),
          operationalLocations: OPERATIONAL_LOCATIONS
        });

        OPERATIONAL_LOCATIONS.forEach(location => {
          const itemsEncontrados = inventory.filter(item => 
            item.fuelType === formData.fuelType && 
            item.location?.toLowerCase() === location.toLowerCase() &&
            item.status === 'active'
          );
          
          console.log(`🔍 DEBUG ${location}:`, {
            itemsEncontrados: itemsEncontrados.length,
            detalles: itemsEncontrados.map(item => ({
              id: item.id,
              fuelType: item.fuelType,
              location: item.location,
              status: item.status,
              currentStock: item.currentStock,
              maxCapacity: item.maxCapacity
            }))
          });

          const availableStock = itemsEncontrados
            .reduce((total, item) => total + (parseFloat(item.currentStock) || 0), 0);
          
          const maxCapacity = inventory
            .filter(item => 
              item.fuelType === formData.fuelType && 
              item.location?.toLowerCase() === location.toLowerCase() &&
              item.status === 'active'
            )
            .reduce((total, item) => total + (parseFloat(item.maxCapacity) || 0), 0);
          
          let status = 'available';
          let message = `${availableStock.toFixed(1)} gal disponibles`;
          
          if (availableStock === 0) {
            status = 'empty';
            message = 'Sin stock disponible';
          } else if (availableStock < (maxCapacity * 0.2)) {
            status = 'low';
            message = `${availableStock.toFixed(1)} gal (stock bajo)`;
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
        
        console.log('🔍 Stock validado por ubicación:', stockByLocation);
      }
    };

    validateLocationStock();
  }, [formData.fuelType, isEntrada, inventory]);

  const handleLocationSelection = async (location) => {
    setLoading(true);
    setError('');
    
    try {
      // Simular validación final
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Para entradas usar supplierName, para otros tipos usar location
      if (isEntrada) {
        updateFormData('supplierName', location);
      } else {
        updateFormData('location', location);
      }
      
      console.log('📍 Ubicación seleccionada:', location);
      
    } catch (err) {
      console.error('Error al validar ubicación:', err);
      setError('Error al validar la ubicación');
    } finally {
      setLoading(false);
    }
  };

  // Renderizar opciones para entradas (proveedores)
  if (isEntrada) {
    const activeSuppliers = suppliers.filter(s => s.status === 'active');
    
    return (
      <div className={`wizard-step step-location ${isActive ? 'active' : ''}`}>
        <div className="typeform-layout">
          <div className="typeform-question">
            <h3>🏪 ¿De qué proveedor viene el combustible?</h3>
            <p>Selecciona el proveedor de origen:</p>
          </div>

          {loading && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
              <p>🔄 Validando proveedor...</p>
            </div>
          )}

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
                  <p>{supplier.city}</p>
                </div>
                <div className="typeform-option-selector">
                  <div className="typeform-check">
                    <span className="typeform-check-icon">✓</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {formData.supplierName && (
            <div className="selection-confirmation">
              <div className="confirmation-card">
                <span className="confirmation-icon">🏪</span>
                <div className="confirmation-text">
                  <strong>Proveedor:</strong> {formData.supplierName}
                  <br />
                  <small>Origen del combustible confirmado</small>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Renderizar opciones para salidas/transferencias (ubicaciones con stock)
  return (
    <div className={`wizard-step step-location ${isActive ? 'active' : ''}`}>
      <div className="typeform-layout">
        <div className="typeform-question">
          <h3>📍 ¿De qué ubicación sale el combustible?</h3>
          <p>Selecciona la ubicación de origen:</p>
        </div>

        {validatingStock && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>🔍 Verificando stock disponible...</p>
          </div>
        )}

        <div className="typeform-options">
          {OPERATIONAL_LOCATIONS.map((location) => {
            const stock = stockInfo[location];
            const isSelectable = !stock || stock.status !== 'empty';
            
            return (
              <div
                key={location}
                className={`typeform-option ${formData.location === location ? 'selected' : ''} 
                           ${stock?.status || 'unknown'} ${!isSelectable || loading ? 'disabled' : ''}`}
                onClick={() => isSelectable && !loading && handleLocationSelection(location)}
              >
                <div className="typeform-option-icon">📍</div>
                <div className="typeform-option-content">
                  <h4>{formatLocationName(location)}</h4>
                  
                  {stock && (
                    <div className="stock-info">
                      <p className="stock-message">{stock.message}</p>
                      
                      {stock.available > 0 && (
                        <div className="stock-bar-mini">
                          <div 
                            className="stock-fill-mini" 
                            style={{ width: `${Math.min(100, stock.percentage)}%` }}
                          ></div>
                        </div>
                      )}
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
            <div className="confirmation-card location-confirmation">
              <div className="confirmation-header">
                <span className="confirmation-icon">📍</span>
                <div className="confirmation-text">
                  <strong>{formatLocationName(formData.location)}</strong>
                  <br />
                  <small>Ubicación de origen confirmada</small>
                </div>
              </div>
              
              <div className="stock-confirmation">
                <div className="stock-detail">
                  <span className="stock-label">📊 Stock disponible:</span>
                  <span className="stock-value">
                    {stockInfo[formData.location].available.toFixed(1)} gal
                  </span>
                </div>
                <div className="capacity-bar">
                  <div 
                    className="capacity-fill" 
                    style={{ width: `${stockInfo[formData.location].percentage}%` }}
                  ></div>
                </div>
                <small className="capacity-text">
                  {stockInfo[formData.location].percentage.toFixed(1)}% de capacidad ocupada
                </small>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step3_Location;