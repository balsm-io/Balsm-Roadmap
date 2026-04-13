# Test Scaffold

Generate test boilerplate for a new feature, endpoint, or component.

## Instructions

1. Determine from $ARGUMENTS (or ask the user) what to generate tests for:
   - A new API endpoint / command / query
   - A domain entity or service
   - A Flutter widget or screen

2. Read the source file(s) to understand the code under test.

3. Generate test files following Balsm testing standards:

### .NET Tests

**Unit Tests** (Domain / Business Logic):
```
tests/Modules/{ContextName}/Balsm.{ContextName}.UnitTests/
  {Feature}/{Entity}Tests.cs
  {Feature}/{Command}HandlerTests.cs
  {Feature}/{Query}HandlerTests.cs
  {Feature}/{Entity}ValidatorTests.cs
```
- Test domain logic, validation rules, business invariants
- Use in-memory or test database — do not mock the database
- Use synthetic data — never real patient data
- Test sad paths: validation failures, business rule violations, concurrency conflicts
- Target 80% coverage for domain logic

**Integration Tests** (API Endpoints):
```
tests/Modules/{ContextName}/Balsm.{ContextName}.IntegrationTests/
  {Feature}/{Entity}EndpointTests.cs
```
- Test full request → response cycle through the API
- Verify HTTP status codes, response structure, and error formats
- Test authentication and permission enforcement
- Test pagination, filtering, and sorting on list endpoints
- Test idempotency (same request twice produces same result)
- Verify audit trail entries are created for clinical operations

### Flutter Tests

**Widget Tests**:
```
test/{feature_name}/{widget_name}_test.dart
```
- Test widget renders correctly with given data
- Test user interactions (tap, scroll, input)
- Test responsive behavior at all three breakpoints
- Test RTL layout
- Test accessibility semantics

**Bloc/State Tests**:
```
test/{feature_name}/{feature}_bloc_test.dart
```
- Test state transitions for every event
- Test error handling states
- Test loading states

4. Rules for all tests:
   - Tests must be deterministic — no reliance on external services, current time, or random values without seeding
   - Never skip or disable existing tests to make new code pass
   - Use descriptive test names: `Should_{ExpectedBehavior}_When_{Condition}`
   - Include at least: one happy-path test, one validation-failure test, one authorization test (API)
   - Use synthetic/anonymized data in all fixtures

5. Write the test files and inform the user of files created.
