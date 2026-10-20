import { adminOnlyFieldAccess } from '@/access/adminOnlyFieldAccess'
import { EcommercePluginConfig } from '@payloadcms/plugin-ecommerce/types'
import crypto from 'crypto'

export const orders: EcommercePluginConfig['orders'] = {
  ordersCollectionOverride: ({ defaultCollection }) => ({
    ...defaultCollection,
    admin: {
      group: 'Sklep',
    },
    fields: [
      {
        name: 'shippingAddress',
        type: 'group',
        fields: [
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
            name: 'phone',
            type: 'text',
            required: true,
          },
        ],
      },
      ...defaultCollection.fields.filter(
        (field) =>
          ('name' in field && field.name === 'amount') ||
          ('name' in field && field.name === 'currency'),
      ),
      {
        name: 'customer',
        type: 'relationship',
        relationTo: 'users',
      },
      {
        name: 'customerEmail',
        type: 'text',
      },
      {
        name: 'transactions',
        type: 'relationship',
        access: {
          create: adminOnlyFieldAccess,
          read: adminOnlyFieldAccess,
          update: adminOnlyFieldAccess,
        },
        admin: {
          position: 'sidebar',
        },
        hasMany: true,
        relationTo: 'transactions',
      },
      {
        name: 'status',
        type: 'select',
        admin: {
          position: 'sidebar',
        },
        defaultValue: 'processing',
        interfaceName: 'OrderStatus',
        options: [
          {
            label: 'W trakcie',
            value: 'processing',
          },
          {
            label: 'Zakończone',
            value: 'completed',
          },
          {
            label: 'Anulowane',
            value: 'cancelled',
          },
          {
            label: 'Zwrócono środki',
            value: 'refunded',
          },
        ],
      },
      {
        name: 'accessToken',
        type: 'text',
        unique: true,
        index: true,
        admin: {
          position: 'sidebar',
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
