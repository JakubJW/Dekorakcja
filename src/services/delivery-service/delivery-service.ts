import { env } from '@/env'
import { InPostHttpClient } from '@/lib/inpost/inpost-http-client'

type CreateShipmentDTO = {
  receiver: {
    company_name?: string
    first_name: string
    last_name: string
    email: string
    phone: string
  }
}

export function getDeliveryService() {
  const httpClient = new InPostHttpClient()

  return new DeliveryService(httpClient)
}

export class DeliveryService {
  private readonly orgId: string

  constructor(private inPostClient: InPostHttpClient) {
    const { INPOST_APIX_ORG_ID } = env

    if (!INPOST_APIX_ORG_ID) throw new Error('Missing shipX organization id')

    this.orgId = INPOST_APIX_ORG_ID
  }

  async createShipment(dto: CreateShipmentDTO) {
    const response = await this.inPostClient.request(`/organizations/${this.orgId}/shipments`, {
      method: 'POST',
      body: JSON.stringify(dto),
    })

    return response
  }

  async getShipmentLabel(id: number): Promise<Buffer> {
    const response: Buffer = await this.inPostClient.request(
      `/shipments/${id}/label?format=Pdf&type=A6`,
      {
        method: 'GET',
        responseType: 'buffer',
      },
    )

    return response
  }
}
