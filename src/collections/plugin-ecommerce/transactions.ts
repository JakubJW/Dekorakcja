import { transformFieldsByName } from '@/utilities/transformField'
import { defaultCountries } from '@payloadcms/plugin-ecommerce/client/react'
import { EcommercePluginConfig } from '@payloadcms/plugin-ecommerce/types'

export enum BillingAddressType {
  PERSONAL = 'person',
  ORGANIZATION = 'organization',
}

export const transactions: EcommercePluginConfig['transactions'] = {
  transactionsCollectionOverride: ({ defaultCollection }) => ({
    ...defaultCollection,
    admin: {
      group: 'Sklep',
    },
    fields: [
      ...transformFieldsByName(defaultCollection.fields, {
        billingAddress: () => ({
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
                //@ts-ignore
                condition: (_, siblingData) => siblingData.type === BillingAddressType.PERSONAL,
              },
            },
            {
              name: 'lastName',
              type: 'text',
              label: 'Nazwisko',
              admin: {
                //@ts-ignore
                condition: (_, siblingData) => siblingData.type === BillingAddressType.PERSONAL,
              },
            },
            {
              name: 'nip',
              type: 'text',
              label: 'NIP',
              admin: {
                //@ts-ignore
                condition: (_, siblingData) => siblingData.type === BillingAddressType.ORGANIZATION,
              },
            },
            {
              name: 'companyName',
              type: 'text',
              label: 'Nazwa firmy',
              admin: {
                //@ts-ignore
                condition: (_, siblingData) => siblingData.type === BillingAddressType.ORGANIZATION,
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
        }),
      }),
      {
        name: 'checkoutData',
        type: 'json',
      },
    ],
  }),
}
