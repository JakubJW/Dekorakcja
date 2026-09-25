import { Price } from '@/components/Price'
import { Button } from '@/components/ui/button'
import { normalizeCartItems } from '@/utilities/normalize-cart'
import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { CartEmpty } from '../cart-empty'
import { DeleteItemButton } from '../DeleteItemButton'
import { EditItemQuantityButton } from '../EditItemQuantityButton'

export const ShopCartTab = () => {
  const { cart, removeItem } = useCart()

  return (
    <>
      {!cart || !cart.items ? (
        <CartEmpty />
      ) : (
        <div className="grow flex">
          <div className="flex flex-col justify-between w-full">
            <ul className="grow overflow-auto py-4">
              {normalizeCartItems(cart.items).map((item, i) => {
                if (!item || !item.slug) return <React.Fragment key={i} />

                return (
                  <li className="flex w-full flex-col" key={i}>
                    <div className="relative flex w-full flex-row justify-between py-4">
                      <div className="absolute z-40 -mt-2 ml-[55px]">
                        <DeleteItemButton
                          removeItemHandler={async () => {
                            if (item.id) await removeItem(item.id)
                          }}
                        />
                      </div>
                      <Link
                        className="z-30 flex flex-row space-x-4"
                        href={`/produkty/${item.slug}`}
                      >
                        <div className="relative h-16 w-16 cursor-pointer overflow-hidden rounded-md border border-neutral-300 bg-neutral-300">
                          {item.image?.url && (
                            <Image
                              alt={item.image?.alt || item.title}
                              className="h-full w-full object-cover"
                              height={94}
                              src={item.image?.url}
                              width={94}
                            />
                          )}
                        </div>

                        <div className="flex flex-1 flex-col text-base">
                          <span className="leading-tight">{item.title}</span>
                          {item.isVariant ? (
                            <p className="text-xs text-neutral-500 tracking-widest">
                              {item.variantOptions?.map((option: any) => option.label).join(', ')}
                            </p>
                          ) : null}
                        </div>
                      </Link>
                      <div className="flex h-16 flex-col justify-between">
                        {typeof item.price === 'number' && (
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

            <div>
              <div className="py-4 text-sm text-neutral-500">
                {typeof cart?.subtotal === 'number' && (
                  <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1">
                    <p>Suma</p>
                    <Price amount={cart?.subtotal} className="text-right text-base text-black" />
                  </div>
                )}

                <Button asChild>
                  <Link className="w-full" href="/checkout">
                    Złóz zamówienie
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
