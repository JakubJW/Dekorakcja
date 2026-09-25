'use client'

import { Price } from '@/components/Price'
import { RichText } from '@/components/RichText'
import { StockIndicator } from '@/components/product/StockIndicator'
import { useProduct } from '@/providers/ProductProvider'
import { useRentalCart } from '@/providers/RentalCartProvider'
import { PopulatedProduct } from '@/utilities/normalizeProduct'
import { Suspense } from 'react'
import { toast } from 'sonner'
import { Button } from '../ui/button'

export function RentableProductDescription({ product }: { product: PopulatedProduct }) {
  const { selectedVariant, amount } = useProduct()
  const { addItem } = useRentalCart()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-4xl text-primary font-bold">{product.title}</h1>
      </div>
      {product.description ? (
        <RichText className="" data={product.description} enableGutter={false} />
      ) : null}
      <Price amount={amount} />
      <div className="flex items-center justify-between">
        <Suspense fallback={null}>
          <StockIndicator product={product} />
        </Suspense>
      </div>

      <div className="flex items-center justify-between">
        <Suspense fallback={null}>
          <Button
            onClick={() => {
              addItem(product.id)
              toast('Dodano do zapytania')
            }}
          >
            Dodaj
          </Button>
        </Suspense>
      </div>
    </div>
  )
}
