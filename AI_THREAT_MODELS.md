# Balsm AI — Threat Models

> **Part of:** [AI_GOVERNANCE.md](./AI_GOVERNANCE.md) §11
> **Applies to:** All phases that introduce an AI feature
> **Maintenance rule:** Review this catalog when (a) a new AI feature is added, (b) the AI provider or model changes, or (c) a security incident involving AI occurs.

---

## How to Use This Document

- `BLOCKING` mitigations must be implemented before the affected feature ships.
- `REQUIRED` mitigations must be in the implementation plan for the relevant phase.
- Every phase spec that introduces an AI feature must reference the applicable threat IDs and confirm all `BLOCKING` mitigations are covered.

---

## Threat Catalog

| ID | Category | Threat | Attack Vector | Patient Safety Impact | Data Privacy Impact | Integrity Impact | Priority |
|----|----------|--------|--------------|----------------------|--------------------|--------------------|----------|
| T01 | Prompt Injection | Malicious user input overrides AI system prompt | User submits crafted text in a clinical note, chat message, or form field that escapes the system prompt context and redirects AI behavior | HIGH — AI may produce false clinical suggestions | HIGH — AI may be instructed to leak other patients' data | HIGH — AI may be made to produce fabricated records | CRITICAL |
| T02 | Indirect Prompt Injection | Injected instructions arrive via external content | AI reads a patient-submitted document, OCR output, or third-party API response that contains embedded instructions | HIGH | HIGH | HIGH | CRITICAL |
| T03 | Context Bleed / Tenant Isolation Failure | AI returns data from a different user's or entity's session | Shared model context window, misconfigured session scoping, or caching error causes cross-tenant data leakage | MEDIUM | CRITICAL — PHI of other patients exposed | HIGH | CRITICAL |
| T04 | Adversarial Clinical Input | Crafted inputs cause incorrect clinical AI suggestions | Attacker or negligent user submits edge-case clinical values engineered to trigger false drug interaction clearances, missed allergy flags, or incorrect dosage recommendations | CRITICAL | LOW | MEDIUM | CRITICAL |
| T05 | AI Jailbreak / Guardrail Bypass | User bypasses AI content and scope restrictions | Role-playing prompts, encoding tricks, or multi-turn prompt sequences that convince the AI to ignore its clinical scope restrictions and output dangerous or off-scope content | HIGH | MEDIUM | MEDIUM | HIGH |
| T06 | Model Inversion Attack | Attacker extracts patient data from AI model outputs | Repeated queries to a clinical AI model extract statistical patterns that reconstruct individual patient records or reveal training data | LOW | CRITICAL — reconstruction of PHI | MEDIUM | HIGH |
| T07 | Model Extraction / Intellectual Property Theft | Attacker replicates a proprietary AI model | High-volume API queries are used to reconstruct the AI model's weights or logic outside the platform | LOW | LOW | LOW | MEDIUM |
| T08 | Training Data Poisoning | Corrupted data degrades AI clinical accuracy | Attacker or compromised integration submits systematically incorrect clinical data to influence future model training | CRITICAL — degraded clinical suggestions affect all users | MEDIUM | HIGH | CRITICAL |
| T09 | Supply Chain Attack — Third-Party AI Model | Compromised AI model delivered via a third-party provider | A BYOK provider, add-on AI component, or upstream model update introduces malicious behavior, backdoors, or data exfiltration | HIGH | HIGH | HIGH | HIGH |
| T10 | AI Denial of Service | AI endpoints are flooded to degrade platform availability | High-volume requests to AI inference endpoints consume compute budget, exhaust API quotas, or degrade response time for legitimate clinical users | MEDIUM — delayed clinical support | LOW | HIGH | HIGH |
| T11 | Unauthorized Capability Escalation | AI takes actions beyond its intended scope | Through prompt manipulation or misconfigured tool-calling, the AI writes to patient records, sends messages, or executes actions it should only suggest | CRITICAL — unauthorized clinical writes | HIGH | CRITICAL | CRITICAL |
| T12 | Audit Trail Tampering | AI-generated audit logs are falsified or omitted | Attacker modifies logs to hide that an AI suggestion was accepted, or suppresses logs for AI-assisted actions to conceal accountability | MEDIUM | HIGH | CRITICAL | HIGH |
| T13 | Data Leakage via AI Response | AI response embeds raw PHI or internal system details | Misconfigured system prompt or over-permissive context injection causes AI to include patient IDs, medication history, or database schemas in its responses | LOW | CRITICAL | MEDIUM | HIGH |
| T14 | Session Hijack via AI Chat | Attacker takes over an AI chat session carrying PHI | Session token theft, missing session expiry, or insecure websocket connection allows an attacker to read or inject into a live AI clinical conversation | HIGH | CRITICAL | HIGH | CRITICAL |
| T15 | Bias-Induced Clinical Harm | AI consistently produces biased suggestions for specific patient demographics | Model trained on non-representative data produces lower-quality or systematically incorrect suggestions for certain age groups, genders, or ethnicities | CRITICAL — disproportionate harm to specific patient populations | MEDIUM | MEDIUM | HIGH |
| T16 | AI-Assisted Social Engineering | AI is used to craft convincing phishing or fraudulent communications | Attacker uses Balsm's AI writing or summarization features to generate authentic-looking messages impersonating doctors, pharmacists, or Balsm staff | MEDIUM | HIGH | HIGH | HIGH |

---

## Required Mitigations

### T01, T02 — Prompt Injection (BLOCKING)
- all user-supplied text passed to AI must be treated as untrusted data, never as instructions
- system prompts must be structurally separated from user content using the AI provider's native role/message separation (e.g., `system` vs `user` message roles) — string concatenation of user input into system prompts is forbidden
- output from AI that will be used as input to another AI call (chaining) must be re-validated before use
- AI responses must be validated against an expected schema — free-form responses that include instruction-like text (e.g., "ignore previous instructions") must be flagged and discarded

### T03 — Context Bleed (BLOCKING)
- every AI session must be scoped to a single authenticated user and entity at session creation — context window must be flushed completely on session end or user switch
- AI feature tests must include a cross-tenant isolation test: two users from different entities query the AI in parallel; neither must receive data from the other's session
- shared AI infrastructure (LLM API keys, context caches) must be tenant-isolated at the application layer — shared keys must never be used with commingled context

### T04 — Adversarial Clinical Input (BLOCKING)
- clinical rule-based safety checks (drug interactions, allergy flags, dosage limits) must run independently of AI and cannot be overridden by AI output
- AI clinical suggestions must be post-processed through the rule engine before display — an AI suggestion that contradicts a rule-based safety flag must be suppressed or demoted, never surfaced as the primary recommendation
- adversarial input test cases (known edge cases for clinical AI errors) must be part of the AI validation suite before deployment

### T05 — Jailbreak (REQUIRED)
- AI system prompts must be reviewed by a security-aware reviewer before deployment
- multi-turn conversation testing must be part of the AI feature's test suite — test cases must attempt to jailbreak scope restrictions over multiple turns
- AI must be instructed to refuse out-of-scope requests and explain why, not silently comply or produce an evasive answer

### T06 — Model Inversion (REQUIRED)
- rate limiting must be applied to all AI inference endpoints per user and per entity
- AI endpoints must not return raw confidence scores for queries about individual patients — scores must be aggregated or thresholded before display
- AI queries must be logged; anomalous query patterns (high volume, systematic enumeration) must trigger alerts

### T08 — Training Data Poisoning (BLOCKING when AI training is in scope)
- training data pipelines must validate statistical distributions of submitted data before incorporation — outlier data must be flagged for human review before training
- training data provenance must be recorded — every training record must be traceable to an authenticated source

### T09 — Supply Chain (REQUIRED)
- third-party AI models and add-ons must undergo a security review before marketplace approval (AI_GOVERNANCE.md §9)
- BYOK API keys must be validated against a known-safe provider allowlist before use — unrecognized endpoints must require explicit admin confirmation
- model checksums or signing must be verified on update delivery for any bundled AI model

### T10 — AI DoS (REQUIRED)
- AI inference endpoints must enforce per-user rate limits, per-entity rate limits, and global burst limits
- AI features must degrade gracefully when quotas are exhausted — the platform must remain fully operational without AI; clinical users must see a clear "AI unavailable" state, not an error

### T11 — Unauthorized Capability Escalation (BLOCKING)
- AI must not have direct database write access — all AI-initiated writes must go through the same authorization and validation pipeline as user-initiated writes
- tool-calling / function-calling AI features must define an explicit allowlist of callable actions — any action not on the allowlist must be rejected at the framework layer, not handled by prompt instruction
- every AI-initiated action must be attributed in the audit log as AI-originated and must require human confirmation before execution

### T12 — Audit Trail Tampering (BLOCKING)
- AI audit log entries must be written as append-only immutable records — no update or delete path must exist for AI audit entries
- AI audit entries must record: model ID, prompt hash, response hash, user ID, entity ID, action taken, and accept/reject decision by the user

### T13 — Data Leakage via Response (BLOCKING)
- AI system prompts must specify what the AI is NOT allowed to include in responses (e.g., national IDs, raw database query results, internal URLs, schema names)
- AI responses must be scanned for PII/PHI patterns (national ID format, phone number format) before display — matches must be redacted and logged

### T14 — Session Hijack via AI Chat (BLOCKING)
- AI chat sessions must be bound to the authenticated session token — chat cannot be resumed with a different token
- AI chat websocket connections must enforce the same authentication and session expiry as REST API calls
- AI chat session contents must be encrypted in transit and at rest

### T15 — Bias-Induced Harm (REQUIRED)
- bias evaluation (AI_GOVERNANCE.md §6) must include demographic subgroup analysis across age, gender, and governorate (as a proxy for socioeconomic and regional variance in Egypt)
- features that produce systematically different quality outputs for any demographic must not ship until the bias is mitigated or explicitly disclosed as a known limitation
