# Naming Check

Verify naming conventions across changed files per Balsm coding standards.

## Instructions

1. Run `git diff HEAD` (or `git diff --cached`) to identify all changed files.
2. Read each changed file and verify naming conventions:

### .NET Naming (API)
| Pattern | Convention | Example |
|---------|-----------|---------|
| Commands | `Create{Entity}Command`, `Update{Entity}Command`, `Delete{Entity}Command` | `CreateAppointmentCommand` |
| Queries | `Get{Entity}ByIdQuery`, `List{Entity}Query`, `Search{Entity}Query` | `ListAppointmentQuery` |
| Events | `{Entity}{Action}Event` | `AppointmentCreatedEvent`, `PrescriptionDispensedEvent` |
| Handlers | `{Command\|Query}Handler` | `CreateAppointmentCommandHandler` |
| Validators | `{Command\|Query}Validator` | `CreateAppointmentCommandValidator` |
| Repositories | `I{Entity}Repository` / `{Entity}Repository` | `IAppointmentRepository` |
| Services | `I{Domain}Service` / `{Domain}Service` | `ISchedulingService` |
| DTOs | `{Entity}Dto`, `{Entity}DetailDto`, `{Entity}ListItemDto` | `AppointmentDetailDto` |
| Controllers | `{Entity}Controller` (plural route) | `AppointmentsController` → `/api/v1/appointments` |
| Exceptions | `{Context}{Problem}Exception` | `AppointmentConflictException` |
| Migrations | `Add{Feature}_{Entity}Table`, `Add{Column}To{Entity}` | `AddStatus_AppointmentTable` |

### Flutter Naming (App)
| Pattern | Convention | Example |
|---------|-----------|---------|
| Widgets | `{Feature}{Purpose}Widget` | `AppointmentListWidget`, `PatientProfileCard` |
| Screens | `{Feature}Screen` or `{Feature}Page` | `AppointmentDetailScreen` |
| Bloc | `{Feature}Bloc`, `{Feature}State`, `{Feature}Event` | `AppointmentBloc` |
| Models | `{Entity}Model` | `AppointmentModel` |
| Services | `{Feature}Service` | `AuthenticationService` |
| File names | `snake_case.dart` always | `appointment_detail_screen.dart` |

### Ubiquitous Language
- "appointment" not "reservation" or "booking"
- "admission" not "internal reservation"
- "dispensation" not "pharmacy fulfillment"
- "specimen" not "sample"
- "entity" not "organization" or "facility"
- Terms must be consistent across code, API, DB, and docs

### General
- File names match class names (one public class per file)
- Files under 300 lines (single responsibility)
- Class members ordered: constants → private fields → constructors → public properties → public methods → private methods

3. For each violation, report:
   - File path and line number
   - Current name and what it should be
   - Convention violated

4. If no issues are found, confirm naming conventions are followed.
