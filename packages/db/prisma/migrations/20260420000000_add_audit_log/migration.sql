CREATE TABLE IF NOT EXISTS "audit_log" (
  "audit_id"    SERIAL PRIMARY KEY,
  "person_id"   INTEGER,
  "action"      TEXT NOT NULL,
  "entity"      TEXT NOT NULL,
  "entity_id"   TEXT,
  "description" TEXT,
  "metadata"    JSONB,
  "ip"          TEXT,
  "created_at"  TIMESTAMP NOT NULL DEFAULT NOW()
);
