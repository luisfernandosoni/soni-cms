-- FTS5 Virtual Table for Fast Full-Text Search
-- Run this migration on D1 after main schema is created
-- 
-- IMPORTANT: Use lowercase 'fts5' not 'FTS5' (case-sensitive in D1)

-- Create FTS5 virtual table for transmissions search
CREATE VIRTUAL TABLE IF NOT EXISTS transmissions_fts USING fts5(
  title,
  excerpt,
  slug,
  content_rowid=id
);

-- Populate FTS index from existing transmissions
INSERT INTO transmissions_fts(rowid, title, excerpt, slug)
SELECT id, title, excerpt, slug FROM transmissions;

-- Create triggers to keep FTS index in sync

-- Trigger: After INSERT on transmissions
CREATE TRIGGER IF NOT EXISTS transmissions_fts_insert AFTER INSERT ON transmissions BEGIN
  INSERT INTO transmissions_fts(rowid, title, excerpt, slug)
  VALUES (NEW.id, NEW.title, NEW.excerpt, NEW.slug);
END;

-- Trigger: After UPDATE on transmissions
CREATE TRIGGER IF NOT EXISTS transmissions_fts_update AFTER UPDATE ON transmissions BEGIN
  DELETE FROM transmissions_fts WHERE rowid = OLD.id;
  INSERT INTO transmissions_fts(rowid, title, excerpt, slug)
  VALUES (NEW.id, NEW.title, NEW.excerpt, NEW.slug);
END;

-- Trigger: After DELETE on transmissions
CREATE TRIGGER IF NOT EXISTS transmissions_fts_delete AFTER DELETE ON transmissions BEGIN
  DELETE FROM transmissions_fts WHERE rowid = OLD.id;
END;
