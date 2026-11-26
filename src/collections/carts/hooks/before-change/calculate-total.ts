import { CollectionBeforeChangeHook, PayloadRequest } from 'payload'

export const calculateTotal: CollectionBeforeChangeHook = async ({
  data,
  req,
}: {
  data: Partial<any>
  req: PayloadRequest
}) => {
  if (!data.shippingMethod) {
    data.total = data.subtotal
    return
  }

  const id = typeof data.shippingMethod === 'object' ? data.shippingMethod.id : data.shippingMethod
  const shippingMethod = await req.payload.findByID({
    id,
    collection: 'shipping-methods',
    depth: 0,
    select: {
      price: true,
    },
  })
  //@ts-ignore
  data.total = data.subtotal += shippingMethod.price
}
