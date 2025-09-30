# 02-enhanced - Simple Demo Patterns

This directory contains **simplified, high-level demos** of NestJS patterns for live coding presentations.

## Philosophy
- **Simple over complex** - Show the pattern, not production edge cases
- **High-level concepts** - Focus on "what" and "why", not deep implementation
- **Demo-friendly** - Easy to understand in 5-minute segments

## Components

### 1. **JwtAuthGuard** (`guards/jwt-auth.guard.ts`)
Simple token validation - checks for "Bearer demo-valid-token" and attaches user to request.

### 2. **LoggingInterceptor** (`interceptors/logging.interceptor.ts`)
Basic request/response logging with timing - shows incoming/outgoing requests.

### 3. **TransformInterceptor** (`interceptors/transform.interceptor.ts`)
Wraps all responses in consistent format: `{ success, data, timestamp }`.

### 4. **@User() Decorator** (`decorators/user.decorator.ts`)
Extracts user from request - use `@User()` for full user or `@User('id')` for specific property.

## Live Coding Flow
1. Add JwtAuthGuard to protect routes
2. Add LoggingInterceptor to see request flow
3. Add TransformInterceptor for consistent responses
4. Use @User() decorator to clean up controllers

