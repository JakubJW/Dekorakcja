import { CheckoutForm } from '@/components/forms/CheckoutForm'
import { cssVariables } from '@/cssVariables'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useCheckoutData } from '../CheckoutDataProvider'
import { useFormStep } from '../FormStepProvider'

const apiKey = `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`
const stripe = loadStripe(apiKey)

export const Payment = () => {
  const { setCurrentStep } = useFormStep()
  const {
    personalData: { email, billingAddress },
    paymentData,
    setProcessingPayment,
    setPaymentData,
  } = useCheckoutData()

  if (!stripe || !paymentData) return <div></div>

  return (
    <div className="pb-16">
      <h2 className="font-medium text-2xl mb-6">Płatność</h2>
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
        </div>
      </Elements>
    </div>
  )
}
