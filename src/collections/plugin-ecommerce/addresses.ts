import { defaultCountries } from '@payloadcms/plugin-ecommerce/client/react'
import { EcommercePluginConfig } from '@payloadcms/plugin-ecommerce/types'

export const addresses: EcommercePluginConfig['addresses'] = {
  addressesCollectionOverride: ({ defaultCollection }) => ({
    ...defaultCollection,
    fields: [
      {
        name: 'customer',
        type: 'relationship',
        relationTo: 'users',
        required: true,
      },
      {
        name: 'firstName',
        type: 'text',
        required: true,
      },
      {
        name: 'lastName',
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
        type: 'select',
        options: defaultCountries,
        required: true,
      },
      {
        name: 'phone',
        type: 'text',
        required: true,
      },
    ],
  }),
}
