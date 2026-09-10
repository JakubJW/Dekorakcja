import { useCheckoutData } from '@/components/checkout/CheckoutDataProvider'
import { DomainAddress } from '@/features/addresses/domain/types'
import { User } from '@/payload-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAddresses } from '@payloadcms/plugin-ecommerce/client/react'
import { useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { AddressForm } from '.'
import { updateAddressFormSchema } from './addressFormSchema'

type Props = {
  user?: User | null
  existingAddressId?: number
  initialData: DomainAddress
}

export const UpdateAddressForm = ({ user, existingAddressId, initialData }: Props) => {
  const { updateAddress } = useAddresses()
  const {
    personalData: { billingFormRef },
  } = useCheckoutData()
  const form = useForm({
    resolver: zodResolver(updateAddressFormSchema),
    values: initialData,
  })

  useImperativeHandle(
    billingFormRef,
    () => ({
      submit: () =>
        new Promise((resolve) => {
          form.handleSubmit(
            (data) => {
              if (data.submitAddress && existingAddressId) {
                updateAddress(existingAddressId, data)
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
