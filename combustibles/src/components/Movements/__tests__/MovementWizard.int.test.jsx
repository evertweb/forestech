import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import MovementWizard from '../MovementWizard';
import { withProviders } from '../../../test/TestProviders.jsx';

const inventoryState = {
  inventory: [],
  setInventory: vi.fn(),
  reset: vi.fn(),
};

const vehiclesState = {
  vehicles: [],
  setVehicles: vi.fn(),
  reset: vi.fn(),
};

vi.mock('../../../stores', () => ({
  useInventoryStore: vi.fn((selector = state => state) => selector(inventoryState)),
  useVehiclesStore: vi.fn((selector = state => state) => selector(vehiclesState)),
}));

vi.mock('../../../services/FirebaseMovementsService', () => {
  const createMovement = vi.fn(async () => ({ success: true, id: 'm1' }));
  const getAllMovements = vi.fn(async () => ({ success: true, data: [] }));
  const subscribeToMovements = vi.fn((cb) => {
    cb([]);
    return () => {};
  });
  const deleteMovement = vi.fn(async () => ({ success: true }));
  const validateStock = vi.fn(async () => ({ valid: true }));

  const defaultMock = vi.fn().mockImplementation(() => ({
    createMovement,
    getAllMovements,
    subscribeToMovements,
    deleteMovement,
    validateStock,
  }));

  return {
    default: defaultMock,
    createMovement,
    getAllMovements,
    subscribeToMovements,
    deleteMovement,
    validateStock,
    MOVEMENT_TYPES: {
      ENTRADA: 'entrada',
      SALIDA: 'salida',
      TRANSFERENCIA: 'transferencia',
      AJUSTE: 'ajuste',
    },
  };
});

vi.mock('../../../services/FirebaseProductsService', () => {
  const getActiveProducts = vi.fn(async () => ({ success: true, data: [] }));
  const defaultMock = vi.fn().mockImplementation(() => ({
    getActiveProducts,
  }));

  return {
    default: defaultMock,
    getActiveProducts,
  };
});

vi.mock('../../../services/FirebaseSuppliersService', () => {
  const getAllSuppliers = vi.fn(async () => ({
    success: true,
    data: [{ id: 's1', name: 'Proveedor 1' }],
  }));
  const subscribeToSuppliers = vi.fn((cb) => {
    cb([{ id: 's1', name: 'Proveedor 1' }]);
    return () => {};
  });
  const defaultMock = vi.fn().mockImplementation(() => ({
    getAllSuppliers,
    subscribeToSuppliers,
    createSupplier: vi.fn(),
    updateSupplier: vi.fn(),
  }));

  return {
    default: defaultMock,
    getAllSuppliers,
    subscribeToSuppliers,
  };
});

vi.mock('../../../services/FirebaseVehiclesService', () => {
  const subscribeToVehicles = vi.fn((cb) => {
    cb([]);
    return () => {};
  });
  const getAllVehicles = vi.fn(async () => ({ success: true, data: [] }));
  const defaultMock = vi.fn().mockImplementation(() => ({
    subscribeToVehicles,
    getAllVehicles,
  }));

  return {
    default: defaultMock,
    subscribeToVehicles,
    getAllVehicles,
  };
});

describe('MovementWizard (integration)', () => {
  it('abre modal y se puede cerrar correctamente', async () => {
    const onClose = vi.fn();
    const onSuccess = vi.fn();
    render(withProviders(<MovementWizard isOpen={true} onClose={onClose} onSuccess={onSuccess} />));

    // Verificar que el modal se abre (loading state)
    expect(screen.getByText(/cargando datos del sistema/i)).toBeInTheDocument();

    // Cerrar modal usando botón de escape
    const escapeButton = screen.getByRole('button', { name: '[ESC]' });
    await userEvent.click(escapeButton);

    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });
});
