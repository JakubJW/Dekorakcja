import { CheckoutPage } from '@/components/checkout/CheckoutPage'
import { FormStepProvider } from '@/components/checkout/FormStepProvider'
import { PaymentDataProvider } from '@/components/checkout/PaymentDataProvider'
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

  const organizationAddresses = user
    ? await payload
        .find({
          collection: 'organization-addresses',
          depth: 0,
          where: {
            customer: {
              equals: user ? user.id : null,
            },
          },
        })
        .then((res) => res.docs)
    : []

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
        .then((res) => res.docs)
    : []

  return (
    <div className="container min-h-[90vh] flex">
      {!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && (
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

      <PaymentDataProvider addresses={addresses} organizationAddresses={organizationAddresses}>
        <FormStepProvider>
          <CheckoutPage />
        </FormStepProvider>
      </PaymentDataProvider>
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
