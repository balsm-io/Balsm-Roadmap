# Balsm Design System — Import Log

- **Source:** claude.ai/design project `51cdbf29-13b7-4206-9328-125fade14cc3` ("Balsm Design System", owner Hossam Eldin Mahmoud), via the claude_design MCP (`DesignSync`).
- **Imported:** 2026-07-01
- **Files on disk:** 57
- **This folder is now the canonical in-repo Balsm design system.** `design/reference-prototype/` (older claude.ai project `50dccb01`) is **superseded** — treat it as historical only.

## Mechanism note

`DesignSync` has no bulk-download method — every file is one `get_file` that streams through the model context. A subagent could not run the copy (deferred MCP tools do not propagate to subagents), so the mirror was done inline on the main thread. To keep it tractable, the **implementable design system + the P001 patient app + the originally-linked preview** were imported in full; the low-value / oversize tail is left **upstream-only** (listed below) and can be pulled on request.

## Imported (57 files)

- **Tokens / entry (7):** `styles.css`, `colors_and_type.css`, `component-tokens.css`, `components.css`, `adaptive.css`, `README.md`, `SKILL.md`.
  - `colors_and_type.css` and `component-tokens.css` are mirrored **verbatim**, including the design tool's inline `/* @kind … */` token annotations.
- **Components (34):** all 17 — `Badge, Button, DatePicker, Input, LoadingOverlay, ProSidebar, Progress, ProgressButton, SegmentedProgress, Select, Skeleton, Spinner, Steps, TimePicker, Toast, TopLoadingBar` — each `*.jsx` + `*.d.ts`. Per-component `index.html` preview harnesses were **not** mirrored (redundant with `preview/`).
- **patient_app/ (13):** `Patient App.html`, `app.css`, `app.jsx`, `auth.jsx`, `base.jsx`, `colors_and_type.css`, `data.jsx`, `home.jsx`, `ios-frame.jsx`, `report.jsx`, `tweaks-panel.jsx`, `assets/balsm-background.png`, `assets/logo-vertical.svg`. Slice 2 — auth + daily self-report iOS prototype. Runnable (React + Babel via CDN).
- **preview/ (1):** `loading-and-progress.html` — the file originally linked; self-contained.
- **brand/ + uploads/ (4):** `brand/balsm-background.png`, `brand/logo-vertical.svg`, `uploads/balsm-background.png`, `uploads/logo-vertical.svg`.
  - PNGs copied from the repo's local `brand/balsm-background.png` (byte-identical, 50436 B) to avoid base64-through-context. `logo-vertical.svg` pulled from the canonical remote (text) and fanned out to the three locations. `patient_app/colors_and_type.css` set to the canonical root tokens.

## Upstream-only (NOT mirrored — available in the cloud project; fetch on request)

- **preview/ gallery — 19 remaining HTML:** `adaptive`, `brand-gradients`, `brand-logo`, `brand-pattern`, `colors-clinical`, `colors-neutrals`, `colors-petals`, `components-badges`, `components-buttons`, `components-cards`, `components-inputs`, `components-table`, `iconography`, `spacing-radii-shadows`, `spacing-scale`, `type-body`, `type-display`, `voice-copy`. (Static showcases; the tokens + component sources they demonstrate are already imported.)
- **ui_kits/balsm_pharmacy/ (10):** Slice 1 (Pharmacy POS) — `README.md`, `app.jsx`, `atoms.jsx`, `customers.jsx`, `index.html`, `inventory.jsx`, `kit.css`, `pos.jsx`, `shell.jsx`, `tweaks-panel.jsx`. Out of the P001 patient-app scope.
- **Docs (source material):** `uploads/design.md`, `uploads/BUSINESS_FEATURES.md`, `uploads/baslm-brand-canvas.md`, root `baslm-brand-canvas.md`. (The brand canvas summary is captured in `README.md`; these are the long-form sources.)
- **Tooling / compiled:** `_ds_bundle.js` (compiled bundle), `_ds_manifest.json`, `_adherence.oxlintrc.json`.
- **scratch/ (17 PNG dev screenshots) + `.thumbnail`:** design-process artifacts, not design deliverables.
