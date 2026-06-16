# P001 Design Review Sign-Off

> **Gate**: Phase 3+ Flutter implementation (T071+) is blocked until ALL stakeholders sign below.
> Per `../tasks.md` D023.

## Artifacts under review

- `MASTER.md` — design contract
- `SCREEN-INVENTORY.md` — 24 screens × variants
- `prototype/index.html` — interactive prototype
- `pages/*` — per-screen overrides (where present)
- `REVIEW-CHECKLIST.md` — 6-pillar rubric used during review

## Review session

- Date: _________
- Facilitator: _________
- Attendees: _________
- Findings file: `findings/__________.md`

## Per-flow approval

| Flow | Screens | PM | Design Lead | Eng Lead | Compliance Lead | Notes |
|---|---|---|---|---|---|---|
| **Auth & Disclosure** | auth-country, auth-email, auth-otp, auth-social, auth-lockout, auth-blocked, disclosure | ☐ | ☐ | ☐ | ☐ | |
| **Home & Profile** | home, home-empty, account-handle, profile-editor, profile-emergency-contacts | ☐ | ☐ | ☐ | ☐ | |
| **Emergency Card & QR** | emergency-card, emergency-qr, emergency-public | ☐ | ☐ | ☐ | ☐ | |
| **Medications** | meds-list, meds-add, meds-today, meds-dose-history, meds-tz-shift | ☐ | ☐ | ☐ | ☐ | |
| **Deletion** | deletion-preconfirm, deletion-confirm, deletion-cancelled, deletion-public, post-deletion-login | ☐ | ☐ | ☐ | ☐ | |
| **Sessions & Settings** | sessions-list, account-country, account-language | ☐ | ☐ | ☐ | ☐ | |
| **System** | not-found | ☐ | ☐ | ☐ | ☐ | |

## Open questions resolution

From MASTER.md §11:
- [ ] Q1: Bottom-nav RTL order — resolution: _________
- [ ] Q2: Petal gradient on Home app bar — resolution: _________
- [ ] Q3: Emergency QR module color — resolution: _________
- [ ] Q4: Public-page Balsm-logo prominence — resolution: _________
- [ ] Q5: Dynamic Type 200% bottom-nav behavior — resolution: _________

## Final sign-off

By signing below, signatories confirm:
1. They've walked through the prototype end-to-end in at least 1 light + 1 dark + 1 RTL variant
2. They've reviewed `MASTER.md` and accept it as the implementation contract
3. Any blocker findings have been resolved or explicitly deferred to P002 with written rationale
4. The `tokens-snapshot.json` (D024) matches the brand source at sign-off time

| Role | Name | Signature | Date |
|---|---|---|---|
| PM | | | |
| Design Lead | | | |
| Eng Lead | | | |
| Compliance Lead | | | |

**Once all 4 rows signed**: tasks T071 onward unblocked. Add a commit to this file titled `[Design] sign-off complete YYYY-MM-DD`.
