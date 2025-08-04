/**
 * useFormData - Hook reutilizable para manejo de formularios
 * Extrae patrones comunes de ProductModal e InventoryModal
 */
import { useState, useEffect, useCallback } from 'react';

export const useFormData = (initialData = {}, validationRules = {}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Resetear formulario cuando cambia initialData
  useEffect(() => {
    setFormData(initialData);
    setErrors({});
    setTouched({});
  }, [initialData]);

  // Manejar cambios en inputs
  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Marcar campo como tocado
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  // Actualizar valor específico programáticamente
  const updateValue = useCallback((name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  }, []);

  // Validar formulario completo
  const validateForm = useCallback(() => {
    const newErrors = {};

    Object.keys(validationRules).forEach(field => {
      const rules = validationRules[field];
      const value = formData[field];

      // Validación required
      if (rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
        newErrors[field] = rules.required;
        return;
      }

      // Validación min para números
      if (rules.min !== undefined && value !== '' && Number(value) < rules.min) {
        newErrors[field] = rules.minMessage || `Debe ser mayor o igual a ${rules.min}`;
        return;
      }

      // Validación max para números
      if (rules.max !== undefined && value !== '' && Number(value) > rules.max) {
        newErrors[field] = rules.maxMessage || `Debe ser menor o igual a ${rules.max}`;
        return;
      }

      // Validación custom
      if (rules.validate && typeof rules.validate === 'function') {
        const customError = rules.validate(value, formData);
        if (customError) {
          newErrors[field] = customError;
          return;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validationRules]);

  // Validar campo específico
  const validateField = useCallback((fieldName) => {
    const rules = validationRules[fieldName];
    if (!rules) return true;

    const value = formData[fieldName];
    let error = '';

    if (rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
      error = rules.required;
    } else if (rules.min !== undefined && value !== '' && Number(value) < rules.min) {
      error = rules.minMessage || `Debe ser mayor o igual a ${rules.min}`;
    } else if (rules.max !== undefined && value !== '' && Number(value) > rules.max) {
      error = rules.maxMessage || `Debe ser menor o igual a ${rules.max}`;
    } else if (rules.validate && typeof rules.validate === 'function') {
      error = rules.validate(value, formData) || '';
    }

    setErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));

    return !error;
  }, [formData, validationRules]);

  // Resetear formulario
  const resetForm = useCallback((newData = {}) => {
    setFormData(newData);
    setErrors({});
    setTouched({});
  }, []);

  // Limpiar errores
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  // Verificar si el formulario tiene errores
  const hasErrors = Object.values(errors).some(error => error !== '');

  // Verificar si el formulario está sucio (modificado)
  const isDirty = Object.keys(touched).length > 0;

  // Verificar si el formulario es válido
  const isValid = !hasErrors && isDirty;

  return {
    formData,
    errors,
    touched,
    hasErrors,
    isDirty,
    isValid,
    handleInputChange,
    updateValue,
    validateForm,
    validateField,
    resetForm,
    clearErrors,
    setFormData
  };
};

export default useFormData;