import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException("No token provided");
    }

    const [type, token] = authHeader.split(" ");

    if (type !== "Bearer" || !token) {
      throw new UnauthorizedException("Invalid token format");
    }

    if (token === "demo-valid-token") {
      request.user = {
        id: "user-123",
        email: "demo@example.com",
        name: "Demo User",
      };
      return true;
    }

    throw new UnauthorizedException("Invalid token");
  }
}
