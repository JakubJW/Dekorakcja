import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RentalCartTab } from './rental-cart-tab'
import { ShopCartTab } from './shop-cart-tab'

type Props = {
  rentalCartQuantity: number
  cartQuantity: number
}

export const SelectCartTypeTabs = ({ rentalCartQuantity, cartQuantity }: Props) => {
  return (
    <Tabs defaultValue="shop">
      <TabsList className="w-full">
        <TabsTrigger value="shop" className="flex-1">
          Sklep {cartQuantity > 0 && <>({cartQuantity})</>}
        </TabsTrigger>
        <TabsTrigger value="rent" className="flex-1">
          Wypożyczalnia {rentalCartQuantity > 0 && <>({rentalCartQuantity})</>}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="shop">
        <ShopCartTab />
      </TabsContent>
      <TabsContent value="rent">
        <RentalCartTab />
      </TabsContent>
    </Tabs>
  )
}
