# Ambient Scribe Review

Review changed files implementing AI-powered clinical documentation / ambient scribing for safety and governance compliance.

## Instructions

1. Run `git diff HEAD` (or `git diff --cached`) to identify all changed files.
2. Read each changed file that touches ambient scribing, clinical documentation AI, audio recording, or AI-generated clinical notes.
3. Analyze for the following:

### Audio Data Handling
- Audio recordings stored permanently after note generation (must be deleted after processing)
- Audio data stored without encryption at rest
- Audio transmitted to external services without encryption
- Audio storage location not configurable by entity (some regulations require local-only processing)
- Missing audio retention policy configuration
- Audio data accessible to users beyond the recording session participants

### Consent & Privacy
- Recording started without explicit consent from all parties (doctor and patient)
- Missing consent capture mechanism before audio recording begins
- Consent not recorded with timestamp and party identifiers
- Patient unable to opt out of ambient scribing during a visit
- Missing disclosure that AI is processing the conversation

### Generated Note Review
- AI-generated clinical note saved to patient record without explicit doctor review and approval
- Doctor approval step skippable or auto-completed
- No mechanism for the doctor to edit, modify, or reject the generated note before saving
- Generated note not visually distinct from doctor-written notes (must be labeled "AI-generated")
- Missing audit trail entry recording: AI generated the initial note, doctor reviewed and approved/modified it

### Confidence & Quality
- Low-confidence transcription segments not highlighted for doctor attention
- Missing confidence indicator on generated notes or sections
- No mechanism to flag and report inaccurate transcription or note generation
- Missing quality metrics tracking (acceptance rate, modification rate, rejection rate)

### Context Isolation
- Ambient scribe context from one patient session bleeding into another
- Previous patient's conversation data influencing current session
- Audio buffer or transcription cache not cleared between sessions
- Session context persisting after the doctor closes the encounter

### Data Flow Security
- Audio or transcription data sent to external AI services without de-identification
- PHI in the generated note sent to unencrypted endpoints
- Intermediate transcription artifacts not cleaned up after processing
- Missing audit log for all data sent to AI services during scribing

### Kill Switch & Control
- No mechanism to disable ambient scribing independently per entity
- Disabling scribing affects other AI features
- No fallback when AI service is unavailable (doctor must be able to document manually)
- Missing real-time indicator showing when scribing is active

4. For each issue found, report:
   - File path and line number
   - Severity: CRITICAL / HIGH / MEDIUM
   - Category: AUDIO / CONSENT / REVIEW / CONFIDENCE / ISOLATION / SECURITY / CONTROL
   - Description
   - Suggested fix

5. If no issues are found, confirm the code passes ambient scribe review.
