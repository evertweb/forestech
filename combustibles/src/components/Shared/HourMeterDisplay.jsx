/**
 * HourMeterDisplay - Componente para mostrar información del horómetro de un vehículo
 * Muestra lecturas actuales, métricas y estado del horómetro
 */

import React, { useState, useEffect } from 'react';
import { getHourMeterSummary } from '../../services/hourMeterService';

const HourMeterDisplay = ({
  vehicleId,
  vehicle,
  showMetrics = true,
  showHistory = false,
  compact = false,
  className = '',
}) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar resumen del horómetro
  useEffect(() => {
    if (vehicleId) {
      setLoading(true);
      setError(null);

      getHourMeterSummary(vehicleId)
        .then((result) => {
          setSummary(result);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error loading hour meter summary:', err);
          setError('Error al cargar datos del horómetro');
          setLoading(false);
        });
    }
  }, [vehicleId]);

  // Si el vehículo no tiene horómetro, no mostrar nada
  if (!vehicle?.hasHourMeter && !summary?.hasHourMeter) {
    return null;
  }

  if (loading) {
    return (
      <div className={`rounded-lg bg-gray-50 p-4 ${className}`}>
        <div className="animate-pulse">
          <div className="mb-2 h-4 w-3/4 rounded bg-gray-200"></div>
          <div className="h-4 w-1/2 rounded bg-gray-200"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`rounded-lg border border-red-200 bg-red-50 p-4 ${className}`}>
        <div className="text-sm text-red-600">{error}</div>
      </div>
    );
  }

  if (!summary?.hasHourMeter) {
    return (
      <div className={`rounded-lg bg-gray-50 p-4 ${className}`}>
        <div className="text-center text-sm text-gray-500">
          ⏰ Este vehículo no tiene horómetro configurado
        </div>
      </div>
    );
  }

  // Determinar color de eficiencia
  const getEfficiencyColor = (rating) => {
    switch (rating) {
      case 'A':
        return 'text-green-600 bg-green-100';
      case 'B':
        return 'text-blue-600 bg-blue-100';
      case 'C':
        return 'text-yellow-600 bg-yellow-100';
      case 'D':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Función para formatear tiempo relativo
  const formatTimeAgo = (date) => {
    if (!date) return 'Nunca';
    const now = new Date();
    const diff = now - new Date(date);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `hace ${days} día${days > 1 ? 's' : ''}`;
    if (hours > 0) return `hace ${hours} hora${hours > 1 ? 's' : ''}`;
    return 'hace poco';
  };

  if (compact) {
    return (
      <div className={`rounded-lg border border-blue-200 bg-blue-50 p-3 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-blue-600">⏰</span>
            <span className="text-sm font-medium text-gray-700">
              {summary.currentReading?.toFixed(1)} h
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">
              {summary.totalHoursWorked?.toFixed(1)} h trabajadas
            </span>
            {summary.efficiencyRating && (
              <span
                className={`rounded px-2 py-1 text-xs font-medium ${getEfficiencyColor(summary.efficiencyRating)}`}
              >
                {summary.efficiencyRating}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden rounded-lg border border-gray-200 bg-white ${className}`}>
      {/* Header */}
      <div className="border-b border-blue-200 bg-blue-50 px-4 py-3">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center text-lg font-semibold text-gray-800">⏰ Horómetro</h3>
          {summary.efficiencyRating && (
            <span
              className={`rounded-full px-3 py-1 text-sm font-bold ${getEfficiencyColor(summary.efficiencyRating)}`}
            >
              Eficiencia {summary.efficiencyRating}
            </span>
          )}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="space-y-4 p-4">
        {/* Lecturas principales */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-gray-50 p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {summary.currentReading?.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Lectura Actual (h)</div>
          </div>
          <div className="rounded-lg bg-gray-50 p-3 text-center">
            <div className="text-2xl font-bold text-green-600">
              {summary.totalHoursWorked?.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Horas Trabajadas</div>
          </div>
        </div>

        {/* Métricas adicionales */}
        {showMetrics && (
          <div className="space-y-3">
            <h4 className="border-b pb-1 text-sm font-semibold text-gray-700">
              📊 Métricas de Rendimiento
            </h4>

            <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Lectura inicial:</span>
                <span className="font-medium">{summary.initialReading?.toFixed(1)} h</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Promedio diario:</span>
                <span className="font-medium">{summary.averageHoursPerDay?.toFixed(1)} h/día</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Consumo estimado:</span>
                <span className="font-medium">
                  {summary.estimatedConsumption?.toFixed(2)} gal/h
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Consumo real:</span>
                <span className="font-medium">{summary.actualConsumption?.toFixed(2)} gal/h</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Eficiencia:</span>
                <span
                  className={`font-medium ${
                    summary.efficiency > 100
                      ? 'text-red-600'
                      : summary.efficiency > 90
                        ? 'text-yellow-600'
                        : 'text-green-600'
                  }`}
                >
                  {summary.efficiency?.toFixed(1)}%
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Registros:</span>
                <span className="font-medium">{summary.historyCount} lecturas</span>
              </div>
            </div>
          </div>
        )}

        {/* Información de última actualización */}
        <div className="border-t border-gray-200 pt-3">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Última actualización:</span>
            <span>{formatTimeAgo(summary.lastUpdate)}</span>
          </div>
        </div>

        {/* Alertas y recomendaciones */}
        {summary.efficiency > 120 && (
          <div className="rounded-lg border border-orange-200 bg-orange-50 p-3">
            <div className="flex items-start space-x-2">
              <span className="text-orange-500">⚠️</span>
              <div className="text-sm text-orange-700">
                <strong>Eficiencia baja:</strong> El vehículo está consumiendo más combustible de lo
                esperado. Considera revisar el mantenimiento.
              </div>
            </div>
          </div>
        )}

        {summary.averageHoursPerDay > 10 && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
            <div className="flex items-start space-x-2">
              <span className="text-blue-500">💡</span>
              <div className="text-sm text-blue-700">
                <strong>Alto uso:</strong> Este vehículo trabaja más de 10 horas diarias en
                promedio. Programa mantenimientos preventivos frecuentes.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer con acciones */}
      {showHistory && (
        <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
          <button
            onClick={() => {
              /* TODO: Implementar modal de historial */
            }}
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            📈 Ver historial completo
          </button>
        </div>
      )}
    </div>
  );
};

export default HourMeterDisplay;
