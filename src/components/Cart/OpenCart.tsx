import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'

export function OpenCartButton({
  className,
  quantity,
  ...rest
}: {
  className?: string
  quantity?: number
}) {
  return (
    <Button variant="ghost" size="icon" className="relative" {...rest}>
      <ShoppingCart className="size-5" />
      {quantity && (
        <span className="rounded-full size-4 absolute top-0 -right-2 bg-black text-white">
          {quantity}
        </span>
      )}
    </Button>
  )
}
