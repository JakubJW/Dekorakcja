import { AddressForm } from '@/components/forms/AddressForm'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from '@/components/ui/field'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { usePayments } from '@payloadcms/plugin-ecommerce/client/react'
import { useCallback } from 'react'
import { useCheckoutData } from '../CheckoutDataProvider'
import { FORM_STEP, useFormStep } from '../FormStepProvider'

export const Shipping = () => {
  const {
    shippingData: {
      shippingMethods,
      shippingAddress,
      billingAddressSameAsShipping,
      setBillingAddressSameAsShipping,
      setShippingAddress,
    },
    setPaymentData,
    personalData: { email, billingAddress },
  } = useCheckoutData()
  const { initiatePayment } = usePayments()
  const { setCurrentStep } = useFormStep()

  const handleBillingAddressSameAsShipping = (val: boolean) => {
    setBillingAddressSameAsShipping(val)
    if (!val) return
    setShippingAddress(billingAddress)
  }

  const initiatePaymentIntent = useCallback(
    async (paymentID: string) => {
      try {
        const paymentData = (await initiatePayment(paymentID, {
          additionalData: {
            ...(email ? { customerEmail: email } : {}),
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

        setError(errorMessage)
        toast.error(errorMessage)
      }
    },
    [billingAddress, shippingAddress],
  )

  const handleNextStep = async () => {
    await initiatePaymentIntent('stripe')
    setCurrentStep(FORM_STEP.PAYMENT)
  }

  return (
    <div className="space-y-2">
      <h2 className="font-medium text-2xl">Sposób dostawy</h2>

      <RadioGroup defaultValue={shippingMethods[0].slug} className="max-w-sm">
        {shippingMethods.map((method) => (
          <FieldLabel htmlFor={method.slug} key={method.id}>
            <Field orientation="horizontal">
              <FieldContent className="flex-row justify-between">
                <FieldTitle>{method.name}</FieldTitle>
                <FieldDescription>{method.price}</FieldDescription>
              </FieldContent>
              <RadioGroupItem value={method.slug} id={method.slug} />
            </Field>
          </FieldLabel>
        ))}
      </RadioGroup>
      <Label htmlFor="billingAddressSameAsShipping">
        <Checkbox
          id="billingAddressSameAsShipping"
          onCheckedChange={(val: boolean) => handleBillingAddressSameAsShipping(val)}
          checked={billingAddressSameAsShipping}
        />
        Adres dostawy taki sam, jak adres rozliczeniowy
      </Label>
      <AddressForm initialData={shippingAddress} />
      <Button
        className="self-start"
        onClick={async (e) => {
          e.preventDefault()
          await handleNextStep()
        }}
      >
        Przejdź do płatności
      </Button>
    </div>
  )
}
