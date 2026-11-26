import { EcommercePluginConfig } from '@payloadcms/plugin-ecommerce/types'

export enum BillingAddressType {
  PERSONAL = 'person',
  ORGANIZATION = 'organization',
}

export const transactions: EcommercePluginConfig['transactions'] = {
  transactionsCollectionOverride: ({ defaultCollection }) => ({
    ...defaultCollection,
    admin: {
      ...defaultCollection.admin,
      group: 'Rozliczenia',
    },
    fields: [
      ...defaultCollection.fields,
      {
        name: 'checkoutData',
        type: 'json',
        admin: {
          hidden: true,
        },
      },
    ],
  }),
}
