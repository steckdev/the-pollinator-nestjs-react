import { ExecutionContext } from "@nestjs/common";

const userDecoratorFactory = (
  data: string | undefined,
  ctx: ExecutionContext
) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;

  if (!user) {
    return {
      id: "demo-user-123",
      email: "demo@example.com",
      name: "Demo User",
    };
  }

  return data ? user[data] : user;
};

describe("@User() Decorator - Simple Demo", () => {
  const createMockContext = (user?: any): ExecutionContext => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
    } as ExecutionContext;
  };

  it("should return full user object", () => {
    const mockUser = { id: "123", email: "test@example.com", name: "Test" };
    const context = createMockContext(mockUser);
    const result = userDecoratorFactory(undefined, context);
    expect(result).toEqual(mockUser);
  });

  it("should extract specific property", () => {
    const mockUser = { id: "123", email: "test@example.com", name: "Test" };
    const context = createMockContext(mockUser);
    const result = userDecoratorFactory("id", context);
    expect(result).toBe("123");
  });

  it("should return demo user when no user attached", () => {
    const context = createMockContext();
    const result = userDecoratorFactory(undefined, context);
    expect(result.id).toBe("demo-user-123");
    expect(result.email).toBe("demo@example.com");
  });
});
