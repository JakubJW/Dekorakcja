'use client'

import type { Address, OrganizationAddress, ShippingMethod } from '@/payload-types'
import { createContext, RefObject, useContext, useEffect, useRef, useState } from 'react'
import { AddressFormValues, FormHandle } from '../forms/AddressForm'
import type { OrganizationFormValues } from './PersonalData/organization/OrganizationForm'

type PersonalDataStep = {
  email?: string
  setEmail: (value: string) => void
  buyAsOrganization: boolean
  setBuyAsOrganization: (value: boolean) => void
  organizationAddress?: Omit<OrganizationFormValues, 'submitOrganizationAddress'>
  setOrganizationAddress: (
    value: Omit<OrganizationFormValues, 'submitOrganizationAddress'> | undefined,
  ) => void
  billingAddress?: AddressFormValues
  setBillingAddress: (value: AddressFormValues | undefined) => void
  billingFormRef: RefObject<FormHandle<AddressFormValues> | null>
  companyFormRef: RefObject<FormHandle<OrganizationFormValues> | null>
}

type ShippingDataStep = {
  shippingMethods: ShippingMethod[]
  shippingAddress?: AddressFormValues
  setShippingAddress: (value: AddressFormValues | undefined) => void
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
  organizationAddresses,
  shippingMethods,
}: {
  children: React.ReactNode
  addresses: Address[]
  organizationAddresses: OrganizationAddress[]
  shippingMethods: ShippingMethod[]
}) => {
  const [email, setEmail] = useState<string | undefined>(undefined)
  const [organizationAddress, setOrganizationAddress] = useState<
    Omit<OrganizationFormValues, 'submitOrganizationAddress'> | undefined
  >(undefined)
  const [paymentData, setPaymentData] = useState<null | Record<string, unknown>>(null)
  const [shippingAddress, setShippingAddress] = useState<AddressFormValues | undefined>()
  const [billingAddress, setBillingAddress] = useState<AddressFormValues | undefined>()
  const [billingAddressSameAsShipping, setBillingAddressSameAsShipping] = useState(true)
  const [isProcessingPayment, setProcessingPayment] = useState(false)
  const [buyAsOrganization, setBuyAsOrganization] = useState(false)
  const billingFormRef = useRef<FormHandle<AddressFormValues>>(null)
  const companyFormRef = useRef<FormHandle<OrganizationFormValues>>(null)

  useEffect(() => {
    if (!billingAddress && addresses.length) {
      setBillingAddress(addresses[0])
    }
  }, [addresses])

  useEffect(() => {
    if (!organizationAddress && organizationAddresses.length) {
      setOrganizationAddress(organizationAddresses[0])
    }
  }, [organizationAddresses])

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
          organizationAddress,
          setOrganizationAddress,
          buyAsOrganization,
          setBuyAsOrganization,
          billingAddress,
          setBillingAddress,
          billingFormRef,
          companyFormRef,
        },
        shippingData: {
          shippingMethods,
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
