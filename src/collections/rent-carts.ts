import { adminOnly } from '@/access/adminOnly'
import type { CollectionConfig } from 'payload'

export const RentCarts: CollectionConfig = {
  slug: 'rent-carts',
  labels: {
    plural: 'Koszyki zapytań',
    singular: 'Koszyk zapytania',
  },
  access: {
    delete: adminOnly,
    read: () => true,
  },
  admin: {
    group: 'Wypożyczalnia',
  },
  defaultPopulate: {
    slug: true,
  },
  fields: [
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
      label: 'Klient',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'items',
      type: 'array',
      label: 'Pozycje',
      fields: [
        {
          name: 'rentable',
          type: 'relationship',
          relationTo: 'rentables',
        },
      ],
    },
    { name: 'secret', type: 'text' },
    { name: 'submittedAt', type: 'date' },
  ],
}
