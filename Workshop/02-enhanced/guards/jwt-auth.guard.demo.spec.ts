import { JwtAuthGuard } from "./jwt-auth.guard";
import { ExecutionContext, UnauthorizedException } from "@nestjs/common";

describe("JwtAuthGuard - Simple Demo", () => {
  let guard: JwtAuthGuard;

  beforeEach(() => {
    guard = new JwtAuthGuard();
  });

  const createMockContext = (authHeader?: string): ExecutionContext => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { authorization: authHeader },
          user: undefined,
        }),
      }),
    } as ExecutionContext;
  };

  it("should allow access with valid token", () => {
    const context = createMockContext("Bearer demo-valid-token");
    const result = guard.canActivate(context);
    expect(result).toBe(true);
  });

  it("should reject request without token", () => {
    const context = createMockContext();
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it("should reject invalid token", () => {
    const context = createMockContext("Bearer invalid-token");
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it("should attach user to request", () => {
    const mockRequest: any = {
      headers: { authorization: "Bearer demo-valid-token" },
      user: undefined,
    };
    const context = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as ExecutionContext;

    guard.canActivate(context);
    expect(mockRequest.user).toBeDefined();
    expect(mockRequest.user?.id).toBe("user-123");
  });
});
