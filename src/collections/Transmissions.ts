import { CollectionConfig } from 'payload';

export const Transmissions: CollectionConfig = {
  slug: 'transmissions', // Esto define la URL de la API: /api/transmissions
  admin: {
    useAsTitle: 'title',
    group: 'Content',
  },
  access: {
    read: () => true, // Todo el mundo puede leer (Público)
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            // Auto-genera el slug del título si no existe (formato url-friendly)
            if (!value && data?.title) {
              return data.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
            }
            return value;
          },
        ],
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
            pickerAppearance: 'dayAndTime',
        }
      },
    },
    {
        name: 'status',
        type: 'select',
        options: [
            { label: 'Draft', value: 'draft' },
            { label: 'Published', value: 'published' },
        ],
        defaultValue: 'draft',
        admin: {
            position: 'sidebar',
        }
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media', // Debe coincidir con el slug de tu colección de imágenes
      required: true,
    },
    {
      name: 'category',
      type: 'text', // O 'relationship' si quieres crear una colección de Categorías aparte
      required: true,
    },
    {
      name: 'content',
      type: 'richText', // El editor poderoso
      required: true,
    },
  ],
};
