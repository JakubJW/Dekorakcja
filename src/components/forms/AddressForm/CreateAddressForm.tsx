import { useCheckoutData } from '@/components/checkout/CheckoutDataProvider'
import { User } from '@/payload-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAddresses } from '@payloadcms/plugin-ecommerce/client/react'
import { useForm } from 'react-hook-form'
import { AddressForm } from '.'
import { createAddressFormSchema, TCreateAddressFormSchema } from './addressFormSchema'

type Props = {
  user?: User | null
}

export const CreateAddressForm = ({ user }: Props) => {
  const { createAddress } = useAddresses()
  const {
    personalData: { setBillingAddress },
  } = useCheckoutData()
  const form = useForm({
    resolver: zodResolver(createAddressFormSchema),
    defaultValues: {
      type: 'person',
    },
  })

  const handleSubmit = (values: TCreateAddressFormSchema) => {
    // if (values.submitAddress) {
    //   createAddress(values)
    // }

    setBillingAddress(values)
  }

  return <AddressForm form={form} onSubmit={handleSubmit} allowAddressSave={Boolean(user)} />
}
