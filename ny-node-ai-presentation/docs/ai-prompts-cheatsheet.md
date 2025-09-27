# AI Prompts Cheat Sheet

## Quick Reference for Live Demos

### 🔄 Refactoring Legacy Code

```
Refactor this legacy code to modern TypeScript/NestJS:
1. Convert callbacks to async/await
2. Add proper TypeScript types
3. Use NestJS decorators and DI
4. Extract constants from magic numbers
5. Implement consistent error handling
6. Follow SOLID principles

Keep the same business logic - only modernize the implementation.
```

### 🚀 Feature Implementation

```
Implement a complete feature with:
1. NestJS controller with proper decorators
2. DTOs with validation
3. Service layer with business logic
4. Comprehensive unit tests
5. Swagger documentation
6. Error handling for edge cases

Follow existing project patterns and conventions.
```

### 🧪 TDD Workflow

**Red Phase:**
```
Make this failing test pass with minimal implementation:
[paste test code]

Requirements:
- Only implement what's needed for the test
- Don't over-engineer
- Keep it simple and focused
```

**Refactor Phase:**
```
Refactor this method to improve code quality:
1. Extract constants
2. Improve readability
3. Add documentation
4. Handle edge cases
5. Follow TypeScript conventions

All tests must continue to pass.
```

### 📝 Test Generation

```
Generate comprehensive unit tests for this [controller/service]:
1. Test all public methods
2. Include edge cases and error scenarios
3. Mock dependencies properly
4. Use descriptive test names
5. Follow AAA pattern (Arrange, Act, Assert)
```

### 📚 Documentation

```
Generate API documentation for this endpoint:
1. Add Swagger decorators
2. Document request/response schemas
3. Include example payloads
4. Document error responses
5. Add operation descriptions
```

### 🔍 Code Review

```
Review this code for:
1. Security vulnerabilities
2. Performance issues
3. Code quality improvements
4. Best practice violations
5. Potential bugs

Provide specific suggestions with explanations.
```

## Context-Setting Tips

### For Better Results, Include:
- **Project context**: "This is a NestJS project with TypeScript"
- **Existing patterns**: "Follow the pattern used in [existing file]"
- **Team standards**: "Use our linting rules and conventions"
- **Specific requirements**: "Must handle these edge cases..."

### Example Context Block:
```
Context: NestJS TypeScript project
Standards: ESLint + Prettier, strict types
Patterns: Repository pattern, DTO validation
Requirements: [specific needs]

Task: [what you want AI to do]
```

## Demo-Specific Prompts

### Demo 1: Legacy Refactor
```
This legacy JavaScript file has callback hell and inconsistent patterns. 
Refactor to modern NestJS TypeScript following our team guidelines:
- Replace callbacks with async/await
- Add proper error handling with NestJS exceptions
- Extract magic strings/numbers to constants
- Use dependency injection
- Add TypeScript types throughout
```

### Demo 2: Feature with MCP
```
Connected via MCP to this project. Implement complete /profile endpoint:
- GET /profile controller method
- ProfileResponseDto with validation
- Update existing UserService
- Write comprehensive tests
- Add Swagger documentation
- Follow existing project patterns
```

### Demo 3: TDD Cycle
```
TDD Red Phase: Implement calculateTotal() to make this test pass:
[test code]

Requirements: 7% tax rate, minimal implementation only.

Then for Green Phase: Refactor for maintainability while keeping tests passing.
```
