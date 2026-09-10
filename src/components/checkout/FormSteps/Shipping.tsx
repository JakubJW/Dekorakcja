import { CreateAddressForm } from '@/components/forms/AddressForm/CreateAddressForm'
import { UpdateAddressForm } from '@/components/forms/AddressForm/UpdateAddressForm'
import { Price } from '@/components/Price'
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
import { ChevronLeft } from 'lucide-react'
import { useCallback } from 'react'
import { useCheckoutData } from '../CheckoutDataProvider'
import { FORM_STEP, useFormStep } from '../FormStepProvider'

export const Shipping = () => {
  const {
    shippingData: {
      shippingMethods,
      shippingMethod,
      setShippingMethod,
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

  const handleBillingAddressSameAsShipping = (value: boolean) => {
    setBillingAddressSameAsShipping(value)
    if (!value) return
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
    //tutaj prawdopodobnie wolasz funkcje z providera, ktora ustawi w kontekscie checkoutu wybrana metode dostawy
    //nastepnie z providera zostanie pobrana ta wartosc i powinna sie zaktualizowac cena
    //potem metoda dostawy powinna zostac wpierdolona do ordera w bazie danych i w matadanych payment intenta w stripe
    //nie wiem tylko w jakiej formie to przechowac - czy tak samo jak adresy czyli zdenormalizowane wartosci w kolumnach
    //czy jako jsonb czy jako chuj wie co, foreign key (raczej lipa bo metody dostawy moga sie zmieniac a to powinien byc snapshot ku pamieci)

    //juz widze ze jest lipa, bo w tabeli zamowien jest kolumna subtotal, ktora bierze sie pewnie z koszyka, a my wkoszyku nie mamy
    //zapisanej opcji delivery
    //ale w sumie jak masz historie zamowien, to kwota zamowienia jest z wysylka, czy to suma czesciowa i dostawa jest liczona osobno?
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
      <Label htmlFor="billingAddressSameAsShipping">
        <Checkbox
          id="billingAddressSameAsShipping"
          onCheckedChange={(val: boolean) => handleBillingAddressSameAsShipping(val)}
          checked={billingAddressSameAsShipping}
        />
        Adres dostawy taki sam, jak adres rozliczeniowy
      </Label>
      <h2 className="font-medium text-2xl">Adres dostawy</h2>
      {shippingAddress ? (
        <UpdateAddressForm initialData={shippingAddress} />
      ) : (
        <CreateAddressForm />
      )}
      <div className="flex justify-between">
        <Button variant="link" size="clear" onClick={() => setCurrentStep(FORM_STEP.PERSONAL_DATA)}>
          <ChevronLeft /> Poprzedni krok
        </Button>
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
    </div>
  )
}
