import type { Block } from 'payload'

/**
 * CodeTerminalBlock
 * For technical code snippets with syntax highlighting
 */
export const CodeTerminalBlock: Block = {
  slug: 'codeTerminal',
  interfaceName: 'CodeTerminalBlock',
  labels: {
    singular: 'Code Terminal',
    plural: 'Code Terminals',
  },
  fields: [
    {
      name: 'code',
      type: 'code',
      required: true,
      label: 'Code',
      admin: {
        language: 'typescript',
        description: 'The code snippet to display',
      },
    },
    {
      name: 'language',
      type: 'select',
      required: true,
      defaultValue: 'typescript',
      options: [
        { label: 'TypeScript', value: 'typescript' },
        { label: 'JavaScript', value: 'javascript' },
        { label: 'Python', value: 'python' },
        { label: 'Bash/Shell', value: 'bash' },
        { label: 'CSS', value: 'css' },
        { label: 'HTML', value: 'html' },
        { label: 'JSON', value: 'json' },
        { label: 'SQL', value: 'sql' },
        { label: 'Go', value: 'go' },
        { label: 'Rust', value: 'rust' },
      ],
      label: 'Language',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'showLineNumbers',
      type: 'checkbox',
      label: 'Show Line Numbers',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'filename',
      type: 'text',
      label: 'Filename',
      admin: {
        description: 'Optional filename to display (e.g., app.ts)',
        position: 'sidebar',
      },
    },
  ],
}
