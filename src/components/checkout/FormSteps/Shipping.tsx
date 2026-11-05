import { Price } from '@/components/Price'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from '@/components/ui/field'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { env } from '@/env'
import { usePayments } from '@payloadcms/plugin-ecommerce/client/react'
import { ChevronLeft } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useCallback } from 'react'
import { useCheckoutData } from '../CheckoutDataProvider'
import { FORM_STEP, useFormStep } from '../FormStepProvider'

const InPostGeowidget = dynamic(() => import('../../CategoryTabs/InPostGeowidgetInner'), {
  ssr: false,
})

export const Shipping = () => {
  const {
    shippingData: { shippingMethods, shippingMethod, setShippingMethod },
    setPaymentData,
    personalData: { billingAddress, shippingAddress },
  } = useCheckoutData()
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

    if (!selectedMethod) return
    setShippingMethod(selectedMethod)
  }

  return (
    <div className="space-y-6">
      <h2 className="font-medium text-2xl">Sposób dostawy</h2>
      <RadioGroup
        defaultValue={shippingMethod?.slug}
        onValueChange={(value) => handleDeliveryOptionChange(value)}
      >
        {shippingMethods.map((method) => (
          <FieldLabel htmlFor={method.slug} key={method.id}>
            <Field orientation="horizontal" className="cursor-pointer">
              <FieldContent className="flex-row justify-between">
                <FieldTitle>{method.name}</FieldTitle>
                <FieldDescription>
                  <Price as="span" amount={method.price} />
                </FieldDescription>
              </FieldContent>
              <RadioGroupItem value={method.slug} id={method.slug} className="hidden" />
            </Field>
          </FieldLabel>
        ))}
      </RadioGroup>
      {shippingMethod?.slug === 'paczkomat-inpost' && (
        <InPostGeowidget
          onPointSelect={(point) => console.log(point)}
          token={env.NEXT_PUBLIC_INPOST_GEOWIDGET_TOKEN}
        />
      )}
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
    </div>
  )
}
