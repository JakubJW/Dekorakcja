import { FORM_STEP } from '../FormStepProvider'
import { Payment } from '../FormSteps/Payment'
import { PersonalDataFormStep } from '../FormSteps/PersonalData'
import { Shipping } from '../FormSteps/Shipping'
import { Step } from './Step'

interface StepConfig {
  component: React.ComponentType
  label: string
}

export const STEP_ORDER: FORM_STEP[] = [
  FORM_STEP.PERSONAL_DATA,
  FORM_STEP.SHIPPING,
  FORM_STEP.PAYMENT,
]

export const STEPS: Record<FORM_STEP, StepConfig> = {
  [FORM_STEP.PERSONAL_DATA]: { component: PersonalDataFormStep, label: 'Dane osobowe' },
  [FORM_STEP.SHIPPING]: { component: Shipping, label: 'Dostawa' },
  [FORM_STEP.PAYMENT]: { component: Payment, label: 'Płatność' },
}

export const Stepper = () => {
  return (
    <ol className="flex w-full my-8 justify-between">
      {STEP_ORDER.map((step, index) => (
        <Step key={index} label={STEPS[step].label} stepKey={step} index={index} />
      ))}
    </ol>
  )
}
