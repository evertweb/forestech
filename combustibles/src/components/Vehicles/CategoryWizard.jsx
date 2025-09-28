/**
 * CategoryWizard - Wizard para crear y editar categorías de vehículos
 * Basado en ForestechFormWizard con estilo Typeform
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  createCategory, 
  updateCategory, 
  getCustomCategories 
} from '../../services/FirebaseVehicleCategoriesService';
import { AVAILABLE_FIELDS, FUEL_TYPES } from '../../data/vehicleCategories';
import ForestechFormWizard from '../shared/ForestechFormWizard';

// Importar pasos del wizard
import Step1_BasicInfo from './CategoryWizardSteps/Step1_BasicInfo';
import Step2_Visual from './CategoryWizardSteps/Step2_Visual';
import Step3_Fields from './CategoryWizardSteps/Step3_Fields';
import Step4_Summary from './CategoryWizardSteps/Step4_Summary';

const CategoryWizard = ({ 
  isOpen, 
  onClose, 
  category = null, 
  onSuccess 
}) => {
  const [existingCategories, setExistingCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Datos iniciales del formulario
  const getInitialData = useCallback(() => ({
    // Información básica (Step 1)
    name: category?.name || '',
    description: category?.description || '',
    fuelTypes: category?.fuelTypes || [FUEL_TYPES.DIESEL],
    
    // Visual (Step 2) 
    icon: category?.icon || '🚗',
    color: category?.color || '#3b82f6',
    
    // Campos personalizados (Step 3)
    fields: category?.fields || []
  }), [category]);

  // Cargar categorías existentes al abrir el wizard
  useEffect(() => {
    const loadCategories = async () => {
      if (isOpen) {
        try {
          setLoadingCategories(true);
          const result = await getCustomCategories();
          if (result.success) {
            setExistingCategories(result.data || []);
          } else {
            console.error('Error cargando categorías:', result.error);
            setExistingCategories([]);
          }
        } catch (error) {
          console.error('Error cargando categorías:', error);
          setExistingCategories([]);
        } finally {
          setLoadingCategories(false);
        }
      }
    };

    loadCategories();
  }, [isOpen]);

  // Definir pasos del wizard
  const wizardSteps = [
    {
      component: Step1_BasicInfo,
      title: 'Información Básica',
      description: 'Nombre, descripción y tipos de combustible'
    },
    {
      component: Step2_Visual,
      title: 'Apariencia',
      description: 'Icono y color para identificar la categoría'
    },
    {
      component: Step3_Fields,
      title: 'Campos Personalizados',
      description: 'Campos específicos para esta categoría'
    },
    {
      component: Step4_Summary,
      title: 'Resumen',
      description: 'Verificar información antes de guardar'
    }
  ];

  // Validaciones por paso
  const validateStep = useCallback((stepNumber, formData) => {
    const errors = {};

    switch (stepNumber) {
      case 1: // Información básica
        if (!formData.name?.trim()) {
          errors.name = 'El nombre de la categoría es obligatorio';
        } else {
          // Verificar que no exista una categoría con el mismo nombre (excepto al editar)
          const existingCategory = existingCategories.find(
            cat => cat.name.toLowerCase() === formData.name.toLowerCase() && 
                   (!category || cat.id !== category.id)
          );
          if (existingCategory) {
            errors.name = 'Ya existe una categoría con este nombre';
          }
        }

        if (!formData.description?.trim()) {
          errors.description = 'La descripción es obligatoria';
        }

        if (!formData.fuelTypes || formData.fuelTypes.length === 0) {
          errors.fuelTypes = 'Debe seleccionar al menos un tipo de combustible';
        }
        break;

      case 2: // Visual
        if (!formData.icon?.trim()) {
          errors.icon = 'Debe seleccionar un icono';
        }
        if (!formData.color?.trim()) {
          errors.color = 'Debe seleccionar un color';
        }
        break;

      case 3: // Campos personalizados
        // Los campos son opcionales, pero si se agregan deben ser válidos
        if (formData.fields && formData.fields.length > 0) {
          formData.fields.forEach((field, index) => {
            if (!field.key || !field.label) {
              errors[`field_${index}`] = 'Todos los campos deben tener clave y etiqueta';
            }
          });
        }
        break;

      case 4: { // Resumen - validar todo
        // Ejecutar todas las validaciones anteriores
        const allErrors = {};
        for (let i = 1; i < 4; i++) {
          const stepErrors = validateStep(i, formData);
          Object.assign(allErrors, stepErrors);
        }
        return allErrors;
      }

      default:
        break;
    }

    return errors;
  }, [existingCategories, category]);

  // Manejar cambio de paso
  const handleStepChange = useCallback((newStep, formData) => {
    console.log(`🔄 Paso ${newStep}:`, formData);
  }, []);

  // Completar el wizard
  const handleComplete = useCallback(async (formData) => {
    try {
      console.log('💾 Guardando categoría:', formData);
      
      // Preparar datos para guardar
      const categoryData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        icon: formData.icon,
        color: formData.color,
        fuelTypes: formData.fuelTypes,
        fields: formData.fields || []
      };

      let result;
      if (category) {
        // Actualizar categoría existente
        result = await updateCategory(category.id, categoryData);
      } else {
        // Crear nueva categoría
        result = await createCategory(categoryData);
      }

      if (result.success) {
        console.log('✅ Categoría guardada exitosamente');
        if (onSuccess) {
          onSuccess(result.data);
        }
      } else {
        throw new Error(result.error || 'Error al guardar la categoría');
      }
    } catch (error) {
      console.error('❌ Error al guardar categoría:', error);
      throw error;
    }
  }, [category, onSuccess]);

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
      title={category ? `Editar ${category.name}` : "Nueva Categoría"}
      subtitle="Define las características de la categoría de vehículo"
      theme="vehicles"
      validateStep={validateStep}
      onStepChange={handleStepChange}
      extraData={{ 
        existingCategories, 
        availableFields: AVAILABLE_FIELDS, 
        fuelTypes: Object.values(FUEL_TYPES),
        loadingCategories 
      }}
    />
  );
};

export default CategoryWizard;
