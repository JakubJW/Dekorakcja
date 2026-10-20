import { EcommercePluginConfig } from '@payloadcms/plugin-ecommerce/types'

export const transactions: EcommercePluginConfig['transactions'] = {
  transactionsCollectionOverride: ({ defaultCollection }) => ({
    ...defaultCollection,
    admin: {
      group: 'Sklep',
    },
  }),
}
