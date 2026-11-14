import { EcommercePluginConfig } from '@payloadcms/plugin-ecommerce/types'

export const carts: EcommercePluginConfig['carts'] = {
  cartsCollectionOverride: ({ defaultCollection }) => ({
    ...defaultCollection,
    admin: {
      group: 'Sklep',
    },
    fields: [
      ...defaultCollection.fields,
      {
        name: 'shippingMethod',
        label: 'Metoda dostawy',
        type: 'relationship',
        relationTo: 'shipping-methods',
      },
      {
        name: 'lockerData',
        label: 'Dane punktu odbioru',
        type: 'json',
      },
    ],
  }),
}
