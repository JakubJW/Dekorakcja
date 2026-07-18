import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { adminOnly } from '@/access/adminOnly'

export const Occasions: CollectionConfig = {
  slug: 'occasions',
  labels: {
    plural: 'Okazje',
    singular: 'Okazja',
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
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nazwa',
    },
    slugField({
      position: undefined,
    }),
  ],
}
