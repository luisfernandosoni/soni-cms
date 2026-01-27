import type { Block } from 'payload'

/**
 * CinematicVideoBlock
 * For embedding videos with poster image, autoplay/loop options
 */
export const CinematicVideoBlock: Block = {
  slug: 'cinematicVideo',
  interfaceName: 'CinematicVideoBlock',
  labels: {
    singular: 'Cinematic Video',
    plural: 'Cinematic Videos',
  },
  fields: [
    {
      name: 'url',
      type: 'text',
      required: true,
      label: 'Video URL',
      admin: {
        description: 'YouTube, Vimeo, or direct video URL',
      },
    },
    {
      name: 'posterImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Poster Image',
      admin: {
        description: 'Thumbnail shown before video plays',
      },
    },
    {
      name: 'autoplay',
      type: 'checkbox',
      label: 'Autoplay',
      defaultValue: false,
    },
    {
      name: 'loop',
      type: 'checkbox',
      label: 'Loop',
      defaultValue: false,
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Caption',
    },
  ],
}
