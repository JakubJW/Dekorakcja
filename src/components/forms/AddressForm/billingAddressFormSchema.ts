import { BillingAddressType } from '@/collections/plugin-ecommerce/transactions'
import z from 'zod'

const ERROR_MESSAGES = {
  required: 'To pole jest wymagane',
}

export const nonEmptyString = z.string().trim().min(1, { message: ERROR_MESSAGES.required })

const baseAddressShape = {
  id: z.number().optional(),
  phone: z.string({ message: ERROR_MESSAGES.required }).pipe(nonEmptyString),
  email: z.email({ message: ERROR_MESSAGES.required }).pipe(nonEmptyString),
  addressLine1: z.string({ message: ERROR_MESSAGES.required }).pipe(nonEmptyString),
  addressLine2: z.string().optional(),
  city: z.string({ message: ERROR_MESSAGES.required }).pipe(nonEmptyString),
  country: z.string({ message: ERROR_MESSAGES.required }).pipe(nonEmptyString),
  postalCode: z.string({ message: ERROR_MESSAGES.required }).pipe(nonEmptyString),
}

const personSchema = z.object({
  ...baseAddressShape,
  kind: z.literal(BillingAddressType.PERSONAL),
  firstName: z.string({ message: ERROR_MESSAGES.required }).pipe(nonEmptyString),
  lastName: z.string({ message: ERROR_MESSAGES.required }).pipe(nonEmptyString),
  companyName: z.string().optional(),
  taxId: z.string().optional(),
})

const organizationSchema = z.object({
  ...baseAddressShape,
  kind: z.literal(BillingAddressType.ORGANIZATION),
  companyName: z.string({ message: ERROR_MESSAGES.required }).pipe(nonEmptyString),
  taxId: z.string({ message: ERROR_MESSAGES.required }).pipe(nonEmptyString),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
})

export const createAddressFormSchema = z.discriminatedUnion('kind', [
  personSchema,
  organizationSchema,
])

export const updateAddressFormSchema = createAddressFormSchema

export type TCreateAddressFormSchema = z.infer<typeof createAddressFormSchema>
export type TUpdateAddressFormSchema = z.infer<typeof updateAddressFormSchema>
