import { InPostHttpClient } from '@/lib/inpost/inpost-http-client'
import { Order } from '@/payload-types'

export async function getDeliveryService() {
  const httpClient = new InPostHttpClient()

  return new InvoiceService(httpClient)
}

export class InvoiceService {
  constructor(private inPostClient: InPostHttpClient) {}

  async createShipment(order: Order) {
    const shipmentPayload = {
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
        company_name: order.billingAddress.companyName,
        first_name: order.shippingAddress.firstName,
        last_name: order.shippingAddress.lastName,
        email: 'brakujeMaila@gmail.com',
        phone: order.shippingAddress.phone,
      },
      parcels: {
        template: 'small',
      },
      insurance: {
        amount: 25,
        currency: 'PLN',
      },
      cod: {
        amount: 12.5,
        currency: 'PLN',
      },
      custom_attributes: {
        sending_method: 'dispatch_order',
        target_point: 'WAW478M',
      },
      service: 'inpost_locker_standard',
      reference: 'Test',
      external_customer_id: '8877xxx',
    }

    const invoiceResponse = await this.inPostClient.request('/shipments', {
      method: 'POST',
      body: JSON.stringify(shipmentPayload),
    })

    return invoiceResponse
  }
}
