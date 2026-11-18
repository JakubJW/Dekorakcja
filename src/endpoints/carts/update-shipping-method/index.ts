import { addDataAndFileToRequest, Endpoint } from 'payload'
import z from 'zod'

const slugEnum = z.enum(['kurier-inpost', 'paczkomat-inpost'])

const courierSchema = z.object({
  methodSlug: z.literal(slugEnum.enum['kurier-inpost']),
})

const lockerSchema = z.object({
  methodSlug: z.literal(slugEnum.enum['paczkomat-inpost']),
  lockerData: z.object({
    name: z.string(),
    address: z.object({
      line1: z.string(),
      line2: z.string(),
    }),
    location_description: z.string(),
  }),
})

const shippingSchema = z.discriminatedUnion('methodSlug', [courierSchema, lockerSchema])

export const updateCartEndpoint: Endpoint = {
  path: `/actions/carts/:id/update-shipping-method`,
  method: 'put',
  handler: async (req) => {
    await addDataAndFileToRequest(req)
    const params = req.routeParams

    if (!params || !params.id)
      return Response.json({ message: 'Brak wskazanego koszyka' }, { status: 400 })

    try {
      const { payload, data } = req
      const parsed = shippingSchema.parse(data)

      const [shippingMethod] = await payload
        .find({
          collection: 'shipping-methods',
          select: {},
          where: { slug: { equals: parsed.methodSlug } },
          limit: 1,
        })
        .then((data) => data.docs)

      const res = await payload.update({
        collection: 'carts',
        id: Number(params.id),
        data: {
          shippingMethod: shippingMethod.id,
          lockerData: parsed.methodSlug === 'paczkomat-inpost' ? parsed.lockerData : null,
        },
        depth: 2,
        select: {
          shippingMethod: true,
        },
        user: req.user,
        overrideAccess: false,
        req,
      })

      return Response.json({ success: true, data: res })
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return Response.json({ issues: error.issues }, { status: 400 })
      }

      return Response.json({ message: error }, { status: 500 })
    }
  },
}
