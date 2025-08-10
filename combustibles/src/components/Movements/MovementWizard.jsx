/**
 * MovementWizard - Formulario tipo quiz progresivo para movimientos de combustibles
 * Guía al usuario paso a paso con validaciones en tiempo real y feedback visual
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createMovement, MOVEMENT_TYPES } from '../../services/movementsService';
import { useCombustibles } from '../../contexts/CombustiblesContext';
import { getActiveProducts } from '../../services/productsService';
import { getAllSuppliers } from '../../services/suppliersService';
import { MODAL_PRESETS, UI_ACTIONS, UI_MESSAGES } from '../../constants';
import {
  validators,
  validateForm as runValidation,
  validationSchemas,
} from '../../utils/validators';

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
import './WizardSteps-SAP.css';

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
  const [_suppliersData, setSuppliersData] = useState([]);
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
    currentHours: '',
  });

  // Datos del sistema (solo productos necesitan carga independiente)
  const [systemData, setSystemData] = useState({
    vehicles: [],
    inventory: [],
    suppliers: [],
    products: [],
    loadingData: true,
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
      currentHours: '',
    });
  };

  // Cargar datos del sistema y resetear el wizard cuando se abre
  useEffect(() => {
    let suppliersUnsubscribe = null;
    let fallbackTimer = null;

    if (isOpen) {
      document.body.classList.add('modal-open');

      // Resetear estado antes de cargar nuevos datos
      resetWizard();

      setSystemData((prev) => ({ ...prev, loadingData: true }));
      setSuppliersLoading(true);

      // Suscribirse a suppliers inmediatamente
      if (subscribeToSuppliers) {
        suppliersUnsubscribe = subscribeToSuppliers((suppliersData) => {
          const newSuppliers = suppliersData || [];
          setSuppliersData(newSuppliers);
          setSuppliersLoading(false);

          // Actualizar systemData directamente para evitar dependencias circulares
          setSystemData((prev) => ({
            ...prev,
            suppliers: newSuppliers,
          }));
        });

        // Fallback: Si después de 3 segundos no tenemos suppliers, cargar con getAllSuppliers
        fallbackTimer = setTimeout(async () => {
          setSuppliersData((currentSuppliers) => {
            if (currentSuppliers.length === 0) {
              // Solo ejecutar fallback si aún no tenemos suppliers
              getAllSuppliers()
                .then((result) => {
                  if (result.success && result.data.length > 0) {
                    const fallbackSuppliers = result.data;
                    setSuppliersData(fallbackSuppliers);
                    setSuppliersLoading(false);

                    // Actualizar systemData directamente
                    setSystemData((prev) => ({
                      ...prev,
                      suppliers: fallbackSuppliers,
                    }));
                  }
                })
                .catch((error) => {
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

          // Actualizar systemData sin sobrescribir los suppliers que se están cargando
          setSystemData((prev) => ({
            ...prev,
            vehicles: vehicles || [],
            inventory: inventory || [],
            products: productsData || [],
            loadingData: false,
            // NO sobrescribir suppliers aquí - se actualizan en el callback de suscripción
          }));

          console.log(
            '✅ Datos sincronizados para wizard - inventario en tiempo real:',
            inventory?.length || 0,
            'items'
          );
        } catch (error) {
          console.error('❌ Error al cargar datos del sistema:', error);
          setError(UI_MESSAGES.ERROR.LOAD_FAILED + '. Inténtalo de nuevo.');
          setSystemData((prev) => ({ ...prev, loadingData: false }));
          setSuppliersLoading(false);
        }
      };

      loadProducts();
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
      if (suppliersUnsubscribe) {
        suppliersUnsubscribe();
      }
      if (fallbackTimer) {
        clearTimeout(fallbackTimer);
      }
    };
  }, [isOpen, inventory, vehicles, subscribeToSuppliers]); // ✅ FIXED: removido 'suppliers' de dependencias

  // NOTA: systemData.suppliers se actualiza directamente en los callbacks de suscripción
  // para evitar dependencias circulares y bucles infinitos

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
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError('');
  };

  // Validar paso actual
  const validateCurrentStep = useCallback(() => {
    let result = { isValid: false };

    const schema = validationSchemas?.movement || {};
    const pick = (fields) => {
      const s = {};
      fields.forEach((f) => {
        if (schema[f]) s[f] = schema[f];
      });
      return s;
    };

    switch (currentStep) {
      case 1: {
        result = runValidation(formData, pick(['type']));
        break;
      }
      case 2: {
        if (formData.type === MOVEMENT_TYPES.SALIDA) {
          result = runValidation(formData, pick(['effectiveDate']));
        } else {
          result = runValidation(formData, pick(['fuelType']));
        }
        break;
      }
      case 3: {
        if (formData.type === MOVEMENT_TYPES.SALIDA) {
          result = runValidation(formData, pick(['fuelType']));
        } else if (formData.type === MOVEMENT_TYPES.ENTRADA) {
          // proveedor requerido
          result = runValidation(formData, { supplierName: [validators.required] });
        } else {
          // ubicación origen requerida
          result = runValidation(formData, { location: [validators.required] });
        }
        break;
      }
      case '3b': {
        // destino requerido en entradas
        result = runValidation(formData, { destinationLocation: [validators.required] });
        break;
      }
      case 4: {
        if (formData.type === MOVEMENT_TYPES.SALIDA) {
          // vehículo obligatorio; si requiere horómetro, validar horas requeridas y no negativas
          const base = runValidation(formData, { vehicleId: [validators.required] });
          if (!base.isValid) {
            result = base;
            break;
          }

          let requiresHourMeter = false;
          if (formData.vehicleId && Array.isArray(vehicles)) {
            const selectedVehicle = vehicles.find((v) => v.vehicleId === formData.vehicleId);
            if (selectedVehicle) {
              const fuel = (selectedVehicle.fuelType || '').toLowerCase();
              requiresHourMeter = fuel === 'diesel';
            }
          }

          if (requiresHourMeter) {
            result = runValidation(formData, {
              currentHours: [validators.required, validators.nonNegative],
            });
          } else {
            result = { isValid: true, errors: {} };
          }
        } else {
          // cantidad positiva
          result = runValidation(formData, pick(['quantity']));
        }
        break;
      }
      case 5: {
        if (formData.type === MOVEMENT_TYPES.SALIDA) {
          result = runValidation(formData, pick(['quantity']));
        } else {
          // otros tipos: sin validación en este paso
          result = { isValid: true, errors: {} };
        }
        break;
      }
      case 6: {
        if (formData.type === MOVEMENT_TYPES.SALIDA) {
          result = runValidation(formData, pick(['unitPrice']));
        } else if (formData.type === MOVEMENT_TYPES.TRANSFERENCIA) {
          result = runValidation(formData, { destinationLocation: [validators.required] });
        } else {
          result = { isValid: true, errors: {} };
        }
        break;
      }
      case 7: {
        if (formData.type === MOVEMENT_TYPES.SALIDA) {
          // Resumen
          result = { isValid: true, errors: {} };
        } else {
          result = runValidation(formData, pick(['unitPrice']));
        }
        break;
      }
      case 8: {
        result = { isValid: true, errors: {} };
        break;
      }
      default:
        result = { isValid: false, errors: {} };
    }

    const { isValid } = result;
    console.log('🔍 [DEBUG General] validateCurrentStep (centralizado):', { currentStep, isValid });
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
      } else if (
        currentStep === 5 &&
        formData.type !== MOVEMENT_TYPES.TRANSFERENCIA &&
        formData.type !== MOVEMENT_TYPES.SALIDA
      ) {
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
      else if (
        currentStep === 7 &&
        formData.type !== MOVEMENT_TYPES.TRANSFERENCIA &&
        formData.type !== MOVEMENT_TYPES.SALIDA
      ) {
        prevStepNumber = 4;
      } else if (currentStep === 6 && formData.type !== MOVEMENT_TYPES.SALIDA) {
        prevStepNumber = 4;
      }

      setCurrentStep(prevStepNumber);
    } else if (currentStep === '3b') {
      setCurrentStep(3); // Del paso 3b al paso 3
    }

    setTimeout(() => setIsTransitioning(false), 300);
  };

  // Enviar formulario final
  const handleSubmit = async () => {
    // No necesita argumentos
    setIsLoading(true);
    setError('');

    try {
      // Validación final: tipo, producto, cantidad, precio, fecha
      const baseValidation = runValidation(formData, validationSchemas.movement);
      if (!baseValidation.isValid) {
        setIsLoading(false);
        setError('Revisa los campos requeridos: tipo, combustible, cantidad, precio y fecha.');
        return;
      }

      // Reglas adicionales según tipo de movimiento
      // - SALIDA: vehículo requerido; si es diesel, currentHours requerido
      if (formData.type === MOVEMENT_TYPES.SALIDA) {
        const v1 = runValidation(formData, { vehicleId: [validators.required] });
        if (!v1.isValid) {
          setIsLoading(false);
          setError('Selecciona un vehículo válido.');
          return;
        }

        let requiresHourMeter = false;
        if (formData.vehicleId && Array.isArray(vehicles)) {
          const selectedVehicle = vehicles.find((v) => v.vehicleId === formData.vehicleId);
          if (selectedVehicle) {
            const fuel = (selectedVehicle.fuelType || '').toLowerCase();
            requiresHourMeter = fuel === 'diesel';
          }
        }
        if (requiresHourMeter) {
          const v2 = runValidation(formData, {
            currentHours: [validators.required, validators.nonNegative],
          });
          if (!v2.isValid) {
            setIsLoading(false);
            setError('Ingresa las horas actuales del horómetro.');
            return;
          }
        }
      }

      // Usar directamente el estado 'formData' que ya tiene los comentarios
      const dataToSubmit = { ...formData };

      const movementData = {
        ...dataToSubmit,
        quantity: parseFloat(dataToSubmit.quantity),
        unitPrice: parseFloat(dataToSubmit.unitPrice),
        effectiveDate: new Date(dataToSubmit.effectiveDate),
      };

      console.log('🔍 [SUBMIT] MovementData enviado a createMovement:', movementData);
      await createMovement(movementData);

      // Notificar éxito y resetear para el próximo uso
      onSuccess();
      resetWizard();
    } catch (error) {
      console.error('Error al crear movimiento:', error);
      setError(error.message || `${UI_MESSAGES.ERROR.GENERAL} al crear el movimiento`);
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
      isActive: !isTransitioning,
    };

    // ✅ NUEVA LÓGICA DE RENDERIZADO PARA SALIDAS
    if (formData.type === MOVEMENT_TYPES.SALIDA) {
      const exitStepComponents = {
        1: <Step1_MovementType {...commonProps} />,
        2: <Step2_Date {...commonProps} />, // PASO 2: Fecha
        3: <Step2_FuelType {...commonProps} />, // PASO 3: Producto (reutiliza Step2_FuelType)
        4: <Step5_Vehicle {...commonProps} />, // PASO 4: Vehículo (reutiliza Step5_Vehicle)
        5: <Step4_Quantity {...commonProps} />, // PASO 5: Cantidad (reutiliza Step4_Quantity)
        6: <Step7_Details {...commonProps} />, // PASO 6: Precio (reutiliza Step7_Details)
        7: (
          <Step8_Summary // PASO 7: Resumen
            {...commonProps}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            onCommentsChange={(comments) => updateFormData('additionalComments', comments)}
            confirmChecked={confirmChecked}
            onConfirmChange={setConfirmChecked}
          />
        ),
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
      8: (
        <Step8_Summary
          {...commonProps}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          onCommentsChange={(comments) => updateFormData('additionalComments', comments)}
          confirmChecked={confirmChecked}
          onConfirmChange={setConfirmChecked}
        />
      ),
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
    <div className={`${MODAL_PRESETS.MOVEMENT_WIZARD.overlay} sap-theme`} onClick={onClose}>
      <div
        className={`${MODAL_PRESETS.MOVEMENT_WIZARD.content} sap-theme typeform-mode ${isLastStep ? 'is-last-step' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón de escape global */}
        <button
          className="typeform-escape sap-theme"
          onClick={onClose}
          aria-label={UI_ACTIONS.CLOSE}
        >
          ✕
        </button>

        {/* Barra de progreso superior estilo Typeform */}
        <div className="typeform-progress sap-theme">
          <div className="typeform-progress-fill sap-theme" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Header con título */}
        <div className="wizard-header typeform-mode sap-theme">
          <div className="wizard-title sap-theme"></div>
        </div>

        {/* Contenido del paso */}
        <div className="wizard-body typeform-mode sap-theme">
          {systemData.loadingData ? (
            <div className="wizard-loading sap-theme">
              <div className="loading-spinner sap-theme"></div>
              <p>🔄 Cargando datos del sistema...</p>
            </div>
          ) : (
            <div className="wizard-step-container sap-theme">{renderCurrentStep()}</div>
          )}
        </div>

        {/* Error global */}
        {error && (
          <div className="wizard-error sap-theme">
            <span className="error-icon sap-theme">⚠️</span>
            {error}
          </div>
        )}

        {/* Navegación flotante estilo Typeform */}
        <div className={`typeform-navigation sap-theme ${isLastStep ? 'centered-final-step' : ''}`}>
          {(currentStep > 1 || currentStep === '3b') && (
            <button
              className="typeform-nav-btn sap-theme"
              onClick={prevStep}
              disabled={isTransitioning}
              aria-label="Paso anterior"
            >
              ←
            </button>
          )}

          {!isLastStep ? (
            <button
              className="typeform-nav-btn sap-theme"
              onClick={nextStep}
              disabled={!isCurrentStepValid || isTransitioning}
              aria-label="Siguiente paso"
            >
              →
            </button>
          ) : (
            <button
              className="typeform-nav-btn sap-theme confirm-button"
              onClick={handleSubmit}
              disabled={isLoading || !confirmChecked || isTransitioning}
              aria-label="Confirmar movimiento"
            >
              <span className="confirm-icon">
                {isLoading ? <span className="loading-spinner small sap-theme"></span> : '✓'}
              </span>
              <span className="confirm-text">
                {isLoading ? 'Guardando...' : 'Confirmar movimiento'}
              </span>
            </button>
          )}
        </div>

        {/* Indicador de paso actual */}
        <div className="typeform-step-indicator sap-theme">
          <div className="step-number sap-theme">{currentLogicalStep}</div>
          <span>de {totalSteps}</span>
        </div>
      </div>
    </div>
  );
};

export default MovementWizard;
