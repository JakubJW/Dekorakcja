import { z } from 'zod'

const addressSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  line1: z.string().min(1, 'Adres jest wymagany'),
  line2: z.string().optional(),
  city: z.string().min(1, 'Miasto jest wymagane'),
  postalCode: z.string().min(1, 'Kod pocztowy jest wymagany'),
  country: z.string().length(2),
  companyName: z.string().optional(),
  taxId: z.string().optional(),
  email: z.string().email().optional(),
})

export const initiatePaymentDataSchema = z.object({
  cartID: z.string(),
  currency: z
    .string()
    .length(3)
    .transform((v) => v.toLowerCase()),
  shippingAddress: addressSchema,
  hasDifferentBillingAddress: z.boolean(),
  billingAddress: addressSchema.optional(),
  shippingMethodID: z.string(),
  parcelLockerName: z.string().optional(), // np. dla InPost
})
