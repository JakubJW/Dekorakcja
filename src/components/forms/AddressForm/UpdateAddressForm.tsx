import { useCheckoutData } from '@/components/checkout/CheckoutDataProvider'
import { DomainBillingAddress } from '@/features/addresses/domain/types'
import { User } from '@/payload-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAddresses } from '@payloadcms/plugin-ecommerce/client/react'
import { useForm } from 'react-hook-form'
import { AddressForm } from '.'
import {
  TUpdateBillingAddressFormSchema,
  updateBillingAddressFormSchema,
} from './billingAddressFormSchema'

type Props = {
  user?: User | null
  existingAddressId?: number
  initialData: DomainBillingAddress
}

export const UpdateAddressForm = ({ user, existingAddressId, initialData }: Props) => {
  const { updateAddress } = useAddresses()
  const {
    personalData: { setBillingAddress },
  } = useCheckoutData()
  const form = useForm({
    resolver: zodResolver(updateBillingAddressFormSchema),
    values: initialData,
  })

  const handleSubmit = (values: TUpdateBillingAddressFormSchema) => {
    if (values.submitAddress && existingAddressId) {
      updateAddress(existingAddressId, values)
    }

    setBillingAddress(values)
  }

  return <AddressForm form={form} onSubmit={handleSubmit} allowAddressSave={Boolean(user)} />
}
