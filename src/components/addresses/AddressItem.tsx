'use client'

import { supportedCountries } from '@/collections/plugin-ecommerce/supported-countries'
import { DomainAddress } from '@/features/addresses/domain/types'
import React from 'react'

type Props = {
  address: DomainAddress
  actions?: React.ReactNode
  label?: React.ReactNode
}

export const AddressItem: React.FC<Props> = ({ address, actions, label }) => {
  return (
    <div className="border rounded-lg p-4 lg:p-6 flex flex-col items-start">
      {label}
      <div className="grow">
        {address.companyName && <p className="mb-4">{address.companyName}</p>}
        {address.firstName && address.lastName && (
          <p className="mb-4">
            {address.firstName} {address.lastName}
          </p>
        )}
        <p className="font-light text-muted-foreground">
          {address.addressLine1}
          {address.addressLine2 && <>/{address.addressLine2}</>}
        </p>
        <p className="font-light text-muted-foreground">
          {address.postalCode}&nbsp;{address.city}
        </p>
        <p className="font-light text-muted-foreground">
          {supportedCountries.filter((country) => country.value === address.country)[0].label}
        </p>
        <p className="font-light text-muted-foreground">
          tel: {address.phone && <span>{address.phone}</span>}
        </p>
        {address.taxId && <p className="font-light text-muted-foreground">NIP: {address.taxId}</p>}
      </div>
      {actions}
    </div>
  )
}
