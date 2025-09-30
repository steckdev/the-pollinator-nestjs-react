import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const User = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
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
  }
);
