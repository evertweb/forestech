/**
 * BaseService Tests
 * Tests unitarios para la clase BaseService
 *
 * Forestech Colombia - Combustibles App
 * @author AI Agent - TASK 1.2 BaseService Implementation
 * @date 2025-01-04
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BaseService } from '../BaseService.js';

// Mock Firebase
vi.mock('../../../firebase/config', () => ({
  db: {},
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(() => ({ _type: 'collection' })),
  doc: vi.fn(() => ({ _type: 'document' })),
  serverTimestamp: vi.fn(() => ({ _type: 'timestamp' })),
}));

describe('BaseService', () => {
  let baseService;
  const mockCollectionName = 'test_collection';

  beforeEach(() => {
    baseService = new BaseService(mockCollectionName);
  });

  describe('Constructor', () => {
    it('debe requerir collectionName', () => {
      expect(() => new BaseService()).toThrow('BaseService: collectionName es requerido');
    });

    it('debe inicializar con configuración por defecto', () => {
      expect(baseService.collectionName).toBe(mockCollectionName);
      expect(baseService.config.enableTimestamps).toBe(true);
      expect(baseService.config.enableSoftDelete).toBe(false);
      expect(baseService.config.defaultOrderBy).toBe('createdAt');
      expect(baseService.config.defaultOrderDirection).toBe('desc');
    });

    it('debe permitir configuración personalizada', () => {
      const customConfig = {
        enableTimestamps: false,
        enableSoftDelete: true,
        defaultOrderBy: 'name',
      };

      const customService = new BaseService(mockCollectionName, customConfig);

      expect(customService.config.enableTimestamps).toBe(false);
      expect(customService.config.enableSoftDelete).toBe(true);
      expect(customService.config.defaultOrderBy).toBe('name');
      expect(customService.config.defaultOrderDirection).toBe('desc'); // Mantiene default
    });
  });

  describe('validateData', () => {
    it('debe rechazar datos nulos o undefined', () => {
      const result1 = baseService.validateData(null);
      const result2 = baseService.validateData(undefined);

      expect(result1.isValid).toBe(false);
      expect(result1.errors).toContain('Los datos son requeridos y deben ser un objeto');

      expect(result2.isValid).toBe(false);
      expect(result2.errors).toContain('Los datos son requeridos y deben ser un objeto');
    });

    it('debe rechazar tipos primitivos', () => {
      const result1 = baseService.validateData('string');
      const result2 = baseService.validateData(123);
      const result3 = baseService.validateData(true);

      expect(result1.isValid).toBe(false);
      expect(result2.isValid).toBe(false);
      expect(result3.isValid).toBe(false);
    });

    it('debe aceptar objetos válidos', () => {
      const result = baseService.validateData({ name: 'test' });

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });
  });

  describe('processData', () => {
    it('debe agregar timestamps para nueva creación', () => {
      const data = { name: 'test' };
      const processed = baseService.processData(data, false);

      expect(processed.createdAt).toBeDefined();
      expect(processed.updatedAt).toBeDefined();
      expect(processed.name).toBe('test');
    });

    it('debe agregar solo updatedAt para actualizaciones', () => {
      const data = { name: 'test' };
      const processed = baseService.processData(data, true);

      expect(processed.createdAt).toBeUndefined();
      expect(processed.updatedAt).toBeDefined();
      expect(processed.name).toBe('test');
    });

    it('debe limpiar campos undefined', () => {
      const data = {
        name: 'test',
        description: undefined,
        value: null,
        active: false,
      };
      const processed = baseService.processData(data);

      expect(processed.name).toBe('test');
      expect(processed.description).toBeUndefined();
      expect(processed.value).toBe(null); // null se mantiene
      expect(processed.active).toBe(false); // false se mantiene
      expect('description' in processed).toBe(false);
    });

    it('no debe agregar timestamps si está deshabilitado', () => {
      const service = new BaseService(mockCollectionName, { enableTimestamps: false });
      const data = { name: 'test' };
      const processed = service.processData(data, false);

      expect(processed.createdAt).toBeUndefined();
      expect(processed.updatedAt).toBeUndefined();
      expect(processed.name).toBe('test');
    });
  });

  describe('handleError', () => {
    it('debe manejar errores comunes de Firebase', () => {
      const permissionError = { code: 'permission-denied', message: 'Access denied' };
      const result = baseService.handleError(permissionError, 'TEST_OPERATION');

      expect(result.success).toBe(false);
      expect(result.error).toBe('No tienes permisos para realizar esta operación');
      expect(result.code).toBe('permission-denied');
      expect(result.operation).toBe('TEST_OPERATION');
    });

    it('debe manejar errores sin código', () => {
      const genericError = new Error('Generic error message');
      const result = baseService.handleError(genericError, 'TEST_OPERATION');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Generic error message');
      expect(result.code).toBe('unknown');
    });

    it('debe usar mensaje por defecto para errores sin mensaje', () => {
      const emptyError = { code: 'some-unknown-code' };
      const result = baseService.handleError(emptyError, 'TEST_OPERATION');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Ocurrió un error inesperado');
    });
  });

  describe('logOperation', () => {
    it('debe llamar console.info con datos estructurados', () => {
      const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});

      baseService.logOperation('CREATE', 'doc123', { extra: 'data' });

      expect(consoleSpy).toHaveBeenCalledWith(
        '[BaseService] CREATE:',
        expect.objectContaining({
          service: 'BaseService',
          collection: mockCollectionName,
          operation: 'CREATE',
          documentId: 'doc123',
          timestamp: expect.any(String),
          extra: 'data',
        })
      );

      consoleSpy.mockRestore();
    });
  });

  describe('getCollectionRef y getDocRef', () => {
    it('debe devolver referencias de Firebase', () => {
      const collectionRef = baseService.getCollectionRef();
      const docRef = baseService.getDocRef('test-id');

      expect(collectionRef._type).toBe('collection');
      expect(docRef._type).toBe('document');
    });
  });
});

describe('BaseService - Métodos de utilidad', () => {
  let service;

  beforeEach(() => {
    service = new BaseService('test_collection');
  });

  describe('checkDuplicate', () => {
    it('debe ser implementado por clases hijas', () => {
      // La implementación está en BaseService pero usa Firebase
      // Este test verifica que el método existe
      expect(typeof service.checkDuplicate).toBe('function');
    });
  });
});
