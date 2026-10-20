import { InsertHttpClient } from '@/lib/insert/insert-http-client'
import { InsertTokenManager } from '@/lib/insert/insert-token-manager'
import { PayloadTokenStorage } from '@/lib/insert/payload-token-storage'
import { Subiekt123Client } from '@/lib/insert/subiekt123-client'
import config from '@payload-config'
import { getPayload, Payload } from 'payload'

export async function getInvoiceService() {
  const payload = await getPayload({ config })

  const tokenStorage = new PayloadTokenStorage(payload)
  const tokenManager = new InsertTokenManager(tokenStorage)
  const httpClient = new InsertHttpClient(tokenManager)
  const subiektClient = new Subiekt123Client(httpClient)

  return new InvoiceService(payload, subiektClient)
}

export class InvoiceService {
  constructor(
    private payload: Payload,
    private subiektClient: Subiekt123Client,
  ) {}

  async issueInvoiceForOrder(orderId: string) {
    const order = await this.payload.findByID({
      collection: 'orders',
      id: orderId,
    })

    if (!order) {
      throw new Error(`Zamówienie o ID ${orderId} nie istnieje`)
    }

    const insertPayload = {
      issueDate: new Date().toISOString().split('T')[0],
      contractor: {
        name: order.customerName,
        taxId: order.customerNip,
      },
      positions: order.items.map((item: any) => ({
        name: item.productName,
        quantity: item.qty,
        priceNetto: item.price,
        vatRate: '23',
      })),
    }

    // 3. Wystawiasz fakturę w InsERT
    const invoiceResponse = await this.subiektClient.createInvoice(insertPayload)

    // 4. Zapisujesz dane faktury powrotnie w Payloadzie
    await this.payload.update({
      collection: 'orders',
      id: orderId,
      data: {
        invoiceNumber: invoiceResponse.number,
        invoiceId: invoiceResponse.id,
        invoiceStatus: 'issued',
      },
    })

    return invoiceResponse
  }
}
