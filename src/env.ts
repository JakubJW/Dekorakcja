import { createEnv } from '@t3-oss/env-nextjs'
import * as z from 'zod'

export const env = createEnv({
  server: {
    NODE_ENV: z.string(),
    PAYLOAD_SECRET: z.string(),
    PAYLOAD_PUBLIC_SERVER_URL: z.string(),
    DATABASE_URL: z.url(),
    COMPANY_NAME: z.string(),
    SITE_NAME: z.string(),
    R2_PUBLIC_URL: z.string(),
    R2_BUCKET: z.string(),
    R2_ACCESS_KEY_ID: z.string(),
    R2_SECRET_ACCESS_KEY: z.string(),
    R2_ENDPOINT: z.string(),
    INSERT_CLIENT_ID: z.string(),
    INSERT_CLIENT_SECRET: z.string(),
    INSERT_SUBSCRIPTION_KEY: z.string(),
    INSERT_REDIRECT_URI: z.string(),
    PREVIEW_SECRET: z.string(),
    STRIPE_SECRET_KEY: z.string(),
    VERCEL_PROJECT_PRODUCTION_URL: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_SERVER_URL: z.string(),
    NEXT_PUBLIC_VERCEL_URL: z.string().optional(),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string(),
    NEXT_PUBLIC_GEOWIGDET_SOURCE: z.string(),
    NEXT_PUBLIC_INPOST_GEOWIDGET_TOKEN: z.string(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
    NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_GEOWIGDET_SOURCE: process.env.NEXT_PUBLIC_GEOWIGDET_SOURCE,
    NEXT_PUBLIC_INPOST_GEOWIDGET_TOKEN: process.env.NEXT_PUBLIC_INPOST_GEOWIDGET_TOKEN,
  },
})
