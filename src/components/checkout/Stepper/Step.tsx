import { cn } from '@/utilities/cn'
import { useMemo } from 'react'
import { FORM_STEP, useFormStep } from '../FormStepProvider'

type StepProps = {
  label: string
  stepKey: FORM_STEP
  index: number
}

export const Step = ({ label, stepKey, index }: StepProps) => {
  const { currentStep, setCurrentStep } = useFormStep()

  const isActive = useMemo(() => {
    return currentStep === stepKey
  }, [currentStep, stepKey])

  return (
    <li
      className={cn('flex gap-2 cursor-pointer', isActive ? ' ' : ' ')}
      onClick={() => setCurrentStep(stepKey)}
    >
      <div className={cn('rounded-full size-6 relative', isActive ? 'border' : 'bg-muted')}>
        <span className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-sm">
          {index + 1}
        </span>
      </div>
      <p>{label}</p>
    </li>
  )
}
