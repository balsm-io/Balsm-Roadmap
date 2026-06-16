# Spec-Kit Workflow

Use the spec-kit commands below in the sequence listed. Each command feeds its output into the next.

## Command Sequence

| Step | Command | When to Run | Input → Output |
|------|---------|-------------|----------------|
| 1 | `/speckit.constitution` | Once at project setup (or when updating project principles) | Interactive input → `.specify/memory/constitution.md` |
| 2 | `/speckit.git.feature` | Before starting any new feature/phase | Branch name argument → new git feature branch |
| 3 | `/speckit.specify <description>` | When kicking off a new feature | Natural-language description → `specs/<id>/spec.md` |
| 4 | `/speckit.clarify` | After `specify`, if the spec has ambiguities | `spec.md` → answered clarifications written back into `spec.md` |
| 5 | `/speckit.plan` | After the spec is clean and clarified | `spec.md` + constitution → `research.md`, `data-model.md`, `contracts/`, `plan.md` |
| 6 | `/speckit.tasks` | After `plan.md` is complete | `plan.md` + `spec.md` → `tasks.md` |
| 7 | `/speckit.analyze` | After `tasks.md` is generated | `spec.md` + `plan.md` + `tasks.md` → consistency & quality report |
| 8 | `/speckit.checklist` | Optional — to generate a domain-specific checklist | Feature context → `checklists/<name>.md` |
| 9 | `/speckit.implement` | When ready to start coding | `tasks.md` → code committed task-by-task, each completed task marked `[x]` |
| 10 | `/speckit.taskstoissues` | Optional — to track work in GitHub | `tasks.md` → GitHub Issues created for each task |
| — | `/speckit.git.commit` | After each command completes | Staged changes → git commit with conventional message |
| — | `/speckit.git.validate` | Any time — verify branch naming | Current branch → pass/fail validation report |

## Command Details

### `/speckit.constitution`
Sets the project-wide principles and constraints (tech stack, coding standards, architectural rules, compliance requirements) that all other commands must respect. Run once at the start of a project and update whenever foundational decisions change. Writes to `.specify/memory/constitution.md`.

### `/speckit.git.feature [branch-name]`
Creates (or switches to) a properly named feature branch before work begins. Uses sequential (`NNN-feature`) or timestamp numbering depending on `.specify/init-options.json`. Also used by: `speckit.git.remote` (detect remote URL) and `speckit.git.initialize` (one-time repo init).

### `/speckit.specify <feature description>`
Generates a complete feature specification (`spec.md`) from a plain-English description. Produces user stories with priorities (P1, P2…), acceptance scenarios, success criteria, and a requirements quality checklist. Limits clarification questions to 3 maximum. Writes to `specs/<id>/spec.md`.

### `/speckit.clarify`
Reads the current `spec.md` and asks up to 5 targeted questions about underspecified areas. Encodes every answer directly back into the spec so downstream commands work with a complete picture. Skip if the spec produced by `specify` is already unambiguous.

### `/speckit.plan`
The main design step. Reads `spec.md` and the constitution, then generates:
- `research.md` — resolves every "NEEDS CLARIFICATION" with researched decisions and rationale
- `data-model.md` — entities, fields, relationships, validation rules
- `contracts/` — API endpoint contracts or interface definitions (follows routing conventions from `architecture/routing-best-practices.md`)
- `plan.md` — full implementation plan with technical context and phase breakdown

Gate: errors out if any NEEDS CLARIFICATION items remain unresolved.

### `/speckit.tasks`
Translates `plan.md` (and `spec.md` user stories) into a dependency-ordered `tasks.md`. Tasks are grouped by user story for independent delivery. Tasks marked `[P]` can run in parallel.

### `/speckit.analyze`
Non-destructive cross-artifact analysis. Checks that `spec.md`, `plan.md`, and `tasks.md` are internally consistent and flags any gaps, contradictions, or missing coverage. Run after `tasks` and again before `implement` if any artifact was manually edited.

### `/speckit.checklist [domain]`
Generates a domain-specific checklist (e.g., "security", "accessibility", "clinical safety") for the current feature. Useful for compliance reviews. Output is written to `specs/<id>/checklists/`.

### `/speckit.implement`
Reads `tasks.md` and executes every task in dependency order. Parallel tasks (`[P]`) run together; sequential tasks run one at a time. Marks each completed task as `[x]` in `tasks.md`. Halts on failure of any non-parallel task. After completion checks `.specify/extensions.yml` for `after_implement` hooks.

### `/speckit.taskstoissues`
Converts the task list in `tasks.md` into GitHub Issues. Useful when the team tracks work in GitHub Projects. Requires the git remote to be configured (`speckit.git.remote`).

## Git Support Commands

| Command | Purpose |
|---------|---------|
| `/speckit.git.initialize` | One-time: init git repo + initial commit |
| `/speckit.git.remote` | Detect GitHub remote URL for issue/PR integration |
| `/speckit.git.feature [name]` | Create a sequential or timestamp-prefixed feature branch |
| `/speckit.git.validate` | Assert the current branch follows naming conventions |
| `/speckit.git.commit` | Commit staged changes with a conventional-format message |
