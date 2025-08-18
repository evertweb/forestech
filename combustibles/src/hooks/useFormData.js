import { useState, useCallback, useMemo } from 'react';
import { validateForm as runValidation } from '../utils/validators';

/**
 * Hook reutilizable para manejo de formularios en modales.
 * Incluye manejo de estado, validación y cambios de input.
 *
 * @param {object} initialValues - Valores iniciales del formulario
 * @param {function} validate - Función de validación (opcional)
 * @returns {object} { values, errors, handleInputChange, setValues, resetForm, validateForm }
 */
// Soporta validación por función (validate) o por schema centralizado (options.validationSchema)
// y validadores cruzados (options.crossValidators)
export const useFormData = (initialValues = {}, validate, options = {}) => {
  // Usar useMemo para estabilizar initialValues y evitar bucles infinitos
  const stableInitialValues = useMemo(() => {
    // Si initialValues es una constante (referencia estable), usar directamente
    if (typeof initialValues === 'object' && initialValues !== null) {
      return initialValues;
    }
    return {};
  }, [initialValues]);

  const [values, setValues] = useState(stableInitialValues);
  const [errors, setErrors] = useState({});

  // Maneja cambios de input para cualquier campo
  const handleInputChange = useCallback((arg1, arg2) => {
    // Soporta: handleInputChange(event) o handleInputChange(name, value)
    if (typeof arg1 === 'string') {
      const name = arg1;
      const value = arg2;
      setValues((prev) => ({ ...prev, [name]: value }));
      return;
    }

    const e = arg1;
    const { name, value, type, checked } = e?.target || {};
    if (!name) return;
    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? !!checked : value,
    }));
  }, []);

  // Validación individual o global
  const validateForm = useCallback(
    (fieldValues) => {
      // Usar los valores actuales si no se proporcionan valores específicos
      const valuesToValidate = fieldValues || values;

      // 1) Prioridad: función validate personalizada si se provee
      if (typeof validate === 'function') {
        const validation = validate(valuesToValidate);
        setErrors(validation.errors || {});
        return validation.isValid;
      }

      // 2) Alternativa: schema centralizado + validadores cruzados
      const { validationSchema, crossValidators } = options || {};
      if (validationSchema) {
        // Validación por schema
        const schemaResult = runValidation(valuesToValidate, validationSchema);
        let combinedErrors = { ...schemaResult.errors };

        // Validaciones cross-field (acumular errores)
        if (Array.isArray(crossValidators) && crossValidators.length > 0) {
          for (const cross of crossValidators) {
            try {
              const crossErrors = cross(valuesToValidate) || {};
              combinedErrors = { ...combinedErrors, ...crossErrors };
            } catch {
              // Ignorar errores de validadores cruzados para no romper flujo
            }
          }
        }

        const isValid = Object.keys(combinedErrors).length === 0;
        setErrors(combinedErrors);
        return isValid;
      }

      // 3) Sin validación configurada
      return true;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [validate, options] // Removemos 'values' para evitar bucles infinitos
  );

  // Resetear formulario
  const resetForm = useCallback(() => {
    setValues(stableInitialValues);
    setErrors({});
  }, [stableInitialValues]);

  return {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm,
    validateForm,
  };
};

export default useFormData;
