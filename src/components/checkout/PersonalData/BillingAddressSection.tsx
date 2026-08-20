'use client'

import { AddressForm } from '@/components/forms/AddressForm'
import { useCheckoutData } from '../CheckoutDataProvider'

export const BillingAddressSection: React.FC = () => {
  const {
    personalData: { billingAddress },
  } = useCheckoutData()

  return (
    <div className="space-y-2">
      <h2 className="font-medium text-2xl">Adres rozliczeniowy</h2>

      <AddressForm existingAddressId={billingAddress?.id} initialData={billingAddress} />
    </div>
  )
}
