/**
 * HourMeterInput - Componente para capturar lecturas del horómetro
 * Permite ingresar valores de horómetro con validación y formateo
 */

import React, { useState, useEffect } from 'react';

const HourMeterInput = ({
  value = '',
  onChange,
  placeholder = 'Ingrese lectura del horómetro',
  label = 'Lectura Horómetro',
  required = false,
  disabled = false,
  error = null,
  className = '',
  vehicleData = null,
  showLastReading = true,
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [validationError, setValidationError] = useState(null);

  // Sincronizar valor externo
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Validar entrada de horómetro
  const validateHourMeter = (inputValue) => {
    const numValue = parseFloat(inputValue);

    if (isNaN(numValue) || numValue < 0) {
      return 'La lectura debe ser un número válido mayor a 0';
    }

    // Validar que no sea menor a la última lectura
    if (vehicleData?.lastHourMeterReading && numValue < vehicleData.lastHourMeterReading) {
      return `La lectura no puede ser menor a la última registrada (${vehicleData.lastHourMeterReading} hrs)`;
    }

    // Validar incremento razonable (máximo 1000 horas desde la última lectura)
    if (vehicleData?.lastHourMeterReading && numValue > vehicleData.lastHourMeterReading + 1000) {
      return 'El incremento parece muy alto. Verifique la lectura.';
    }

    return null;
  };

  // Manejar cambios en el input
  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    // Validar si hay valor
    if (newValue.trim()) {
      const validationResult = validateHourMeter(newValue);
      setValidationError(validationResult);

      // Solo llamar onChange si no hay errores de validación
      if (!validationResult && onChange) {
        onChange(parseFloat(newValue));
      }
    } else {
      setValidationError(null);
      if (onChange) {
        onChange('');
      }
    }
  };

  // Formatear número con decimales
  const handleBlur = () => {
    if (localValue && !isNaN(parseFloat(localValue))) {
      const formatted = parseFloat(localValue).toFixed(1);
      setLocalValue(formatted);
      if (onChange && !validationError) {
        onChange(parseFloat(formatted));
      }
    }
  };

  const displayError = error || validationError;

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label */}
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      {/* Última lectura */}
      {showLastReading && vehicleData?.lastHourMeterReading && (
        <div className="rounded bg-gray-50 p-2 text-xs text-gray-500">
          📊 Última lectura: {vehicleData.lastHourMeterReading} hrs
          {vehicleData.lastReadingDate && (
            <span className="ml-2">
              ({new Date(vehicleData.lastReadingDate).toLocaleDateString()})
            </span>
          )}
        </div>
      )}

      {/* Input */}
      <div className="relative">
        <input
          type="number"
          step="0.1"
          min="0"
          value={localValue}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full rounded-md border px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
            displayError ? 'border-red-300 text-red-900 placeholder-red-300' : 'border-gray-300'
          } ${disabled ? 'cursor-not-allowed bg-gray-100' : 'bg-white'} `}
        />

        {/* Unidad */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <span className="text-sm text-gray-500">hrs</span>
        </div>
      </div>

      {/* Error message */}
      {displayError && (
        <div className="mt-1 flex items-center text-xs text-red-600">
          <span className="mr-1">⚠️</span>
          {displayError}
        </div>
      )}

      {/* Ayuda */}
      {!displayError && vehicleData?.hasHourMeter && (
        <div className="text-xs text-gray-500">
          💡 Ingrese la lectura actual del horómetro en horas
        </div>
      )}
    </div>
  );
};

export default HourMeterInput;
