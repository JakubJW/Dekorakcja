import { Address, OrganizationAddress } from '@/payload-types'
import { DomainAddress, DomainOrganizationAddress } from './domain/types'

export const mapAddressToDomain = (data: Address): DomainAddress => {
  console.log(data)

  return {
    id: data.id,
    firstName: data.firstName,
    lastName: data.lastName,
    addressLine1: data.addressLine1,
    addressLine2: data.addressLine2 ?? undefined,
    city: data.city,
    country: data.country,
    phone: data.phone,
    postalCode: data.postalCode,
  }
}

export const mapOrganizationAddressToDomain = (
  data: OrganizationAddress,
): DomainOrganizationAddress => {
  return {
    id: data.id,
    nip: data.nip,
    organization: data.organization,
    addressLine1: data.addressLine1,
    addressLine2: data.addressLine2 ?? undefined,
    city: data.city,
    country: data.country,
    postalCode: data.postalCode,
  }
}
