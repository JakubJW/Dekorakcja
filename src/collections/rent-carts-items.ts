import { adminOnly } from '@/access/adminOnly'
import type { CollectionConfig } from 'payload'

export const RentCartsItems: CollectionConfig = {
  slug: 'rent-carts-items',
  labels: {
    plural: 'Przedmioty w koszykach wypozyczen',
    singular: 'Przedmiot w koszyku wypozyczenia',
  },
  access: {
    delete: adminOnly,
    read: () => true,
  },
  defaultPopulate: {
    slug: true,
  },
  fields: [
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'rent-carts',
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'rentables',
    },
  ],
}
