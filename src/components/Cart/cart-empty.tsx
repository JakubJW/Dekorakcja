import { ShoppingCart } from 'lucide-react'

export const CartEmpty = () => {
  return (
    <div className="text-center flex flex-col items-center gap-2">
      <ShoppingCart className="size-4" />
      <p className="text-center text-2xl font-bold">Your cart is empty.</p>
    </div>
  )
}
