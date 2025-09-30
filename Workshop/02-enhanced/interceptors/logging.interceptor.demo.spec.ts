import { LoggingInterceptor } from "./logging.interceptor";
import { ExecutionContext, CallHandler } from "@nestjs/common";
import { of } from "rxjs";

describe("LoggingInterceptor - Simple Demo", () => {
  let interceptor: LoggingInterceptor;

  beforeEach(() => {
    interceptor = new LoggingInterceptor();
  });

  const createMockContext = (): ExecutionContext => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          method: "GET",
          url: "/api/users",
        }),
      }),
    } as ExecutionContext;
  };

  const createMockHandler = (data: any): CallHandler => {
    return {
      handle: () => of(data),
    } as CallHandler;
  };

  it("should log request and response", (done) => {
    const context = createMockContext();
    const handler = createMockHandler({ id: 1 });

    interceptor.intercept(context, handler).subscribe(() => {
      done();
    });
  });

  it("should pass through response data", (done) => {
    const context = createMockContext();
    const testData = { id: 1, name: "Test" };
    const handler = createMockHandler(testData);

    interceptor.intercept(context, handler).subscribe((result) => {
      expect(result).toEqual(testData);
      done();
    });
  });
});

