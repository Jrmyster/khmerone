CREATE TABLE IF NOT EXISTS culture_entries (
  id TEXT PRIMARY KEY,
  manage_hash TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending','approved','withdrawn','rejected')),
  entry TEXT,
  submitted_at TEXT NOT NULL,
  CHECK ((status IN ('pending','approved') AND entry IS NOT NULL) OR
         (status IN ('withdrawn','rejected') AND entry IS NULL))
);
CREATE INDEX IF NOT EXISTS culture_entries_status ON culture_entries(status,id);
