export type BaseBillingAddress = {
  addressLine1: string
  addressLine2?: string
  city: string
  postalCode: string
  country: string
  phone: string
}

export type OrganizationBillingAddress = BaseBillingAddress & {
  type: 'organization'
  nip: string
  companyName: string
}

export type PersonalBillingAddress = BaseBillingAddress & {
  type: 'person'
  firstName: string
  lastName: string
}

export type BillingAddress = OrganizationBillingAddress | PersonalBillingAddress
