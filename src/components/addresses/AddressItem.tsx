'use client'

import { CreateAddressModal } from '@/components/addresses/CreateAddressModal'
import type { Address } from '@/payload-types'
import React from 'react'

type Props = {
  address: Partial<Omit<Address, 'country'>> & { country?: string } // Allow address to be partial and entirely optional as this is entirely for display purposes
  actions?: React.ReactNode
  beforeActions?: React.ReactNode
  afterActions?: React.ReactNode
  hideActions?: boolean
}

export const AddressItem: React.FC<Props> = ({
  address,
  actions,
  hideActions = false,
  beforeActions,
  afterActions,
}) => {
  if (!address) {
    return null
  }

  return (
    <div className="flex items-center">
      <div className="grow">
        <p className="font-medium">
          {address.firstName} {address.lastName}
        </p>
        <p>{address.company && <span>{address.company} </span>}</p>
        <p>{address.phone && <span>{address.phone}</span>}</p>
        <p>
          {address.addressLine1}
          {address.addressLine2 && <>, {address.addressLine2}</>}
        </p>
        <p>
          {address.city}, {address.state} {address.postalCode}
        </p>
        <p>{address.country}</p>
      </div>

      {!hideActions && address.id && (
        <div className="shrink flex flex-col gap-2">
          {actions ? (
            actions
          ) : (
            <>
              {beforeActions}
              {address.id && (
                <CreateAddressModal
                  addressID={address.id}
                  initialData={address}
                  buttonText={'Edit'}
                  modalTitle={'Edit address'}
                />
              )}
              {afterActions}
            </>
          )}
        </div>
      )}
    </div>
  )
}
