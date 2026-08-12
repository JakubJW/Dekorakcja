import { CheckoutForm } from '@/components/forms/CheckoutForm'
import { Button } from '@/components/ui/button'
import { cssVariables } from '@/cssVariables'
import { usePayments } from '@payloadcms/plugin-ecommerce/client/react'
import { Elements } from '@stripe/react-stripe-js'
import Stripe from 'stripe'
import { usePaymentData } from '../PaymentDataProvider'

export const Payment = ({ stripe }: { stripe: Promise<Stripe | null> }) => {
  const {
    error,
    personalData: { email, billingAddress },
    paymentData,
    setProcessingPayment,
    setPaymentData,
  } = usePaymentData()
  const { initiatePayment } = usePayments()

  //to powinno zostac wywolane po wyborze metody dostawy i nie musi byc w Providerze - wystarczy ze wezmie dane z Providera
  const initiatePaymentIntent = useCallback(
    async (paymentID: string) => {
      try {
        const paymentData = (await initiatePayment(paymentID, {
          additionalData: {
            ...(email ? { customerEmail: email } : {}),
            billingAddress,
            shippingAddress: billingAddressSameAsShipping ? billingAddress : shippingAddress,
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
    [billingAddress, billingAddressSameAsShipping, shippingAddress],
  )

  return (
    <div className="pb-16">
      <h2 className="font-medium text-3xl">Płatność</h2>
      {error && <p>{`Error: ${error}`}</p>}
      <Elements
        options={{
          appearance: {
            theme: 'stripe',
            variables: {
              borderRadius: '6px',
              colorPrimary: '#858585',
              gridColumnSpacing: '20px',
              gridRowSpacing: '20px',
              colorBackground: cssVariables.colors.base0,
              colorDanger: cssVariables.colors.error500,
              colorDangerText: cssVariables.colors.error500,
              colorIcon: cssVariables.colors.base1000,
              colorText: cssVariables.colors.base1000,
              colorTextPlaceholder: '#858585',
              fontFamily: 'Geist, sans-serif',
              fontSizeBase: '16px',
              fontWeightBold: '600',
              fontWeightNormal: '500',
              spacingUnit: '4px',
            },
          },
          clientSecret: paymentData['clientSecret'] as string,
        }}
        stripe={stripe}
      >
        <div className="flex flex-col gap-8">
          <CheckoutForm
            customerEmail={email}
            billingAddress={billingAddress}
            setProcessingPayment={setProcessingPayment}
          />
          <Button variant="ghost" className="self-start" onClick={() => setPaymentData(null)}>
            Cancel payment
          </Button>
        </div>
      </Elements>
    </div>
  )
}
