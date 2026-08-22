# Moved — the design system now lives in `brand/design-system/`

This directory used to hold a full mirror of the Claude Design project
`51cdbf29-13b7-4206-9328-125fade14cc3` (60 files). **That mirror was removed on
2026-08-13.** It was one of five copies of the same system across the Balsm
repos, and the copies had drifted badly enough to ship three different wordmark
colours at once.

**Canonical location:** [`Balsm-Core/brand/design-system/`](../../../../../brand/design-system/)

| You were looking for | It is now at |
|---|---|
| `colors_and_type.css`, `component-tokens.css`, `components.css`, `adaptive.css`, `styles.css` | `brand/design-system/` |
| `components/*` | `brand/design-system/components/` |
| `patient_app/Patient App.html` | `brand/design-system/balsm_app/Care App.html` — upstream renamed it `care_app/`; renamed again locally to `balsm_app/` |
| `preview/loading-and-progress.html` | `brand/design-system/preview/` |
| `brand/*`, `uploads/*` | `Balsm-Core/brand/` — they were duplicates of files already there |
| `README.md`, `SKILL.md` | `brand/design-system/` |

`IMPORT-LOG.md` stays here because it is the provenance record for this spec: it
documents what was imported on 2026-07-01, what the 2026-08-13 refresh changed,
and what was deliberately left upstream-only. Read it for history, not for files.

For the deltas between the canonical copy and upstream, see
[`brand/design-system/RELOCATION.md`](../../../../../brand/design-system/RELOCATION.md).
