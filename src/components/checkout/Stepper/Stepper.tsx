'use client'

import { FORM_STEP, useFormStep } from '../FormStepProvider'
import { Step } from './Step'

const formSteps = [
  {
    label: 'Twoje dane',
    key: FORM_STEP.PERSONAL_DATA,
  },
  {
    label: 'Dostawa',
    key: FORM_STEP.SHIPPING,
  },
  {
    label: 'Płatność',
    key: FORM_STEP.PAYMENT,
  },
  {
    label: 'Podsumowanie',
    key: FORM_STEP.SUMMARY,
  },
] as const

export const Stepper = () => {
  const { currentStep } = useFormStep()

  return (
    <div>
      <ol className="flex w-full justify-between">
        {formSteps.map((step, index) => (
          <Step key={index} label={step.label} stepKey={step.key} index={index} />
        ))}
      </ol>
    </div>
  )
}
