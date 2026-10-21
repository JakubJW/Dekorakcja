import { useCheckoutData } from '@/components/checkout/CheckoutDataProvider'
import { BillingAddress } from '@/features/addresses/domain/types'
import { User } from '@/payload-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAddresses } from '@payloadcms/plugin-ecommerce/client/react'
import { useForm } from 'react-hook-form'
import { AddressForm } from '.'
import { TUpdateAddressFormSchema, updateAddressFormSchema } from './addressFormSchema'

type Props = {
  user?: User | null
  existingAddressId?: number
  initialData: BillingAddress
}

export const UpdateAddressForm = ({ user, existingAddressId, initialData }: Props) => {
  const { updateAddress } = useAddresses()
  const {
    personalData: { setBillingAddress },
  } = useCheckoutData()
  const form = useForm({
    resolver: zodResolver(updateAddressFormSchema),
    values: { ...initialData, type: 'person' },
  })

  const handleSubmit = (values: TUpdateAddressFormSchema) => {
    if (values.submitAddress && existingAddressId) {
      updateAddress(existingAddressId, values)
    }

    setBillingAddress(values)
  }

  return <AddressForm form={form} onSubmit={handleSubmit} allowAddressSave={Boolean(user)} />
}
