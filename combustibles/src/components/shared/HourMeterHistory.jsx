/**
 * HourMeterHistory - Componente para mostrar el historial de lecturas del horómetro
 * Incluye tabla paginada, filtros y exportación de datos
 * 
 * REFACTORED: Usa custom hook useHourMeter en lugar de servicio legacy
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useHourMeter } from '../../hooks/useHourMeter';

const HourMeterHistory = ({
  vehicleId,
  vehicle,
  maxEntries = 50,
  showExport = true,
  showFilters = true,
  className = '',
}) => {
  // Hook personalizado que encapsula toda la lógica del horómetro
  const {
    history,
    loadingHistory: loading,
    errorHistory: error,
    fetchHistory,
  } = useHourMeter(vehicleId);

  // Estados para filtros y paginación
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' o 'desc'

  // Cargar historial cuando el componente monta o cambia maxEntries
  useEffect(() => {
    if (vehicleId) {
      fetchHistory(maxEntries);
    }
  }, [vehicleId, maxEntries, fetchHistory]);

  // Filtrar y ordenar datos
  const filteredHistory = useMemo(() => {
    let filtered = [...history];

    // Aplicar filtro de fechas
    if (dateFilter.startDate) {
      const startDate = new Date(dateFilter.startDate);
      filtered = filtered.filter((entry) => new Date(entry.date) >= startDate);
    }

    if (dateFilter.endDate) {
      const endDate = new Date(dateFilter.endDate);
      endDate.setHours(23, 59, 59); // Incluir todo el día
      filtered = filtered.filter((entry) => new Date(entry.date) <= endDate);
    }

    // Ordenar por fecha
    filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [history, dateFilter, sortOrder]);

  // Paginación
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedHistory = filteredHistory.slice(startIndex, startIndex + itemsPerPage);

  // Reset página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [dateFilter]);

  // Función para exportar datos
  const handleExport = () => {
    const csvContent = [
      ['Fecha', 'Lectura Anterior', 'Nueva Lectura', 'Horas Trabajadas', 'Registrado Por', 'Notas'],
      ...filteredHistory.map((entry) => [
        entry.formattedDate || new Date(entry.date).toLocaleDateString('es-CO'),
        entry.previousReading?.toFixed(1) || '0.0',
        entry.reading?.toFixed(1) || '0.0',
        entry.hoursWorked?.toFixed(1) || '0.0',
        entry.recordedBy || 'Sistema',
        entry.note || '',
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `horometro_${vehicle?.vehicleId || vehicleId}_${new Date().toISOString().split('T')[0]}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Si el vehículo no tiene horómetro
  if (!vehicle?.hasHourMeter) {
    return (
      <div className={`rounded-lg bg-gray-50 p-4 text-center ${className}`}>
        <div className="text-gray-500">⏰ Este vehículo no tiene horómetro configurado</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white ${className}`}>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 w-1/4 rounded bg-gray-200"></div>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 rounded bg-gray-200"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`rounded-lg border border-red-200 bg-red-50 p-4 ${className}`}>
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white p-6 text-center ${className}`}>
        <div className="text-gray-500">📋 No hay registros de horómetro para este vehículo</div>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden rounded-lg border border-gray-200 bg-white ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">📈 Historial del Horómetro</h3>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">{filteredHistory.length} registros</span>
            {showExport && filteredHistory.length > 0 && (
              <button
                onClick={handleExport}
                className="rounded-lg bg-green-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-green-700"
              >
                📊 Exportar CSV
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filtros */}
      {showFilters && (
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Desde:</label>
              <input
                type="date"
                value={dateFilter.startDate}
                onChange={(e) => setDateFilter((prev) => ({ ...prev, startDate: e.target.value }))}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Hasta:</label>
              <input
                type="date"
                value={dateFilter.endDate}
                onChange={(e) => setDateFilter((prev) => ({ ...prev, endDate: e.target.value }))}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Orden:</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="desc">Más recientes primero</option>
                <option value="asc">Más antiguos primero</option>
              </select>
            </div>

            {(dateFilter.startDate || dateFilter.endDate) && (
              <button
                onClick={() => setDateFilter({ startDate: '', endDate: '' })}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-800"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Lectura Anterior
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Nueva Lectura
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Horas Trabajadas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Registrado Por
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Notas
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {paginatedHistory.map((entry, index) => (
              <tr key={entry.id || index} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                  {entry.formattedDate || new Date(entry.date).toLocaleDateString('es-CO')}
                  <div className="text-xs text-gray-500">
                    {new Date(entry.date).toLocaleTimeString('es-CO', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                  {entry.previousReading?.toFixed(1) || '0.0'} h
                </td>
                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                  {entry.reading?.toFixed(1) || '0.0'} h
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      (entry.hoursWorked || 0) > 12
                        ? 'bg-red-100 text-red-800'
                        : (entry.hoursWorked || 0) > 8
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {entry.hoursWorked?.toFixed(1) || '0.0'} h
                  </span>
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                  {entry.recordedBy || 'Sistema'}
                </td>
                <td className="max-w-xs truncate px-6 py-4 text-sm text-gray-500">
                  {entry.note ||
                    (entry.movementId ? 'Registrado con movimiento' : 'Lectura manual')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Mostrando {startIndex + 1} a{' '}
              {Math.min(startIndex + itemsPerPage, filteredHistory.length)} de{' '}
              {filteredHistory.length} registros
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                ← Anterior
              </button>

              <span className="text-sm text-gray-700">
                Página {currentPage} de {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Siguiente →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HourMeterHistory;
