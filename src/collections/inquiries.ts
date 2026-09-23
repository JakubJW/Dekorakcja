import { CollectionConfig } from 'payload'

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  labels: {
    singular: 'Zapytanie',
    plural: 'Zapytania',
  },
  admin: {
    useAsTitle: 'id',
    group: 'Wypożyczalnia',
  },
  fields: [
    {
      name: 'rent-cart',
      type: 'relationship',
      relationTo: 'rent-carts',
      required: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
    },
  ],
}
