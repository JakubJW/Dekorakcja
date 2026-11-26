import { DeliveryService } from '@/services/delivery-service/delivery-service'
import { Payload, PayloadRequest } from 'payload'

export async function createShipmentForOrder(
  orderId: number,
  deliveryService: DeliveryService,
  payload: Payload,
  req: PayloadRequest,
) {
  const order = await payload.findByID({
    req,
    collection: 'orders',
    id: orderId,
    select: {
      transactions: true,
      billingAddress: true,
      updatedAt: true,
      createdAt: true,
      amount: true,
      items: true,
      shippingAddress: true,
      shippingMethod: true,
    },
    populate: {
      products: {},
      variants: {},
      transactions: {
        status: true,
      },
    },
  })

  if (!order.shippingAddress) throw new Error('Brak adresu dostawy.')
  if (!order.items || order.items.length === 0) throw new Error('Zamówienie nie ma produktów.')
  if (
    order.transactions?.every((transaction) =>
      typeof transaction === 'object' ? transaction.status !== 'succeeded' : false,
    )
  )
    throw new Error('Zamówienie nie jest opłacone.')

  const dto = {
    sender: {
      company_name: 'Dywany Agrabah sp. z o. o.',
      first_name: 'Jakub',
      last_name: 'Wysocki',
      email: 'jakubwysocki2001@gmail.com',
      phone: '575045688',
      address: {
        street: 'Antoniukowska 3A',
        building_number: '3',
        city: 'Białystok',
        post_code: '12-345',
        country_code: 'PL',
      },
    },
    receiver: {
      company_name: order.shippingAddress.companyName,
      first_name: order.shippingAddress.firstName,
      last_name: order.shippingAddress.lastName,
      email: order.shippingAddress.email,
      phone: order.shippingAddress.phone,
    },
    parcels: {
      template: 'small',
    },
    insurance: {
      amount: 25,
      currency: 'PLN',
    },
    custom_attributes: {
      sending_method: 'parcel_locker',
      target_point: 'WAW478M',
    },
    //pobierać z wybranej metody dostawy z ordera
    service: 'inpost_locker_standard',
    reference: 'Test',
    external_customer_id: '8877xxx',
  }

  const inPostResult = await deliveryService.createShipment(dto)

  await payload.create({
    collection: 'shipments',
    data: {
      status: inPostResult.status,
      trackingNumber: inPostResult.tracking_number,
      providerShipmentId: inPostResult.id,
      provider: 'inpost',
      order: order.id,
    },
  })

  return inPostResult
}
