import type { Block } from 'payload'

export const CustomerReviewsBlock: Block = {
  slug: 'reviews',
  interfaceName: 'CustomerReviewsBlock',
  fields: [
    {
      name: 'heading',
      label: 'Nagłówek',
      required: true,
      type: 'text',
    },
    {
      name: 'reviews',
      label: 'Recenzje',
      type: 'array',
      fields: [
        {
          name: 'customer',
          label: 'Klient',
          type: 'text',
          required: true,
        },
        {
          name: 'score',
          label: 'Ocena',
          type: 'number',
          required: true,
          min: 0,
          max: 5,
        },
        {
          name: 'content',
          label: 'Treść',
          type: 'textarea',
          required: true,
        },
      ],
      labels: {
        plural: 'Opinie',
        singular: 'Opinia',
      },
    },
  ],
  labels: {
    plural: 'Sekcje z opiniami',
    singular: 'Sekcja z opiniami',
  },
}
