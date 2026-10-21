import { CollectionConfig } from 'payload'

export const BillingAddresses: CollectionConfig = {
  slug: 'billing-addresses',
  labels: {
    singular: 'Adres rozliczeniowy',
    plural: 'Adresy rozliczeniowe',
  },
  admin: {
    group: false,
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      label: 'Typ nabywcy',
      options: [
        {
          label: 'Osoba prywatna',
          value: 'person',
        },
        { label: 'Firma', value: 'organization' },
      ],
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'firstName',
      type: 'text',
      label: 'Imię',
      admin: {
        condition: (_, siblingData) => siblingData.type === 'person',
      },
    },
    {
      name: 'lastName',
      type: 'text',
      label: 'Nazwisko',
      admin: {
        condition: (_, siblingData) => siblingData.type === 'person',
      },
    },
    {
      name: 'nip',
      type: 'text',
      label: 'NIP',
      admin: {
        condition: (_, siblingData) => siblingData.type === 'organization',
      },
    },
    {
      name: 'companyName',
      type: 'text',
      label: 'Nazwa firmy',
      admin: {
        condition: (_, siblingData) => siblingData.type === 'organization',
      },
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
  ],
}
