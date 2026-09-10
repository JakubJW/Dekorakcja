'use client'

import { CreateAddressForm } from '@/components/forms/AddressForm/CreateAddressForm'
import { UpdateAddressForm } from '@/components/forms/AddressForm/UpdateAddressForm'
import { useAuth } from '@/providers/Auth'
import { useCheckoutData } from '../CheckoutDataProvider'

export const BillingAddress: React.FC = () => {
  const { user } = useAuth()
  const {
    personalData: { billingAddress },
  } = useCheckoutData()

  console.log(billingAddress)

  return (
    <div className="space-y-6">
      <h2 className="font-medium text-2xl">Adres rozliczeniowy</h2>

      {billingAddress ? (
        <UpdateAddressForm
          initialData={billingAddress}
          existingAddressId={billingAddress.id}
          user={user}
        />
      ) : (
        <CreateAddressForm user={user} />
      )}
    </div>
  )
}
