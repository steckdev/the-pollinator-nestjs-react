# Demo Flow Mapping: Live Coding Session

## Overview
This document maps the 40-minute live coding timeline from PRESENTATION_PROGRESS_NESTJS.md to exact Workshop files and specific lines to edit for smooth presentation flow.

## File Structure Reference
```
Workshop/
├── 01-current/          # Starting point files
│   ├── app.module.ts
│   ├── main.ts
│   └── modules/
│       ├── users/users.controller.ts
│       └── weather/
│           ├── weather.controller.ts
│           └── weather.service.ts
├── 02-enhanced/         # Pre-built scaffolds to wire in
│   ├── guards/jwt-auth.guard.ts
│   ├── interceptors/
│   │   ├── logging.interceptor.ts
│   │   └── transform.interceptor.ts
│   └── decorators/user.decorator.ts
└── DEMO_FLOW_MAPPING.md
```

## Timeline Mapping (40 minutes)

### Minutes 1-3: Frame Current State
**Action**: Show existing architecture
**Files to display**:
- `01-current/app.module.ts` - Module composition
- `01-current/main.ts` - Global middleware setup
- `01-current/modules/users/users.controller.ts` - Basic controller
- `01-current/modules/weather/weather.controller.ts` - Provider pattern

**Key points**: Module boundaries, DI tokens, provider abstraction

### Minutes 4-8: Global ValidationPipe + DTO Annotations
**Primary file**: `01-current/main.ts`
**Action**: Add ValidationPipe to global pipes
**Line to edit**: After `app.useGlobalPrefix('api');`
**Add**:
```typescript
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
}));
```

**Secondary file**: `01-current/modules/users/users.controller.ts`
**Action**: Show DTO validation in action
**Note**: Reference class-validator decorators on CreateUserDto

### Minutes 9-14: JwtAuthGuard
**Primary file**: `01-current/modules/users/users.controller.ts`
**Action**: Add @UseGuards(JwtAuthGuard) to controller
**Line to edit**: Above class declaration
**Add**:
```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
```

**Secondary file**: `01-current/modules/weather/weather.controller.ts`
**Action**: Same guard addition
**Show**: How guards compose with existing functionality

**Reference file**: `02-enhanced/guards/jwt-auth.guard.ts` (pre-built)

### Minutes 15-20: Logging + Transform Interceptors
**Primary file**: `01-current/main.ts`
**Action**: Add global interceptors
**Line to edit**: After ValidationPipe setup
**Add**:
```typescript
app.useGlobalInterceptors(
  new LoggingInterceptor(),
  new TransformInterceptor(),
);
```

**Reference files**:
- `02-enhanced/interceptors/logging.interceptor.ts`
- `02-enhanced/interceptors/transform.interceptor.ts`

**Demo**: Show request/response transformation

### Minutes 21-26: CacheInterceptor on Weather
**Primary file**: `01-current/modules/weather/weather.controller.ts`
**Action**: Add selective caching
**Line to edit**: Above getCurrentWeather method
**Add**:
```typescript
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { UseInterceptors } from '@nestjs/common';

@Get(':zip')
@UseInterceptors(CacheInterceptor)
@CacheKey('weather')
@CacheTTL(300) // 5 minutes
getCurrentWeather(@Param('zip') zip: string) {
```

### Minutes 27-31: @User() Param Decorator
**Primary file**: `01-current/modules/users/users.controller.ts`
**Action**: Replace manual user extraction
**Line to edit**: Method parameters
**Change from**:
```typescript
getProfile(@Request() req) {
  return this.usersService.findById(req.user.id);
}
```
**Change to**:
```typescript
getProfile(@User() user: UserEntity) {
  return this.usersService.findById(user.id);
}
```

**Reference file**: `02-enhanced/decorators/user.decorator.ts`

### Minutes 32-36: Refactor Weather Provider Factory
**Primary file**: `01-current/app.module.ts`
**Action**: Replace factory function with DI-based useFactory
**Line to edit**: WeatherModule providers section
**Change from**:
```typescript
providers: [
  {
    provide: 'WEATHER_PROVIDER',
    useFactory: createWeatherProvider,
  },
],
```
**Change to**:
```typescript
providers: [
  {
    provide: 'WEATHER_PROVIDER',
    useFactory: (httpService: HttpService, configService: ConfigService) => {
      return configService.get('LOCAL_DATA') === 'true'
        ? new WeatherLocalDataProvider()
        : new WeatherstackProvider(httpService);
    },
    inject: [HttpService, ConfigService],
  },
],
```

### Minutes 37-40: Recap & Next Steps
**Action**: Quick review of changes
**Show**: How each pattern composes
**Mention**: 03-product and 04-platform evolution paths

## Presenter Notes

### Smooth Transitions
- Keep 02-enhanced files open in separate tabs for quick reference
- Use split screen to show before/after
- Emphasize how each addition is non-breaking

### Key Messages
- NestJS makes cross-cutting concerns trivial to add
- DI enables testing and composition
- Module boundaries keep features isolated
- Provider patterns enable flexibility

### Backup Plans
- If running behind, skip CacheInterceptor (minutes 21-26)
- If ahead, add RolesGuard example
- Always prioritize DI refactoring (minutes 32-36) as it shows core NestJS value

## Success Metrics
- All guards/interceptors/pipes working together
- Clean controller signatures with @User decorator
- DI-based provider factory showing testability
- Audience understands incremental hardening approach
