'use client'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import Link from 'next/link'
import React from 'react'
import { CartItems } from './CartItems'
import { useCheckoutData } from './CheckoutDataProvider'
import { useFormStep } from './FormStepProvider'
import { Stepper, STEPS } from './Stepper/Stepper'

export const CheckoutPage: React.FC = () => {
  const { cart } = useCart()
  const { isProcessingPayment, paymentData } = useCheckoutData()
  const { currentStep } = useFormStep()

  const cartIsEmpty = !cart || !cart.items || !cart.items.length

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

  const CurrentStep = STEPS[currentStep].component

  return (
    <div className="w-full flex flex-col">
      <Stepper />
      <div className="border rounded-xl flex flex-col items-stretch justify-stretch my-8 md:flex-row grow">
        <div className="basis-full lg:basis-2/3 p-8">
          <CurrentStep />
        </div>
        <CartItems />
      </div>
    </div>
  )
}
