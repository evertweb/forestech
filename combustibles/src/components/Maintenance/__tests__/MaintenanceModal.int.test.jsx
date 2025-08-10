import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import MaintenanceModal from '../MaintenanceModal';
import { withProviders } from '../../../test/TestProviders.jsx';

vi.mock('../../../services/maintenanceService', () => ({
  MAINTENANCE_TYPES: { OIL_CHANGE: 'OIL_CHANGE', BATTERY_CHANGE: 'BATTERY_CHANGE' },
  MAINTENANCE_STATUS: { COMPLETED: 'COMPLETED' },
  BATTERY_STATUS: { NEW: 'NEW' },
  createMaintenanceRecord: vi.fn(async () => ({ success: true })),
  updateMaintenanceRecord: vi.fn(async () => ({ success: true })),
  getVehiclesForMaintenance: vi.fn(async () => [{ id: 'v1', name: 'Vehículo 1' }]),
  calculateNextOilChange: vi.fn((hours) => hours + 250),
}));

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
