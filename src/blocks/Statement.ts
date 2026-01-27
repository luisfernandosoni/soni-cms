import type { Block } from 'payload'

/**
 * StatementBlock
 * Massive typography for quotes and manifestos
 */
export const StatementBlock: Block = {
  slug: 'statement',
  interfaceName: 'StatementBlock',
  labels: {
    singular: 'Statement',
    plural: 'Statements',
  },
  fields: [
    {
      name: 'text',
      type: 'textarea',
      required: true,
      label: 'Statement Text',
      admin: {
        description: 'The quote or manifesto text',
      },
    },
    {
      name: 'size',
      type: 'select',
      required: true,
      defaultValue: 'h1',
      options: [
        { label: 'Display (Largest)', value: 'display' },
        { label: 'H1', value: 'h1' },
        { label: 'H2', value: 'h2' },
      ],
      label: 'Typography Size',
    },
    {
      name: 'alignment',
      type: 'select',
      required: true,
      defaultValue: 'center',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
      label: 'Text Alignment',
    },
    {
      name: 'attribution',
      type: 'text',
      label: 'Attribution',
      admin: {
        description: 'Optional author or source of the quote',
      },
    },
  ],
}
