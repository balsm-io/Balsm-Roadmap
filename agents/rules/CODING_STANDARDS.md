# Balsm Healthcare Platform — Coding Standards

> Detailed technical patterns and conventions. Referenced from [AGENTS.md](./AGENTS.md).

---

## 1. Error Handling Patterns

- use the Result pattern (`Result<T>`) for expected failures (validation errors, not-found, business rule violations) — do not throw exceptions for expected outcomes
- reserve exceptions for truly unexpected failures (network errors, database unavailability, null references)
- define domain-specific exception types organized by bounded context (e.g., `AppointmentConflictException`, `PrescriptionValidationException`) — do not use generic `Exception` or `ApplicationException`
- never swallow exceptions silently — always log or propagate
- never use `catch (Exception)` without re-throwing or logging — catch only exception types you can meaningfully handle
- API layer must translate domain errors into appropriate HTTP status codes — do not leak internal exception details to the client
- include correlation IDs in all error responses to enable tracing across services

---

## 2. Naming Conventions

### 2.1 .NET (API)

- commands: `Create{Entity}Command`, `Update{Entity}Command`, `Delete{Entity}Command`
- queries: `Get{Entity}ByIdQuery`, `List{Entity}Query`, `Search{Entity}Query`
- events: `{Entity}{Action}Event` (e.g., `AppointmentCreatedEvent`, `PrescriptionDispensedEvent`)
- handlers: `{Command|Query}Handler` (e.g., `CreateAppointmentCommandHandler`)
- validators: `{Command|Query}Validator` (e.g., `CreateAppointmentCommandValidator`)
- repositories: `I{Entity}Repository` (interface), `{Entity}Repository` (implementation)
- services: `I{Domain}Service` (interface), `{Domain}Service` (implementation)
- DTOs: `{Entity}Dto`, `{Entity}DetailDto`, `{Entity}ListItemDto`
- API controllers: `{Entity}Controller` (plural resource in route: `/api/v1/appointments`)

### 2.2 Flutter (App)

- widgets: `{Feature}{Purpose}Widget` (e.g., `AppointmentListWidget`, `PatientProfileCard`)
- screens/pages: `{Feature}Screen` or `{Feature}Page` (e.g., `AppointmentDetailScreen`)
- state/bloc: `{Feature}Bloc`, `{Feature}State`, `{Feature}Event`
- models: `{Entity}Model` (e.g., `AppointmentModel`)
- services: `{Feature}Service` (e.g., `AuthenticationService`)
- file names: `snake_case.dart` always — never camelCase or PascalCase for file names

---

## 3. SOLID Principles

- **Single Responsibility**: each class and method does one thing — if a class name needs "And" or "Manager", it does too much
- **Open/Closed**: extend behavior through new implementations, not by modifying existing working code — use interfaces and strategy patterns
- **Liskov Substitution**: derived types must be fully substitutable for their base types — do not override methods to throw `NotImplementedException`
- **Interface Segregation**: create focused interfaces — a class should never be forced to implement methods it does not use (e.g., separate `IReadRepository<T>` and `IWriteRepository<T>`)
- **Dependency Inversion**: depend on abstractions (interfaces), not concrete implementations — inject dependencies through constructors, never instantiate dependencies with `new` inside business logic

---

## 4. Structured Logging

- use structured logging (key-value pairs) — not string interpolation or concatenation in log messages
- every log entry must include: `CorrelationId`, `UserId`, `Action`, `Module`
- log levels:
  - `Debug` — detailed diagnostic info (disabled in production)
  - `Information` — significant business events (appointment created, prescription dispensed)
  - `Warning` — recoverable issues (retry succeeded, fallback used, deprecated API called)
  - `Error` — failures that need attention (unhandled exception, external service failure)
  - `Critical` — system-level failures (database unreachable, authentication service down)
- never log PHI, passwords, tokens, or full request/response bodies — log entity IDs and operation names only
- log at method entry and exit for critical workflows (clinical operations, financial transactions)
- include execution duration for operations that may have performance concerns

---

## 5. Database Patterns

- always use projections — select only the columns you need, never `SELECT *` or load full entities when only a subset is required
- prevent N+1 queries — use eager loading (`Include`/`ThenInclude` in EF Core) or batch queries when loading related data
- use pagination at the database level — never load all records and paginate in memory
- every migration must be reversible — include both `Up()` and `Down()` methods
- name migrations descriptively: `Add{Feature}_{Entity}Table`, `Add{Column}To{Entity}`, `Create{Index}On{Entity}`
- add indexes for every column used in `WHERE`, `JOIN`, or `ORDER BY` clauses on tables expected to have >10K rows
- use `AsNoTracking()` for read-only queries to avoid unnecessary change tracking overhead
- never execute raw SQL unless EF Core/ORM cannot express the query — and if you must, always use parameterized queries

---

## 6. Async Patterns

- all I/O operations (database, HTTP, file system) must be async — never block with `.Result`, `.Wait()`, or `.GetAwaiter().GetResult()`
- always pass and respect `CancellationToken` in async methods — propagate it from the controller action through to the repository
- use `ValueTask<T>` instead of `Task<T>` for methods that frequently complete synchronously (cache hits, simple lookups)
- never use `async void` — always return `Task` or `Task<T>` (exception: event handlers in Flutter)
- use `ConfigureAwait(false)` in library/service code that does not need the synchronization context
- for parallel independent operations, use `Task.WhenAll()` — do not await sequentially when operations are independent
- set timeouts on all external HTTP calls — never allow unbounded waits

---

## 7. Validation Strategy

- validate at two layers — never skip either:
  - **API layer** (input validation): data types, required fields, string lengths, format constraints (email, phone, date formats) — reject malformed requests before they reach business logic
  - **Domain layer** (business validation): business rules, state transitions, cross-field rules, invariants — enforce domain constraints regardless of entry point
- use FluentValidation for API-layer validation in .NET — one validator class per command/query
- domain validation lives inside the domain model (entity constructors, methods, value objects) — not in services or handlers
- return all validation errors at once — do not fail on the first error and force the user to fix one at a time
- validation error responses must include: field name, error code (machine-readable), and human-readable message
- never trust client-side validation alone — always re-validate on the server

---

## 8. DTO & Mapping Conventions

- never expose domain entities directly in API responses — always map to DTOs
- never accept domain entities as API input — always accept command/request DTOs
- use three distinct models per entity:
  - **Domain Model** — business logic, invariants, behavior (lives in the domain layer)
  - **Persistence Model / Entity** — database mapping, EF Core configuration (lives in the data layer)
  - **DTO** — API contract, serialization (lives in the API layer)
- map between layers explicitly — use a consistent mapping approach (AutoMapper profiles, manual mapping extensions, or Mapster)
- DTOs must be immutable — use `record` types in C# or `freezed` in Dart
- never put domain logic in DTOs or mapping code — mapping is purely structural transformation
- create purpose-specific DTOs: `{Entity}DetailDto` (full), `{Entity}ListItemDto` (summary for lists), `Create{Entity}Request`, `Update{Entity}Request`

---

## 9. Idempotency

- all write operations exposed via API must be idempotent — the same request sent twice must produce the same result without side effects
- use client-generated idempotency keys (`Idempotency-Key` header) for create operations — store and check before processing
- update and delete operations are naturally idempotent when using resource IDs — ensure they do not fail if the state is already as requested
- payment and billing operations must always be idempotent — duplicate charges are unacceptable in healthcare
- event publishing must be idempotent — consumers must handle receiving the same event more than once (use event IDs for deduplication)
- prescription dispensation must be idempotent — a duplicate request must not dispense twice

---

## 10. Code Organization

### 10.1 File Structure (within each file)

- order members consistently within a class:
  1. Constants and static fields
  2. Private fields
  3. Constructor(s)
  4. Public properties
  5. Public methods
  6. Private methods
- keep files under 300 lines — if a file exceeds this, it likely violates single responsibility
- one public class per file — file name matches the class name

### 10.2 Project Structure (.NET)

- every bounded context is a separate package (class library project) — never combine contexts into a single project
- structure: `src/Modules/{ContextName}/` where each module contains:
  - `Balsm.{ContextName}.Domain/` — entities, value objects, domain events, repository interfaces
  - `Balsm.{ContextName}.Application/` — commands, queries, handlers, validators, DTOs
  - `Balsm.{ContextName}.Infrastructure/` — repository implementations, EF configurations, external service clients
  - `Balsm.{ContextName}.Api/` — controllers, middleware, filters
- shared kernel (cross-cutting types used by all modules) lives in a separate package: `Balsm.SharedKernel`
- modules must not reference other module packages directly — communicate through shared contracts or domain events

### 10.3 Project Structure (Flutter)

- every bounded context is a separate Dart package under `packages/`:
  - `packages/{context_name}/` — self-contained with its own screens, widgets, bloc, models, services
- organize by feature within each package:
  - `lib/features/{feature_name}/` — screens, widgets, bloc, models, services for that feature
  - `lib/core/` — shared utilities within the package
- shared code across packages lives in a dedicated package: `packages/shared/`
- packages must not import other feature packages directly — communicate through shared contracts or dependency injection

---

## 11. Performance Standards (Critical)

> Performance is a first-class requirement. Every code path must be written with performance in mind.

### 11.1 Database Performance

- every query must use projections — select only the columns needed, never load full entities for read operations
- prevent N+1 queries — always verify with query logging that related data is loaded in a single round-trip
- use `AsNoTracking()` for all read-only queries — change tracking has measurable overhead
- paginate all list queries at the database level — never use `.ToList()` followed by in-memory pagination
- use compiled queries (`EF.CompileAsyncQuery`) for hot-path queries executed frequently
- add composite indexes for multi-column `WHERE` clauses — single-column indexes are not enough for complex filters
- use `EXISTS` instead of `COUNT > 0` for existence checks — it short-circuits on first match
- avoid `LIKE '%term%'` (leading wildcard) on large tables — use full-text search indexes instead
- batch insert/update operations — use `BulkInsert`/`BulkUpdate` for operations on >100 records
- monitor and log slow queries (>100ms) — set up query performance alerts

### 11.2 API Performance

- target response times: <200ms for simple reads, <500ms for complex reads, <1s for write operations
- use response compression (gzip/brotli) for all API responses
- implement HTTP caching headers (`ETag`, `Last-Modified`, `Cache-Control`) for read endpoints
- use pagination with cursor-based pagination for large datasets — offset pagination degrades on deep pages
- return minimal payloads — do not include fields the client does not need (use sparse fieldsets or purpose-specific DTOs)
- use `204 No Content` for successful operations that do not need a response body
- implement request deduplication to prevent redundant processing of identical concurrent requests

### 11.3 Caching Strategy

- cache at multiple levels: in-memory (L1) → distributed cache (L2) → database
- define explicit TTL (time-to-live) for every cached item — never cache without expiration
- use cache-aside pattern: check cache → miss → load from DB → populate cache → return
- invalidate cache on write operations — stale data in healthcare is dangerous
- cache candidates: entity configurations, permission sets, lookup tables, formulary data, ICD/CPT code lookups
- never cache: patient records, prescription data, real-time inventory counts, appointment availability
- use cache tags/keys that include tenant ID — never serve cached data across tenants

### 11.4 Memory & Resource Management

- use `IAsyncEnumerable<T>` for streaming large result sets — do not materialize entire collections in memory
- use `ArrayPool<T>` or `MemoryPool<T>` for temporary buffers in hot paths
- dispose all disposable resources — use `using`/`await using` statements, never rely on garbage collection for resource cleanup
- use `Span<T>` and `Memory<T>` for high-throughput string/byte manipulation — avoid unnecessary allocations
- stream file uploads and downloads — never buffer entire files in memory
- set maximum request body size limits — reject oversized payloads before processing
- monitor memory allocations in critical paths — zero-allocation or low-allocation patterns for hot paths

### 11.5 Concurrency & Throughput

- use connection pooling for all database connections — configure appropriate pool sizes
- implement circuit breaker pattern for external service calls — prevent cascade failures
- use rate limiting on public endpoints — protect against abuse and resource exhaustion
- use background processing (message queues, background services) for operations that do not need synchronous responses (report generation, email sending, audit log persistence)
- avoid global locks — use fine-grained locking scoped to the specific resource being protected
- configure appropriate thread pool sizes — do not starve the thread pool with blocking calls

### 11.6 Flutter Performance

- use `const` constructors wherever possible — prevent unnecessary widget rebuilds
- implement `ListView.builder` for long lists — never use `ListView` with all children materialized
- use `RepaintBoundary` to isolate frequently repainting widgets
- cache network images with appropriate cache policies
- minimize widget tree depth — deep trees increase layout and paint time
- use `compute()` or isolates for CPU-intensive operations — never block the UI thread
- profile with Flutter DevTools before and after changes — measure frame render times
- lazy-load screens and heavy widgets — do not initialize everything at app startup
