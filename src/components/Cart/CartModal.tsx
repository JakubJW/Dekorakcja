'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useRentalCart } from '@/providers/RentalCartProvider'
import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { OpenCartButton } from './OpenCart'
import { RentalCartTab } from './SelectCartTypeTabs/rental-cart-tab'
import { ShopCartTab } from './SelectCartTypeTabs/shop-cart-tab'

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

      <SheetContent className="px-4">
        <SheetHeader className="px-0">
          <SheetTitle className="font-sans text-[#665D53]">Koszyk</SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="shop" className="flex flex-col grow">
          <TabsList className="w-full">
            <TabsTrigger value="shop" className="flex-1">
              Sklep {cartQuantity > 0 && <>&#40;{cartQuantity}&#41;</>}
            </TabsTrigger>
            <TabsTrigger value="rent" className="flex-1">
              Wypożyczalnia {rentalQuantity > 0 && <>&#40;{rentalQuantity}&#41;</>}
            </TabsTrigger>
          </TabsList>
          <TabsContent className="grow" value="shop">
            <ShopCartTab />
          </TabsContent>
          <TabsContent className="grow" value="rent">
            <RentalCartTab />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
