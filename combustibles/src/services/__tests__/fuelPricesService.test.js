import { describe, it, expect } from 'vitest';
import { detectFuelType, canUseAutomaticPricing } from '../fuelPricesService';

describe('fuelPricesService - detectFuelType', () => {
  it('detects DIESEL from ACPM', () => {
    expect(detectFuelType('ACPM')).toBe('DIESEL');
    expect(detectFuelType('ACPM Premium')).toBe('DIESEL');
  });

  it('detects DIESEL from DIESEL keyword', () => {
    expect(detectFuelType('DIESEL')).toBe('DIESEL');
    expect(detectFuelType('Diésel Especial')).toBe('DIESEL');
  });

  it('detects GASOLINE for gasoline names', () => {
    expect(detectFuelType('Gasolina Corriente')).toBe('GASOLINE');
    expect(detectFuelType('Gasoline Extra')).toBe('GASOLINE');
  });

  it('detects BIOFUEL for biodiesel', () => {
    expect(detectFuelType('Biodiesel')).toBe('BIOFUEL');
  });

  it('returns null for unknown names', () => {
    expect(detectFuelType('Some Random Product')).toBeNull();
  });
});

describe('fuelPricesService - canUseAutomaticPricing', () => {
  it('returns true for detectable names', () => {
    expect(canUseAutomaticPricing({ name: 'ACPM' })).toBe(true);
    expect(canUseAutomaticPricing({ name: 'Gasolina Corriente' })).toBe(true);
  });

  it('accepts string name directly', () => {
    expect(canUseAutomaticPricing('DIESEL')).toBe(true);
  });

  it('returns false for unknown product', () => {
    expect(canUseAutomaticPricing({ name: 'UNKNOWN' })).toBe(false);
  });
});
