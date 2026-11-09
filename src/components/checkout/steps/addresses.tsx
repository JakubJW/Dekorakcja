import { BillingAddressType } from '@/collections/plugin-ecommerce/orders'
import { AddressItem } from '@/components/addresses/AddressItem'
import { AddressForm } from '@/components/forms/AddressForm'
import { TCreateAddressFormSchema } from '@/components/forms/AddressForm/billingAddressFormSchema'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { DomainAddress } from '@/features/addresses/domain/types'
import { useCustomAddresses } from '@/features/addresses/hooks/useCustomAddresses'
import { useAuth } from '@/providers/Auth'
import { ReceiptText, User } from 'lucide-react'
import { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react'
import { AddressesSheet } from '../addresses-sheet'

type SheetReason = 'edit' | 'checkbox' | null
type SheetAddressToSet = 'billing' | 'shipping' | null

export type AddressSheetState = {
  isOpen: boolean
  addresses: DomainAddress[]
  reason: SheetReason
  addressToSet: SheetAddressToSet
}

type AddressesProps = {
  addresses: DomainAddress[]
  shippingAddress?: DomainAddress
  onShippingAddressChange: Dispatch<SetStateAction<DomainAddress | undefined>>
  billingAddress?: DomainAddress
  onBillingAddressChange: Dispatch<SetStateAction<DomainAddress | undefined>>
  isDifferentBilling: boolean
  onIsDifferentBillingChange: Dispatch<SetStateAction<boolean>>
}

export const Addresses = ({
  addresses,
  shippingAddress,
  onShippingAddressChange,
  billingAddress,
  onBillingAddressChange,
  isDifferentBilling,
  onIsDifferentBillingChange,
}: AddressesProps) => {
  const [addressSheet, setAddressSheet] = useState<AddressSheetState>({
    isOpen: false,
    addresses,
    reason: null,
    addressToSet: null,
  })
  const { user } = useAuth()
  const { createAddress } = useCustomAddresses()

  const handleCheckboxChange = (checked: boolean) => {
    onIsDifferentBillingChange(checked)

    if (checked) {
      openSheet('checkbox', 'billing')
    } else {
      onBillingAddressChange(undefined)
    }
  }

  const handleAddressSubmit = useCallback(
    (values: TCreateAddressFormSchema) => {
      if (user) {
        createAddress(values, user.id)
        onShippingAddressChange(values)
      } else {
        onShippingAddressChange(values)
      }
    },
    [user, onShippingAddressChange],
  )

  const showBillingAddress = useMemo(() => {
    return isDifferentBilling && billingAddress !== undefined
  }, [isDifferentBilling, billingAddress])

  if (user === undefined) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    )
  }

  const openSheet = (reason: SheetReason, addressToSet: SheetAddressToSet) => {
    setAddressSheet((prev) => ({ ...prev, isOpen: true, reason, addressToSet }))
  }

  return (
    <div className="space-y-6 flex flex-col">
      <div className="space-y-6">
        <h2 className="font-medium md:text-2xl">Dane odbiorcy przesyłki</h2>
        {!shippingAddress && (
          <AddressForm
            onSubmit={handleAddressSubmit}
            mode="create"
            initialData={
              user
                ? {
                    kind: BillingAddressType.PERSONAL,
                    email: user.email,
                    firstName: user.name?.split(' ')[0],
                    lastName: user.name?.split(' ')[1],
                  }
                : {}
            }
            inputsContainerClassName="grid-cols-2"
            formClassName="px-0 pb-0"
          />
        )}
        {shippingAddress && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <AddressItem
                address={shippingAddress}
                label={
                  <span className="flex items-center gap-1 font-medium mb-4 text-sm">
                    <User className="size-4" />
                    Dane odbiorcy
                  </span>
                }
                actions={
                  <Button
                    variant={'link'}
                    className="p-0 underline"
                    onClick={() => openSheet('edit', 'shipping')}
                  >
                    Zmień dane
                  </Button>
                }
              />
              {showBillingAddress && (
                <AddressItem
                  address={billingAddress!}
                  label={
                    <span className="flex items-center gap-1 font-medium mb-4 text-sm">
                      <ReceiptText className="size-4" />
                      Dane do faktury
                    </span>
                  }
                  actions={
                    <Button
                      variant={'link'}
                      className="p-0 underline"
                      onClick={() => openSheet('edit', 'billing')}
                    >
                      Zmień dane
                    </Button>
                  }
                />
              )}
            </div>
            <Label htmlFor="billingDifferentThanShipping">
              <Checkbox
                id="billingDifferentThanShipping"
                checked={isDifferentBilling}
                onCheckedChange={handleCheckboxChange}
              />
              Chcę podać inne dane do faktury
            </Label>
          </>
        )}
      </div>
      <AddressesSheet
        user={user}
        addresses={addresses}
        addressSheet={addressSheet}
        setAddressSheet={setAddressSheet}
        shippingAddress={shippingAddress}
        billingAddress={billingAddress}
        onShippingAddressChange={onShippingAddressChange}
        onBilingAddressChange={onBillingAddressChange}
        onIsDifferentBillingChange={onIsDifferentBillingChange}
      />

      {/* {!paymentData?.['clientSecret'] && error && (
        <div className="my-8">
          <Message error={error} />

          <Button
            onClick={(e) => {
              e.preventDefault()
              router.refresh()
            }}
            variant="default"
          >
            Spróbuj ponownie
          </Button>
        </div>
      )} */}
    </div>
  )
}
