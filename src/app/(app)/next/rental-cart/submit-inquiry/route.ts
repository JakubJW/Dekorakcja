import config from '@payload-config'
import { headers } from 'next/headers'
import { getPayload } from 'payload'

export async function POST(req: Request) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  const { cartID, secret, ...inquiryData } = await req.json()

  const cart = await payload.findByID({ collection: 'rent-carts', id: cartID, depth: 0 })
  const isOwner = user ? cart.customer === user.id : cart.secret === secret
  if (!isOwner) {
    return Response.json({ error: 'Brak dostępu' }, { status: 403 })
  }

  const updatedCart = await payload.update({
    collection: 'rent-carts',
    id: cartID,
    data: { submittedAt: new Date().toISOString(), ...inquiryData },
  })

  return Response.json({ cart: updatedCart })
}
