import { EcommercePluginConfig } from '@payloadcms/plugin-ecommerce/types'
import crypto from 'crypto'
import { createShipmentEndpoint } from './orders/endpoints/create-shipment-endpoint'

export const orders: EcommercePluginConfig['orders'] = {
  //@ts-ignore
  ordersCollectionOverride: ({ defaultCollection }) => ({
    ...defaultCollection,
    admin: {
      ...defaultCollection.admin,
      group: 'Sklep',
      defaultColumns: ['id', 'items', 'amount', 'status', 'createdAt'],
    },
    endpoints: [createShipmentEndpoint],
    fields: [
      ...defaultCollection.fields.map((defaultField) => {
        if (defaultField.type !== 'tabs') return defaultField

        return {
          ...defaultField,
          tabs: defaultField.tabs.map((defaultTab, index) => {
            if (index === 1) {
              return {
                ...defaultTab,
                fields: [
                  {
                    name: 'shippingMethod',
                    label: 'Metoda dostawy',
                    type: 'relationship',
                    relationTo: 'shipping-methods',
                    required: true,
                  },
                  {
                    name: 'additional_data',
                    label: 'Dodatkowe informacje',
                    type: 'json',
                  },
                  ...defaultTab.fields,
                ],
              }
            }

            return defaultTab
          }),
        }
      }),
      // {
      //   name: 'invoiceStatusUi',
      //   type: 'ui',
      //   admin: {
      //     position: 'sidebar',
      //     components: {
      //       Field: '@/components/admin/order-invoice-status#InvoiceStatusUi',
      //     },
      //   },
      // },
      {
        name: 'shipmentStatusUi',
        type: 'ui',
        admin: {
          position: 'sidebar',
          components: {
            Field: '@/components/admin/order-shipping-status#ShippingStatusUI',
          },
        },
      },
      {
        name: 'accessToken',
        type: 'text',
        unique: true,
        index: true,
        admin: {
          hidden: true,
          readOnly: true,
        },
        hooks: {
          beforeValidate: [
            ({ value, operation }) => {
              if (operation === 'create' || !value) {
                return crypto.randomUUID()
              }
              return value
            },
          ],
        },
      },
    ],
  }),
}
