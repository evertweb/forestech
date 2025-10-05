import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import MaintenanceModal from '../MaintenanceModal';
import { withProviders } from '../../../test/TestProviders.jsx';

vi.mock('../../../services/FirebaseMaintenanceService', () => {
  const MAINTENANCE_TYPES = { OIL_CHANGE: 'OIL_CHANGE', BATTERY_CHANGE: 'BATTERY_CHANGE' };
  const MAINTENANCE_STATUS = { COMPLETED: 'COMPLETED' };
  const BATTERY_STATUS = { NEW: 'NEW' };
  const calculateNextOilChange = vi.fn((hours) => hours + 250);
  const createMaintenanceRecord = vi.fn(async () => ({ success: true, message: 'Creado' }));
  const updateMaintenanceRecord = vi.fn(async () => ({ success: true, message: 'Actualizado' }));
  const subscribeToMaintenanceRecords = vi.fn((cb) => {
    cb([]);
    return () => {};
  });
  const getAllMaintenanceRecords = vi.fn(async () => ({ success: true, data: [] }));

  const defaultMock = vi.fn().mockImplementation(() => ({
    createMaintenanceRecord,
    updateMaintenanceRecord,
    subscribeToMaintenanceRecords,
    getAllMaintenanceRecords,
  }));

  return {
    default: defaultMock,
    MAINTENANCE_TYPES,
    MAINTENANCE_STATUS,
    BATTERY_STATUS,
    calculateNextOilChange,
    createMaintenanceRecord,
    updateMaintenanceRecord,
    subscribeToMaintenanceRecords,
    getAllMaintenanceRecords,
  };
});

describe('MaintenanceModal (integration)', () => {
  it('valida campos obligatorios en modo cambio de aceite', async () => {
    const onClose = vi.fn();
    const onSuccess = vi.fn();
    render(
      withProviders(<MaintenanceModal isOpen={true} onClose={onClose} onSuccess={onSuccess} />)
    );

    // Intenta guardar sin completar
    const save = screen.getByRole('button', { name: /crear|guardar|actualizar/i });
    await userEvent.click(save);

    // Debe mostrar errores de validación en algunos campos
    expect(await screen.findAllByText(/requerido|inválido|debe/i)).toBeTruthy();
  });
});
