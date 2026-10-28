'use client'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { useAuth } from '@/providers/Auth'
import { useCheckoutData } from '../CheckoutDataProvider'
import { useFormStep } from '../FormStepProvider'
import { BillingAddress } from '../PersonalData/BillingAddress'
import { EmailField } from '../PersonalData/EmailField'
import { LoginPrompt } from '../PersonalData/LoginPrompt'

export const PersonalDataFormStep = () => {
  const { user } = useAuth()
  const { paymentData } = useCheckoutData()
  const { setCurrentStep } = useFormStep()

  if (user === undefined) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-6 flex flex-col">
      {!user && <LoginPrompt />}
      {!user && <EmailField />}
      <BillingAddress />

      {/* {!paymentData?.['clientSecret'] && error && (
        <div className="my-8">
          <Message error={error} />

          <Button
            onClick={(e) => {
              e.preventDefault()
              router.refresh()
            }}
            variant="default"
          >
            Spróbuj ponownie
          </Button>
        </div>
      )} */}
    </div>
  )
}
