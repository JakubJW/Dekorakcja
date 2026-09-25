import config from '@payload-config'
import { getPayload } from 'payload'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const cartID = searchParams.get('cartID')
  const secret = searchParams.get('secret')

  if (!cartID || !secret) {
    return Response.json({ cart: null })
  }

  const payload = await getPayload({ config })
  const cart = await payload.findByID({ collection: 'rent-carts', id: cartID, depth: 1 })

  if (cart.secret !== secret) {
    return Response.json({ error: 'Brak dostępu' }, { status: 403 })
  }

  return Response.json({ cart })
}
