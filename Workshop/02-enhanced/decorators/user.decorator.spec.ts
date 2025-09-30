import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import {
  userDecoratorFactory,
  userIdDecoratorFactory,
  userEmailDecoratorFactory,
} from "./user.decorator";

interface UserEntity {
  id: string;
  email: string;
  name: string;
}

const createMockExecutionContext = (user?: UserEntity): ExecutionContext => {
  const mockRequest = {
    user,
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

const callDecorator = (
  factory: (data: any, ctx: ExecutionContext) => any,
  data: any,
  context: ExecutionContext
) => {
  return factory(data, context);
};

describe("User Decorator", () => {
  const mockUser: UserEntity = {
    id: "user-123",
    email: "test@example.com",
    name: "Test User",
  };

  describe("Basic Usage", () => {
    it("should return full user object when no parameters provided", () => {
      const context = createMockExecutionContext(mockUser);
      const result = callDecorator(userDecoratorFactory, undefined, context);

      expect(result).toEqual(mockUser);
    });

    it("should return demo user when no user attached to request", () => {
      const context = createMockExecutionContext();
      const result = callDecorator(userDecoratorFactory, undefined, context);

      expect(result).toEqual({
        id: "demo-user-123",
        email: "demo@example.com",
        name: "Demo User",
      });
    });
  });

  describe("Property Extraction", () => {
    it("should extract user id when string parameter provided", () => {
      const context = createMockExecutionContext(mockUser);
      const result = callDecorator(userDecoratorFactory, "id", context);

      expect(result).toBe("user-123");
    });

    it("should extract user email when string parameter provided", () => {
      const context = createMockExecutionContext(mockUser);
      const result = callDecorator(userDecoratorFactory, "email", context);

      expect(result).toBe("test@example.com");
    });

    it("should extract user name when string parameter provided", () => {
      const context = createMockExecutionContext(mockUser);
      const result = callDecorator(userDecoratorFactory, "name", context);

      expect(result).toBe("Test User");
    });

    it("should throw UnauthorizedException when extracting property from missing user", () => {
      const context = createMockExecutionContext();

      expect(() => callDecorator(userDecoratorFactory, "id", context)).toThrow(
        UnauthorizedException
      );
      expect(() => callDecorator(userDecoratorFactory, "id", context)).toThrow(
        "User not found in request"
      );
    });
  });

  describe("Options Object", () => {
    it("should extract property using options object", () => {
      const context = createMockExecutionContext(mockUser);
      // Using callDecorator helper
      const result = callDecorator(
        userDecoratorFactory,
        { property: "email" },
        context
      );

      expect(result).toBe("test@example.com");
    });

    it("should return null when required is false and user missing", () => {
      const context = createMockExecutionContext();
      // Using callDecorator helper
      const result = callDecorator(
        userDecoratorFactory,
        { required: false },
        context
      );

      expect(result).toBeNull();
    });

    it("should return null when property required is false and user missing", () => {
      const context = createMockExecutionContext();
      const result = callDecorator(
        userDecoratorFactory,
        { property: "email", required: false },
        context
      );

      expect(result).toBeNull();
    });

    it("should throw when property required and user missing", () => {
      const context = createMockExecutionContext();
      // Using callDecorator helper

      expect(() =>
        callDecorator(
          userDecoratorFactory,
          { property: "email", required: true },
          context
        )
      ).toThrow(UnauthorizedException);
    });
  });

  describe("Edge Cases", () => {
    it("should handle null user gracefully with required false", () => {
      const context = createMockExecutionContext(undefined);
      // Using callDecorator helper
      const result = callDecorator(
        userDecoratorFactory,
        { required: false },
        context
      );

      expect(result).toBeNull();
    });

    it("should throw when required property is undefined", () => {
      const userWithMissingProperty = {
        id: "user-123",
        email: undefined as any,
        name: "Test User",
      };
      const context = createMockExecutionContext(userWithMissingProperty);
      // Using callDecorator helper

      expect(() =>
        callDecorator(userDecoratorFactory, "email", context)
      ).toThrow(UnauthorizedException);
      expect(() =>
        callDecorator(userDecoratorFactory, "email", context)
      ).toThrow("User email not available");
    });
  });
});

describe("UserId Decorator", () => {
  const mockUser: UserEntity = {
    id: "user-456",
    email: "test@example.com",
    name: "Test User",
  };

  it("should extract user id from request", () => {
    const context = createMockExecutionContext(mockUser);
    const result = callDecorator(userIdDecoratorFactory, undefined, context);

    expect(result).toBe("user-456");
  });

  it("should return demo user id when no user attached", () => {
    const context = createMockExecutionContext();
    const result = callDecorator(userIdDecoratorFactory, undefined, context);

    expect(result).toBe("demo-user-123");
  });

  it("should handle undefined user gracefully", () => {
    const context = createMockExecutionContext(undefined);
    const result = callDecorator(userIdDecoratorFactory, undefined, context);

    expect(result).toBe("demo-user-123");
  });
});

describe("UserEmail Decorator", () => {
  const mockUser: UserEntity = {
    id: "user-789",
    email: "email@test.com",
    name: "Test User",
  };

  it("should extract user email from request", () => {
    const context = createMockExecutionContext(mockUser);
    const result = callDecorator(userEmailDecoratorFactory, undefined, context);

    expect(result).toBe("email@test.com");
  });

  it("should return demo email when no user attached", () => {
    const context = createMockExecutionContext();
    const result = callDecorator(userEmailDecoratorFactory, undefined, context);

    expect(result).toBe("demo@example.com");
  });

  it("should handle undefined user gracefully", () => {
    const context = createMockExecutionContext(undefined);
    const result = callDecorator(userEmailDecoratorFactory, undefined, context);

    expect(result).toBe("demo@example.com");
  });
});

describe("Functional Programming Principles", () => {
  it("should be pure functions - same input produces same output", () => {
    const mockUser: UserEntity = {
      id: "user-123",
      email: "test@example.com",
      name: "Test User",
    };
    const context = createMockExecutionContext(mockUser);
    // Using callDecorator helper

    const result1 = callDecorator(userDecoratorFactory, "id", context);
    const result2 = callDecorator(userDecoratorFactory, "id", context);

    expect(result1).toBe(result2);
    expect(result1).toBe("user-123");
  });

  it("should not mutate input context", () => {
    const mockUser: UserEntity = {
      id: "user-123",
      email: "test@example.com",
      name: "Test User",
    };
    const context = createMockExecutionContext(mockUser);
    // Using callDecorator helper

    const originalUser = { ...mockUser };
    callDecorator(userDecoratorFactory, "id", context);

    expect(mockUser).toEqual(originalUser);
  });

  it("should compose well with other decorators", () => {
    const mockUser: UserEntity = {
      id: "user-123",
      email: "test@example.com",
      name: "Test User",
    };
    const context = createMockExecutionContext(mockUser);

    const user = callDecorator(userDecoratorFactory, undefined, context);
    const id = callDecorator(userIdDecoratorFactory, undefined, context);
    const email = callDecorator(userEmailDecoratorFactory, undefined, context);

    expect(user.id).toBe(id);
    expect(user.email).toBe(email);
  });
});
