import { Price } from '@/components/Price'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from '@/components/ui/field'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { env } from '@/env'
import { InpostPointInterface } from '@/features/checkout/inpost-geowidget'
import { DeliveryIcon } from '@/features/checkout/shipping/icons/delivery-icon'
import { ShippingMethod } from '@/payload-types'
import dynamic from 'next/dynamic'
import { Dispatch, SetStateAction, useState } from 'react'

const InPostGeowidget = dynamic(() => import('@/features/checkout/inpost-geowidget'), {
  ssr: false,
})

type ShippingProps = {
  methods: ShippingMethod[]
  shippingMethod?: Partial<ShippingMethod & { lockerDetails?: SelectedLocker }>
  onShippingMethodChange: Dispatch<
    SetStateAction<Partial<ShippingMethod & { lockerDetails?: SelectedLocker }> | undefined>
  >
}

export type SelectedLocker =
  | Pick<InpostPointInterface, 'location_description' | 'address' | 'name'>
  | undefined

export const Shipping = ({ methods, shippingMethod, onShippingMethodChange }: ShippingProps) => {
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleDeliveryOptionChange = (value: string) => {
    const selectedMethod = methods.find((method) => method.slug === value)

    if (!selectedMethod) {
      onShippingMethodChange(undefined)
      return
    }

    onShippingMethodChange(selectedMethod)

    if (selectedMethod.slug === 'paczkomat-inpost' && !dialogOpen) {
      setDialogOpen(true)
    }
  }

  const handleDialogOpenChange = (state: boolean) => {
    setDialogOpen(state)

    if (!state && shippingMethod?.slug === 'paczkomat-inpost' && !shippingMethod.lockerDetails) {
      onShippingMethodChange(undefined)
    }
  }

  const handleShippingpointSelect = (point: InpostPointInterface) => {
    onShippingMethodChange((prev) => ({
      ...prev,
      lockerDetails: {
        name: point.name,
        address: { line1: point.address.line1, line2: point.address.line2 },
        location_description: point.location_description,
      },
    }))
    setDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <h2 className="font-medium text-2xl">Sposób dostawy</h2>
      <RadioGroup
        value={shippingMethod?.slug}
        onValueChange={(value) => handleDeliveryOptionChange(value)}
      >
        {methods.map((method) => (
          <FieldLabel htmlFor={method.slug} key={method.id}>
            <Field className="cursor-pointer">
              <FieldContent>
                <div className="flex justify-between">
                  <FieldTitle>
                    <div className="flex items-center gap-4">
                      <div className="min-w-40">
                        <DeliveryIcon name={method.slug} className="h-4" />
                      </div>
                      <span className="whitespace-pre">{method.name}</span>
                    </div>
                  </FieldTitle>
                  <FieldDescription>
                    <Price as="span" amount={method.price} />
                  </FieldDescription>
                </div>
                {method.slug === 'paczkomat-inpost' &&
                  shippingMethod &&
                  shippingMethod.lockerDetails &&
                  shippingMethod.slug === 'paczkomat-inpost' && (
                    <div className="mt-2">
                      <div className="mb-4">
                        <p className="text-xs mb-1">{shippingMethod.name}</p>
                        <p className="font-bold">
                          {shippingMethod.lockerDetails.address.line1},{' '}
                          {shippingMethod.lockerDetails.address.line2}
                        </p>
                        <p>{shippingMethod.lockerDetails.location_description}</p>
                      </div>
                      <Button onClick={() => setDialogOpen(true)}>Zmień</Button>
                    </div>
                  )}
              </FieldContent>
              <RadioGroupItem value={method.slug} id={method.slug} className="hidden" />
            </Field>
          </FieldLabel>
        ))}
      </RadioGroup>
      <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="sm:max-w-2xl">
          <DialogTitle>Znajdź Paczkomat</DialogTitle>
          <InPostGeowidget
            onPointSelect={(point) => handleShippingpointSelect(point)}
            token={env.NEXT_PUBLIC_INPOST_GEOWIDGET_TOKEN}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
