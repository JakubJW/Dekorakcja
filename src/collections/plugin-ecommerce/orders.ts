import { adminOnlyFieldAccess } from '@/access/adminOnlyFieldAccess'
import { EcommercePluginConfig } from '@payloadcms/plugin-ecommerce/types'
import crypto from 'crypto'

const extractByName = (fields: any[], names: string[]): any[] =>
  fields.flatMap((field) => {
    if ('name' in field && names.includes(field.name)) return [field]
    if (Array.isArray(field.fields)) return extractByName(field.fields, names)
    if (Array.isArray(field.tabs)) {
      return field.tabs.flatMap((tab: any) => extractByName(tab.fields ?? [], names))
    }
    return []
  })

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
      {
        name: 'billingAddress',
        type: 'group',
        required: true,
        fields: [
          {
            name: 'type',
            type: 'select',
            label: 'Typ nabywcy',
            defaultValue: 'person',
            options: [
              {
                label: 'Osoba prywatna',
                value: 'person',
              },
              {
                label: 'Firma',
                value: 'organization',
              },
            ],
          },
          {
            name: 'firstName',
            type: 'text',
            label: 'Imię',
            admin: {
              condition: (_, siblingData) => siblingData.type === 'person',
            },
          },
          {
            name: 'lastName',
            type: 'text',
            label: 'Nazwisko',
            admin: {
              condition: (_, siblingData) => siblingData.type === 'person',
            },
          },
          {
            name: 'nip',
            type: 'text',
            label: 'NIP',
            admin: {
              condition: (_, siblingData) => siblingData.type === 'organization',
            },
          },
          {
            name: 'companyName',
            type: 'text',
            label: 'Nazwa firmy',
            admin: {
              condition: (_, siblingData) => siblingData.type === 'organization',
            },
          },
          {
            name: 'addressLine1',
            type: 'text',
            required: true,
            label: 'Ulica i numer domu',
          },
          {
            name: 'addressLine2',
            type: 'text',
            label: 'Mieszkanie',
          },
          {
            name: 'city',
            type: 'text',
            required: true,
            label: 'Miejscowość',
          },
          {
            name: 'postalCode',
            type: 'text',
            required: true,
            label: 'Kod pocztowy',
          },
          {
            name: 'country',
            type: 'text',
            required: true,
            defaultValue: 'PL',
            label: 'Kraj',
          },
        ],
      },
      ...extractByName(defaultCollection.fields, ['amount', 'currency', 'items']),
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
