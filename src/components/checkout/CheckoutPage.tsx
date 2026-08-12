'use client'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import { loadStripe } from '@stripe/stripe-js'
import Link from 'next/link'
import React, { Suspense } from 'react'
import { CartItems } from './CartItems'
import { FORM_STEP, useFormStep } from './FormStepProvider'
import { Payment } from './FormSteps/Payment'
import { PersonalDataFormStep } from './FormSteps/PersonalData'
import { Shipping } from './FormSteps/Shipping'
import { Summary } from './FormSteps/Summary'
import { usePaymentData } from './PaymentDataProvider'
import { Stepper } from './Stepper/Stepper'

const apiKey = `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`
const stripe = loadStripe(apiKey)

export const CheckoutPage: React.FC = () => {
  const { cart } = useCart()
  const { isProcessingPayment, paymentData } = usePaymentData()
  const { currentStep } = useFormStep()

  const cartIsEmpty = !cart || !cart.items || !cart.items.length

  if (!stripe) return null

  if (cartIsEmpty && isProcessingPayment) {
    return (
      <div className="py-12 w-full items-center justify-center">
        <div className="prose text-center max-w-none self-center mb-8">
          <p>Przetwarzanie płatności...</p>
        </div>
        <LoadingSpinner />
      </div>
    )
  }

  if (cartIsEmpty) {
    return (
      <div className="prose py-12 w-full items-center">
        <p>Twój koszyk jest pusty.</p>
        <Link href="/search">Kontynuuj zakupy</Link>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col">
      <Stepper />
      <div className="border rounded-xl flex flex-col items-stretch justify-stretch my-8 md:flex-row grow gap-10 md:gap-6 lg:gap-8">
        <div className="basis-full lg:basis-2/3 flex flex-col gap-8 justify-stretch p-8">
          {currentStep === FORM_STEP.PERSONAL_DATA && <PersonalDataFormStep />}
          {currentStep === FORM_STEP.SHIPPING && <Shipping />}
          {currentStep === FORM_STEP.PAYMENT && (
            <Suspense fallback={<React.Fragment />}>
              {/* @ts-ignore */}
              {paymentData && paymentData?.['clientSecret'] && <Payment stripe={stripe} />}
            </Suspense>
          )}
          {currentStep === FORM_STEP.SUMMARY && <Summary />}
        </div>
        <CartItems />
      </div>
    </div>
  )
}
