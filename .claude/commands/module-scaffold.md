# Module Scaffold

Scaffold a new bounded context module with the correct folder structure for Balsm.

## Instructions

1. Determine from $ARGUMENTS (or ask the user):
   - Module name (bounded context name, e.g., "Labs", "Radiology", "Pharmacy")
   - Target project: .NET API, Flutter App, or both

2. Verify the module name aligns with one of the 13 bounded contexts defined in AGENTS.md. If it's a new context, confirm with the user before proceeding.

### .NET Module Structure

Create under `src/Modules/{ContextName}/`:

```
Balsm.{ContextName}.Domain/
  Entities/
  ValueObjects/
  Events/
  Repositories/    (interfaces only)
  Services/        (domain service interfaces)
  Exceptions/

Balsm.{ContextName}.Application/
  Commands/
  Queries/
  Handlers/
  Validators/
  DTOs/
  Mappings/

Balsm.{ContextName}.Infrastructure/
  Repositories/    (implementations)
  Configurations/  (EF Core entity configurations)
  Services/        (external service clients)
  Migrations/

Balsm.{ContextName}.Api/
  Controllers/
  Middleware/
  Filters/
```

Include starter files:
- A placeholder entity in `Domain/Entities/`
- A repository interface in `Domain/Repositories/`
- A repository implementation in `Infrastructure/Repositories/`
- An EF Core DbContext configuration in `Infrastructure/Configurations/`
- A controller stub in `Api/Controllers/`
- Module registration class for DI

### Flutter Module Structure

Create under `packages/{context_name}/`:

```
lib/
  features/
    {feature_name}/
      screens/
      widgets/
      bloc/
      models/
      services/
  core/
    constants/
    utils/

test/
  {feature_name}/
```

Include starter files:
- Package pubspec.yaml with appropriate dependencies
- A placeholder screen
- A placeholder bloc with initial state
- A placeholder model
- Export file (`lib/{context_name}.dart`)

3. Rules:
   - Module must NOT reference other module packages directly
   - Shared types go in `Balsm.SharedKernel` (.NET) or `packages/shared/` (Flutter)
   - Include a brief README in the module root explaining the bounded context

4. List all created files and directories for the user.
