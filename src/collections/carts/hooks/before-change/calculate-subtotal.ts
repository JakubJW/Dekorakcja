import { CollectionBeforeChangeHook, PayloadRequest } from 'payload'

export const calculateSubtotal: CollectionBeforeChangeHook = async ({
  data,
  req,
}: {
  data: Partial<any>
  req: PayloadRequest
}) => {
  if (!data.items || !Array.isArray(data.items)) {
    data.subtotal = 0
    return
  }

  const priceField = `priceIn${data.currency}`
  let subtotal = 0

  for (const item of data.items) {
    if (item.variant) {
      const id = typeof item.variant === 'object' ? item.variant.id : item.variant
      const variant = await req.payload.findByID({
        id,
        collection: 'variants',
        depth: 0,
        select: {
          [priceField]: true,
        },
      })
      //@ts-ignore
      subtotal += variant[priceField] * item.quantity
    } else {
      const id = typeof item.product === 'object' ? item.product.id : item.product
      const product = await req.payload.findByID({
        id,
        collection: 'products',
        depth: 0,
        select: {
          [priceField]: true,
        },
      })
      //@ts-ignore
      subtotal += product[priceField] * item.quantity
    }
  }

  data.subtotal = subtotal
}
