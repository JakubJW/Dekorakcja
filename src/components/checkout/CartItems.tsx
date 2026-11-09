import { ShippingMethod } from '@/payload-types'
import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import { Media } from '../Media'
import { Price } from '../Price'

type CartItemsProps = {
  shippingMethod?: Partial<ShippingMethod>
}

export const CartItems = ({ shippingMethod }: CartItemsProps) => {
  const { cart } = useCart()

  return (
    <div className="basis-full lg:basis-1/3 lg:pl-8 p-8 bg-[#F8F2F0] rounded-r-xl">
      <div className="sticky top-8 space-y-8">
        <h2 className="text-2xl font-medium">Twoje zamówienie</h2>
        {cart?.items?.map((item, index) => {
          if (typeof item.product === 'object' && item.product) {
            const {
              product,
              product: { id, meta, title, gallery },
              quantity,
              variant,
            } = item
            if (!quantity) return null
            let image = gallery?.[0]?.image || meta?.image
            let price = product?.priceInPLN
            const isVariant = Boolean(variant) && typeof variant === 'object'
            if (isVariant) {
              price = variant?.priceInPLN
              const imageVariant = product.gallery?.find((item: any) => {
                if (!item.variantOption) return false
                const variantOptionID =
                  typeof item.variantOption === 'object'
                    ? item.variantOption.id
                    : item.variantOption
                const hasMatch = variant?.options?.some((option: any) => {
                  if (typeof option === 'object') return option.id === variantOptionID
                  else return option === variantOptionID
                })
                return hasMatch
              })
              if (imageVariant && typeof imageVariant.image !== 'string') {
                image = imageVariant.image
              }
            }
            return (
              <div className="flex items-start gap-4" key={index}>
                <div className="flex items-stretch justify-stretch size-20 shrink-0 rounded-lg border">
                  <div className="relative w-full h-full">
                    {image && typeof image !== 'string' && (
                      <Media className="" fill imgClassName="rounded-lg" resource={image} />
                    )}
                  </div>
                </div>
                <div className="flex grow justify-between gap-10 items-start">
                  <div className="flex flex-col gap-1">
                    <p className="font-medium text-sm">{title}</p>
                    {variant && typeof variant === 'object' && (
                      <p className="text-xs text-primary/50 tracking-widest">
                        {variant.options
                          ?.map((option: any) => {
                            if (typeof option === 'object') return option.label
                            return null
                          })
                          .join(', ')}
                      </p>
                    )}
                    <div>
                      {'x'}
                      {quantity}
                    </div>
                  </div>
                  {typeof price === 'number' && <Price amount={price} />}
                </div>
              </div>
            )
          }
          return null
        })}
        <hr />
        <div>
          {shippingMethod && (
            <div className="flex justify-between items-center gap-2">
              <span>Dostawa</span>
              <Price amount={shippingMethod.price || 0} />
            </div>
          )}
          <div className="flex justify-between items-center gap-2">
            <span>Suma częściowa</span> <Price amount={cart.subtotal || 0} />
          </div>
          <hr className="my-4" />
          <div className="flex justify-between items-center gap-2">
            <span className="uppercase">Suma</span>{' '}
            <Price
              className="text-3xl font-medium"
              amount={(cart.subtotal || 0) + (shippingMethod?.price || 0)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
