# Team Development Guidelines

## Code Standards

### TypeScript
- Use strict TypeScript configuration
- Always define return types for public methods
- Use interfaces for object shapes
- Prefer `const` over `let` when possible

### NestJS Patterns
- Use dependency injection for all services
- Apply proper decorators (@Injectable, @Controller, etc.)
- Use DTOs for request/response validation
- Implement proper exception handling with NestJS exceptions

### Error Handling
- Use NestJS built-in exceptions (NotFoundException, BadRequestException, etc.)
- Always provide meaningful error messages
- Log errors appropriately (avoid console.log in production)
- Handle edge cases explicitly

### Constants
- Extract magic numbers into named constants
- Use UPPER_SNAKE_CASE for constants
- Group related constants in dedicated files
- Document the purpose of non-obvious constants

### Testing
- Write unit tests for all services and controllers
- Use descriptive test names that explain the scenario
- Mock external dependencies properly
- Aim for high test coverage (>80%)

### API Design
- Use RESTful conventions
- Include proper HTTP status codes
- Add Swagger documentation for all endpoints
- Validate input using class-validator decorators

## AI Integration Guidelines

### When to Use AI
- Scaffolding new modules and components
- Refactoring legacy code
- Writing boilerplate tests
- Generating documentation
- Code reviews and suggestions

### AI Best Practices
- Always review AI-generated code
- Test AI suggestions thoroughly
- Maintain coding standards in prompts
- Use AI for acceleration, not replacement
- Keep human oversight in critical decisions

### Prompt Engineering
- Be specific about requirements
- Include context about existing patterns
- Specify coding standards and conventions
- Ask for explanations of complex logic
- Request test cases along with implementation

## Code Review Process

### Before Submitting
- Run linting and formatting
- Ensure all tests pass
- Check for proper error handling
- Verify API documentation is updated

### Review Checklist
- Code follows team guidelines
- Proper error handling implemented
- Tests cover new functionality
- No security vulnerabilities
- Performance considerations addressed
