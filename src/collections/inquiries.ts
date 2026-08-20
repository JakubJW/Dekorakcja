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
      name: 'product',
      type: 'relationship',
      relationTo: 'rentables',
      required: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Oczekująca', value: 'pending' },
        { label: 'Opłacona / Aktywna', value: 'active' },
        { label: 'Zakończona', value: 'completed' },
        { label: 'Anulowana', value: 'cancelled' },
      ],
      defaultValue: 'pending',
    },
  ],
}
