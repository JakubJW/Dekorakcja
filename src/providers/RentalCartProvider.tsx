'use client'

import { RentCart } from '@/payload-types'
import { useAuth } from '@/providers/Auth'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'

type RentalCartContextValue = {
  rentalCart: RentCart | null
  isLoading: boolean
  addItem: (productID: number, quantity?: number) => Promise<void>
  removeItem: (itemID: string) => Promise<void>
  submitInquiry: (data: any) => Promise<RentCart>
  resetRentalCart: () => void
}

const RentalCartContext = createContext<RentalCartContextValue | null>(null)

const STORAGE_KEY = 'rentalCart'

export const RentalCartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth()
  const [rentalCart, setRentalCart] = useState<RentCart | null>(null)
  const [secret, setSecret] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Inicjalne załadowanie koszyka
  useEffect(() => {
    const load = async () => {
      setIsLoading(true)

      if (user) {
        // Krok 1: lekkie zapytanie, tylko po ID aktywnego koszyka
        const res = await fetch(`/api/users/me?select[rental_cart]=true`, {
          credentials: 'include',
        })
        const data = await res.json()

        const cartRef = data.user?.rental_cart?.docs?.[0]
        const rentalCartID = typeof cartRef === 'object' ? cartRef?.id : cartRef

        if (rentalCartID) {
          // Krok 2: osobne zapytanie po PEŁNY koszyk
          const cartRes = await fetch(`/api/rent-carts/${rentalCartID}?depth=2`, {
            credentials: 'include',
          })
          const cartData = await cartRes.json()
          setRentalCart(cartData)
        } else {
          setRentalCart(null)
        }
      } else {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const { cartID, secret: storedSecret } = JSON.parse(stored)
          const res = await fetch(`/api/rent-carts/${cartID}`)
          const data = await res.json()
          setRentalCart(data ?? null)
          setSecret(storedSecret)
        }
      }

      setIsLoading(false)
    }

    load()
  }, [user])

  const persistGuestCart = (cartID: string, cartSecret: string) => {
    setSecret(cartSecret)
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ cartID, secret: cartSecret }))
  }

  const addItem = useCallback(
    async (productID: number, quantity = 1) => {
      const res = await fetch('/next/rental-cart/items', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartID: rentalCart?.id,
          secret,
          productID,
          quantity,
        }),
      })
      const data = await res.json()
      setRentalCart(data.cart)

      if (!user && data.secret) {
        persistGuestCart(data.cart.id, data.secret)
      }
    },
    [rentalCart, secret, user],
  )

  const removeItem = useCallback(
    async (itemID: string) => {
      if (!rentalCart) return
      const res = await fetch(`/next/rental-cart/items/${itemID}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartID: rentalCart.id, secret }),
      })
      const data = await res.json()
      setRentalCart(data.cart)
    },
    [rentalCart, secret],
  )

  const submitInquiry = useCallback(
    async (formData: any) => {
      if (!rentalCart) throw new Error('Brak koszyka do wysłania')
      const res = await fetch('/next/rental-cart/submit', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartID: rentalCart.id, secret, ...formData }),
      })
      const data = await res.json()
      resetRentalCart() // analogicznie do clearSession - zapomnij o wysłanym koszyku
      return data.cart
    },
    [rentalCart, secret],
  )

  const resetRentalCart = useCallback(() => {
    setRentalCart(null)
    setSecret(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return (
    <RentalCartContext.Provider
      value={{ rentalCart, isLoading, addItem, removeItem, submitInquiry, resetRentalCart }}
    >
      {children}
    </RentalCartContext.Provider>
  )
}

export const useRentalCart = () => {
  const ctx = useContext(RentalCartContext)
  if (!ctx) throw new Error('useRentalCart musi być użyty wewnątrz RentalCartProvider')
  return ctx
}
