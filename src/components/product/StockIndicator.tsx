'use client'
import { useProduct } from '@/providers/ProductProvider'
import { PopulatedProduct } from '@/utilities/normalizeProduct'
import { useMemo } from 'react'

type Props = {
  product: PopulatedProduct
}

export const StockIndicator: React.FC<Props> = ({ product }) => {
  const { selectedVariant } = useProduct()

  const stockQuantity = useMemo(() => {
    if (!product.enableVariants) {
      return product.inventory || 0
    }

    return selectedVariant?.inventory || 0
  }, [product.enableVariants, selectedVariant, product.inventory])

  if (product.enableVariants && !selectedVariant) {
    return null
  }

  return (
    <div className="uppercase text-sm font-medium text-gray-500">
      {stockQuantity < 10 && stockQuantity > 0 && <p>Pozostało {stockQuantity} sztuk</p>}
      {(stockQuantity === 0 || !stockQuantity) && <p>Niedostępny</p>}
    </div>
  )
}
