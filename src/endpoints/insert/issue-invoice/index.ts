import { InsertHttpClient } from '@/lib/insert/insert-http-client'
import { InsertTokenManager } from '@/lib/insert/insert-token-manager'
import { PayloadTokenStorage } from '@/lib/insert/payload-token-storage'
import { Subiekt123Client } from '@/lib/insert/subiekt123-client'
import { Endpoint } from 'payload'

export const generateInvoiceEndpoint: Endpoint = {
  path: '/actions/issue-invoice',
  method: 'post',
  handler: async (req) => {
    if (!req.user) return Response.json({ message: 'Unauthorized' }, { status: 401 })

    const { orderId } = (await req.json?.()) || {}
    if (!orderId) return Response.json({ message: 'Brak orderId' }, { status: 400 })

    try {
      const tokenStorage = new PayloadTokenStorage(req.payload)
      const tokenManager = new InsertTokenManager(tokenStorage)
      const http = new InsertHttpClient(tokenManager)
      const client = new Subiekt123Client(http)

      const res = await client.getCustomers()
      // 1. Tutaj odpala się Twoja logika integracji z Subiektem123.
      // 2. Tworzysz lub aktualizujesz rekord w kolekcji 'invoices'.
      // 3. Jeśli się udało, zwracasz 200. Jeśli nie, rzucasz błąd.

      // Przykład (do podmienienia na prawdziwą logikę):
      // await createInvoiceForOrder(orderId, req.payload)

      return Response.json({ success: true })
    } catch (error: any) {
      // Zapisujesz błąd do bazy w kolekcji 'invoices' (status: 'failed', lastError: error.message)
      return Response.json({ message: error.message }, { status: 500 })
    }
  },
}
