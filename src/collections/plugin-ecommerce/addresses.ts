import { EcommercePluginConfig } from '@payloadcms/plugin-ecommerce/types'
import { APIError, Field } from 'payload'
import { supportedCountries } from './supported-countries'

const fields: Field[] = [
  {
    name: 'kind',
    label: 'Rodzaj',
    type: 'select',
    defaultValue: 'person',
    admin: {
      hidden: true,
    },
    options: [
      {
        label: 'Prywatny',
        value: 'person',
      },
      {
        label: 'Firmowy',
        value: 'organization',
      },
    ],
  },
  {
    name: 'firstName',
    label: 'Imię',
    type: 'text',
    admin: {
      condition: (_, siblingData) => siblingData.kind === 'person',
    },
  },
  {
    name: 'lastName',
    label: 'Nazwisko',
    type: 'text',
    admin: {
      condition: (_, siblingData) => siblingData.kind === 'person',
    },
  },
  {
    name: 'taxId',
    label: 'NIP',
    type: 'text',
    admin: {
      condition: (_, siblingData) => siblingData.kind === 'organization',
    },
  },
  {
    name: 'companyName',
    label: 'Nazwa firmy',
    type: 'text',
    admin: {
      condition: (_, siblingData) => siblingData.kind === 'organization',
    },
  },
  {
    name: 'email',
    type: 'text',
    required: true,
    label: 'Adres e-mail',
  },
  {
    name: 'addressLine1',
    label: 'Ulica',
    type: 'text',
    required: true,
  },
  {
    name: 'addressLine2',
    label: 'Numer lokalu',
    type: 'text',
  },
  {
    name: 'city',
    label: 'Miejsocowść',
    type: 'text',
    required: true,
  },
  {
    name: 'postalCode',
    label: 'Kod pocztowy',
    type: 'text',
    required: true,
  },
  {
    name: 'country',
    type: 'text',
    label: 'Kraj',
    required: true,
  },
  {
    name: 'phone',
    label: 'Telefon',
    type: 'text',
    required: true,
  },
]

export const addresses: EcommercePluginConfig['addresses'] = {
  addressFields: () => fields,
  supportedCountries,
  addressesCollectionOverride: ({ defaultCollection }) => ({
    ...defaultCollection,
    hooks: {
      ...defaultCollection.hooks,
      beforeValidate: [
        ({ data }) => {
          const person = !!data?.firstName && !!data?.lastName
          const company = !!data?.companyName && !!data?.taxId

          if (!person && !company) throw new APIError('Adres musi mieć dane osoby lub firmy', 400)

          return data
        },
      ],
    },
  }),
}
