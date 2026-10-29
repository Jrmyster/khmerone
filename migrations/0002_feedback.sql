CREATE TABLE IF NOT EXISTS site_feedback (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL CHECK(category IN ('translation','link','instructions','other')),
  page TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open','resolved')),
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS site_feedback_queue ON site_feedback(status, created_at);
