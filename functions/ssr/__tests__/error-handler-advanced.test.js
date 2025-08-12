/**
 * Tests para Error Handler Advanced - Fase 4
 * Suite de pruebas para el sistema de manejo de errores robusto
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SSRError, handleSSRError, getErrorStatistics, clearErrorMetrics } from '../ssr/error-handler-advanced.js';

describe('Error Handler Advanced - Fase 4', () => {
  
  beforeEach(() => {
    // Limpiar métricas antes de cada test
    clearErrorMetrics();
    
    // Mock console methods
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'info').mockImplementation(() => {});
  });

  describe('SSRError Class', () => {
    it('should create SSRError with correct properties', () => {
      const error = new SSRError('Test error message', {
        code: 'TEST001',
        category: 'AUTH',
        route: '/test-route',
        user: { uid: 'user123' }
      });

      expect(error.message).toBe('Test error message');
      expect(error.code).toBe('TEST001');
      expect(error.category).toBe('AUTH');
      expect(error.route).toBe('/test-route');
      expect(error.user.uid).toBe('user123');
      expect(error.severity).toBe('error'); // default for AUTH category
      expect(error.retryable).toBe(false); // AUTH errors are not retryable
    });

    it('should auto-categorize errors based on message', () => {
      const timeoutError = new SSRError('Request timeout occurred');
      expect(timeoutError.category).toBe('TIMEOUT');

      const authError = new SSRError('Authentication failed');
      expect(authError.category).toBe('AUTH');

      const firebaseError = new SSRError('Firebase database error');
      expect(firebaseError.category).toBe('DATA_FETCH');

      const renderError = new SSRError('Component render failed');
      expect(renderError.category).toBe('RENDER');
    });

    it('should analyze stack trace correctly', () => {
      const error = new SSRError('Test error with stack');
      const analysis = error.stackAnalysis;

      expect(analysis).toBeDefined();
      expect(analysis.functions).toBeDefined();
      expect(analysis.sourceFiles).toBeDefined();
      expect(analysis.lineNumbers).toBeDefined();
    });

    it('should convert to JSON properly', () => {
      const error = new SSRError('Serialization test', {
        code: 'SERIAL001',
        route: '/test',
        user: { uid: 'user123', email: 'test@example.com' }
      });

      const json = error.toJSON();

      expect(json.message).toBe('Serialization test');
      expect(json.code).toBe('SERIAL001');
      expect(json.route).toBe('/test');
      expect(json.user.id).toContain('user123...');
      expect(json.user.authenticated).toBe(true);
      expect(json.timestamp).toBeDefined();
    });
  });

  describe('Error Categorization', () => {
    const testCases = [
      { message: 'Connection timeout', expectedCategory: 'TIMEOUT' },
      { message: 'Unauthorized access', expectedCategory: 'AUTH' },
      { message: 'Firebase query failed', expectedCategory: 'DATA_FETCH' },
      { message: 'React component error', expectedCategory: 'RENDER' },
      { message: 'Cache invalidation failed', expectedCategory: 'CACHE' },
      { message: 'Network connection reset', expectedCategory: 'NETWORK' },
      { message: 'Invalid input format', expectedCategory: 'VALIDATION' },
      { message: 'Memory limit exceeded', expectedCategory: 'SYSTEM' },
      { message: 'Unknown error type', expectedCategory: 'UNKNOWN' }
    ];

    testCases.forEach(({ message, expectedCategory }) => {
      it(`should categorize "${message}" as ${expectedCategory}`, () => {
        const error = new SSRError(message);
        expect(error.category).toBe(expectedCategory);
      });
    });
  });

  describe('Fallback Strategies', () => {
    let mockReq, mockRes;

    beforeEach(() => {
      mockReq = {
        path: '/test-route',
        user: { uid: 'user123' },
        get: vi.fn().mockReturnValue('Test User Agent'),
        ip: '192.168.1.1',
        originalUrl: '/test-route?param=value'
      };

      mockRes = {
        status: vi.fn().mockReturnThis(),
        set: vi.fn().mockReturnThis(),
        send: vi.fn().mockReturnThis(),
        headersSent: false
      };
    });

    it('should handle CSR fallback strategy', async () => {
      const error = new SSRError('Test timeout', {
        code: 'TIMEOUT001',
        category: 'TIMEOUT'
      });

      const result = await handleSSRError(error, mockReq, mockRes);

      expect(result.type).toBe('csr_fallback');
      expect(result.success).toBe(true);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.set).toHaveBeenCalledWith('X-SSR-Fallback', 'CSR');
    });

    it('should handle auth redirect strategy', async () => {
      const error = new SSRError('Authentication required', {
        code: 'AUTH001',
        category: 'AUTH'
      });

      const result = await handleSSRError(error, mockReq, mockRes);

      expect(result.type).toBe('login_redirect');
      expect(mockRes.status).toHaveBeenCalledWith(302);
      expect(mockRes.set).toHaveBeenCalledWith('Location', expect.stringContaining('/combustibles/'));
    });

    it('should handle error page strategy', async () => {
      const error = new SSRError('Validation failed', {
        code: 'VAL001',
        category: 'VALIDATION'
      });

      const result = await handleSSRError(error, mockReq, mockRes);

      expect(result.type).toBe('error_page');
      expect(result.success).toBe(false);
      expect(mockRes.status).toHaveBeenCalledWith(500);
    });

    it('should handle maintenance mode strategy', async () => {
      const error = new SSRError('System overload', {
        code: 'SYS001',
        category: 'SYSTEM'
      });

      const result = await handleSSRError(error, mockReq, mockRes);

      expect(result.type).toBe('maintenance_mode');
      expect(result.success).toBe(false);
      expect(mockRes.status).toHaveBeenCalledWith(503);
      expect(mockRes.set).toHaveBeenCalledWith('Retry-After', '300');
    });
  });

  describe('Retry Logic', () => {
    let mockReq, mockRes;

    beforeEach(() => {
      mockReq = {
        path: '/test-route',
        user: { uid: 'user123' },
        get: vi.fn().mockReturnValue('Test User Agent'),
        ip: '192.168.1.1'
      };

      mockRes = {
        status: vi.fn().mockReturnThis(),
        set: vi.fn().mockReturnThis(),
        send: vi.fn().mockReturnThis(),
        headersSent: false
      };
    });

    it('should retry retryable errors', async () => {
      const error = new SSRError('Network timeout', {
        code: 'NET001',
        category: 'NETWORK' // NETWORK errors are retryable
      });

      // Mock the retry to not actually wait
      vi.spyOn(global, 'setTimeout').mockImplementation((callback) => {
        callback();
        return 1;
      });

      const result = await handleSSRError(error, mockReq, mockRes, {
        attemptCount: 0
      });

      // Should fallback after retry attempts
      expect(result.type).toBe('csr_fallback');
    });

    it('should not retry non-retryable errors', async () => {
      const error = new SSRError('Authentication failed', {
        code: 'AUTH001',
        category: 'AUTH' // AUTH errors are not retryable
      });

      const result = await handleSSRError(error, mockReq, mockRes);

      expect(result.type).toBe('login_redirect');
      // Should not attempt retry
    });
  });

  describe('Error Statistics', () => {
    it('should track error metrics', async () => {
      const mockReq = {
        path: '/test-route',
        user: { uid: 'user123' },
        get: vi.fn().mockReturnValue('Test User Agent'),
        ip: '192.168.1.1'
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        set: vi.fn().mockReturnThis(),
        send: vi.fn().mockReturnThis(),
        headersSent: false
      };

      // Generate some errors
      const error1 = new SSRError('Timeout 1', { code: 'TIMEOUT001', category: 'TIMEOUT' });
      const error2 = new SSRError('Auth error', { code: 'AUTH001', category: 'AUTH' });
      const error3 = new SSRError('Timeout 2', { code: 'TIMEOUT002', category: 'TIMEOUT' });

      await handleSSRError(error1, mockReq, mockRes);
      await handleSSRError(error2, mockReq, mockRes);
      await handleSSRError(error3, mockReq, mockRes);

      const stats = getErrorStatistics();

      expect(stats.totalErrors).toBe(3);
      expect(stats.byCategory.TIMEOUT).toBe(2);
      expect(stats.byCategory.AUTH).toBe(1);
      expect(stats.bySeverity.warning).toBe(2); // TIMEOUT severity
      expect(stats.bySeverity.error).toBe(1); // AUTH severity
    });

    it('should filter errors by time window', () => {
      // Clear and wait a bit to test time filtering
      clearErrorMetrics();
      
      const recentStats = getErrorStatistics(1000); // 1 second window
      expect(recentStats.totalErrors).toBe(0);
    });
  });

  describe('Error Pattern Detection', () => {
    it('should detect error patterns for alerting', async () => {
      const mockReq = {
        path: '/test-route',
        user: { uid: 'user123' },
        get: vi.fn().mockReturnValue('Test User Agent'),
        ip: '192.168.1.1'
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        set: vi.fn().mockReturnThis(),
        send: vi.fn().mockReturnThis(),
        headersSent: false
      };

      // Simulate pattern of similar errors
      const errors = Array.from({ length: 6 }, (_, i) => 
        new SSRError(`Pattern error ${i}`, {
          code: 'PATTERN001',
          category: 'TIMEOUT'
        })
      );

      // Generate errors quickly to trigger pattern detection
      for (const error of errors) {
        await handleSSRError(error, mockReq, mockRes);
      }

      const stats = getErrorStatistics();
      expect(stats.patterns.length).toBeGreaterThan(0);
      
      // Check if pattern was detected (would trigger alert in real scenario)
      const timeoutPattern = stats.patterns.find(p => p.key.includes('TIMEOUT'));
      expect(timeoutPattern).toBeDefined();
      expect(timeoutPattern.count).toBeGreaterThanOrEqual(6);
    });
  });

  describe('HTML Generation', () => {
    it('should generate valid CSR fallback HTML', async () => {
      const error = new SSRError('Test error');
      const mockReq = {
        path: '/test-route',
        user: null,
        get: vi.fn().mockReturnValue('Test User Agent'),
        ip: '192.168.1.1'
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        set: vi.fn().mockReturnThis(),
        send: vi.fn().mockImplementation((html) => {
          // Verify HTML structure
          expect(html).toContain('<!DOCTYPE html>');
          expect(html).toContain('<title>Forestech - Cargando...</title>');
          expect(html).toContain('spinner');
          expect(html).toContain('window.location.href');
        }),
        headersSent: false
      };

      await handleSSRError(error, mockReq, mockRes);
      
      expect(mockRes.send).toHaveBeenCalled();
    });

    it('should generate error page HTML', async () => {
      const error = new SSRError('Validation error', {
        category: 'VALIDATION'
      });
      
      const mockReq = {
        path: '/test-route',
        user: null,
        get: vi.fn().mockReturnValue('Test User Agent'),
        ip: '192.168.1.1'
      };

      const mockRes = {
        status: vi.fn().mockReturnThis(),
        set: vi.fn().mockReturnThis(),
        send: vi.fn().mockImplementation((html) => {
          expect(html).toContain('Algo salió mal');
          expect(html).toContain('Intentar de nuevo');
          expect(html).toContain(error.code);
        }),
        headersSent: false
      };

      await handleSSRError(error, mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalled();
    });
  });

  describe('Error Codes', () => {
    it('should use predefined error codes correctly', () => {
      const timeoutError = new SSRError('SSR rendering timeout', {
        code: 'SSR001'
      });
      
      expect(timeoutError.category).toBe('TIMEOUT');
      expect(timeoutError.code).toBe('SSR001');
    });

    it('should assign default codes when not provided', () => {
      const error = new SSRError('Generic error message');
      
      expect(error.code).toBe('UNKNOWN');
    });
  });
});

// Tests de integración
describe('Error Handler Integration', () => {
  it('should handle complete error flow end-to-end', async () => {
    const mockReq = {
      path: '/combustibles/dashboard',
      user: { uid: 'user123', email: 'test@example.com' },
      get: vi.fn().mockReturnValue('Mozilla/5.0 Test Browser'),
      ip: '192.168.1.100',
      originalUrl: '/combustibles/dashboard?filter=active'
    };

    const mockRes = {
      status: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
      headersSent: false
    };

    // Simulate a real-world error scenario
    const error = new SSRError('Firebase connection timeout during data fetch', {
      code: 'DATA001',
      category: 'DATA_FETCH',
      route: mockReq.path,
      user: mockReq.user,
      context: {
        operation: 'fetchDashboardData',
        duration: 1500,
        retryCount: 2
      }
    });

    const result = await handleSSRError(error, mockReq, mockRes);

    // Verify the complete flow
    expect(result).toBeDefined();
    expect(result.type).toMatch(/csr_fallback|cached_data/);
    expect(mockRes.status).toHaveBeenCalled();
    expect(mockRes.set).toHaveBeenCalled();
    expect(mockRes.send).toHaveBeenCalled();

    // Verify metrics were recorded
    const stats = getErrorStatistics();
    expect(stats.totalErrors).toBeGreaterThan(0);
    expect(stats.byCategory.DATA_FETCH).toBeGreaterThan(0);
  });
});
