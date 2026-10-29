import type { ReactNode } from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { env } from '@/env'
import { Providers } from '@/providers'
import { Montserrat, Playfair_Display } from 'next/font/google'
import GeoWidget from '../geo-widget'
import './globals.css'

/* const { SITE_NAME } = env
const baseUrl = env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${env.NEXT_PUBLIC_VERCEL_URL}`
  : 'http://localhost:3000'
 */
/* export const metadata = {
  metadataBase: new URL(baseUrl),
  robots: {
    follow: true,
    index: true,
  },
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
} */

const montserrat = Montserrat({
  subsets: ['latin', 'latin-ext'], // dodaj latin-ext dla polskich znaków
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-montserrat', // <- to jest kluczowe
  display: 'swap',
})
const playfairDisplay = Playfair_Display({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '600', '700'],
  variable: '--font-playfair',
  display: 'swap',
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      className={[playfairDisplay.variable, montserrat.variable].filter(Boolean).join(' ')}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        <link
          rel="stylesheet"
          href={
            env.NODE_ENV === 'development'
              ? 'https://sandbox-easy-geowidget-sdk.easypack24.net/inpost-geowidget.css'
              : 'https://geowidget.inpost.pl/inpost-geowidget.css'
          }
        />
      </head>
      <body>
        <Providers>
          <AdminBar />
          <LivePreviewListener />

          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
        <GeoWidget />
      </body>
    </html>
  )
}
