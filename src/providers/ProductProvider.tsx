'use client'

import { PopulatedProduct, PopulatedVariant } from '@/utilities/normalizeProduct'
import { useSearchParams } from 'next/navigation'
import { createContext, useContext, useMemo } from 'react'

type ProductContext = {
  product: PopulatedProduct
  selectedVariant?: PopulatedVariant
  selectedOptions?: Record<string, string>
  amount: number
}

const Context = createContext({} as ProductContext)

export const ProductProvider = ({
  children,
  product,
}: {
  children: React.ReactNode
  product: PopulatedProduct
}) => {
  const searchParams = useSearchParams()

  const selectedOptions = useMemo(() => {
    return Object.fromEntries(
      product.variantTypes
        .map((type) => [type.name, searchParams.get(type.name)] as const)
        .filter((entry): entry is [string, string] => entry[1] !== null),
    )
  }, [searchParams, product.variantTypes])

  const selectedVariant = useMemo(() => {
    const optionsArray = Object.values(selectedOptions)

    return product.variants.find((variant) =>
      variant.options.every((variantOption) => optionsArray.includes(String(variantOption.id))),
    )
  }, [selectedOptions, product.variants])

  const amount = useMemo(() => {
    const hasVariants = product.enableVariants && product.variants.length

    if (!selectedVariant || !hasVariants) {
      return product.priceInUSD || 0
    }

    return selectedVariant.priceInUSD || 0
  }, [selectedVariant, product])

  return (
    <Context.Provider value={{ selectedVariant, selectedOptions, product, amount }}>
      {children}
    </Context.Provider>
  )
}

type UseProduct = () => ProductContext // eslint-disable-line no-unused-vars

export const useProduct: UseProduct = () => useContext(Context)
