/**
 * MovementWizard - Formulario tipo quiz progresivo para movimientos de combustibles
 * Guía al usuario paso a paso con validaciones en tiempo real y feedback visual
 */

import React, { useState, useEffect } from 'react';
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
    3: { title: 'Ubicación Origen', description: '¿De dónde proviene?' },
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
    
    // Para transferencias: todos los pasos
    if (formData.type === MOVEMENT_TYPES.TRANSFERENCIA) return 8;
    
    // Para salidas: incluye vehículo, sin destino
    if (formData.type === MOVEMENT_TYPES.SALIDA) return 7;
    
    // Para entradas y ajustes: sin vehículo ni destino
    return 6;
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
  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return !!formData.type;
      case 2:
        return !!formData.fuelType;
      case 3:
        if (formData.type === MOVEMENT_TYPES.ENTRADA) {
          return !!formData.location; // Proveedor para entradas
        }
        return !!formData.location; // Ubicación origen para salidas/transferencias
      case 4:
        return formData.quantity && parseFloat(formData.quantity) > 0;
      case 5:
        if (formData.type === MOVEMENT_TYPES.SALIDA) {
          return !!formData.vehicleId;
        }
        return true; // Skip para otros tipos
      case 6:
        if (formData.type === MOVEMENT_TYPES.TRANSFERENCIA) {
          return !!formData.destinationLocation;
        }
        return true; // Skip para otros tipos
      case 7:
        return !!formData.unitPrice && parseFloat(formData.unitPrice) >= 0;
      case 8:
        return true; // Resumen siempre válido si llegamos aquí
      default:
        return false;
    }
  };

  // Navegar al siguiente paso
  const nextStep = () => {
    if (validateCurrentStep()) {
      const totalSteps = getTotalSteps();
      
      // Determinar el siguiente paso basado en tipo de movimiento
      let nextStepNumber = currentStep + 1;
      
      // Saltar pasos no aplicables
      if (currentStep === 4 && formData.type !== MOVEMENT_TYPES.SALIDA) {
        nextStepNumber = formData.type === MOVEMENT_TYPES.TRANSFERENCIA ? 6 : 7;
      }
      if (currentStep === 5 && formData.type !== MOVEMENT_TYPES.TRANSFERENCIA) {
        nextStepNumber = 7;
      }
      
      if (nextStepNumber <= totalSteps) {
        setCurrentStep(nextStepNumber);
      }
    } else {
      setError('Por favor completa este paso antes de continuar');
    }
  };

  // Navegar al paso anterior
  const prevStep = () => {
    if (currentStep > 1) {
      let prevStepNumber = currentStep - 1;
      
      // Saltar pasos no aplicables hacia atrás
      if (currentStep === 7 && formData.type !== MOVEMENT_TYPES.TRANSFERENCIA && formData.type !== MOVEMENT_TYPES.SALIDA) {
        prevStepNumber = 4;
      }
      if (currentStep === 6 && formData.type !== MOVEMENT_TYPES.SALIDA) {
        prevStepNumber = 4;
      }
      
      setCurrentStep(prevStepNumber);
    }
  };

  // Enviar formulario final
  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');

    try {
      const movementData = {
        ...formData,
        quantity: parseFloat(formData.quantity),
        unitPrice: parseFloat(formData.unitPrice),
        effectiveDate: new Date(formData.effectiveDate)
      };

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
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="modal-overlay wizard-overlay" onClick={onClose}>
      <div className="modal-content wizard-modal" onClick={e => e.stopPropagation()}>
        {/* Header con progreso */}
        <div className="wizard-header">
          <div className="wizard-title">
            <h3>🧙‍♂️ Asistente de Movimientos</h3>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
          
          {/* Barra de progreso */}
          <div className="wizard-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="progress-text">
              Paso {currentStep} de {totalSteps}
            </div>
          </div>

          {/* Información del paso actual */}
          <div className="step-info">
            <h4>{stepConfig[currentStep]?.title}</h4>
            <p>{stepConfig[currentStep]?.description}</p>
          </div>
        </div>

        {/* Contenido del paso */}
        <div className="wizard-body">
          {systemData.loadingData ? (
            <div className="wizard-loading">
              <div className="loading-spinner"></div>
              <p>🔄 Cargando datos del sistema...</p>
            </div>
          ) : (
            renderCurrentStep()
          )}
        </div>

        {/* Error global */}
        {error && (
          <div className="wizard-error">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {/* Navegación */}
        <div className="wizard-footer">
          <div className="wizard-navigation">
            <button 
              className="btn-wizard btn-previous"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              ← Anterior
            </button>

            {currentStep < totalSteps ? (
              <button 
                className="btn-wizard btn-next"
                onClick={nextStep}
                disabled={!validateCurrentStep()}
              >
                Siguiente →
              </button>
            ) : (
              <button 
                className="btn-wizard btn-finish"
                onClick={handleSubmit}
                disabled={isLoading || !validateCurrentStep()}
              >
                {isLoading ? (
                  <>
                    <span className="loading-spinner small"></span>
                    Creando...
                  </>
                ) : (
                  '✅ Confirmar Movimiento'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovementWizard;