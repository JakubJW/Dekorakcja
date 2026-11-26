import { adminOnly } from '@/access/adminOnly'
import { currenciesConfig } from '@/plugins/currencies-config'
import { pricesField } from '@payloadcms/plugin-ecommerce'
import type { CollectionConfig } from 'payload'

export const ProductPersonalizationOptions: CollectionConfig = {
  slug: 'product-personalization-options',
  labels: {
    plural: 'Opcje personalizacji produktu',
    singular: 'Opcja personalizacji produktu',
  },
  access: {
    create: adminOnly,
    delete: adminOnly,
    read: () => true,
    update: adminOnly,
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      label: 'Nazwa',
      type: 'text',
      required: true,
    },
    {
      name: 'type',
      label: 'Typ',
      type: 'select',
      options: [
        {
          label: 'Tekst',
          value: 'text',
        },
      ],
    },
    ...pricesField({
      currenciesConfig,
    }),
  ],
}
