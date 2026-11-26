'use client'

import { Locker } from '@/components/checkout/steps/shipping'
import { apiClient } from '@/lib/api/rest-api-client'
import { ShippingMethod } from '@/payload-types'
import { useLocalStorageValue } from '@/utilities/useLocalStorage'
import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

type Cart = NonNullable<ReturnType<typeof useCart>['cart']>

export type ExtendedCartItem = {
  product: string | number
  variant?: string | number
  customization?: string | number
  customizationValue?: string
}

type CustomCartContextValue = Omit<Cart, 'cart' | 'refreshCart'> & {
  cart: Cart
  refreshCart: () => Promise<void>
  updateShipping: ({
    methodSlug,
    lockerData,
  }: {
    methodSlug?: string
    lockerData?: Locker
  }) => Promise<void>
}

const CustomCartContext = createContext<CustomCartContextValue | null>(null)

export const CustomCartProvider = ({ children }: { children: React.ReactNode }) => {
  const cartApi = useCart()
  const [cartOverride, setCart] = useState<Cart | null>(null)
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod | undefined>()
  const [lockerData, setLockerData] = useState<Locker | undefined>(undefined)
  const secret = useLocalStorageValue('cart_secret')

  useEffect(() => {
    setCart(null)
  }, [cartApi.cart])

  const cart = useMemo(() => cartOverride ?? cartApi.cart ?? null, [cartOverride, cartApi.cart])

  const addItem = cartApi.addItem as (item: ExtendedCartItem, quantity?: number) => Promise<void>

  const cartQuery = useMemo(() => (secret ? `?secret=${secret}` : ''), [secret])

  const updateShipping = useCallback(
    async ({ methodSlug, lockerData }: { methodSlug?: string; lockerData?: Locker }) => {
      const res = await apiClient.PATCH<void>(
        `/actions/carts/${cart.id}/update-shipping-method${cartQuery}`,
        { methodSlug, lockerData },
      )

      return res
    },
    [cart, cartQuery],
  )

  const refreshCart = useCallback(async () => {
    try {
      const res: Cart = await apiClient.GET(`/carts/${cart.id}${cartQuery}`)

      setCart(res)
    } catch {}
  }, [cart, cartQuery])

  const { cart: _c, refreshCart: _r, ...rest } = cartApi

  const value = useMemo<CustomCartContextValue>(
    () => ({
      ...rest,
      cart,
      refreshCart,
      updateShipping,
    }),
    [rest, cart, refreshCart, updateShipping, cartApi.isLoading],
  )

  return <CustomCartContext.Provider value={value}>{children}</CustomCartContext.Provider>
}

export const useCustomCart = () => {
  const ctx = useContext(CustomCartContext)
  if (!ctx) throw new Error('useCustomCart must be used within CustomCartProvider')
  return ctx
}
