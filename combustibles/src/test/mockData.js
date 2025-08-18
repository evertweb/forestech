// Mock data for useFuelTypes hook in tests
export const mockFuelTypes = [
  {
    id: 'fuel-1',
    value: 'ACPM',
    label: 'ACPM (Diesel)',
    name: 'acpm',
    displayName: 'ACPM (Diesel)',
    color: '#2563EB',
    icon: '⛽',
    unit: 'gal',
    defaultPrice: 3500,
  },
  {
    id: 'fuel-2',
    value: 'GASOLINA_CORRIENTE',
    label: 'Gasolina Corriente',
    name: 'gasolina_corriente',
    displayName: 'Gasolina Corriente',
    color: '#DC2626',
    icon: '⛽',
    unit: 'gal',
    defaultPrice: 4200,
  },
  {
    id: 'fuel-3',
    value: 'GASOLINA_EXTRA',
    label: 'Gasolina Extra',
    name: 'gasolina_extra',
    displayName: 'Gasolina Extra',
    color: '#7C3AED',
    icon: '⛽',
    unit: 'gal',
    defaultPrice: 4800,
  },
];

export const mockUseFuelTypes = {
  fuelTypes: mockFuelTypes,
  fuelInfo: {
    ACPM: {
      name: 'ACPM (Diesel)',
      color: '#2563EB',
      icon: '⛽',
      unit: 'gal',
      defaultPrice: 3500,
    },
    GASOLINA_CORRIENTE: {
      name: 'Gasolina Corriente',
      color: '#DC2626',
      icon: '⛽',
      unit: 'gal',
      defaultPrice: 4200,
    },
    GASOLINA_EXTRA: {
      name: 'Gasolina Extra',
      color: '#7C3AED',
      icon: '⛽',
      unit: 'gal',
      defaultPrice: 4800,
    },
  },
  fuelTypeNames: ['ACPM', 'GASOLINA_CORRIENTE', 'GASOLINA_EXTRA'],
  loading: false,
  error: null,
  getFuelInfo: (fuelType) => {
    const fuel = mockFuelTypes.find((f) => f.value === fuelType);
    return fuel
      ? {
          name: fuel.label,
          color: fuel.color,
          icon: fuel.icon,
          unit: fuel.unit,
          defaultPrice: fuel.defaultPrice,
        }
      : null;
  },
};
