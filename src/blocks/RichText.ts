import type { Block } from 'payload'

/**
 * RichTextBlock
 * Standard narrative paragraphs with minimal Lexical editor
 */
export const RichTextBlock: Block = {
  slug: 'richText',
  interfaceName: 'RichTextBlock',
  labels: {
    singular: 'Rich Text',
    plural: 'Rich Text Blocks',
  },
  fields: [
    {
      name: 'content',
      type: 'richText',
      required: true,
      label: 'Content',
      // Uses default Lexical editor for now
      // Will be customized in Sprint 2 with minimal features
    },
  ],
}
