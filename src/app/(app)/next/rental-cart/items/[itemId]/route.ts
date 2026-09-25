import config from '@payload-config'
import { headers } from 'next/headers'
import { getPayload } from 'payload'

export async function DELETE(req: Request, { params }: { params: Promise<{ itemId: string }> }) {
  const payload = await getPayload({ config })
  const { itemId } = await params
  const { user } = await payload.auth({ headers: await headers() })
  const { cartID, secret } = (await req.json()) as { cartID: string; secret?: string }

  const cart = await payload.findByID({ collection: 'rent-carts', id: cartID, depth: 1 })

  if (!cart.customer && !cart.secret) {
    return Response.json({ message: 'Błąd serwera' }, { status: 500 })
  }

  const customerId = typeof cart.customer === 'object' ? cart.customer?.id : cart.customer
  const isOwner = user ? customerId === user.id : cart.secret === secret

  if (!isOwner) {
    return Response.json({ error: 'Brak dostępu' }, { status: 403 })
  }

  const updatedItems = (cart.items ?? []).filter((item: any) => item.id !== itemId)

  const updatedCart = await payload.update({
    collection: 'rent-carts',
    id: cartID,
    data: { items: updatedItems },
  })

  return Response.json({ cart: updatedCart })
}
