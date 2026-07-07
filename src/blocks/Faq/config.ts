import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const FAQBlock: Block = {
  slug: 'faq',
  interfaceName: 'FAQBlock',
  fields: [
    {
      name: 'heading',
      label: 'Nagłówek',
      type: 'text',
      required: true,
    },
    {
      name: 'faqs',
      label: 'Często zadawane pytania',
      type: 'array',
      fields: [
        {
          name: 'question',
          required: true,
          label: 'Pytanie',
          type: 'text',
        },
        {
          name: 'answer',
          label: 'Odpowiedź',
          required: true,
          type: 'richText',
          editor: lexicalEditor({
            features: ({ rootFeatures }) => {
              return [
                ...rootFeatures,
                HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                FixedToolbarFeature(),
                InlineToolbarFeature(),
              ]
            },
          }),
        },
      ],
    },
  ],
  labels: {
    plural: 'Sekcja FAQ',
    singular: 'Sekcje FAQ',
  },
}
