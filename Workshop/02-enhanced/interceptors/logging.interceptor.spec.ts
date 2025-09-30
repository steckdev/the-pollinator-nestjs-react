import { ExecutionContext, CallHandler, Logger } from "@nestjs/common";
import { of, throwError } from "rxjs";
import { LoggingInterceptor } from "./logging.interceptor";

const createMockExecutionContext = (
  method: string = "GET",
  url: string = "/test",
  ip: string = "127.0.0.1",
  userAgent: string = "test-agent"
): ExecutionContext => {
  const mockRequest = {
    method,
    url,
    ip,
    get: (header: string) => (header === "User-Agent" ? userAgent : undefined),
  };

  const mockResponse = {
    statusCode: 200,
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

const createMockCallHandler = (
  data: any = { result: "success" }
): CallHandler => ({
  handle: () => of(data),
});

const createMockErrorCallHandler = (error: any): CallHandler => ({
  handle: () => throwError(() => error),
});

describe("LoggingInterceptor", () => {
  let interceptor: LoggingInterceptor;
  let logSpy: jest.SpyInstance;
  let debugSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    interceptor = new LoggingInterceptor();
    logSpy = jest.spyOn(Logger.prototype, "log").mockImplementation();
    debugSpy = jest.spyOn(Logger.prototype, "debug").mockImplementation();
    errorSpy = jest.spyOn(Logger.prototype, "error").mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Request Logging", () => {
    it("should log incoming request with request ID", done => {
      const context = createMockExecutionContext(
        "GET",
        "/api/users",
        "192.168.1.1",
        "Mozilla/5.0"
      );
      const handler = createMockCallHandler();

      interceptor.intercept(context, handler).subscribe(() => {
        expect(logSpy).toHaveBeenCalledWith(
          expect.stringMatching(
            /\[.*\] GET \/api\/users - 192\.168\.1\.1 - Mozilla\/5\.0/
          ),
          "IncomingRequest"
        );
        done();
      });
    });

    it("should generate unique request ID for each request", done => {
      const context1 = createMockExecutionContext();
      const context2 = createMockExecutionContext();
      const handler = createMockCallHandler();

      const requestIds: string[] = [];

      interceptor.intercept(context1, handler).subscribe(() => {
        const call1 = logSpy.mock.calls.find(
          call => call[1] === "IncomingRequest"
        );
        const requestId1 = call1[0].match(/\[(.*?)\]/)[1];
        requestIds.push(requestId1);

        interceptor.intercept(context2, handler).subscribe(() => {
          const call2 = logSpy.mock.calls.find(
            (call, idx) => call[1] === "IncomingRequest" && idx > 0
          );
          const requestId2 = call2[0].match(/\[(.*?)\]/)[1];
          requestIds.push(requestId2);

          expect(requestIds[0]).not.toBe(requestIds[1]);
          done();
        });
      });
    });

    it("should attach request ID to request object", done => {
      const mockRequest: {
        method: string;
        url: string;
        ip: string;
        get: () => string;
        requestId?: string;
      } = {
        method: "GET",
        url: "/test",
        ip: "127.0.0.1",
        get: () => "test-agent",
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

      const handler = createMockCallHandler();

      interceptor.intercept(context, handler).subscribe(() => {
        expect(mockRequest.requestId).toBeDefined();
        expect(typeof mockRequest.requestId).toBe("string");
        done();
      });
    });

    it("should handle missing User-Agent header", done => {
      const mockRequest = {
        method: "GET",
        url: "/test",
        ip: "127.0.0.1",
        get: () => undefined,
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

      const handler = createMockCallHandler();

      interceptor.intercept(context, handler).subscribe(() => {
        expect(logSpy).toHaveBeenCalledWith(
          expect.stringMatching(/\[.*\] GET \/test - 127\.0\.0\.1 - $/),
          "IncomingRequest"
        );
        done();
      });
    });
  });

  describe("Response Logging", () => {
    it("should log successful response with duration", done => {
      const context = createMockExecutionContext("POST", "/api/users");
      const handler = createMockCallHandler();

      interceptor.intercept(context, handler).subscribe(() => {
        expect(logSpy).toHaveBeenCalledWith(
          expect.stringMatching(/\[.*\] POST \/api\/users 200 - \d+ms/),
          "RequestCompleted"
        );
        done();
      });
    });

    it("should log response size for object responses", done => {
      const context = createMockExecutionContext();
      const responseData = { id: 1, name: "Test", email: "test@example.com" };
      const handler = createMockCallHandler(responseData);

      interceptor.intercept(context, handler).subscribe(() => {
        expect(debugSpy).toHaveBeenCalledWith(
          expect.stringMatching(/\[.*\] Response size: \d+ bytes/),
          "ResponseMetrics"
        );
        done();
      });
    });

    it("should not log response size for non-object responses", done => {
      const context = createMockExecutionContext();
      const handler = createMockCallHandler("string response");

      interceptor.intercept(context, handler).subscribe(() => {
        const responseSizeCalls = debugSpy.mock.calls.filter(call =>
          call[0].includes("Response size")
        );
        expect(responseSizeCalls.length).toBe(0);
        done();
      });
    });

    it("should measure accurate response time", done => {
      const context = createMockExecutionContext();
      const handler = createMockCallHandler();

      const startTime = Date.now();

      interceptor.intercept(context, handler).subscribe(() => {
        const endTime = Date.now();
        const actualDuration = endTime - startTime;

        const completedCall = logSpy.mock.calls.find(
          call => call[1] === "RequestCompleted"
        );
        const loggedDuration = parseInt(completedCall[0].match(/(\d+)ms/)[1]);

        expect(loggedDuration).toBeGreaterThanOrEqual(0);
        expect(loggedDuration).toBeLessThanOrEqual(actualDuration + 10);
        done();
      });
    });
  });

  describe("Error Logging", () => {
    it("should log error response with status code", done => {
      const context = createMockExecutionContext("GET", "/api/users");
      const error = { status: 404, message: "Not Found", stack: "Error stack" };
      const handler = createMockErrorCallHandler(error);

      interceptor.intercept(context, handler).subscribe({
        error: () => {
          expect(errorSpy).toHaveBeenCalledWith(
            expect.stringMatching(
              /\[.*\] GET \/api\/users 404 - \d+ms - Not Found/
            ),
            "Error stack",
            "RequestError"
          );
          done();
        },
      });
    });

    it("should default to 500 status code for errors without status", done => {
      const context = createMockExecutionContext();
      const error = { message: "Internal Error", stack: "Error stack" };
      const handler = createMockErrorCallHandler(error);

      interceptor.intercept(context, handler).subscribe({
        error: () => {
          expect(errorSpy).toHaveBeenCalledWith(
            expect.stringMatching(/500 - \d+ms/),
            "Error stack",
            "RequestError"
          );
          done();
        },
      });
    });

    it("should propagate error after logging", done => {
      const context = createMockExecutionContext();
      const error = new Error("Test error");
      const handler = createMockErrorCallHandler(error);

      interceptor.intercept(context, handler).subscribe({
        error: err => {
          expect(err).toBe(error);
          done();
        },
      });
    });
  });

  describe("Functional Programming Principles", () => {
    it("should not mutate request object except for requestId", done => {
      const mockRequest: {
        method: string;
        url: string;
        ip: string;
        get: () => string;
        requestId?: string;
      } = {
        method: "GET",
        url: "/test",
        ip: "127.0.0.1",
        get: () => "test-agent",
      };

      const originalKeys = Object.keys(mockRequest);

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

      const handler = createMockCallHandler();

      interceptor.intercept(context, handler).subscribe(() => {
        const newKeys = Object.keys(mockRequest).filter(
          key => !originalKeys.includes(key)
        );
        expect(newKeys).toEqual(["requestId"]);
        done();
      });
    });

    it("should handle multiple concurrent requests independently", done => {
      const context1 = createMockExecutionContext("GET", "/api/users");
      const context2 = createMockExecutionContext("POST", "/api/posts");
      const handler1 = createMockCallHandler({ users: [] });
      const handler2 = createMockCallHandler({ posts: [] });

      let completed = 0;

      interceptor.intercept(context1, handler1).subscribe(() => {
        completed++;
        if (completed === 2) done();
      });

      interceptor.intercept(context2, handler2).subscribe(() => {
        completed++;
        if (completed === 2) done();
      });
    });
  });
});
