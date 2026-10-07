import { z } from 'zod'

export const InquirySchema = z.object({
  rentalCartId: z.coerce.number().int().positive('Rental cart ID must be a positive number'),
  customerId: z.coerce.number().int().positive('Customer ID must be a positive number').optional(),
})

export type InquiryRequest = z.infer<typeof InquirySchema>
