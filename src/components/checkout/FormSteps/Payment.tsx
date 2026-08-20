import { CheckoutForm } from '@/components/forms/CheckoutForm'
import { Button } from '@/components/ui/button'
import { cssVariables } from '@/cssVariables'
import { Elements } from '@stripe/react-stripe-js'
import Stripe from 'stripe'
import { useCheckoutData } from '../CheckoutDataProvider'

export const Payment = ({ stripe }: { stripe: Promise<Stripe | null> }) => {
  const {
    error,
    personalData: { email, billingAddress },
    paymentData,
    setProcessingPayment,
    setPaymentData,
  } = useCheckoutData()

  return (
    <div className="pb-16">
      <h2 className="font-medium text-2xl mb-6">Płatność</h2>
      {error && <p>{`Error: ${error}`}</p>}
      <Elements
        stripe={stripe}
        options={{
          clientSecret: paymentData['clientSecret'] as string,
          appearance: {
            theme: 'stripe',
            variables: {
              borderRadius: '10px',
              colorPrimary: '#4a3728',
              gridColumnSpacing: '20px',
              gridRowSpacing: '20px',
              colorBackground: cssVariables.colors.base0,
              colorDanger: cssVariables.colors.error500,
              colorDangerText: cssVariables.colors.error500,
              colorIcon: cssVariables.colors.base1000,
              colorText: cssVariables.colors.base1000,
              colorTextPlaceholder: '#858585',
              fontFamily: 'Montserrat, sans-serif',
              fontSizeBase: '16px',
              fontWeightBold: '600',
              fontWeightNormal: '500',
              spacingUnit: '4px',
            },
          },
        }}
      >
        <div className="flex flex-col gap-8">
          <CheckoutForm
            customerEmail={email}
            billingAddress={billingAddress}
            setProcessingPayment={setProcessingPayment}
          />
          <Button variant="ghost" className="self-start" onClick={() => setPaymentData(null)}>
            Anuluj płatność
          </Button>
        </div>
      </Elements>
    </div>
  )
}
