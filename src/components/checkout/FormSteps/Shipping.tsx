import { Price } from '@/components/Price'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
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
import { usePayments } from '@payloadcms/plugin-ecommerce/client/react'
import { ChevronLeft } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useCallback, useState } from 'react'
import { useCheckoutData } from '../CheckoutDataProvider'
import { FORM_STEP, useFormStep } from '../FormStepProvider'

const InPostGeowidget = dynamic(() => import('@/features/checkout/inpost-geowidget'), {
  ssr: false,
})

export const Shipping = () => {
  const {
    shippingData: { shippingMethods, shippingMethod, setShippingMethod },
    setPaymentData,
    personalData: { billingAddress, shippingAddress },
  } = useCheckoutData()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedLocker, setSelectedLocker] = useState<
    Pick<InpostPointInterface, 'location_description' | 'address' | 'name'> | undefined
  >(undefined)
  const { initiatePayment } = usePayments()
  const { setCurrentStep } = useFormStep()

  const initiatePaymentIntent = useCallback(
    async (paymentID: string) => {
      try {
        const paymentData = (await initiatePayment(paymentID, {
          additionalData: {
            billingAddress,
            shippingAddress,
            currency: 'PLN',
          },
        })) as Record<string, unknown>

        if (paymentData) {
          setPaymentData(paymentData)
        }
      } catch (error) {
        const errorData = error instanceof Error ? JSON.parse(error.message) : {}
        let errorMessage = 'An error occurred while initiating payment.'

        if (errorData?.cause?.code === 'OutOfStock') {
          errorMessage = 'One or more items in your cart are out of stock.'
        }

        // setError(errorMessage)
        // toast.error(errorMessage)
      }
    },
    [billingAddress, shippingAddress],
  )

  const handleNextStep = async () => {
    await initiatePaymentIntent('stripe')
    setCurrentStep(FORM_STEP.PAYMENT)
  }

  const handleDeliveryOptionChange = (value: string) => {
    const selectedMethod = shippingMethods.find((method) => method.slug === value)

    if (!selectedMethod) {
      setShippingMethod(undefined)
      return
    }

    setShippingMethod(selectedMethod)

    if (selectedMethod.slug === 'paczkomat-inpost' && !dialogOpen) {
      setDialogOpen(true)
    }
  }

  const handleDialogOpenChange = (state: boolean) => {
    setDialogOpen(state)

    if (!state && shippingMethod?.slug === 'paczkomat-inpost' && !selectedLocker) {
      setShippingMethod(undefined)
    }
  }

  const handleShippingpointSelect = (point: InpostPointInterface) => {
    setSelectedLocker((prev) => ({
      ...prev,
      name: point.name,
      address: { line1: point.address.line1, line2: point.address.line2 },
      location_description: point.location_description,
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
        {shippingMethods.map((method) => (
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
                  selectedLocker !== undefined &&
                  shippingMethod &&
                  shippingMethod?.slug === 'paczkomat-inpost' && (
                    <div className="mt-2">
                      <div className="mb-4">
                        <p className="text-xs mb-1">{selectedLocker?.name}</p>
                        <p className="font-bold">
                          {selectedLocker?.address.line1}, {selectedLocker.address.line2}
                        </p>
                        <p>{selectedLocker.location_description}</p>
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
      <div className="flex justify-between">
        <Button variant="link" size="clear" onClick={() => setCurrentStep(FORM_STEP.PERSONAL_DATA)}>
          <ChevronLeft /> Poprzedni krok
        </Button>
        <Button
          disabled={!shippingMethod}
          className="self-start"
          onClick={async (e) => {
            e.preventDefault()
            await handleNextStep()
          }}
        >
          Przejdź do płatności
        </Button>
      </div>
      <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="sm:max-w-2xl">
          <DialogTitle>Znajdź Paczkomat</DialogTitle>
          <DialogDescription></DialogDescription>
          <InPostGeowidget
            onPointSelect={(point) => handleShippingpointSelect(point)}
            token={env.NEXT_PUBLIC_INPOST_GEOWIDGET_TOKEN}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
