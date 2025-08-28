import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import MovementWizard from '../MovementWizard';
import { withProviders } from '../../../test/TestProviders.jsx';

vi.mock('../../../services/movementsService', () => ({
  default: {
    subscribeToMovements: (cb) => {
      cb([]);
      return () => {};
    },
  },
  createMovement: vi.fn(async () => ({ success: true, id: 'm1' })),
  MOVEMENT_TYPES: { INCOME: 'INCOME', OUTCOME: 'OUTCOME', TRANSFER: 'TRANSFER' },
}));

vi.mock('../../../services/productsService', () => ({
  getActiveProducts: vi.fn(async () => ({ success: true, data: [] })),
}));

vi.mock('../../../services/suppliersService', () => ({
  getAllSuppliers: vi.fn(async () => ({
    success: true,
    data: [{ id: 's1', name: 'Proveedor 1' }],
  })),
  subscribeToSuppliers: (cb) => {
    cb([{ id: 's1', name: 'Proveedor 1' }]);
    return () => {};
  },
}));

describe('MovementWizard (integration)', () => {
  it('abre modal y se puede cerrar correctamente', async () => {
    const onClose = vi.fn();
    const onSuccess = vi.fn();
    render(withProviders(<MovementWizard isOpen={true} onClose={onClose} onSuccess={onSuccess} />));

    // Verificar que el modal se abre (loading state)
    expect(screen.getByText(/cargando datos del sistema/i)).toBeInTheDocument();

    // Cerrar modal usando botón de escape
    const escapeButton = screen.getByRole('button', { name: /cerrar formulario/i });
    await userEvent.click(escapeButton);

    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });
});
