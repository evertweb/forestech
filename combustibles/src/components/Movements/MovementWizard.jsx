/**
 * MovementWizard - Formulario tipo quiz progresivo para movimientos de combustibles
 * Guía al usuario paso a paso con validaciones en tiempo real y feedback visual
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createMovement, MOVEMENT_TYPES } from '../../services/movementsService';
import { useCombustibles } from '../../contexts/CombustiblesContext';
import { getActiveProducts } from '../../services/productsService';
import { getAllSuppliers } from '../../services/suppliersService';

// Importar pasos del wizard
import Step1_MovementType from './WizardSteps/Step1_MovementType';
import Step2_Date from './WizardSteps/Step2_Date';
import Step2_FuelType from './WizardSteps/Step2_FuelType';
import Step3_Location from './WizardSteps/Step3_Location';
import Step4_Quantity from './WizardSteps/Step4_Quantity';
import Step5_Vehicle from './WizardSteps/Step5_Vehicle';
import Step6_Destination from './WizardSteps/Step6_Destination';
import Step7_Details from './WizardSteps/Step7_Details';
import Step8_Summary from './WizardSteps/Step8_Summary';

import './WizardSteps.css';

const MovementWizard = ({ isOpen, onClose, onSuccess }) => {
  // Usar datos en tiempo real del contexto
  const { inventory, vehicles, subscribeToSuppliers } = useCombustibles();
  
  // Estados del wizard
  const [currentStep, setCurrentStep] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmChecked, setConfirmChecked] = useState(false); // Estado para el checkbox de confirmación
  
  // Estado local para suppliers (fix para el error)
  const [suppliers, setSuppliers] = useState([]);
  const [_suppliersLoading, setSuppliersLoading] = useState(false);
  
  // Datos del formulario
  const [formData, setFormData] = useState({
    type: '',
    fuelType: '',
    quantity: '',
    unitPrice: '',
    location: '',
    supplierName: '', // Para movimientos de entrada
    vehicleId: '',
    destinationLocation: '',
    description: '',
    reference: '',
    effectiveDate: new Date().toISOString().slice(0, 16),
    currentHours: ''
  });

  // Datos del sistema (solo productos necesitan carga independiente)
  const [systemData, setSystemData] = useState({
    vehicles: [],
    inventory: [],
    suppliers: [],
    products: [],
    loadingData: true
  });

  // Función para resetear el estado del wizard
  const resetWizard = () => {
    setCurrentStep(1);
    setError('');
    setConfirmChecked(false); // Resetear el checkbox
    setFormData({
      type: '',
      fuelType: '',
      quantity: '',
      unitPrice: '',
      location: '',
      supplierName: '',
      vehicleId: '',
      destinationLocation: '',
      description: '',
      reference: '',
      effectiveDate: new Date().toISOString().slice(0, 16),
      currentHours: ''
    });
  };

  // Cargar datos del sistema y resetear el wizard cuando se abre
  useEffect(() => {
    let suppliersUnsubscribe = null;
    let fallbackTimer = null;
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      
      // Resetear estado antes de cargar nuevos datos
      resetWizard();
      
      setSystemData(prev => ({ ...prev, loadingData: true }));
      setSuppliersLoading(true);
      
      // Suscribirse a suppliers inmediatamente
      if (subscribeToSuppliers) {
        suppliersUnsubscribe = subscribeToSuppliers((suppliersData) => {
          setSuppliers(suppliersData || []);
          setSuppliersLoading(false);
        });
        
        // Fallback: Si después de 3 segundos no tenemos suppliers, cargar con getAllSuppliers
        fallbackTimer = setTimeout(async () => {
          setSuppliers(currentSuppliers => {
            if (currentSuppliers.length === 0) {
              // Solo ejecutar fallback si aún no tenemos suppliers
              getAllSuppliers().then(result => {
                if (result.success && result.data.length > 0) {
                  setSuppliers(result.data);
                  setSuppliersLoading(false);
                }
              }).catch(error => {
                console.error('❌ Error en fallback de suppliers:', error);
              });
            }
            return currentSuppliers;
          });
        }, 3000);
      }
      
      // Cargar productos de forma async
      const loadProducts = async () => {
        try {
          const productsData = await getActiveProducts();
          
          setSystemData({
            vehicles: vehicles || [],
            inventory: inventory || [],
            suppliers: suppliers, // Usar el estado local
            products: productsData || [],
            loadingData: false
          });
          
          console.log('✅ Datos sincronizados para wizard - inventario en tiempo real:', inventory?.length || 0, 'items');
        } catch (error) {
          console.error('❌ Error al cargar datos del sistema:', error);
          setError('No se pudieron cargar los datos necesarios. Inténtalo de nuevo.');
          setSystemData(prev => ({ ...prev, loadingData: false }));
          setSuppliersLoading(false);
        }
      };
      
      loadProducts();
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
      if (suppliersUnsubscribe) {
        suppliersUnsubscribe();
      }
      if (fallbackTimer) {
        clearTimeout(fallbackTimer);
      }
    };
  }, [isOpen, inventory, vehicles, subscribeToSuppliers]);

  // Actualizar systemData cuando los suppliers locales cambien
  useEffect(() => {
    if (suppliers.length > 0) {
      setSystemData(prev => ({
        ...prev,
        suppliers: suppliers
      }));
    }
  }, [suppliers]);

  // Determinar total de pasos según tipo de movimiento
  const getTotalSteps = () => {
    if (!formData.type) return 8;
    
    let steps;
    
    // Para transferencias: todos los pasos (1,2,3,4,5,6,7,8)
    if (formData.type === MOVEMENT_TYPES.TRANSFERENCIA) {
      steps = 8;
    }
    // Para salidas: nuevo flujo optimizado (1,2,3,4,5,6,7) = 7 pasos
    // 1=tipo, 2=fecha, 3=producto, 4=vehículo, 5=cantidad, 6=precio, 7=resumen
    else if (formData.type === MOVEMENT_TYPES.SALIDA) {
      steps = 7;
    }
    // Para entradas: proveedor + destino + detalles (1,2,3,3b,4,7,8) = 7 pasos
    else if (formData.type === MOVEMENT_TYPES.ENTRADA) {
      steps = 7;
    }
    // Para ajustes: sin vehículo ni destino (1,2,3,4,7,8) = 6 pasos
    else {
      steps = 6;
    }
    
    // 🔍 DEBUG: Log para verificar totalSteps
    return steps;
  };

  // Actualizar datos del formulario
  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  // Validar paso actual
  const validateCurrentStep = useCallback(() => {
    let isValid = false;
    
    switch (currentStep) {
      case 1:
        isValid = !!formData.type;
        break;
      case 2:
        // Para SALIDA: validar fecha (paso 2)
        if (formData.type === MOVEMENT_TYPES.SALIDA) {
          isValid = !!formData.effectiveDate;
        } else {
          // Para otros tipos: validar fuelType (paso 2 original)
          isValid = !!formData.fuelType;
        }
        break;
      case 3:
        // Para SALIDA: validar producto/fuelType (paso 3)
        if (formData.type === MOVEMENT_TYPES.SALIDA) {
          isValid = !!formData.fuelType;
        } else if (formData.type === MOVEMENT_TYPES.ENTRADA) {
          isValid = !!formData.supplierName; // Proveedor para entradas
        } else {
          isValid = !!formData.location; // Ubicación origen para transferencias/ajustes
        }
        break;
      case '3b': // Paso adicional para destino en entradas
        isValid = !!formData.destinationLocation;
        break;
      case 4:
        // Para SALIDA: validar vehículo (paso 4)
        if (formData.type === MOVEMENT_TYPES.SALIDA) {
          isValid = !!formData.vehicleId;
          
          // Si hay vehículo seleccionado, verificar si requiere horómetro
          if (isValid && formData.vehicleId) {
            const selectedVehicle = vehicles.find(v => v.vehicleId === formData.vehicleId);
            if (selectedVehicle) {
              const requiresHourMeter = selectedVehicle.fuelType === 'diesel' || selectedVehicle.fuelType === 'Diesel';
              if (requiresHourMeter) {
                isValid = !!formData.currentHours && parseFloat(formData.currentHours) >= 0;
              }
            }
          }
        } else {
          // Para otros tipos: validar cantidad (paso 4 original)
          isValid = formData.quantity && parseFloat(formData.quantity) > 0;
        }
        break;
      case 5:
        // Para SALIDA: validar cantidad (paso 5)
        if (formData.type === MOVEMENT_TYPES.SALIDA) {
          isValid = formData.quantity && parseFloat(formData.quantity) > 0;
        } else {
          // Para otros tipos: validar vehículo si es necesario
          if (formData.type === MOVEMENT_TYPES.TRANSFERENCIA) {
            isValid = true; // Skip vehículo para transferencias
          } else {
            isValid = true; // Skip para otros tipos
          }
        }
        break;
      case 6:
        // Para SALIDA: validar precio (paso 6)
        if (formData.type === MOVEMENT_TYPES.SALIDA) {
          isValid = !!formData.unitPrice && parseFloat(formData.unitPrice) >= 0;
        } else if (formData.type === MOVEMENT_TYPES.TRANSFERENCIA) {
          isValid = !!formData.destinationLocation;
        } else {
          isValid = true; // Skip para otros tipos
        }
        break;
      case 7:
        // Para SALIDA: resumen (paso 7)
        if (formData.type === MOVEMENT_TYPES.SALIDA) {
          isValid = true; // Resumen siempre válido si llegamos aquí
        } else {
          // Para otros tipos: validar precio (paso 7 original)
          isValid = !!formData.unitPrice && parseFloat(formData.unitPrice) >= 0;
        }
        break;
      case 8:
        isValid = true; // Resumen siempre válido si llegamos aquí
        break;
      default:
        isValid = false;
    }
    
    // DEBUG: Log general de validación
    console.log('🔍 [DEBUG General] validateCurrentStep:', {
      currentStep,
      isValid,
      formDataKeys: Object.keys(formData),
      formData
    });
    
    return isValid;
  }, [currentStep, formData, vehicles]);

  // Validación memoizada para evitar problemas de sincronización en el render
  const isCurrentStepValid = useMemo(() => {
    return validateCurrentStep();
  }, [validateCurrentStep]);

  // Navegar al siguiente paso
  const nextStep = () => {
    // Iniciar transición
    setIsTransitioning(true);

    const isCurrentStepValid = validateCurrentStep();
    
    if (isCurrentStepValid) {
      const totalSteps = getTotalSteps();
      
      // Determinar el siguiente paso basado en tipo de movimiento
      let nextStepNumber = currentStep + 1;
      
      // ✅ NUEVA LÓGICA PARA SALIDAS: flujo directo sin saltos
      if (formData.type === MOVEMENT_TYPES.SALIDA) {
        // Flujo directo: 1→2→3→4→5→6→7
        nextStepNumber = currentStep + 1;
      }
      // Lógica especial para entradas (agregar paso 3b)
      else if (currentStep === 3 && formData.type === MOVEMENT_TYPES.ENTRADA) {
        nextStepNumber = '3b'; // Ir al paso de destino para entradas
      } else if (currentStep === '3b') {
        nextStepNumber = 4; // Del paso 3b ir al paso 4 (cantidad)
      }
      // Saltar pasos no aplicables para otros tipos (transferencias, ajustes)
      else if (currentStep === 4 && formData.type !== MOVEMENT_TYPES.SALIDA) {
        // Para transferencias: ir al paso 6 (destino)
        // Para entradas: ir al paso 7 (detalles) - ya pasamos por 3b
        // Para ajustes: ir al paso 7 (detalles)
        if (formData.type === MOVEMENT_TYPES.TRANSFERENCIA) {
          nextStepNumber = 6;
        } else if (formData.type === MOVEMENT_TYPES.ENTRADA) {
          nextStepNumber = 7; // Entradas: del paso 4 (cantidad) al paso 7 (detalles)
        } else {
          nextStepNumber = 7; // Ajustes: del paso 4 al paso 7
        }
      }
      else if (currentStep === 5 && formData.type !== MOVEMENT_TYPES.TRANSFERENCIA && formData.type !== MOVEMENT_TYPES.SALIDA) {
        nextStepNumber = 7;
      }
      
      // Mapear pasos lógicos a números para navegación
      const getLogicalStepNumber = (step) => {
        // ✅ Mapeo específico para SALIDAS: 1→2→3→4→5→6→7 (7 pasos lineales)
        if (formData.type === MOVEMENT_TYPES.SALIDA) {
          return step; // Sin mapeo especial, flujo directo
        }
        
        // Mapeo específico para entradas: 1→2→3→3b→4→7→8 (7 pasos)
        if (formData.type === MOVEMENT_TYPES.ENTRADA) {
          const entryMapping = { 1: 1, 2: 2, 3: 3, '3b': 4, 4: 5, 7: 6, 8: 7 };
          return entryMapping[step] || step;
        }
        
        // Mapeo para otros tipos (transferencias, ajustes)
        const generalMapping = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8 };
        return generalMapping[step] || step;
      };
      const currentLogicalStep = getLogicalStepNumber(nextStepNumber);
      
      if (currentLogicalStep <= totalSteps) {
        setCurrentStep(nextStepNumber);
      }
    } else {
      console.log('❌ [DEBUG] Validación falló, no se puede navegar');
      setError('Por favor completa este paso antes de continuar');
    }

    // Finalizar transición después de un breve retraso para la animación
    setTimeout(() => setIsTransitioning(false), 300);
  };

  // Navegar al paso anterior
  const prevStep = () => {
    setIsTransitioning(true);

    if (currentStep > 1 && currentStep !== '3b') {
      let prevStepNumber = currentStep - 1;
      
      // ✅ NUEVA LÓGICA PARA SALIDAS: navegación lineal hacia atrás
      if (formData.type === MOVEMENT_TYPES.SALIDA) {
        // Flujo directo hacia atrás: 7→6→5→4→3→2→1
        prevStepNumber = currentStep - 1;
      }
      // Lógica especial para navegación hacia atrás en otros tipos
      else if (currentStep === 4 && formData.type === MOVEMENT_TYPES.ENTRADA) {
        prevStepNumber = '3b'; // Del paso 4 al 3b para entradas
      } else if (currentStep === 7 && formData.type === MOVEMENT_TYPES.ENTRADA) {
        prevStepNumber = 4; // Del paso 7 al 4 para entradas (saltamos vehículo y destino)
      }
      // Saltar pasos no aplicables hacia atrás para otros tipos
      else if (currentStep === 7 && formData.type !== MOVEMENT_TYPES.TRANSFERENCIA && formData.type !== MOVEMENT_TYPES.SALIDA) {
        prevStepNumber = 4;
      }
      else if (currentStep === 6 && formData.type !== MOVEMENT_TYPES.SALIDA) {
        prevStepNumber = 4;
      }
      
      setCurrentStep(prevStepNumber);
    } else if (currentStep === '3b') {
      setCurrentStep(3); // Del paso 3b al paso 3
    }

    setTimeout(() => setIsTransitioning(false), 300);
  };

  // Enviar formulario final
  const handleSubmit = async () => { // No necesita argumentos
    setIsLoading(true);
    setError('');

    try {
      // Usar directamente el estado 'formData' que ya tiene los comentarios
      const dataToSubmit = { ...formData };
      
      const movementData = {
        ...dataToSubmit,
        quantity: parseFloat(dataToSubmit.quantity),
        unitPrice: parseFloat(dataToSubmit.unitPrice),
        effectiveDate: new Date(dataToSubmit.effectiveDate)
      };

      console.log('🔍 [SUBMIT] MovementData enviado a createMovement:', movementData);
      await createMovement(movementData);
      
      // Notificar éxito y resetear para el próximo uso
      onSuccess();
      resetWizard();
      
    } catch (error) {
      console.error('Error al crear movimiento:', error);
      setError(error.message || 'Error al crear el movimiento');
    } finally {
      setIsLoading(false);
    }
  };

  // Renderizar paso actual
  const renderCurrentStep = () => {
    const commonProps = {
      formData,
      updateFormData,
      systemData,
      error,
      setError,
      isActive: !isTransitioning
    };

    // ✅ NUEVA LÓGICA DE RENDERIZADO PARA SALIDAS
    if (formData.type === MOVEMENT_TYPES.SALIDA) {
      const exitStepComponents = {
        1: <Step1_MovementType {...commonProps} />,
        2: <Step2_Date {...commonProps} />,           // PASO 2: Fecha
        3: <Step2_FuelType {...commonProps} />,       // PASO 3: Producto (reutiliza Step2_FuelType)
        4: <Step5_Vehicle {...commonProps} />,        // PASO 4: Vehículo (reutiliza Step5_Vehicle)
        5: <Step4_Quantity {...commonProps} />,       // PASO 5: Cantidad (reutiliza Step4_Quantity)
        6: <Step7_Details {...commonProps} />,        // PASO 6: Precio (reutiliza Step7_Details)
        7: <Step8_Summary                             // PASO 7: Resumen
             {...commonProps} 
             onSubmit={handleSubmit} 
             isLoading={isLoading}
             onCommentsChange={(comments) => updateFormData('additionalComments', comments)}
             confirmChecked={confirmChecked}
             onConfirmChange={setConfirmChecked}
           />
      };
      return exitStepComponents[currentStep] || <div>Paso no encontrado</div>;
    }

    // Lógica original para otros tipos de movimientos
    const stepComponents = {
      1: <Step1_MovementType {...commonProps} />,
      2: <Step2_FuelType {...commonProps} />,
      3: <Step3_Location {...commonProps} />,
      '3b': <Step6_Destination {...commonProps} isEntryDestination={true} />,
      4: <Step4_Quantity {...commonProps} />,
      5: <Step5_Vehicle {...commonProps} />,
      6: <Step6_Destination {...commonProps} />,
      7: <Step7_Details {...commonProps} />,
      8: <Step8_Summary 
           {...commonProps} 
           onSubmit={handleSubmit} 
           isLoading={isLoading}
           onCommentsChange={(comments) => updateFormData('additionalComments', comments)}
           confirmChecked={confirmChecked}
           onConfirmChange={setConfirmChecked}
         />
    };

    return stepComponents[currentStep] || <div>Paso no encontrado</div>;
  };

  if (!isOpen) return null;

  const totalSteps = getTotalSteps();
  // Mapear pasos para la barra de progreso
  const getLogicalStepNumber = (step) => {
    // ✅ Mapeo específico para SALIDAS: 1→2→3→4→5→6→7 (7 pasos lineales)
    if (formData.type === MOVEMENT_TYPES.SALIDA) {
      return step; // Sin mapeo especial, flujo directo
    }
    
    // Mapeo específico para entradas: 1→2→3→3b→4→7→8 (7 pasos)
    if (formData.type === MOVEMENT_TYPES.ENTRADA) {
      const entryMapping = { 1: 1, 2: 2, 3: 3, '3b': 4, 4: 5, 7: 6, 8: 7 };
      return entryMapping[step] || step;
    }
    
    // Mapeo para otros tipos (transferencias, ajustes)
    const generalMapping = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8 };
    return generalMapping[step] || step;
  };
  const currentLogicalStep = getLogicalStepNumber(currentStep);
  const progress = (currentLogicalStep / totalSteps) * 100;
  const isLastStep = currentLogicalStep >= totalSteps;

  return (
    <div className="modal-overlay wizard-overlay" onClick={onClose}>
      <div className={`modal-content wizard-modal typeform-mode ${isLastStep ? 'is-last-step' : ''}`} onClick={e => e.stopPropagation()}>
        {/* Botón de escape global */}
        <button className="typeform-escape" onClick={onClose} aria-label="Cerrar wizard">
          ✕
        </button>

        {/* Barra de progreso superior estilo Typeform */}
        <div className="typeform-progress">
          <div 
            className="typeform-progress-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Header con título y botón de cerrar */}
        <div className="wizard-header typeform-mode">
          <div className="wizard-title">
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Contenido del paso */}
        <div className="wizard-body typeform-mode">
          {systemData.loadingData ? (
            <div className="wizard-loading">
              <div className="loading-spinner"></div>
              <p>🔄 Cargando datos del sistema...</p>
            </div>
          ) : (
            <div className="wizard-step-container">
              {renderCurrentStep()}
            </div>
          )}
        </div>

        {/* Error global */}
        {error && (
          <div className="wizard-error">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {/* Navegación flotante estilo Typeform */}
        <div className="typeform-navigation">
          {currentStep > 1 && (
            <button 
              className="typeform-nav-btn"
              onClick={prevStep}
              disabled={isTransitioning}
              aria-label="Paso anterior"
            >
              ←
            </button>
          )}

          {!isLastStep ? (
            <button 
              className="typeform-nav-btn"
              onClick={nextStep}
              disabled={!isCurrentStepValid || isTransitioning}
              aria-label="Siguiente paso"
            >
              →
            </button>
          ) : (
            <button 
              className="typeform-nav-btn"
              onClick={handleSubmit}
              disabled={isLoading || !confirmChecked || isTransitioning}
              aria-label="Confirmar movimiento"
            >
              {isLoading ? (
                <span className="loading-spinner small"></span>
              ) : (
                '✓'
              )}
            </button>
          )}
        </div>

        {/* Indicador de paso actual */}
        <div className="typeform-step-indicator">
          <div className="step-number">{currentLogicalStep}</div>
          <span>de {totalSteps}</span>
        </div>
      </div>
    </div>
  );
};

export default MovementWizard;
