-- Fingerprint templates stored per worker
CREATE TABLE IF NOT EXISTS "fingerprint" (
  "fingerprint_id"  SERIAL PRIMARY KEY,
  "worker_id"       INTEGER NOT NULL UNIQUE,
  "template"        TEXT NOT NULL,          -- base64-encoded DP template
  "finger_index"    INTEGER NOT NULL DEFAULT 0,
  "created_at"      TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at"      TIMESTAMP NOT NULL DEFAULT NOW()
);
