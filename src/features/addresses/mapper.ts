import { BillingAddressType } from '@/collections/billing-addresses';
import { Address, BillingAddress } from '@/payload-types';
import { DomainAddress, DomainBillingAddress } from './domain/types';

function assertCompleteAddress(
  data: BillingAddress,
): asserts data is
  | (BillingAddress & { type: 'person'; firstName: string; lastName: string })
  | (BillingAddress & { type: 'organization'; nip: string; companyName: string }) {
  if (data.type === BillingAddressType.PERSONAL) {
    if (!data.firstName || !data.lastName) {
      throw new Error(`BillingAddress ${data.id} is missing firstName or lastName`)
    }
  } else if (data.type === BillingAddressType.ORGANIZATION) {
    if (!data.nip || !data.companyName) {
      throw new Error(`BillingAddress ${data.id} is missing nip or companyName`)
    }
  } else {
    throw new Error('Invalid billing address')
  }
}

export const mapAddressToDomain = (data: Address): DomainAddress => {
  return {
    id: data.id,
    firstName: data.firstName,
    lastName: data.lastName,
    addressLine1: data.addressLine1,
    addressLine2: data.addressLine2 ?? undefined,
    city: data.city,
    phone: data.phone,
    postalCode: data.postalCode,
  }
}

export const mapBillingAddressToDomain = (data: BillingAddress): DomainBillingAddress => {
  assertCompleteAddress(data)

  return data.type === BillingAddressType.PERSONAL
    ? {
        id: data.id,
        type: data.type as BillingAddressType.PERSONAL,
        firstName: data.firstName,
        lastName: data.lastName,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2 ?? undefined,
        city: data.city,
        postalCode: data.postalCode,
      }
    : {
        id: data.id,
        type: data.type as BillingAddressType.ORGANIZATION,
        nip: data.nip,
        companyName: data.companyName,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2 ?? undefined,
        city: data.city,
        postalCode: data.postalCode,
      }
}
