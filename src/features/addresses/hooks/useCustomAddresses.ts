import { TCreateAddressFormSchema } from '@/components/forms/AddressForm/billingAddressFormSchema'
import { apiClient } from '@/lib/api/rest-api-client'
import { Address } from '@/payload-types'
import { DefaultDocumentIDType } from 'payload'
import { mapAddressToDomain } from '../mapper'

export const useCustomAddresses = () => {
  const removeAddress = async (id: number) => {
    const res = await apiClient.DELETE<{ message: string }>(`/addresses/${id}`)
  }

  const createAddress = async (values: TCreateAddressFormSchema, userId: DefaultDocumentIDType) => {
    const res = await apiClient.POST<{ doc: Address }>('/addresses?depth=0', {
      ...values,
      customer: userId,
    })

    return mapAddressToDomain(res.doc)
  }

  const updateAddress = async (values: TCreateAddressFormSchema, id: DefaultDocumentIDType) => {
    const res = await apiClient.PATCH<{ doc: Address }>(`/addresses/${id}?depth=0`, {
      ...values,
    })

    return mapAddressToDomain(res.doc)
  }

  return { createAddress, removeAddress, updateAddress }
}
