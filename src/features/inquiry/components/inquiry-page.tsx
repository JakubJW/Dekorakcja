'use client'

import { Media } from '@/components/Media'
import { useRentalCart } from '@/providers/RentalCartProvider'
import { normalizeRentalCartItems } from '@/utilities/normalize-rental-cart'
import Link from 'next/link'
import { InquiryForm } from './inquiry-form'

export const InquiryPage = () => {
  const { rentalCart } = useRentalCart()

  if (!rentalCart?.items) {
    return (
      <div className="prose py-12 w-full items-center">
        <p>Twój koszyk jest pusty.</p>
        <Link href="/search">Kontynuuj zakupy</Link>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col mb-16">
      <div className="border rounded-xfl flex flex-col md:flex-row grow items-stretch justify-stretch">
        <div className="basis-full lg:basis-2/3 p-8">
          <InquiryForm
            rentalCartId={rentalCart.id}
            customerId={
              typeof rentalCart?.customer === 'object' ? rentalCart.customer?.id : undefined
            }
          />
        </div>
        <div className="basis-full lg:basis-1/3 lg:pl-8 p-8 bg-[#F8F2F0] flex flex-col gap-8">
          <h2 className="text-2xl font-medium">Wybrane przedmioty</h2>
          {normalizeRentalCartItems(rentalCart.items).map((item, index) => (
            <div className="flex items-start gap-4" key={index}>
              <div className="flex items-stretch justify-stretch h-20 w-20 p-2 rounded-lg border">
                <div className="relative w-full h-full">
                  {item.image && (
                    <Media className="" fill imgClassName="rounded-lg" resource={item.image} />
                  )}
                </div>
              </div>
              <div className="flex grow justify-between items-center">
                <div className="flex flex-col gap-1">
                  <p className="font-medium text-lg">{item.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
