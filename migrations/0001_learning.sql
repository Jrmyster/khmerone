CREATE TABLE IF NOT EXISTS learning_files (
 id TEXT PRIMARY KEY, name TEXT NOT NULL, type TEXT NOT NULL, size INTEGER NOT NULL, created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS learning_resources (
 id TEXT PRIMARY KEY, title TEXT NOT NULL, school TEXT NOT NULL, province TEXT NOT NULL,
 kind TEXT NOT NULL CHECK(kind IN ('material','equipment','need')), subject TEXT NOT NULL,
 description TEXT NOT NULL, url TEXT NOT NULL DEFAULT '', lat REAL, lng REAL,
 attachment_id TEXT REFERENCES learning_files(id),
 status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected')),
 created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS learning_resources_public ON learning_resources(status, province, created_at);
