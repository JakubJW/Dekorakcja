import config from '@payload-config'
import crypto from 'crypto'
import { headers } from 'next/headers'
import { getPayload } from 'payload'

export async function POST(req: Request) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  const body = (await req.json()) as {
    cartID?: string
    secret?: string
    productID: string
    quantity?: number
  }

  let cart

  if (body.cartID) {
    cart = await payload.findByID({ collection: 'rent-carts', id: body.cartID, depth: 0 })

    const isOwner = user ? cart.customer === user.id : cart.secret === body.secret
    if (!isOwner) {
      return Response.json({ error: 'Brak dostępu do tego koszyka' }, { status: 403 })
    }
  } else {
    const secret = user ? null : crypto.randomBytes(20).toString('hex')
    cart = await payload.create({
      collection: 'rent-carts',
      data: {
        customer: user?.id ?? null,
        secret,
        items: [],
      },
    })
  }

  const existingItems = cart.items ?? []
  const existingIndex = existingItems.findIndex((i: any) => i.rentable === body.productID)

  const updatedItems =
    existingIndex >= 0
      ? existingItems.map((item: any, idx: number) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + (body.quantity ?? 1) }
            : item,
        )
      : [...existingItems, { rentable: body.productID, quantity: body.quantity ?? 1 }]

  const updatedCart = await payload.update({
    collection: 'rent-carts',
    id: cart.id,
    data: { items: updatedItems },
  })

  return Response.json({
    cart: updatedCart,
    secret: cart.secret,
  })
}
