'use client'

import { AddressItem } from '@/components/addresses/AddressItem'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { CheckoutAddresses } from '../CheckoutAddresses'
import { usePaymentData } from '../CheckoutDataProvider'

export const ShippingAddressSection: React.FC = () => {
  const {
    billingAddressSameAsShipping,
    setBillingAddressSameAsShipping,
    shippingAddress,
    setShippingAddress,
    paymentData,
  } = usePaymentData()

  return (
    <div className="space-y-2">
      <div className="flex gap-4 items-center">
        <Checkbox
          id="shippingTheSameAsBilling"
          checked={billingAddressSameAsShipping}
          onCheckedChange={(state) => {
            setBillingAddressSameAsShipping(state as boolean)
          }}
        />
        <Label htmlFor="shippingTheSameAsBilling">
          Adres dostawy taki sam, jak adres rozliczeniowy
        </Label>
      </div>
      {!billingAddressSameAsShipping && (
        <>
          {shippingAddress ? (
            <div>
              <AddressItem
                actions={
                  <Button
                    variant={'outline'}
                    disabled={Boolean(paymentData)}
                    onClick={(e) => {
                      e.preventDefault()
                      setShippingAddress(undefined)
                    }}
                  >
                    Remove
                  </Button>
                }
                address={shippingAddress}
              />
            </div>
          ) : (
            <CheckoutAddresses
              heading="Adres dostawy"
              description="Wybierz adres dostawy."
              setAddress={setShippingAddress}
            />
          )}
        </>
      )}
    </div>
  )
}
