import { handleApiError } from '@/lib/errors/api-error-handler'
import { InquirySchema } from '@/lib/schemas/inquiry'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

export async function POST(req: NextRequest) {
  try {
    const json = await req.json()

    const { rentalCartId, customerId } = InquirySchema.parse(json)

    const payload = await getPayload({ config })
    const inquiry = await payload.create({
      collection: 'inquiries',
      data: { user: customerId, 'rent-cart': rentalCartId },
    })

    return NextResponse.json({ inquiry })
  } catch (error) {
    return handleApiError(error)
  }
}
