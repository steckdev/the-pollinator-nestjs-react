# Live Demo Script

## Pre-Demo Setup

1. **Open VS Code** with the project
2. **Install dependencies**: `npm install`
3. **Verify tests run**: `npm test`
4. **Start the application**: `npm run start:dev`
5. **Open Swagger**: http://localhost:3000/api

## Demo 1: Legacy Code Refactoring (5 minutes)

### Setup
- Open `src/legacy/user-service-messy.js`
- Highlight the problems:
  - Callback hell
  - Inconsistent error handling
  - Magic numbers/strings
  - Mixed sync/async patterns

### Live Refactoring
1. **Open AI assistant** (Copilot Chat/Augment)
2. **Paste the refactor prompt** from `prompts/refactor-legacy.md`
3. **Show the AI response** - modern TypeScript service
4. **Highlight improvements**:
   - Clean async/await
   - Proper error handling
   - Type safety
   - NestJS patterns

### Key Points
- AI understands context and patterns
- Maintains business logic while improving structure
- Follows team guidelines when specified

## Demo 2: Feature Implementation with MCP (7 minutes)

### Setup
- Show GitHub issue: "Add /profile endpoint"
- Explain MCP connection to project context

### Live Implementation
1. **Open MCP-enabled AI assistant**
2. **Paste the feature prompt** from `prompts/feature-implementation.md`
3. **Watch AI generate**:
   - ProfileController
   - ProfileResponseDto
   - Updated UsersService
   - Test files
   - Swagger docs

### Verification
1. **Run the tests**: `npm test`
2. **Check Swagger docs**: http://localhost:3000/api
3. **Test the endpoint**: GET /profile

### Key Points
- AI understands existing project patterns
- Generates complete feature with tests
- Follows established conventions
- Ready for code review

## Demo 3: TDD with AI Acceleration (6 minutes)

### Setup
- Open `src/services/cart.service.spec.ts`
- Show the failing test for `calculateTotal()`
- Run tests to show failure: `npm test -- cart.service.spec.ts`

### Red Phase
1. **Paste TDD prompt** (Step 1) from `prompts/tdd-workflow.md`
2. **AI implements minimal solution**
3. **Run tests** - show they pass

### Refactor Phase
1. **Paste refactor prompt** (Step 3)
2. **AI improves code quality**:
   - Extracts tax rate constant
   - Adds documentation
   - Improves readability
3. **Run tests** - confirm they still pass

### Additional Cycles
1. **Add more test cases** with AI help
2. **Show iterative improvement**
3. **Highlight safety of tests**

### Key Points
- AI accelerates each TDD cycle
- Tests provide safety net
- Maintains TDD discipline
- Improves code quality iteratively

## Wrap-up Points (2 minutes)

### What We Demonstrated
- **Legacy modernization** with AI guidance
- **Complete feature development** with MCP
- **TDD acceleration** while maintaining discipline
- **Consistent patterns** across all scenarios

### Key Takeaways
- AI is a powerful pair programming partner
- Human oversight remains critical
- Proper prompts yield better results
- Integration with development workflow is key
- Quality and testing standards are maintained

### Next Steps for Audience
- Try the prompts in their own projects
- Establish team guidelines for AI usage
- Start with low-risk refactoring tasks
- Build confidence before tackling complex features
