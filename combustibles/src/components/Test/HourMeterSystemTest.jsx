/**
 * Test completo del sistema de horómetros integrado
 * Verifica que todos los componentes funcionen correctamente con datos reales
 */

import React, { useState } from 'react';
import { HourMeterInput, HourMeterDisplay, HourMeterHistory } from '../shared';
import { createVehicle } from '../../services/FirebaseVehiclesService';
import { createMovement } from '../../services/FirebaseMovementsService';
// ✅ SIMPLIFIED: Solo ENTRADA y SALIDA según decisiones CORE
const MOVEMENT_TYPES = {
  ENTRADA: 'entrada',
  SALIDA: 'salida',
};
import FirebaseHourMeterService from '../../services/FirebaseHourMeterService';

const HourMeterSystemTest = () => {
  const [testVehicle, setTestVehicle] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentTest, setCurrentTest] = useState('');

  // Función para agregar resultado de test
  const addTestResult = (testName, success, message, data = null) => {
    setTestResults((prev) => [
      ...prev,
      {
        testName,
        success,
        message,
        data,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  // Test 1: Crear vehículo con horómetro avanzado (7764 horas)
  const testCreateVehicleWithAdvancedHourMeter = async () => {
    setCurrentTest('Creando vehículo con horómetro avanzado');
    setLoading(true);

    try {
      const vehicleData = {
        vehicleId: `TEST_EXC_${Date.now()}`,
        name: 'Excavadora Test Horómetro',
        brand: 'Caterpillar',
        model: 'CAT 320',
        type: 'excavadora',
        fuelType: 'DIESEL',
        status: 'activo',
        hasHourMeter: true,
        initialHourMeter: 7764, // Horómetro avanzado
        createdBy: 'test_system',
      };

      const result = await createVehicle(vehicleData);

      if (result.success) {
        setTestVehicle({ id: result.id, ...result.data });
        addTestResult(
          'Crear Vehículo con Horómetro Avanzado',
          true,
          `Vehículo creado exitosamente con horómetro inicial en ${vehicleData.initialHourMeter} horas`,
          result.data
        );
      } else {
        addTestResult(
          'Crear Vehículo con Horómetro Avanzado',
          false,
          `Error al crear vehículo: ${result.error}`
        );
      }
    } catch (error) {
      addTestResult(
        'Crear Vehículo con Horómetro Avanzado',
        false,
        `Error inesperado: ${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  // Test 2: Crear movimiento con lectura de horómetro
  const testCreateMovementWithHourMeter = async () => {
    if (!testVehicle) {
      addTestResult(
        'Crear Movimiento con Horómetro',
        false,
        'Necesita crear un vehículo de test primero'
      );
      return;
    }

    setCurrentTest('Creando movimiento con lectura de horómetro');
    setLoading(true);

    try {
      const movementData = {
        type: MOVEMENT_TYPES.SALIDA,
        fuelType: 'DIESEL',
        quantity: 50,
        unitPrice: 12500,
        vehicleId: testVehicle.vehicleId,
        hourMeterReading: 7772, // 8 horas después del inicial
        location: 'principal',
        description: 'Test de movimiento con horómetro',
        effectiveDate: new Date(),
      };

      const userInfo = {
        email: 'test@forestech.com',
        uid: 'test_user',
        displayName: 'Test User',
      };

      const movementId = await createMovement(movementData, userInfo);

      addTestResult(
        'Crear Movimiento con Horómetro',
        true,
        `Movimiento creado exitosamente. ID: ${movementId}. Horas trabajadas: 8 (7772 - 7764)`,
        { movementId, hoursWorked: 8 }
      );
    } catch (error) {
      addTestResult(
        'Crear Movimiento con Horómetro',
        false,
        `Error al crear movimiento: ${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  // Test 3: Validar datos del horómetro
  const testHourMeterValidation = async () => {
    if (!testVehicle) {
      addTestResult(
        'Validar Datos del Horómetro',
        false,
        'Necesita crear un vehículo de test primero'
      );
      return;
    }

    setCurrentTest('Validando datos del horómetro');
    setLoading(true);

    try {
      // ✅ MIGRATED: Usar FirebaseHourMeterService en lugar de hourMeterService legacy
      const hourMeterService = new FirebaseHourMeterService();
      const result = await hourMeterService.getHourMeterSummary(testVehicle.id);
      const summary = result.success ? result.data : null;

      if (!summary) {
        throw new Error(result.error || 'No se pudo obtener el resumen del horómetro');
      }

      const expectedData = {
        hasHourMeter: true,
        initialReading: 7764,
        currentReading: 7772, // Después del movimiento
        totalHoursWorked: 8,
        historyCount: 2, // Inicial + movimiento
      };

      const validations = [
        { key: 'hasHourMeter', expected: expectedData.hasHourMeter, actual: summary.hasHourMeter },
        {
          key: 'initialReading',
          expected: expectedData.initialReading,
          actual: summary.initialReading,
        },
        {
          key: 'totalHoursWorked',
          expected: expectedData.totalHoursWorked,
          actual: summary.totalHoursWorked,
        },
      ];

      const failedValidations = validations.filter((v) => v.expected !== v.actual);

      if (failedValidations.length === 0) {
        addTestResult(
          'Validar Datos del Horómetro',
          true,
          'Todos los datos del horómetro son correctos',
          summary
        );
      } else {
        addTestResult(
          'Validar Datos del Horómetro',
          false,
          `Validaciones fallidas: ${failedValidations.map((v) => `${v.key}: esperado ${v.expected}, actual ${v.actual}`).join(', ')}`,
          { summary, failedValidations }
        );
      }
    } catch (error) {
      addTestResult(
        'Validar Datos del Horómetro',
        false,
        `Error al validar horómetro: ${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  // Test 4: Verificar componentes UI
  const testUIComponents = () => {
    setCurrentTest('Verificando componentes UI');

    try {
      // Verificar que los componentes estén disponibles
      const componentsCheck = {
        HourMeterInput: typeof HourMeterInput === 'function',
        HourMeterDisplay: typeof HourMeterDisplay === 'function',
        HourMeterHistory: typeof HourMeterHistory === 'function',
      };

      const missingComponents = Object.entries(componentsCheck)
        .filter(([, exists]) => !exists)
        .map(([componentName]) => componentName);

      if (missingComponents.length === 0) {
        addTestResult(
          'Verificar Componentes UI',
          true,
          'Todos los componentes de horómetro están disponibles',
          componentsCheck
        );
      } else {
        addTestResult(
          'Verificar Componentes UI',
          false,
          `Componentes faltantes: ${missingComponents.join(', ')}`,
          componentsCheck
        );
      }
    } catch (error) {
      addTestResult(
        'Verificar Componentes UI',
        false,
        `Error al verificar componentes: ${error.message}`
      );
    }
  };

  // Ejecutar todos los tests
  const runAllTests = async () => {
    setTestResults([]);

    // Test de componentes UI (síncrono)
    testUIComponents();

    // Tests que requieren Firebase (asíncronos)
    await testCreateVehicleWithAdvancedHourMeter();
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Esperar 2 segundos

    await testCreateMovementWithHourMeter();
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Esperar 2 segundos

    await testHourMeterValidation();

    setCurrentTest('Tests completados');
  };

  return (
    <div className="hour-meter-system-test mx-auto max-w-4xl p-6">
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">🧪 Test Sistema de Horómetros</h1>

        <div className="mb-6">
          <p className="mb-4 text-gray-600">
            Este test verifica que el sistema de horómetros funcione correctamente con el escenario
            de vehículos que comienzan con horómetros avanzados (ej: 7764 horas).
          </p>

          <div className="mb-4 flex gap-3">
            <button
              onClick={runAllTests}
              disabled={loading}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? '⏳ Ejecutando...' : '🚀 Ejecutar Todos los Tests'}
            </button>

            <button
              onClick={testUIComponents}
              disabled={loading}
              className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
            >
              🎨 Test Componentes UI
            </button>
          </div>

          {currentTest && (
            <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
              <p className="text-blue-800">
                <span className="font-medium">Test actual:</span> {currentTest}
              </p>
            </div>
          )}
        </div>

        {/* Resultados de Tests */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">📊 Resultados de Tests</h2>

          {testResults.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center text-gray-500">
              No hay resultados de tests aún. Ejecuta los tests para ver los resultados.
            </div>
          ) : (
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`rounded-lg border p-4 ${
                    result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3
                        className={`font-medium ${
                          result.success ? 'text-green-800' : 'text-red-800'
                        }`}
                      >
                        {result.success ? '✅' : '❌'} {result.testName}
                      </h3>
                      <p className={`mt-1 ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                        {result.message}
                      </p>
                      <p className="mt-2 text-xs text-gray-500">
                        {new Date(result.timestamp).toLocaleString('es-CO')}
                      </p>
                    </div>

                    {result.data && (
                      <details className="ml-4">
                        <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                          Ver datos
                        </summary>
                        <pre className="mt-2 max-w-md overflow-auto rounded bg-gray-100 p-2 text-xs">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Demo de Componentes UI */}
        {testVehicle && (
          <div className="mt-8 space-y-6">
            <h2 className="text-lg font-semibold text-gray-800">🎨 Demo de Componentes</h2>

            {/* HourMeterDisplay */}
            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="mb-3 font-medium text-gray-800">HourMeterDisplay</h3>
              <HourMeterDisplay
                vehicleId={testVehicle.id}
                vehicle={testVehicle}
                showMetrics={true}
                showHistory={false}
              />
            </div>

            {/* HourMeterHistory */}
            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="mb-3 font-medium text-gray-800">HourMeterHistory</h3>
              <HourMeterHistory
                vehicleId={testVehicle.id}
                vehicle={testVehicle}
                maxEntries={10}
                showExport={true}
                showFilters={true}
              />
            </div>
          </div>
        )}

        {/* Resumen de Test */}
        {testResults.length > 0 && (
          <div className="mt-8 rounded-lg bg-gray-50 p-4">
            <h2 className="mb-3 text-lg font-semibold text-gray-800">📈 Resumen</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="rounded-lg bg-white p-3">
                <div className="text-2xl font-bold text-blue-600">{testResults.length}</div>
                <div className="text-sm text-gray-600">Tests Ejecutados</div>
              </div>
              <div className="rounded-lg bg-white p-3">
                <div className="text-2xl font-bold text-green-600">
                  {testResults.filter((r) => r.success).length}
                </div>
                <div className="text-sm text-gray-600">Exitosos</div>
              </div>
              <div className="rounded-lg bg-white p-3">
                <div className="text-2xl font-bold text-red-600">
                  {testResults.filter((r) => !r.success).length}
                </div>
                <div className="text-sm text-gray-600">Fallidos</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HourMeterSystemTest;
