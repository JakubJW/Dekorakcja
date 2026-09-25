import { Button } from '@/components/ui/button'
import { useRentalCart } from '@/providers/RentalCartProvider'
import { normalizeRentalCartItems } from '@/utilities/normalize-rental-cart'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { CartEmpty } from '../cart-empty'
import { DeleteItemButton } from '../DeleteItemButton'

export const RentalCartTab = () => {
  const { rentalCart, removeItem } = useRentalCart()

  const removeItemHanler = async (id: string) => {
    await removeItem(id)
  }

  return (
    <>
      {!rentalCart || !rentalCart.items ? (
        <CartEmpty />
      ) : (
        <div className="grow flex">
          <div className="flex flex-col justify-between w-full">
            <ul className="grow overflow-auto py-4">
              {normalizeRentalCartItems(rentalCart.items).map((item, i) => {
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
                        </div>
                      </Link>
                    </div>
                  </li>
                )
              })}
            </ul>

            <div className="py-4 text-sm text-neutral-500">
              <Button asChild>
                <Link className="w-full" href="/checkout">
                  Złóz zapytanie
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
