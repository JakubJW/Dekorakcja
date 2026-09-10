import z from 'zod'

const ERROR_MESSAGES = {
  required: 'To pole jest wymagane',
}

export const nonEmptyString = z.string().trim().min(1, { message: ERROR_MESSAGES.required })

export const createAddressFormSchema = z.object({
  firstName: z.string({ message: ERROR_MESSAGES.required }).pipe(nonEmptyString),
  lastName: z.string({ message: ERROR_MESSAGES.required }).pipe(nonEmptyString),
  phone: z.string({ message: ERROR_MESSAGES.required }).pipe(nonEmptyString),
  addressLine1: z.string({ message: ERROR_MESSAGES.required }).pipe(nonEmptyString),
  addressLine2: z.string({ message: ERROR_MESSAGES.required }).optional(),
  city: z.string({ message: ERROR_MESSAGES.required }).pipe(nonEmptyString),
  country: z.string({ message: ERROR_MESSAGES.required }).pipe(nonEmptyString),
  postalCode: z.string({ message: ERROR_MESSAGES.required }).pipe(nonEmptyString),
  submitAddress: z.boolean().optional(),
})

export const updateAddressFormSchema = createAddressFormSchema.extend({})

export type TCreateAddressFormSchema = z.infer<typeof createAddressFormSchema>
export type TUpdateAddressFormSchema = z.infer<typeof updateAddressFormSchema>
