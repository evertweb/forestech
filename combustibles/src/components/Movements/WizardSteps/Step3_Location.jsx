/**
 * Step3_Location - Tercer paso del wizard: Selección de ubicación origen
 * Diseño estilo Typeform: conversacional y centrado en la ubicación
 * 
 * REFACTORED: Removed legacy service imports
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  getAllLocations,
  getLocationStock,
  formatLocationName,
} from '../../../services/locationsService';

// Tipos de movimiento simplificados
const MOVEMENT_TYPES = {
  ENTRADA: 'entrada',
  SALIDA: 'salida',
};

const Step3_Location = ({
  formData,
  updateFormData,
  systemData,
  setError,
  isActive,
  theme = 'forestech',
}) => {
  const [loading, setLoading] = useState(false);
  const [stockInfo, setStockInfo] = useState({});
  const [validatingStock, setValidatingStock] = useState(false);
  const [availableLocations, setAvailableLocations] = useState([]);
  const [, setLoadingLocations] = useState(true);

  // Helper para clases según el tema
  const getThemeClass = (baseClass) => {
    if (theme === 'government') {
      return `${baseClass} government-override`;
    }
    return `${baseClass} sap-theme`;
  };

  const { suppliers = [], inventory, suppliersLoaded = false } = systemData;
  const supplierList = Array.isArray(suppliers) ? suppliers : [];
  const isSuppliersLoading = !suppliersLoaded;
  const isEntrada = formData.type === MOVEMENT_TYPES.ENTRADA;

  // Cargar ubicaciones dinámicamente desde Firebase
  useEffect(() => {
    const loadLocations = async () => {
      if (isEntrada) {
        setLoadingLocations(false);
        return; // Para entradas usamos proveedores, no ubicaciones
      }

      try {
        setLoadingLocations(true);
        const result = await getAllLocations();

        if (result.success && result.data.length > 0) {
          setAvailableLocations(result.data);
          console.log(`🏗️ Ubicaciones cargadas dinámicamente: ${result.data.length}`, result.data);
        } else {
          console.warn('⚠️ No se encontraron ubicaciones en Firebase, usando fallback');
          // Fallback a ubicaciones básicas si no hay datos
          setAvailableLocations(['bodega austria']);
          setError('No se encontraron ubicaciones configuradas. Contacta al administrador.');
        }
      } catch (error) {
        console.error('❌ Error cargando ubicaciones:', error);
        setAvailableLocations(['bodega austria']); // Fallback
        setError('Error al cargar ubicaciones. Usando ubicación por defecto.');
      } finally {
        setLoadingLocations(false);
      }
    };

    loadLocations();
  }, [isEntrada, setError]);

  const handleLocationSelection = useCallback(
    async (location) => {
      setLoading(true);
      setError('');

      try {
        await new Promise((resolve) => setTimeout(resolve, 400));

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
    },
    [isEntrada, updateFormData, setError]
  );

  // Navegación por teclado
  useEffect(() => {
    if (!isActive) return;

    const handleKeyPress = (e) => {
      const num = parseInt(e.key);

      if (isEntrada) {
        const activeSuppliers = Array.isArray(suppliers)
          ? suppliers.filter((s) => s.status === 'active')
          : [];
        if (num >= 1 && num <= activeSuppliers.length) {
          const selectedSupplier = activeSuppliers[num - 1];
          handleLocationSelection(selectedSupplier.name);
        }
      } else {
        if (num >= 1 && num <= availableLocations.length) {
          const selectedLocation = availableLocations[num - 1];
          handleLocationSelection(selectedLocation);
        }
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [isActive, suppliers, isEntrada, handleLocationSelection, availableLocations]);

  // Validar stock disponible en tiempo real para salidas/transferencias
  useEffect(() => {
    const validateLocationStock = async () => {
      if (!isEntrada && formData.fuelType && inventory.length > 0) {
        setValidatingStock(true);

        await new Promise((resolve) => setTimeout(resolve, 600));

        const stockByLocation = {};

        // Usar ubicaciones dinámicas en lugar de hardcodeadas
        for (const location of availableLocations) {
          try {
            const stockResult = await getLocationStock(location, formData.fuelType);

            if (stockResult.success) {
              stockByLocation[location] = stockResult.data;
            } else {
              // Fallback manual si el servicio falla
              const itemsEncontrados = inventory.filter(
                (item) =>
                  item.fuelType?.toUpperCase() === formData.fuelType?.toUpperCase() &&
                  item.location?.toLowerCase() === location.toLowerCase() &&
                  item.status === 'active'
              );

              const availableStock = itemsEncontrados.reduce(
                (total, item) => total + (parseFloat(item.currentStock) || 0),
                0
              );

              const maxCapacity = itemsEncontrados.reduce(
                (total, item) => total + (parseFloat(item.maxCapacity) || 0),
                0
              );

              let status = 'available';
              let message = `${availableStock.toFixed(0)} galones disponibles`;

              if (availableStock === 0) {
                status = 'empty';
                message = 'Sin combustible disponible';
              } else if (availableStock < maxCapacity * 0.2) {
                status = 'low';
                message = `${availableStock.toFixed(0)} gal (stock bajo)`;
              }

              stockByLocation[location] = {
                available: availableStock,
                maxCapacity,
                status,
                message,
                percentage: maxCapacity > 0 ? (availableStock / maxCapacity) * 100 : 0,
              };
            }
          } catch (error) {
            console.error(`❌ Error verificando stock en ${location}:`, error);
            stockByLocation[location] = {
              available: 0,
              maxCapacity: 0,
              status: 'error',
              message: 'Error al verificar stock',
              percentage: 0,
            };
          }
        }

        setStockInfo(stockByLocation);
        setValidatingStock(false);
      }
    };

    validateLocationStock();
  }, [formData.fuelType, isEntrada, inventory, availableLocations]);

  const getLocationIcon = (location) => {
    switch (location.toLowerCase()) {
      case 'oficina principal':
        return '🏢';
      case 'tanque central':
        return '⛽';
      case 'almacén norte':
        return '🏭';
      case 'zona sur':
        return '🌎';
      case 'taller mecánico':
        return '🔧';
      default:
        return '📍';
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
    const activeSuppliers = supplierList.filter((s) => s.status === 'active');

    return (
      <div className={`wizard-step step-location ${getThemeClass('')} ${isActive ? 'active' : ''}`}>
        <div className={getThemeClass('step-question')}>
          <h3>🏪 {getMovementLocationQuestion()}</h3>
          <p>Selecciona el proveedor que está enviando el combustible</p>
        </div>

        {loading && (
          <div className={getThemeClass('wizard-loading')}>
            <div className={getThemeClass('loading-spinner')}></div>
            <p>🔄 Validando proveedor...</p>
          </div>
        )}

        {isSuppliersLoading ? (
          <div className={getThemeClass('wizard-loading')}>
            <div className={getThemeClass('loading-spinner')}></div>
            <p>🔄 Cargando proveedores...</p>
          </div>
        ) : supplierList.length === 0 || activeSuppliers.length === 0 ? (
          <div className={getThemeClass('empty-state')}>
            <div className={getThemeClass('empty-icon')}>🏪</div>
            <h3>No hay proveedores disponibles</h3>
            <p>
              {supplierList.length === 0
                ? 'Aún no se han registrado proveedores en el sistema.'
                : 'No se encontraron proveedores activos en el sistema.'}
            </p>
            <p>Contacta al administrador para agregar proveedores.</p>
          </div>
        ) : (
          <div className={getThemeClass('supplier-options')}>
            {activeSuppliers.map((supplier) => (
              <div
                key={supplier.id}
                className={`${getThemeClass('supplier-option')} ${formData.supplierName === supplier.name ? 'selected' : ''} ${loading ? 'disabled' : ''}`}
                onClick={() => !loading && handleLocationSelection(supplier.name)}
              >
                <div className={getThemeClass('option-icon')}>🏪</div>
                <div className={getThemeClass('option-content')}>
                  <h4 className={getThemeClass('option-title')}>{supplier.name}</h4>
                  <p className={getThemeClass('option-description')}>
                    {supplier.location || 'Proveedor de combustibles'}
                  </p>
                  {supplier.contact && (
                    <small className={getThemeClass('supplier-contact')}>
                      📞 {supplier.contact}
                    </small>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {formData.supplierName && (
          <div className={getThemeClass('selection-confirmation')}>
            <div className={getThemeClass('confirmation-card')}>
              <span className={getThemeClass('confirmation-icon')}>🏪</span>
              <div className={getThemeClass('confirmation-text')}>
                <strong>Genial! Recibirás combustible de {formData.supplierName}</strong>
                <br />
                <small>El combustible será registrado en el inventario</small>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Renderizar opciones para salidas/transferencias (ubicaciones operativas)
  return (
    <div className={`wizard-step step-location ${getThemeClass('')} ${isActive ? 'active' : ''}`}>
      <div className={getThemeClass('step-question')}>
        <h3>📍 {getMovementLocationQuestion()}</h3>
        <p>Elige la ubicación donde está almacenado el combustible</p>
      </div>

      {validatingStock && (
        <div className={getThemeClass('wizard-loading')}>
          <div className={getThemeClass('loading-spinner')}></div>
          <p>⚙️ Verificando stock por ubicación...</p>
        </div>
      )}

      <div className={getThemeClass('location-options')}>
        {availableLocations.map((location, index) => {
          const stockData = stockInfo[location] || {};
          const isLocationSelected = formData.location === location;

          return (
            <div
              key={location}
              className={`${getThemeClass('location-option')} ${isLocationSelected ? 'selected' : ''} ${stockData.status || ''} ${loading ? 'disabled' : ''}`}
              onClick={() => !loading && handleLocationSelection(location)}
              style={{
                position: 'relative',
                transition: 'all 0.3s ease',
              }}
            >
              <div className={getThemeClass('option-icon')}>{getLocationIcon(location)}</div>
              <div className={getThemeClass('option-content')}>
                <h4 className={getThemeClass('option-title')}>{formatLocationName(location)}</h4>
                <p className={getThemeClass('option-description')}>
                  {stockData.message || 'Verificando disponibilidad...'}
                </p>

                {stockData.available > 0 && (
                  <div className={getThemeClass('stock-indicator')}>
                    <div className={getThemeClass('stock-bar-mini')}>
                      <div
                        className={getThemeClass('stock-fill-mini')}
                        style={{ width: `${Math.min(stockData.percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Número de opción para navegación por teclado */}
              <div className={getThemeClass('option-number')}>{index + 1}</div>
            </div>
          );
        })}
      </div>

      {formData.location && stockInfo[formData.location] && (
        <div className={getThemeClass('selection-confirmation')}>
          <div className={getThemeClass('confirmation-card')}>
            <span className={getThemeClass('confirmation-icon')}>
              {getLocationIcon(formData.location)}
            </span>
            <div className={getThemeClass('confirmation-text')}>
              <strong>Excelente! Usarás {formatLocationName(formData.location)}</strong>
              <br />
              <small>{stockInfo[formData.location].message}</small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step3_Location;
