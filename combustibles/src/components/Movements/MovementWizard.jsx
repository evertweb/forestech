/**
 * MovementWizard - Formulario tipo quiz progresivo para movimientos de combustibles
 * Guía al usuario paso a paso con validaciones en tiempo real y feedback visual
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createMovement, MOVEMENT_TYPES } from '../../services/movementsService';
import { useCombustibles } from '../../contexts/CombustiblesContext';
import { getActiveProducts } from '../../services/productsService';

// Importar pasos del wizard
import Step1_MovementType from './WizardSteps/Step1_MovementType';
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
  const { inventory, vehicles, suppliers } = useCombustibles();
  
  // Estado del wizard
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
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

  // Estados de validación por paso (comentadas por ahora)
  // const [stepValidations, setStepValidations] = useState({
  //   1: false, // Tipo de movimiento
  //   2: false, // Combustible  
  //   3: false, // Ubicación origen
  //   4: false, // Cantidad
  //   5: false, // Vehículo (condicional)
  //   6: false, // Destino (condicional)
  //   7: false, // Detalles
  //   8: false  // Resumen
  // });

  // Configuración de pasos
  const stepConfig = {
    1: { title: 'Tipo de Movimiento', description: '¿Qué operación realizarás?' },
    2: { title: 'Combustible', description: '¿Qué producto vas a mover?' },
    3: { title: 'Origen/Proveedor', description: formData.type === MOVEMENT_TYPES.ENTRADA ? '¿De qué proveedor?' : '¿De dónde proviene?' },
    '3b': { title: 'Ubicación Destino', description: '¿A dónde llegará?' },
    4: { title: 'Cantidad', description: '¿Cuánto necesitas?' },
    5: { title: 'Vehículo/Equipo', description: '¿A qué destino?' },
    6: { title: 'Ubicación Destino', description: '¿Hacia dónde va?' },
    7: { title: 'Detalles', description: 'Información adicional' },
    8: { title: 'Confirmación', description: 'Revisa y confirma' }
  };

  // Sincronizar datos del contexto con systemData y cargar productos
  useEffect(() => {
    const loadSystemData = async () => {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
        setSystemData(prev => ({ ...prev, loadingData: true }));
        
        try {
          console.log('🔄 Cargando productos y sincronizando datos en tiempo real...');
          
          // Solo cargar productos independientemente - inventory, vehicles, suppliers vienen del contexto
          const productsData = await getActiveProducts();
          
          // Usar datos del contexto (que están en tiempo real) + productos cargados
          setSystemData({
            vehicles: vehicles || [],
            inventory: inventory || [], // ✅ Datos en tiempo real del contexto
            suppliers: suppliers || [], // ✅ Datos en tiempo real del contexto
            products: productsData || [],
            loadingData: false
          });
          
          console.log('✅ Datos sincronizados para wizard - inventario en tiempo real:', inventory?.length || 0, 'items');
        } catch (error) {
          console.error('❌ Error al cargar datos del sistema:', error);
          setSystemData(prev => ({ ...prev, loadingData: false }));
        }
      } else {
        document.body.style.overflow = 'unset';
      }
    };

    loadSystemData();
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, inventory, vehicles, suppliers]); // ✅ Reaccionar a cambios del contexto

  // Determinar total de pasos según tipo de movimiento
  const getTotalSteps = () => {
    if (!formData.type) return 8;
    
    let steps;
    
    // Para transferencias: todos los pasos (1,2,3,4,5,6,7,8)
    if (formData.type === MOVEMENT_TYPES.TRANSFERENCIA) {
      steps = 8;
    }
    // Para salidas: incluye vehículo, sin destino (1,2,3,4,5,7,8)
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
    console.log('🔍 [TOTAL STEPS]', {
      type: formData.type,
      totalSteps: steps,
      currentStep: currentStep
    });
    
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
        isValid = !!formData.fuelType;
        // 🔍 DEBUG: Log específico para fuelType
        console.log('🔍 [STEP 2 VALIDATION]', {
          fuelType: formData.fuelType,
          isValid,
          formData: formData
        });
        break;
      case 3:
        if (formData.type === MOVEMENT_TYPES.ENTRADA) {
          isValid = !!formData.supplierName; // Proveedor para entradas
        } else {
          isValid = !!formData.location; // Ubicación origen para salidas/transferencias
        }
        break;
      case '3b': // Paso adicional para destino en entradas
        isValid = !!formData.destinationLocation;
        break;
      case 4:
        isValid = formData.quantity && parseFloat(formData.quantity) > 0;
        // DEBUG: Log temporal para identificar problema
        console.log('🔍 [DEBUG Step 4] Validación cantidad:', {
          step: currentStep,
          quantity: formData.quantity,
          parsedQuantity: parseFloat(formData.quantity),
          isQuantityValid: !!formData.quantity,
          isParsedValid: parseFloat(formData.quantity) > 0,
          finalValidation: isValid,
          formData: formData
        });
        break;
      case 5:
        if (formData.type === MOVEMENT_TYPES.SALIDA) {
          isValid = !!formData.vehicleId;
        } else {
          isValid = true; // Skip para otros tipos
        }
        break;
      case 6:
        if (formData.type === MOVEMENT_TYPES.TRANSFERENCIA) {
          isValid = !!formData.destinationLocation;
        } else {
          isValid = true; // Skip para otros tipos
        }
        break;
      case 7:
        isValid = !!formData.unitPrice && parseFloat(formData.unitPrice) >= 0;
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
  }, [currentStep, formData]);

  // Validación memoizada para evitar problemas de sincronización en el render
  const isCurrentStepValid = useMemo(() => {
    return validateCurrentStep();
  }, [validateCurrentStep]);

  // Navegar al siguiente paso
  const nextStep = () => {
    const isCurrentStepValid = validateCurrentStep();
    
    // DEBUG: Log del evento de navegación
    console.log('🔍 [DEBUG nextStep] Intentando navegar:', {
      currentStep,
      isValid: isCurrentStepValid,
      formData: formData,
      type: formData.type
    });
    
    if (isCurrentStepValid) {
      const totalSteps = getTotalSteps();
      
      // Determinar el siguiente paso basado en tipo de movimiento
      let nextStepNumber = currentStep + 1;
      
      // Lógica especial para entradas (agregar paso 3b)
      if (currentStep === 3 && formData.type === MOVEMENT_TYPES.ENTRADA) {
        nextStepNumber = '3b'; // Ir al paso de destino para entradas
      } else if (currentStep === '3b') {
        nextStepNumber = 4; // Del paso 3b ir al paso 4 (cantidad)
      }
      // Saltar pasos no aplicables para otros tipos
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
      else if (currentStep === 5 && formData.type !== MOVEMENT_TYPES.TRANSFERENCIA) {
        nextStepNumber = 7;
      }
      
      console.log('🔍 [DEBUG Navigation] Navegando:', {
        from: currentStep,
        to: nextStepNumber,
        totalSteps: totalSteps
      });
      
      // Mapear pasos lógicos a números para navegación
      const getLogicalStepNumber = (step) => {
        // Mapeo específico para entradas: 1→2→3→3b→4→7→8 (7 pasos)
        if (formData.type === MOVEMENT_TYPES.ENTRADA) {
          const entryMapping = { 1: 1, 2: 2, 3: 3, '3b': 4, 4: 5, 7: 6, 8: 7 };
          return entryMapping[step] || step;
        }
        
        // Mapeo específico para salidas: 1→2→3→4→5→7→8 (7 pasos)
        if (formData.type === MOVEMENT_TYPES.SALIDA) {
          const exitMapping = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 7: 6, 8: 7 };
          return exitMapping[step] || step;
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
  };

  // Navegar al paso anterior
  const prevStep = () => {
    if (currentStep > 1 && currentStep !== '3b') {
      let prevStepNumber = currentStep - 1;
      
      // Lógica especial para navegación hacia atrás
      if (currentStep === 4 && formData.type === MOVEMENT_TYPES.ENTRADA) {
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
  };

  // Enviar formulario final
  const handleSubmit = async (finalData = null) => {
    setIsLoading(true);
    setError('');

    try {
      // Usar datos finales si se proporcionan (incluyen comentarios), sino usar formData
      const dataToUse = finalData || formData;
      
      // 🔍 DEBUG: Log completo antes de crear movimiento
      console.log('🔍 [SUBMIT] Datos completos antes de crear movimiento:', dataToUse);
      console.log('🔍 [SUBMIT] FuelType específico:', dataToUse.fuelType);
      
      // 🔍 DEBUG: Log específico para SALIDAS
      if (dataToUse.type === MOVEMENT_TYPES.SALIDA) {
        console.log('🔍 [SUBMIT SALIDA] Validando campos requeridos:', {
          type: dataToUse.type,
          fuelType: dataToUse.fuelType,
          vehicleId: dataToUse.vehicleId,
          location: dataToUse.location,
          quantity: dataToUse.quantity,
          unitPrice: dataToUse.unitPrice
        });
      }
      
      const movementData = {
        ...dataToUse,
        quantity: parseFloat(dataToUse.quantity),
        unitPrice: parseFloat(dataToUse.unitPrice),
        effectiveDate: new Date(dataToUse.effectiveDate)
      };

      console.log('🔍 [SUBMIT] MovementData enviado a createMovement:', movementData);
      await createMovement(movementData);
      onSuccess();
      
      // Reset wizard
      setCurrentStep(1);
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
      setError
    };

    switch (currentStep) {
      case 1:
        return <Step1_MovementType {...commonProps} />;
      case 2:
        return <Step2_FuelType {...commonProps} />;
      case 3:
        return <Step3_Location {...commonProps} />;
      case '3b':
        return <Step6_Destination {...commonProps} isEntryDestination={true} />;
      case 4:
        return <Step4_Quantity {...commonProps} />;
      case 5:
        return <Step5_Vehicle {...commonProps} />;
      case 6:
        return <Step6_Destination {...commonProps} />;
      case 7:
        return <Step7_Details {...commonProps} />;
      case 8:
        return <Step8_Summary {...commonProps} onSubmit={handleSubmit} isLoading={isLoading} />;
      default:
        return <div>Paso no encontrado</div>;
    }
  };

  if (!isOpen) return null;

  const totalSteps = getTotalSteps();
  // Mapear pasos para la barra de progreso
  const getLogicalStepNumber = (step) => {
    // Mapeo específico para entradas: 1→2→3→3b→4→7→8 (7 pasos)
    if (formData.type === MOVEMENT_TYPES.ENTRADA) {
      const entryMapping = { 1: 1, 2: 2, 3: 3, '3b': 4, 4: 5, 7: 6, 8: 7 };
      return entryMapping[step] || step;
    }
    
    // Mapeo específico para salidas: 1→2→3→4→5→7→8 (7 pasos)
    if (formData.type === MOVEMENT_TYPES.SALIDA) {
      const exitMapping = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 7: 6, 8: 7 };
      return exitMapping[step] || step;
    }
    
    // Mapeo para otros tipos (transferencias, ajustes)
    const generalMapping = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8 };
    return generalMapping[step] || step;
  };
  const currentLogicalStep = getLogicalStepNumber(currentStep);
  const progress = (currentLogicalStep / totalSteps) * 100;

  // 🔍 DEBUG: Logs temporales para navegación
  console.log('🔍 [WIZARD DEBUG]', {
    type: formData.type,
    currentStep,
    currentLogicalStep,
    totalSteps,
    progress,
    isLastStep: currentStep >= totalSteps,
    formDataKeys: Object.keys(formData).filter(k => formData[k]),
    fuelType: formData.fuelType
  });

  return (
    <div className="modal-overlay wizard-overlay" onClick={onClose}>
      <div className="modal-content wizard-modal typeform-mode" onClick={e => e.stopPropagation()}>
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
            <h3>🧙‍♂️ Asistente de Movimientos</h3>
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

          {currentLogicalStep < totalSteps ? (
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
              disabled={isLoading || !isCurrentStepValid || isTransitioning}
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
      </div>
    </div>
  );
};

export default MovementWizard;
