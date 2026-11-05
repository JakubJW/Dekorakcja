import { defaultCountries } from '@payloadcms/plugin-ecommerce/client/react'
import { EcommercePluginConfig } from '@payloadcms/plugin-ecommerce/types'
import { APIError } from 'payload'
import { supportedCountries } from './supported-countries'

export const addresses: EcommercePluginConfig['addresses'] = {
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
    fields: [
      {
        name: 'customer',
        label: 'Klient',
        type: 'relationship',
        relationTo: 'users',
        required: true,
      },
      {
        name: 'firstName',
        label: 'Imię',
        type: 'text',
      },
      {
        name: 'lastName',
        label: 'Nazwisko',
        type: 'text',
      },
      {
        name: 'taxId',
        label: 'NIP',
        type: 'text',
      },
      {
        name: 'companyName',
        label: 'Nazwa firmy',
        type: 'text',
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
        type: 'select',
        label: 'Kraj',
        options: defaultCountries,
        required: true,
      },
      {
        name: 'phone',
        label: 'Telefon',
        type: 'text',
        required: true,
      },
    ],
  }),
}
