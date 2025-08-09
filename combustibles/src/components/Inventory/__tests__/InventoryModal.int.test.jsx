import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import InventoryModal from '../InventoryModal';
import { withProviders } from '../../../test/TestProviders.jsx';

// Mock services to avoid Firebase calls
vi.mock('../../../services/inventoryService', () => ({
  createInventoryItem: vi.fn(async () => ({ success: true, message: 'Creado' })),
  updateInventoryItem: vi.fn(async () => ({ success: true, message: 'Actualizado' })),
  subscribeToInventory: (cb) => { cb([]); return () => {}; },
}));

vi.mock('../../../contexts/CombustiblesContext', async () => {
  const actual = await import('../../../contexts/CombustiblesContext.jsx');
  return actual;
});

describe('InventoryModal (integration)', () => {
  it('abre, valida campos requeridos y crea item', async () => {
    const onClose = vi.fn();
    const onSuccess = vi.fn();
    render(withProviders(<InventoryModal onClose={onClose} onSuccess={onSuccess} />));

    // Debe renderizar el diálogo
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    const fuelType = screen.getByLabelText(/tipo de combustible/i);
    const location = screen.getByLabelText(/ubicación/i);
    const maxCapacity = screen.getByLabelText(/capacidad máxima/i);

    // Intentar crear sin datos
    const createBtn = screen.getByRole('button', { name: /crear/i });
    await userEvent.click(createBtn);

    // Debe mostrar errores de validación
    expect(await screen.findAllByText(/requerido|inválido/i)).toBeTruthy();

    // Completar campos mínimos
    await userEvent.selectOptions(fuelType, screen.getByRole('option', { name: /gasolina|acpm|diesel/i }));
    await userEvent.type(location, 'Tanque Principal');
    await userEvent.clear(maxCapacity);
    await userEvent.type(maxCapacity, '1000');

  await userEvent.click(createBtn);
  // onSuccess llamado tras creación
  expect(onSuccess).toHaveBeenCalled();
  });
});
