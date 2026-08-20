import { adminOnly } from '@/access/adminOnly'
import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

export const ShippingMethods: CollectionConfig = {
  slug: 'shipping-methods',
  labels: {
    plural: 'Metody dostawy',
    singular: 'Metoda dostawy',
  },
  access: {
    create: adminOnly,
    delete: adminOnly,
    read: () => true,
    update: adminOnly,
  },
  admin: {
    useAsTitle: 'name',
    group: 'Sklep',
  },
  defaultPopulate: {
    slug: true,
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Kurier', value: 'courier' },
        { label: 'Paczkomat', value: 'locker' },
      ],
      required: true,
    },
    {
      name: 'name',
      label: 'Nazwa',
      type: 'text',
      required: true,
    },
    {
      name: 'price',
      label: 'Cena',
      type: 'number',
      required: true,
    },
    {
      name: 'enabled',
      label: 'Włączona',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'sortOrder',
      label: 'Kolejność',
      type: 'number',
    },
    slugField({ useAsSlug: 'name' }),
  ],
}
