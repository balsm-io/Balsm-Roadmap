# Claude Code Instructions

Read and follow the agent instructions in [AGENTS.md](./agents/rules/AGENTS.md).

## Active Technologies
- .NET 10.0 (C#) for backend; TypeScript 5.8 + React 19 for admin UI; Bash / PowerShell for installer hooks + ASP.NET Core 10, Entity Framework Core 10.0.5 (SQLite provider with `Microsoft.Data.Sqlite` online backup API), `Tmds.MDns` or `Zeroconf` for mDNS, `Konscious.Security.Cryptography.Argon2` (or libsodium binding) for password hashing, FluentValidation, Serilog (structured logging), Vite + React + React Router 7 admin SPA (main)
- SQLite (`balsm.db`) embedded; backups + audit JSONL archives under configurable backup directory (default `<install-dir>/backups/`) (main)

* C# / .NET 10.0 (SDK 10.0.101, `net10.0` TFM) + ASP.NET Core, EF Core 10.0.5, SQLite, MediatR 14.1, FluentValidation 12.1, Serilog 10.0, Sentry SDK, React/Vite (admin UI) (001-server-foundation)
* SQLite (embedded, WAL mode) — file: `balsm.db` (001-server-foundation)

## Recent Changes

* 001-server-foundation: Added C# / .NET 10.0 (SDK 10.0.101, `net10.0` TFM) + ASP.NET Core, EF Core 10.0.5, SQLite, MediatR 14.1, FluentValidation 12.1, Serilog 10.0, Sentry SDK, React/Vite (admin UI)

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
