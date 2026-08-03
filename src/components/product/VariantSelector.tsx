'use client'

import { PopulatedProduct } from '@/utilities/normalizeProduct'
import { VariantTypeOption } from './VariantTypeOption'

export function VariantSelector({ product }: { product: PopulatedProduct }) {
  const variants = product.variants
  const variantTypes = product.variantTypes
  const hasVariants = Boolean(product.enableVariants && variants.length && variantTypes.length)

  if (!hasVariants) {
    return null
  }

  return variantTypes.map((variant) => (
    <dl key={variant.id}>
      <dt className="mb-4 text-sm">{variant.label}</dt>
      <dd className="flex flex-wrap gap-3">
        {variant.options.map((option) => (
          <VariantTypeOption option={option} key={option.id} variantTypeName={variant.name} />
        ))}
      </dd>
    </dl>
  ))
}
