export type DomainAddress = {
  id?: number
  customer?: number
  firstName: string
  lastName: string
  addressLine1: string
  addressLine2?: string
  city: string
  country: string
  phone: string
  postalCode: string
}

export type DomainOrganizationAddress = {
  id?: number
  customer?: number
  nip: string
  organization: string
  addressLine1: string
  addressLine2?: string
  city: string
  country: string
  postalCode: string
}
