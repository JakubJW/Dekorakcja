import { useCheckoutData } from '@/components/checkout/CheckoutDataProvider'
import { FORM_STEP, useFormStep } from '@/components/checkout/FormStepProvider'
import { User } from '@/payload-types'
import { useAddresses } from '@payloadcms/plugin-ecommerce/client/react'
import { AddressForm } from '.'
import {
  TCreateBillingAddressFormSchema
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

  const handleSubmit = (values: TCreateBillingAddressFormSchema) => {
    if (values.submitAddress) {
      createAddress(values)
    }

    setBillingAddress(values)
    setCurrentStep(FORM_STEP.SHIPPING)
  }

  return <AddressForm form={form} onSubmit={handleSubmit} />
}
