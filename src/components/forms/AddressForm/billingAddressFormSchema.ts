import { BillingAddressType } from '@/collections/billing-addresses'
import z from 'zod'

const ERROR_MESSAGES = {
  required: 'To pole jest wymagane',
}

export const nonEmptyString = z.string().trim().min(1, { message: ERROR_MESSAGES.required })

const baseAddressShape = {
  id: z.number().optional(),
  // phone: z.string({ message: ERROR_MESSAGES.required }).pipe(nonEmptyString),
  addressLine1: z.string({ message: ERROR_MESSAGES.required }).pipe(nonEmptyString),
  addressLine2: z.string().optional(),
  city: z.string({ message: ERROR_MESSAGES.required }).pipe(nonEmptyString),
  // country: z.string({ message: ERROR_MESSAGES.required }).pipe(nonEmptyString),
  postalCode: z.string({ message: ERROR_MESSAGES.required }).pipe(nonEmptyString),
  submitAddress: z.boolean().optional(),
}

const personSchema = z.object({
  ...baseAddressShape,
  type: z.literal(BillingAddressType.PERSONAL),
  firstName: z.string({ message: ERROR_MESSAGES.required }).pipe(nonEmptyString),
  lastName: z.string({ message: ERROR_MESSAGES.required }).pipe(nonEmptyString),
  companyName: z.string().optional(),
  nip: z.string().optional(),
})

const organizationSchema = z.object({
  ...baseAddressShape,
  type: z.literal(BillingAddressType.ORGANIZATION),
  companyName: z.string({ message: ERROR_MESSAGES.required }).pipe(nonEmptyString),
  nip: z.string({ message: ERROR_MESSAGES.required }).pipe(nonEmptyString),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
})

export const createBillingAddressFormSchema = z.discriminatedUnion('type', [
  personSchema,
  organizationSchema,
])

export const updateBillingAddressFormSchema = createBillingAddressFormSchema

export type TCreateBillingAddressFormSchema = z.infer<typeof createBillingAddressFormSchema>
export type TUpdateBillingAddressFormSchema = z.infer<typeof updateBillingAddressFormSchema>
