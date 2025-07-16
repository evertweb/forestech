/**
 * VehicleWizard - Nuevo formulario wizard para crear vehículos
 * Basado en ForestechFormWizard con pasos específicos para vehículos
 */

import React, { useState, useEffect, useCallback } from 'react';
import { createVehicle, updateVehicle, VEHICLE_STATUS } from '../../services/vehiclesService';
import { getAllVehicleCategories } from '../../services/vehicleCategoriesService';
import { FUEL_TYPES } from '../../data/vehicleCategories';
import ForestechFormWizard from '../Shared/ForestechFormWizard';

// Importar pasos del wizard
import Step1_BasicInfo from './WizardSteps/Step1_BasicInfo';
import Step2_Category from './WizardSteps/Step2_Category';
import Step3_Technical from './WizardSteps/Step3_Technical';
import Step4_Operational from './WizardSteps/Step4_Operational';
import Step5_Summary from './WizardSteps/Step5_Summary';

const VehicleWizard = ({ 
  isOpen, 
  onClose, 
  vehicle = null, 
  onSuccess 
}) => {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Datos iniciales del formulario
  const getInitialData = useCallback(() => ({
    // Información básica (Step 1)
    vehicleId: vehicle?.vehicleId || '',
    name: vehicle?.name || '',
    brand: vehicle?.brand || '',
    model: vehicle?.model || '',
    year: vehicle?.year || new Date().getFullYear(),
    
    // Categoría (Step 2) 
    category: vehicle?.category || '',
    
    // Información técnica (Step 3)
    fuelType: vehicle?.fuelType || FUEL_TYPES.DIESEL,
    plateNumber: vehicle?.plateNumber || '',
    enginePower: vehicle?.enginePower || '',
    fuelCapacity: vehicle?.fuelCapacity || '',
    
    // Información operacional (Step 4)
    status: vehicle?.status || VEHICLE_STATUS.ACTIVO,
    currentLocation: vehicle?.currentLocation || '',
    hasHourMeter: vehicle?.hasHourMeter || false,
    currentHours: vehicle?.currentHours || '',
    description: vehicle?.description || '',
    lastMaintenanceDate: vehicle?.lastMaintenanceDate ? 
      new Date(vehicle.lastMaintenanceDate).toISOString().split('T')[0] : '',
    purchaseDate: vehicle?.purchaseDate ? 
      new Date(vehicle.purchaseDate).toISOString().split('T')[0] : ''
  }), [vehicle]);

  // Cargar categorías al abrir el wizard
  const loadCategories = useCallback(async () => {
    try {
      setLoadingCategories(true);
      const categoriesData = await getAllVehicleCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error cargando categorías:', error);
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadCategories();
    }
  }, [isOpen, loadCategories]);

  // Función para recargar categorías cuando se actualicen
  const handleCategoriesUpdate = useCallback(() => {
    loadCategories();
  }, [loadCategories]);

  // Definir pasos del wizard
  const wizardSteps = [
    {
      component: Step1_BasicInfo,
      title: 'Información Básica',
      description: 'Datos generales del vehículo'
    },
    {
      component: Step2_Category,
      title: 'Categoría',
      description: 'Tipo y clasificación del vehículo'
    },
    {
      component: Step3_Technical,
      title: 'Especificaciones Técnicas',
      description: 'Características técnicas y capacidades'
    },
    {
      component: Step4_Operational,
      title: 'Información Operacional',
      description: 'Estado, ubicación y mantenimiento'
    },
    {
      component: Step5_Summary,
      title: 'Resumen',
      description: 'Verificar información antes de guardar'
    }
  ];

  // Validaciones por paso
  const validateStep = useCallback((stepNumber, formData) => {
    const errors = {};

    switch (stepNumber) {
      case 1: // Información básica
        if (!formData.vehicleId?.trim()) {
          errors.vehicleId = 'El ID del vehículo es obligatorio';
        }
        if (!formData.name?.trim()) {
          errors.name = 'El nombre del vehículo es obligatorio';
        }
        if (!formData.brand?.trim()) {
          errors.brand = 'La marca es obligatoria';
        }
        if (!formData.model?.trim()) {
          errors.model = 'El modelo es obligatorio';
        }
        if (!formData.year || formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
          errors.year = 'El año debe ser válido';
        }
        break;

      case 2: // Categoría
        if (!formData.category?.trim()) {
          errors.category = 'Debe seleccionar una categoría';
        }
        break;

      case 3: // Información técnica
        if (!formData.fuelType) {
          errors.fuelType = 'Debe seleccionar el tipo de combustible';
        }
        if (formData.enginePower && (isNaN(formData.enginePower) || formData.enginePower <= 0)) {
          errors.enginePower = 'La potencia debe ser un número positivo';
        }
        if (formData.fuelCapacity && (isNaN(formData.fuelCapacity) || formData.fuelCapacity <= 0)) {
          errors.fuelCapacity = 'La capacidad debe ser un número positivo';
        }
        break;

      case 4: // Información operacional
        if (!formData.status) {
          errors.status = 'Debe seleccionar el estado del vehículo';
        }
        if (formData.hasHourMeter && !formData.currentHours) {
          errors.currentHours = 'Debe ingresar las horas actuales del horómetro';
        }
        if (formData.currentHours && (isNaN(formData.currentHours) || formData.currentHours < 0)) {
          errors.currentHours = 'Las horas deben ser un número válido';
        }
        break;

      case 5: { // Resumen - validar todo
        // Ejecutar todas las validaciones anteriores
        const allErrors = {};
        for (let i = 1; i < 5; i++) {
          const stepErrors = validateStep(i, formData);
          Object.assign(allErrors, stepErrors);
        }
        return allErrors;
      }

      default:
        break;
    }

    return errors;
  }, []);

  // Manejar cambio de paso
  const handleStepChange = useCallback((newStep, formData) => {
    console.log(`🔄 Paso ${newStep}:`, formData);
  }, []);

  // Completar el wizard
  const handleComplete = useCallback(async (formData) => {
    try {
      console.log('💾 Guardando vehículo:', formData);
      
      // Preparar datos para guardar
      const vehicleData = {
        vehicleId: formData.vehicleId.trim(),
        name: formData.name.trim(),
        brand: formData.brand.trim(),
        model: formData.model.trim(),
        year: parseInt(formData.year),
        category: formData.category,
        fuelType: formData.fuelType,
        plateNumber: formData.plateNumber?.trim() || '',
        enginePower: formData.enginePower ? parseFloat(formData.enginePower) : null,
        fuelCapacity: formData.fuelCapacity ? parseFloat(formData.fuelCapacity) : null,
        status: formData.status,
        currentLocation: formData.currentLocation?.trim() || '',
        hasHourMeter: formData.hasHourMeter,
        currentHours: formData.currentHours ? parseFloat(formData.currentHours) : null,
        description: formData.description?.trim() || '',
        lastMaintenanceDate: formData.lastMaintenanceDate || null,
        purchaseDate: formData.purchaseDate || null
      };

      let result;
      if (vehicle) {
        // Actualizar vehículo existente
        result = await updateVehicle(vehicle.id, vehicleData);
      } else {
        // Crear nuevo vehículo
        result = await createVehicle(vehicleData);
      }

      if (result.success) {
        console.log('✅ Vehículo guardado exitosamente');
        if (onSuccess) {
          onSuccess(result.data);
        }
      } else {
        throw new Error(result.error || 'Error al guardar el vehículo');
      }
    } catch (error) {
      console.error('❌ Error al guardar vehículo:', error);
      throw error;
    }
  }, [vehicle, onSuccess]);

  if (loadingCategories) {
    return null; // O un loading spinner
  }

  return (
    <ForestechFormWizard
      isOpen={isOpen}
      onClose={onClose}
      onComplete={handleComplete}
      steps={wizardSteps}
      initialData={getInitialData()}
      title={vehicle ? `Editar ${vehicle.name}` : "Nuevo Vehículo"}
      subtitle="Completa la información paso a paso para registrar el vehículo"
      theme="vehicles"
      validateStep={validateStep}
      onStepChange={handleStepChange}
      extraData={{ 
        categories, 
        loadingCategories,
        onCategoriesUpdate: handleCategoriesUpdate 
      }}
    />
  );
};

export default VehicleWizard;
