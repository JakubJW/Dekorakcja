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
import { useCallback, useState } from 'react'

const InPostGeowidget = dynamic(() => import('@/features/checkout/inpost-geowidget'), {
  ssr: false,
})

type ShippingProps = {
  options: ShippingMethod[]
  selectedOption?: number
  lockerDetails?: Locker
  onDeliveryMethodChange: (value: number) => void
  onLockerChange: (value: Locker) => void
}

export type Locker =
  | Pick<InpostPointInterface, 'location_description' | 'address' | 'name'>
  | undefined

export const Shipping = ({
  options,
  selectedOption,
  lockerDetails,
  onDeliveryMethodChange,
  onLockerChange,
}: ShippingProps) => {
  const [dialogOpen, setDialogOpen] = useState(false)

  const isLocker = useCallback(
    (value: number) => {
      const option = options.find((option) => option.id === Number(value))

      if (!option) return undefined

      return option.type === 'locker'
    },
    [options],
  )

  const handleDeliveryOptionChange = (value: number) => {
    onDeliveryMethodChange(value)

    if (isLocker(value) && !lockerDetails && !dialogOpen) {
      setDialogOpen(true)
    }
  }

  const handleShippingPointSelect = (point: InpostPointInterface) => {
    onLockerChange({
      name: point.name,
      address: { line1: point.address.line1, line2: point.address.line2 },
      location_description: point.location_description,
    })

    setDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <h2 className="font-medium text-2xl">Sposób dostawy</h2>
      <RadioGroup
        value={String(selectedOption)}
        onValueChange={(value) => handleDeliveryOptionChange(Number(value))}
      >
        {options.map((option) => (
          <FieldLabel htmlFor={String(option.id)} key={option.id}>
            <Field className="cursor-pointer">
              <FieldContent>
                <div className="flex justify-between">
                  <FieldTitle>
                    <div className="flex items-center gap-4">
                      <div className="min-w-40">
                        <DeliveryIcon name={option.slug} className="h-4" />
                      </div>
                      <span className="whitespace-pre">{option.name}</span>
                    </div>
                  </FieldTitle>
                  <FieldDescription>
                    <Price as="span" amount={option.price} />
                  </FieldDescription>
                </div>
                {option.slug === 'paczkomat-inpost' &&
                  selectedOption === option.id &&
                  lockerDetails && (
                    <div className="mt-2">
                      <div className="mb-4">
                        <p className="text-xs mb-1">{option.name}</p>
                        <p className="font-bold">
                          {lockerDetails?.address?.line1}, {lockerDetails?.address?.line2}
                        </p>
                        <p>{lockerDetails?.location_description}</p>
                      </div>
                      <Button onClick={() => setDialogOpen(true)}>Zmień</Button>
                    </div>
                  )}
              </FieldContent>
              <RadioGroupItem value={String(option.id)} id={String(option.id)} className="hidden" />
            </Field>
          </FieldLabel>
        ))}
      </RadioGroup>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogTitle>Znajdź Paczkomat</DialogTitle>
          <InPostGeowidget
            onPointSelect={(point) => handleShippingPointSelect(point)}
            token={env.NEXT_PUBLIC_INPOST_GEOWIDGET_TOKEN}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
