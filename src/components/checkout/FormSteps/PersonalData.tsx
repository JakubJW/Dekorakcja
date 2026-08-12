'use client'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/providers/Auth'
import { useCallback } from 'react'
import { FORM_STEP, useFormStep } from '../FormStepProvider'
import { usePaymentData } from '../PaymentDataProvider'
import { BillingAddressSection } from '../PersonalData/BillingAddressSection'
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
  } = usePaymentData()
  const { setCurrentStep } = useFormStep()

  const handleNextStep = useCallback(async () => {
    const [billingData, organizationData] = await Promise.all([
      billingFormRef.current?.submit(),
      buyAsOrganization ? companyFormRef.current?.submit() : Promise.resolve(null),
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
    <div className="space-y-6">
      {!user && <LoginPrompt />}
      {!user && <EmailField />}
      <BillingAddressSection />
      <OrganizationSection />
      {!paymentData && (
        <Button
          className="self-start"
          onClick={async (e) => {
            e.preventDefault()
            await handleNextStep()
          }}
        >
          Przejdź do płatności
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
