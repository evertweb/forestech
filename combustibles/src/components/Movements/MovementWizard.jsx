/**
 * MovementWizard - Formulario tipo quiz progresivo para movimientos de combustibles
 * Guía al usuario paso a paso con validaciones en tiempo real y feedback visual
 * 
 * MIGRADO A ZUSTAND (Fase 2 - Sprint 1)
 * - Usa useInventoryStore y useVehiclesStore
 */

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { createMovement, MOVEMENT_TYPES } from '../../services/FirebaseMovementsService';
import { useInventoryStore, useVehiclesStore } from '../../stores';
import { getActiveProducts } from '../../services/FirebaseProductsService';
import { getAllSuppliers } from '../../services/FirebaseSuppliersService';
import { subscribeToVehicles, getAllVehicles } from '../../services/FirebaseVehiclesService';
import { MODAL_PRESETS, UI_ACTIONS, UI_MESSAGES } from '../../constants';
import {
  validators,
  validateForm as runValidation,
  validationSchemas,
} from '../../utils/validators';
import { useFirebaseProgressContext } from '../../contexts/FirebaseProgressContext';

// Importar pasos del wizard
import Step1_MovementType from './WizardSteps/Step1_MovementType';
import Step2_Date from './WizardSteps/Step2_Date';
import Step2_FuelType from './WizardSteps/Step2_FuelType';
import Step3_Location from './WizardSteps/Step3_Location';
import Step3b_InventoryPreview from './WizardSteps/Step3b_InventoryPreview';
import Step4_Quantity from './WizardSteps/Step4_Quantity';
import Step5_Vehicle from './WizardSteps/Step5_Vehicle';
import Step6_Destination from './WizardSteps/Step6_Destination';
import Step7_Details from './WizardSteps/Step7_Details';
import Step8_Summary from './WizardSteps/Step8_Summary';
import Step9_Maintenance from './WizardSteps/Step9_Maintenance';

import './WizardSteps-Government.css';

const MovementWizard = ({ isOpen, onClose, onSuccess, theme = 'government' }) => {
  // 🏪 Zustand Stores - Inventory y Vehicles
  const inventory = useInventoryStore(state => state.inventory);
  const vehicles = useVehiclesStore(state => state.vehicles);
  
  // Note: subscribeToSuppliers no está en un store aún, usar servicio directamente
  const subscribeToSuppliers = getAllSuppliers; // Fallback temporal

  // (Debug logs removidos para reducir spam)

  // Hook para progreso transparente de Firebase
  const { executeWithProgress } = useFirebaseProgressContext();

  // Estados del wizard
  const [currentStep, setCurrentStep] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, _setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmChecked, setConfirmChecked] = useState(false); // Estado para el checkbox de confirmación
  const [movementCreated, setMovementCreated] = useState(false); // Estado para mostrar éxito sin cerrar modal

  // Estado local para suppliers (fix para el error)
  const [_suppliersData, setSuppliersData] = useState([]);
  const [_suppliersLoading, setSuppliersLoading] = useState(false);

  const suppliersDataRef = useRef([]);

  // Estado local para vehículos (fix para el problema de vehículos vacíos)
  const [localVehicles, setLocalVehicles] = useState([]);
  const [_vehiclesLoading, setVehiclesLoading] = useState(false);

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
    suppliersLoaded: false,
  });

  useEffect(() => {
    suppliersDataRef.current = _suppliersData;
  }, [_suppliersData]);

  // Función para resetear el estado del wizard
  const resetWizard = () => {
    setCurrentStep(1);
    setError('');
    setConfirmChecked(false); // Resetear el checkbox
    setMovementCreated(false); // Resetear estado de éxito
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

  // Funciones helper para tema gubernamental
  const generateDocumentCode = () => {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const day = String(new Date().getDate()).padStart(2, '0');
    const random = String(Date.now()).slice(-4);
    return `FORESTECH-MOV-${year}${month}${day}-${random}`;
  };

  const generateStepCode = (step) => {
    return `PASO-${step.toString().padStart(2, '0')}`;
  };

  const getCurrentTimestamp = () => {
    return new Date().toLocaleString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  // Cargar datos del sistema y resetear el wizard cuando se abre
  useEffect(() => {
    console.log('🔥 useEffect PRINCIPAL ejecutado - isOpen:', isOpen);
    let suppliersUnsubscribe = null;
    let vehiclesUnsubscribe = null;
    let fallbackTimer = null;

    if (isOpen) {
      console.log('🔥 ENTRANDO en isOpen=true...');
      document.body.classList.add('modal-open');

    // Resetear estado antes de cargar nuevos datos
    resetWizard();

    setSystemData((prev) => ({ ...prev, loadingData: true, suppliersLoaded: false }));
      setSuppliersLoading(true);
      setVehiclesLoading(true);

      // Verificar vehículos en Firebase (una sola vez al abrir)
      getAllVehicles()
        .then((allVehiclesResult) => {
          const dieselActivos =
            allVehiclesResult?.filter(
              (v) => v.fuelType?.toUpperCase() === 'DIESEL' && v.status === 'activo'
            )?.length || 0;
          console.log(`✅ Vehículos DIESEL activos en Firebase: ${dieselActivos}`);
        })
        .catch((getAllError) => {
          console.error('❌ Error verificando vehículos:', getAllError);
        });

      // Suscribirse a vehículos
      console.log('🔥 INTENTANDO suscribirse a vehículos...');
      try {
        console.log('🔥 Ejecutando subscribeToVehicles...');
        vehiclesUnsubscribe = subscribeToVehicles((vehiclesData, error) => {
          console.log('🔥 CALLBACK EJECUTADO!', { vehiclesData, error });
          if (error) {
            console.error('❌ Error suscripción vehículos:', error);
            setVehiclesLoading(false);
            return;
          }
          const newVehicles = vehiclesData || [];
          setLocalVehicles(newVehicles);
          setVehiclesLoading(false);
          console.log(`🚛 Vehículos cargados en wizard: ${newVehicles.length}`);

          // 🔧 FIX TEMPORAL: Actualizar systemData.vehicles inmediatamente
          if (newVehicles.length > 0) {
            console.log(
              `🔧 FIX: Actualizando systemData.vehicles inmediatamente con ${newVehicles.length} vehículos`
            );
            setSystemData((prev) => ({
              ...prev,
              vehicles: newVehicles,
            }));
          }
        });
      } catch (subscriptionError) {
        console.error('❌ Error FATAL suscripción vehículos:', subscriptionError);
        setVehiclesLoading(false);
      }

      // Suscribirse a suppliers inmediatamente
      if (subscribeToSuppliers) {
        suppliersUnsubscribe = subscribeToSuppliers((suppliersData) => {
          const normalizedSuppliers = Array.isArray(suppliersData)
            ? suppliersData
            : Array.isArray(suppliersData?.data)
              ? suppliersData.data
              : [];

          setSuppliersData(normalizedSuppliers);
          setSuppliersLoading(false);

          // Actualizar systemData directamente para evitar dependencias circulares
          setSystemData((prev) => ({
            ...prev,
            suppliers: normalizedSuppliers,
            suppliersLoaded: true,
          }));
        });

        // Fallback: Si después de 3 segundos no tenemos suppliers, cargar con getAllSuppliers
        fallbackTimer = setTimeout(async () => {
          if (suppliersDataRef.current.length > 0) {
            return;
          }

          try {
            const result = await getAllSuppliers();
            const fallbackSuppliers = Array.isArray(result)
              ? result
              : Array.isArray(result?.data)
                ? result.data
                : [];

            setSuppliersData(fallbackSuppliers);
            setSystemData((prev) => ({
              ...prev,
              suppliers: fallbackSuppliers,
              suppliersLoaded: true,
            }));
          } catch (error) {
            console.error('❌ Error en fallback de suppliers:', error);
            setSystemData((prev) => ({
              ...prev,
              suppliersLoaded: true,
            }));
          } finally {
            setSuppliersLoading(false);
          }
        }, 3000);
      } else {
        setSuppliersLoading(false);
        setSystemData((prev) => ({
          ...prev,
          suppliersLoaded: true,
        }));
      }

      // Cargar productos de forma async
      const loadProducts = async () => {
        try {
          const productsData = await getActiveProducts();

          // Actualizar systemData sin sobrescribir los suppliers que se están cargando
          setSystemData((prev) => ({
            ...prev,
            vehicles: localVehicles.length > 0 ? localVehicles : prev.vehicles || [],
            inventory: inventory || [],
            products: productsData || [],
            loadingData: false,
            // NO sobrescribir suppliers aquí - se actualizan en el callback de suscripción
          }));

          console.log(`🔧 loadProducts() usando vehicles: localVehicles=${localVehicles.length}`);

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
      if (vehiclesUnsubscribe) {
        vehiclesUnsubscribe();
      }
      if (fallbackTimer) {
        clearTimeout(fallbackTimer);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, inventory, vehicles, subscribeToSuppliers]); // ✅ FIXED: removido 'localVehicles' para evitar bucle infinito

  // NOTA: systemData.suppliers se actualiza directamente en los callbacks de suscripción
  // para evitar dependencias circulares y bucles infinitos

  // Actualizar systemData.vehicles cuando localVehicles cambie
  useEffect(() => {
    console.log(`🔄 useEffect localVehicles: ${localVehicles.length} vehículos`);
    if (localVehicles.length > 0) {
      console.log(`📊 systemData.vehicles actualizado: ${localVehicles.length} vehículos`);
      setSystemData((prev) => {
        // Solo actualizar si realmente cambió para evitar re-renders innecesarios
        if (prev.vehicles !== localVehicles) {
          return {
            ...prev,
            vehicles: localVehicles,
          };
        }
        return prev;
      });
    } else {
      console.log(`⚠️ localVehicles está vacío, no actualizando systemData.vehicles`);
    }
  }, [localVehicles]);

  // Solo mantener tecla Escape para cerrar modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeydown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeydown);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [isOpen, onClose]);

  // Función para obtener mensaje de carga específico por paso
  const getStepLoadingMessage = (step) => {
    const messages = {
      1: '⚡ Inicializando módulo de movimientos',
      2: '⛽ Cargando catálogo de combustibles disponibles',
      3: '📍 Verificando ubicaciones y proveedores',
      '3b': '🏭 Validando destinos de almacenamiento',
      4: '🔢 Preparando calculadora de cantidades',
      '4b': '📊 Consultando inventario en tiempo real',
      5: '🚛 Accediendo a registro de vehículos',
      6: '🗺️ Configurando rutas de destino',
      7: '📝 Preparando formulario de detalles',
      8: '📋 Generando resumen del movimiento',
      9: '🔧 Cargando opciones de mantenimiento',
    };
    return messages[step] || `🔄 Procesando paso ${step}`;
  };

  // Helper functions for split-screen terminal - moveré getStepsList aquí
  const getStepsList = () => {
    const allSteps = [
      { number: 1, title: 'TIPO', completed: !!formData.type },
      { number: 2, title: 'COMBUSTIBLE', completed: !!formData.fuelType },
      {
        number: 3,
        title: 'UBICACION',
        completed: formData.type === 'ENTRADA' ? !!formData.supplierName : !!formData.location,
      },
    ];

    if (formData.type === 'ENTRADA') {
      allSteps.push({ number: '3b', title: 'DESTINO', completed: !!formData.destinationLocation });
    }

    allSteps.push({ number: 4, title: 'CANTIDAD', completed: !!formData.quantity });

    if (formData.type === 'SALIDA') {
      allSteps.push({ number: '4b', title: 'INVENTARIO', completed: true });
    }

    if (formData.type !== 'AJUSTE' && formData.type !== 'ENTRADA') {
      allSteps.push({ number: 5, title: 'VEHICULO', completed: !!formData.vehicleId });
    }

    if (formData.type === 'TRANSFERENCIA') {
      allSteps.push({ number: 6, title: 'DESTINO', completed: !!formData.destinationLocation });
    }

    if (formData.type === 'MANTENIMIENTO') {
      allSteps.push({ number: 9, title: 'MANTENIMIENTO', completed: !!formData.maintenanceType });
    }

    allSteps.push(
      { number: 7, title: 'DETALLES', completed: !!formData.description },
      { number: 8, title: 'RESUMEN', completed: false }
    );

    return allSteps;
  };

  // Determinar total de pasos según tipo de movimiento
  const getTotalSteps = () => {
    if (theme === 'government') {
      // Para split-screen, usar la lista de pasos dinámica
      return getStepsList().length;
    }

    // Lógica original para otros temas
    if (!formData.type) return 8;

    let steps;

    // Para transferencias: todos los pasos (1,2,3,4,5,6,7,8)
    if (formData.type === MOVEMENT_TYPES.TRANSFERENCIA) {
      steps = 8;
    }
    // Para salidas: nuevo flujo con ubicación y preview (1,2,3,4,4b,5,6,7,8) = 9 pasos
    // 1=tipo, 2=fecha, 3=producto, 4=ubicación, 4b=preview inventario, 5=vehículo, 6=cantidad, 7=precio, 8=resumen
    else if (formData.type === MOVEMENT_TYPES.SALIDA) {
      steps = 9;
    }
    // Para entradas: proveedor + destino + detalles (1,2,3,3b,4,7,8) = 7 pasos
    else if (formData.type === MOVEMENT_TYPES.ENTRADA) {
      steps = 7;
    }
    // Para mantenimiento: tipo, fecha, producto, vehículo, cantidad, mantenimiento, resumen (1,2,3,4,5,9,8) = 7 pasos
    else if (formData.type === MOVEMENT_TYPES.MANTENIMIENTO) {
      steps = 7;
    }
    // Para ajustes: sin vehículo ni destino (1,2,3,4,7,8) = 6 pasos
    else {
      steps = 6;
    }

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
          // Paso 4: Ubicación de origen - validar que se haya seleccionado
          result = runValidation(formData, { location: [validators.required] });
        } else {
          // cantidad positiva
          result = runValidation(formData, pick(['quantity']));
        }
        break;
      }
      case '4b': {
        // Paso 4b: Preview de inventario - siempre válido (solo informativo)
        result = { isValid: true, errors: {} };
        break;
      }
      case 5: {
        if (formData.type === MOVEMENT_TYPES.SALIDA) {
          // Paso 5: Vehículo - validar vehículo y horómetro si requiere
          const base = runValidation(formData, { vehicleId: [validators.required] });
          if (!base.isValid) {
            result = base;
            break;
          }

          let requiresHourMeter = false;
          if (formData.vehicleId && Array.isArray(vehicles)) {
            const selectedVehicle = vehicles.find((v) => v.vehicleId === formData.vehicleId);
            if (selectedVehicle) {
              const fuel = (selectedVehicle.fuelType || '').toUpperCase();
              requiresHourMeter = fuel === 'DIESEL';
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
          // otros tipos: sin validación en este paso
          result = { isValid: true, errors: {} };
        }
        break;
      }
      case 6: {
        if (formData.type === MOVEMENT_TYPES.SALIDA) {
          // Paso 6: Cantidad
          result = runValidation(formData, pick(['quantity']));
        } else if (formData.type === MOVEMENT_TYPES.TRANSFERENCIA) {
          result = runValidation(formData, { destinationLocation: [validators.required] });
        } else {
          result = { isValid: true, errors: {} };
        }
        break;
      }
      case 7: {
        if (formData.type === MOVEMENT_TYPES.SALIDA) {
          // Paso 7: Precio
          result = runValidation(formData, pick(['unitPrice']));
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

      // ✅ NUEVA LÓGICA PARA SALIDAS: flujo con preview de inventario
      if (formData.type === MOVEMENT_TYPES.SALIDA) {
        if (currentStep === 4) {
          nextStepNumber = '4b'; // Del paso 4 (ubicación) al paso 4b (preview inventario)
        } else if (currentStep === '4b') {
          nextStepNumber = 5; // Del paso 4b (preview) al paso 5 (vehículo)
        } else {
          nextStepNumber = currentStep + 1; // Flujo normal para otros pasos
        }
      }
      // ✅ NUEVA LÓGICA PARA MANTENIMIENTO: flujo con paso específico
      else if (formData.type === MOVEMENT_TYPES.MANTENIMIENTO) {
        if (currentStep === 5) {
          nextStepNumber = 9; // Del paso 5 (cantidad) al paso 9 (mantenimiento)
        } else if (currentStep === 9) {
          nextStepNumber = 8; // Del paso 9 (mantenimiento) al paso 8 (resumen)
        } else {
          nextStepNumber = currentStep + 1; // Flujo normal para otros pasos
        }
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
        // ✅ Mapeo específico para SALIDAS: 1→2→3→4→4b→5→6→7→8 (9 pasos)
        if (formData.type === MOVEMENT_TYPES.SALIDA) {
          const exitMapping = { 1: 1, 2: 2, 3: 3, 4: 4, '4b': 5, 5: 6, 6: 7, 7: 8, 8: 9 };
          return exitMapping[step] || step;
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

    // Finalizar transición después de un breve retraso para la animación shimmer
    setTimeout(() => setIsTransitioning(false), 800);
  };

  // Navegar al paso anterior
  const prevStep = () => {
    setIsTransitioning(true);

    if (currentStep > 1 && currentStep !== '3b' && currentStep !== '4b') {
      let prevStepNumber = currentStep - 1;

      // ✅ NUEVA LÓGICA PARA SALIDAS: navegación con preview hacia atrás
      if (formData.type === MOVEMENT_TYPES.SALIDA) {
        if (currentStep === 5) {
          prevStepNumber = '4b'; // Del paso 5 (vehículo) al paso 4b (preview inventario)
        } else if (currentStep === '4b') {
          prevStepNumber = 4; // Del paso 4b (preview) al paso 4 (ubicación)
        } else {
          prevStepNumber = currentStep - 1; // Flujo normal para otros pasos
        }
      }
      // ✅ NUEVA LÓGICA PARA MANTENIMIENTO: navegación hacia atrás
      else if (formData.type === MOVEMENT_TYPES.MANTENIMIENTO) {
        if (currentStep === 8) {
          prevStepNumber = 9; // Del paso 8 (resumen) al paso 9 (mantenimiento)
        } else if (currentStep === 9) {
          prevStepNumber = 5; // Del paso 9 (mantenimiento) al paso 5 (cantidad)
        } else {
          prevStepNumber = currentStep - 1; // Flujo normal para otros pasos
        }
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
    } else if (currentStep === '4b') {
      setCurrentStep(4); // Del paso 4b al paso 4
    }

    setTimeout(() => setIsTransitioning(false), 800);
  };

  // Enviar formulario final
  const handleSubmit = async () => {
    console.log('🎯 MovementWizard handleSubmit INICIADO');
    console.log('🎯 executeWithProgress function:', executeWithProgress);
    setError('');

    try {
      // Validación final: tipo, producto, cantidad, precio, fecha
      const baseValidation = runValidation(formData, validationSchemas.movement);
      if (!baseValidation.isValid) {
        setError('Revisa los campos requeridos: tipo, combustible, cantidad, precio y fecha.');
        return;
      }

      // Reglas adicionales según tipo de movimiento
      // - SALIDA: vehículo requerido; si es diesel, currentHours requerido
      if (formData.type === MOVEMENT_TYPES.SALIDA) {
        const v1 = runValidation(formData, { vehicleId: [validators.required] });
        if (!v1.isValid) {
          setError('Selecciona un vehículo válido.');
          return;
        }

        let requiresHourMeter = false;
        if (formData.vehicleId && Array.isArray(vehicles)) {
          const selectedVehicle = vehicles.find((v) => v.vehicleId === formData.vehicleId);
          if (selectedVehicle) {
            const fuel = (selectedVehicle.fuelType || '').toUpperCase();
            requiresHourMeter = fuel === 'DIESEL';
          }
        }
        if (requiresHourMeter) {
          const v2 = runValidation(formData, {
            currentHours: [validators.required, validators.nonNegative],
          });
          if (!v2.isValid) {
            setError('Ingresa las horas actuales del horómetro.');
            return;
          }
        }
      }

      // Preparar datos del movimiento
      const dataToSubmit = { ...formData };
      const movementData = {
        ...dataToSubmit,
        quantity: parseFloat(dataToSubmit.quantity),
        unitPrice: parseFloat(dataToSubmit.unitPrice),
        effectiveDate: new Date(dataToSubmit.effectiveDate),
      };

      // Generar descripción detallada para el progreso
      const progressDescription = `Creando movimiento de ${formData.type}: ${formData.quantity} gal de ${formData.fuelType}`;

      console.log('🎯 ANTES de executeWithProgress:', { progressDescription, movementData });
      console.log('🎯 executeWithProgress disponible:', typeof executeWithProgress);

      // Ejecutar con progreso transparente
      console.log('🎪 WIZARD: A punto de ejecutar createMovement con datos:', movementData);
      await executeWithProgress(
        'createMovement',
        progressDescription,
        () => {
          console.log('🎪 WIZARD: Ejecutando createMovement AHORA');
          return createMovement(movementData);
        },
        {
          movementType: formData.type,
          fuelType: formData.fuelType,
          quantity: formData.quantity,
          vehicleId: formData.vehicleId || null,
        }
      );

      console.log('🎯 DESPUÉS de executeWithProgress - ÉXITO');
      console.log('🔍 [SUBMIT] MovementData enviado a createMovement:', movementData);

      // NO cerrar modal automáticamente - mostrar estado de éxito
      setMovementCreated(true);

      // Notificar éxito pero NO llamar onSuccess() (que cierra el modal)
      // onSuccess(); // Comentado para evitar que se cierre
    } catch (error) {
      console.log('🎯 DESPUÉS de executeWithProgress - ERROR');
      console.error('Error al crear movimiento:', error);
      setError(error.message || `${UI_MESSAGES.ERROR.GENERAL} al crear el movimiento`);
    }
  };

  // Función para crear nuevo movimiento (resetear wizard sin cerrar modal)
  const handleNewMovement = () => {
    console.log('🎯 Iniciando nuevo movimiento');
    resetWizard();
  };

  // Función para cerrar modal completamente
  const handleCloseModal = () => {
    console.log('🎯 Cerrando modal completamente');
    onSuccess(); // Llamar onSuccess para cerrar el modal
    resetWizard();
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
      theme, // Agregamos el theme a las props comunes
    };

    // Función para envolver pasos con información gubernamental
    const wrapWithGovernmentInfo = (stepComponent, stepNumber, stepTitle, stepDescription) => {
      if (theme !== 'government') {
        return stepComponent;
      }

      return (
        <>
          {/* Información del Documento Gubernamental */}
          <div className="government-document-info">
            <div className="document-classification">OFICIAL</div>
            <div className="document-header">
              <div className="document-code">DOC: {generateDocumentCode()}</div>
              <div className="document-timestamp">FECHA: {getCurrentTimestamp()}</div>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--gov-medium-gray)' }}>
              Este documento constituye un registro oficial del Sistema Integrado de Gestión de
              Combustibles de Forestech de Colombia S.A.S. Su llenado es obligatorio para el control
              y trazabilidad de los movimientos de combustibles según las normas internas de la
              compañía.
            </div>
          </div>

          {/* Header del Paso Gubernamental */}
          <div className="step-header-government">
            <div className="step-reference">REF: {generateStepCode(stepNumber)}</div>
            <div className="step-number">{stepNumber}</div>
            <h3 className="step-title">{stepTitle}</h3>
            <p className="step-description">{stepDescription}</p>
          </div>

          {/* Contenido del paso envuelto en sección gubernamental */}
          <div className="government-form-section">
            <h4 className="form-section-title">Información Requerida - Paso {stepNumber}</h4>
            {stepComponent}
          </div>

          {/* Alerta informativa gubernamental */}
          <div className="government-alert government-alert-info">
            <div className="alert-title">Información Importante</div>
            <p>
              Los datos ingresados son validados automáticamente contra el inventario actual del
              sistema. Todos los movimientos quedan registrados en el sistema de trazabilidad.
            </p>
          </div>
        </>
      );
    };

    // Obtener títulos y descripciones para cada paso
    const getStepInfo = (stepKey) => {
      const stepMap = {
        1: {
          title: 'Tipo de Movimiento',
          description: 'Seleccione el tipo de operación a registrar en el sistema',
        },
        2: { title: 'Fecha y Hora', description: 'Especifique la fecha y hora del movimiento' },
        3: {
          title: 'Tipo de Combustible',
          description: 'Seleccione el tipo de combustible involucrado',
        },
        4: { title: 'Ubicación', description: 'Confirme la ubicación del movimiento' },
        '4b': {
          title: 'Verificación de Inventario',
          description: 'Revise el inventario disponible',
        },
        5: {
          title: 'Vehículo Asignado',
          description: 'Asigne el vehículo correspondiente al movimiento',
        },
        6: { title: 'Cantidad', description: 'Indique la cantidad exacta del combustible' },
        7: {
          title: 'Detalles Adicionales',
          description: 'Complete la información adicional y observaciones',
        },
        8: {
          title: 'Resumen y Confirmación',
          description: 'Revise todos los datos antes de la confirmación final',
        },
        9: {
          title: 'Información de Mantenimiento',
          description: 'Especifique los datos de mantenimiento del vehículo',
        },
      };
      return (
        stepMap[stepKey] || {
          title: 'Información del Paso',
          description: 'Complete la información requerida',
        }
      );
    };

    // Debug crítico: Solo log cuando Step5 (vehículos) no tiene datos
    if (formData.type === MOVEMENT_TYPES.SALIDA && currentStep === 5) {
      const vehiclesCount = systemData.vehicles?.length || 0;
      if (vehiclesCount === 0) {
        console.log(
          `❌ PROBLEMA: Step5 renderizando SIN vehículos - systemData.vehicles: ${vehiclesCount}, localVehicles: ${localVehicles?.length || 0}`
        );
      }
    }

    // ✅ NUEVA LÓGICA DE RENDERIZADO PARA SALIDAS
    if (formData.type === MOVEMENT_TYPES.SALIDA) {
      const exitStepComponents = {
        1: <Step1_MovementType {...commonProps} />,
        2: <Step2_Date {...commonProps} />, // PASO 2: Fecha
        3: <Step2_FuelType {...commonProps} />, // PASO 3: Producto (reutiliza Step2_FuelType)
        4: <Step3_Location {...commonProps} />, // PASO 4: Ubicación de origen
        '4b': <Step3b_InventoryPreview {...commonProps} />, // PASO 4B: Preview del inventario
        5: <Step5_Vehicle {...commonProps} />, // PASO 5: Vehículo (reutiliza Step5_Vehicle)
        6: <Step4_Quantity {...commonProps} />, // PASO 6: Cantidad (reutiliza Step4_Quantity)
        7: <Step7_Details {...commonProps} />, // PASO 7: Precio (reutiliza Step7_Details)
        8: (
          <Step8_Summary // PASO 8: Resumen
            {...commonProps}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            onCommentsChange={(comments) => updateFormData('additionalComments', comments)}
            confirmChecked={confirmChecked}
            onConfirmChange={setConfirmChecked}
          />
        ),
      };
      const stepComponent = exitStepComponents[currentStep] || <div>Paso no encontrado</div>;
      const stepInfo = getStepInfo(currentStep);
      return wrapWithGovernmentInfo(
        stepComponent,
        currentStep,
        stepInfo.title,
        stepInfo.description
      );
    }

    // ✅ NUEVA LÓGICA DE RENDERIZADO PARA MANTENIMIENTO
    if (formData.type === MOVEMENT_TYPES.MANTENIMIENTO) {
      const maintenanceStepComponents = {
        1: <Step1_MovementType {...commonProps} />, // PASO 1: Tipo
        2: <Step2_Date {...commonProps} />, // PASO 2: Fecha
        3: <Step2_FuelType {...commonProps} />, // PASO 3: Producto (reutiliza Step2_FuelType)
        4: <Step5_Vehicle {...commonProps} />, // PASO 4: Vehículo (reutiliza Step5_Vehicle)
        5: <Step4_Quantity {...commonProps} />, // PASO 5: Cantidad (reutiliza Step4_Quantity)
        9: <Step9_Maintenance {...commonProps} />, // PASO 9: Datos de Mantenimiento
        8: (
          <Step8_Summary // PASO 8: Resumen
            {...commonProps}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            onCommentsChange={(comments) => updateFormData('additionalComments', comments)}
            confirmChecked={confirmChecked}
            onConfirmChange={setConfirmChecked}
          />
        ),
      };
      const stepComponent = maintenanceStepComponents[currentStep] || <div>Paso no encontrado</div>;
      const stepInfo = getStepInfo(currentStep);
      return wrapWithGovernmentInfo(
        stepComponent,
        currentStep,
        stepInfo.title,
        stepInfo.description
      );
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

    const stepComponent = stepComponents[currentStep] || <div>Paso no encontrado</div>;
    const stepInfo = getStepInfo(currentStep);
    return wrapWithGovernmentInfo(stepComponent, currentStep, stepInfo.title, stepInfo.description);
  };

  if (!isOpen) return null;

  const totalSteps = getTotalSteps();
  // Mapear pasos para la barra de progreso
  const getLogicalStepNumber = (step) => {
    // ✅ Mapeo específico para SALIDAS: 1→2→3→4→4b→5→6→7→8 (9 pasos)
    if (formData.type === MOVEMENT_TYPES.SALIDA) {
      const exitMapping = { 1: 1, 2: 2, 3: 3, 4: 4, '4b': 5, 5: 6, 6: 7, 7: 8, 8: 9 };
      return exitMapping[step] || step;
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

  // Sistema de clases completamente independiente por tema
  const getThemeClasses = () => {
    if (theme === 'government') {
      return {
        overlay: 'cli-modal-overlay',
        content: 'cli-wizard-container',
        theme: 'cli-theme',
      };
    }
    return {
      overlay: `apple-modal-overlay`,
      content: `apple-modal typeform-mode ${isLastStep ? 'is-last-step' : ''}`,
      theme: 'apple-theme',
    };
  };

  // Helper para clases específicas - completamente independientes
  const getThemeClass = (component) => {
    if (theme === 'government') {
      // Mapeo único de componentes CLI - sin herencia del tema moderno
      const cliComponents = {
        'typeform-escape': 'cli-exit-btn',
        'typeform-progress': 'cli-progress-bar',
        'typeform-progress-fill': 'cli-progress-fill',
        'wizard-header': 'cli-header',
        'wizard-title': 'cli-title',
        'wizard-body': 'cli-body',
        'wizard-loading': 'cli-loading',
        'loading-spinner': 'cli-spinner',
        'wizard-step-container': 'cli-step-container',
        'wizard-error': 'cli-error',
        'error-icon': 'cli-error-icon',
        'typeform-navigation': 'cli-navigation',
        'typeform-nav-btn': 'cli-nav-btn',
      };
      return cliComponents[component] || `cli-${component}`;
    }
    return `${component} apple-theme`;
  };

  // Helper functions for split-screen terminal
  const getStepTitle = (step) => {
    const titles = {
      1: 'TIPO MOVIMIENTO',
      2: 'COMBUSTIBLE',
      3: 'UBICACION',
      '3b': 'DESTINO',
      4: 'CANTIDAD',
      '4b': 'INVENTARIO',
      5: 'VEHICULO',
      6: 'DESTINO',
      7: 'DETALLES',
      8: 'RESUMEN',
      9: 'MANTENIMIENTO',
    };
    return titles[step] || `PASO ${step}`;
  };

  const themeClasses = getThemeClasses();

  return (
    <div className={themeClasses.overlay} onClick={onClose}>
      <div className={themeClasses.content} onClick={(e) => e.stopPropagation()}>
        {/* Contenido condicional según theme */}
        {theme === 'government' ? (
          <>
            {/* Encabezado Gubernamental */}
            <div className="government-header">
              <div className="government-reference">
                FORESTECH-MOV-{new Date().getFullYear()}
                {String(new Date().getMonth() + 1).padStart(2, '0')}
                {String(new Date().getDate()).padStart(2, '0')}-{String(Date.now()).slice(-4)}
              </div>
              <button
                className="government-close-btn"
                onClick={onClose}
                aria-label="Cerrar formulario"
                style={{
                  position: 'absolute',
                  top: 'var(--gov-spacing-sm)',
                  left: 'var(--gov-spacing-md)',
                  background: 'var(--gov-white)',
                  border: '1px solid var(--gov-medium-gray)',
                  color: 'var(--gov-medium-gray)',
                  padding: 'var(--gov-spacing-xs)',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                }}
              >
                ✕ CERRAR
              </button>
              <div className="government-logo">FC</div>
              <h1 className="government-title">Forestech de Colombia S.A.S.</h1>
              <h2 className="government-subtitle">
                Sistema Integrado de Gestión de Combustibles
                <br />
                Formulario Oficial de Registro de Movimientos
              </h2>
            </div>

            {/* Indicador de Progreso Gubernamental */}
            <div className="government-progress">
              <div className="progress-bar-government">
                <div className="progress-fill-government" style={{ width: `${progress}%` }}></div>
              </div>
              <div className="progress-info">
                <span className="progress-step">
                  Paso {currentLogicalStep} de {totalSteps}
                </span>
                <span className="progress-timestamp">
                  {new Date().toLocaleString('es-CO', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false,
                  })}
                </span>
              </div>
            </div>

            {/* Header estático del documento */}
            <div className="government-document-static-header">
              <div className="document-official-banner">
                📜 DOCUMENTO OFICIAL - DESPLÁCESE PARA VER MÁS CONTENIDO
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Botón de escape global */}
            <button
              className={getThemeClass('typeform-escape')}
              onClick={onClose}
              aria-label={UI_ACTIONS.CLOSE}
            >
              ✕
            </button>

            {/* Barra de progreso superior estilo Typeform */}
            <div className={getThemeClass('typeform-progress')}>
              <div
                className={getThemeClass('typeform-progress-fill')}
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            {/* Header con título */}
            <div className={getThemeClass('wizard-header')}>
              <div className={getThemeClass('wizard-title')}></div>
            </div>
          </>
        )}

        {/* Contenido del paso */}
        {theme === 'government' ? (
          /* Split-screen terminal layout */
          <div className="cli-split-container">
            {/* Botón ESC minimalista */}
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'transparent',
                border: '1px solid white',
                color: 'white',
                padding: '5px 10px',
                cursor: 'pointer',
                fontSize: '12px',
                fontFamily: 'Courier New, monospace',
                zIndex: 1001,
              }}
            >
              [ESC]
            </button>
            {/* Left panel: Current step content */}
            <div className="cli-left-panel">
              <div className="cli-step-header">
                <span className="cli-step-number">[{currentLogicalStep}]</span>
                <span className="cli-step-title">{getStepTitle(currentStep)}</span>
              </div>
              <div className="cli-step-content">
                {movementCreated ? (
                  <div className="cli-success">
                    <div className="cli-success-title">MOVIMIENTO CREADO EXITOSAMENTE</div>
                    <div className="cli-success-details">
                      <div>Tipo: {formData.type}</div>
                      <div>Combustible: {formData.fuelType}</div>
                      <div>Cantidad: {formData.quantity} galones</div>

                      {/* Información de ubicación/bodega */}
                      {formData.type === 'entrada' && formData.supplierName && (
                        <div>Proveedor: {formData.supplierName}</div>
                      )}
                      {formData.type === 'entrada' && formData.destinationLocation && (
                        <div>Bodega/Ubicación: {formData.destinationLocation}</div>
                      )}
                      {(formData.type === 'salida' ||
                        formData.type === 'transferencia' ||
                        formData.type === 'ajuste') &&
                        formData.location && <div>Ubicación origen: {formData.location}</div>}
                      {formData.type === 'transferencia' && formData.destinationLocation && (
                        <div>Ubicación destino: {formData.destinationLocation}</div>
                      )}

                      {formData.vehicleId && <div>Vehiculo: {formData.vehicleId}</div>}

                      {/* Stock actualizado - calculado dinámicamente */}
                      {formData.type === 'entrada' && formData.destinationLocation && (
                        <div className="cli-stock-update">
                          <div>📊 Stock actualizado en {formData.destinationLocation}:</div>
                          <div style={{ color: '#00ff41', fontWeight: 'bold' }}>
                            {(() => {
                              // Calcular stock actual dinámicamente
                              const currentLocationStock =
                                systemData.inventory
                                  ?.filter(
                                    (item) =>
                                      item.location?.toLowerCase() ===
                                        formData.destinationLocation?.toLowerCase() &&
                                      item.fuelType?.toUpperCase() ===
                                        formData.fuelType?.toUpperCase() &&
                                      item.status === 'active'
                                  )
                                  ?.reduce(
                                    (total, item) => total + (parseFloat(item.currentStock) || 0),
                                    0
                                  ) || 0;

                              // Calcular capacidad máxima total de la ubicación
                              const maxLocationCapacity =
                                systemData.inventory
                                  ?.filter(
                                    (item) =>
                                      item.location?.toLowerCase() ===
                                        formData.destinationLocation?.toLowerCase() &&
                                      item.fuelType?.toUpperCase() ===
                                        formData.fuelType?.toUpperCase() &&
                                      item.status === 'active'
                                  )
                                  ?.reduce(
                                    (total, item) => total + (parseFloat(item.maxCapacity) || 0),
                                    0
                                  ) || 0;

                              const newStock =
                                currentLocationStock + (parseFloat(formData.quantity) || 0);
                              const fillPercentage =
                                maxLocationCapacity > 0
                                  ? (newStock / maxLocationCapacity) * 100
                                  : 0;

                              return (
                                <>
                                  <div>
                                    {Math.round(newStock)} / {Math.round(maxLocationCapacity)}{' '}
                                    galones
                                  </div>
                                  <div
                                    style={{
                                      fontSize: '0.9em',
                                      color:
                                        fillPercentage > 90
                                          ? '#ff6b6b'
                                          : fillPercentage > 75
                                            ? '#ffd93d'
                                            : '#00ff41',
                                    }}
                                  >
                                    {Math.round(fillPercentage)}% de capacidad{' '}
                                    {fillPercentage > 90
                                      ? '⚠️ CASI LLENO'
                                      : fillPercentage > 75
                                        ? '⚠️ ALTO'
                                        : '✅'}
                                  </div>
                                </>
                              );
                            })()}
                          </div>
                        </div>
                      )}

                      {/* Para otros tipos de movimiento también mostrar stock */}
                      {formData.type !== 'entrada' && formData.location && (
                        <div className="cli-stock-update">
                          <div>📊 Stock actualizado en {formData.location}:</div>
                          <div style={{ color: '#00ff41', fontWeight: 'bold' }}>
                            {(() => {
                              const currentLocationStock =
                                systemData.inventory
                                  ?.filter(
                                    (item) =>
                                      item.location?.toLowerCase() ===
                                        formData.location?.toLowerCase() &&
                                      item.fuelType?.toUpperCase() ===
                                        formData.fuelType?.toUpperCase() &&
                                      item.status === 'active'
                                  )
                                  ?.reduce(
                                    (total, item) => total + (parseFloat(item.currentStock) || 0),
                                    0
                                  ) || 0;

                              // Calcular capacidad máxima total de la ubicación
                              const maxLocationCapacity =
                                systemData.inventory
                                  ?.filter(
                                    (item) =>
                                      item.location?.toLowerCase() ===
                                        formData.location?.toLowerCase() &&
                                      item.fuelType?.toUpperCase() ===
                                        formData.fuelType?.toUpperCase() &&
                                      item.status === 'active'
                                  )
                                  ?.reduce(
                                    (total, item) => total + (parseFloat(item.maxCapacity) || 0),
                                    0
                                  ) || 0;

                              let newStock = currentLocationStock;
                              if (formData.type === 'salida' || formData.type === 'transferencia') {
                                newStock =
                                  currentLocationStock - (parseFloat(formData.quantity) || 0);
                              } else if (formData.type === 'ajuste') {
                                newStock = parseFloat(formData.quantity) || 0;
                              }

                              const fillPercentage =
                                maxLocationCapacity > 0
                                  ? (newStock / maxLocationCapacity) * 100
                                  : 0;

                              return (
                                <>
                                  <div>
                                    {Math.round(newStock)} / {Math.round(maxLocationCapacity)}{' '}
                                    galones
                                  </div>
                                  <div
                                    style={{
                                      fontSize: '0.9em',
                                      color:
                                        fillPercentage < 20
                                          ? '#ff6b6b'
                                          : fillPercentage < 40
                                            ? '#ffd93d'
                                            : '#00ff41',
                                    }}
                                  >
                                    {Math.round(fillPercentage)}% de capacidad{' '}
                                    {fillPercentage < 20
                                      ? '⚠️ CRÍTICO'
                                      : fillPercentage < 40
                                        ? '⚠️ BAJO'
                                        : '✅'}
                                  </div>
                                </>
                              );
                            })()}
                          </div>
                        </div>
                      )}

                      {/* Stock en destino para transferencias */}
                      {formData.type === 'transferencia' &&
                        formData.destinationLocation &&
                        formData.destinationLocation !== formData.location && (
                          <div className="cli-stock-update">
                            <div>
                              📊 Stock actualizado en {formData.destinationLocation} (destino):
                            </div>
                            <div style={{ color: '#00ff41', fontWeight: 'bold' }}>
                              {(() => {
                                const currentDestStock =
                                  systemData.inventory
                                    ?.filter(
                                      (item) =>
                                        item.location?.toLowerCase() ===
                                          formData.destinationLocation?.toLowerCase() &&
                                        item.fuelType?.toUpperCase() ===
                                          formData.fuelType?.toUpperCase() &&
                                        item.status === 'active'
                                    )
                                    ?.reduce(
                                      (total, item) => total + (parseFloat(item.currentStock) || 0),
                                      0
                                    ) || 0;

                                const maxDestCapacity =
                                  systemData.inventory
                                    ?.filter(
                                      (item) =>
                                        item.location?.toLowerCase() ===
                                          formData.destinationLocation?.toLowerCase() &&
                                        item.fuelType?.toUpperCase() ===
                                          formData.fuelType?.toUpperCase() &&
                                        item.status === 'active'
                                    )
                                    ?.reduce(
                                      (total, item) => total + (parseFloat(item.maxCapacity) || 0),
                                      0
                                    ) || 0;

                                const newDestStock =
                                  currentDestStock + (parseFloat(formData.quantity) || 0);
                                const destFillPercentage =
                                  maxDestCapacity > 0 ? (newDestStock / maxDestCapacity) * 100 : 0;

                                return (
                                  <>
                                    <div>
                                      {Math.round(newDestStock)} / {Math.round(maxDestCapacity)}{' '}
                                      galones
                                    </div>
                                    <div
                                      style={{
                                        fontSize: '0.9em',
                                        color:
                                          destFillPercentage > 90
                                            ? '#ff6b6b'
                                            : destFillPercentage > 75
                                              ? '#ffd93d'
                                              : '#00ff41',
                                      }}
                                    >
                                      {Math.round(destFillPercentage)}% de capacidad{' '}
                                      {destFillPercentage > 90
                                        ? '⚠️ CASI LLENO'
                                        : destFillPercentage > 75
                                          ? '⚠️ ALTO'
                                          : '✅'}
                                    </div>
                                  </>
                                );
                              })()}
                            </div>
                          </div>
                        )}
                    </div>

                    {/* Botones de acción */}
                    <div className="cli-success-actions">
                      <button
                        className="cli-success-btn primary"
                        onClick={() => {
                          // Resetear el wizard para nuevo movimiento
                          setMovementCreated(false);
                          setCurrentStep(1);
                          setFormData({
                            type: '',
                            fuelType: '',
                            quantity: '',
                            unitPrice: '',
                            vehicleId: '',
                            location: '',
                            destinationLocation: '',
                            supplierName: '',
                            description: '',
                            additionalComments: '',
                            currentHours: '',
                            effectiveDate: new Date().toISOString().split('T')[0],
                          });
                          setError('');
                          setConfirmChecked(false);
                        }}
                      >
                        [NUEVO MOVIMIENTO]
                      </button>
                      <button
                        className="cli-success-btn secondary"
                        onClick={() => {
                          setMovementCreated(false);
                          onClose();
                        }}
                      >
                        [CERRAR]
                      </button>
                    </div>
                  </div>
                ) : systemData.loadingData ? (
                  <div className="cli-loading">
                    <div>Cargando datos del sistema...</div>
                  </div>
                ) : (
                  renderCurrentStep()
                )}
              </div>
            </div>

            {/* Right panel: Step navigation */}
            <div className="cli-right-panel">
              <div className="cli-nav-header">NAVEGACION</div>
              <div className="cli-nav-steps">
                {getStepsList().map((step, index) => (
                  <div
                    key={step.number}
                    className={`cli-nav-step ${
                      step.number === currentStep
                        ? 'active'
                        : step.completed
                          ? 'completed'
                          : 'pending'
                    }`}
                  >
                    <span className="cli-nav-number">[{index + 1}]</span>
                    <span className="cli-nav-label">{step.title}</span>
                    <span className="cli-nav-status">
                      {step.completed ? 'OK' : step.number === currentStep ? '>' : '-'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Navigation buttons */}
              <div className="cli-nav-controls">
                <button
                  className="cli-nav-btn"
                  onClick={prevStep}
                  disabled={currentLogicalStep === 1 || isTransitioning}
                >
                  [ANTERIOR]
                </button>
                <button
                  className="cli-nav-btn"
                  onClick={!isLastStep ? nextStep : handleSubmit}
                  disabled={
                    !isCurrentStepValid ||
                    isTransitioning ||
                    (isLastStep && (!confirmChecked || isLoading))
                  }
                >
                  {isLastStep ? (isLoading ? '[PROCESANDO]' : '[CONFIRMAR]') : '[SIGUIENTE]'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Original layout for other themes */
          <div className="apple-modal-content wizard-body">
            {movementCreated ? (
              /* Pantalla de confirmación institucional - estilo gubernamental */
              <div className="official-confirmation-container">
                {/* Header institucional */}
                <div className="official-header">
                  <div className="official-seal">
                    <div className="seal-icon">✓</div>
                  </div>
                  <div className="official-title">
                    <h1>CONFIRMACIÓN DE TRANSACCIÓN</h1>
                    <div className="document-number">
                      Doc. No. MOV-{new Date().getFullYear()}-{String(Date.now()).slice(-6)}
                    </div>
                  </div>
                </div>

                {/* Status banner */}
                <div className="status-banner success">
                  <div className="status-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  </div>
                  <span className="status-text">TRANSACCIÓN PROCESADA EXITOSAMENTE</span>
                </div>

                {/* Detalles del movimiento en formato oficial */}
                <div className="official-form-section">
                  <div className="section-header">
                    <h2>DETALLES DE LA TRANSACCIÓN</h2>
                    <div className="section-code">SECCIÓN A-001</div>
                  </div>

                  <div className="form-grid">
                    <div className="form-row">
                      <div className="field-label">TIPO DE OPERACIÓN:</div>
                      <div className="field-value">{formData.type}</div>
                      <div className="field-code">A01</div>
                    </div>

                    <div className="form-row">
                      <div className="field-label">PRODUCTO:</div>
                      <div className="field-value">{formData.fuelType}</div>
                      <div className="field-code">A02</div>
                    </div>

                    <div className="form-row">
                      <div className="field-label">CANTIDAD AUTORIZADA:</div>
                      <div className="field-value">{formData.quantity} GALONES</div>
                      <div className="field-code">A03</div>
                    </div>

                    <div className="form-row">
                      <div className="field-label">PRECIO UNITARIO:</div>
                      <div className="field-value">
                        $ {parseFloat(formData.unitPrice).toLocaleString('es-CO')} COP
                      </div>
                      <div className="field-code">A04</div>
                    </div>

                    <div className="form-row total-row">
                      <div className="field-label">VALOR TOTAL:</div>
                      <div className="field-value">
                        ${' '}
                        {(
                          parseFloat(formData.quantity) * parseFloat(formData.unitPrice)
                        ).toLocaleString('es-CO')}{' '}
                        COP
                      </div>
                      <div className="field-code">A05</div>
                    </div>

                    {formData.vehicleId && (
                      <div className="form-row">
                        <div className="field-label">VEHÍCULO ASIGNADO:</div>
                        <div className="field-value">
                          {(() => {
                            // Buscar el vehículo por ID para obtener su información completa
                            const selectedVehicle = vehicles?.find(
                              (v) => v.vehicleId === formData.vehicleId
                            );
                            if (selectedVehicle) {
                              // Construir nombre oficial del vehículo
                              let vehicleDisplay = '';

                              // Prioridad: name > brand + model > vehicleId
                              if (selectedVehicle.name) {
                                vehicleDisplay = selectedVehicle.name.toUpperCase();
                              } else if (selectedVehicle.brand && selectedVehicle.model) {
                                vehicleDisplay =
                                  `${selectedVehicle.brand} ${selectedVehicle.model}`.toUpperCase();
                              } else if (selectedVehicle.brand) {
                                vehicleDisplay = selectedVehicle.brand.toUpperCase();
                              } else {
                                vehicleDisplay = selectedVehicle.vehicleId;
                              }

                              // Agregar código entre paréntesis para referencia oficial
                              return `${vehicleDisplay} (${selectedVehicle.vehicleId})`;
                            }
                            // Fallback si no se encuentra el vehículo
                            return formData.vehicleId;
                          })()}
                        </div>
                        <div className="field-code">A06</div>
                      </div>
                    )}

                    {formData.location && (
                      <div className="form-row">
                        <div className="field-label">UBICACIÓN:</div>
                        <div className="field-value">{formData.location}</div>
                        <div className="field-code">A07</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Información de procesamiento */}
                <div className="processing-info">
                  <div className="info-grid">
                    <div className="info-item">
                      <div className="info-label">FECHA DE PROCESAMIENTO:</div>
                      <div className="info-value">
                        {new Date()
                          .toLocaleDateString('es-CO', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                          .toUpperCase()}
                      </div>
                    </div>
                    <div className="info-item">
                      <div className="info-label">HORA:</div>
                      <div className="info-value">{new Date().toLocaleTimeString('es-CO')} COT</div>
                    </div>
                    <div className="info-item">
                      <div className="info-label">ESTADO:</div>
                      <div className="info-value status-approved">APROBADO</div>
                    </div>
                  </div>
                </div>

                {/* Acciones oficiales */}
                <div className="official-actions">
                  <button className="official-btn primary" onClick={handleNewMovement}>
                    <span className="btn-icon">⊕</span>
                    NUEVA TRANSACCIÓN
                  </button>
                  <button className="official-btn secondary" onClick={handleCloseModal}>
                    <span className="btn-icon">✕</span>
                    CERRAR DOCUMENTO
                  </button>
                </div>

                {/* Footer oficial */}
                <div className="official-footer">
                  <div className="footer-text">
                    DOCUMENTO GENERADO AUTOMÁTICAMENTE - FORESTECH COLOMBIA
                  </div>
                  <div className="footer-timestamp">
                    Generado el {new Date().toISOString().split('T')[0]} a las{' '}
                    {new Date().toLocaleTimeString('es-CO')}
                  </div>
                </div>
              </div>
            ) : systemData.loadingData ? (
              <div className={getThemeClass('wizard-loading')}>
                <div className={getThemeClass('loading-spinner')}></div>
                <p>🔄 Cargando datos del sistema...</p>
              </div>
            ) : (
              <div className={getThemeClass('wizard-step-container')}>{renderCurrentStep()}</div>
            )}
          </div>
        )}

        {/* Error global */}
        {error && (
          <div className={getThemeClass('wizard-error')}>
            <span className={getThemeClass('error-icon')}>⚠️</span>
            {error}
          </div>
        )}

        {/* Navegación flotante estilo Typeform - ocultar si movimiento creado */}
        {!movementCreated && (
          <div
            className={`${getThemeClass('typeform-navigation')} ${isLastStep ? 'centered-final-step' : ''}`}
          >
            {(currentStep > 1 || currentStep === '3b') && (
              <button
                className={`${getThemeClass('typeform-nav-btn')} nav-button`}
                onClick={prevStep}
                disabled={isTransitioning}
                aria-label="Paso anterior"
                tabIndex={theme === 'government' ? 0 : -1}
              >
                ←
              </button>
            )}

            {!isLastStep ? (
              <button
                className={`${getThemeClass('typeform-nav-btn')} nav-button primary`}
                onClick={nextStep}
                disabled={!isCurrentStepValid || isTransitioning}
                aria-label="Siguiente paso"
                tabIndex={theme === 'government' ? 0 : -1}
              >
                →
              </button>
            ) : (
              <button
                className={`${getThemeClass('typeform-nav-btn')} nav-button primary confirm-button`}
                onClick={handleSubmit}
                disabled={isLoading || !confirmChecked || isTransitioning}
                aria-label="Confirmar movimiento"
                tabIndex={theme === 'government' ? 0 : -1}
              >
                <span className="confirm-icon">
                  {isLoading ? (
                    <span
                      className={`loading-spinner small ${theme === 'government' ? 'government-spinner' : 'apple-loading'}`}
                    ></span>
                  ) : (
                    '✓'
                  )}
                </span>
                <span className="confirm-text">
                  {isLoading ? 'Guardando...' : 'Confirmar movimiento'}
                </span>
              </button>
            )}
          </div>
        )}

        {/* Footer condicional según theme */}
        {theme === 'government' && !movementCreated && (
          <div className="government-actions">
            <button
              className="government-btn government-btn-secondary"
              onClick={prevStep}
              disabled={currentLogicalStep === 1 || isTransitioning}
            >
              <span className="btn-icon">◀</span>
              Anterior
            </button>

            <div
              style={{
                fontSize: '0.8rem',
                color: 'var(--gov-medium-gray)',
                fontFamily: 'var(--gov-font-family-mono)',
              }}
            >
              FORMULARIO: FORESTECH-MOV-{new Date().getFullYear()}
              {String(new Date().getMonth() + 1).padStart(2, '0')}
              {String(new Date().getDate()).padStart(2, '0')}-{String(Date.now()).slice(-4)}
            </div>

            <button
              className="government-btn government-btn-primary"
              onClick={!isLastStep ? nextStep : handleSubmit}
              disabled={
                !isCurrentStepValid ||
                isTransitioning ||
                (isLastStep && (!confirmChecked || isLoading))
              }
            >
              {isLastStep ? (isLoading ? 'Procesando...' : 'Confirmar') : 'Siguiente'}
              <span className="btn-icon">▶</span>
            </button>
          </div>
        )}

        {/* Indicador de paso actual - ocultar si movimiento creado */}
        {!movementCreated && theme !== 'government' && (
          <div className="apple-badge apple-badge-neutral typeform-step-indicator">
            <div className="apple-body-small step-number">{currentLogicalStep}</div>
            <span>de {totalSteps}</span>
          </div>
        )}

        {/* Shimmer overlay para transiciones - solo tema Government */}
        {theme === 'government' && (
          <div className={`step-shimmer-overlay ${isTransitioning ? 'active' : ''}`}>
            <div className="shimmer-container">
              <div className="shimmer-message">{getStepLoadingMessage(currentStep)}</div>
              <div className="shimmer-progress"></div>
              <div className="shimmer-text">
                Cargando<span className="shimmer-dots"></span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovementWizard;
