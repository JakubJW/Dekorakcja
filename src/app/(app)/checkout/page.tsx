import { CheckoutPage } from '@/components/checkout/CheckoutPage'
import { env } from '@/env'
import { mapAddressToDomain } from '@/features/addresses/mapper'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import configPromise from '@payload-config'
import type { Metadata } from 'next'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import { Fragment } from 'react'

export default async function Checkout() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  const shippingMethods = await payload
    .find({
      collection: 'shipping-methods',
      depth: 0,
      sort: 'sortOrder',
    })
    .then((res) => res.docs)

  const addresses = user
    ? await payload
        .find({
          collection: 'addresses',
          depth: 0,
          where: {
            customer: {
              equals: user ? user.id : null,
            },
          },
        })
        .then((res) => res.docs.map((doc) => mapAddressToDomain(doc)))
    : []

  return (
    <div className="container min-h-[90vh] flex">
      {!env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && (
        <div>
          <Fragment>
            {'To enable checkout, you must '}
            <a
              href="https://dashboard.stripe.com/test/apikeys"
              rel="noopener noreferrer"
              target="_blank"
            >
              obtain your Stripe API Keys
            </a>
            {' then set them as environment variables. See the '}
            <a
              href="https://github.com/payloadcms/payload/blob/3.x/templates/ecommerce/README.md#stripe"
              rel="noopener noreferrer"
              target="_blank"
            >
              README
            </a>
            {' for more details.'}
          </Fragment>
        </div>
      )}

      <h1 className="sr-only">Checkout</h1>
      <CheckoutPage addresses={addresses} shippingMethods={shippingMethods} />
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Checkout.',
  openGraph: mergeOpenGraph({
    title: 'Checkout',
    url: '/checkout',
  }),
  title: 'Checkout',
}
