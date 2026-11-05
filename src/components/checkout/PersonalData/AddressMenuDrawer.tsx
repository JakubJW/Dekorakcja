import { BillingAddressType } from '@/collections/plugin-ecommerce/orders'
import { AddressListing } from '@/components/addresses/AddressListing'
import { AddressForm } from '@/components/forms/AddressForm'
import { TCreateAddressFormSchema } from '@/components/forms/AddressForm/billingAddressFormSchema'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { DomainAddress } from '@/features/addresses/domain/types'
import { useCustomAddresses } from '@/features/addresses/hooks/useCustomAddresses'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { User } from '@/payload-types'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useCheckoutData } from '../CheckoutDataProvider'

type ViewState = 'LIST' | 'ADD' | 'EDIT'

type AddressMenuDrawerProps = {
  user?: User | null
}

export const AddressMenuDrawer = ({ user }: AddressMenuDrawerProps) => {
  const [view, setView] = useState<ViewState>('LIST')
  const [editingAddress, setEditingAddress] = useState<DomainAddress | null>(null)
  const {
    personalData: {
      addressSheet,
      setAddressSheet,
      addresses,
      billingAddress,
      shippingAddress,
      setBillingAddress,
      setShippingAddress,
    },
    closeSheet,
  } = useCheckoutData()
  const { removeAddress, createAddress, updateAddress } = useCustomAddresses()
  const isDesktop = useMediaQuery('(min-width: 768px)')

  useEffect(() => {
    if (!addressSheet.isOpen) return

    if (addressSheet.reason === 'checkbox') {
      setView(addresses.length > 1 ? 'LIST' : 'ADD')
    } else {
      setView('LIST')
    }
    setEditingAddress(null)
  }, [addressSheet.isOpen, addressSheet.reason, addresses.length])

  const handleSuccess = (address: DomainAddress) => {
    closeSheet('success')
  }

  const handleDeleteAddress = async (id: number) => {
    await removeAddress(id)
  }

  const handleEditAddress = (addressToEditId: number) => {
    const addressToEdit = addressSheet.addresses.find(({ id }) => id === addressToEditId)

    if (!addressToEdit) return

    setEditingAddress(addressToEdit)
    setView('EDIT')
  }

  const handleAddressSelect = (selectedAddressId: string) => {
    const selectedAddress = addresses.find(({ id }) => id === Number(selectedAddressId))

    if (!selectedAddress) return

    if (addressSheet.addressToSet === 'shipping') {
      setShippingAddress(selectedAddress)
    } else {
      setBillingAddress(selectedAddress)
    }

    closeSheet('success')
  }

  const handleAddressCreate = useCallback(
    (values: TCreateAddressFormSchema) => {
      if (user) {
        createAddress(values, user.id)
        setShippingAddress(values)
      } else {
        setShippingAddress(values)
      }

      closeSheet('success')
    },
    [user, setShippingAddress],
  )

  const handleAddressUpdate = useCallback(
    async (values: TCreateAddressFormSchema) => {
      if (user) {
        const updated = await updateAddress(values, editingAddress!.id!)

        setAddressSheet((prev) => ({
          ...prev,
          addresses: prev.addresses.map((address) =>
            address.id === updated.id ? updated : address,
          ),
        }))
        setShippingAddress(values)
      } else {
        setShippingAddress(values)
      }

      closeSheet('success')
    },
    [editingAddress, setShippingAddress],
  )

  const selectedValue = useMemo(() => {
    return addressSheet.addressToSet === 'shipping' ? shippingAddress?.id : billingAddress?.id
  }, [billingAddress, shippingAddress, addressSheet])

  return (
    <Sheet
      onOpenChange={(state) => {
        if (!state) closeSheet('cancel')
      }}
      open={addressSheet.isOpen}
    >
      <SheetContent side={isDesktop ? 'right' : 'bottom'} className="flex flex-col max-h-full">
        {view === 'LIST' && (
          <>
            <SheetHeader>
              <SheetTitle className="font-sans">Zmień dane</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col grow justify-between">
              <div className="space-y-4">
                <AddressListing
                  options={addressSheet.addresses}
                  selectedValue={selectedValue}
                  onDelete={handleDeleteAddress}
                  onEdit={handleEditAddress}
                  onValueChange={handleAddressSelect}
                />
              </div>
              <Button className="mx-4 mb-4" onClick={() => setView('ADD')}>
                Dodaj nowy adres
              </Button>
            </div>
          </>
        )}
        {view === 'ADD' && (
          <>
            <SheetHeader>
              <SheetTitle className="font-sans">Zmień dane</SheetTitle>
            </SheetHeader>
            <AddressForm
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
              formClassName="px-4 pb-4 overflow-auto"
              mode="create"
              onSubmit={handleAddressCreate}
              onCancel={() => {
                if (addressSheet.reason === 'checkbox') {
                  closeSheet('cancel')
                } else {
                  setView('LIST')
                }
              }}
            />
          </>
        )}
        {editingAddress && view === 'EDIT' && (
          <>
            <SheetHeader>
              <SheetTitle className="font-sans">Zmień dane</SheetTitle>
            </SheetHeader>
            <AddressForm
              formClassName="px-4 pb-4 overflow-auto"
              initialData={editingAddress}
              mode="update"
              onSubmit={handleAddressUpdate}
              onCancel={() => {
                setView('LIST')
              }}
            />
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
