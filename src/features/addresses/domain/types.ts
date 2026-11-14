import { BillingAddressType } from '@/collections/plugin-ecommerce/transactions'
import { CountryType } from '@payloadcms/plugin-ecommerce/types'

export type BaseAddress = {
  id?: number
  addressLine1: string
  addressLine2?: string
  city: string
  postalCode: string
  phone: string
  country: CountryType['value']
  email: string
}

export type OrganizationAddress = BaseAddress & {
  kind: BillingAddressType.ORGANIZATION
  taxId: string
  companyName: string
  firstName?: string
  lastName?: string
}

export type PersonalAddress = BaseAddress & {
  kind: BillingAddressType.PERSONAL
  firstName: string
  lastName: string
  companyName?: string
  taxId?: string
}

export type DomainAddress = OrganizationAddress | PersonalAddress
