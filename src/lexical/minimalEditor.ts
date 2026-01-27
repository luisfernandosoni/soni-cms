import {
  lexicalEditor,
  BoldFeature,
  ItalicFeature,
  UnderlineFeature,
  StrikethroughFeature,
  LinkFeature,
  ParagraphFeature,
  HeadingFeature,
  BlockquoteFeature,
  OrderedListFeature,
  UnorderedListFeature,
  InlineCodeFeature,
} from '@payloadcms/richtext-lexical'

/**
 * Minimal Lexical Editor - "Jony Ive" Mode
 *
 * A clean, focused editor that removes distractions:
 * - Disabled: Fonts, Colors, H4-H6
 * - Enabled: Bold, Italic, Link, Code, Limited Headings
 *
 * Philosophy: "Design is not just what it looks like...
 * it's how it works." - Steve Jobs
 */
export const minimalEditor = lexicalEditor({
  features: () => [
    // Text formatting (minimal)
    BoldFeature(),
    ItalicFeature(),
    UnderlineFeature(),
    StrikethroughFeature(),
    InlineCodeFeature(),

    // Structure
    ParagraphFeature(),
    HeadingFeature({
      enabledHeadingSizes: ['h1', 'h2', 'h3'], // No H4-H6
    }),
    BlockquoteFeature(),

    // Lists
    OrderedListFeature(),
    UnorderedListFeature(),

    // Links (with auto new-tab for external)
    LinkFeature({
      enabledCollections: ['transmissions', 'categories', 'authors'],
    }),
  ],
})

/**
 * Ultra-minimal editor for simple content blocks
 * Just bold, italic, and links
 */
export const ultraMinimalEditor = lexicalEditor({
  features: () => [
    BoldFeature(),
    ItalicFeature(),
    InlineCodeFeature(),
    ParagraphFeature(),
    LinkFeature({}),
  ],
})
