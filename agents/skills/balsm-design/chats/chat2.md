# Font Selection

_Started 2026-05-29 18:57 UTC_

---

## User

what font suggested?

## Assistant

_[tool: list_files]_

_[tool: read_file]_

The Balsm design system uses **four font families**:

- **Montserrat** — display/headings (`--font-display`), weights 400–800. Used for `.h-display` through `.h5` and the wordmark.
- **IBM Plex Sans** — body text (`--font-body`), weights 400–700. The default for `body`, paragraphs, eyebrows.
- **IBM Plex Sans Arabic** (with **Cairo** fallback) — Arabic/RTL text (`--font-arabic`), for بلسم and any `[dir="rtl"]` content.
- **IBM Plex Mono** — code/monospace (`--font-mono`).

So the short answer: **Montserrat for headlines, IBM Plex Sans for body** — that's the core pairing. Want me to mock up a type specimen showing the scale in action?

## User

we are going to start with the patient app first, with authentication, and self-reporting module

## Assistant

_[tool: read_file]_

_[tool: read_file]_

_[tool: list_files]_

Let me get up to speed on the project before we start — reading the system docs and seeing what UI kit / brand assets exist.

_[tool: list_files]_

_[tool: view_image]_

Let me look at the existing pharmacy UI kit to understand the component vocabulary, since the patient app should feel like part of the same family.

_[tool: read_file]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: questions_v2]_

This is net-new territory — the patient app (Slice 2) has no existing UI kit, so we'll design it fresh on top of the Balsm foundations. I've got the tokens, the five-petal brand, the voice/content rules, and the pharmacy kit's component vocabulary loaded. Before I build, a few important questions so I design the right thing.

## User

Questions timed out; go with defaults

## Assistant

_[tool: read_file]_

Defaults it is. Here's the direction I'm committing to:

- **Mobile app, iOS frame**, fully clickable prototype
- **English default with an Arabic/RTL toggle** in Tweaks (Balsm is Arabic-first)
- **Auth:** Welcome → phone (+20) → SMS OTP → profile setup
- **Self-reporting:** a **daily check-in for a chronic condition** (hypertension + diabetes — very Egypt-relevant) capturing mood, blood pressure, blood glucose, medication adherence, and pain/symptoms → summary → history & trends
- **Tweaks:** language/RTL, accent petal, font scale (patients skew older)

Let me read the kit's component CSS so the patient app shares the same DNA, and pull in the iOS frame.

_[tool: update_todos]_

_[tool: copy_starter_component]_

_[tool: copy_starter_component]_

I've absorbed the full component vocabulary. Now let me set up the patient app. Let me lay out a plan and grab the starter components.

_[tool: read_file]_

_[tool: copy_files]_

The frame is clean — I'll use `IOSDevice` for the bezel/status bar/home-indicator and render my own app content inside (no native nav bar). Now let me copy tokens and brand assets into the patient app folder.

_[tool: write_file]_

The frame and tokens are in place. Now the patient-app stylesheet — mobile, touch-first, sharing the Balsm DNA (warm neutrals, petal palette, calm motion). I'm building app-scoped type tokens that respond to a `--ui-scale` variable so the font-scale Tweak works cleanly, and an `--app-accent` so the accent-petal Tweak can retint the app.

_[tool: write_file]_

Stylesheet is in. Now the JavaScript. I'll split into focused files: a base (Icon, context, helpers), data/i18n (bilingual strings + sample patient data), then auth, report, home screens, and finally the app shell + Tweaks. Starting with the base and data layers.

_[tool: write_file]_

Now the data + bilingual copy layer. This holds the EN/AR string dictionary and the sample patient (Layla — Type 2 diabetes + hypertension, very representative for Egypt).

_[tool: write_file]_

Auth screens next — welcome (watercolor hero), phone entry, OTP, and profile setup.

_[tool: write_file]_

Now the centerpiece — the self-report check-in flow (mood → BP → glucose → meds → symptoms/note → summary).

_[tool: str_replace_edit]_

Let me fix a sloppy join expression in the summary.

_[tool: str_replace_edit]_

Now wiring the completed check-in back into app state. Let me update the summary to hand its data up via context, then build the home/trends/meds/profile screens.

_[tool: write_file]_

Now the four main app screens (home, trends, meds, profile) plus a small SVG chart helper.

_[tool: write_file]_

Finally, the app shell: router, tab bar, context provider, responsive scaling, and the Tweaks panel.

_[tool: str_replace_edit]_

_[tool: write_file]_

_[tool: show_html]_

Everything's wired. Let me preview it in my own iframe and check for console errors before handing off.

_[tool: show_html]_

_[tool: get_webview_logs]_

_[tool: save_screenshot]_

Clean — just the expected Babel notice and unrelated extension noise. Let me screenshot the welcome screen to verify it renders.

_[tool: view_image]_

_[tool: save_screenshot]_

It rendered the frame but the screen content is blank — let me inject a quick diagnostic into the DOM and re-screenshot to see what's actually happening.

_[tool: view_image]_

_[tool: save_screenshot]_

Content is in the DOM but not visible — a layout/stacking issue. Let me probe the actual geometry and computed styles.

_[tool: view_image]_

_[tool: save_screenshot]_

`.welcome` is at `opacity:0` — it's the `fade-in` animation caught at its start because Babel compilation delays mount past the capture. Let me confirm by capturing with a longer delay.

_[tool: view_image]_

_[tool: read_file]_

The overlay persisted (no reload) yet `.welcome` is still `opacity:0` — so it's not a timing issue, the element is permanently at the animation's start frame. That smells like the screen is remounting every render (animation keeps restarting). Let me check `useTweaks` for a render loop.

_[tool: str_replace_edit]_

`useTweaks` is clean and the panel returns null when closed, so there's no render loop. The `.welcome` animation is paused at its first frame (`opacity:0`) — a capture/offscreen-throttling artifact, but it's a real fragility: if the fade never runs, the whole screen is invisible. I'll make the entrance animation transform-only so content is never hidden by it.

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: show_html]_

The page didn't reload — that's a stale DOM with the old CSS and leftover overlay. Let me reload fresh and capture.

_[tool: sleep]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: multi_screenshot]_

The welcome screen renders beautifully — five-petal logo, balanced headline, blue CTA, trust strip. The transform-only fade fixed the blanking. Now let me drive through the flow to verify the deeper screens.

_[tool: str_replace_edit]_

The entire flow works end to end — phone, OTP, profile, home, and the check-in steps all render cleanly and on-brand. One small polish: the hero CTA pill wraps awkwardly ("Start check-in · About 2 minutes"). Let me tidy that.

_[tool: multi_screenshot]_

The flow is solid. Let me check the remaining main screens — trends (charts), meds, profile, and an RTL pass — by navigating from the current state.

_[tool: str_replace_edit]_

Every screen is strong — the trends charts read clearly, meds group by morning/evening with adherence ring, and RTL mirrors cleanly (tab bar flips, chevrons flip, numbers stay LTR). The RTL captures show some heading wrap/overlap, but those came through `html-to-image` (which mishandles RTL); I'll add nowrap safety on short headings and the name, then confirm with a real capture.

## User

resume

## Assistant

_[tool: str_replace_edit]_

Resuming. Let me finish the nowrap safety and verify with a real capture.Now a real (pixel) capture to confirm the hero fix and RTL render correctly. Let me reload, drive to home, and switch to Arabic.

_[tool: show_html]_

_[tool: sleep]_

_[tool: save_screenshot]_

_[tool: view_image]_

The hero CTA is now clean — "Start check-in" on its own line with "About 2 minutes" beneath. Let me confirm RTL renders correctly with a real capture.

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: update_todos]_

_[tool: snip]_

RTL home renders perfectly now — "آخر القياسات" stays on one line, the hero CTA is clean, the tab bar mirrors correctly, and numbers stay LTR. The build is solid across the full flow in both languages. Let me surface it to you and run final checks.

_[tool: done]_

_[tool: fork_verifier_agent]_

Done — the **Balsm patient app** (Slice 2) prototype is live in `patient_app/Patient App.html`. It's a fully clickable iOS prototype built on the Balsm tokens, five-petal brand, and calm clinical voice.

**What's in it**
- **Auth:** welcome (watercolor hero) → phone (+20) → SMS OTP → profile setup, with real inputs and validation
- **Self-reporting:** a 5-step daily check-in — mood faces → blood pressure (keypad) → blood glucose (with fasting/after-meal context) → medication adherence → pain slider + symptoms + note/photo → a "saved locally, will sync" summary
- **Home, Trends (BP + glucose charts), Meds (morning/evening + adherence), Profile** — wired to a bottom tab bar with a center check-in FAB
- **Sample patient:** Layla, Type 2 diabetes + hypertension (Egypt-representative)
- **Tweaks:** Arabic/RTL toggle (also in-app via Profile), accent petal, and a font-size slider for older patients

**Caveats / next steps**
- Net-new design (no prior patient-app UI existed), so this establishes the patient surface's vocabulary — worth a review against your roadmap.
- I noticed you attached **BUSINESS_FEATURES.md** — I didn't fold it in yet since it landed mid-build. If it specifies particular self-report fields, reminder logic, or care-loop linkage to the pharmacy POS, point me at the relevant sections and I'll align the flow.
- A background verifier is double-checking the build; I'll flag anything it surfaces.

What would you like to refine first — the check-in questionnaire content, or wiring it toward the doctor/pharmacy side?

