import { Endpoint } from 'payload'

export const deleteAddressEndpoint: Endpoint = {
  path: `/actions/addresses/:id`,
  method: 'delete',
  handler: async (req) => {
    if (!req.user) return Response.json({ message: 'Unauthorized' }, { status: 401 })

    const params = req.routeParams

    if (!params || !params.id) return Response.json({ message: 'Brak addressId' }, { status: 400 })

    try {
      const payload = req.payload

      const res = payload.delete({ collection: 'addresses', id: params.id as number })

      return Response.json({ success: true })
    } catch (error: any) {
      return Response.json({ message: error.message }, { status: 500 })
    }
  },
}
