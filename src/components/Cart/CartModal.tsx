'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useRentalCart } from '@/providers/RentalCartProvider'
import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { OpenCartButton } from './OpenCart'
import { SelectCartTypeTabs } from './SelectCartTypeTabs/select-cart-type-tabs'

export function CartModal() {
  const { cart } = useCart()
  const { rentalCart } = useRentalCart()
  const [isOpen, setIsOpen] = useState(false)

  const pathname = usePathname()

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const cartQuantity = useMemo(
    () => cart?.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) ?? 0,
    [cart],
  )
  const rentalQuantity = useMemo(() => rentalCart?.items?.length ?? 0, [rentalCart])

  const totalQuantity = useMemo(() => {
    const total = cartQuantity + rentalQuantity
    return total > 0 ? total : undefined
  }, [cartQuantity, rentalCart])

  return (
    <Sheet onOpenChange={setIsOpen} open={isOpen}>
      <SheetTrigger asChild>
        <OpenCartButton quantity={totalQuantity} />
      </SheetTrigger>

      <SheetContent className="flex flex-col px-4">
        <SheetHeader className="px-0">
          <SheetTitle className="font-sans">Koszyk</SheetTitle>
        </SheetHeader>

        <SelectCartTypeTabs cartQuantity={cartQuantity} rentalCartQuantity={rentalQuantity} />
      </SheetContent>
    </Sheet>
  )
}
