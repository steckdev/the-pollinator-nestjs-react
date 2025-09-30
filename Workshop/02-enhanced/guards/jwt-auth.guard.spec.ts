import {
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from "@nestjs/common";
import { JwtAuthGuard } from "./jwt-auth.guard";

interface UserEntity {
  id: string;
  email: string;
  name: string;
}

const createMockExecutionContext = (
  headers: Record<string, string> = {}
): ExecutionContext => {
  const mockRequest: { headers: Record<string, string>; user?: UserEntity } = {
    headers,
    user: undefined,
  };

  return {
    switchToHttp: () => ({
      getRequest: () => mockRequest,
      getResponse: jest.fn(),
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

describe("JwtAuthGuard", () => {
  let guard: JwtAuthGuard;
  let loggerSpy: jest.SpyInstance;

  beforeEach(() => {
    guard = new JwtAuthGuard();
    loggerSpy = jest.spyOn(Logger.prototype, "warn").mockImplementation();
    jest.spyOn(Logger.prototype, "debug").mockImplementation();
    jest.spyOn(Logger.prototype, "error").mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Token Extraction", () => {
    it("should extract token from Bearer authorization header", async () => {
      const context = createMockExecutionContext({
        authorization: "Bearer demo-valid-token",
      });

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
    });

    it("should throw UnauthorizedException when no authorization header", async () => {
      const context = createMockExecutionContext({});

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException
      );
      await expect(guard.canActivate(context)).rejects.toThrow(
        "Access token is required"
      );
    });

    it("should throw UnauthorizedException when authorization header is empty", async () => {
      const context = createMockExecutionContext({
        authorization: "",
      });

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException
      );
    });

    it("should reject non-Bearer token types", async () => {
      const context = createMockExecutionContext({
        authorization: "Basic demo-valid-token",
      });

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException
      );
    });

    it("should handle malformed authorization header", async () => {
      const context = createMockExecutionContext({
        authorization: "InvalidFormat",
      });

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException
      );
    });
  });

  describe("Token Validation", () => {
    it("should validate correct demo token", async () => {
      const context = createMockExecutionContext({
        authorization: "Bearer demo-valid-token",
      });

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
    });

    it("should reject invalid token", async () => {
      const context = createMockExecutionContext({
        authorization: "Bearer invalid-token",
      });

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException
      );
      await expect(guard.canActivate(context)).rejects.toThrow(
        "Invalid or expired token"
      );
    });

    it("should reject expired token format", async () => {
      const context = createMockExecutionContext({
        authorization: "Bearer expired-token",
      });

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException
      );
    });
  });

  describe("User Attachment", () => {
    it("should attach user to request on successful validation", async () => {
      const mockRequest = {
        headers: { authorization: "Bearer demo-valid-token" },
        user: undefined,
      };

      const context = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
          getResponse: jest.fn(),
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

      await guard.canActivate(context);

      expect(mockRequest.user).toBeDefined();
      expect(mockRequest.user).toHaveProperty("id");
      expect(mockRequest.user).toHaveProperty("email");
      expect(mockRequest.user).toHaveProperty("name");
    });

    it("should attach correct user data from token payload", async () => {
      const mockRequest: {
        headers: Record<string, string>;
        user?: UserEntity;
      } = {
        headers: { authorization: "Bearer demo-valid-token" },
        user: undefined,
      };

      const context = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
          getResponse: jest.fn(),
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

      await guard.canActivate(context);

      expect(mockRequest.user).toBeDefined();
      expect(mockRequest.user!.id).toBe("user-123");
      expect(mockRequest.user!.email).toBe("demo@example.com");
      expect(mockRequest.user!.name).toBe("Demo User");
    });
  });

  describe("Logging", () => {
    it("should log warning when no token found", async () => {
      const context = createMockExecutionContext({});

      try {
        await guard.canActivate(context);
      } catch (error) {
        expect(loggerSpy).toHaveBeenCalledWith("No JWT token found in request");
      }
    });

    it("should log debug message on successful authentication", async () => {
      const debugSpy = jest.spyOn(Logger.prototype, "debug");
      const context = createMockExecutionContext({
        authorization: "Bearer demo-valid-token",
      });

      await guard.canActivate(context);

      expect(debugSpy).toHaveBeenCalledWith(
        "User demo@example.com authenticated successfully"
      );
    });

    it("should log error on validation failure", async () => {
      const errorSpy = jest.spyOn(Logger.prototype, "error");
      const context = createMockExecutionContext({
        authorization: "Bearer invalid-token",
      });

      try {
        await guard.canActivate(context);
      } catch (error) {
        expect(errorSpy).toHaveBeenCalledWith(
          "JWT validation failed",
          expect.any(String)
        );
      }
    });
  });

  describe("Functional Programming Principles", () => {
    it("should be idempotent - multiple calls with same token produce same result", async () => {
      const context1 = createMockExecutionContext({
        authorization: "Bearer demo-valid-token",
      });
      const context2 = createMockExecutionContext({
        authorization: "Bearer demo-valid-token",
      });

      const result1 = await guard.canActivate(context1);
      const result2 = await guard.canActivate(context2);

      expect(result1).toBe(result2);
      expect(result1).toBe(true);
    });

    it("should not mutate input context", async () => {
      const headers = { authorization: "Bearer demo-valid-token" };
      const originalHeaders = { ...headers };
      const context = createMockExecutionContext(headers);

      await guard.canActivate(context);

      expect(headers).toEqual(originalHeaders);
    });

    it("should handle concurrent validation requests independently", async () => {
      const context1 = createMockExecutionContext({
        authorization: "Bearer demo-valid-token",
      });
      const context2 = createMockExecutionContext({
        authorization: "Bearer invalid-token",
      });

      const [result1, result2] = await Promise.allSettled([
        guard.canActivate(context1),
        guard.canActivate(context2),
      ]);

      expect(result1.status).toBe("fulfilled");
      expect(result2.status).toBe("rejected");
    });
  });

  describe("Edge Cases", () => {
    it("should handle authorization header with extra spaces", async () => {
      const context = createMockExecutionContext({
        authorization: "  Bearer   demo-valid-token  ",
      });

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException
      );
    });

    it("should handle case-sensitive Bearer keyword", async () => {
      const context = createMockExecutionContext({
        authorization: "bearer demo-valid-token",
      });

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException
      );
    });

    it("should handle empty token after Bearer", async () => {
      const context = createMockExecutionContext({
        authorization: "Bearer ",
      });

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException
      );
    });
  });
});
