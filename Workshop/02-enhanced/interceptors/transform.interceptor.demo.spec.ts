import { TransformInterceptor } from "./transform.interceptor";
import { ExecutionContext, CallHandler } from "@nestjs/common";
import { of } from "rxjs";

describe("TransformInterceptor - Simple Demo", () => {
  let interceptor: TransformInterceptor;

  beforeEach(() => {
    interceptor = new TransformInterceptor();
  });

  const createMockContext = (): ExecutionContext => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({}),
      }),
    } as ExecutionContext;
  };

  const createMockHandler = (data: any): CallHandler => {
    return {
      handle: () => of(data),
    } as CallHandler;
  };

  it("should wrap response in standard format", (done) => {
    const context = createMockContext();
    const testData = { id: 1, name: "Test" };
    const handler = createMockHandler(testData);

    interceptor.intercept(context, handler).subscribe((result) => {
      expect(result.success).toBe(true);
      expect(result.data).toEqual(testData);
      expect(result.timestamp).toBeDefined();
      done();
    });
  });

  it("should include timestamp", (done) => {
    const context = createMockContext();
    const handler = createMockHandler({ id: 1 });

    interceptor.intercept(context, handler).subscribe((result) => {
      expect(result.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      done();
    });
  });
});

