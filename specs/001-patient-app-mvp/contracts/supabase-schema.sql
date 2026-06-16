-- Patient App MVP (P001) — Supabase Postgres schema (non-PHI only)
-- All clinical PHI lives on-device per ADR-10 + ADR-11; this file MUST NOT add any PHI column.
-- Per Q2 resolution 2026-06-14: single EU region; per Q4 resolution: PHI tables (on-device) use UUID v7, cloud tables use gen_random_uuid() except auth.users.

-- =============================================================================
-- Extensions
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "citext";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";  -- gen_random_uuid + sha256 for deletion_log

-- =============================================================================
-- public.user_account
-- =============================================================================

CREATE TABLE public.user_account (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  handle citext UNIQUE,
  display_name text,
  bio text,
  date_of_birth_ciphertext bytea,  -- PHI per 2026-06-15 Path-ii. Encrypted via pgp_sym_encrypt(date::text, key). Writes go through Edge Function `set-dob`; client never writes plaintext.
  country_code char(2) NOT NULL,
  preferred_language text NOT NULL DEFAULT 'en',
  deletion_state text NOT NULL DEFAULT 'ACTIVE'
    CHECK (deletion_state IN ('ACTIVE', 'DELETION_REQUESTED', 'DELETION_CANCELLED')),
  deletion_confirmed_at timestamptz,
  deletion_grace_until timestamptz,
  CHECK (deletion_grace_until IS NULL OR deletion_confirmed_at IS NULL OR deletion_grace_until <= deletion_confirmed_at + interval '14 days'),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (handle IS NULL OR handle ~ '^[a-z0-9_.]{3,30}$'),
  CHECK (country_code ~ '^[A-Z]{2}$')
);

CREATE TRIGGER user_account_updated_at
  BEFORE UPDATE ON public.user_account
  FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

CREATE INDEX user_account_handle_idx ON public.user_account (handle) WHERE handle IS NOT NULL;
CREATE INDEX user_account_deletion_idx ON public.user_account (deletion_grace_until)
  WHERE deletion_state = 'DELETION_REQUESTED';

-- =============================================================================
-- public.active_session
-- =============================================================================

CREATE TABLE public.active_session (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.user_account(id) ON DELETE CASCADE,
  device_id uuid NOT NULL,
  device_label text NOT NULL,
  device_type text NOT NULL CHECK (device_type IN ('phone', 'tablet', 'desktop', 'web')),
  first_seen_at timestamptz NOT NULL DEFAULT now(),
  last_activity_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz
);

CREATE INDEX active_session_active_idx ON public.active_session (user_id, last_activity_at DESC)
  WHERE revoked_at IS NULL;
CREATE UNIQUE INDEX active_session_one_per_device ON public.active_session (user_id, device_id)
  WHERE revoked_at IS NULL;

-- =============================================================================
-- public.account_lockout
-- =============================================================================

CREATE TABLE public.account_lockout (
  identifier text PRIMARY KEY,
  identifier_type text NOT NULL CHECK (identifier_type IN ('email', 'apple_sub', 'google_sub', 'handle')),
  failed_attempts smallint NOT NULL DEFAULT 0 CHECK (failed_attempts >= 0),
  rolling_window_started_at timestamptz NOT NULL DEFAULT now(),
  locked_until timestamptz
);

CREATE INDEX account_lockout_active_idx ON public.account_lockout (locked_until)
  WHERE locked_until IS NOT NULL;

-- =============================================================================
-- public.username_reservation
-- =============================================================================

CREATE TABLE public.username_reservation (
  handle_normalized citext PRIMARY KEY CHECK (handle_normalized ~ '^[a-z0-9_.]{3,30}$'),
  user_id uuid NOT NULL REFERENCES public.user_account(id) ON DELETE CASCADE,
  claimed_at timestamptz NOT NULL DEFAULT now(),
  released_at timestamptz
);

CREATE INDEX username_reservation_active_idx ON public.username_reservation (handle_normalized)
  WHERE released_at IS NULL;

-- =============================================================================
-- public.reserved_handle_blocklist
-- =============================================================================

CREATE TABLE public.reserved_handle_blocklist (
  handle_normalized citext PRIMARY KEY,
  added_by text NOT NULL DEFAULT 'system',
  added_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.reserved_handle_blocklist (handle_normalized) VALUES
  ('admin'), ('balsm'), ('support'), ('api'), ('help'), ('null'), ('health')
ON CONFLICT (handle_normalized) DO NOTHING;

-- =============================================================================
-- public.emergency_qr_token
-- =============================================================================

CREATE TABLE public.emergency_qr_token (
  jti uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.user_account(id) ON DELETE CASCADE,
  ciphertext bytea NOT NULL,
  profile_etag char(8) NOT NULL,
  ttl_seconds int NOT NULL CHECK (ttl_seconds IN (3600, 21600, 86400, 604800)),
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX emergency_qr_token_resolve_idx
  ON public.emergency_qr_token (jti, revoked_at, expires_at);
CREATE UNIQUE INDEX emergency_qr_token_one_active_per_user
  ON public.emergency_qr_token (user_id)
  WHERE revoked_at IS NULL AND expires_at > now();

-- =============================================================================
-- public.deletion_log
-- =============================================================================

CREATE TABLE public.deletion_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id_hash text NOT NULL,
  country_code_at_deletion char(2) NOT NULL,
  reason_code text CHECK (reason_code IS NULL OR reason_code IN ('user_request', 'cancelled', 'support_request')),
  apple_revoke_status text CHECK (apple_revoke_status IS NULL OR apple_revoke_status IN ('not_applicable', 'succeeded', 'failed_final', 'failed_retrying')),
  created_at timestamptz NOT NULL DEFAULT now(),
  purge_at timestamptz NOT NULL DEFAULT (now() + interval '2 years')
);

CREATE INDEX deletion_log_purge_idx ON public.deletion_log (purge_at);

-- =============================================================================
-- public.disclosure_acceptance (cloud mirror of on-device canonical)
-- =============================================================================

CREATE TABLE public.disclosure_acceptance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.user_account(id) ON DELETE CASCADE,
  disclosure_id text NOT NULL,
  version text NOT NULL,
  country_code_at_accept char(2) NOT NULL,
  supervisory_authority_name_at_accept text NOT NULL,
  preferred_language_at_accept text NOT NULL,
  accepted_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, disclosure_id, version)
);

-- =============================================================================
-- public.denied_country_blocklist (Q1 resolution)
-- =============================================================================

CREATE TABLE public.denied_country_blocklist (
  country_code char(2) PRIMARY KEY CHECK (country_code ~ '^[A-Z]{2}$'),
  source text NOT NULL CHECK (source IN ('ofac', 'apple_denied', 'google_denied', 'manual')),
  added_at timestamptz NOT NULL DEFAULT now()
);

-- Seed kept in repo YAML; loaded by CI from packaging/blocklist/denied-countries.yml
-- Example rows (not exhaustive):
INSERT INTO public.denied_country_blocklist (country_code, source) VALUES
  ('CU', 'ofac'),  -- Cuba
  ('IR', 'ofac'),  -- Iran
  ('KP', 'ofac'),  -- North Korea
  ('SY', 'ofac')   -- Syria
ON CONFLICT (country_code) DO NOTHING;
-- Full list refreshed quarterly per data-model.md §1.10.

-- =============================================================================
-- public.user_account_audit_log (NEW 2026-06-15, Path-ii FR-048)
-- =============================================================================

CREATE TABLE public.user_account_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  target_user_id uuid NOT NULL REFERENCES public.user_account(id) ON DELETE CASCADE,
  actor_user_id uuid NOT NULL,
  read_at timestamptz NOT NULL DEFAULT now(),
  source_ip inet,
  correlation_id uuid NOT NULL
);

CREATE INDEX user_account_audit_log_target_idx
  ON public.user_account_audit_log (target_user_id, read_at DESC);

-- =============================================================================
-- Encryption key bootstrap (Path-ii FR-047)
-- =============================================================================

-- Server-side symmetric key for date_of_birth_ciphertext lives in Supabase secrets
-- (env var DOB_ENCRYPTION_KEY). Rotated annually. Edge Functions decrypt on demand:
--   SELECT pgp_sym_decrypt(date_of_birth_ciphertext, current_setting('app.dob_key'))
-- Direct SELECT from the client returns the ciphertext bytea; client cannot decrypt.
