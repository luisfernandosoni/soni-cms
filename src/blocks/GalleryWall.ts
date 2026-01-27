import type { Block } from 'payload'

/**
 * GalleryWallBlock
 * Multi-image layouts with different display options
 */
export const GalleryWallBlock: Block = {
  slug: 'galleryWall',
  interfaceName: 'GalleryWallBlock',
  labels: {
    singular: 'Gallery Wall',
    plural: 'Gallery Walls',
  },
  fields: [
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      required: true,
      label: 'Images',
      minRows: 1,
      admin: {
        description: 'Select multiple images for the gallery',
      },
    },
    {
      name: 'layoutType',
      type: 'select',
      required: true,
      defaultValue: 'grid',
      options: [
        { label: 'Grid', value: 'grid' },
        { label: 'Masonry', value: 'masonry' },
        { label: 'Carousel', value: 'carousel' },
      ],
      label: 'Layout Type',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: [
        { label: '2 Columns', value: '2' },
        { label: '3 Columns', value: '3' },
        { label: '4 Columns', value: '4' },
      ],
      label: 'Columns',
      admin: {
        position: 'sidebar',
        condition: (data, siblingData) => siblingData?.layoutType !== 'carousel',
      },
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Gallery Caption',
    },
  ],
}
