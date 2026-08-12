'use client'

import type { Address, OrganizationAddress } from '@/payload-types'
import { createContext, RefObject, useContext, useEffect, useRef, useState } from 'react'
import { AddressFormValues, FormHandle } from '../forms/AddressForm'
import type { CompanyFormValues } from './PersonalData/organization/OrganizationForm'

type PersonalDataStep = {
  email?: string
  setEmail: (value: string) => void
  buyAsOrganization: boolean
  setBuyAsOrganization: (value: boolean) => void
  organizationAddress?: Partial<CompanyFormValues>
  setOrganizationAddress: (value: Partial<CompanyFormValues>) => void
  billingAddress?: Partial<Address>
  setBillingAddress: React.Dispatch<React.SetStateAction<Partial<Address> | undefined>>
  billingFormRef: RefObject<FormHandle<AddressFormValues> | null>
  companyFormRef: RefObject<FormHandle<CompanyFormValues> | null>
}

type PaymentDataContext = {
  personalData: PersonalDataStep
  paymentData: Record<string, unknown> | null
  setPaymentData: (data: Record<string, unknown> | null) => void
  shippingAddress?: Partial<Address>
  setShippingAddress: React.Dispatch<React.SetStateAction<Partial<Address> | undefined>>
  billingAddressSameAsShipping: boolean
  setBillingAddressSameAsShipping: (state: boolean) => void
  isProcessingPayment: boolean
  setProcessingPayment: (state: boolean) => void
}

const Context = createContext({} as PaymentDataContext)

export const PaymentDataProvider = ({
  children,
  addresses,
  organizationAddresses,
}: {
  children: React.ReactNode
  addresses: Address[]
  organizationAddresses: OrganizationAddress[]
}) => {
  const [email, setEmail] = useState<string | undefined>(undefined)
  const [organizationAddress, setOrganizationAddress] = useState<
    Partial<CompanyFormValues> | undefined
  >(undefined)
  const [paymentData, setPaymentData] = useState<null | Record<string, unknown>>(null)
  const [shippingAddress, setShippingAddress] = useState<Partial<Address> | undefined>()
  const [billingAddress, setBillingAddress] = useState<Partial<Address> | undefined>()
  const [billingAddressSameAsShipping, setBillingAddressSameAsShipping] = useState(true)
  const [isProcessingPayment, setProcessingPayment] = useState(false)
  const [buyAsOrganization, setBuyAsOrganization] = useState(false)
  const billingFormRef = useRef<FormHandle<AddressFormValues>>(null)
  const companyFormRef = useRef<FormHandle<CompanyFormValues>>(null)

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
        paymentData,
        setPaymentData,
        billingAddressSameAsShipping,
        setBillingAddressSameAsShipping,
        shippingAddress,
        setShippingAddress,
        isProcessingPayment,
        setProcessingPayment,
      }}
    >
      {children}
    </Context.Provider>
  )
}

type UsePaymentData = () => PaymentDataContext // eslint-disable-line no-unused-vars

export const usePaymentData: UsePaymentData = () => {
  const ctx = useContext(Context)
  if (!ctx) throw new Error('usePaymentData must be called within PaymentDataProvider')
  return ctx
}
