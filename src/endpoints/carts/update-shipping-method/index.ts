import { addDataAndFileToRequest, Endpoint } from 'payload'

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

      const res = await payload.update({
        collection: 'carts',
        id: Number(params.id),
        data: { shippingMethod: data?.methodId, lockerData: data?.lockerData },
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
      return Response.json({ message: error.message }, { status: 500 })
    }
  },
}
