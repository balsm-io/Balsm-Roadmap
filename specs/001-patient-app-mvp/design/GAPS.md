# P001 Design Track — Gap Analysis

> **Generated**: 2026-06-27
> **Scope**: Cross-check of `design/` artifacts against what `tasks/design.md` (D001–D027) and `SCREEN-INVENTORY.md` promise.
> **Headline**: The design track is marked **complete** (D001–D027 all `[X]`) and the review gate is **signed off** (`REVIEW-SIGNOFF.md`: all 6 flows "Approved 2026-06-17"), but most of the artifacts those claims depend on are **missing or empty**. The Phase 3+ implementation gate (T071+) appears to have unlocked on a hollow review.

---

## 1. Missing / hollow design artifacts

Specced by `tasks/design.md`, absent or empty on disk:

| Artifact | Specced by | On disk | Severity |
|---|---|---|---|
| `mocks/` — ~196 HTML mock files | D004–D014 | **11 dirs, all EMPTY (0 files)** | **Critical** |
| `COMPONENT-CONTRACT.md` | D003 | missing | High |
| `MOTION-SPEC.md` | D025 | missing | Medium |
| `A11Y-SPEC.md` | D026 | missing | High (WCAG AAA target) |
| `COPY-SPEC.md` | D027 | missing | Medium (feeds i18n at T100) |
| `tokens-snapshot.json` (CI diff source) | D024 | missing — only `tokens.css` present | Medium |
| `findings/<date>.md` (review output) | D022 | only `_template.md` — no review recorded | High |
| `UI-SPEC.md` | D001 | renamed → `MASTER.md` (literal path in D001 does not exist) | Low (drift) |

### Biggest hole — zero mocks
D004–D014 claim ~196 HTML files across `auth/`, `auth_states/`, `country_lang/`, `deletion/`, `disclosure/`, `emergency_card/`, `home/`, `medications/`, `profile/`, `sessions/`, `system/`. Every directory exists but contains **0 files**.

`REVIEW-SIGNOFF.md` records those same flows as reviewed + approved on 2026-06-17 — but there were no mocks to review and no `findings/<date>.md` was produced. The gate that "unlocks Phase 3+ implementation" (D023) cleared against an empty mock set.

---

## 2. Prototype screen-coverage gap

`SCREEN-INVENTORY.md` defines **29 screens**. `prototype/index.html` wraps **22** (`data-screen` attrs). Missing **7** — all of them listed as "Approved" in `REVIEW-SIGNOFF.md`, none present in the prototype:

| Missing screen | Flow (per sign-off) |
|---|---|
| `account-country` | Sessions & Settings |
| `deletion-cancelled` | Deletion |
| `home-empty` | Home & Profile |
| `meds-dose-history` | Medications |
| `meds-tz-shift` | Medications (FR-023 timezone shift) |
| `post-deletion-login` | Deletion |
| `profile-emergency-contacts` | Home & Profile |

---

## 3. Per-screen override coverage (informational, not a hard gap)

`pages/` holds 4 of 29 possible per-screen override files: `deletion-preconfirm.md`, `disclosure.md`, `emergency-qr.md`, `profile-editor.md`. Per `MASTER.md`, overrides exist only when a screen needs to supersede the contract, so absence is by design — flagged only so reviewers know the other 25 screens rely entirely on `MASTER.md`.

---

## 4. Document drift

`tasks/design.md` shows D001–D027 as **`[X]` done**; the root `tasks.md` shows the same D001+ as **`[ ]` not done**. The two task files disagree on the design track's completion state. Resolve to one source of truth before trusting either as a progress signal.

---

## 5. Relationship to `reference-prototype/`

The `design/reference-prototype/` import (React/Babel, from claude.ai design project `50dccb01-9a43-45e3-b077-cb8d0be4a1f3`) does **not** fill these gaps:

- **Different stack** — React vs the P001 Flutter target.
- **Different screen set** — consumer-app screens (trends, records, prescriptions, appointments, nearby-map, body-map, quick-log) that are **not in the P001 inventory**; it lacks the governance screens P001 centers on (consolidated disclosure, deletion flow, sessions, emergency-QR public resolve, lockout/geofence).
- **Divergent tokens** — its `colors_and_type.css` is an app-local variant, not the locked `tokens.css`.

It IS, however, the same React source the Flutter-port tasks reference (`tasks.md` §1.6 / T035u cite `Balsm-Core/brand/design-system/balsm_app/`). So treat it as **porting reference for BalsmKit widgets**, not as the missing P001 mocks/specs.

---

## 6. Suggested remediation order

1. **Reconcile task state** — pick one task file as truth; un-check D003, D004–D014, D022, D024, D025–D027 (artifacts absent).
2. **Reopen the gate** — `REVIEW-SIGNOFF.md` approvals are not backed by mocks/findings; either produce the artifacts and re-review, or annotate the sign-off as provisional.
3. **Generate the mocks** (D004–D014) — the critical-path deliverable; everything downstream (review, a11y/motion/copy specs, Flutter port goldens) leans on them.
4. **Fill the missing spec docs** — `COMPONENT-CONTRACT.md`, `A11Y-SPEC.md`, `MOTION-SPEC.md`, `COPY-SPEC.md`, `tokens-snapshot.json`.
5. **Close prototype coverage** — add the 7 missing screens to `prototype/index.html`.

---

## 7. 2026-07-01 — Canonical design system imported (`51cdbf29`)

The canonical Balsm Design System (claude.ai/design project `51cdbf29-13b7-4206-9328-125fade14cc3`) now lives at `brand/design-system/` (repo root). It was originally imported to `design/_ds/balsm-design-system-51cdbf29-.../`; that mirror was collapsed to a pointer on 2026-08-13 — see its `IMPORT-LOG.md` for the manifest and history.

**Resolved / advanced:**
- **`reference-prototype/` superseded** — §5 above flagged it as a stale port of the older project `50dccb01`. The current canonical is now `51cdbf29`, mirrored in `_ds/`. Treat `reference-prototype/` as historical.
- **Tokens reconciled** — `tokens.css` synced to the imported `colors_and_type.css` (added `--balsm-expiring*`, the responsive `--bp/--container/--gutter/--cols` tokens, legacy `--balsm-teal-*/--balsm-blue-*` aliases, and the `'Segoe UI'` display-font fallback). Repo-only dark-mode + reduced-motion blocks preserved.
- **`mocks/` partially filled** (was 0 files, §1 "biggest hole"): `mocks/system/loading-and-progress.html` (live component gallery) added; `mocks/README.md` maps the auth/home/profile/report flows to the canonical runnable `balsm_app/` prototype. See `mocks/README.md`.

**Still outstanding (unchanged):**
- The **7 P001 governance flows** (disclosure, deletion, sessions, emergency-card, medications, country/lang, auth-states + `home-empty`) have **no mock** — the imported `balsm_app/` is a Balsm Care consumer self-report prototype and does not cover them. These remain the critical-path mock deliverable (§1, §2).
- `COMPONENT-CONTRACT.md`, `A11Y-SPEC.md`, `MOTION-SPEC.md`, `COPY-SPEC.md`, `tokens-snapshot.json` still absent.
- Design-track task-state disagreement (§4) unresolved.

**Not mirrored (upstream-only in the cloud project, fetch on request):** the 19 remaining `preview/` gallery pages, the `ui_kits/balsm_pharmacy` Balsm Pharmacy kit, the long-form `uploads/` docs, the compiled `_ds_bundle.js`, and `scratch/` dev screenshots. See `_ds/.../IMPORT-LOG.md`.
