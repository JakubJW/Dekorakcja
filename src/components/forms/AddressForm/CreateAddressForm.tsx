import { useCheckoutData } from '@/components/checkout/CheckoutDataProvider'
import { User } from '@/payload-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAddresses } from '@payloadcms/plugin-ecommerce/client/react'
import { useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { AddressForm } from '.'
import { createAddressFormSchema } from './addressFormSchema'

type Props = {
  user?: User | null
}

export const CreateAddressForm = ({ user }: Props) => {
  const { createAddress } = useAddresses()
  const {
    personalData: { billingFormRef },
  } = useCheckoutData()
  const form = useForm({
    resolver: zodResolver(createAddressFormSchema),
  })

  useImperativeHandle(
    billingFormRef,
    () => ({
      submit: () =>
        new Promise((resolve) => {
          form.handleSubmit(
            (data) => {
              if (data.submitAddress) {
                createAddress(data)
              }

              resolve(data)
            },
            () => resolve(undefined),
          )()
        }),
    }),
    [],
  )

  return <AddressForm form={form} allowAddressSave={Boolean(user)} />
}
