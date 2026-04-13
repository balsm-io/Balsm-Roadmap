# Balsm Healthcare Platform — AI Rules & Governance

## 1. Guiding Principles

- AI features in Balsm are **assistive tools** — they support human decision-making but never replace it
- patient safety is the highest priority — no AI output may be acted upon automatically in clinical contexts without human review and confirmation
- all AI features must be optional and configurable — entities can enable or disable AI capabilities based on their policies and regulatory environment
- AI must be designed to reduce workload and improve outcomes, not to cut corners or bypass clinical judgment
- the platform must function fully without AI — AI is an enhancement layer, not a dependency

---

## 2. Clinical AI Rules

### 2.1 Decision Support Only
- AI may suggest diagnoses, treatment options, or flags — it must never autonomously make clinical decisions, prescribe medications, or alter patient records
- all AI-generated clinical suggestions must be clearly labeled as "AI-assisted" and visually distinct from human-entered data
- doctors must explicitly accept, modify, or reject every AI suggestion before it becomes part of the patient record
- AI suggestions must not appear as default selections in clinical forms — they must require an active action to adopt

### 2.2 Scope Boundaries
- AI must not override or contradict prescription validation rules (drug interactions, allergy checks, dosage limits) — these remain rule-based safety checks
- AI must not have write access to patient records — only authorized clinical users can create or modify clinical data
- AI must not autonomously communicate with patients (no AI-generated messages, notifications, or recommendations sent directly to patients without provider review)

### 2.3 Clinical Validation
- every clinical AI model must be validated against peer-reviewed medical standards before deployment
- clinical AI outputs must include confidence scores where applicable, so providers can assess reliability
- AI models used for clinical decision support must be reviewed and re-validated at least annually or when underlying training data changes

---

## 3. Data Usage & Privacy

### 3.1 Training Data Rules
- patient data must not be used to train AI models without explicit, informed patient consent
- consent for AI data usage must be separate from general terms of service — it must be a distinct, optional opt-in
- patients must be able to withdraw AI data consent at any time, and their data must be excluded from future training cycles
- training data must be de-identified and anonymized in compliance with HIPAA and GDPR before use
- AI models must not be capable of reconstructing or identifying individual patients from their training data

### 3.2 Data Boundaries
- AI features must operate within the same data access boundaries as the user invoking them — AI cannot access data that the current user is not authorized to see
- AI must not aggregate data across entities or tenants unless explicitly authorized through a data sharing agreement
- federated Balsm instances must not share patient data for AI purposes across instances without explicit cross-instance data agreements
- self-hosted instances have full control over whether AI features process data locally or communicate with external AI services

### 3.3 External AI Services
- if AI features rely on external services, patient data must never be sent to those services in identifiable form
- external AI service providers must be disclosed to entity administrators
- entities must be able to opt out of external AI services entirely and still use the platform without degradation
- all data sent to external AI services must be logged for audit purposes

### 3.4 AI Chat & Conversation Security
- AI chat conversations (doctor assistants, patient-facing chatbots, admin copilots) must be treated as PHI if they contain or reference patient data
- AI chat history must be stored encrypted at rest with the same standards as clinical records
- AI chat sessions must respect the same RBAC and data access boundaries as the invoking user — the AI must not surface data from other patients, entities, or tenants
- AI chat conversations must never be used as training data without explicit, separate consent from all parties involved
- AI chat logs must be included in the audit trail — what was asked, what was returned, and by which user
- AI chat sessions must have configurable retention periods — entities can define how long AI conversation history is stored before automatic deletion
- patients must be able to view, export, and request deletion of their AI chat history
- AI chat must not persist sensitive data (passwords, payment details, full national IDs) in conversation history — such inputs must be detected and redacted before storage
- AI chat sessions must be terminated and cleared when the user logs out or the session expires
- AI chat must enforce rate limiting to prevent abuse and prompt injection attacks
- AI responses must be sanitized to prevent injection of malicious content (scripts, links, executable instructions) into the UI

### 3.5 Data Leakage Prevention
- AI models and features must not leak data between users, sessions, or tenants through cached context, shared model state, or conversation bleed
- prompts sent to AI services must be stripped of unnecessary context — send only the minimum data required for the task
- AI conversation context windows must be scoped to the current session — previous users' conversations must never influence current responses
- AI features must not return raw database content, internal system details, or infrastructure information in their responses
- error messages from AI services must be sanitized before displaying to users — internal errors must not expose system architecture or data schemas

---

## 4. Transparency & Explainability

### 4.1 Transparency Requirements
- users must be clearly informed when they are interacting with AI-generated content or suggestions
- the system must maintain a registry of all active AI models/features, including their purpose, inputs, and limitations
- entity administrators must have access to documentation explaining what each AI feature does, what data it uses, and how it generates outputs
- patients must be informed if AI was involved in any aspect of their care through clear disclosure in their records

### 4.2 Explainability
- clinical AI suggestions must provide reasoning or contributing factors whenever possible (e.g., "flagged due to elevated lab values and family history")
- AI-driven administrative decisions (scheduling optimization, resource allocation) must be auditable and their logic reviewable by administrators
- black-box models without any explainability mechanism must not be used for clinical decision support

---

## 5. Human Oversight & Accountability

### 5.1 Human-in-the-Loop
- all clinical AI workflows must have a mandatory human approval step before any action is taken
- AI-generated content (summaries, reports, recommendations) must be reviewed and approved by an authorized user before being finalized or shared
- there must be a clear and easy mechanism for users to override, dismiss, or report incorrect AI outputs

### 5.2 Accountability
- accountability for clinical decisions always rests with the human provider, never with the AI system
- AI actions must be attributed in audit logs — logs must record that a suggestion originated from AI, which model produced it, and which user accepted or rejected it
- errors or adverse outcomes involving AI-assisted decisions must be reportable through the platform's incident reporting system, with the AI component clearly identified

### 5.3 Kill Switch
- entity administrators must be able to disable any individual AI feature or all AI features instantly without affecting core platform operations
- if an AI model is found to produce harmful or unreliable outputs, the platform must support immediate deactivation across all instances (SaaS) or provide urgent update mechanisms (self-hosted)

---

## 6. Bias & Fairness

- AI models must be evaluated for bias across demographics (age, gender, ethnicity, socioeconomic status) before deployment and on an ongoing basis
- bias evaluation results must be documented and made available to entity administrators upon request
- if bias is detected, the affected AI feature must be flagged, and corrective action must be taken before continued use
- training datasets must be representative and diverse — known gaps in training data must be disclosed as model limitations
- AI must not be used for eligibility determinations, access restrictions, or prioritization decisions that could result in discriminatory outcomes

---

## 7. Administrative & Operational AI Rules

- AI-assisted administrative features (scheduling optimization, billing suggestions, inventory forecasting) must present recommendations that staff can accept, modify, or reject
- administrative AI must not autonomously execute financial transactions, modify billing codes, or alter inventory orders without human confirmation
- AI-generated analytics and reports must be clearly labeled to distinguish AI-derived insights from raw data summaries
- AI usage metrics (how often suggestions are accepted, rejected, or modified) must be tracked to evaluate effectiveness and identify issues

---

## 8. Patient-Facing AI Rules

- AI-generated health recommendations shown to patients must be reviewed and approved by a licensed provider before delivery
- patients must be able to opt out of receiving AI-generated content without affecting their access to care
- AI must not be used to triage emergency situations autonomously — emergency workflows must always route to human responders
- patient-facing AI content must include disclaimers stating it does not replace professional medical advice

---

## 9. Add-On & Third-Party AI Rules

- third-party add-ons that include AI capabilities must declare their AI components, data usage, and model sources during the marketplace review process
- add-on AI features are subject to the same rules in this document as core platform AI features
- add-ons must not train models on Balsm platform data unless explicitly permitted by the entity administrator and consented to by affected patients
- the marketplace review process must include an AI-specific evaluation for any add-on that incorporates AI capabilities

---

## 10. Monitoring & Continuous Improvement

- AI model performance must be continuously monitored in production for accuracy degradation, drift, and unexpected behavior
- AI-related incidents (incorrect suggestions, bias reports, data concerns) must be tracked and reviewed through a dedicated feedback loop
- AI models must be versioned — every update to a model must be logged with a changelog, and rollback to a previous version must be supported
- regular reviews (at least annually) must assess whether each AI feature continues to meet its intended purpose and complies with current regulations
- user feedback on AI suggestions (accept/reject/modify patterns) must be collected and analyzed to guide model improvement
