'use client'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/providers/Auth'
import { useCallback } from 'react'
import { useCheckoutData } from '../CheckoutDataProvider'
import { FORM_STEP, useFormStep } from '../FormStepProvider'
import { BillingAddress } from '../PersonalData/BillingAddress'
import { EmailField } from '../PersonalData/EmailField'
import { LoginPrompt } from '../PersonalData/LoginPrompt'
import { OrganizationSection } from '../PersonalData/organization/OrganizationSection'

export const PersonalDataFormStep = () => {
  const { user } = useAuth()
  const {
    paymentData,
    personalData: {
      buyAsOrganization,
      setBillingAddress,
      setOrganizationAddress,
      companyFormRef,
      billingFormRef,
    },
  } = useCheckoutData()
  const { setCurrentStep } = useFormStep()

  const handleNextStep = useCallback(async () => {
    const [billingData, organizationData] = await Promise.all([
      billingFormRef.current?.submit(),
      buyAsOrganization ? companyFormRef.current?.submit() : Promise.resolve(undefined),
    ])

    if (!billingData || (buyAsOrganization && !organizationData)) {
      return
    }

    setBillingAddress(billingData)
    setOrganizationAddress(organizationData)
    setCurrentStep(FORM_STEP.SHIPPING)
  }, [
    buyAsOrganization,
    setBillingAddress,
    setOrganizationAddress,
    setCurrentStep,
    billingFormRef,
    companyFormRef,
  ])

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
      <OrganizationSection />
      {!paymentData && (
        <Button
          className="self-end"
          onClick={async (e) => {
            e.preventDefault()
            await handleNextStep()
          }}
        >
          Przejdź do dostawy
        </Button>
      )}
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
