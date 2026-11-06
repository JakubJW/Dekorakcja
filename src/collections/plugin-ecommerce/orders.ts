import { adminOnlyFieldAccess } from '@/access/adminOnlyFieldAccess'
import { defaultCountries } from '@payloadcms/plugin-ecommerce/client/react'
import { EcommercePluginConfig } from '@payloadcms/plugin-ecommerce/types'
import crypto from 'crypto'

export enum BillingAddressType {
  PERSONAL = 'person',
  ORGANIZATION = 'organization',
}

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
        name: 'shippingMethod',
        label: 'Metoda dostawy',
        type: 'relationship',
        relationTo: 'shipping-methods',
        required: true,
      },
      {
        type: 'row',
        fields: [
          {
            name: 'shippingAddress',
            label: 'Adres dostawy',
            type: 'group',
            fields: [
              {
                name: 'firstName',
                label: 'Imię',
                type: 'text',
                required: true,
              },
              {
                name: 'lastName',
                label: 'Nazwisko',
                type: 'text',
                required: true,
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
                label: 'Miejscowość',
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
                name: 'phone',
                label: 'Telefon',
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
            ],
          },
          {
            name: 'billingAddress',
            label: 'Adres rozliczeniowy',
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
                  condition: (_, siblingData) => siblingData.type === BillingAddressType.PERSONAL,
                },
              },
              {
                name: 'lastName',
                type: 'text',
                label: 'Nazwisko',
                admin: {
                  condition: (_, siblingData) => siblingData.type === BillingAddressType.PERSONAL,
                },
              },
              {
                name: 'nip',
                type: 'text',
                label: 'NIP',
                admin: {
                  condition: (_, siblingData) =>
                    siblingData.type === BillingAddressType.ORGANIZATION,
                },
              },
              {
                name: 'companyName',
                type: 'text',
                label: 'Nazwa firmy',
                admin: {
                  condition: (_, siblingData) =>
                    siblingData.type === BillingAddressType.ORGANIZATION,
                },
              },
              {
                name: 'addressLine1',
                type: 'text',
                required: true,
                label: 'Ulica',
              },
              {
                name: 'addressLine2',
                type: 'text',
                label: 'Numer lokalu',
              },
              {
                name: 'city',
                type: 'text',
                required: true,
                label: 'Miejscowość',
              },
              {
                name: 'phone',
                label: 'Telefon',
                required: true,
                type: 'text',
              },
              {
                name: 'postalCode',
                type: 'text',
                required: true,
                label: 'Kod pocztowy',
              },
              {
                name: 'country',
                type: 'select',
                required: true,
                options: defaultCountries,
                label: 'Kraj',
              },
            ],
          },
        ],
      },
      ...extractByName(defaultCollection.fields, ['amount', 'currency', 'items']).map((field) =>
        'name' in field && field.name === 'amount'
          ? { ...field, admin: { ...field.admin, position: 'sidebar', readOnly: true } }
          : 'name' in field && field.name === 'currency'
            ? { ...field, admin: { ...field.admin, hidden: true } }
            : field,
      ),
      {
        name: 'invoiceStatusUi',
        type: 'ui',
        admin: {
          position: 'sidebar',
          condition: (_, siblingData) => siblingData.billingAddress.type === 'organization',
          components: {
            Field: '@/components/admin/order-invoice-status#InvoiceStatusUi',
          },
        },
      },
      {
        name: 'customer',
        label: 'Klient',
        type: 'relationship',
        relationTo: 'users',
        admin: {
          position: 'sidebar',
          condition: (_, siblingData) => siblingData.customer !== null,
          readOnly: true,
        },
      },
      {
        label: 'Email klienta',
        admin: {
          position: 'sidebar',
          condition: (_, siblingData) => siblingData.customer === null,
        },
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
      {
        name: 'invoiceStatus',
        label: 'Faktura',
        type: 'boolean',
        admin: {
          position: 'sidebar',
          condition: (_, siblingData) =>
            siblingData.billingAddress.type === BillingAddressType.ORGANIZATION,
        },
      },
    ],
  }),
}
