'use client'

import { AddressForm } from '@/components/forms/AddressForm'
import { usePaymentData } from '../PaymentDataProvider'

export const BillingAddressSection: React.FC = () => {
  const {
    personalData: { billingAddress },
  } = usePaymentData()

  return (
    <div className="space-y-2">
      <h2 className="font-medium text-2xl">Adres rozliczeniowy</h2>

      <AddressForm existingAddressId={billingAddress?.id} initialData={billingAddress} />
    </div>
  )
}
