import { CartItemMatcher } from '@payloadcms/plugin-ecommerce'
import { EcommercePluginConfig } from '@payloadcms/plugin-ecommerce/types'

const personalizationCartItemMatcher: CartItemMatcher = ({ existingItem, newItem }) => {
  const existingProductID =
    typeof existingItem.product === 'object' ? existingItem.product.id : existingItem.product
  const existingVariantID =
    existingItem.variant && typeof existingItem.variant === 'object'
      ? existingItem.variant.id
      : existingItem.variant

  const productMatches = existingProductID === newItem.product
  const variantMatches = newItem.variant
    ? existingVariantID === newItem.variant
    : !existingVariantID

  const existingText = (existingItem.personalizationText as string | undefined) || ''
  const newText = (newItem.personalizationText as string | undefined) || ''
  const textMatches = existingText === newText

  return productMatches && variantMatches && textMatches
}

export const carts: EcommercePluginConfig['carts'] = {
  cartItemMatcher: personalizationCartItemMatcher,
  //@ts-ignore
  cartsCollectionOverride: ({ defaultCollection }) => ({
    ...defaultCollection,
    admin: {
      group: 'Sklep',
    },
    fields: [
      ...defaultCollection.fields.map((field) => {
        if ('name' in field && field.name === 'items' && field.type === 'array') {
          return {
            ...field,
            fields: [
              ...field.fields,
              {
                name: 'personalizationText',
                label: 'Tekst personalizacji',
                type: 'text',
                admin: {
                  description: 'Wpisz tekst, który ma zostać wygrawerowany lub nadrukowany.',
                },
              },
            ],
          }
        }
        return field
      }),
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
