import { getDeliveryService } from '@/services/delivery-service/delivery-service'
import type { Endpoint } from 'payload'
import { addDataAndFileToRequest } from 'payload'
import { ShipmentWebhookEvent } from './types'

export const inPostWebhookEndpoint: Endpoint = {
  path: '/webhooks/inpost',
  method: 'post',
  handler: async (req) => {
    await addDataAndFileToRequest(req)
    const { payload, data } = req

    if (!data) throw new Error('Pusty webhook niemozliwe')

    const body = data as ShipmentWebhookEvent

    switch (body.event) {
      case 'shipment_confirmed':
        const {
          payload: { shipment_id, tracking_number },
        } = body

        const deliveryService = getDeliveryService()
        const labelPdfBuffer = await deliveryService.getShipmentLabel(shipment_id)

        const mediaDoc = await payload.create({
          collection: 'media',
          data: { alt: `Etykieta ${tracking_number}` },
          file: {
            data: labelPdfBuffer,
            mimetype: 'application/pdf',
            name: `etykieta-${tracking_number}.pdf`,
            size: labelPdfBuffer.length,
          },
        })

        await payload.update({
          collection: 'shipments',
          data: {
            status: 'confirmed',
            trackingNumber: tracking_number,
            label: mediaDoc.id,
          },
          where: {
            providerShipmentId: {
              equals: shipment_id,
            },
          },
        })

        return Response.json({}, { status: 200 })
      case 'shipment_status_changed':
        console.log(body)
        break
    }

    return Response.json({ ok: true })
  },
}
