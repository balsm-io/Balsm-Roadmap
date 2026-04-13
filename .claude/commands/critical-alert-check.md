# Critical Alert Check

Review changed files for life-critical notification and alert pathway integrity.

## Instructions

1. Run `git diff HEAD` (or `git diff --cached`) to identify all changed files.
2. Read each changed file that touches alert systems, critical notifications, clinical warning pathways, or emergency workflows.
3. Analyze for the following:

### Critical Lab Value Alerts
- Life-threatening lab results (panic values) not triggering immediate physician notification
- Critical value notification sent but delivery not confirmed/acknowledged
- Missing fallback notification channel if primary channel fails
- Critical value alert dismissible without documentation of acknowledgment
- Panic value notification not logged for regulatory compliance
- Alert thresholds hardcoded instead of configurable per entity/test type

### Critical Radiology Findings
- Urgent radiology findings (e.g., tension pneumothorax, acute stroke, pulmonary embolism) not triggering immediate notification to ordering physician
- Missing escalation pathway if the ordering physician doesn't acknowledge within a defined timeframe
- Critical imaging findings alert failing silently

### Clinical Deterioration Alerts
- Sepsis screening triggers not generating real-time alerts
- Patient deterioration scoring (NEWS, MEWS, PEWS) not integrated with alert system
- Drug allergy alerts bypassable without clinical justification and documentation
- Drug interaction alerts suppressible without override documentation

### Alert Delivery Reliability
- Alert sent through a single channel without fallback (must have at least primary + secondary)
- Alert system failing silently (no error logging, no retry, no escalation)
- Missing retry logic for undelivered critical alerts
- Alert queue that could lose messages on system restart (must be durable)
- Missing heartbeat or health check for the alert delivery system

### Alert Escalation
- No escalation pathway when the primary recipient doesn't acknowledge
- Escalation timers not configurable per alert type and severity
- Escalation chain that dead-ends without reaching a human
- Missing "last resort" broadcast to available on-call staff

### Emergency Workflows
- AI used for autonomous emergency triage (must always route to human responders)
- Emergency override access to records not logged with justification
- Emergency workflows that can be blocked by non-critical system failures (must degrade gracefully)
- Missing rapid-access pathway for emergency department staff

### Alert Audit Trail
- Critical alerts not logged: alert type, timestamp, recipient, delivery status, acknowledgment status
- Alert acknowledgment not recorded with user and timestamp
- Overridden/dismissed alerts not documented with reason
- Missing analytics on alert response times for quality improvement

### Alert Fatigue Prevention
- Alert system not supporting configurable severity tiers
- No mechanism to suppress duplicate alerts for the same condition within a timeframe
- Missing distinction between informational alerts and life-critical alerts in the UI
- Alert presentation that makes life-critical alerts indistinguishable from routine notifications

4. For each issue found, report:
   - File path and line number
   - Severity: CRITICAL (life-safety risk) / HIGH / MEDIUM
   - Category: LAB_ALERTS / RADIOLOGY_ALERTS / DETERIORATION / DELIVERY / ESCALATION / EMERGENCY / AUDIT / FATIGUE
   - Description
   - Suggested fix

5. If no issues are found, confirm the code passes critical alert review.
