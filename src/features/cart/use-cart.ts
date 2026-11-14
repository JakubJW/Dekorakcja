import { Locker } from '@/components/checkout/steps/shipping'
import { apiClient } from '@/lib/api/rest-api-client'
import { ShippingMethod } from '@/payload-types'
import { useLocalStorageValue } from '@/utilities/useLocalStorage'
import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import { useCallback, useEffect, useMemo, useState } from 'react'

type Cart = NonNullable<ReturnType<typeof useCart>['cart']>

export const useCustomCart = () => {
  const cartApi = useCart()
  const [cartOverride, setCart] = useState<Cart | null>(null)
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod | undefined>()
  const [lockerData, setLockerData] = useState<Locker | undefined>(undefined)
  const secret = useLocalStorageValue('cart_secret')

  useEffect(() => {
    setCart(null)
  }, [cartApi.cart])

  const cart = useMemo(() => cartOverride ?? cartApi.cart ?? null, [cartOverride, cartApi.cart])

  const cartQuery = useMemo(() => (secret ? `?secret=${secret}` : ''), [secret])

  const updateShipping = useCallback(
    async ({ methodId, lockerData }: { methodId?: number; lockerData?: Locker }) => {
      const res = await apiClient.PUT(
        `/actions/carts/${cart.id}/update-shipping-method${cartQuery}`,
        { methodId, lockerData },
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

  return {
    ...cartApi,
    cart,
    refreshCart,
    updateShipping,
    shippingMethod,
    setShippingMethod,
    lockerData,
    setLockerData,
  }
}
