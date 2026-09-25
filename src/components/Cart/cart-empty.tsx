import { ShoppingCart } from 'lucide-react'

export const CartEmpty = () => {
  return (
    <div className="text-center flex flex-col items-center gap-2">
      <ShoppingCart className="size-4" />
      <p className="text-center text-lg font-bold">Twój koszyk jest pusty</p>
    </div>
  )
}
