import z from 'zod'

const ERROR_MESSAGES = {
  required: 'To pole jest wymagane',
}

export const nonEmptyString = z.string().trim().min(1, { message: ERROR_MESSAGES.required })

export const createOrganizationAddressFormSchema = z.object({
  nip: z.string({ message: ERROR_MESSAGES.required }).pipe(nonEmptyString),
  organization: z.string({ message: ERROR_MESSAGES.required }).pipe(nonEmptyString),
  addressLine1: z.string({ message: ERROR_MESSAGES.required }).pipe(nonEmptyString),
  addressLine2: z.string({ message: ERROR_MESSAGES.required }).optional(),
  city: z.string({ message: ERROR_MESSAGES.required }).pipe(nonEmptyString),
  country: z.string({ message: ERROR_MESSAGES.required }).pipe(nonEmptyString),
  postalCode: z.string({ message: ERROR_MESSAGES.required }).pipe(nonEmptyString),
  submitOrganizationAddress: z.boolean().optional(),
})

export const updateOrganizationAddressFormSchema = createOrganizationAddressFormSchema.extend({})

export type TCreateOrganizationAddressFormSchema = z.infer<
  typeof createOrganizationAddressFormSchema
>
export type TUpdateOrganizationAddressFormSchema = z.infer<
  typeof updateOrganizationAddressFormSchema
>
