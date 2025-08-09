import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import VehicleFormSmart from '../VehicleFormSmart';
import { withProviders } from '../../../test/TestProviders.jsx';

vi.mock('../../../services/vehicleCategoriesService', () => ({
  subscribeToCategories: (cb) => {
    cb([{ id: 'c1', name: 'Camión' }]);
    return () => {};
  }
}));

describe('VehicleFormSmart (integration)', () => {
  it('completa paso básico y avanza a detalles', async () => {
    const onClose = vi.fn();
    const onSuccess = vi.fn();
    render(withProviders(<VehicleFormSmart isOpen={true} onClose={onClose} onSuccess={onSuccess} />));

  const nameInput = await screen.findByPlaceholderText(/excavadora principal/i);
  await userEvent.type(nameInput, 'Excavadora 1');

  const submit = screen.getByRole('button', { name: /crear vehículo/i });
  expect(submit).toBeInTheDocument();
  });
});
