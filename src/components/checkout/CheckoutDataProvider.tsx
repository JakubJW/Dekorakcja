'use client'

import { DomainAddress, DomainOrganizationAddress } from '@/features/addresses/domain/types'
import type { ShippingMethod } from '@/payload-types'
import { createContext, RefObject, useContext, useEffect, useRef, useState } from 'react'
import { FormHandle } from '../forms/AddressForm'
import {
  TCreateAddressFormSchema,
  TUpdateAddressFormSchema,
} from '../forms/AddressForm/addressFormSchema'
import {
  TCreateOrganizationAddressFormSchema,
  TUpdateOrganizationAddressFormSchema,
} from './PersonalData/organization/organizationAddressFormSchema'

type PersonalDataStep = {
  email?: string
  setEmail: (value: string) => void
  buyAsOrganization: boolean
  setBuyAsOrganization: (value: boolean) => void
  organizationAddress?: DomainOrganizationAddress
  setOrganizationAddress: (value: DomainOrganizationAddress | undefined) => void
  billingAddress?: DomainAddress
  setBillingAddress: (value: DomainAddress | undefined) => void
  billingFormRef: RefObject<FormHandle<TCreateAddressFormSchema | TUpdateAddressFormSchema> | null>
  companyFormRef: RefObject<FormHandle<
    TCreateOrganizationAddressFormSchema | TUpdateOrganizationAddressFormSchema
  > | null>
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
  organizationAddresses,
  shippingMethods,
}: {
  children: React.ReactNode
  addresses: DomainAddress[]
  organizationAddresses: DomainOrganizationAddress[]
  shippingMethods: ShippingMethod[]
}) => {
  const [email, setEmail] = useState<string | undefined>(undefined)
  const [organizationAddress, setOrganizationAddress] = useState<
    DomainOrganizationAddress | undefined
  >(undefined)
  const [paymentData, setPaymentData] = useState<null | Record<string, unknown>>(null)
  const [shippingAddress, setShippingAddress] = useState<DomainAddress | undefined>()
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod | undefined>()
  const [billingAddress, setBillingAddress] = useState<DomainAddress | undefined>()
  const [billingAddressSameAsShipping, setBillingAddressSameAsShipping] = useState(false)
  const [isProcessingPayment, setProcessingPayment] = useState(false)
  const [buyAsOrganization, setBuyAsOrganization] = useState(false)
  const billingFormRef =
    useRef<FormHandle<TCreateAddressFormSchema | TUpdateAddressFormSchema>>(null)
  const companyFormRef =
    useRef<FormHandle<TCreateOrganizationAddressFormSchema | TUpdateOrganizationAddressFormSchema>>(
      null,
    )

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
