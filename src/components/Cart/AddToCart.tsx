'use client'

import { Button } from '@/components/ui/button'
import { useProduct } from '@/providers/ProductProvider'
import { PopulatedProduct } from '@/utilities/normalizeProduct'
import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import React, { useCallback, useMemo } from 'react'
import { toast } from 'sonner'

type Props = {
  product: PopulatedProduct
}

export function AddToCart({ product }: Props) {
  const { addItem, cart, isLoading } = useCart()
  const { selectedVariant } = useProduct()

  const addToCart = useCallback(
    (e: React.FormEvent<HTMLButtonElement>) => {
      e.preventDefault()

      addItem({
        product: product.id,
        variant: selectedVariant?.id ?? undefined,
      }).then(() => {
        toast.success('Produkt dodany do koszyka')
      })
    },
    [addItem, product, selectedVariant],
  )

  const disabled = useMemo<boolean>(() => {
    const existingItem = cart?.items?.find((item) => {
      const productID = typeof item.product === 'object' ? item.product?.id : item.product
      const variantID = item.variant
        ? typeof item.variant === 'object'
          ? item.variant?.id
          : item.variant
        : undefined

      if (productID === product.id) {
        if (product.enableVariants) {
          return variantID === selectedVariant?.id
        }
        return true
      }
    })

    if (existingItem) {
      const existingQuantity = existingItem.quantity

      if (product.enableVariants) {
        return existingQuantity >= (selectedVariant?.inventory || 0)
      }
      return existingQuantity >= (product.inventory || 0)
    }

    if (product.enableVariants) {
      if (!selectedVariant) {
        return true
      }

      if (selectedVariant.inventory === 0) {
        return true
      }
    } else {
      if (product.inventory === 0) {
        return true
      }
    }

    return false
  }, [selectedVariant, cart?.items, product])

  return (
    <Button
      aria-label="Dodaj do koszyka"
      variant={'outline'}
      disabled={disabled || isLoading}
      onClick={addToCart}
      type="submit"
    >
      Dodaj do koszyka
    </Button>
  )
}
