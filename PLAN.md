# PayloadCMS Configuration: The "Sentinel" Architecture (0.01% Edition)

> **Purpose**: This is the master plan for configuring the soni-cms PayloadCMS project.
> Always consult this document at the beginning of every work session.

---

## 1. Content Architecture & Data Modeling (The Blocks System)

### Canvas Architecture (`layout` blocks field)
Replace the single Rich Text field with a modular `layout` blocks field for composing "Transmissions":

| Block | Description | Fields |
|-------|-------------|--------|
| **CinematicVideo** | Embedded video | `url`, `posterImage` (upload), `autoplay` (bool), `loop` (bool), `caption` (text) |
| **Statement** | Massive typography for quotes/manifestos | `text`, `size` (H1/H2/Display), `alignment` |
| **CodeTerminal** | Technical snippets | `code` (textarea), `language` (select), `showLineNumbers` (bool) |
| **GalleryWall** | Multi-image layouts | `images` (upload hasMany), `layoutType` (Masonry/Grid/Carousel) |
| **RichText** | Standard narrative paragraphs | `content` (richText with minimal Lexical) |

### Relational Taxonomy

- **Categories Collection**: `title`, `slug`, `description`, `accentColor` (hex), `heroImage` (upload)
- **Tags Collection**: `title`, `slug`, many-to-many relationship with Transmissions

### Author System ("Persona")

- **Authors Collection** (separate from system Users): `name`, `role` (Architect, etc.), `bio` (richText), `avatar` (media), `socialLinks` (array), `status` (Active/Guest)

### SEO Strategy

- Implement `@payloadcms/plugin-seo`
- Configure dynamic `GenerateTitle`, `GenerateDescription`, `GenerateImage` (OG)

---

## 2. Advanced Field Configuration (Bleeding Edge UX)

### Intelligent Slug Validation
- `beforeValidate` hook to auto-format
- Check uniqueness in D1
- Prevent collisions

### Real Publication Status
- `_status` field: Draft/Published
- `publishedAt` (Date)
- Logic: If `_status === "Published"` but `publishedAt` is future → frontend returns 404 until Cron activates

### Lexical Editor ("Jony Ive" Config)
- **Disable**: Fonts, Colors, H4-H6
- **Enable**: Bold, Italic, Link (auto-open external in new tab), Code Block (syntax)
- **Custom Node**: `AttributedQuote` (Quote + Author + Source)

### Admin Micro-copy
- Custom labels: "Title" → "Signal Header", "Content" → "Transmission Data"
- Descriptive hints: "Select the frequency channel for this transmission" (for categories)

---

## 3. Media Management & Performance (The "Purist" Option A)

### Storage ("The Vault")
- Configure Payload to upload **original** files to Cloudflare R2 (`soni-blog-assets`)
- **Disable** local thumbnail generation (save Worker CPU)

### Delivery ("The Prism")
- Integrate Cloudflare Images or Worker Image Resizing on frontend
- `CloudflareImage.tsx` component transforms URLs:
  ```
  https://cdn.soninewmedia.com/cgi-cdn/image/width=800,quality=80,format=auto/filename.jpg
  ```

### Media Metadata
- Fields: `altText` (required, AI suggested), `caption`, `photographer`, `license`
- Validation: MIME type (images/optimized video), max size (50MB video, 10MB photo)

---

## 4. Admin Panel UX Optimization (Aesthetics)

### Dark Mode (Forced)
- Override CSS with exact palette: `#080808`, borders `white/10`

### Custom Dashboard
- **System Status Widget**: D1, R2, last Cron execution
- **Recent Signals Widget**: Compact list with mini-views graph

### Custom List Views
- Columns: `Title`, `Author` (Avatar), `Category` (badge w/ color), `PublishedAt` (relative), `Status`

### Live Preview
- Configure Preview button → `https://your-site.com/transmission/[slug]?preview=true&secret=...`
- Frontend loads Draft version if token matches

---

## 5. Security & Authentication (OAuth + Role-Based)

### Hybrid Authentication
- **Email/Password**: Root Admin
- **OAuth 2.0** (Google/GitHub): Collaborators
- Domain mapping: `*@soninewmedia.com` → Admin role, others → Guest

### RBAC (Role-Based Access Control)
| Role | Permissions |
|------|-------------|
| **Admin** | Full access (Settings, Users, all content) |
| **Editor** | Create/Edit content and media, cannot delete others' content |
| **Author** | Edit own content only |

### API Security
- Cloudflare Worker middleware: Rate Limiting on `GET /api/transmissions`
- CSRF protection on mutations

---

## 6. Scheduled Publishing & Automation (The Pulse)

### Cron Heart
- Secure endpoint: `POST /api/hooks/publish-scheduled` (protected by `API_SECRET`)
- Cloudflare Cron Triggers (wrangler.toml): invoke every 10 minutes
- Logic: Find Transmissions where `status=draft` AND `publishedAt <= now`, update to `status=published`

### Cache Webhooks
- `afterChange` hook on Transmissions: Purge Cloudflare cache for specific URL (`/transmission/slug`) and listing (`/journal`)

---

## 7. Search & Discovery (Intelligence)

### Full-Text Search (D1 FTS5)
- Enable FTS5 extension in D1
- Endpoint `/api/search?q=query`: search in Title, Excerpt, Text Blocks

### Intelligent Relations
- `relatedTransmissions` field (Manual)
- Frontend fallback: If empty, show posts with same Category or Tags

---

## 8. Frontend Integration (The Renderer)

### BlockRenderer Component
- Visual engine: receives `layout` array, renders corresponding React components (`<VideoBlock />`, `<GalleryBlock />`, etc.)

### Router (Wouter)
- Dynamic routes: `/transmission/:slug`, `/category/:slug`, `/author/:slug`

### SEO Metatags
- Inject SEO plugin data into `<head>` (react-helmet or similar)
- Structured Data (JSON-LD): Article, Breadcrumbs

---

## 9. Developer Experience (DX)

### Type Generation
- Script: `npm run generate:types` → outputs `payload-types.ts`

### Seed Data Script
- Populate D1 with test data:
  - Authors
  - Categories
  - 5 Posts with varied blocks

---

## 10. Monitoring & Analytics (Observability)

### Cloudflare Analytics
- Use native Web Analytics (JS snippet) for privacy

### Logging
- Send critical CMS errors (e.g., R2 upload failure) to:
  - Internal `SystemLogs` collection, OR
  - External service (Sentry) via Worker

---

## Sprint Breakdown

> **Analysis**: This is a substantial configuration project. To maintain focus and avoid context overload, I recommend **4 Sprints**.

### Sprint 1: Foundation & Data Modeling (Collections + Blocks)
- [ ] Create `Categories` collection
- [ ] Create `Tags` collection
- [ ] Create `Authors` collection
- [ ] Refactor `Transmissions` with `layout` blocks field
- [ ] Define all 5 block types (CinematicVideo, Statement, CodeTerminal, GalleryWall, RichText)
- [ ] Enhance `Media` collection with metadata fields
- [ ] Update `payload.config.ts` with new collections

### Sprint 2: Admin UX & Editor Configuration
- [ ] Configure Lexical Editor ("Jony Ive" mode)
- [ ] Implement intelligent slug validation hook
- [ ] Set up publication status logic (`_status`, `publishedAt`)
- [ ] Customize admin labels/descriptions
- [ ] Implement custom list view columns for Transmissions
- [ ] Add SEO plugin configuration

### Sprint 3: Security, Auth & RBAC
- [ ] Implement RBAC (Admin, Editor, Author roles)
- [ ] Configure access control on all collections
- [ ] Set up OAuth 2.0 strategies (optional if user confirms)
- [ ] Implement API rate limiting endpoint
- [ ] Add scheduled publishing endpoint
- [ ] Configure Cron triggers in wrangler.toml

### Sprint 4: Frontend Integration & Polish
- [ ] Create BlockRenderer component structure
- [ ] Implement cache purge webhook
- [ ] Set up search endpoint (FTS5 query)
- [ ] Create seed data script
- [ ] Admin dashboard customization (widgets)
- [ ] Final verification and type generation

---

## Technical Notes

### Payload Version
- Using Payload `3.73.0` with D1 SQLite adapter

### Key References
- Main config: `src/payload.config.ts`
- Collections: `src/collections/`
- Context rules: `.cursor/rules/`
- Documentation: https://payloadcms.com/docs

### Cloudflare Bindings
- **D1**: Database binding
- **R2**: Storage binding (`soni-blog-assets`)

---

*Last Updated: 2026-01-27*
