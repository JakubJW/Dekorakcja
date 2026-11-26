import { isAdmin } from '@/access/isAdmin'
import { getDeliveryService } from '@/services/delivery-service/delivery-service'
import { Endpoint } from 'payload'
import { createShipmentForOrder } from '../operations/create-shipment-for-order'

export const createShipmentEndpoint: Endpoint = {
  path: `/:id/create-shipment`,
  method: 'post',
  handler: async (req) => {
    if (!req.user) return Response.json({ message: 'Unauthorized' }, { status: 401 })
    if (!isAdmin({ req })) return Response.json({ message: 'Forbidden' }, { status: 400 })

    try {
      const payload = req.payload
      const deliveryService = getDeliveryService()

      const params = req.routeParams
      //ten check jest bez sensu, bo w przypadku braku parametru w requescie zwraca not found
      if (!params || !params.id) return Response.json({ message: 'Brak orderId' }, { status: 400 })

      const result = await createShipmentForOrder(
        params.id as number,
        deliveryService,
        payload,
        req,
      )

      return Response.json({ success: true, result })
    } catch (error: any) {
      return Response.json({ message: error.message }, { status: 500 })
    }
  },
}
