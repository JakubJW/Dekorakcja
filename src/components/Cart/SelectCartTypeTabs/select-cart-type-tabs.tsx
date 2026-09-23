import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ShopCartTab } from './shop-cart-tab'

export const SelectCartTypeTabs = () => {
  return (
    <Tabs defaultValue="shop">
      <TabsList className="w-full">
        <TabsTrigger value="shop" className="flex-1">
          Sklep
        </TabsTrigger>
        <TabsTrigger value="rent" className="flex-1">
          Wypoyzczalnia
        </TabsTrigger>
      </TabsList>
      <TabsContent value="shop">
        <ShopCartTab />
      </TabsContent>
      <TabsContent value="rent"></TabsContent>
    </Tabs>
  )
}
