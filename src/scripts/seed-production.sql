-- Production Seed Data for Soni CMS
-- Schema-aligned for Payload 3.0 D1 database
-- Execute with: pnpm exec wrangler d1 execute D1 --file=src/scripts/seed-production.sql --remote

-- ============================================
-- 1. Placeholder Media (required for hero_image_id)
-- ============================================
INSERT OR IGNORE INTO media (id, alt_text, url, filename, mime_type, filesize, width, height)
VALUES (
  1,
  'Placeholder Hero Image',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=630&fit=crop',
  'hero-placeholder.jpg',
  'image/jpeg',
  50000,
  1200,
  630
);

-- ============================================
-- 2. Authors
-- ============================================
INSERT OR IGNORE INTO authors (id, name, role, status)
VALUES 
  (1, 'Soni Gupta', 'Founder & Creative Director', 'active'),
  (2, 'Alex Chen', 'Lead Engineer', 'active');

-- ============================================
-- 3. Categories
-- ============================================
INSERT OR IGNORE INTO categories (id, title, slug, description, accent_color)
VALUES 
  (1, 'Technology', 'technology', 'Deep dives into emerging tech and engineering', '#6366F1'),
  (2, 'Design', 'design', 'UI/UX, product design, and visual aesthetics', '#EC4899'),
  (3, 'Culture', 'culture', 'Trends, observations, and cultural commentary', '#F59E0B');

-- ============================================
-- 4. Tags
-- ============================================
INSERT OR IGNORE INTO tags (id, title, slug)
VALUES 
  (1, 'Cloudflare', 'cloudflare'),
  (2, 'Edge Computing', 'edge-computing'),
  (3, 'AI', 'ai'),
  (4, 'Typography', 'typography'),
  (5, 'React', 'react');

-- ============================================
-- 5. Transmissions (Sample Posts)
-- ============================================
INSERT OR IGNORE INTO transmissions (
  id, title, slug, excerpt, hero_image_id, author_id, category_id, status, published_at
) VALUES 
(
  1,
  'Welcome to Soni New Media',
  'welcome',
  'A first look at the new digital frontier where technology meets creativity.',
  1, 1, 1,
  'published',
  strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
),
(
  2,
  'The Edge of Tomorrow: Cloudflare Workers AI',
  'edge-of-tomorrow-cloudflare-workers-ai',
  'How vector embeddings and semantic search are revolutionizing content discovery at the edge.',
  1, 2, 1,
  'published',
  strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-1 day')
),
(
  3,
  'Designing for the Invisible Interface',
  'designing-invisible-interface',
  'The best design is the one you dont notice. Exploring ambient computing and zero-UI paradigms.',
  1, 1, 2,
  'published',
  strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-2 days')
),
(
  4,
  'React Server Components: A New Mental Model',
  'react-server-components-mental-model',
  'Understanding the paradigm shift in how we build modern web applications.',
  1, 2, 1,
  'published',
  strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-3 days')
);

-- ============================================
-- 6. Statement Blocks for Transmissions
-- ============================================
INSERT OR IGNORE INTO transmissions_blocks_statement (id, _order, _parent_id, _path, text, size, alignment, attribution)
VALUES 
  ('stmt-1', 0, 1, 'layout', 'The future is not something we enter. The future is something we create.', 'display', 'center', NULL),
  ('stmt-2', 0, 2, 'layout', 'The future of search is not keywords. Its meaning.', 'h1', 'center', NULL),
  ('stmt-3', 0, 3, 'layout', 'Design is not just what it looks like. Design is how it works.', 'h1', 'center', 'Steve Jobs'),
  ('stmt-4', 0, 4, 'layout', 'React Server Components changed everything.', 'h2', 'center', NULL);

-- ============================================
-- 7. Transmission-Tags Relationships
-- ============================================
INSERT OR IGNORE INTO transmissions_rels (id, parent_id, path, tags_id)
VALUES 
  (1, 1, 'tags', 1),
  (2, 1, 'tags', 2),
  (3, 2, 'tags', 1),
  (4, 2, 'tags', 3),
  (5, 3, 'tags', 4),
  (6, 4, 'tags', 5);
