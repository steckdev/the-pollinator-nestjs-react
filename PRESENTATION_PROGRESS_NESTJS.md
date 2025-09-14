## Live Coding Plan (40 min)

### Objectives
- Demonstrate NestJS core patterns: Guards, Interceptors, Pipes, Decorators, DI
- Show incremental hardening using the existing Pollinator API
- Keep code focused, testable, and extensible

### What We Will Improve
- Request validation (Pipes)
- Authentication/authorization (Guards)
- Logging/metrics/transform (Interceptors)
- Developer ergonomics (custom Decorators)
- Provider composition (DI + useFactory)

### Timeline (Minute-by-minute)
1–3: Frame the current state (AppModule, UsersModule, WeatherModule, main.ts)
4–8: Add global ValidationPipe and DTO annotations
9–14: Add JwtAuthGuard (demo guard) on users and weather endpoints; show DI-friendly shape
15–20: Add LoggingInterceptor + ResponseTransformInterceptor; highlight testability
21–26: Add CacheInterceptor on weather GET; use CacheKey/CacheTTL
27–31: Add @User() param decorator; simplify controller signatures
32–36: Refactor weather provider factory to DI-based useFactory
37–40: Recap, questions, next steps to product/platform stages

### Key Concepts to Showcase
- Guards: JwtAuthGuard, RolesGuard; replace express rate limiter with RateLimitGuard example if time permits
- Interceptors: LoggingInterceptor (latency), TransformInterceptor (standard response envelope), CacheInterceptor (per-route)
- Pipes: ValidationPipe (global), ParseUUIDPipe/ParseIntPipe as examples
- Decorators: @User() from request; optional @Roles()
- DI Patterns: useFactory with injected ConfigService/HttpService; replace direct construction

### What The Current Code Already Solves
- Module boundaries and DI make adding cross-cutting concerns trivial
- Abstract provider pattern (weather) primes the system for fallbacks and testing
- Global infra (CacheModule, HttpModule, Swagger, helmet, CORS) centralizes concerns

### Extensibility Design
- Feature modules are additive; no edits to unrelated modules
- DI contracts (tokens/abstracts) allow swapping implementations
- Controller surfaces remain thin; business logic isolated in services

### Demo Checklist (Code Touchpoints)
- main.ts: add global pipes/interceptors
- app.module.ts: wire providers via useFactory
- modules/users/users.controller.ts: @UseGuards, DTO validation
- modules/weather/weather.controller.ts: @UseGuards, @CacheKey/@CacheTTL
- guard: JwtAuthGuard (demo); optional RateLimitGuard
- interceptor: LoggingInterceptor, TransformInterceptor
- decorator: @User()
- dto: add class-validator decorators to CreateUserDto

### Stretch (If Time)
- Exception filter for consistent error shape
- Simple role guard and @Roles() decorator
- Health check endpoint with Terminus

### Success Criteria
- Requests validated; unauthorized blocked; logs show timing; weather results cached; controllers simplified with @User

