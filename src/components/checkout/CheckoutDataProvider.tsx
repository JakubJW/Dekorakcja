'use client'

import { DomainAddress } from '@/features/addresses/domain/types'
import type { ShippingMethod } from '@/payload-types'

import {
  createContext,
  SetStateAction,
  useContext,
  useEffect,
  useState,
  type Dispatch,
} from 'react'

type SheetReason = 'edit' | 'checkbox' | null
type SheetAddressToSet = 'billing' | 'shipping' | null

type AddressSheetState = {
  isOpen: boolean
  addresses: DomainAddress[]
  reason: SheetReason
  addressToSet: SheetAddressToSet
}

type PersonalDataStep = {
  addresses: DomainAddress[]
  billingAddress?: DomainAddress
  setBillingAddress: Dispatch<SetStateAction<DomainAddress | undefined>>
  shippingAddress?: DomainAddress
  setShippingAddress: Dispatch<SetStateAction<DomainAddress | undefined>>
  addressSheet: AddressSheetState
  setAddressSheet: Dispatch<SetStateAction<AddressSheetState>>
  isDifferentBilling: boolean
  setIsDifferentBilling: Dispatch<SetStateAction<boolean>>
}

type ShippingDataStep = {
  shippingMethods: ShippingMethod[]
  shippingMethod?: ShippingMethod
  setShippingMethod: Dispatch<SetStateAction<ShippingMethod | undefined>>
}

type CheckoutDataContext = {
  personalData: PersonalDataStep
  shippingData: ShippingDataStep
  paymentData: Record<string, unknown> | null
  setPaymentData: (data: Record<string, unknown> | null) => void
  isProcessingPayment: boolean
  setProcessingPayment: (state: boolean) => void
  openSheet: (reason: SheetReason, addressToSet: SheetAddressToSet) => void
  closeSheet: (action: 'success' | 'cancel') => void
}

const Context = createContext({} as CheckoutDataContext)

export const PaymentDataProvider = ({
  children,
  addresses,
  shippingMethods,
}: {
  children: React.ReactNode
  addresses: DomainAddress[]
  shippingMethods: ShippingMethod[]
}) => {
  const [addressSheet, setAddressSheet] = useState<AddressSheetState>({
    isOpen: false,
    addresses,
    reason: null,
    addressToSet: null,
  })

  const [paymentData, setPaymentData] = useState<null | Record<string, unknown>>(null)

  const [shippingAddress, setShippingAddress] = useState<DomainAddress | undefined>()
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod | undefined>()

  const [billingAddress, setBillingAddress] = useState<DomainAddress | undefined>()
  const [isDifferentBilling, setIsDifferentBilling] = useState(false)
  const [isProcessingPayment, setProcessingPayment] = useState(false)

  useEffect(() => {
    if (!shippingAddress && addresses.length) {
      setShippingAddress(addresses[0])
    }
  }, [addresses])

  useEffect(() => {
    return () => {
      setShippingAddress(undefined)
      setBillingAddress(undefined)
      setIsDifferentBilling(true)
    }
  }, [])

  const openSheet = (reason: SheetReason, addressToSet: SheetAddressToSet) => {
    setAddressSheet((prev) => ({ ...prev, isOpen: true, reason, addressToSet }))
  }

  const closeSheet = (action: 'success' | 'cancel') => {
    const wasCheckbox = addressSheet.reason === 'checkbox'
    setAddressSheet((prev) => ({ ...prev, isOpen: false, reason: null }))

    if (wasCheckbox && action === 'cancel') {
      setIsDifferentBilling(false)
    }
  }

  return (
    <Context.Provider
      value={{
        personalData: {
          addresses,
          addressSheet,
          setAddressSheet,
          billingAddress,
          setBillingAddress,
          shippingAddress,
          setShippingAddress,
          isDifferentBilling,
          setIsDifferentBilling,
        },
        shippingData: {
          shippingMethods,
          shippingMethod,
          setShippingMethod,
        },
        paymentData,
        setPaymentData,
        isProcessingPayment,
        setProcessingPayment,
        openSheet,
        closeSheet,
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
