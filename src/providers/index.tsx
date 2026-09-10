import { AuthProvider } from '@/providers/Auth'
import { SonnerProvider } from '@/providers/Sonner'
import { EcommerceProvider } from '@payloadcms/plugin-ecommerce/client/react'
import { stripeAdapterClient } from '@payloadcms/plugin-ecommerce/payments/stripe'
import React from 'react'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <EcommerceProvider
      enableVariants={true}
      currenciesConfig={{
        defaultCurrency: 'PLN',
        supportedCurrencies: [
          {
            code: 'PLN',
            label: 'PLN',
            symbol: 'zł',
            decimals: 2,
          },
        ],
      }}
      api={{
        cartsFetchQuery: {
          depth: 2,
          populate: {
            products: {
              slug: true,
              title: true,
              gallery: true,
              inventory: true,
            },
            variants: {
              title: true,
              inventory: true,
            },
          },
        },
      }}
      paymentMethods={[
        stripeAdapterClient({
          publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
        }),
      ]}
    >
      <SonnerProvider />
      <AuthProvider>{children}</AuthProvider>
    </EcommerceProvider>
  )
}
