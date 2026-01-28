import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`transmissions_blocks_cinematic_video\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`url\` text NOT NULL,
  	\`poster_image_id\` integer,
  	\`autoplay\` integer DEFAULT false,
  	\`loop\` integer DEFAULT false,
  	\`caption\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`poster_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`transmissions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`transmissions_blocks_cinematic_video_order_idx\` ON \`transmissions_blocks_cinematic_video\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`transmissions_blocks_cinematic_video_parent_id_idx\` ON \`transmissions_blocks_cinematic_video\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`transmissions_blocks_cinematic_video_path_idx\` ON \`transmissions_blocks_cinematic_video\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`transmissions_blocks_cinematic_video_poster_image_idx\` ON \`transmissions_blocks_cinematic_video\` (\`poster_image_id\`);`)
  await db.run(sql`CREATE TABLE \`transmissions_blocks_statement\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	\`size\` text DEFAULT 'h1' NOT NULL,
  	\`alignment\` text DEFAULT 'center' NOT NULL,
  	\`attribution\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`transmissions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`transmissions_blocks_statement_order_idx\` ON \`transmissions_blocks_statement\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`transmissions_blocks_statement_parent_id_idx\` ON \`transmissions_blocks_statement\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`transmissions_blocks_statement_path_idx\` ON \`transmissions_blocks_statement\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`transmissions_blocks_code_terminal\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`code\` text NOT NULL,
  	\`language\` text DEFAULT 'typescript' NOT NULL,
  	\`show_line_numbers\` integer DEFAULT true,
  	\`filename\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`transmissions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`transmissions_blocks_code_terminal_order_idx\` ON \`transmissions_blocks_code_terminal\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`transmissions_blocks_code_terminal_parent_id_idx\` ON \`transmissions_blocks_code_terminal\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`transmissions_blocks_code_terminal_path_idx\` ON \`transmissions_blocks_code_terminal\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`transmissions_blocks_gallery_wall\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`layout_type\` text DEFAULT 'grid' NOT NULL,
  	\`columns\` text DEFAULT '3',
  	\`caption\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`transmissions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`transmissions_blocks_gallery_wall_order_idx\` ON \`transmissions_blocks_gallery_wall\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`transmissions_blocks_gallery_wall_parent_id_idx\` ON \`transmissions_blocks_gallery_wall\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`transmissions_blocks_gallery_wall_path_idx\` ON \`transmissions_blocks_gallery_wall\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`transmissions_blocks_rich_text\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`content\` text NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`transmissions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`transmissions_blocks_rich_text_order_idx\` ON \`transmissions_blocks_rich_text\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`transmissions_blocks_rich_text_parent_id_idx\` ON \`transmissions_blocks_rich_text\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`transmissions_blocks_rich_text_path_idx\` ON \`transmissions_blocks_rich_text\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`transmissions\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`excerpt\` text,
  	\`hero_image_id\` integer NOT NULL,
  	\`created_by_id\` integer,
  	\`author_id\` integer NOT NULL,
  	\`category_id\` integer NOT NULL,
  	\`status\` text DEFAULT 'draft' NOT NULL,
  	\`published_at\` text,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_image_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`created_by_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`author_id\`) REFERENCES \`authors\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`transmissions_slug_idx\` ON \`transmissions\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`transmissions_hero_image_idx\` ON \`transmissions\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`transmissions_created_by_idx\` ON \`transmissions\` (\`created_by_id\`);`)
  await db.run(sql`CREATE INDEX \`transmissions_author_idx\` ON \`transmissions\` (\`author_id\`);`)
  await db.run(sql`CREATE INDEX \`transmissions_category_idx\` ON \`transmissions\` (\`category_id\`);`)
  await db.run(sql`CREATE INDEX \`transmissions_status_idx\` ON \`transmissions\` (\`status\`);`)
  await db.run(sql`CREATE INDEX \`transmissions_published_at_idx\` ON \`transmissions\` (\`published_at\`);`)
  await db.run(sql`CREATE INDEX \`transmissions_meta_meta_image_idx\` ON \`transmissions\` (\`meta_image_id\`);`)
  await db.run(sql`CREATE INDEX \`transmissions_updated_at_idx\` ON \`transmissions\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`transmissions_created_at_idx\` ON \`transmissions\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`transmissions_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`media_id\` integer,
  	\`tags_id\` integer,
  	\`transmissions_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`transmissions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`tags_id\`) REFERENCES \`tags\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`transmissions_id\`) REFERENCES \`transmissions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`transmissions_rels_order_idx\` ON \`transmissions_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`transmissions_rels_parent_idx\` ON \`transmissions_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`transmissions_rels_path_idx\` ON \`transmissions_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`transmissions_rels_media_id_idx\` ON \`transmissions_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`transmissions_rels_tags_id_idx\` ON \`transmissions_rels\` (\`tags_id\`);`)
  await db.run(sql`CREATE INDEX \`transmissions_rels_transmissions_id_idx\` ON \`transmissions_rels\` (\`transmissions_id\`);`)
  await db.run(sql`CREATE TABLE \`authors_social_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`platform\` text NOT NULL,
  	\`url\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`authors\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`authors_social_links_order_idx\` ON \`authors_social_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`authors_social_links_parent_id_idx\` ON \`authors_social_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`authors\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`role\` text,
  	\`bio\` text,
  	\`avatar_id\` integer,
  	\`status\` text DEFAULT 'active' NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`avatar_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`authors_avatar_idx\` ON \`authors\` (\`avatar_id\`);`)
  await db.run(sql`CREATE INDEX \`authors_updated_at_idx\` ON \`authors\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`authors_created_at_idx\` ON \`authors\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`categories\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`description\` text,
  	\`accent_color\` text,
  	\`hero_image_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`categories_slug_idx\` ON \`categories\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`categories_hero_image_idx\` ON \`categories\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`categories_updated_at_idx\` ON \`categories\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`categories_created_at_idx\` ON \`categories\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`tags\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`tags_slug_idx\` ON \`tags\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`tags_updated_at_idx\` ON \`tags\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`tags_created_at_idx\` ON \`tags\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`users_roles\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`users_roles_order_idx\` ON \`users_roles\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`users_roles_parent_idx\` ON \`users_roles\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_kv\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`data\` text NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`)
  await db.run(sql`ALTER TABLE \`users\` ADD \`name\` text;`)
  await db.run(sql`ALTER TABLE \`users\` ADD \`avatar_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`users_avatar_idx\` ON \`users\` (\`avatar_id\`);`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`alt_text\` text NOT NULL;`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`caption\` text;`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`photographer\` text;`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`license\` text DEFAULT 'rights-reserved';`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`alt\`;`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`transmissions_id\` integer REFERENCES transmissions(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`authors_id\` integer REFERENCES authors(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`categories_id\` integer REFERENCES categories(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`tags_id\` integer REFERENCES tags(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_transmissions_id_idx\` ON \`payload_locked_documents_rels\` (\`transmissions_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_authors_id_idx\` ON \`payload_locked_documents_rels\` (\`authors_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_categories_id_idx\` ON \`payload_locked_documents_rels\` (\`categories_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_tags_id_idx\` ON \`payload_locked_documents_rels\` (\`tags_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`transmissions_blocks_cinematic_video\`;`)
  await db.run(sql`DROP TABLE \`transmissions_blocks_statement\`;`)
  await db.run(sql`DROP TABLE \`transmissions_blocks_code_terminal\`;`)
  await db.run(sql`DROP TABLE \`transmissions_blocks_gallery_wall\`;`)
  await db.run(sql`DROP TABLE \`transmissions_blocks_rich_text\`;`)
  await db.run(sql`DROP TABLE \`transmissions\`;`)
  await db.run(sql`DROP TABLE \`transmissions_rels\`;`)
  await db.run(sql`DROP TABLE \`authors_social_links\`;`)
  await db.run(sql`DROP TABLE \`authors\`;`)
  await db.run(sql`DROP TABLE \`categories\`;`)
  await db.run(sql`DROP TABLE \`tags\`;`)
  await db.run(sql`DROP TABLE \`users_roles\`;`)
  await db.run(sql`DROP TABLE \`payload_kv\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_users\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`email\` text NOT NULL,
  	\`reset_password_token\` text,
  	\`reset_password_expiration\` text,
  	\`salt\` text,
  	\`hash\` text,
  	\`login_attempts\` numeric DEFAULT 0,
  	\`lock_until\` text
  );
  `)
  await db.run(sql`INSERT INTO \`__new_users\`("id", "updated_at", "created_at", "email", "reset_password_token", "reset_password_expiration", "salt", "hash", "login_attempts", "lock_until") SELECT "id", "updated_at", "created_at", "email", "reset_password_token", "reset_password_expiration", "salt", "hash", "login_attempts", "lock_until" FROM \`users\`;`)
  await db.run(sql`DROP TABLE \`users\`;`)
  await db.run(sql`ALTER TABLE \`__new_users\` RENAME TO \`users\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`users_updated_at_idx\` ON \`users\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`users_created_at_idx\` ON \`users\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`users_email_idx\` ON \`users\` (\`email\`);`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "media_id") SELECT "id", "order", "parent_id", "path", "users_id", "media_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`alt\` text NOT NULL;`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`alt_text\`;`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`caption\`;`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`photographer\`;`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`license\`;`)
}
