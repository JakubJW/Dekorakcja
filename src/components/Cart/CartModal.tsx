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
  const { items } = useRentalCart()
  const [isOpen, setIsOpen] = useState(false)

  const pathname = usePathname()

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const totalQuantity = useMemo(() => {
    if (!cart || !cart.items || !cart.items.length) return undefined
    return cart.items.reduce((quantity, item) => (item.quantity || 0) + quantity + items, 0)
  }, [cart, items])

  return (
    <Sheet onOpenChange={setIsOpen} open={isOpen}>
      <SheetTrigger asChild>
        <OpenCartButton quantity={totalQuantity} />
      </SheetTrigger>

      <SheetContent className="flex flex-col px-4">
        <SheetHeader className="px-0">
          <SheetTitle className="font-sans">Koszyk</SheetTitle>
        </SheetHeader>

        <SelectCartTypeTabs />
      </SheetContent>
    </Sheet>
  )
}
