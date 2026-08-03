'use client'

import { AddToCart } from '@/components/Cart/AddToCart'
import { Price } from '@/components/Price'
import { RichText } from '@/components/RichText'
import { StockIndicator } from '@/components/product/StockIndicator'
import { useProduct } from '@/providers/ProductProvider'
import { PopulatedProduct } from '@/utilities/normalizeProduct'
import { Suspense } from 'react'
import { VariantSelector } from './VariantSelector'

export function ProductDescription({ product }: { product: PopulatedProduct }) {
  const { selectedVariant, amount } = useProduct()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-4xl text-primary font-bold">{product.title}</h1>
      </div>
      {product.description ? (
        <RichText className="" data={product.description} enableGutter={false} />
      ) : null}
      {product.variants.length && (
        <Suspense fallback={null}>
          <VariantSelector product={product} />
        </Suspense>
      )}
      <Price amount={amount} />
      <div className="flex items-center justify-between">
        <Suspense fallback={null}>
          <StockIndicator product={product} />
        </Suspense>
      </div>

      <div className="flex items-center justify-between">
        <Suspense fallback={null}>
          <AddToCart product={product} />
        </Suspense>
      </div>
    </div>
  )
}
