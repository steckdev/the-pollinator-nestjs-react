## Current State: The Pollinator NestJS API

### Architecture Overview
- App module composes cross-cutting infra and feature modules
  - ConfigModule (global)
  - CacheModule with Redis (global)
  - HttpModule
  - DatabaseModule (Sequelize provider + User model)
  - UsersModule
  - WeatherModule
- main.ts sets helmet, CORS, global prefix, rate limit, Swagger

### Module Structure
- UsersModule
  - Controller: routes and HTTP concerns only
  - Service: application/business logic
  - Repository: DI token 'USER_REPOSITORY' backed by Sequelize model
  - Entity: sequelize-typescript model with UUID id, timestamps
- WeatherModule
  - Controller: GET by zip
  - Service: delegates to AbstractWeatherProvider
  - Provider abstraction: WeatherstackProvider vs WeatherLocalDataProvider via factory
  - DTOs and interfaces for transport shapes
- DatabaseModule
  - Provides 'SEQUELIZE' connection configured from env; registers models

### What’s Working Well
- Clear separation of concerns per Nest pattern (Controllers/Services/Providers)
- Provider abstraction for external API (weather) with factory selection
- Global caching layer ready (Redis CacheModule)
- Strong DI use with explicit tokens (USER_REPOSITORY, SEQUELIZE)
- Swagger docs and API discovery out of the box
- Security headers, rate limiting, and CORS configured centrally

### Areas for Improvement / Technical Debt
- Validation: no global ValidationPipe; DTOs not validated
- Guards/Auth: no authentication/authorization; rate limiting done via express middleware instead of Guard
- Error handling: controllers throw HttpException manually; no global Exception Filter
- Provider factory: new HttpService() constructed manually; should rely on Nest DI
- Config: runtime env access is untyped; consider ConfigService with schema validation (e.g., Joi)
- Caching: CacheModule enabled but no route-level cache or CacheInterceptor
- Tests: unit tests present but limited coverage across modules and failure paths

### Inter-module Communication
- Controllers depend on Services via constructor DI
- Services depend on repository/providers via tokens/abstracts
- DatabaseModule exports providers for shared use; AppModule exports DatabaseModule
- WeatherService —> AbstractWeatherProvider implementation selected at module composition time (factory)

### Current Patterns (Representative Excerpts)
- App composition
```
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), CacheModule.register({ isGlobal: true, store: redisStore, host: 'localhost', port: 6379 }), HttpModule, DatabaseModule, UsersModule, WeatherModule],
})
export class AppModule {}
```

- DI with token-backed repository
```
@Injectable()
export class UsersService {
  constructor(@Inject('USER_REPOSITORY') private readonly userRepository: typeof User) {}
}
```

- Provider abstraction + factory
```
export abstract class AbstractWeatherProvider {
  abstract getWeather(zipCode: string): Promise<WeatherDto>;
}

export function createWeatherProvider(): AbstractWeatherProvider {
  return process.env.LOCAL_DATA === 'true' ? new WeatherLocalDataProvider() : new WeatherstackProvider(new HttpService());
}
```

- HTTP surface
```
@ApiTags('Weather')
@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}
  @Get(':zipCode')
  async getWeather(@Param('zipCode') zip: string) { return this.weatherService.getCurrentWeather(zip); }
}
```

### Risks and Constraints
- Third-party dependency (Weatherstack) is a single primary provider; missing bulkhead/circuit breaker/fallback
- Factory creates HttpService directly; harder to test and configure
- No request-scoped context, multi-tenancy, or structured logging

### Recommendations (Short List)
1) Add global ValidationPipe with whitelist/transform and DTO class-validator
2) Introduce JwtAuthGuard (or simple header-based demo guard) + roles guard for targeted routes
3) Add LoggingInterceptor + ResponseTransformInterceptor; add CacheInterceptor selectively
4) Replace express-rate-limit with Nest guard for demo; keep helmet/CORS in main
5) Refactor weather provider factory to use DI provided HttpService
6) Add GlobalExceptionFilter for consistent error shape
7) Add ConfigService schema; replace direct env access

