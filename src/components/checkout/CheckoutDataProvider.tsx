'use client'

import { DomainAddress, DomainOrganizationAddress } from '@/features/addresses/domain/types'
import type { ShippingMethod } from '@/payload-types'
import { createContext, useContext, useEffect, useState } from 'react'

type PersonalDataStep = {
  email?: string
  setEmail: (value: string) => void
  billingAddress?: DomainAddress
  setBillingAddress: (value: DomainAddress | undefined) => void
}

type ShippingDataStep = {
  shippingMethods: ShippingMethod[]
  shippingMethod?: ShippingMethod
  setShippingMethod: (value: ShippingMethod) => void
  shippingAddress?: DomainAddress
  setShippingAddress: (value: DomainAddress | undefined) => void
  billingAddressSameAsShipping: boolean
  setBillingAddressSameAsShipping: (state: boolean) => void
}

type CheckoutDataContext = {
  personalData: PersonalDataStep
  shippingData: ShippingDataStep
  paymentData: Record<string, unknown> | null
  setPaymentData: (data: Record<string, unknown> | null) => void
  isProcessingPayment: boolean
  setProcessingPayment: (state: boolean) => void
}

const Context = createContext({} as CheckoutDataContext)

export const PaymentDataProvider = ({
  children,
  addresses,
  shippingMethods,
}: {
  children: React.ReactNode
  addresses: DomainAddress[]
  organizationAddresses: DomainOrganizationAddress[]
  shippingMethods: ShippingMethod[]
}) => {
  const [email, setEmail] = useState<string | undefined>(undefined)
  const [paymentData, setPaymentData] = useState<null | Record<string, unknown>>(null)
  const [shippingAddress, setShippingAddress] = useState<DomainAddress | undefined>()
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod | undefined>()
  const [billingAddress, setBillingAddress] = useState<DomainAddress | undefined>()
  const [billingAddressSameAsShipping, setBillingAddressSameAsShipping] = useState(false)
  const [isProcessingPayment, setProcessingPayment] = useState(false)

  useEffect(() => {
    if (!billingAddress && addresses.length) {
      setBillingAddress(addresses[0])
    }
  }, [addresses])

  useEffect(() => {
    return () => {
      setShippingAddress(undefined)
      setBillingAddress(undefined)
      setBillingAddressSameAsShipping(true)
    }
  }, [])

  return (
    <Context.Provider
      value={{
        personalData: {
          email,
          setEmail,
          billingAddress,
          setBillingAddress,
        },
        shippingData: {
          shippingMethods,
          shippingMethod,
          setShippingMethod,
          billingAddressSameAsShipping,
          setBillingAddressSameAsShipping,
          shippingAddress,
          setShippingAddress,
        },
        paymentData,
        setPaymentData,
        isProcessingPayment,
        setProcessingPayment,
      }}
    >
      {children}
    </Context.Provider>
  )
}

type useCheckoutData = () => CheckoutDataContext // eslint-disable-line no-unused-vars

export const useCheckoutData: useCheckoutData = () => {
  const ctx = useContext(Context)
  if (!ctx) throw new Error('useCheckoutData must be called within CheckoutDataProvider')
  return ctx
}
