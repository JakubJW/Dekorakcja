import { CollectionConfig } from 'payload'

export const OrganizationAddresses: CollectionConfig = {
  slug: 'organization-addresses',
  labels: {
    singular: 'Adres firmowy',
    plural: 'Adresy firmowe',
  },
  admin: {
    group: false,
  },
  fields: [
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'nip',
      type: 'text',
      required: true,
    },
    {
      name: 'organization',
      type: 'text',
      required: true,
    },
    {
      name: 'addressLine1',
      type: 'text',
      required: true,
    },
    {
      name: 'addressLine2',
      type: 'text',
    },
    {
      name: 'city',
      type: 'text',
      required: true,
    },
    {
      name: 'postalCode',
      type: 'text',
      required: true,
    },

    {
      name: 'country',
      type: 'text',
      required: true,
    },
  ],
}
