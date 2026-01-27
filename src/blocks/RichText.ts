import type { Block } from 'payload'
import { minimalEditor } from '../lexical'

/**
 * RichTextBlock
 * Standard narrative paragraphs with minimal Lexical editor
 * Uses the "Jony Ive" mode - clean, focused, no distractions
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
      editor: minimalEditor,
    },
  ],
}
