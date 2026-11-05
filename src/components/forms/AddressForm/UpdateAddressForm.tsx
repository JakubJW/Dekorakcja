import { useCheckoutData } from '@/components/checkout/CheckoutDataProvider'
import { DomainAddress } from '@/features/addresses/domain/types'
import { User } from '@/payload-types'
import { useAddresses } from '@payloadcms/plugin-ecommerce/client/react'
import { AddressForm } from '.'
import { TUpdateAddressFormSchema } from './billingAddressFormSchema'

type Props = {
  user?: User | null
  existingAddressId?: number
  initialData?: DomainAddress
}

export const UpdateAddressForm = ({ user, existingAddressId, initialData }: Props) => {
  const { updateAddress } = useAddresses()
  const {
    personalData: { setBillingAddress },
  } = useCheckoutData()

  const handleSubmit = (values: TUpdateAddressFormSchema) => {
    setBillingAddress(values)
  }

  return <AddressForm onSubmit={handleSubmit} mode="update" initialData={initialData} />
}
