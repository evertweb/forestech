import { useState, useCallback } from 'react';

/**
 * Hook reutilizable para manejo de formularios en modales.
 * Incluye manejo de estado, validación y cambios de input.
 *
 * @param {object} initialValues - Valores iniciales del formulario
 * @param {function} validate - Función de validación (opcional)
 * @returns {object} { values, errors, handleInputChange, setValues, resetForm, validateForm }
 */
export const useFormData = (initialValues = {}, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  // Maneja cambios de input para cualquier campo
  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

  // Validación individual o global
  const validateForm = useCallback((fieldValues = values) => {
    if (!validate) return true;
    const validation = validate(fieldValues);
    setErrors(validation.errors || {});
    return validation.isValid;
  }, [validate, values]);

  // Resetear formulario
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  return {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm,
    validateForm
  };
};

export default useFormData;
