# AI/ML Threat Library

Threats specific to AI/ML features in healthcare and regulated systems. Include this catalog only if the system has at least one AI feature (CDSS, ambient scribing, conversational assistants, predictive analytics, generative summaries, BYOK LLMs, etc.). Each row maps to the closest STRIDE category for cross-reference.

| ID | STRIDE | Threat | Attack Vector | Typical mitigation pattern |
| --- | --- | --- | --- | --- |
| AI01 | T / E | Prompt injection (direct) | User submits crafted text in a clinical note, chat, or form field that escapes the system prompt and redirects AI behaviour | Native role separation (`system` vs `user` messages), no string concatenation of user input into system prompt, schema-validated outputs, instruction-pattern detection on responses |
| AI02 | T | Indirect prompt injection | AI reads patient-submitted document, OCR output, or 3rd-party API response containing embedded instructions | Treat all retrieved content as untrusted data; chained AI calls re-validate intermediate outputs |
| AI03 | I | Context bleed / tenant isolation failure | Shared model context, mis-scoped session, or caching error leaks data across users/entities | Session scoped to single user+entity at creation, full context flush on session end, tenant-isolated keys, cross-tenant CI test |
| AI04 | T | Adversarial clinical input | Crafted edge values trigger false drug-interaction clearances, missed allergy flags, wrong dosage | Independent rule-based safety checks that AI cannot override, AI suggestions post-processed through rule engine, adversarial test suite pre-deploy |
| AI05 | E | Jailbreak / guardrail bypass | Role-play / encoding tricks / multi-turn sequences convince AI to ignore scope | Security-aware system-prompt review, multi-turn jailbreak tests in CI, AI must refuse + explain (not silently comply) |
| AI06 | I | Model inversion | Repeated queries extract statistical patterns reconstructing patient records or training data | Per-user / per-entity rate limits, no raw confidence scores for individual queries, anomaly alerting on enumeration patterns |
| AI07 | I | Model extraction / IP theft | High-volume queries reconstruct model weights or behaviour | Rate limits, query budgeting, watermarking outputs, terms of service |
| AI08 | T | Training-data poisoning | Compromised integration submits systematically wrong data to influence future training | Distribution validation pre-incorporation, outliers flagged for human review, training-data provenance per record |
| AI09 | T | Supply chain (3rd-party model / BYOK) | BYOK provider, add-on, or upstream model update introduces malicious behaviour or backdoors | Provider allowlist, security review pre-marketplace, model checksums/signing on update delivery, region tagging for residency |
| AI10 | D | AI denial of service | Flooded inference endpoints exhaust quotas, degrade clinical-support response | Per-user / per-entity / global burst rate limits, graceful degradation ("AI unavailable" not "error"), platform fully operational without AI |
| AI11 | E | Unauthorised capability escalation via tool-calling | Prompt manipulation or misconfigured tool-calling has AI write records, send messages, execute actions it should only suggest | No direct DB writes from AI, all AI-initiated actions through same authz pipeline as user actions, allowlist of callable tools enforced at framework layer, human confirmation required |
| AI12 | R | AI audit-trail tampering / gaps | Logs falsified or omitted to hide accepted AI suggestions | Append-only AI audit table, immutable, hash-chain integrated with platform audit (R01), record model ID + prompt hash + response hash + accept/reject + final action |
| AI13 | I | Data leakage via AI response | Misconfigured system prompt or over-permissive context causes AI to include patient IDs, schemas, internal URLs in responses | System prompt enumerates forbidden output (national-ID format, raw query results, schemas, URLs), response scanned for PII/PHI patterns and redacted+logged |
| AI14 | S | Session hijack via AI chat | Token theft, missing expiry, insecure websocket allows attacker to read/inject in live AI clinical conversation | Chat session bound to session token (cannot resume with different token), websocket enforces same auth/expiry as REST, encrypted in transit + at rest |
| AI15 | — | Bias-induced clinical harm | Model trained on non-representative data produces lower-quality output for specific demographics | Bias eval across age/gender/region (proxy for socioeconomic variance), no ship until mitigated or disclosed as known limitation |
| AI16 | S | AI-assisted social engineering | Attacker uses Balsm's writing/summarisation to craft phishing or impersonation messages | "AI-assisted" indicator on outbound generated content, human review required pre-send, rate limit + audit on bulk-generation patterns |

## Notes for the model writing the threat-model document

- **The AI catalog is a parallel block, not a replacement for STRIDE.** Keep STRIDE for everything else; add the AI table as its own section.
- **Don't repeat AI threats inside STRIDE sections.** The mapping column is for navigation only.
- **Always check if the system actually has AI features.** A telemedicine module that uses AI for transcription has AI threats. A telemedicine module that just streams video does not.
- **BYOK = Bring Your Own Key**, the pattern where the customer (entity admin) configures their own LLM API key — this changes the threat profile substantially because keys can be region-tagged, revoked per-entity, and provider can be swapped. Surface AI09 (supply chain) explicitly when BYOK is in scope.
- **Tool-calling / function-calling AI** has substantially higher risk because the model can take actions, not just produce text. Always include AI11 when the AI can call tools.
