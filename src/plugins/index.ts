import { adminOnlyFieldAccess } from '@/access/adminOnlyFieldAccess'
import { adminOrPublishedStatus } from '@/access/adminOrPublishedStatus'
import { customerOnlyFieldAccess } from '@/access/customerOnlyFieldAccess'
import { isAdmin } from '@/access/isAdmin'
import { isDocumentOwner } from '@/access/isDocumentOwner'
import { ecommerceCollections } from '@/collections/plugin-ecommerce'
import { env } from '@/env'
import { Page, Product } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'
import { ecommercePlugin } from '@payloadcms/plugin-ecommerce'
import { stripeAdapter } from '@payloadcms/plugin-ecommerce/payments/stripe'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { Plugin } from 'payload'
import { confirmOrder } from './confirm-order'
import { initiatePayment } from './initiatePayment'

const generateTitle: GenerateTitle<Product | Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | Payload Ecommerce Template` : 'Payload Ecommerce Template'
}

const generateURL: GenerateURL<Product | Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

export const plugins: Plugin[] = [
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  s3Storage({
    enabled: Boolean(env.R2_BUCKET),
    collections: {
      media: {
        disablePayloadAccessControl: true,
        generateFileURL: ({ filename, prefix }) => {
          const key = prefix ? `${prefix}/${filename}` : filename
          return `${env.R2_PUBLIC_URL}/${key}`
        },
      },
    },
    bucket: env.R2_BUCKET,
    config: {
      credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID,
        secretAccessKey: env.R2_SECRET_ACCESS_KEY,
      },
      region: 'auto',
      endpoint: env.R2_ENDPOINT,
      forcePathStyle: true,
    },
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
    },
    formSubmissionOverrides: {
      access: {
        delete: isAdmin,
        read: isAdmin,
        update: isAdmin,
      },
      admin: {
        group: 'Content',
      },
    },
    formOverrides: {
      access: {
        delete: isAdmin,
        read: isAdmin,
        update: isAdmin,
        create: isAdmin,
      },
      admin: {
        group: 'Content',
      },
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  ]
                },
              }),
            }
          }
          return field
        })
      },
    },
  }),
  ecommercePlugin({
    currencies: {
      defaultCurrency: 'PLN',
      supportedCurrencies: [
        {
          code: 'PLN',
          label: 'PLN',
          symbol: 'zł',
          decimals: 2,
        },
      ],
    },
    access: {
      adminOnlyFieldAccess,
      adminOrPublishedStatus,
      customerOnlyFieldAccess,
      isAdmin,
      isDocumentOwner,
    },
    ...ecommerceCollections,
    payments: {
      paymentMethods: [
        {
          ...stripeAdapter({
            secretKey: env.STRIPE_SECRET_KEY,
            publishableKey: env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
          }),
          initiatePayment: initiatePayment({ secretKey: env.STRIPE_SECRET_KEY }),
          confirmOrder: confirmOrder({ secretKey: env.STRIPE_SECRET_KEY }),
        },
      ],
    },
  }),
  (config) => {
    const usersCollection = config.collections?.find((c) => c.slug === 'users')
    const cartField = usersCollection?.fields.find((f) => 'name' in f && f.name === 'cart') as
      | { where?: Record<string, unknown> }
      | undefined

    if (cartField) {
      cartField.where = {
        purchasedAt: { exists: false },
      }
    }

    return config
  },
]
