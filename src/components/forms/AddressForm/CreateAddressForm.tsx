import { BillingAddressType } from '@/collections/billing-addresses'
import { useCheckoutData } from '@/components/checkout/CheckoutDataProvider'
import { FORM_STEP, useFormStep } from '@/components/checkout/FormStepProvider'
import { User } from '@/payload-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAddresses } from '@payloadcms/plugin-ecommerce/client/react'
import { useForm } from 'react-hook-form'
import { AddressForm } from '.'
import {
  createBillingAddressFormSchema,
  TCreateBillingAddressFormSchema,
} from './billingAddressFormSchema'

type Props = {
  user?: User | null
}

export const CreateAddressForm = ({ user }: Props) => {
  const { createAddress } = useAddresses()
  const { setCurrentStep } = useFormStep()
  const {
    personalData: { setBillingAddress },
  } = useCheckoutData()
  const form = useForm({
    resolver: zodResolver(createBillingAddressFormSchema),
    defaultValues: {
      type: BillingAddressType.PERSONAL,
    },
  })

  const handleSubmit = (values: TCreateBillingAddressFormSchema) => {
    if (values.submitAddress) {
      createAddress(values)
    }

    setBillingAddress(values)
    setCurrentStep(FORM_STEP.SHIPPING)
  }

  return <AddressForm form={form} onSubmit={handleSubmit} allowAddressSave={Boolean(user)} />
}
