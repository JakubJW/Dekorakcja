import { Price } from '@/components/Price'
import { Button } from '@/components/ui/button'
import { normalizeCartItems } from '@/utilities/normalize-cart'
import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import Link from 'next/link'
import React from 'react'
import { CartEmpty } from '../cart-empty'
import { CartItemImage } from '../cart-item/cart-item-image'
import { DeleteItemButton } from '../DeleteItemButton'
import { EditItemQuantityButton } from '../EditItemQuantityButton'

export const ShopCartTab = () => {
  const { cart, removeItem } = useCart()

  if (!cart || !cart.items) return <CartEmpty />

  return (
    <div className="flex flex-col h-full justify-between w-full">
      <ul className="grow overflow-auto py-4">
        {normalizeCartItems(cart.items).map((item, i) => {
          if (!item || !item.slug) return <React.Fragment key={i} />

          return (
            <li className="flex w-full flex-col" key={i}>
              <div className="relative flex w-full flex-row justify-between py-4">
                <Link className="z-30 flex flex-row space-x-4" href={`/produkty/${item.slug}`}>
                  <CartItemImage image={item.image}>
                    <DeleteItemButton
                      removeItemHandler={async () => {
                        if (item.id) await removeItem(item.id)
                      }}
                    />
                  </CartItemImage>
                  <div className="flex flex-1 flex-col justify-between text-base">
                    <span className="leading-snug font-medium">{item.title}</span>
                    {item.isVariant && (
                      <p className="text-xs text-neutral-500 tracking-widest">
                        {item.variantOptions?.join(', ')}
                      </p>
                    )}
                  </div>
                </Link>
                <div className="flex h-16 flex-col justify-between">
                  {item.price && (
                    <Price
                      amount={item.price}
                      className="flex justify-end space-y-2 text-right text-sm"
                    />
                  )}
                  <div className="ml-auto flex h-9 flex-row items-center rounded-lg border">
                    <EditItemQuantityButton item={item} type="minus" />
                    <p className="w-6 text-center">
                      <span className="w-full text-sm">{item.quantity}</span>
                    </p>
                    <EditItemQuantityButton item={item} type="plus" />
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>

      <div className="py-4 text-sm text-neutral-500">
        {cart.subtotal && (
          <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1">
            <p>Suma</p>
            <Price amount={cart.subtotal} className="text-right text-base text-black" />
          </div>
        )}

        <Button asChild>
          <Link className="w-full" href="/checkout">
            Złóż zamówienie
          </Link>
        </Button>
      </div>
    </div>
  )
}
