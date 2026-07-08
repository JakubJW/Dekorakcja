import { Block } from 'payload'

export const NumberedListsBlock: Block = {
  slug: 'numberedLists',
  interfaceName: 'NumberedListsBlock',
  fields: [
    {
      name: 'lists',
      label: 'Listy numerowane',
      type: 'array',
      fields: [
        {
          name: 'heading',
          label: 'Nagłówek',
          type: 'text',
          required: true,
        },
        {
          name: 'points',
          label: 'Punkty',
          type: 'array',
          required: true,
          fields: [
            {
              name: 'heading',
              type: 'text',
              label: 'Nagłówek',
              required: true,
            },
            {
              name: 'paragraph',
              label: 'Paragraf',
              type: 'textarea',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}
