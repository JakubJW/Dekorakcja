import { BillingAddressType } from '@/collections/billing-addresses'

export type DomainAddress = {
  id?: number
  addressLine1: string
  addressLine2?: string
  city: string
  postalCode: string
  firstName: string
  lastName: string
  phone: string
}

export type BaseBillingAddress = {
  id?: number
  addressLine1: string
  addressLine2?: string
  city: string
  postalCode: string
}

export type OrganizationBillingAddress = BaseBillingAddress & {
  type: BillingAddressType.ORGANIZATION
  nip: string
  companyName: string
}

export type PersonalBillingAddress = BaseBillingAddress & {
  type: BillingAddressType.PERSONAL
  firstName: string
  lastName: string
}

export type DomainBillingAddress = OrganizationBillingAddress | PersonalBillingAddress
