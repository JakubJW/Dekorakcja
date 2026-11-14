import { BillingAddressType } from '@/collections/plugin-ecommerce/transactions'
import { Address } from '@/payload-types'
import { DomainAddress } from './domain/types'

export function mapAddressToDomain(data: Address): DomainAddress {
  const str = (value: unknown) => typeof value === 'string' && value.length > 0

  if (str(data.companyName) && str(data.taxId)) {
    return {
      ...data,
      kind: BillingAddressType.ORGANIZATION,
      companyName: data.companyName!,
      taxId: data.taxId!,
      firstName: undefined,
      lastName: undefined,
      addressLine2: data.addressLine2 ?? undefined,
    }
  }

  if (str(data.firstName) && str(data.lastName)) {
    return {
      ...data,
      kind: BillingAddressType.PERSONAL,
      firstName: data.firstName!,
      lastName: data.lastName!,
      companyName: undefined,
      taxId: undefined,
      addressLine2: data.addressLine2 ?? undefined,
    }
  }

  throw new Error(`Nieprawidłowy adres: ${(data as any).id ?? '<no id>'}`)
}
