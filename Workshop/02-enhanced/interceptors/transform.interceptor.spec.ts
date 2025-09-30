import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';
import { TransformInterceptor } from './transform.interceptor';

const createMockExecutionContext = (
  method: string = 'GET',
  url: string = '/api/test',
  statusCode: number = 200
): ExecutionContext => {
  const mockRequest = {
    method,
    url,
    requestId: 'test-request-123',
  };

  const mockResponse = {
    statusCode,
  };

  return {
    switchToHttp: () => ({
      getRequest: () => mockRequest,
      getResponse: () => mockResponse,
      getNext: jest.fn(),
    }),
    getClass: jest.fn(),
    getHandler: jest.fn(),
    getArgs: jest.fn(),
    getArgByIndex: jest.fn(),
    switchToRpc: jest.fn(),
    switchToWs: jest.fn(),
    getType: jest.fn(),
  } as unknown as ExecutionContext;
};

const createMockCallHandler = (data: any): CallHandler => ({
  handle: () => of(data),
});

describe('TransformInterceptor', () => {
  let interceptor: TransformInterceptor<any>;

  beforeEach(() => {
    interceptor = new TransformInterceptor();
  });

  describe('Basic Transformation', () => {
    it('should wrap simple data in standard API response format', done => {
      const context = createMockExecutionContext();
      const testData = { id: 1, name: 'Test' };
      const handler = createMockCallHandler(testData);

      interceptor.intercept(context, handler).subscribe(result => {
        expect(result).toHaveProperty('success', true);
        expect(result).toHaveProperty('data', testData);
        expect(result).toHaveProperty('timestamp');
        expect(result).toHaveProperty('path', '/api/test');
        expect(result).toHaveProperty('requestId', 'test-request-123');
        done();
      });
    });

    it('should include ISO timestamp', done => {
      const context = createMockExecutionContext();
      const handler = createMockCallHandler({ test: 'data' });

      interceptor.intercept(context, handler).subscribe(result => {
        expect(result.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
        expect(() => new Date(result.timestamp)).not.toThrow();
        done();
      });
    });

    it('should include request path from context', done => {
      const context = createMockExecutionContext('GET', '/api/users/123');
      const handler = createMockCallHandler({ user: 'data' });

      interceptor.intercept(context, handler).subscribe(result => {
        expect(result.path).toBe('/api/users/123');
        done();
      });
    });

    it('should include request ID if available', done => {
      const mockRequest = {
        method: 'GET',
        url: '/test',
        requestId: 'custom-request-id',
      };

      const context = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
          getResponse: () => ({ statusCode: 200 }),
          getNext: jest.fn(),
        }),
        getClass: jest.fn(),
        getHandler: jest.fn(),
        getArgs: jest.fn(),
        getArgByIndex: jest.fn(),
        switchToRpc: jest.fn(),
        switchToWs: jest.fn(),
        getType: jest.fn(),
      } as unknown as ExecutionContext;

      const handler = createMockCallHandler({ test: 'data' });

      interceptor.intercept(context, handler).subscribe(result => {
        expect(result.requestId).toBe('custom-request-id');
        done();
      });
    });
  });

  describe('Already Transformed Data', () => {
    it('should not double-wrap already transformed responses', done => {
      const context = createMockExecutionContext();
      const alreadyTransformed = {
        success: true,
        data: { id: 1 },
        timestamp: new Date().toISOString(),
        path: '/api/test',
      };
      const handler = createMockCallHandler(alreadyTransformed);

      interceptor.intercept(context, handler).subscribe(result => {
        expect(result).toEqual(alreadyTransformed);
        expect(result.data).not.toHaveProperty('success');
        done();
      });
    });

    it('should detect transformed response by success and timestamp fields', done => {
      const context = createMockExecutionContext();
      const transformed = {
        success: false,
        timestamp: new Date().toISOString(),
        error: 'Some error',
      };
      const handler = createMockCallHandler(transformed);

      interceptor.intercept(context, handler).subscribe(result => {
        expect(result).toEqual(transformed);
        done();
      });
    });
  });

  describe('Paginated Data', () => {
    it('should handle paginated data with metadata', done => {
      const context = createMockExecutionContext();
      const paginatedData = {
        items: [{ id: 1 }, { id: 2 }, { id: 3 }],
        total: 100,
        page: 1,
        limit: 10,
      };
      const handler = createMockCallHandler(paginatedData);

      interceptor.intercept(context, handler).subscribe(result => {
        expect(result.success).toBe(true);
        expect(result.data).toEqual(paginatedData.items);
        expect(result.meta).toEqual({
          total: 100,
          page: 1,
          limit: 10,
        });
        done();
      });
    });

    it('should extract items array from paginated response', done => {
      const context = createMockExecutionContext();
      const items = [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }];
      const paginatedData = {
        items,
        total: 50,
        page: 2,
        limit: 20,
      };
      const handler = createMockCallHandler(paginatedData);

      interceptor.intercept(context, handler).subscribe(result => {
        expect(result.data).toEqual(items);
        expect(Array.isArray(result.data)).toBe(true);
        done();
      });
    });

    it('should not treat non-paginated data as paginated', done => {
      const context = createMockExecutionContext();
      const nonPaginatedData = {
        items: 'not an array',
        total: 100,
      };
      const handler = createMockCallHandler(nonPaginatedData);

      interceptor.intercept(context, handler).subscribe(result => {
        expect(result.data).toEqual(nonPaginatedData);
        expect(result.meta).toBeUndefined();
        done();
      });
    });
  });

  describe('Success Messages', () => {
    it('should add success message for POST 201 responses', done => {
      const context = createMockExecutionContext('POST', '/api/users', 201);
      const handler = createMockCallHandler({ id: 1, name: 'New User' });

      interceptor.intercept(context, handler).subscribe(result => {
        expect(result.message).toBe('Resource created successfully');
        done();
      });
    });

    it('should add success message for PUT 200 responses', done => {
      const context = createMockExecutionContext('PUT', '/api/users/1', 200);
      const handler = createMockCallHandler({ id: 1, name: 'Updated User' });

      interceptor.intercept(context, handler).subscribe(result => {
        expect(result.message).toBe('Resource updated successfully');
        done();
      });
    });

    it('should add success message for PATCH 200 responses', done => {
      const context = createMockExecutionContext('PATCH', '/api/users/1', 200);
      const handler = createMockCallHandler({ id: 1, name: 'Patched User' });

      interceptor.intercept(context, handler).subscribe(result => {
        expect(result.message).toBe('Resource updated successfully');
        done();
      });
    });

    it('should add success message for DELETE 200 responses', done => {
      const context = createMockExecutionContext('DELETE', '/api/users/1', 200);
      const handler = createMockCallHandler({ deleted: true });

      interceptor.intercept(context, handler).subscribe(result => {
        expect(result.message).toBe('Resource deleted successfully');
        done();
      });
    });

    it('should not add message for GET requests', done => {
      const context = createMockExecutionContext('GET', '/api/users', 200);
      const handler = createMockCallHandler([{ id: 1 }]);

      interceptor.intercept(context, handler).subscribe(result => {
        expect(result.message).toBeUndefined();
        done();
      });
    });

    it('should not add message for POST with non-201 status', done => {
      const context = createMockExecutionContext('POST', '/api/users', 200);
      const handler = createMockCallHandler({ id: 1 });

      interceptor.intercept(context, handler).subscribe(result => {
        expect(result.message).toBeUndefined();
        done();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle null data', done => {
      const context = createMockExecutionContext();
      const handler = createMockCallHandler(null);

      interceptor.intercept(context, handler).subscribe(result => {
        expect(result.success).toBe(true);
        expect(result.data).toBeNull();
        done();
      });
    });

    it('should handle undefined data', done => {
      const context = createMockExecutionContext();
      const handler = createMockCallHandler(undefined);

      interceptor.intercept(context, handler).subscribe(result => {
        expect(result.success).toBe(true);
        expect(result.data).toBeUndefined();
        done();
      });
    });

    it('should handle empty array', done => {
      const context = createMockExecutionContext();
      const handler = createMockCallHandler([]);

      interceptor.intercept(context, handler).subscribe(result => {
        expect(result.success).toBe(true);
        expect(result.data).toEqual([]);
        done();
      });
    });

    it('should handle primitive values', done => {
      const context = createMockExecutionContext();
      const handler = createMockCallHandler('simple string');

      interceptor.intercept(context, handler).subscribe(result => {
        expect(result.success).toBe(true);
        expect(result.data).toBe('simple string');
        done();
      });
    });

    it('should handle missing requestId gracefully', done => {
      const mockRequest = {
        method: 'GET',
        url: '/test',
      };

      const context = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
          getResponse: () => ({ statusCode: 200 }),
          getNext: jest.fn(),
        }),
        getClass: jest.fn(),
        getHandler: jest.fn(),
        getArgs: jest.fn(),
        getArgByIndex: jest.fn(),
        switchToRpc: jest.fn(),
        switchToWs: jest.fn(),
        getType: jest.fn(),
      } as unknown as ExecutionContext;

      const handler = createMockCallHandler({ test: 'data' });

      interceptor.intercept(context, handler).subscribe(result => {
        expect(result.requestId).toBeUndefined();
        done();
      });
    });
  });

  describe('Functional Programming Principles', () => {
    it('should be pure - same input produces same structure', done => {
      const context = createMockExecutionContext();
      const testData = { id: 1, name: 'Test' };
      const handler1 = createMockCallHandler(testData);
      const handler2 = createMockCallHandler(testData);

      interceptor.intercept(context, handler1).subscribe(result1 => {
        interceptor.intercept(context, handler2).subscribe(result2 => {
          expect(result1.success).toBe(result2.success);
          expect(result1.data).toEqual(result2.data);
          expect(result1.path).toBe(result2.path);
          done();
        });
      });
    });

    it('should not mutate original data', done => {
      const context = createMockExecutionContext();
      const originalData = { id: 1, name: 'Test' };
      const dataCopy = { ...originalData };
      const handler = createMockCallHandler(originalData);

      interceptor.intercept(context, handler).subscribe(() => {
        expect(originalData).toEqual(dataCopy);
        done();
      });
    });
  });
});

