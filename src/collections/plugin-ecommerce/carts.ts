import { EcommercePluginConfig } from '@payloadcms/plugin-ecommerce/types'

export const carts: EcommercePluginConfig['carts'] = {
  cartsCollectionOverride: ({ defaultCollection }) => ({
    ...defaultCollection,
    admin: {
      group: 'Sklep',
    },
  }),
}
