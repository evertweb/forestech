/**
 * Tests para el sistema centralizado de validaciones
 */

/* eslint-env jest */
/* global describe, test, expect */

import { 
  validators, 
  validateField, 
  validateForm, 
  crossFieldValidators,
  validationSchemas 
} from '../validators';

describe('Validadores básicos', () => {
  describe('required', () => {
    test('debe retornar error si el campo está vacío', () => {
      expect(validators.required('')).toBe('Campo requerido');
      expect(validators.required('   ')).toBe('Campo requerido');
      expect(validators.required(null)).toBe('Campo requerido');
      expect(validators.required(undefined)).toBe('Campo requerido');
    });

    test('debe retornar null si el campo tiene valor', () => {
      expect(validators.required('test')).toBeNull();
      expect(validators.required('0')).toBeNull();
      expect(validators.required(0)).toBeNull();
    });

    test('debe usar mensaje personalizado', () => {
      expect(validators.required('', 'Este campo es obligatorio'))
        .toBe('Este campo es obligatorio');
    });
  });

  describe('email', () => {
    test('debe validar emails correctos', () => {
      expect(validators.email('test@example.com')).toBeNull();
      expect(validators.email('user.name@domain.co')).toBeNull();
      expect(validators.email('test+tag@example.org')).toBeNull();
    });

    test('debe rechazar emails inválidos', () => {
      expect(validators.email('invalid')).toBe('Email inválido');
      expect(validators.email('test@')).toBe('Email inválido');
      expect(validators.email('@domain.com')).toBe('Email inválido');
      expect(validators.email('test@domain')).toBe('Email inválido');
    });

    test('debe permitir valor vacío', () => {
      expect(validators.email('')).toBeNull();
      expect(validators.email(null)).toBeNull();
    });
  });

  describe('number', () => {
    test('debe validar números correctos', () => {
      expect(validators.number('123')).toBeNull();
      expect(validators.number('0')).toBeNull();
      expect(validators.number('-5')).toBeNull();
      expect(validators.number('3.14')).toBeNull();
    });

    test('debe rechazar valores no numéricos', () => {
      expect(validators.number('abc')).toBe('Debe ser un número válido');
      expect(validators.number('12a')).toBe('Debe ser un número válido');
    });

    test('debe permitir valor vacío', () => {
      expect(validators.number('')).toBeNull();
      expect(validators.number(null)).toBeNull();
    });
  });

  describe('positive', () => {
    test('debe validar números positivos', () => {
      expect(validators.positive('1')).toBeNull();
      expect(validators.positive('100')).toBeNull();
      expect(validators.positive('0.1')).toBeNull();
    });

    test('debe rechazar números no positivos', () => {
      expect(validators.positive('0')).toBe('Debe ser un número positivo');
      expect(validators.positive('-1')).toBe('Debe ser un número positivo');
    });

    test('debe permitir valor vacío', () => {
      expect(validators.positive('')).toBeNull();
    });
  });

  describe('nonNegative', () => {
    test('debe validar números no negativos', () => {
      expect(validators.nonNegative('0')).toBeNull();
      expect(validators.nonNegative('1')).toBeNull();
      expect(validators.nonNegative('100')).toBeNull();
    });

    test('debe rechazar números negativos', () => {
      expect(validators.nonNegative('-1')).toBe('No puede ser negativo');
      expect(validators.nonNegative('-0.1')).toBe('No puede ser negativo');
    });
  });
});

describe('Validadores específicos del dominio', () => {
  describe('vehiclePlate', () => {
    test('debe validar placas colombianas correctas', () => {
      expect(validators.vehiclePlate('ABC-123')).toBeNull();
      expect(validators.vehiclePlate('XYZ-999')).toBeNull();
      expect(validators.vehiclePlate('abc-123')).toBeNull(); // Se convierte a mayúscula
    });

    test('debe rechazar placas inválidas', () => {
      expect(validators.vehiclePlate('AB-123')).toBe('Formato de placa inválido (ej: ABC-123)');
      expect(validators.vehiclePlate('ABCD-123')).toBe('Formato de placa inválido (ej: ABC-123)');
      expect(validators.vehiclePlate('ABC-12')).toBe('Formato de placa inválido (ej: ABC-123)');
      expect(validators.vehiclePlate('ABC123')).toBe('Formato de placa inválido (ej: ABC-123)');
    });
  });

  describe('vehicleCode', () => {
    test('debe validar códigos de vehículo correctos', () => {
      expect(validators.vehicleCode('EXC001')).toBeNull();
      expect(validators.vehicleCode('ABC123')).toBeNull();
      expect(validators.vehicleCode('TRUCK01')).toBeNull();
    });

    test('debe rechazar códigos inválidos', () => {
      expect(validators.vehicleCode('AB')).toBe('Código de vehículo inválido');
      expect(validators.vehicleCode('ABC123456789ABC')).toBe('Código de vehículo inválido');
      expect(validators.vehicleCode('abc-123')).toBe('Código de vehículo inválido');
    });
  });

  describe('nit', () => {
    test('debe validar NITs correctos', () => {
      expect(validators.nit('12345678-9')).toBeNull();
      expect(validators.nit('987654321-0')).toBeNull();
    });

    test('debe rechazar NITs inválidos', () => {
      expect(validators.nit('1234567-8')).toBe('NIT inválido');
      expect(validators.nit('123456789012-3')).toBe('NIT inválido');
      expect(validators.nit('12345678')).toBe('NIT inválido');
    });
  });

  describe('colombianPhone', () => {
    test('debe validar teléfonos colombianos correctos', () => {
      expect(validators.colombianPhone('3001234567')).toBeNull();
      expect(validators.colombianPhone('+573001234567')).toBeNull();
      expect(validators.colombianPhone('573001234567')).toBeNull();
      expect(validators.colombianPhone('300 123 4567')).toBeNull();
    });

    test('debe rechazar teléfonos inválidos', () => {
      expect(validators.colombianPhone('300123456')).toBe('Número de teléfono inválido');
      expect(validators.colombianPhone('30012345678')).toBe('Número de teléfono inválido');
      expect(validators.colombianPhone('123')).toBe('Número de teléfono inválido');
    });
  });

  describe('fuelCapacity', () => {
    test('debe validar capacidades correctas', () => {
      expect(validators.fuelCapacity('100')).toBeNull();
      expect(validators.fuelCapacity('50.5')).toBeNull();
      expect(validators.fuelCapacity('1000')).toBeNull();
    });

    test('debe rechazar capacidades inválidas', () => {
      expect(validators.fuelCapacity('0')).toBe('Capacidad debe ser mayor a 0');
      expect(validators.fuelCapacity('-10')).toBe('Capacidad debe ser mayor a 0');
      expect(validators.fuelCapacity('abc')).toBe('Capacidad debe ser mayor a 0');
    });
  });

  describe('rating', () => {
    test('debe validar ratings correctos', () => {
      expect(validators.rating('1')).toBeNull();
      expect(validators.rating('3')).toBeNull();
      expect(validators.rating('5')).toBeNull();
    });

    test('debe rechazar ratings inválidos', () => {
      expect(validators.rating('0')).toBe('Rating debe estar entre 1 y 5');
      expect(validators.rating('6')).toBe('Rating debe estar entre 1 y 5');
      expect(validators.rating('-1')).toBe('Rating debe estar entre 1 y 5');
    });
  });
});

describe('validateField', () => {
  test('debe ejecutar múltiples validaciones y retornar el primer error', () => {
    const rules = [
      validators.required,
      validators.minLength(5, 'Mínimo 5 caracteres')
    ];

    expect(validateField('', rules)).toBe('Campo requerido');
    expect(validateField('abc', rules)).toBe('Mínimo 5 caracteres');
    expect(validateField('abcdef', rules)).toBeNull();
  });

  test('debe manejar reglas vacías', () => {
    expect(validateField('test', [])).toBeNull();
    expect(validateField('test', null)).toBeNull();
  });
});

describe('validateForm', () => {
  test('debe validar formulario completo', () => {
    const data = {
      name: '',
      email: 'invalid-email',
      age: '25'
    };

    const schema = {
      name: [validators.required],
      email: [validators.required, validators.email],
      age: [validators.required, validators.number]
    };

    const result = validateForm(data, schema);

    expect(result.isValid).toBe(false);
    expect(result.errors.name).toBe('Campo requerido');
    expect(result.errors.email).toBe('Email inválido');
    expect(result.errors.age).toBeUndefined(); // Age es válido
  });

  test('debe retornar válido si no hay errores', () => {
    const data = {
      name: 'Juan',
      email: 'juan@example.com',
      age: '25'
    };

    const schema = {
      name: [validators.required],
      email: [validators.required, validators.email],
      age: [validators.required, validators.number]
    };

    const result = validateForm(data, schema);

    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });
});

describe('crossFieldValidators', () => {
  describe('stockVsCapacity', () => {
    test('debe validar que el stock no exceda la capacidad', () => {
      const formData = {
        currentStock: '150',
        maxCapacity: '100'
      };

      const errors = crossFieldValidators.stockVsCapacity(formData);
      expect(errors.currentStock).toBe('Stock actual no puede ser mayor a la capacidad máxima');
    });

    test('debe permitir stock menor o igual a la capacidad', () => {
      const formData = {
        currentStock: '80',
        maxCapacity: '100'
      };

      const errors = crossFieldValidators.stockVsCapacity(formData);
      expect(Object.keys(errors)).toHaveLength(0);
    });
  });

  describe('maintenanceDates', () => {
    test('debe validar que la próxima fecha sea posterior a la última', () => {
      const formData = {
        lastMaintenanceDate: '2024-01-15',
        nextMaintenanceDate: '2024-01-10'
      };

      const errors = crossFieldValidators.maintenanceDates(formData);
      expect(errors.nextMaintenanceDate).toBe('La próxima fecha debe ser posterior a la última');
    });

    test('debe permitir fechas válidas', () => {
      const formData = {
        lastMaintenanceDate: '2024-01-10',
        nextMaintenanceDate: '2024-01-15'
      };

      const errors = crossFieldValidators.maintenanceDates(formData);
      expect(Object.keys(errors)).toHaveLength(0);
    });
  });
});

describe('validationSchemas', () => {
  test('debe tener schema predefinido para vehículos', () => {
    expect(validationSchemas.vehicle).toBeDefined();
    expect(validationSchemas.vehicle.vehicleId).toContain(validators.required);
    expect(validationSchemas.vehicle.name).toContain(validators.required);
  });

  test('debe tener schema predefinido para inventario', () => {
    expect(validationSchemas.inventory).toBeDefined();
    expect(validationSchemas.inventory.fuelType).toContain(validators.required);
    expect(validationSchemas.inventory.location).toContain(validators.required);
  });

  test('debe tener schema predefinido para proveedores', () => {
    expect(validationSchemas.supplier).toBeDefined();
    expect(validationSchemas.supplier.name).toContain(validators.required);
    expect(validationSchemas.supplier.email).toContain(validators.email);
  });

  test('debe tener schema predefinido para mantenimiento', () => {
    expect(validationSchemas.maintenance).toBeDefined();
    expect(validationSchemas.maintenance.vehicleId).toContain(validators.required);
    expect(validationSchemas.maintenance.title).toContain(validators.required);
  });
});