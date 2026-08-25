'use client'

import { AddressForm, AddressFormValues } from '@/components/forms/AddressForm'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { DefaultDocumentIDType } from 'payload'
import React, { useState } from 'react'

type Props = {
  addressID?: DefaultDocumentIDType
  initialData?: AddressFormValues
  buttonText?: string
  modalTitle?: string
  callback?: (address: AddressFormValues) => void
  skipSubmission?: boolean
  disabled?: boolean
}

export const CreateAddressModal: React.FC<Props> = ({
  addressID,
  initialData,
  buttonText = 'Add a new address',
  modalTitle = 'Add a new address',
  callback,
  skipSubmission,
  disabled,
}) => {
  const [open, setOpen] = useState(false)
  const handleOpenChange = (state: boolean) => {
    setOpen(state)
  }

  const closeModal = () => {
    setOpen(false)
  }

  const handleCallback = (data: AddressFormValues) => {
    closeModal()

    if (callback) {
      callback(data)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild disabled={disabled}>
        <Button variant={'outline'}>{buttonText}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{modalTitle}</DialogTitle>
          <DialogDescription>This address will be connected to your account.</DialogDescription>
        </DialogHeader>

        <AddressForm
          // addressID={addressID}
          initialData={initialData}
          // callback={handleCallback}
          // skipSubmission={skipSubmission}
        />
      </DialogContent>
    </Dialog>
  )
}
