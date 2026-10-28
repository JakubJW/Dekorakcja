import { CollectionConfig } from 'payload'

export enum BillingAddressType {
  PERSONAL = 'person',
  ORGANIZATION = 'organization',
}

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
          value: BillingAddressType.PERSONAL,
        },
        { label: 'Firma', value: BillingAddressType.ORGANIZATION },
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
        condition: (_, siblingData) => siblingData.type === BillingAddressType.PERSONAL,
      },
    },
    {
      name: 'lastName',
      type: 'text',
      label: 'Nazwisko',
      admin: {
        condition: (_, siblingData) => siblingData.type === BillingAddressType.PERSONAL,
      },
    },
    {
      name: 'nip',
      type: 'text',
      label: 'NIP',
      admin: {
        condition: (_, siblingData) => siblingData.type === BillingAddressType.ORGANIZATION,
      },
    },
    {
      name: 'companyName',
      type: 'text',
      label: 'Nazwa firmy',
      admin: {
        condition: (_, siblingData) => siblingData.type === BillingAddressType.ORGANIZATION,
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
