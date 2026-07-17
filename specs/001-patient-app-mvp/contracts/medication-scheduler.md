# Medication Scheduler Contract

Spec refs: US3, FR-020…FR-024, FR-215, FR-217, SC-004, SC-015. Research §10, §14.

## Scheduling primitive

`flutter_local_notifications.zonedSchedule(id, title, body, tzDateTime, ...)` with:

- Android: `androidScheduleMode: AndroidScheduleMode.exactAllowWhileIdle` (Android 12+ exact-alarm permission requested at first reminder add).
- iOS: `UNCalendarNotificationTrigger`.

Both fire the OS-native notification — no foreground process required (covers SC-004 ±60 s with the device offline ≥7 days).

## Per-medication schedule shapes

Stored in `medication.schedule_payload` (JSON):

### Daily

```json
{ "kind": "daily", "times": ["08:00", "20:00"], "tz": "Africa/Cairo" }
```

`tz` is the user's `country_code` default IANA zone (resolved via Country Registry) at create time. Changing `country_code` does NOT silently shift the schedule — FR-023 confirmation applies.

### Weekly

```json
{ "kind": "weekly", "weekdays": ["fri"], "time": "19:00", "tz": "Asia/Riyadh" }
```

`weekdays` is a list of `mon`..`sun`. Multiple weekdays allowed.

### Custom (every-N-days)

```json
{ "kind": "custom", "interval_days": 2, "time": "14:00", "anchor_date": 1718380800000, "tz": "Asia/Dubai" }
```

`anchor_date` (UTC ms) is the day the schedule starts. Future fires = `anchor_date + N * interval_days` at `time` local-wall-clock.

## Scheduler heartbeat (research §10)

A daily `zonedSchedule` at 03:00 device-local rebuilds the next 30 days of OS-native triggers from the `medication` table.

- Handles OS pending-alarm caps (Android ~500, iOS 64) by maintaining a rolling 30-day horizon.
- Covers users who add a medication and then leave the app closed for weeks.
- Also rebuilds when:
  - User adds / edits / deletes a medication.
  - User confirms a timezone shift (FR-023).
  - User changes `country_code` (FR-203) and confirms the schedule-shift dialog.

## Notification payload

**PHI rule (binding — data-model.md §5b Q2 + FR-018)**: the visible notification MUST NOT contain the medication name, dose, schedule, or any clinical detail. Drug names appear only inside the app after unlock.

Title (localized, fixed string): "Time for your medication" / «موعد دوائك».
Body (localized, fixed string): "Open Balsm to see what's due." / «افتح بلسم لعرض المستحق».
`medication.name` and `medication.dose` MUST NEVER appear in `title`, `body`, `subtitle`, `summary`, or any watchOS / Android Wear preview.

Deep-link payload (data only, not shown on the lock screen): `meds.today?highlightDoseId=<doseId>` — routes to the Today screen with the due dose highlighted (FR-018a). When several doses collide at the same time, the payload routes to Today, which lists them behind the unlock.

Action buttons (localized; FR-021) — labels are generic and MUST NOT echo the medication name:
- `taken` → "Taken"
- `skipped` → "Skip" (opens reason picker after unlock)
- `snoozed_15m` → "Snooze 15 min"

Tapping outside the action buttons opens the in-app Today / medication detail screen (behind the device lock).

## Reason picker (US3 #2)

Modal-style picker presented after `skipped` action:

| Reason code | Localized label |
|---|---|
| `traveling` | "Traveling" |
| `not_home` | "Not at home" |
| `felt_better` | "Felt better" |
| `out_of_meds` | "Out of meds" |
| `other` | "Other (free text)" |

Selection writes `medication_dose_event(outcome='skipped', reason=<code>, note=<freetext if 'other'>)`.

## Snooze flow (US3 acceptance)

`snoozed_15m` action:

1. Write `medication_dose_event(outcome='snoozed', scheduled_at, actual_at)`.
2. Schedule a new one-shot `zonedSchedule` for `now() + 15 min` with the same medication context.
3. The follow-up notification's `Taken` / `Skip` / `Snooze` actions apply to the original dose (carries the same `scheduled_at`).

## Missed dose handling (US3 #3, US3 #8)

On app foreground:

1. Query `medication` for any scheduled dose whose `scheduled_at < now() - 30 min` AND no `medication_dose_event` with matching `(medication_id, scheduled_at)` exists.
2. Write `medication_dose_event(outcome='missed', scheduled_at = <derived>, actual_at = now())`.
3. Surface under "Today" with follow-up actions "Mark Taken late" / "Confirm Skip".

## Daily missed-dose summary (FR-024)

A daily `zonedSchedule` at 21:00 device-local fires only when at least one dose was missed that day:

1. At fire time, query missed doses for the day.
2. If `count > 0`, fire notification with title "{N} doses missed today" and action "Review" (deep-link to Today screen).
3. If `count = 0`, the notification is suppressed at fire time (using `flutter_local_notifications`' conditional check helper).

## Timezone-shift confirmation (FR-023, US3 #5)

Detected when `Platform.timeZoneName` differs from the user's stored TZ at app foreground.

1. App pauses any in-flight scheduling.
2. Modal: "Your timezone changed. Keep scheduled times at local wall clock or shift to new TZ?"
3. On accept → update all `medication.schedule_payload[].tz` → rebuild OS triggers.
4. On decline → no change; future doses still fire at the OLD `tz` wall clock.

## Country-change interaction (FR-203 + US6 #4)

When user changes country, the scheduler treats it as a one-time TZ confirmation:

1. New `country_code`'s IANA TZ is computed from Country Registry.
2. If different from the medication's current `tz`, the same FR-023 modal appears scoped to all medications.
3. Per-medication user choice is captured (not all-or-nothing); rebuild OS triggers.

## Append-only invariant (FR-022, ADR-12)

Every dose outcome writes a new `medication_dose_event` row — never UPDATE, never DELETE.

Corrections (US3 #6): user-initiated late edit produces a new row with `outcome='correction'` + `parent_event_id` pointing to the row being corrected.

SQLite triggers reject any UPDATE / DELETE attempt at the DB level (research §9).

## End-date handling (US3 #8)

When `medication.end_date < now()`:
- No new triggers are scheduled at the next heartbeat rebuild.
- Existing OS-level pending triggers past `end_date` are cancelled at the next heartbeat.
- Medication moves to "Inactive" list (FR-024 implication preserved).
- Past `medication_dose_event` rows for this medication are preserved (append-only).

## Reboot survival (US3 #7)

`flutter_local_notifications.zonedSchedule` with `androidScheduleMode: exactAllowWhileIdle` persists across reboot via `BOOT_COMPLETED` broadcast handled by the plugin's native side. No additional work needed.

## P002 forward-compat

- `medication.id` and `medication_dose_event.id` are UUID v7 (Q4 resolution) → P002 cloud sync of the timeline is collision-free across devices.
- `medication_dose_event.note` and `medication_dose_event.reason` preserve user wording verbatim per ADR-12 — P002 SNOMED CT / coded enrichment is lossless.
- `medication.name` + `medication.dose` are free-text — P002 RxNorm RxCUI tagging is deferred but lossless on top of the captured text.
