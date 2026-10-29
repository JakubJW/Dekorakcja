'use client'

import { env } from '@/env'
import Script from 'next/script'

export default function GeoWidget() {
  return <Script src={env.NEXT_PUBLIC_GEOWIGDET_SOURCE} defer />
}
