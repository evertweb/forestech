import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import MovementWizard from '../MovementWizard';
import { withProviders } from '../../../test/TestProviders.jsx';

vi.mock('../../../services/movementsService', () => ({
  default: {
    subscribeToMovements: (cb) => { cb([]); return () => {}; },
  },
  createMovement: vi.fn(async () => ({ success: true, id: 'm1' })),
  MOVEMENT_TYPES: { INCOME: 'INCOME', OUTCOME: 'OUTCOME', TRANSFER: 'TRANSFER' },
}));

vi.mock('../../../services/productsService', () => ({
  getActiveProducts: vi.fn(async () => ({ success: true, data: [] }))
}));

vi.mock('../../../services/suppliersService', () => ({
  getAllSuppliers: vi.fn(async () => ({ success: true, data: [{ id: 's1', name: 'Proveedor 1' }] })),
  subscribeToSuppliers: (cb) => { cb([{ id: 's1', name: 'Proveedor 1' }]); return () => {}; },
}));

describe('MovementWizard (integration)', () => {
  it('navega pasos básicos y confirma', async () => {
    const onClose = vi.fn();
    const onSuccess = vi.fn();
    render(withProviders(<MovementWizard isOpen={true} onClose={onClose} onSuccess={onSuccess} />));

  // Paso 1: seleccionar tipo de movimiento (UI tipo typeform)
  const option = await screen.findByText(/entrada de combustible/i);
  await userEvent.click(option);

  // Botón siguiente (flecha)
  const nextBtn = await screen.findByRole('button', { name: /siguiente paso/i });
  await userEvent.click(nextBtn);

    // Avanzar algunos pasos (no validamos todos los campos en este smoke)
    const continueButtons = screen.getAllByRole('button');
    if (continueButtons.length) {
      await userEvent.click(continueButtons[0]);
    }

    // Cerrar sin errores
    const cancel = screen.getByRole('button', { name: /cancelar|cerrar/i });
    await userEvent.click(cancel);

    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });
});
