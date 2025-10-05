import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import InventoryModal from '../InventoryModal';
import { mockUseFuelTypes } from '../../../test/mockData.js';

// Mock services para evitar llamadas reales a Firebase
vi.mock('../../../services/FirebaseInventoryService', () => {
  const createInventoryItem = vi.fn(async () => ({ success: true, message: 'Creado' }));
  const updateInventoryItem = vi.fn(async () => ({ success: true, message: 'Actualizado' }));
  const subscribeToInventory = vi.fn((cb) => {
    cb([]);
    return () => {};
  });
  const getAllInventory = vi.fn(async () => ({ success: true, data: [] }));

  const defaultMock = vi.fn().mockImplementation(() => ({
    createInventoryItem,
    updateInventoryItem,
    subscribeToInventory,
    getAllInventory,
  }));

  return {
    default: defaultMock,
    createInventoryItem,
    updateInventoryItem,
    subscribeToInventory,
    getAllInventory,
  };
});

// Mock useFuelTypes hook
vi.mock('../../../hooks/useFuelTypes', () => ({
  default: vi.fn(() => mockUseFuelTypes),
}));

vi.mock('../../../contexts/CombustiblesContext', () => ({
  useCombustibles: () => ({
    userProfile: { uid: 'test-user' },
  }),
}));

vi.mock('../../../contexts/FirebaseProgressContext', () => ({
  useFirebaseProgressContext: () => ({
    executeWithProgress: vi.fn(async (_operation, _description, operation) => operation()),
  }),
}));

describe('InventoryModal (integration)', () => {
  it('abre, valida campos requeridos y crea item', async () => {
    const onClose = vi.fn();
    const onSuccess = vi.fn();
    render(<InventoryModal onClose={onClose} onSuccess={onSuccess} />);

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

    // Completar campos mínimos - seleccionar la primera opción específica
    await userEvent.selectOptions(
      fuelType,
      screen.getByRole('option', { name: /ACPM \(Diesel\)/i })
    );
    await userEvent.type(location, 'Tanque Principal');
    await userEvent.clear(maxCapacity);
    await userEvent.type(maxCapacity, '1000');

    await userEvent.click(createBtn);
    // onSuccess llamado tras creación
    expect(onSuccess).toHaveBeenCalled();
  });
});
