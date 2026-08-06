---
name: balsm-design
description: Use this skill to generate well-branded interfaces and assets for Balsm.health (بَلسَم) — the community-owned healthcare OS for the Arab world. Includes the official five-petal flower mark, the five-color petal palette, warm olive-gray neutrals, type system (Montserrat / IBM Plex Sans / IBM Plex Sans Arabic / Cairo / IBM Plex Mono), Lucide iconography, a Pharmacy POS UI kit (Slice 1), and a Patient App prototype (Slice 2). Brand promise: "Your care. Your data. Your system." Three words: Open. Arab. Owned.
user-invocable: true
---

## How to use this skill

Read `README.md` first — it is the canonical map of the design system, brand canvas, voice, values, and UI kits. For brand decisions, also read `uploads/balsm-brand-canvas.md` (locked, v1.0).

Minimum starter for any new artifact:
```html
<link rel="stylesheet" href="path/to/colors_and_type.css">
```

For production code, copy `colors_and_type.css` into the codebase — it is the single source of truth for all design tokens.

---

## Key files

| File | What it is |
|---|---|
| `README.md` | Design system manual + brand canvas summary. Read first. |
| `uploads/balsm-brand-canvas.md` | **Canonical brand reference (locked).** Mission, vision, promise, personality, voice, values, positioning, experience standard. |
| `colors_and_type.css` | Every CSS token — petals, neutrals, type, spacing, radii, shadows, motion. |
| `brand/logo-vertical.svg` | Five-petal flower + bilingual wordmark. Use as-is; do not redraw. |
| `brand/balsm-background.png` | Signature watercolor petal pattern — hero/welcome backdrops only. |
| `ui_kits/balsm_pharmacy/` | Pharmacy POS (Slice 1) — `atoms.jsx`, `shell.jsx`, `pos.jsx`, `inventory.jsx`, `customers.jsx`. |
| `patient_app/` | Patient app (Slice 2) — auth + self-reporting prototype. |

---

## Non-negotiables

1. **Brand promise** — every patient-facing surface must embody: "Your care. Your data. Your system." Patient data sovereignty is non-negotiable. Never imply data goes anywhere the user didn't choose.

2. **Brand name** — `Balsm.health` in product surfaces (`.health` one weight lighter). Arabic: `بَلسَم` with both diacritics (fatha on ب and on س). Without diacritics is incorrect.

3. **The flower mark has FIVE colors** — aqua, emerald, blue, mint, violet. Never recolor to a single hue.

4. **No medical-cliché iconography** for brand symbols (no cross, syringe, heart as logo). Lucide `pill` / `stethoscope` are fine inside the product; never as logo replacement.

5. **No emoji in product UI.** The five-petal flower is our emoji. Unicode arrows/bullets in copy are fine.

6. **Arabic is first-class.** Every surface must work with `dir="rtl"` and `--font-arabic`. Not localized after the fact — designed Arabic-first.

7. **Voice passes all three experience tests before shipping:**
   - **Frictionless** — does it just work without asking the user to think about infrastructure?
   - **Warm** — does it feel like a trusted colleague, not a cold system?
   - **Trustworthy** — does it reinforce or erode confidence in Balsm?

8. **Two voice registers — use the right one:**
   - 🩺 **Clinical/technical:** precise, one meaning per sentence, never softens hard truths, error messages explain and never blame. Active words: Trustworthy · Reliable · Honest · Clear.
   - 🌿 **Product/patient/community:** warm colleague tone, sovereignty language (patient is always in control), optimism is earned not assumed. Active words: Warm · Caring · Empowering · Human.

9. **Sovereignty language in patient-facing copy:**
   - ✅ "On your device, by design." / "Syncs only when you choose."
   - ✅ "Your details. Yours alone."
   - ❌ "Saved locally. Will sync when you reconnect." *(apologetic framing)*
   - ❌ "A copy reaches your doctor…" *(implies automatic data transfer)*

10. **What Balsm never sounds like:** cold & corporate · hyped & startup-bro · preachy & self-righteous · timid & apologetic.

11. **Egyptian formatting:** dates `DD/MM/YYYY` · currency `LE 245.00` · phones `+20 1X XXXX XXXX` · NID 14-digit grouped `2 9912 22 12345 6`.

12. **No glassmorphism, no frosted-glass cards, no bouncy animations.** Healthcare deserves stillness. `--ease-out cubic-bezier(0.16,1,0.3,1)` only.

13. **All designs must be adaptive and responsive for every device.** No fixed-width-only outputs. Every artifact must work and look intentional on:
   - 📱 **Mobile** (320px–480px) — full-viewport, touch targets ≥44px, safe-area insets
   - 📱 **Large phone** (480px–768px) — same, more breathing room
   - 📟 **Tablet portrait** (768px–1024px) — 2-column layouts, side panels emerge
   - 💻 **Desktop** (1024px+) — sidebar nav, multi-column grids, hover states
   - 🖥 **Wide desktop** (1280px+) — max-width containers, generous whitespace

   Use `colors_and_type.css` responsive utilities (`.container`, `.grid`, `.card-grid`, `.row-md`, `.show-mobile`/`.hide-mobile`). Use `clamp()` for fluid type. For mobile-app prototypes (patient app, phone flows): show the iOS/Android frame on tablet/desktop, full-viewport on real phones. Never leave desktop a broken stretched mess of a phone layout.

---

## Brand personality quick-check

Before writing copy or making a visual decision, ask:
- Is this context **clinical** (be serious, precise, trustworthy) or **patient/community** (be warm, empowering, optimistic)?
- Does this reinforce that the user — not Balsm, not a vendor — is in control?
- Does this feel like something a trusted healthcare professional would say?
- Would this land the same in Arabic as it does in English?

---

## When the user invokes this skill with no other guidance

Ask what they want to build:
- Which surface — Pharmacy POS (Slice 1, kitted) · Patient app (Slice 2, prototype built) · Doctor encounter (Slice 2, net-new) · Balsm Network (Slice 3, not designed)?
- What format — deck, clickable prototype, marketing page, single-screen mock, production code?
- English, Arabic, or bilingual?
- Do you have real content, or use placeholder data from the UI kit / patient app?

Then act as an expert designer who outputs HTML artifacts (or production code if requested). Pull tokens from `colors_and_type.css`, components from the UI kits, and the flower mark from `brand/`. Stay calm in tone, generous in spacing, warm in surface treatment — and always pass the frictionless + warm + trustworthy test.
