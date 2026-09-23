'use client'

import Script from 'next/script'

export default function GeoWidget() {
  return (
    <Script
      src={
        process.env.NODE_ENV === 'development'
          ? 'https://sandbox-easy-geowidget-sdk.easypack24.net/inpost-geowidget.js'
          : 'https://geowidget.inpost.pl/inpost-geowidget.js'
      }
      defer
    />
  )
}
