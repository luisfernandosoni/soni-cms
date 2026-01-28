-- ============================================
-- SONI CMS - D1 Migration Script
-- Run this in Cloudflare D1 Console
-- ============================================

-- IMPORTANT: Run statements ONE BY ONE or in small batches
-- The D1 console may not handle all statements at once

-- ============================================
-- 1. CREATE BLOCK TABLES
-- ============================================

CREATE TABLE `transmissions_blocks_cinematic_video` (
  `_order` integer NOT NULL,
  `_parent_id` integer NOT NULL,
  `_path` text NOT NULL,
  `id` text PRIMARY KEY NOT NULL,
  `url` text NOT NULL,
  `poster_image_id` integer,
  `autoplay` integer DEFAULT false,
  `loop` integer DEFAULT false,
  `caption` text,
  `block_name` text,
  FOREIGN KEY (`poster_image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null,
  FOREIGN KEY (`_parent_id`) REFERENCES `transmissions`(`id`) ON UPDATE no action ON DELETE cascade
);

CREATE INDEX `transmissions_blocks_cinematic_video_order_idx` ON `transmissions_blocks_cinematic_video` (`_order`);
CREATE INDEX `transmissions_blocks_cinematic_video_parent_id_idx` ON `transmissions_blocks_cinematic_video` (`_parent_id`);
CREATE INDEX `transmissions_blocks_cinematic_video_path_idx` ON `transmissions_blocks_cinematic_video` (`_path`);
CREATE INDEX `transmissions_blocks_cinematic_video_poster_image_idx` ON `transmissions_blocks_cinematic_video` (`poster_image_id`);

CREATE TABLE `transmissions_blocks_statement` (
  `_order` integer NOT NULL,
  `_parent_id` integer NOT NULL,
  `_path` text NOT NULL,
  `id` text PRIMARY KEY NOT NULL,
  `text` text NOT NULL,
  `size` text DEFAULT 'h1' NOT NULL,
  `alignment` text DEFAULT 'center' NOT NULL,
  `attribution` text,
  `block_name` text,
  FOREIGN KEY (`_parent_id`) REFERENCES `transmissions`(`id`) ON UPDATE no action ON DELETE cascade
);

CREATE INDEX `transmissions_blocks_statement_order_idx` ON `transmissions_blocks_statement` (`_order`);
CREATE INDEX `transmissions_blocks_statement_parent_id_idx` ON `transmissions_blocks_statement` (`_parent_id`);
CREATE INDEX `transmissions_blocks_statement_path_idx` ON `transmissions_blocks_statement` (`_path`);

CREATE TABLE `transmissions_blocks_code_terminal` (
  `_order` integer NOT NULL,
  `_parent_id` integer NOT NULL,
  `_path` text NOT NULL,
  `id` text PRIMARY KEY NOT NULL,
  `code` text NOT NULL,
  `language` text DEFAULT 'typescript' NOT NULL,
  `show_line_numbers` integer DEFAULT true,
  `filename` text,
  `block_name` text,
  FOREIGN KEY (`_parent_id`) REFERENCES `transmissions`(`id`) ON UPDATE no action ON DELETE cascade
);

CREATE INDEX `transmissions_blocks_code_terminal_order_idx` ON `transmissions_blocks_code_terminal` (`_order`);
CREATE INDEX `transmissions_blocks_code_terminal_parent_id_idx` ON `transmissions_blocks_code_terminal` (`_parent_id`);
CREATE INDEX `transmissions_blocks_code_terminal_path_idx` ON `transmissions_blocks_code_terminal` (`_path`);

CREATE TABLE `transmissions_blocks_gallery_wall` (
  `_order` integer NOT NULL,
  `_parent_id` integer NOT NULL,
  `_path` text NOT NULL,
  `id` text PRIMARY KEY NOT NULL,
  `layout_type` text DEFAULT 'grid' NOT NULL,
  `columns` text DEFAULT '3',
  `caption` text,
  `block_name` text,
  FOREIGN KEY (`_parent_id`) REFERENCES `transmissions`(`id`) ON UPDATE no action ON DELETE cascade
);

CREATE INDEX `transmissions_blocks_gallery_wall_order_idx` ON `transmissions_blocks_gallery_wall` (`_order`);
CREATE INDEX `transmissions_blocks_gallery_wall_parent_id_idx` ON `transmissions_blocks_gallery_wall` (`_parent_id`);
CREATE INDEX `transmissions_blocks_gallery_wall_path_idx` ON `transmissions_blocks_gallery_wall` (`_path`);

CREATE TABLE `transmissions_blocks_rich_text` (
  `_order` integer NOT NULL,
  `_parent_id` integer NOT NULL,
  `_path` text NOT NULL,
  `id` text PRIMARY KEY NOT NULL,
  `content` text NOT NULL,
  `block_name` text,
  FOREIGN KEY (`_parent_id`) REFERENCES `transmissions`(`id`) ON UPDATE no action ON DELETE cascade
);

CREATE INDEX `transmissions_blocks_rich_text_order_idx` ON `transmissions_blocks_rich_text` (`_order`);
CREATE INDEX `transmissions_blocks_rich_text_parent_id_idx` ON `transmissions_blocks_rich_text` (`_parent_id`);
CREATE INDEX `transmissions_blocks_rich_text_path_idx` ON `transmissions_blocks_rich_text` (`_path`);

-- ============================================
-- 2. CREATE CORE COLLECTIONS
-- ============================================

CREATE TABLE `authors_social_links` (
  `_order` integer NOT NULL,
  `_parent_id` integer NOT NULL,
  `id` text PRIMARY KEY NOT NULL,
  `platform` text NOT NULL,
  `url` text NOT NULL,
  FOREIGN KEY (`_parent_id`) REFERENCES `authors`(`id`) ON UPDATE no action ON DELETE cascade
);

CREATE INDEX `authors_social_links_order_idx` ON `authors_social_links` (`_order`);
CREATE INDEX `authors_social_links_parent_id_idx` ON `authors_social_links` (`_parent_id`);

CREATE TABLE `authors` (
  `id` integer PRIMARY KEY NOT NULL,
  `name` text NOT NULL,
  `role` text,
  `bio` text,
  `avatar_id` integer,
  `status` text DEFAULT 'active' NOT NULL,
  `updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  `created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  FOREIGN KEY (`avatar_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null
);

CREATE INDEX `authors_avatar_idx` ON `authors` (`avatar_id`);
CREATE INDEX `authors_updated_at_idx` ON `authors` (`updated_at`);
CREATE INDEX `authors_created_at_idx` ON `authors` (`created_at`);

CREATE TABLE `categories` (
  `id` integer PRIMARY KEY NOT NULL,
  `title` text NOT NULL,
  `slug` text NOT NULL,
  `description` text,
  `accent_color` text,
  `hero_image_id` integer,
  `updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  `created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  FOREIGN KEY (`hero_image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null
);

CREATE UNIQUE INDEX `categories_slug_idx` ON `categories` (`slug`);
CREATE INDEX `categories_hero_image_idx` ON `categories` (`hero_image_id`);
CREATE INDEX `categories_updated_at_idx` ON `categories` (`updated_at`);
CREATE INDEX `categories_created_at_idx` ON `categories` (`created_at`);

CREATE TABLE `tags` (
  `id` integer PRIMARY KEY NOT NULL,
  `title` text NOT NULL,
  `slug` text NOT NULL,
  `updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  `created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);

CREATE UNIQUE INDEX `tags_slug_idx` ON `tags` (`slug`);
CREATE INDEX `tags_updated_at_idx` ON `tags` (`updated_at`);
CREATE INDEX `tags_created_at_idx` ON `tags` (`created_at`);

-- ============================================
-- 3. CREATE TRANSMISSIONS TABLE
-- ============================================

CREATE TABLE `transmissions` (
  `id` integer PRIMARY KEY NOT NULL,
  `title` text NOT NULL,
  `slug` text NOT NULL,
  `excerpt` text,
  `hero_image_id` integer NOT NULL,
  `created_by_id` integer,
  `author_id` integer NOT NULL,
  `category_id` integer NOT NULL,
  `status` text DEFAULT 'draft' NOT NULL,
  `published_at` text,
  `meta_title` text,
  `meta_description` text,
  `meta_image_id` integer,
  `updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  `created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  FOREIGN KEY (`hero_image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null,
  FOREIGN KEY (`created_by_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
  FOREIGN KEY (`author_id`) REFERENCES `authors`(`id`) ON UPDATE no action ON DELETE set null,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE set null,
  FOREIGN KEY (`meta_image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null
);

CREATE UNIQUE INDEX `transmissions_slug_idx` ON `transmissions` (`slug`);
CREATE INDEX `transmissions_hero_image_idx` ON `transmissions` (`hero_image_id`);
CREATE INDEX `transmissions_created_by_idx` ON `transmissions` (`created_by_id`);
CREATE INDEX `transmissions_author_idx` ON `transmissions` (`author_id`);
CREATE INDEX `transmissions_category_idx` ON `transmissions` (`category_id`);
CREATE INDEX `transmissions_status_idx` ON `transmissions` (`status`);
CREATE INDEX `transmissions_published_at_idx` ON `transmissions` (`published_at`);
CREATE INDEX `transmissions_meta_meta_image_idx` ON `transmissions` (`meta_image_id`);
CREATE INDEX `transmissions_updated_at_idx` ON `transmissions` (`updated_at`);
CREATE INDEX `transmissions_created_at_idx` ON `transmissions` (`created_at`);

CREATE TABLE `transmissions_rels` (
  `id` integer PRIMARY KEY NOT NULL,
  `order` integer,
  `parent_id` integer NOT NULL,
  `path` text NOT NULL,
  `media_id` integer,
  `tags_id` integer,
  `transmissions_id` integer,
  FOREIGN KEY (`parent_id`) REFERENCES `transmissions`(`id`) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (`tags_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (`transmissions_id`) REFERENCES `transmissions`(`id`) ON UPDATE no action ON DELETE cascade
);

CREATE INDEX `transmissions_rels_order_idx` ON `transmissions_rels` (`order`);
CREATE INDEX `transmissions_rels_parent_idx` ON `transmissions_rels` (`parent_id`);
CREATE INDEX `transmissions_rels_path_idx` ON `transmissions_rels` (`path`);
CREATE INDEX `transmissions_rels_media_id_idx` ON `transmissions_rels` (`media_id`);
CREATE INDEX `transmissions_rels_tags_id_idx` ON `transmissions_rels` (`tags_id`);
CREATE INDEX `transmissions_rels_transmissions_id_idx` ON `transmissions_rels` (`transmissions_id`);

-- ============================================
-- 4. USER ENHANCEMENTS
-- ============================================

CREATE TABLE `users_roles` (
  `order` integer NOT NULL,
  `parent_id` integer NOT NULL,
  `value` text,
  `id` integer PRIMARY KEY NOT NULL,
  FOREIGN KEY (`parent_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);

CREATE INDEX `users_roles_order_idx` ON `users_roles` (`order`);
CREATE INDEX `users_roles_parent_idx` ON `users_roles` (`parent_id`);

ALTER TABLE `users` ADD `name` text;
ALTER TABLE `users` ADD `avatar_id` integer REFERENCES media(id);
CREATE INDEX `users_avatar_idx` ON `users` (`avatar_id`);

-- ============================================
-- 5. MEDIA ENHANCEMENTS
-- ============================================

ALTER TABLE `media` ADD `alt_text` text NOT NULL;
ALTER TABLE `media` ADD `caption` text;
ALTER TABLE `media` ADD `photographer` text;
ALTER TABLE `media` ADD `license` text DEFAULT 'rights-reserved';
-- Note: DROP COLUMN may fail on older D1 - skip if error
-- ALTER TABLE `media` DROP COLUMN `alt`;

-- ============================================
-- 6. SYSTEM TABLES
-- ============================================

CREATE TABLE `payload_kv` (
  `id` integer PRIMARY KEY NOT NULL,
  `key` text NOT NULL,
  `data` text NOT NULL
);

CREATE UNIQUE INDEX `payload_kv_key_idx` ON `payload_kv` (`key`);

ALTER TABLE `payload_locked_documents_rels` ADD `transmissions_id` integer REFERENCES transmissions(id);
ALTER TABLE `payload_locked_documents_rels` ADD `authors_id` integer REFERENCES authors(id);
ALTER TABLE `payload_locked_documents_rels` ADD `categories_id` integer REFERENCES categories(id);
ALTER TABLE `payload_locked_documents_rels` ADD `tags_id` integer REFERENCES tags(id);

CREATE INDEX `payload_locked_documents_rels_transmissions_id_idx` ON `payload_locked_documents_rels` (`transmissions_id`);
CREATE INDEX `payload_locked_documents_rels_authors_id_idx` ON `payload_locked_documents_rels` (`authors_id`);
CREATE INDEX `payload_locked_documents_rels_categories_id_idx` ON `payload_locked_documents_rels` (`categories_id`);
CREATE INDEX `payload_locked_documents_rels_tags_id_idx` ON `payload_locked_documents_rels` (`tags_id`);

-- ============================================
-- 7. RECORD MIGRATION
-- ============================================

INSERT INTO payload_migrations (name, batch) VALUES ('20260128_003135', 2);

-- ============================================
-- DONE!
-- ============================================
